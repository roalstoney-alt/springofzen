import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import worker from '../src/worker.js';
import original from './fixtures/original-worker.mjs';
const root=path.resolve(import.meta.dirname,'..');const publicRoot=path.join(root,'public');
const assets={ASSETS:{async fetch(request){const url=new URL(request.url);if(url.pathname==='/404/')return new Response('Original branded 404',{status:200,headers:{'Content-Type':'text/html'}});if(url.pathname.includes('missing'))return new Response('missing',{status:404});return new Response('unchanged asset',{headers:{'Content-Type':url.pathname.endsWith('.js')?'application/javascript':'text/html'}});}}};
test('all 36 original world/shared runtime, style and media assets are byte-identical',()=>{
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'test/baseline-assets.json')));assert.equal(Object.keys(manifest.sha256).length,36);
 for(const [name,hash] of Object.entries(manifest.sha256))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(publicRoot,name))).digest('hex'),hash,name);
});
test('no tracked or added changes exist outside MyKidsNest source/docs',()=>{
 const repo=path.resolve(root,'../..');const files=execFileSync('git',['status','--porcelain=v1','-z','--untracked-files=all'],{cwd:repo,encoding:'utf8'}).split('\0').filter(Boolean).map(x=>x.slice(3));
 for(const name of files)assert.ok(name.startsWith('sites/mykidsnest/')||name.startsWith('docs/mykidsnest/'),name);
});
test('original routes, aliases, www redirects, query strings, methods and 404 remain equivalent',async()=>{
 for(const [route,method] of [['/','GET'],['/ocean/','GET'],['/space/','HEAD'],['/forest/','GET'],['/ocean?x=1','GET'],['/ocean-room/?x=1','GET'],['/space-room?x=2','GET'],['/forest-room/','GET'],['/missing-page','GET'],['/ocean/','POST'],['/assets/space/space.js','GET']]){
  for(const host of ['mykidsnest.com','www.mykidsnest.com']){
   const request=new Request('https://'+host+route,{method});const before=await original.fetch(request,assets),after=await worker.fetch(request,assets);
   assert.equal(after.status,before.status,host+route);assert.equal(after.headers.get('Location'),before.headers.get('Location'));assert.equal(after.headers.get('Cache-Control'),before.headers.get('Cache-Control'));assert.equal(await after.text(),await before.text());
   for(const header of ['X-Frame-Options','Referrer-Policy','Permissions-Policy','X-Content-Type-Options','Vary'])assert.equal(after.headers.get(header),before.headers.get(header));
   const expected=before.headers.get('Content-Security-Policy')?.replace("form-action 'none'","form-action 'self'")||null;assert.equal(after.headers.get('Content-Security-Policy'),expected);
  }
 }
});
test('all public documents keep same-origin metadata, no remote runtime references or commerce schema',()=>{
 const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(x=>x.isDirectory()?walk(path.join(dir,x.name)):[path.join(dir,x.name)]);
 for(const file of walk(publicRoot).filter(f=>/\.(html|css|js)$/.test(f))){const source=fs.readFileSync(file,'utf8');assert.doesNotMatch(source,/springofzen\.com|<iframe|@import\s+url\(https?:/i,file);
  for(const match of source.matchAll(/(?:src|href)="(https?:[^"\s]+)"/g))assert.equal(new URL(match[1]).hostname,'mykidsnest.com',file);
  if(file.endsWith('.html')&&!file.includes('/404/'))assert.match(source,/<link rel="canonical" href="https:\/\/mykidsnest\.com\//);
 }
});
test('parent controls are separate additions, with adult consent and no free-text child input',()=>{
 for(const name of ['index.html','ocean/index.html','space/index.html','forest/index.html']){
  const html=fs.readFileSync(path.join(publicRoot,name),'utf8');assert.match(html,/mkn-parent-section/);assert.match(html,/Request a Digital Room Design/);assert.match(html,/property="og:image"/);assert.ok(html.indexOf('mkn-parent-section')>html.indexOf('data-carousel')||name!=='index.html');
  if(name==='index.html')assert.ok(html.indexOf('</main>')<html.indexOf('mkn-parent-section'));
 }
 const form=fs.readFileSync(path.join(publicRoot,'request/index.html'),'utf8');assert.match(form,/<fieldset disabled>/);assert.match(form,/type="checkbox" value="yes" required/);assert.doesNotMatch(form,/<textarea|type="file"|name="child/i);assert.match(form,/noindex,follow/);
 assert.match(form,/<option value="ocean">Ocean<\/option>/);
 const client=fs.readFileSync(path.join(publicRoot,'assets/shared/parents-v04.js'),'utf8');assert.match(client,/response.ok/);assert.match(client,/result.reference/);assert.match(client,/offline/);assert.match(client,/AbortSignal.timeout/);assert.match(client,/form.dataset.saved/);
 const css=fs.readFileSync(path.join(publicRoot,'assets/shared/parents-v04.css'),'utf8');assert.match(css,/prefers-reduced-motion/);assert.match(css,/@media\(max-width:600px\)/);assert.match(css,/overflow-y:auto/);assert.match(css,/\[hidden\]\{display:none!important\}/);
});
test('trust, routing and sitemap entries exist; private endpoints stay no-store and non-indexable',async()=>{
 for(const slug of ['parents','request','about','contact','privacy','safety','faq','terms']){
  assert.ok(fs.existsSync(path.join(publicRoot,slug,'index.html')));const response=await worker.fetch(new Request('https://mykidsnest.com/'+slug),assets);assert.equal(response.status,308);assert.equal(response.headers.get('Location'),'https://mykidsnest.com/'+slug+'/');
 }
 const sitemap=fs.readFileSync(path.join(publicRoot,'sitemap.xml'),'utf8');assert.match(sitemap,/https:\/\/mykidsnest.com\/parents\//);assert.doesNotMatch(sitemap,/\/request\//);
 const response=await worker.fetch(new Request('https://mykidsnest.com/api/inquiry-token'),{});assert.equal(response.status,503);assert.equal(response.headers.get('Cache-Control'),'no-store');assert.equal(response.headers.get('X-Robots-Tag'),'noindex');
});
