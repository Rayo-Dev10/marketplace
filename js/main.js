document.addEventListener('DOMContentLoaded', async () => {
  const [products, financing, regions] = await Promise.all([
    fetch('data/products.json').then(r => r.json()),
    fetch('data/financing.json').then(r => r.json()),
    fetch('data/regions.json').then(r => r.json())
  ]);

  const app = document.getElementById('app');
  app.innerHTML = `
<header class="bg-white shadow">
  <nav class="container mx-auto flex justify-between p-4">
    <h1 class="font-bold text-green-700">MercadoConfianza</h1>
    <ul class="flex gap-4">
      <li><a href="#quienes">Quiénes somos</a></li>
      <li><a href="#ubicacion">Ubicación</a></li>
      <li><a href="#mision">Misión y Visión</a></li>
      <li><a href="#testimonios">Testimonios</a></li>
    </ul>
  </nav>
</header>
<main class="container mx-auto p-4" id="main"></main>`;

  const main = document.getElementById('main');
  const grid = document.createElement('section');
  grid.id = 'product-grid';
  grid.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
  main.appendChild(grid);

  products.forEach(p => {
    grid.innerHTML += `
<article class="bg-white shadow p-4 flex flex-col">
  <img src="${p.image}" alt="${p.name}" class="h-40 object-cover">
  <h2 class="font-semibold">${p.name}</h2>
  <p class="mb-2">${formatCurrency(p.price)}</p>
  <button data-id="${p.id}" class="add bg-green-100 p-2 mt-auto">Agregar</button>
</article>`;
  });

  const cart = [];
  const checkoutBtn = document.createElement('button');
  checkoutBtn.id = 'checkout';
  checkoutBtn.textContent = 'Continuar compra';
  checkoutBtn.className = 'mt-4 bg-green-700 text-white px-4 py-2';
  main.appendChild(checkoutBtn);

  grid.addEventListener('click', e => {
    if (e.target.classList.contains('add')) {
      const id = parseInt(e.target.dataset.id);
      cart.push(products.find(p => p.id === id));
      alert('Producto agregado');
    }
  });

  checkoutBtn.addEventListener('click', () => {
    if (!cart.length) return alert('No hay productos en el carrito');
    showCheckout();
  });

  function showCheckout() {
    main.innerHTML = checkoutForm();
    const form = document.getElementById('order-form');
    const financingSelect = document.getElementById('financing');
    financing.forEach(f => {
      const o = document.createElement('option');
      o.value = f.months;
      o.textContent = f.label;
      financingSelect.appendChild(o);
    });
    regions.forEach(r => {
      const o = document.createElement('option');
      o.value = r;
      o.textContent = r;
      document.getElementById('region').appendChild(o);
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const months = parseInt(financingSelect.value);
      const pago = months === 1 ? 'Contraentrega' : 'Factura de servicios';
      alert('Pedido creado con pago ' + pago);
    });
  }

  function checkoutForm() {
    return `
<form id="order-form" class="space-y-2">
  <input required placeholder="Nombre y Apellido" class="w-full border p-2">
  <input required placeholder="Número de identificación" class="w-full border p-2">
  <input required placeholder="Celular" class="w-full border p-2">
  <input placeholder="Celular opcional" class="w-full border p-2">
  <input type="email" required placeholder="Correo" class="w-full border p-2">
  <input type="email" placeholder="Correo opcional" class="w-full border p-2">
  <input placeholder="WhatsApp" class="w-full border p-2">
  <select id="region" required class="w-full border p-2"></select>
  <select id="financing" required class="w-full border p-2"></select>
  <label class="block"><input type="checkbox" required> Autorizo el uso de mis datos</label>
  <button class="bg-green-700 text-white px-4 py-2">Crear pedido</button>
</form>`;
  }

  function formatCurrency(v) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(v);
  }
});
