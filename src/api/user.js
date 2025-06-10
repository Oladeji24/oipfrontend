// src/api/user.js
// API utility for user management (admin)
import api from './index';

export const getUsers = () => api.get('/users');
export const getUser = (id) => api.get(`/users/${id}`);
export const flagUser = (id, status) => api.post(`/users/${id}/flag`, { status });
