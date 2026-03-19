const API_BASE_URL = 'https://restaurant.stepprojects.ge/api';

const state = {
    products: [],
    categories: [],
    basket: [],
    filters: {
        categoryId: 'all',
        vegetarian: false,
        nuts: false,
        spiciness: 10
    }
};

const productsContainer = document.getElementById('productsContainer');
const categoriesContainer = document.getElementById('categoriesContainer');
const basketBtn = document.getElementById('basketBtn');
const basketModal = document.getElementById('basketModal');
const closeBasket = document.getElementById('closeBasket');
const basketItems = document.getElementById('basketItems');
const basketCount = document.getElementById('basketCount');
const totalPrice = document.getElementById('totalPrice');
const vegetarianFilter = document.getElementById('vegetarianFilter');
const nutsFilter = document.getElementById('nutsFilter');
const spicyFilter = document.getElementById('spicyFilter');

document.addEventListener('DOMContentLoaded', () => {
    if (!productsContainer || !categoriesContainer || !basketBtn || !basketModal || !closeBasket || !basketItems || !basketCount || !totalPrice || !vegetarianFilter || !nutsFilter || !spicyFilter) {
        console.error('Missing required DOM elements. Check index.html IDs.');
        return;
    }
    loadCategories();
    loadProducts();
    setupEventListeners();
    loadBasketFromStorage();
    console.log('DOMContentLoaded: init complete');
});

async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/Categories/GetAll`);
        if (!response.ok) {
            throw new Error(`Categories request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        state.categories = data;
        renderCategories();
        console.log('loadCategories: success', { count: Array.isArray(data) ? data.length : null });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/Products/GetAll`);
        if (!response.ok) {
            throw new Error(`Products request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        state.products = data;
        filterAndRenderProducts();
        console.log('loadProducts: success', { count: Array.isArray(data) ? data.length : null });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

async function loadFilteredProducts() {
    try {
        const params = new URLSearchParams();

        if (state.filters.vegetarian) params.append('vegeterian', true);
        if (state.filters.nuts) params.append('nuts', true);
        if (state.filters.spiciness < 10) params.append('spiciness', state.filters.spiciness);
        if (state.filters.categoryId !== 'all') params.append('categoryId', state.filters.categoryId);

        const url = params.toString()
            ? `${API_BASE_URL}/Products/GetFiltered?${params}`
            : `${API_BASE_URL}/Products/GetAll`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Filtered products request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        state.products = data;
        renderProducts();
        console.log('loadFilteredProducts: success', { count: Array.isArray(data) ? data.length : null });
    } catch (error) {
        console.error('Error filtering products:', error);
    }
}

function renderCategories() {
    if (!Array.isArray(state.categories)) {
        console.error('Categories data is not an array.');
        return;
    }

    const html = state.categories.map(category => `
        <button class="category-btn" data-id="${category.id}">
            ${category.name}
        </button>
    `).join('');

    categoriesContainer.innerHTML = '<button class="category-btn active" data-id="all">All Products</button>' + html;

    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            state.filters.categoryId = e.target.dataset.id;
            loadFilteredProducts();
        });
    });
    console.log('renderCategories: done', { count: state.categories.length });
}

