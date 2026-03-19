import { state } from './state.js';
import { dom } from './dom.js';
import { logNetwork } from './logger.js';

export function renderCategories(onCategoryChange) {
    if (!Array.isArray(state.categories)) {
        console.error('Categories data is not an array.');
        return;
    }

    const html = state.categories.map(category => `
        <button class="category-btn" data-id="${category.id}">
            ${category.name}
        </button>
    `).join('');

    dom.categoriesContainer.innerHTML = '<button class="category-btn active" data-id="all">All Products</button>' + html;

    dom.categoriesContainer.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            dom.categoriesContainer.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            onCategoryChange(e.currentTarget.dataset.id);
        });
    });

    logNetwork('renderCategories: done', { count: state.categories.length });
}

export function renderProducts() {
    if (!Array.isArray(state.products)) {
        console.error('Products data is not an array.');
        return;
    }

    if (state.products.length === 0) {
        dom.productsContainer.innerHTML = '<div class="loading">No products found</div>';
        logNetwork('renderProducts: empty');
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
                    <button class="add-to-basket-btn" data-id="${product.id}" data-price="${product.price}" data-name="${product.name}">Add</button>
                </div>
            </div>
        </div>
    `).join('');

    dom.productsContainer.innerHTML = html;
    logNetwork('renderProducts: done', { count: state.products.length });
}

export function renderBasketItems() {
    if (state.basket.length === 0) {
        dom.basketItems.innerHTML = '<p class="empty-message">Your basket is empty</p>';
        logNetwork('renderBasketItems: empty');
        return;
    }

    const html = state.basket.map((item, index) => `
        <div class="basket-item">
            <div class="basket-item-header">
                <span class="basket-item-name">${item.name}</span>
                <button class="basket-item-remove" data-index="${index}">&times;</button>
            </div>
            <div class="basket-item-details">
                <span>Qty: ${item.quantity}</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>
        </div>
    `).join('');

    dom.basketItems.innerHTML = html;
    updateBasketTotal();
    logNetwork('renderBasketItems: done', { count: state.basket.length });
}

export function updateBasketTotal() {
    const total = state.basket.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    dom.totalPrice.textContent = `$${total.toFixed(2)}`;
    dom.basketCount.textContent = state.basket.reduce((sum, item) => sum + item.quantity, 0);
    logNetwork('updateBasketTotal: done', { total, count: state.basket.length });
}
