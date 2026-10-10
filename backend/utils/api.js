import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const productAPI = {
  getAll:     (params = {}) => api.get('/products', { params }),
  getOne:     (slug)        => api.get(`/products/${slug}`),
  getRelated: (id)          => api.get(`/products/${id}/related`),
  addReview:  (id, data)    => api.post(`/products/${id}/reviews`, data),
  getFilters: () => api.get('/products/filters'),
};

export const categoryAPI = {
  getAll: ()     => api.get('/categories'),
  getOne: (slug) => api.get(`/categories/${slug}`),
};

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  logout:   ()     => api.post('/auth/logout'),
  me:       ()     => api.get('/auth/me'),
};

export const cartAPI = {
  get:    ()                            => api.get('/cart'),
  add:    (productId, size, color, qty) => api.post('/cart', { productId, size, color, quantity: qty }),
  update: (itemId, qty)                 => api.put(`/cart/${itemId}`, { quantity: qty }),
  remove: (itemId)                      => api.delete(`/cart/${itemId}`),
  clear:  ()                            => api.delete('/cart'),
};

export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getAll: ()     => api.get('/orders'),
  getOne: (id)   => api.get(`/orders/${id}`),
};

export const adminAPI = {
  getDashboard:  ()            => api.get('/admin/dashboard'),       // ← added
  getAllProducts: (params = {}) => api.get('/products/admin/all', { params }),
  createProduct: (data)        => api.post('/products', data),
  updateProduct: (id, data)    => api.put(`/products/${id}`, data),
  deleteProduct: (id)          => api.delete(`/products/${id}`),
};

export const chatAPI = {
  send:      (text)  => api.post('/chat/send', { text }),
  getMyChat: ()       => api.get('/chat/my-chat'),
};

export const adminChatAPI = {
  getAll:        (params)        => api.get('/admin/chats', { params }),
  getOne:        (id)            => api.get(`/admin/chats/${id}`),
  reply:         (id, text)      => api.post(`/admin/chats/${id}/reply`, { text }),
  updateStatus:  (id, status)    => api.patch(`/admin/chats/${id}/status`, { status }),
};

export default api;