function renderProducts() {
    if (!Array.isArray(state.products)) {
        console.error('Products data is not an array.');
        return;
    }

    if (state.products.length === 0) {
        productsContainer.innerHTML = '<div class="loading">No products found</div>';
        console.log('renderProducts: empty');
        return;
    }

    const html = state.products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.image ? `<img src="${product.image}" alt="${product.name}">` : '🍽️'}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-details">
                    ${product.vegeterian ? '<span class="product-detail">🥗 Vegetarian</span>' : ''}
                    ${product.nuts ? '<span class="product-detail">🥜 Nuts</span>' : ''}
                    ${product.spiciness > 0 ? `<span class="product-detail">🌶️ ${product.spiciness}/10</span>` : ''}
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <input type="number" class="qty-input" value="1" min="1" max="99">
                    <button class="add-to-basket-btn" onclick="addToBasket(${product.id}, ${product.price}, '${product.name}', this)">Add</button>
                </div>
            </div>
        </div>
    `).join('');

    productsContainer.innerHTML = html;
    console.log('renderProducts: done', { count: state.products.length });
}

function filterAndRenderProducts() {
    loadFilteredProducts();
    console.log('filterAndRenderProducts: invoked');
}

function renderBasketItems() {
    if (state.basket.length === 0) {
        basketItems.innerHTML = '<p class="empty-message">Your basket is empty</p>';
        console.log('renderBasketItems: empty');
        return;
    }

    const html = state.basket.map((item, index) => `
        <div class="basket-item">
            <div class="basket-item-header">
                <span class="basket-item-name">${item.name}</span>
                <button class="basket-item-remove" onclick="removeFromBasket(${index})">&times;</button>
            </div>
            <div class="basket-item-details">
                <span>Qty: ${item.quantity}</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>
        </div>
    `).join('');

    basketItems.innerHTML = html;
    updateBasketTotal();
    console.log('renderBasketItems: done', { count: state.basket.length });
}

function updateBasketTotal() {
    const total = state.basket.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = `$${total.toFixed(2)}`;
    basketCount.textContent = state.basket.reduce((sum, item) => sum + item.quantity, 0);
    console.log('updateBasketTotal: done', { total, count: state.basket.length });
}

function addToBasket(productId, price, name, button) {
    const qtyInput = button.previousElementSibling;
    const quantity = parseInt(qtyInput.value);

    if (!Number.isFinite(quantity) || quantity < 1) {
        console.error('Invalid quantity value.');
        return;
    }

    const existingItem = state.basket.find(item => item.id === productId && item.price === price);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        state.basket.push({
            id: productId,
            productId: productId,
            name: name,
            price: price,
            quantity: quantity
        });
    }

    saveBasketToStorage();
    renderBasketItems();

    button.textContent = '✓ Added';
    setTimeout(() => {
        button.textContent = 'Add';
    }, 1000);
    console.log('addToBasket: done', { productId, quantity });
}

function removeFromBasket(index) {
    state.basket.splice(index, 1);
    saveBasketToStorage();
    renderBasketItems();
    console.log('removeFromBasket: done', { index });
}

function saveBasketToStorage() {
    localStorage.setItem('restaurant_basket', JSON.stringify(state.basket));
    console.log('saveBasketToStorage: done', { count: state.basket.length });
}

function loadBasketFromStorage() {
    const saved = localStorage.getItem('restaurant_basket');
    if (saved) {
        try {
            state.basket = JSON.parse(saved);
            updateBasketTotal();
            console.log('loadBasketFromStorage: done', { count: state.basket.length });
        } catch (error) {
            console.error('Failed to parse saved basket data:', error);
            state.basket = [];
            saveBasketToStorage();
        }
    } else {
        console.log('loadBasketFromStorage: empty');
    }
}

function setupEventListeners() {
    basketBtn.addEventListener('click', () => {
        basketModal.classList.add('active');
        renderBasketItems();
    });

    closeBasket.addEventListener('click', () => {
        basketModal.classList.remove('active');
    });

    basketModal.addEventListener('click', (e) => {
        if (e.target === basketModal) {
            basketModal.classList.remove('active');
        }
    });

    vegetarianFilter.addEventListener('change', (e) => {
        state.filters.vegetarian = e.target.checked;
        loadFilteredProducts();
    });

    nutsFilter.addEventListener('change', (e) => {
        state.filters.nuts = e.target.checked;
        loadFilteredProducts();
    });

    spicyFilter.addEventListener('input', (e) => {
        state.filters.spiciness = parseInt(e.target.value);
        loadFilteredProducts();
    });
    console.log('setupEventListeners: done');
}
