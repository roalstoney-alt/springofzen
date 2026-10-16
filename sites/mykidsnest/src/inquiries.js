// Adult inquiry collection only. Disabled until the owner approves policy and storage.
export const POLICY_VERSION = '2026-10-16-v1';
const LIMIT_BYTES = 4096;
const DAY = 86400;
const FIELDS = new Set(['name','email','world','type','width','length','unit','preference','consent','policyVersion','requestId','token','website','source','campaign','content']);
const pick = (value, values) => typeof value === 'string' && values.includes(value);
const json = (body,status=200,extra={}) => Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Robots-Tag':'noindex','X-Content-Type-Options':'nosniff',...extra}});
export function enabled(env) {
  return env.LEAD_COLLECTION_ENABLED === 'true' && env.LEAD_POLICY_APPROVED === POLICY_VERSION && env.LEAD_RETENTION_READY === 'true' && env.LEADS_DB && typeof env.LEAD_HASH_SECRET === 'string' && env.LEAD_HASH_SECRET.length >= 32;
}
export function validate(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(k=>!FIELDS.has(k))) return 'Unsupported information. Use only the fields shown.';
  if (typeof input.name !== 'string' || !/^[\p{L}\p{M}\p{N} .'-]{2,80}$/u.test(input.name.trim())) return 'Enter a preferred adult contact name (2–80 characters).';
  if (typeof input.email !== 'string' || input.email.length>254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(input.email)) return 'Enter a valid email address.';
  if (!pick(input.world,['ocean','space','forest','undecided'])) return 'Choose a world.';
  if (!pick(input.type,['premade','custom','question','privacy'])) return 'Choose an inquiry type.';
  if (!pick(input.preference,['unsure','soft-neutral','blue','green','warm-earth'])) return 'Choose a color direction.';
  if (input.consent !== true || input.policyVersion !== POLICY_VERSION) return 'Adult consent to the current privacy notice is required.';
  if (input.website !== undefined && input.website !== '') return 'Submission could not be accepted.';
  if (typeof input.requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(input.requestId)) return 'Refresh this form before submitting.';
  const hasWidth=input.width!=='' && input.width!==undefined;
  const hasLength=input.length!=='' && input.length!==undefined;
  if (hasWidth!==hasLength || !pick(input.unit,['cm','in'])) return 'Provide both room dimensions or leave both blank.';
  if (hasWidth && [input.width,input.length].some(n=>typeof n!=='number' || !Number.isFinite(n) || n<20 || n>(input.unit==='cm'?3000:1200))) return 'Check the room dimensions.';
  if (input.source!==undefined && !pick(input.source,['pinterest','tiktok','instagram','direct','unknown'])) return 'Invalid campaign source.';
  for (const key of ['campaign','content']) if (input[key]!==undefined && (typeof input[key]!=='string' || !/^[a-zA-Z0-9_-]{0,80}$/.test(input[key]))) return 'Invalid campaign reference.';
  return null;
}
async function mac(secret,value) {
  const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
  return [...new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value)))].map(n=>n.toString(16).padStart(2,'0')).join('');
}
function equal(a,b) { if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0; }
async function challenge(env,now) {
  const value=`${now}.${crypto.randomUUID()}`;
  return `${value}.${await mac(env.LEAD_HASH_SECRET,'form:'+value)}`;
}
async function validToken(token,env,now) {
  if(typeof token!=='string'||token.length>180)return false;
  const pieces=token.split('.');if(pieces.length!==3)return false;
  const stamp=Number(pieces[0]);if(!Number.isSafeInteger(stamp)||now-stamp<2||now-stamp>7200)return false;
  return equal(pieces[2],await mac(env.LEAD_HASH_SECRET,'form:'+pieces[0]+'.'+pieces[1]));
}
async function readBody(request) {
  if (Number(request.headers.get('Content-Length')||0)>LIMIT_BYTES) throw new Error('too_large');
  if(!request.body)throw new Error('invalid');
  const reader=request.body.getReader();const chunks=[];let size=0;
  for(;;){const {value,done}=await reader.read();if(done)break;size+=value.byteLength;if(size>LIMIT_BYTES){await reader.cancel();throw new Error('too_large');}chunks.push(value);}
  const bytes=new Uint8Array(size);let at=0;for(const chunk of chunks){bytes.set(chunk,at);at+=chunk.length;}
  return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
}
export async function purgeExpired(env,now=Math.floor(Date.now()/1000)) {
  if(!env.LEADS_DB)return;
  await env.LEADS_DB.batch([
    env.LEADS_DB.prepare('DELETE FROM inquiries WHERE expires_at <= ?').bind(now),
    env.LEADS_DB.prepare('DELETE FROM inquiry_limits WHERE expires_at <= ?').bind(now)
  ]);
}
export async function handleInquiry(request,env) {
  const url=new URL(request.url);const now=Math.floor(Date.now()/1000);
  if(url.pathname==='/api/inquiry-token'){
    if(request.method!=='GET')return json({ok:false,error:'Method not allowed.'},405,{Allow:'GET'});
    if(!enabled(env))return json({enabled:false,policyVersion:POLICY_VERSION},503);
    return json({enabled:true,policyVersion:POLICY_VERSION,token:await challenge(env,now)});
  }
  if(url.pathname!=='/api/inquiries')return json({ok:false,error:'Not found.'},404);
  if(request.method!=='POST')return json({ok:false,error:'Method not allowed.'},405,{Allow:'POST'});
  if(!enabled(env))return json({ok:false,error:'Online inquiries are not available yet. Nothing has been saved.'},503);
  if(request.headers.get('Origin')!==url.origin || request.headers.get('Sec-Fetch-Site')==='cross-site')return json({ok:false,error:'Submit from the MyKidsNest inquiry page.'},403);
  if(!/^application\/json(?:\s*;|$)/i.test(request.headers.get('Content-Type')||''))return json({ok:false,error:'JSON required.'},415);
  try {
    await purgeExpired(env,now);
    // Short-lived keyed IP bucket for spam control. Never store the raw IP or log the body.
    const bucket=Math.floor(now/3600);
    const rateKey=await mac(env.LEAD_HASH_SECRET,`rate:${bucket}:${request.headers.get('CF-Connecting-IP')||'unknown'}`);
    const rate=await env.LEADS_DB.prepare('INSERT INTO inquiry_limits (key, hits, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET hits=hits+1 RETURNING hits').bind(rateKey,(bucket+2)*3600).first();
    if(rate.hits>8)return json({ok:false,error:'Too many attempts. Please try again later.'},429,{'Retry-After':'3600'});
    let input;try{input=await readBody(request);}catch(error){return json({ok:false,error:error.message==='too_large'?'Submission is too large.':'Check the form and try again.'},error.message==='too_large'?413:400);}
    const invalid=validate(input);if(invalid)return json({ok:false,error:invalid},400);
    if(!await validToken(input.token,env,now))return json({ok:false,error:'Please refresh the form, wait a moment, and try again.'},400);
    const clean={name:input.name.trim(),email:input.email.toLowerCase(),world:input.world,type:input.type,width:input.width===''||input.width===undefined?null:input.width,length:input.length===''||input.length===undefined?null:input.length,unit:input.unit,preference:input.preference,source:input.source||'unknown',campaign:input.campaign||'',content:input.content||''};
    const payloadHash=await mac(env.LEAD_HASH_SECRET,'payload:'+JSON.stringify(clean));
    const dedupe=await mac(env.LEAD_HASH_SECRET,`duplicate:${Math.floor(now/DAY)}:${payloadHash}`);
    const existing=await env.LEADS_DB.prepare('SELECT id,payload_hash FROM inquiries WHERE request_id = ? OR dedupe_key = ?').bind(input.requestId,dedupe).first();
    if(existing){if(!equal(existing.payload_hash,payloadHash))return json({ok:false,error:'This submission reference was already used. Refresh the page.'},409);return json({ok:true,reference:existing.id,duplicate:true});}
    const id=crypto.randomUUID();
    const inserted=await env.LEADS_DB.prepare('INSERT INTO inquiries (id, request_id, dedupe_key, payload_hash, parent_name, email, world, inquiry_type, room_width, room_length, unit, preference, consent_version, consent_recorded_at, source, campaign, content, created_at, expires_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT DO NOTHING RETURNING id').bind(id,input.requestId,dedupe,payloadHash,clean.name,clean.email,clean.world,clean.type,clean.width,clean.length,clean.unit,clean.preference,POLICY_VERSION,now,clean.source,clean.campaign,clean.content,now,now+30*DAY).first();
    if(!inserted){const previous=await env.LEADS_DB.prepare('SELECT id,payload_hash FROM inquiries WHERE request_id = ? OR dedupe_key = ?').bind(input.requestId,dedupe).first();if(!previous||!equal(previous.payload_hash,payloadHash))return json({ok:false,error:'Please refresh the form and try again.'},409);return json({ok:true,reference:previous.id,duplicate:true});}
    return json({ok:true,reference:id,duplicate:false},201);
  } catch {
    console.error('MKN_INQUIRY_STORAGE_FAILURE'); // No PII, SQL parameters, headers or exception payloads.
    return json({ok:false,error:'We could not confirm your submission. Please retry with the same form.'},503);
  }
}
