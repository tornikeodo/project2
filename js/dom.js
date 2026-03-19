import { logNetwork } from './logger.js';

export const dom = {
    productsContainer: document.getElementById('productsContainer'),
    categoriesContainer: document.getElementById('categoriesContainer'),
    basketBtn: document.getElementById('basketBtn'),
    basketModal: document.getElementById('basketModal'),
    closeBasket: document.getElementById('closeBasket'),
    basketItems: document.getElementById('basketItems'),
    basketCount: document.getElementById('basketCount'),
    totalPrice: document.getElementById('totalPrice'),
    vegetarianFilter: document.getElementById('vegetarianFilter'),
    nutsFilter: document.getElementById('nutsFilter'),
    spicyFilter: document.getElementById('spicyFilter')
};

export function validateDom() {
    const missing = Object.entries(dom)
        .filter(([, el]) => !el)
        .map(([key]) => key);

    if (missing.length > 0) {
        console.error('Missing required DOM elements:', missing.join(', '));
        return false;
    }

    logNetwork('validateDom: done');
    return true;
}
