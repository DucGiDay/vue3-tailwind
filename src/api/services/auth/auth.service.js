// auth/auth.service.js
import api from '@/api/axios';
import { AUTH_ENDPOINTS } from './auth.endpoints';

export const authService = {
  logout: () => api.post(AUTH_ENDPOINTS.LOGOUT, {}, { noAuth: true })
};
