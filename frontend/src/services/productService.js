import axios from 'axios';

const BASE_URL = '/api/products';

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
 * Fetch products filtered by category.
 * GET /api/products/category/:categoryId
 */
export const getProductsByCategory = async (categoryId) => {
  const response = await axios.get(`${BASE_URL}/category/${categoryId}`);
  return response.data;
};
