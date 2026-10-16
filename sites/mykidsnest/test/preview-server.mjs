// Local-only review adapter. This is not a Cloudflare runtime or deployment.
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import worker from '../src/worker.js';
import {database} from './d1-fixture.mjs';
const root=path.resolve(import.meta.dirname,'../public');
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript','.json':'application/json','.xml':'application/xml','.txt':'text/plain','.jpg':'image/jpeg','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml'};
const env={ASSETS:{async fetch(request){let pathname=new URL(request.url).pathname;let file=path.resolve(root,'.'+decodeURIComponent(pathname));if(!file.startsWith(root+path.sep)&&file!==root)return new Response('Not found',{status:404});if(pathname.endsWith('/'))file=path.join(file,'index.html');try{const bytes=await fs.readFile(file);return new Response(request.method==='HEAD'?null:bytes,{headers:{'Content-Type':mime[path.extname(file)]||'application/octet-stream'}});}catch{return new Response('Not found',{status:404});}}}};
if(process.env.MKN_LOCAL_TEST_LEADS==='1')Object.assign(env,{LEADS_DB:database(process.env.MKN_LOCAL_TEST_DB||':memory:'),LEAD_COLLECTION_ENABLED:'true',LEAD_POLICY_APPROVED:'2026-10-16-v1',LEAD_RETENTION_READY:'true',LEAD_HASH_SECRET:'local-test-only-key-never-deploy-0123456789'});
const port=Number(process.env.MKN_LOCAL_PORT||8787);
const server=http.createServer(async(req,res)=>{try{let chunks=[],size=0;for await(const chunk of req){size+=chunk.length;if(size>6000){res.writeHead(413);res.end('Too large');return;}chunks.push(chunk);}const body=Buffer.concat(chunks);const request=new Request('http://127.0.0.1:'+port+req.url,{method:req.method,headers:req.headers,...(!['GET','HEAD'].includes(req.method)?{body,duplex:'half'}:{})});const response=await worker.fetch(request,env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch{res.writeHead(500);res.end('Local review server error');}});
server.listen(port,'127.0.0.1',()=>console.log('Local review adapter ready: http://127.0.0.1:8787 (synthetic test data only)'));
