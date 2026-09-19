const items=[{id:'ITEM-001',name:'White Resin Chair',desc:'White folding resin chair',qty:150,price:3},{id:'ITEM-002',name:"6' Rectangle Table",desc:'Lifetime 6-ft table',qty:25,price:12},{id:'ITEM-003',name:"6' Round Table",desc:'Round banquet table',qty:10,price:18},{id:'ITEM-004',name:'Cocktail Table',desc:'High-top cocktail table',qty:12,price:15},{id:'ITEM-005',name:'20×30 Tent',desc:'Commercial frame tent',qty:2,price:450}];
const pages=document.querySelectorAll('.page'),tabs=document.querySelectorAll('.navtab');function go(id){pages.forEach(p=>p.classList.toggle('active',p.id===id));tabs.forEach(t=>t.classList.toggle('active',t.dataset.page===id));window.scrollTo(0,0)}tabs.forEach(t=>t.onclick=()=>go(t.dataset.page));document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
function renderItems(){itemsBody.innerHTML=items.map(x=>`<tr><td><strong>${x.name}</strong></td><td>${x.desc}</td><td>${x.qty}</td><td>$${x.price.toFixed(2)}</td><td>Yes</td><td><button class="text-btn item-edit" data-item-id="${x.id}">Edit</button></td></tr>`).join('')}renderItems();
const tbody=document.querySelector('#orderItems tbody');function addLine(item=items[0]){const tr=document.createElement('tr');tr.innerHTML=`<td><select class="itemSel">${items.map(x=>`<option value="${x.id}">${x.name}</option>`).join('')}</select></td><td class="avail">${item.qty}</td><td><input class="qty" type="number" min="1" value="1"></td><td><input class="price" type="number" min="0" step=".01" value="${item.price}"></td><td class="amount">$${item.price.toFixed(2)}</td><td><button class="text-btn remove">Remove</button></td>`;tbody.appendChild(tr);const sel=tr.querySelector('.itemSel'),qty=tr.querySelector('.qty'),price=tr.querySelector('.price');sel.value=item.id;function recalc(){const it=items.find(x=>x.id===sel.value);tr.querySelector('.avail').textContent=it.qty;tr.querySelector('.amount').textContent='$'+((+qty.value||0)*(+price.value||0)).toFixed(2);totals()}sel.onchange=()=>{const it=items.find(x=>x.id===sel.value);price.value=it.price;recalc()};qty.oninput=recalc;price.oninput=recalc;tr.querySelector('.remove').onclick=()=>{tr.remove();totals()};recalc()}
function totals(){let s=0;document.querySelectorAll('#orderItems .amount').forEach(a=>s+=+a.textContent.replace('$',''));suggested.textContent='$'+s.toFixed(2);let t=s+(+setup.value||0)+(+delivery.value||0)-(+discount.value||0);total.textContent='$'+t.toFixed(2);pending.textContent='$'+Math.max(0,t).toFixed(2)}[setup,delivery,discount].forEach(x=>x.oninput=totals);addItem.onclick=()=>addLine(items[Math.min(tbody.children.length,items.length-1)]);addLine(items[0]);addLine(items[1]);addLine(items[4]);
pickup.onchange=()=>{const d=new Date(pickup.value);d.setHours(d.getHours()+2);releaseTime.textContent=d.toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'})};
customerSearch.oninput=e=>{const q=e.target.value.toLowerCase();document.querySelectorAll('#customerTable tbody tr').forEach(r=>{const hay=(r.dataset.search||r.textContent).toLowerCase();r.style.display=hay.includes(q)?'':'none'})};document.querySelectorAll('[data-action="neworder"]').forEach(b=>b.onclick=()=>go('neworder'));
const modal=document.querySelector('#modal'),mc=document.querySelector('#modalContent');document.querySelector('.modal-close').onclick=()=>modal.close();function showModal(title,body){mc.innerHTML=`<h2>${title}</h2>${body}`;modal.showModal()}
addCustomer.onclick=()=>showModal('Add Customer',`<div class="modal-grid"><label>Name<input></label><label>Phone<input></label><label>City<input></label><label>Email<input type="email"></label><label class="wide">Address<input></label></div><div class="modal-actions"><button class="primary" onclick="modal.close()">Save Customer</button></div>`);newItem.onclick=()=>showModal('Add Item',`<div class="modal-grid"><label>Item Name<input></label><label>Total Qty<input type="number"></label><label class="wide">Description<input></label><label>Unit Price<input type="number" step=".01"></label><label>Active<select><option>Yes</option><option>No</option></select></label></div><div class="modal-actions"><button class="primary" onclick="modal.close()">Save Item</button></div>`);addPayment.onclick=()=>showModal('Add Payment',`<div class="modal-grid"><label>Order<select><option>SR-1025 — Raj Patel</option></select></label><label>Type<select><option>Payment</option><option>Refund</option></select></label><label>Date / Time<input type="datetime-local"></label><label>Amount<input type="number" step=".01"></label><label>Method<select><option>Zelle</option><option>Cash</option><option>Venmo</option><option>Credit Card</option><option>Check</option><option>Other</option></select></label><label>Reference<input></label><label class="wide">Notes<input></label></div><div class="modal-actions"><button class="primary" onclick="modal.close()">Save Payment</button></div>`);
// Order detail / packing-sheet prototype. In the Firebase version this data will come from Orders, Order_Items and Payments.
const demoOrders={
 'SR-1025':{customer:'Raj Patel',phone:'469-555-1212',email:'raj@example.com',orderDate:'Sep 18, 2026',event:'Sep 20, 2026 · 5:00 PM',eventAddress:'456 Event Drive, McKinney, TX',delivery:'Sep 20, 2026 · 1:00 PM',pickup:'Sep 21, 2026 · 10:00 AM',release:'Sep 21, 2026 · 12:00 PM',status:'Confirmed',payment:'Open',items:[['White Resin Chair',60,3],['6\' Rectangle Table',8,12],['20×30 Tent',1,450]],setup:100,deliveryFee:75,discount:50,received:700,notes:'Call customer before delivery. Confirm tent placement on arrival.'},
 'SR-1026':{customer:'John Smith',phone:'214-555-1313',email:'john@example.com',orderDate:'Sep 18, 2026',event:'Sep 21, 2026 · 6:00 PM',eventAddress:'1200 Celebration Ln, Frisco, TX',delivery:'Sep 21, 2026 · 2:00 PM',pickup:'Sep 22, 2026 · 10:00 AM',release:'Sep 22, 2026 · 12:00 PM',status:'Confirmed',payment:'Settled',items:[['White Resin Chair',40,3],['Cocktail Table',4,15]],setup:50,deliveryFee:50,discount:0,received:280,notes:'Backyard delivery; use side gate.'},
 'SR-1027':{customer:'Amy Jones',phone:'972-555-1414',email:'amy@example.com',orderDate:'Sep 18, 2026',event:'Sep 22, 2026 · 4:00 PM',eventAddress:'88 Prosper Trail, Prosper, TX',delivery:'Sep 22, 2026 · 11:00 AM',pickup:'Sep 23, 2026 · 9:00 AM',release:'Sep 23, 2026 · 11:00 AM',status:'Confirmed',payment:'Settled',items:[['White Resin Chair',75,3],['6\' Round Table',8,18],['20×30 Tent',1,450]],setup:100,deliveryFee:75,discount:19,received:975,notes:'Tent and tables require setup.'}
};
function money(n){return '$'+Number(n||0).toFixed(2)}
function orderDetailHtml(id){
 const o=demoOrders[id]; if(!o)return '<p>Order details are not available in this prototype.</p>';
 const suggested=o.items.reduce((s,x)=>s+x[1]*x[2],0), total=suggested+o.setup+o.deliveryFee-o.discount, pending=Math.max(0,total-o.received);
 return `<div class="order-detail-head"><div><h2>Order ${id}</h2><p><strong>${o.customer}</strong> · ${o.status} · Payment ${o.payment}</p></div><div class="order-detail-actions"><button class="secondary edit-order-btn" data-edit-order="${id}">Edit Order</button><button class="secondary" onclick="window.print()">Print / Save PDF</button></div></div>
 <div class="order-meta"><div><span>Customer</span><strong>${o.customer}</strong></div><div><span>Phone</span><strong>${o.phone}</strong></div><div><span>Email</span><strong>${o.email}</strong></div><div><span>Order Date</span><strong>${o.orderDate}</strong></div><div><span>Event Date / Time</span><strong>${o.event}</strong></div><div><span>Event Address</span><strong>${o.eventAddress}</strong></div><div><span>Delivery Requested</span><strong>${o.delivery}</strong></div><div><span>Pickup Requested</span><strong>${o.pickup}</strong></div><div><span>Inventory Available</span><strong>${o.release}</strong></div><div><span>Order Status</span><strong>${o.status}</strong></div></div>
 <h3 class="packing-title">Packing List</h3><div class="table-wrap"><table><thead><tr><th>Item</th><th>Qty to Pack</th><th>Unit Price</th><th>Amount</th></tr></thead><tbody>${o.items.map(x=>`<tr><td>${x[0]}</td><td><strong>${x[1]}</strong></td><td>${money(x[2])}</td><td>${money(x[1]*x[2])}</td></tr>`).join('')}</tbody></table></div>
 <div class="order-summary"><div><span>Suggested Price</span><strong>${money(suggested)}</strong></div><div><span>Setup Fee</span><strong>${money(o.setup)}</strong></div><div><span>Delivery Fee</span><strong>${money(o.deliveryFee)}</strong></div><div><span>Discount</span><strong>−${money(o.discount)}</strong></div><div class="grand-total"><span>Total Amount</span><strong>${money(total)}</strong></div><div><span>Amount Received</span><strong>${money(o.received)}</strong></div><div><span>Amount Pending</span><strong>${money(pending)}</strong></div></div>
 <div class="order-notes"><strong>Delivery / Packing Notes</strong><p>${o.notes||'—'}</p></div>`;
}
function openOrder(id, updateUrl=true){
  mc.innerHTML=orderDetailHtml(id);
  if(typeof modal.showModal === 'function') modal.showModal(); else modal.setAttribute('open','');
  if(updateUrl){const u=new URL(window.location.href);u.searchParams.set('order',id);history.pushState({order:id},'',u)}
}
document.addEventListener('click',e=>{
  const link=e.target.closest('a[data-order-id]');
  if(link){e.preventDefault();openOrder(link.dataset.orderId);}
});
modal.addEventListener('close',()=>{const u=new URL(window.location.href);if(u.searchParams.has('order')){u.searchParams.delete('order');history.replaceState({},'',u)}});
window.addEventListener('popstate',()=>{const id=new URL(window.location.href).searchParams.get('order');if(id)openOrder(id,false);else if(modal.open)modal.close()});
const initialOrder=new URL(window.location.href).searchParams.get('order');if(initialOrder)openOrder(initialOrder,false);


// Mobile table labels: make every table readable as stacked cards on narrow screens.
function applyMobileTableLabels(root=document){
  root.querySelectorAll('table').forEach(table => {
    const headers=[...table.querySelectorAll('thead th')].map(th=>th.textContent.trim());
    table.querySelectorAll('tbody tr').forEach(row => {
      [...row.children].forEach((cell,i)=>{
        if(cell.tagName==='TD') cell.setAttribute('data-label', headers[i] || '');
      });
    });
  });
}
applyMobileTableLabels();
const mobileTableObserver=new MutationObserver(()=>applyMobileTableLabels());
mobileTableObserver.observe(document.body,{childList:true,subtree:true});

// v5: fulfillment tracking for prototype. Firebase will persist these fields later.
const fulfillmentState={};
function fulfillmentHtml(id,o){
 const f=fulfillmentState[id]||{};
 return `<div class="fulfillment"><h3>Order Fulfillment</h3><div class="fulfillment-grid">
 <div class="fulfill-card"><span>Delivery Requested</span><strong>${o.delivery}</strong>${f.delivered?`<div class="fulfill-status">✓ Delivered — ${f.delivered}</div><button class="secondary fulfill-action" data-fulfill="undo-delivery" data-id="${id}">Undo / Correct Delivery</button>`:`<button class="primary fulfill-action" data-fulfill="delivery" data-id="${id}">✓ Mark as Delivered</button><div class="fulfill-status">Not delivered yet</div>`}</div>
 <div class="fulfill-card"><span>Pickup Requested</span><strong>${o.pickup}</strong>${f.picked?`<div class="fulfill-status">✓ Picked Up — ${f.picked}</div><button class="secondary fulfill-action" data-fulfill="undo-pickup" data-id="${id}">Undo / Correct Pickup</button>`:`<button class="primary fulfill-action" data-fulfill="pickup" data-id="${id}">✓ Mark as Picked Up</button><div class="fulfill-status">Not picked up yet</div>`}</div>
 </div></div>`;
}
const originalOrderDetailHtml=orderDetailHtml;
orderDetailHtml=function(id){
 const html=originalOrderDetailHtml(id),o=demoOrders[id];
 if(!o)return html;
 const marker='<h3 class="packing-title">Packing List</h3>';
 return html.replace(marker,fulfillmentHtml(id,o)+marker);
};
function stampNow(){return new Date().toLocaleString('en-US',{month:'short',day:'numeric',year:'numeric',hour:'numeric',minute:'2-digit'});}
document.addEventListener('click',e=>{
 const b=e.target.closest('.fulfill-action'); if(!b)return;
 const id=b.dataset.id, action=b.dataset.fulfill; fulfillmentState[id] ||= {};
 const msg=action==='delivery'?'Mark this order as delivered?':action==='pickup'?'Mark this order as picked up?':'Undo this fulfillment status?';
 if(!confirm(msg))return;
 if(action==='delivery')fulfillmentState[id].delivered=stampNow();
 if(action==='pickup')fulfillmentState[id].picked=stampNow();
 if(action==='undo-delivery')delete fulfillmentState[id].delivered;
 if(action==='undo-pickup')delete fulfillmentState[id].picked;
 mc.innerHTML=orderDetailHtml(id); applyMobileTableLabels(mc);
});

// Dashboard v9: 7-day dispatch windows, non-duplicated future events, and 2 KPI tiles.
(function renderDashboardV9(){
  const todayStart=new Date(); todayStart.setHours(0,0,0,0);
  const windowEnd=new Date(todayStart); windowEnd.setDate(windowEnd.getDate()+7); windowEnd.setHours(23,59,59,999);
  const parseDemoDate=(value)=>{ const d=new Date(value.replace(' · ', ' ')); return isNaN(d)?null:d; };
  const orderRows=Object.entries(demoOrders).map(([id,o])=>{
    const itemSubtotal=o.items.reduce((s,x)=>s+x[1]*x[2],0);
    const total=itemSubtotal+o.setup+o.deliveryFee-o.discount;
    const balance=Math.max(0,total-o.received);
    return {id,o,event:parseDemoDate(o.event),delivery:parseDemoDate(o.delivery),pickup:parseDemoDate(o.pickup),total,balance};
  });
  const in7=d=>d && d>=todayStart && d<=windowEnd;
  const fstate=id=>fulfillmentState[id]||{};
  const deliveries=orderRows.filter(r=>in7(r.delivery) && !fstate(r.id).delivered).sort((a,b)=>a.delivery-b.delivery);
  const pickups=orderRows.filter(r=>in7(r.pickup) && !fstate(r.id).picked).sort((a,b)=>a.pickup-b.pickup);
  const dispatchIds=new Set([...deliveries,...pickups].map(r=>r.id));
  const future=orderRows.filter(r=>r.event && r.event>=todayStart && !dispatchIds.has(r.id)).sort((a,b)=>a.event-b.event);
  const fmt=d=>d?d.toLocaleString('en-US',{month:'short',day:'numeric',hour:'numeric',minute:'2-digit'}):'—';
  const deliveryBox=document.querySelector('#upcomingDeliveries');
  const pickupBox=document.querySelector('#upcomingPickups');
  if(deliveryBox) deliveryBox.innerHTML=deliveries.length?deliveries.map(r=>`<div class="dispatch-item"><a class="order-link" href="?order=${r.id}" data-order-id="${r.id}">${r.id}</a> · ${r.o.customer}<small>${fmt(r.delivery)} · ${r.o.eventAddress.split(',').slice(-2,-1)[0].trim()} · Pending</small></div>`).join(''):'<div class="empty-dashboard">No deliveries in the next 7 days.</div>';
  if(pickupBox) pickupBox.innerHTML=pickups.length?pickups.map(r=>`<div class="dispatch-item"><a class="order-link" href="?order=${r.id}" data-order-id="${r.id}">${r.id}</a> · ${r.o.customer}<small>${fmt(r.pickup)} · ${r.o.eventAddress.split(',').slice(-2,-1)[0].trim()} · Pending</small></div>`).join(''):'<div class="empty-dashboard">No pickups in the next 7 days.</div>';
  const body=document.querySelector('#futureEventsTable tbody');
  if(body) body.innerHTML=future.length?future.map(r=>`<tr><td><a class="order-link" href="?order=${r.id}" data-order-id="${r.id}">${r.id}</a></td><td>${r.o.customer}</td><td>${fmt(r.event)}</td><td>${fmt(r.delivery)}</td><td>${fmt(r.pickup)}</td><td>${money(r.balance)}</td><td><span class="pill ${r.balance<=0?'settled':'confirmed'}">${r.balance<=0?'Settled':r.o.status}</span></td></tr>`).join(''):'<tr><td colspan="7">No additional future events.</td></tr>';
  // Prototype KPI calculation: collected revenue is amount received on demo orders; outstanding is remaining balance on active/pending orders.
  const ytd=orderRows.reduce((s,r)=>s+Number(r.o.received||0),0);
  const outstanding=orderRows.reduce((s,r)=>s+r.balance,0);
  const yr=document.querySelector('#ytdRevenue'), ob=document.querySelector('#outstandingBalance');
  if(yr) yr.textContent=money(ytd); if(ob) ob.textContent=money(outstanding);
  applyMobileTableLabels(document.querySelector('#dashboard'));
})();

// v10 customer/order/receivable workflows
const customerData={'Raj Patel':{name:'Raj Patel',phone:'469-555-1212',email:'raj@example.com',address:'456 Event Drive',city:'McKinney'},'John Smith':{name:'John Smith',phone:'214-555-1313',email:'john@example.com',address:'1200 Celebration Ln',city:'Frisco'},
 'Amy Jones':{name:'Amy Jones',phone:'972-555-1414',email:'amy@example.com',address:'88 Prosper Trail',city:'Prosper'}};
document.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const action=b.dataset.action,customer=b.dataset.customer;if(action==='customer'&&customer){const c=customerData[customer];showModal('View / Edit Customer',`<div class="modal-grid"><label>Name<input value="${c.name}"></label><label>Phone<input value="${c.phone}"></label><label>Email<input type="email" value="${c.email}"></label><label>City<input value="${c.city}"></label><label class="wide">Address<input value="${c.address}"></label></div><div class="modal-actions"><button class="primary" onclick="modal.close()">Save Changes</button></div>`)}if(action==='neworder'&&customer){go('neworder');const sel=document.querySelector('#neworder select');if(sel){[...sel.options].forEach(o=>{if(o.textContent.trim()===customer)sel.value=o.value})}}if(action==='orders'&&customer){go('orderlist');const input=document.querySelector('#orderSearch');if(input){input.value=customer;input.dispatchEvent(new Event('input'))}}if(action==='payments'&&customer){openCustomerPayments(customer)}});
function filterRows(inputId,tableId){const input=document.getElementById(inputId);if(!input)return;input.addEventListener('input',()=>{const q=input.value.toLowerCase();document.querySelectorAll(`#${tableId} tbody tr`).forEach(r=>{const hay=(r.dataset.search||r.textContent).toLowerCase();r.style.display=hay.includes(q)?'':'none'})})}filterRows('receivableSearch','receivableTable');filterRows('orderSearch','ordersTable');['receivableTable','ordersTable'].forEach(id=>{const table=document.getElementById(id);if(!table)return;const body=table.tBodies[0];[...body.rows].sort((a,b)=>(b.dataset.event||'').localeCompare(a.dataset.event||'')).forEach(r=>body.appendChild(r))});


