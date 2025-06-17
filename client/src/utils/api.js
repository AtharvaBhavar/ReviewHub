import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
};

// Products API
export const productsAPI = {
  getAll: () => api.get('/products'),
  seed: () => api.post('/products/seed'),
  getById: (id) => api.get(`/products/${id}`),
};

// ReviewsAPI
export const reviewsAPI = {
  getByProduct: (productId) => api.get(`/reviews/product/${productId}`),
  create: (reviewData) =>
    api.post('/reviews', reviewData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAverage: (productId) => api.get(`/reviews/average/${productId}`),
  getUserStatus: (productId) => api.get(`/reviews/status/${productId}`),
};

export default api;
