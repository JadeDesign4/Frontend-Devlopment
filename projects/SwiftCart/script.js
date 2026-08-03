// State
let products = [];
let cart = [];
const html = document.documentElement;

// DOM Elements
const productGrid = document.getElementById('productGrid');
const categoryFilter = document.getElementById('categoryFilter');
const loader = document.getElementById('loader');
const cartBtn = document.getElementById('cartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartBadge = document.getElementById('cartBadge');
const themeToggle = document.getElementById('themeToggle');
const toast = document.getElementById('toast');

// Theme Management
let currentTheme = localStorage.getItem('swiftcart_theme') || 'light';
html.setAttribute('data-theme', currentTheme);
updateThemeUI();

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', currentTheme);
    localStorage.setItem('swiftcart_theme', currentTheme);
    updateThemeUI();
});

function updateThemeUI() {
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}

// Fetch Products
async function init() {
    try {
        const [prodRes, catRes] = await Promise.all([
            fetch('https://fakestoreapi.com/products'),
            fetch('https://fakestoreapi.com/products/categories')
        ]);
        
        products = await prodRes.json();
        const categories = await catRes.json();
        
        renderCategories(categories);
        renderProducts(products);
        loader.classList.add('hidden');
        loader.style.display = 'none';
    } catch (err) {
        console.error("Failed to fetch products:", err);
    }
}

function renderCategories(categories) {
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'cat-btn';
        btn.innerText = cat.charAt(0).toUpperCase() + cat.slice(1);
        btn.onclick = () => filterByCategory(cat, btn);
        categoryFilter.appendChild(btn);
    });
}

function renderProducts(data) {
    productGrid.innerHTML = '';
    data.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="img-wrap">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <h3>${product.title}</h3>
            <div class="price">$${product.price.toFixed(2)}</div>
            <button class="btn-add" onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productGrid.appendChild(card);
    });
}

function filterByCategory(category, btn) {
    // UI Update
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    else document.querySelector('[data-category="all"]').classList.add('active');

    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

document.querySelector('[data-category="all"]').onclick = function() {
    filterByCategory('all', this);
};

// Cart Logic
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartUI();
    showToast();
}

function updateCartUI() {
    cartBadge.innerText = cart.length;
    cartItems.innerHTML = '';
    
    let total = 0;
    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-info">
                <h4>${item.title}</h4>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;
        cartItems.appendChild(div);
    });
    
    cartTotal.innerText = `$${total.toFixed(2)}`;
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartUI();
};

function showToast() {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// Modal Toggle
cartBtn.onclick = () => cartOverlay.style.display = 'flex';
closeCart.onclick = () => cartOverlay.style.display = 'none';
window.onclick = (e) => { if (e.target === cartOverlay) cartOverlay.style.display = 'none'; };

init();
