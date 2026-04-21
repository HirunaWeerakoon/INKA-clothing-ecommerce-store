import axios from 'axios';

const BASE_URL = '/api/products';
let productsCache = null;
let productsCachePromise = null;

/**
 * Fetch all best-seller products for the Home page.
 * GET /api/products/bestsellers
 */
export const getBestSellerProducts = async () => {
  const response = await axios.get(`${BASE_URL}/bestsellers`);
  return response.data;
};

/**
 * Fetch all available products.
 * GET /api/products
 */
export const getAllProducts = async () => {
  const response = await axios.get(BASE_URL);
  return response.data;
};

/**
 * Fetch all products once and reuse them for subsequent requests.
 */
const getAllProductsCached = async () => {
  if (Array.isArray(productsCache)) {
    return productsCache;
  }

  if (productsCachePromise) {
    return productsCachePromise;
  }

  productsCachePromise = getAllProducts()
    .then((data) => {
      productsCache = Array.isArray(data) ? data : [];
      return productsCache;
    })
    .finally(() => {
      productsCachePromise = null;
    });

  return productsCachePromise;
};

/**
 * Fetch products filtered by category.
 * GET /api/products/category/:categoryId
 */
export const getProductsByCategory = async (categoryId) => {
  const response = await axios.get(`${BASE_URL}/category/${categoryId}`);
  return response.data;
};

/**
 * Search products by a free-text query against name, category, and description.
 */
export const searchProducts = async (query) => {
  const products = await getAllProductsCached();
  const searchTerm = (query || '').trim().toLowerCase();

  if (!searchTerm) {
    return Array.isArray(products) ? products : [];
  }

  return (Array.isArray(products) ? products : []).filter((product) => {
    const categoryName = product.categoryName || product.category?.categoryName || '';
    const searchableText = `${product.name || ''} ${categoryName} ${product.description || ''}`.toLowerCase();
    return searchableText.includes(searchTerm);
  });
};
