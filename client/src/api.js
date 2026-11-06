import axios from 'axios';

// Live production Vercel par dynamic fallback '/api', aur local development par localhost:5000/api
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return window.location.hostname === 'localhost'
    ? 'http://localhost:5000/api'
    : '/api';
};

const api = axios.create({ 
  baseURL: getBaseURL()
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('estatehub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;