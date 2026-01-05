import apiClient from '@/api/axiosClient';
export default {
  login(payload) {
    return apiClient.post('auth/login', payload);
  }
};
