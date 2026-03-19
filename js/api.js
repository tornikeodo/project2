import { state } from './state.js';
import { logNetwork } from './logger.js';

const API_BASE_URL = 'https://restaurant.stepprojects.ge/api';

export async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/Categories/GetAll`);
        if (!response.ok) {
            throw new Error(`Categories request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        state.categories = data;
        logNetwork('loadCategories: success', { count: Array.isArray(data) ? data.length : null });
        return data;
    } catch (error) {
        console.error('Error loading categories:', error);
        return null;
    }
}

export async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/Products/GetAll`);
        if (!response.ok) {
            throw new Error(`Products request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        state.products = data;
        logNetwork('loadProducts: success', { count: Array.isArray(data) ? data.length : null });
        return data;
    } catch (error) {
        console.error('Error loading products:', error);
        return null;
    }
}

export async function loadFilteredProducts() {
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
        logNetwork('loadFilteredProducts: success', { count: Array.isArray(data) ? data.length : null });
        return data;
    } catch (error) {
        console.error('Error filtering products:', error);
        return null;
    }
}
