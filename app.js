const qs=s=>document.querySelector(s);
const qsa=s=>document.querySelectorAll(s);
let products=[],cart=[];let financing=[];let regions=[];
(async()=>{
 products=await fetch('data/products.json').then(r=>r.json());
 financing=await fetch('data/financing.json').then(r=>r.json());
 regions=await fetch('data/regions.json').then(r=>r.json());
 loadProducts();
 fillSelect(qs('#financing'),['Contado',...financing.map(n=>n+' cuotas')],0);
 fillSelect(qs('#regions'),regions);
})();
function fillSelect(sel,opts,val){sel.innerHTML='';opts.forEach((t,i)=>{sel.innerHTML+=`<option value="${i}">${t}</option>`});sel.value=val}
function loadProducts(){const tpl=qs('#product-template');const cont=qs('#products');products.forEach(p=>{let n=tpl.content.cloneNode(true);n.querySelector('img').src=p.image;n.querySelector('h3').textContent=p.name;n.querySelector('p').textContent=`$${p.price.toLocaleString()}`;n.querySelector('button').dataset.id=p.id;cont.appendChild(n)})}
qs('#products').addEventListener('click',e=>{if(e.target.tagName==='BUTTON'){const p=products.find(x=>x.id==e.target.dataset.id);cart.push(p)}});
qs('#checkout').addEventListener('click',()=>{if(cart.length)qs('#order-dialog').showModal()});
qs('#financing').addEventListener('change',e=>{const pago=qs('#payment');if(e.target.value=='0'){pago.innerHTML='<option value="contra">Contraentrega</option>'}else{pago.innerHTML='<option value="energia">Factura energia</option><option value="gas">Factura gas</option>'}});
qs('#order-form').addEventListener('submit',e=>{e.preventDefault();qs('#order-dialog').close();alert('Pedido creado')});
