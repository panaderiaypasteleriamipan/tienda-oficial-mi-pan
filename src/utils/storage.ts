import { Product, StoreSettings, CustomerOrder, Review } from '../types';
import { DEFAULT_PRODUCTS, DEFAULT_SETTINGS, DEFAULT_REVIEWS } from '../data/defaultProducts';

const PRODUCTS_KEY = 'mipan_products';
const SETTINGS_KEY = 'mipan_settings';
const ORDERS_KEY = 'mipan_orders';
const REVIEWS_KEY = 'mipan_reviews';
const CART_KEY = 'mipan_cart';

export const getStoredProducts = (): Product[] => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
      return DEFAULT_PRODUCTS;
    }
    return parsed;
  } catch (e) {
    console.error('Error reading products from localStorage', e);
    return DEFAULT_PRODUCTS;
  }
};

export const saveStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('mipan_products_changed'));
  } catch (e) {
    console.error('Error saving products to localStorage', e);
  }
};

export const getStoredSettings = (): StoreSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error reading settings', e);
    return DEFAULT_SETTINGS;
  }
};

export const saveStoredSettings = (settings: StoreSettings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    window.dispatchEvent(new Event('mipan_settings_changed'));
  } catch (e) {
    console.error('Error saving settings', e);
  }
};

export const getStoredOrders = (): CustomerOrder[] => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading orders', e);
    return [];
  }
};

export const saveStoredOrder = (order: CustomerOrder) => {
  try {
    const orders = getStoredOrders();
    const updated = [order, ...orders];
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('mipan_orders_changed'));
  } catch (e) {
    console.error('Error saving order', e);
  }
};

export const updateStoredOrderStatus = (orderId: string, status: CustomerOrder['status']) => {
  try {
    const orders = getStoredOrders();
    const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('mipan_orders_changed'));
  } catch (e) {
    console.error('Error updating order status', e);
  }
};

export const getStoredReviews = (): Review[] => {
  try {
    const raw = localStorage.getItem(REVIEWS_KEY);
    if (!raw) {
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(DEFAULT_REVIEWS));
      return DEFAULT_REVIEWS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading reviews', e);
    return DEFAULT_REVIEWS;
  }
};

export const saveStoredReview = (review: Review) => {
  try {
    const reviews = getStoredReviews();
    const updated = [review, ...reviews];
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('mipan_reviews_changed'));
  } catch (e) {
    console.error('Error saving review', e);
  }
};

export const resetToDefaults = () => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEFAULT_PRODUCTS));
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(DEFAULT_REVIEWS));
  window.dispatchEvent(new Event('mipan_products_changed'));
  window.dispatchEvent(new Event('mipan_settings_changed'));
  window.dispatchEvent(new Event('mipan_reviews_changed'));
};
