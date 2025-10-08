function toggleTheme() {
  const html = document.documentElement;
  const icon = document.getElementById('theme-icon');
  const isDark = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isDark ? 'light' : 'dark');
  icon.textContent = isDark ? 'dark_mode' : 'light_mode';
}

// Поиск по товарам
const searchInput = document.getElementById('search');
const productList = document.getElementById('product-list');

searchInput.addEventListener('input', function () {
  const query = this.value.toLowerCase();
  const cards = productList.querySelectorAll('.card');
  cards.forEach(card => {
    const name = card.dataset.name.toLowerCase();
    card.style.display = name.includes(query) ? 'flex' : 'none';
  });
});

// Корзина (простая реализация)
const cart = [];
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

function addToCart(button) {
  const card = button.closest('.card');
  const name = card.dataset.name;
  const price = +card.dataset.price;

  // Если товар уже в корзине — увеличим количество
  const existing = cart.find(item => item.name === name);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ name, price, qty: 1 });
  }
  updateCartUI();
}

function updateCartUI() {
  cartCount.textContent = cart.reduce((acc, item) => acc + item.qty, 0);

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Корзина пуста.</p>';
    cartTotal.textContent = 'Итого: 0 ₽';
  } else {
    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <span>${item.name} x${item.qty}</span>
        <span>${item.price * item.qty} ₽</span>
      `;
      cartItemsContainer.appendChild(div);
    });
    const totalPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    cartTotal.textContent = `Итого: ${totalPrice.toLocaleString()} ₽`;
  }
}

function toggleCart() {
  cartModal.classList.toggle('hidden');
}

// Переход к списку товаров из hero
function scrollToProducts() {
  document.getElementById('product-list').scrollIntoView({ behavior: 'smooth' });
}

// Форма заказа
const orderForm = document.getElementById('order-form');
const citySelect = document.getElementById('city');
const deliveryInfo = document.getElementById('delivery-info');
const agreementCheckbox = document.getElementById('agreement');
const orderSubmit = document.getElementById('order-submit');

citySelect.addEventListener('change', () => {
  const selectedOption = citySelect.selectedOptions[0];
  if (!selectedOption) {
    deliveryInfo.textContent = '';
    return;
  }
  const days = selectedOption.dataset.days;
  const city = selectedOption.value;
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + +days);
  const options = { day: 'numeric', month: 'long' };
  deliveryInfo.textContent = `Примерная дата доставки в ${city}: ${deliveryDate.toLocaleDateString('ru-RU', options)}`;
  checkFormValid();
});

agreementCheckbox.addEventListener('change', checkFormValid);

function checkFormValid() {
  orderSubmit.disabled = !(citySelect.value && agreementCheckbox.checked);
}

orderForm.addEvent
