import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtempSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {once} from 'node:events';
import {DatabaseSync} from 'node:sqlite';
test('local HTTP adapter: routes, challenge, consented persistence, duplicate and cleanup',async t=>{
 const tmp=mkdtempSync(path.join(tmpdir(),'mkn-inquiry-test-'));const file=path.join(tmp,'synthetic.sqlite');const port=8788;
 const child=spawn(process.execPath,[path.join(import.meta.dirname,'preview-server.mjs')],{env:{...process.env,MKN_LOCAL_TEST_LEADS:'1',MKN_LOCAL_TEST_DB:file,MKN_LOCAL_PORT:String(port)},stdio:['ignore','pipe','pipe']});
 t.after(()=>{child.kill();rmSync(tmp,{recursive:true,force:true});});
 await Promise.race([once(child.stdout,'data'),once(child,'exit').then(()=>{throw new Error('Review adapter exited early');}),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Review adapter startup timeout')),5000).unref())]);
 const base='http://127.0.0.1:'+port;
 for(const route of ['/','/ocean/','/space/','/forest/','/parents/','/request/','/privacy/','/terms/']){const res=await fetch(base+route);assert.equal(res.status,200,route);assert.ok(res.headers.get('Content-Security-Policy'));}
 const alias=await fetch(base+'/forest-room/?x=1',{redirect:'manual'});assert.equal(alias.status,301);assert.equal(alias.headers.get('Location'),base+'/forest/?x=1');
 const missing=await fetch(base+'/missing-review-page');assert.equal(missing.status,404);assert.match(await missing.text(),/MyKidsNest/);
 const challenge=await(await fetch(base+'/api/inquiry-token')).json();assert.equal(challenge.enabled,true);
 await new Promise(resolve=>setTimeout(resolve,2200));
 const body={name:'Synthetic Adult',email:'synthetic@example.invalid',world:'forest',type:'question',width:'',length:'',unit:'cm',preference:'unsure',consent:true,policyVersion:challenge.policyVersion,requestId:crypto.randomUUID(),token:challenge.token,website:''};
 const post=p=>fetch(base+'/api/inquiries',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify(p)});
 const first=await post(body);assert.equal(first.status,201);const receipt=await first.json();assert.ok(receipt.reference);
 const duplicate=await post(body);assert.equal(duplicate.status,200);assert.equal((await duplicate.json()).reference,receipt.reference);
 assert.equal((await post({...body,child_name:'not permitted'})).status,400);
 assert.equal((await post({...body,consent:false})).status,400);
 const db=new DatabaseSync(file);const row=db.prepare('SELECT id,email,consent_version FROM inquiries').get();assert.equal(row.id,receipt.reference);assert.equal(row.email,'synthetic@example.invalid');assert.equal(db.prepare('SELECT count(*) AS n FROM inquiries').get().n,1);
 db.prepare('DELETE FROM inquiries WHERE id=?').run(receipt.reference);assert.equal(db.prepare('SELECT count(*) AS n FROM inquiries').get().n,0);db.close();
});
