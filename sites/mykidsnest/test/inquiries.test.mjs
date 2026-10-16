import test from 'node:test';
import assert from 'node:assert/strict';
import { handleInquiry,validate,enabled,purgeExpired,POLICY_VERSION } from '../src/inquiries.js';
import worker from '../src/worker.js';
import { database } from './d1-fixture.mjs';
const SECRET='local-test-only-key-never-deploy-0123456789';
function env(){return {LEADS_DB:database(),LEAD_COLLECTION_ENABLED:'true',LEAD_POLICY_APPROVED:POLICY_VERSION,LEAD_RETENTION_READY:'true',LEAD_HASH_SECRET:SECRET};}
async function token(secret=SECRET,age=5){const stamp=Math.floor(Date.now()/1000)-age;const val=stamp+'.'+crypto.randomUUID();const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const digest=[...new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode('form:'+val)))].map(n=>n.toString(16).padStart(2,'0')).join('');return val+'.'+digest;}
async function payload(extra={}){return {name:'Example Adult',email:'adult@example.invalid',world:'space',type:'custom',width:'',length:'',unit:'cm',preference:'unsure',consent:true,policyVersion:POLICY_VERSION,requestId:crypto.randomUUID(),token:await token(),website:'',source:'pinterest',campaign:'test_campaign',content:'test_content',...extra};}
function request(body,headers={},method='POST'){return new Request('https://mykidsnest.com/api/inquiries',{method,headers:{Origin:'https://mykidsnest.com','Content-Type':'application/json','CF-Connecting-IP':'192.0.2.42',...headers},...(method==='GET'?{}:{body:typeof body==='string'?body:JSON.stringify(body)})});}
const count=e=>e.LEADS_DB.sqlite.prepare('SELECT count(*) AS n FROM inquiries').get().n;
test('collection stays closed unless every release switch, DB, secret and policy is ready',async()=>{
 const e=env();for(const patch of [{LEAD_COLLECTION_ENABLED:'false'},{LEAD_POLICY_APPROVED:'old'},{LEAD_RETENTION_READY:'false'},{LEADS_DB:null},{LEAD_HASH_SECRET:'short'}]){const candidate={...e,...patch};assert.ok(!enabled(candidate));const res=await handleInquiry(request(await payload()),candidate);assert.equal(res.status,503);}assert.equal(count(e),0);
});
test('availability never exposes contacts, and signed challenges expire or reject early/forged attempts',async()=>{
 const e=env();const status=await handleInquiry(new Request('https://mykidsnest.com/api/inquiry-token'),e);const body=await status.json();assert.equal(body.enabled,true);assert.ok(body.token);assert.equal(status.headers.get('Cache-Control'),'no-store');
 for(const bad of [await token(SECRET,0),await token(SECRET,7201),await token('incorrect-secret'),body.token+'bad'])assert.equal((await handleInquiry(request(await payload({token:bad})),e)).status,400);
 assert.equal(count(e),0);
});
test('valid adult inquiry persists exactly once with consent, expiry and attribution',async()=>{
 const e=env(),p=await payload();const response=await worker.fetch(request(p),e);assert.equal(response.status,201);assert.equal(response.headers.get('Cache-Control'),'no-store');const result=await response.json();assert.equal(result.ok,true);assert.equal(result.duplicate,false);assert.deepEqual(Object.keys(result).sort(),['duplicate','ok','reference']);
 const row=e.LEADS_DB.sqlite.prepare('SELECT * FROM inquiries').get();assert.equal(row.id,result.reference);assert.equal(row.email,p.email);assert.equal(row.consent_version,POLICY_VERSION);assert.equal(row.expires_at-row.created_at,30*86400);assert.equal(row.source,'pinterest');assert.ok(!JSON.stringify(row).includes('192.0.2.42'));assert.equal(count(e),1);
});
test('duplicate same key or fresh key/same content returns original reference; altered content conflicts',async()=>{
 const e=env(),p=await payload();const first=await (await handleInquiry(request(p),e)).json();
 for(const repeat of [p,{...p,requestId:crypto.randomUUID()}]){const res=await handleInquiry(request(repeat),e);assert.equal(res.status,200);const r=await res.json();assert.equal(r.reference,first.reference);assert.equal(r.duplicate,true);}
 assert.equal((await handleInquiry(request({...p,world:'ocean'}),e)).status,409);assert.equal(count(e),1);
});
test('unknown and child/sensitive/free-text fields are rejected before persistence',async()=>{
 for(const key of ['child_name','birthdate','photo','medical','story','preferences','message']){const e=env();assert.equal((await handleInquiry(request(await payload({[key]:'not allowed'})),e)).status,400);assert.equal(count(e),0);}
});
test('consent and current policy are mandatory, not coerced from strings',async()=>{
 for(const patch of [{consent:false},{consent:'true'},{policyVersion:'old'}]){const e=env();assert.equal((await handleInquiry(request(await payload(patch)),e)).status,400);assert.equal(count(e),0);}
});
test('bounded enums, name/email syntax and paired dimensions reject invalid input',async()=>{
 const p=await payload();for(const patch of [{name:'<script>'},{name:'a'.repeat(81)},{email:'bad'},{email:'a\nb@example.invalid'},{world:'other'},{type:'payment'},{preference:'free text'},{width:100,length:''},{width:0,length:100},{width:3001,length:100},{source:'fake'},{campaign:'https://x.example/'},{content:'email@example.invalid'},{website:'spam'}])assert.ok(validate({...p,...patch}),JSON.stringify(patch));
 assert.equal(validate({...p,width:250,length:320}),null);assert.equal(validate({...p,unit:'in',width:100,length:200}),null);
});
test('cross-origin, wrong content type, non-POST and public reads cannot access leads',async()=>{
 const e=env(),p=await payload();for(const [headers,status] of [[{Origin:'https://other.example'},403],[{'Content-Type':'text/plain'},415],[{'Sec-Fetch-Site':'cross-site'},403]])assert.equal((await handleInquiry(request(p,headers),e)).status,status);
 assert.equal((await handleInquiry(request(null,{},'GET'),e)).status,405);assert.equal((await worker.fetch(new Request('https://mykidsnest.com/api/inquiries/export'),e)).status,404);assert.equal(count(e),0);
});
test('malformed JSON, unexpected JSON shape and oversized body fail without saving',async()=>{
 for(const body of ['{bad','[]','null','x'.repeat(4097)]){const e=env();const response=await handleInquiry(request(body),e);assert.equal(response.status,body.length>4096?413:400);assert.equal(count(e),0);}
});
test('spam counter is bounded and stores only a keyed opaque network bucket',async()=>{
 const e=env(),p=await payload();for(let i=0;i<8;i++)assert.ok((await handleInquiry(request(p),e)).status<400);
 assert.equal((await handleInquiry(request(p),e)).status,429);const row=e.LEADS_DB.sqlite.prepare('SELECT * FROM inquiry_limits').get();assert.match(row.key,/^[a-f0-9]{64}$/);assert.equal(count(e),1);
});
test('database failure returns honest failure with no PII in log or public response',async t=>{
 const errors=[];t.mock.method(console,'error',(...args)=>errors.push(args.join(' ')));const e=env();e.LEADS_DB.prepare=()=>{throw new Error('private information must not leak');};const response=await handleInquiry(request(await payload()),e);assert.equal(response.status,503);assert.doesNotMatch(JSON.stringify(await response.json()),/private information|Example Adult|adult@/);assert.deepEqual(errors,['MKN_INQUIRY_STORAGE_FAILURE']);
});
test('retention deletes expired leads and rate buckets but keeps current inquiry',async()=>{
 const e=env();await handleInquiry(request(await payload()),e);e.LEADS_DB.sqlite.exec("INSERT INTO inquiry_limits VALUES ('expired',1,0); UPDATE inquiries SET expires_at=0");await purgeExpired(e);assert.equal(count(e),0);assert.equal(e.LEADS_DB.sqlite.prepare("SELECT count(*) AS n FROM inquiry_limits WHERE key='expired'").get().n,0);
 await handleInquiry(request(await payload({email:'second@example.invalid'})),e);await purgeExpired(e);assert.equal(count(e),1);
});