// v11 validation/demo interactions — all controls are wired for prototype testing.
function toast(message){
 let t=document.getElementById('demoToast');
 if(!t){t=document.createElement('div');t.id='demoToast';t.className='demo-toast';document.body.appendChild(t)}
 t.textContent=message;t.classList.add('show');clearTimeout(window.__toastTimer);window.__toastTimer=setTimeout(()=>t.classList.remove('show'),2200);
}

// Availability demo recalculation.
document.getElementById('checkAvailability')?.addEventListener('click',()=>{
 const rows=document.querySelectorAll('#availability tbody tr');
 const reserved=[60,10,1];
 rows.forEach((r,i)=>{const cells=r.querySelectorAll('td');const total=Number(cells[1].textContent);cells[2].textContent=reserved[i];cells[3].innerHTML=`<strong${total-reserved[i]===0?' class="danger"':''}>${total-reserved[i]}</strong>`});
 applyMobileTableLabels(document.getElementById('availability'));toast('Sample availability refreshed for the selected rental window.');
});

// New Order demo actions.
document.getElementById('saveDraft')?.addEventListener('click',()=>toast('Draft SR-1028 saved in this demo.'));
document.getElementById('confirmOrder')?.addEventListener('click',()=>toast('SR-1028 confirmed in this demo.'));

