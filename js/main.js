import { validateDom } from './dom.js';
import { loadCategories, loadProducts, loadFilteredProducts } from './api.js';
import { renderCategories, renderProducts } from './render.js';
import { setupEventListeners } from './events.js';
import { loadBasketFromStorage } from './basket.js';
import { state } from './state.js';

document.addEventListener('DOMContentLoaded', async () => {
    if (!validateDom()) {
        return;
    }

    setupEventListeners();
    loadBasketFromStorage();

    const categories = await loadCategories();
    if (categories) {
        renderCategories((categoryId) => {
            state.filters.categoryId = categoryId;
            loadFilteredProducts().then(() => renderProducts());
        });
    }

    const products = await loadProducts();
    if (products) {
        await loadFilteredProducts();
        renderProducts();
    }

    console.log('DOMContentLoaded: init complete');
});
