(() => {
  'use strict';
  // Only bounded campaign references survive navigation. No cookies or browser storage.
  const query=new URLSearchParams(location.search);
  const campaign={};
  const source=query.get('utm_source');
  if(['pinterest','tiktok','instagram'].includes(source))campaign.source=source;
  for(const [queryKey,key] of [['utm_campaign','campaign'],['utm_content','content']]){
    const value=query.get(queryKey);if(value&&/^[a-zA-Z0-9_-]{1,80}$/.test(value))campaign[key]=value;
  }
  for(const link of document.querySelectorAll('a[data-inquiry],a[data-world-link]')){
    const url=new URL(link.href,location.origin);
    for(const [key,value] of Object.entries(campaign))url.searchParams.set('utm_'+key,value);
    link.href=url.pathname+url.search+url.hash;
  }
  const form=document.querySelector('[data-parent-inquiry]');if(!form)return;
  const fields=form.querySelector('fieldset');const button=form.querySelector('button[type="submit"]');
  const status=document.querySelector('[data-form-status]');
  const retry=document.querySelector('[data-check-availability]');
  const world=form.elements.namedItem('world');if(['ocean','space','forest'].includes(query.get('world')))world.value=query.get('world');
  let token=null;let policyVersion=null;let sending=false;const requestId=crypto.randomUUID();
  let cooldown=null;
  function unavailable(message){clearTimeout(cooldown);token=null;fields.disabled=true;status.textContent=message;retry.hidden=false;}
  async function available(){
    token=null;fields.disabled=true;retry.hidden=true;status.textContent='Checking inquiry availability…';
    if(!navigator.onLine){unavailable('You are offline. Nothing has been sent. Reconnect and check again.');return;}
    try{
      const response=await fetch('/api/inquiry-token',{cache:'no-store',signal:AbortSignal.timeout(12000)});
      const result=await response.json();
      if(!response.ok||!result.enabled){unavailable('Online inquiries are not available yet. Nothing has been sent. Please check again later.');return;}
      token=result.token;policyVersion=result.policyVersion;
      status.textContent='You can send an adult inquiry. Please do not include child information.';
      clearTimeout(cooldown);cooldown=setTimeout(()=>{fields.disabled=false;},2200);
    }catch{unavailable('We cannot connect right now. Nothing has been sent. Please check again.');}
  }
  retry.addEventListener('click',available);
  window.addEventListener('offline',()=>{if(!sending && form.dataset.saved!=='true')unavailable('You are offline. Nothing has been sent. Reconnect and check again.');});
  form.elements.namedItem('unit').addEventListener('change',()=>{const max=form.elements.namedItem('unit').value==='cm'?'3000':'1200';for(const name of ['width','length'])form.elements.namedItem(name).max=max;});
  form.addEventListener('submit',async event=>{
    event.preventDefault();if(sending||!token||!form.reportValidity())return;
    if(!navigator.onLine){unavailable('You are offline. Nothing has been sent. Reconnect and check again.');return;}
    const data=new FormData(form);
    const payload={name:String(data.get('name')).trim(),email:String(data.get('email')).trim(),world:String(data.get('world')),type:String(data.get('type')),width:data.get('width')===''?'':Number(data.get('width')),length:data.get('length')===''?'':Number(data.get('length')),unit:String(data.get('unit')),preference:String(data.get('preference')),consent:data.get('consent')==='yes',website:String(data.get('website')||''),policyVersion,requestId,token,...campaign};
    sending=true;button.disabled=true;status.textContent='Sending your inquiry…';
    try{
      const response=await fetch('/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(15000)});
      const result=await response.json();
      if(!response.ok||!result.ok){status.textContent=result.error||'We could not confirm your submission. Retry using this same form.';return;}
      fields.disabled=true;status.textContent=`Your inquiry is saved. Reference: ${result.reference}. The MyKidsNest owner can review it and reply by email. This is not an order or payment.`;
      form.dataset.saved='true';status.focus();
    }catch{status.textContent='We could not confirm whether your inquiry arrived. Retry this same form to avoid creating a duplicate.';}
    finally{sending=false;button.disabled=false;}
  });
  available();
})();