// Add customer demo: prefilled values and functional save.
if(document.getElementById('addCustomer')) document.getElementById('addCustomer').onclick=()=>showModal('Add Customer',`<div class="modal-grid"><label>Name<input value="Priya Shah"></label><label>Phone<input value="469-555-1515"></label><label>City<input value="Plano"></label><label>Email<input type="email" value="priya@example.com"></label><label class="wide">Address<input value="725 Legacy Drive"></label></div><div class="modal-actions"><button class="primary" id="demoSaveCustomer">Save Customer</button></div>`);
document.addEventListener('click',e=>{if(e.target.id==='demoSaveCustomer'){modal.close();toast('Sample customer saved.')}});

// Customer edit save button is functional in prototype.
document.addEventListener('click',e=>{if(e.target.closest('#modal .modal-actions .primary') && mc.querySelector('h2')?.textContent.includes('View / Edit Customer')){setTimeout(()=>toast('Customer changes saved in this demo.'),0)}});

function openCustomerPayments(customer){
 const map={
  'Raj Patel':[['Sep 18, 2026','SR-1025','Zelle',300],['Sep 19, 2026','SR-1025','Cash',400]],
  'John Smith':[['Sep 18, 2026','SR-1026','Zelle',280]],
  'Amy Jones':[['Sep 18, 2026','SR-1027','Credit Card',975]]
 };
 const rows=(map[customer]||[]).map((p,i)=>`<tr><td>${p[0]}</td><td><a class="order-link" href="?order=${p[1]}" data-order-id="${p[1]}">${p[1]}</a></td><td>${p[2]}</td><td>${money(p[3])}</td><td><button class="text-btn demo-edit-payment" data-customer="${customer}" data-payment="${i}">Edit</button></td></tr>`).join('');
 showModal(`${customer} — Payments`,`<div class="table-wrap"><table><thead><tr><th>Date</th><th>Order</th><th>Method</th><th>Amount</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table></div><div class="modal-actions"><button class="secondary" onclick="modal.close()">Close</button><button class="primary demo-add-payment" data-customer="${customer}">+ Add Payment</button></div>`);applyMobileTableLabels(mc);
}
function paymentEditor(customer,title='Add Payment',amount='100.00'){
 showModal(title,`<div class="modal-grid"><label>Customer<input value="${customer}" readonly></label><label>Order<select><option>SR-1025</option><option>SR-1026</option><option>SR-1027</option></select></label><label>Date / Time<input type="datetime-local" value="2026-09-19T13:30"></label><label>Amount<input type="number" step=".01" value="${amount}"></label><label>Method<select><option>Zelle</option><option>Cash</option><option>Venmo</option><option>Credit Card</option><option>Check</option></select></label><label>Reference<input value="Sample payment"></label></div><div class="modal-actions"><button class="primary demo-save-payment">Save Payment</button></div>`);
}
document.addEventListener('click',e=>{
 const add=e.target.closest('.demo-add-payment');if(add){paymentEditor(add.dataset.customer);return}
 const edit=e.target.closest('.demo-edit-payment');if(edit){paymentEditor(edit.dataset.customer,'Edit Payment','300.00');return}
 if(e.target.closest('.demo-save-payment')){modal.close();toast('Payment saved in this demo.');return}
});

