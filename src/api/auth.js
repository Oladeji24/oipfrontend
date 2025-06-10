// src/api/auth.js
// API utility for authentication
import api from './index';

export const register = (name, email, password) => api.post('/register', { name, email, password });
export const login = (email, password) => api.post('/login', { email, password });
export const logout = () => api.post('/logout');
export const getCurrentUser = () => api.get('/user');
