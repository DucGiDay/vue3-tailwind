import axios from 'axios';
import { useAuthStore } from '@/stores/auth.store';
import router from '@/router';
import { getCookie } from '@/common/utils/common';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // https://posapi.ipos.vn/
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

instance.interceptors.request.use(
  (config) => {
    const headers = {
      fabi_type: localStorage.getItem('fabi-type') || 'pos-cms',
      access_token: import.meta.env.VITE_ACCESS_TOKEN,
      'x-client-timezone': new Date().getTimezoneOffset() * -60000,
      'accept-language': 'vi',
      Authorization: !config?.noAuth ? localStorage.getItem('token') || '' : ''
    };

    // Đính kèm visitor_id (g-x) cho mọi yêu cầu (Hỗ trợ cross-domain)
    // const visitorId = getCookie('g-x') || localStorage.getItem('stable_visitor_id');
    // if (visitorId) {
    //   headers['g-x'] = visitorId;
    // }

    config.headers = Object.assign({}, headers, config.headers);

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response.data, // unwrap data luôn
  async (error) => {
    const { response } = error;

    if (response?.status === 401) {
      // const authStore = useAuthStore();
      // await authStore.logout();
      router.push('/login');
    }

    if (response?.status === 403) {
      router.push('/forbidden');
    }

    // Normalize error để service/component xử lý thống nhất
    return Promise.reject({
      status: response?.status,
      message:
        response?.data?.message ||
        response?.data?.error?.debug_message ||
        response?.data?.error?.message ||
        'Có lỗi xảy ra',
      error: response || null
    });
  }
);

export default instance;
