// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
//   withCredentials: true,
// });

// // ── Auth token injection ─────────────────────────────────────────
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // ── Products ─────────────────────────────────────────────────────
// // getAll params: { limit, page, category(slug or id), isActive,
// //                 isFeatured, isNewArrival, isBestSeller,
// //                 search, sort, minPrice, maxPrice, size, season }
// export const productAPI = {
//   getAll:     (params = {}) => api.get('/products', { params }),
//   getOne:     (slug)        => api.get(`/products/${slug}`),
//   getRelated: (id)          => api.get(`/products/${id}/related`),
//   addReview:  (id, data)    => api.post(`/products/${id}/reviews`, data),
// };

// // ── Categories ───────────────────────────────────────────────────
// export const categoryAPI = {
//   getAll: () => api.get('/categories'),
//   getOne: (slug) => api.get(`/categories/${slug}`),
// };

// // ── Auth ─────────────────────────────────────────────────────────
// export const authAPI = {
//   register: (data)  => api.post('/auth/register', data),
//   login:    (data)  => api.post('/auth/login', data),
//   logout:   ()      => api.post('/auth/logout'),
//   me:       ()      => api.get('/auth/me'),
// };

// // ── Cart ─────────────────────────────────────────────────────────
// export const cartAPI = {
//   get:    ()                            => api.get('/cart'),
//   add:    (productId, size, color, qty) => api.post('/cart', { productId, size, color, quantity: qty }),
//   update: (itemId, qty)                 => api.put(`/cart/${itemId}`, { quantity: qty }),
//   remove: (itemId)                      => api.delete(`/cart/${itemId}`),
//   clear:  ()                            => api.delete('/cart'),
// };

// // ── Orders ───────────────────────────────────────────────────────
// export const orderAPI = {
//   create:  (data) => api.post('/orders', data),
//   getAll:  ()     => api.get('/orders'),
//   getOne:  (id)   => api.get(`/orders/${id}`),
// };

// export default api;

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
  getFilters: () => axios.get('/api/products/filters'),
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
  send:      (text)  => API.post('/chat/send', { text }),
  getMyChat: ()       => API.get('/chat/my-chat'),
};

export const adminChatAPI = {
  getAll:        (params)        => API.get('/admin/chats', { params }),
  getOne:        (id)            => API.get(`/admin/chats/${id}`),
  reply:         (id, text)      => API.post(`/admin/chats/${id}/reply`, { text }),
  updateStatus:  (id, status)    => API.patch(`/admin/chats/${id}/status`, { status }),
};

export default api;