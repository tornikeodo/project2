import { state } from './state.js';
import { renderBasketItems, updateBasketTotal } from './render.js';

export function addToBasket(productId, price, name, quantity) {
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
    console.log('addToBasket: done', { productId, quantity });
}

export function removeFromBasket(index) {
    state.basket.splice(index, 1);
    saveBasketToStorage();
    renderBasketItems();
    console.log('removeFromBasket: done', { index });
}

export function saveBasketToStorage() {
    localStorage.setItem('restaurant_basket', JSON.stringify(state.basket));
    console.log('saveBasketToStorage: done', { count: state.basket.length });
}

export function loadBasketFromStorage() {
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
