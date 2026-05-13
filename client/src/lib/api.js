import axios from 'axios';
import { store } from '../store/store';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      store.dispatch({ type: 'auth/logout/fulfilled' });
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;