// Top Receivable Add Payment is also functional and prefilled.
if(document.getElementById('addPayment')) document.getElementById('addPayment').onclick=()=>paymentEditor('Raj Patel');

// Item add/edit demo.
if(document.getElementById('newItem')) document.getElementById('newItem').onclick=()=>showModal('Add Item',`<div class="modal-grid"><label>Item Name<input value="White Folding Chair"></label><label>Total Qty<input type="number" value="50"></label><label class="wide">Description<input value="Sample inventory item"></label><label>Unit Price<input type="number" step=".01" value="3.50"></label><label>Active<select><option>Yes</option><option>No</option></select></label></div><div class="modal-actions"><button class="primary demo-save-item">Save Item</button></div>`);
document.addEventListener('click',e=>{
 const edit=e.target.closest('.item-edit');if(edit){const it=items.find(x=>x.id===edit.dataset.itemId);showModal('Edit Item',`<div class="modal-grid"><label>Item Name<input value="${it.name}"></label><label>Total Qty<input type="number" value="${it.qty}"></label><label class="wide">Description<input value="${it.desc}"></label><label>Unit Price<input type="number" step=".01" value="${it.price}"></label><label>Active<select><option>Yes</option><option>No</option></select></label></div><div class="modal-actions"><button class="primary demo-save-item">Save Changes</button></div>`);return}
 if(e.target.closest('.demo-save-item')){modal.close();toast('Item saved in this demo.');}
});

// Order edit from linked order detail.
document.addEventListener('click',e=>{
 const b=e.target.closest('.edit-order-btn');if(!b)return;
 const id=b.dataset.editOrder,o=demoOrders[id];
 showModal(`Edit Order ${id}`,`<div class="modal-grid"><label>Customer<input value="${o.customer}"></label><label>Status<select><option selected>${o.status}</option><option>Draft</option><option>Cancelled</option></select></label><label>Event Date / Time<input value="${o.event}"></label><label>Delivery<input value="${o.delivery}"></label><label>Pickup<input value="${o.pickup}"></label><label class="wide">Event Address<input value="${o.eventAddress}"></label><label class="wide">Notes<input value="${o.notes}"></label></div><div class="modal-actions"><button class="primary demo-save-order">Save Order Changes</button></div>`);
});
document.addEventListener('click',e=>{if(e.target.closest('.demo-save-order')){modal.close();toast('Order changes saved in this demo.')}});

// Modal X works even after dynamic content changes.
document.querySelector('.modal-close')?.addEventListener('click',()=>modal.close());
