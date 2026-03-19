import { state } from './state.js';
import { dom } from './dom.js';
import { loadFilteredProducts } from './api.js';
import { renderBasketItems, renderProducts } from './render.js';
import { addToBasket, removeFromBasket } from './basket.js';
import { logNetwork } from './logger.js';

export function setupEventListeners() {
    dom.basketBtn.addEventListener('click', () => {
        dom.basketModal.classList.add('active');
        renderBasketItems();
    });

    dom.closeBasket.addEventListener('click', () => {
        dom.basketModal.classList.remove('active');
    });

    dom.basketModal.addEventListener('click', (e) => {
        if (e.target === dom.basketModal) {
            dom.basketModal.classList.remove('active');
        }
    });

    dom.vegetarianFilter.addEventListener('change', (e) => {
        state.filters.vegetarian = e.target.checked;
        loadFilteredProducts().then(() => renderProducts());
    });

    dom.nutsFilter.addEventListener('change', (e) => {
        state.filters.nuts = e.target.checked;
        loadFilteredProducts().then(() => renderProducts());
    });

    dom.spicyFilter.addEventListener('input', (e) => {
        state.filters.spiciness = parseInt(e.target.value);
        loadFilteredProducts().then(() => renderProducts());
    });

    dom.productsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-basket-btn');
        if (!btn) return;
        const card = btn.closest('.product-card');
        if (!card) return;
        const qtyInput = card.querySelector('.qty-input');
        const quantity = parseInt(qtyInput.value);
        const productId = parseInt(btn.dataset.id);
        const price = parseFloat(btn.dataset.price);
        const name = btn.dataset.name;
        addToBasket(productId, price, name, quantity);
        btn.textContent = '✓ Added';
        setTimeout(() => {
            btn.textContent = 'Add';
        }, 1000);
    });

    dom.basketItems.addEventListener('click', (e) => {
        const btn = e.target.closest('.basket-item-remove');
        if (!btn) return;
        const index = parseInt(btn.dataset.index);
        removeFromBasket(index);
    });

    logNetwork('setupEventListeners: done');
}
