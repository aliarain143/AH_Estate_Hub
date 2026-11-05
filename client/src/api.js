import axios from 'axios';
// Replace this line:
// const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api' });

// With this:
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('estatehub_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default api;
