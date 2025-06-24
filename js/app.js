const navItems=['Quiénes somos','Ubicación','Misión y Visión','Testimonios'];
const nav=document.getElementById('nav');
nav.innerHTML=navItems.map(i=>`<a href="#">${i}</a>`).join('');

const app=document.getElementById('app');
let cart=[];

Promise.all([
  fetch('data/products.json').then(r=>r.json()),
  fetch('data/financing.json').then(r=>r.json()),
  fetch('data/regions.json').then(r=>r.json())
]).then(([products,financing,regions])=>{
  app.innerHTML=`<div id="products"></div><button id="checkout">Continuar</button>`;
  const productsDiv=document.getElementById('products');
  products.forEach(p=>{
    const div=document.createElement('div');
    div.className='card';
    div.innerHTML=`<h3>${p.name}</h3><p>$${p.price}</p><button data-id="${p.id}">Agregar</button>`;
    productsDiv.appendChild(div);
  });
  productsDiv.addEventListener('click',e=>{
    if(e.target.dataset.id){cart.push(products.find(p=>p.id==e.target.dataset.id));}
  });
  document.getElementById('checkout').addEventListener('click',()=>showForm(financing,regions));
});

function showForm(financing,regions){
  if(!cart.length){return alert('Carrito vacío');}
  const dlg=document.createElement('dialog');
  dlg.innerHTML=`<form method="dialog" class="dialog-form">
  <h2>Datos del pedido</h2>
  <label>Nombre y apellido<input required></label>
  <label>Número de identificación<input required></label>
  <label>Celular principal<input required></label>
  <label>Celular opcional<input></label>
  <label>Email principal<input type=email required></label>
  <label>Email opcional<input type=email></label>
  <label>Número de WhatsApp<input></label>
  <label><input type=checkbox required>Acepto uso de datos</label>
  <label>Región<select id="region">${regions.map(r=>`<option>${r}</option>`).join('')}</select></label>
  <label>Financiación<select id="finOpt">${financing.map(f=>`<option value="${f.months}">${f.label}</option>`).join('')}</select></label>
  <button>Crear Pedido</button>
  </form>`;
  document.body.appendChild(dlg);
  dlg.showModal();
  dlg.addEventListener('close',()=>dlg.remove());
  dlg.querySelector('button').addEventListener('click',()=>{
    const months=parseInt(dlg.querySelector('#finOpt').value);
    if(months>1){alert('Pago por factura de energía o gas');}else{alert('Pago contraentrega');}
    dlg.close();
  });
}
