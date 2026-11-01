(() => {
'use strict';
const cfg = window.SUMEE_SUPABASE;
const db = window.supabase.createClient(cfg.url, cfg.publishableKey);
const $ = id => document.getElementById(id);
const chicago = new Intl.DateTimeFormat('en-US',{timeZone:'America/Chicago',weekday:'short',month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'});
const showDate = s => s ? chicago.format(new Date(s)) : 'Not scheduled';
function node(tag,text,cls){const el=document.createElement(tag);if(text!==undefined)el.textContent=String(text);if(cls)el.className=cls;return el;}
function field(container,name,value){const p=node('p');p.append(node('b',name+': '),document.createTextNode(value??'—'));container.append(p);return p;}
function linkField(container,name,value,url){const p=node('p');p.append(node('b',name+': '));if(value){const a=node('a',value);a.href=url;a.rel='noopener noreferrer';if(url.startsWith('https:'))a.target='_blank';p.append(a)}else p.append('—');container.append(p)}
function taskCard(task){
 const card=node('article',undefined,'task');
 card.append(node('h3',`${task.order_number || 'Order'} — ${task.customer_name || 'Customer'}`));
 linkField(card,'Phone',task.phone,`tel:${String(task.phone||'').replace(/[^\d+]/g,'')}`);
 const address=[task.event_address,task.event_city].filter(Boolean).join(', ');
 linkField(card,'Address',address,`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`);
 field(card,'Delivery Date',showDate(task.delivery_request_date_time));
 field(card,'Pickup Date',showDate(task.pickup_request_date_time));
 field(card,'Event Date',showDate(task.event_date_time));
 const ul=node('ul');for(const item of Array.isArray(task.items)?task.items:[]){ul.append(node('li',`${item.name||'Item'} × ${item.quantity??'?'}`))}
 card.append(node('b','Items: '),ul);
 field(card,'Notes',task.notes || '—');
 const action=task.task_type==='delivery'?'delivered':'picked_up';
 const btn=node('button',action==='delivered'?'Mark Delivered':'Mark Picked Up');
 const blocked=action==='picked_up' && task.delivery_status!=='Delivered';
 if(blocked){btn.disabled=true;btn.title='Mark Delivered first';card.append(node('p','Delivery must be marked Delivered before pickup.'))}
 btn.onclick=async()=>{
   if(!window.confirm(`Confirm ${btn.textContent} for ${task.order_number||'this order'}?`))return;
   btn.disabled=true;$('notice').textContent='Saving fulfillment update…';
   const {error}=await db.rpc('sumee_mark_fulfillment',{p_order_id:task.order_id,p_action:action});
   if(error){$('notice').textContent=error.message;btn.disabled=blocked;return}
   $('notice').textContent='Updated successfully.';await loadTasks();
 };
 card.append(btn);return card;
}
async function loadTasks(){
 const {data,error}=await db.rpc('sumee_driver_tasks');
 if(error){$('notice').textContent=`Unable to load tasks: ${error.message}`;return}
 for(const [type,id,dateKey] of [['delivery','deliveries','delivery_request_date_time'],['pickup','pickups','pickup_request_date_time']]){
  const holder=$(id);holder.replaceChildren();
  const tasks=(data||[]).filter(x=>x.task_type===type).sort((a,b)=>new Date(a[dateKey]||0)-new Date(b[dateKey]||0));
  if(!tasks.length)holder.append(node('p','No upcoming tasks.'));
  for(const task of tasks)holder.append(taskCard(task));
 }
}
async function boot(){
 const {data:{user}}=await db.auth.getUser();
 if(!user){$('loginBox').hidden=false;$('app').hidden=true;$('logout').hidden=true;return}
 const {data:profile,error}=await db.from('admin_users').select('role,active,display_name').eq('user_id',user.id).maybeSingle();
 if(error||!profile?.active||!['admin','driver_helper'].includes(profile.role)){
  await db.auth.signOut();$('loginError').textContent='Account not authorized for team access.';
  $('loginBox').hidden=false;$('app').hidden=true;$('logout').hidden=true;return
 }
 $('loginBox').hidden=true;$('app').hidden=false;$('logout').hidden=false;
 $('userLabel').textContent=`Signed in: ${profile.display_name||user.email}`;
 await loadTasks();
}
$('login').onsubmit=async e=>{
 e.preventDefault();$('loginError').textContent='Signing in…';
 const {error}=await db.auth.signInWithPassword({email:$('email').value.trim(),password:$('password').value});
 if(error){$('loginError').textContent=error.message;return}
 $('loginError').textContent='';await boot();
};
$('logout').onclick=async()=>{await db.auth.signOut();location.reload()};
boot().catch(e=>{$('loginError').textContent=e.message});
})();