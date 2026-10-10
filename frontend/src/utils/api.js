import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 15000,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('zuri_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('zuri_token');
      localStorage.removeItem('zuri_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/password', data),
  addAddress: (data) => API.post('/auth/address', data),
};

// Products
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (slug) => API.get(`/products/${slug}`),
  getRelated: (id) => API.get(`/products/${id}/related`),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
  getAllAdmin: (params) => API.get('/products/admin/all', { params }),
   getFilters: () => API.get('/products/filters'),
};

// Categories
export const categoryAPI = {
  getAll: () => API.get('/categories'),
  getOne: (slug) => API.get(`/categories/${slug}`),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`),
};

// Cart
export const cartAPI = {
  get: () => API.get('/cart'),
  add: (data) => API.post('/cart/add', data),
  update: (itemId, data) => API.put(`/cart/item/${itemId}`, data),
  remove: (itemId) => API.delete(`/cart/item/${itemId}`),
  clear: () => API.delete('/cart/clear'),
};

// Wishlist
export const wishlistAPI = {
  get: () => API.get('/wishlist'),
  toggle: (productId) => API.post('/wishlist/toggle', { productId }),
};

// Orders
export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMy: () => API.get('/orders/my'),
  getOne: (id) => API.get(`/orders/${id}`),
  createRazorpay: (data) => API.post('/orders/razorpay/create', data),
  verifyRazorpay: (data) => API.post('/orders/razorpay/verify', data),
  getAll: (params) => API.get('/orders/admin/all', { params }),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
};

// Reviews
export const reviewAPI = {
  add: (productId, data) => API.post(`/reviews/${productId}`, data),
  delete: (productId, reviewId) => API.delete(`/reviews/${productId}/${reviewId}`),
};

// Admin
export const adminAPI = {
  getDashboard: () => API.get('/admin/dashboard'),
  getUsers: () => API.get('/admin/users'),
  toggleUser: (id) => API.put(`/admin/users/${id}/toggle`),
};

// Upload
export const uploadAPI = {
  uploadImage: (formData) => API.post('/upload/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadImages: (formData) => API.post('/upload/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteImage: (publicId) => API.delete('/upload/image', { data: { publicId } }),
};

export const chatAPI = {
  send:      (text)  => API.post('/chat/send', { text }),
  getMyChat: ()       => API.get('/chat/my-chat'),
};

export const adminChatAPI = {
  getAll:        (params)        => API.get('/admin/chats', { params }),
  getOne:        (id)            => API.get(`/admin/chats/${id}`),
  reply:         (id, text)      => API.post(`/admin/chats/${id}/reply`, { text }),
  updateStatus:  (id, status)    => API.patch(`/admin/chats/${id}/status`, { status }),
};

// and TrackingSection (latest tracking dot + full timeline dots).
export const STATUS_STYLES = {
  pending:   { badge: 'bg-amber-50 text-amber-700 border border-amber-200',   dot: 'bg-amber-400',  icon: '⏳' },
  unshipped: { badge: 'bg-blue-50 text-blue-700 border border-blue-200',      dot: 'bg-blue-500',   icon: '📦' },
  delivered: { badge: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500', icon: '🎉' },
  cancelled: { badge: 'bg-red-50 text-red-700 border border-red-200',         dot: 'bg-red-400',    icon: '✕' },
  returned:  { badge: 'bg-orange-50 text-orange-700 border border-orange-200', dot: 'bg-orange-400', icon: '↩' },
};

export const fmt = (n) => Number(n || 0).toLocaleString('en-IN');
 
export const fmtDate = (d, opts) =>
  new Date(d).toLocaleDateString('en-IN', opts || { day: 'numeric', month: 'short', year: 'numeric' });
 
export const fmtDateTime = (d) =>
  new Date(d).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

export default API;
