async function load(){
  const [products, financing, regions] = await Promise.all([
    fetch('products.json').then(r=>r.json()),
    fetch('financing.json').then(r=>r.json()),
    fetch('regions.json').then(r=>r.json())
  ]);
  const nav=document.getElementById('nav');
  const app=document.getElementById('app');
  const checkout=document.getElementById('checkout');
  ['Qui\u00e9nes somos','Ubicaci\u00f3n','Misi\u00f3n y Visi\u00f3n','Testimonios'].forEach(t=>{
    const a=document.createElement('a');
    a.textContent=t;a.href='#';nav.appendChild(a);
  });
  const cart=[];
  products.forEach(p=>{
    const art=document.createElement('article');
    art.className='product';
    art.innerHTML=`<h3>${p.name}</h3><p>$${p.price}</p>`;
    const btn=document.createElement('button');
    btn.textContent='Agregar';
    btn.onclick=()=>cart.push(p);
    art.appendChild(btn);
    app.appendChild(art);
  });
  const payBtn=document.createElement('button');
  payBtn.textContent='Continuar compra';
  payBtn.onclick=()=>cart.length?showCheckout():alert('No hay productos');
  app.appendChild(payBtn);
  function showCheckout(){
    checkout.innerHTML='';
    const form=document.createElement('form');form.method='dialog';
    const list=document.createElement('ul');
    cart.forEach(i=>{const li=document.createElement('li');li.textContent=`${i.name} $${i.price}`;list.appendChild(li);});
    form.appendChild(list);
    const fSelect=document.createElement('select');
    financing.forEach(o=>{const opt=document.createElement('option');opt.value=o.cuotas;opt.textContent=o.descripcion;fSelect.appendChild(opt);});
    form.appendChild(fSelect);
    const payInfo=document.createElement('p');
    fSelect.onchange=()=>{payInfo.textContent=+fSelect.value>1?'Se financiar\u00e1 a trav\u00e9s de factura de energ\u00eda o gas.':'Pago contraentrega disponible.';};
    fSelect.onchange();
    form.appendChild(payInfo);
    const fields=[['nombre y apellido','text'],['identificaci\u00f3n','text'],['celular','tel'],['celular opcional','tel',false],['correo','email'],['correo opcional','email',false],['whatsapp','tel',false]];
    fields.forEach(([n,t,r=true])=>{const i=document.createElement('input');i.name=n;i.type=t;i.placeholder=n;if(r)i.required=true;form.appendChild(i);});
    const region=document.createElement('select');region.name='region';regions.forEach(r=>{const o=document.createElement('option');o.value=r;o.textContent=r;region.appendChild(o);});
    form.appendChild(region);
    const lab=document.createElement('label');const chk=document.createElement('input');chk.type='checkbox';chk.required=true;lab.append(chk,' Autorizo uso de datos');form.appendChild(lab);
    const sub=document.createElement('button');sub.type='submit';sub.textContent='Crear pedido';form.appendChild(sub);
    form.onsubmit=e=>{e.preventDefault();alert('Pedido creado');checkout.close();};
    checkout.appendChild(form);checkout.showModal();
  }
}
document.addEventListener('DOMContentLoaded',load);
