import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';
import router from '@/router';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

instance.interceptors.request.use(
  (config) => {
    config.headers = Object.assign({}, config.headers, {
      fabi_type: localStorage.getItem('fabi-type') || 'pos-cms',
      access_token: import.meta.env.VITE_ACCESS_TOKEN,
      'x-client-timezone': new Date().getTimezoneOffset() * -60000,
      Authorization: localStorage.getItem('token') || '',
      'accept-language': 'vi'
    });

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response.data, // unwrap data luôn
  async (error) => {
    const { response } = error;

    if (response?.status === 401) {
      const authStore = useAuthStore();
      await authStore.logout();
      router.push('/login');
    }

    if (response?.status === 403) {
      router.push('/forbidden');
    }

    // Normalize error để service/component xử lý thống nhất
    return Promise.reject({
      status: response?.status,
      message: response?.data?.message || 'Có lỗi xảy ra',
      errors: response?.data?.errors || null
    });
  }
);

export default instance;
