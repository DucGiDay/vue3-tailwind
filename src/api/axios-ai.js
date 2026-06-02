import axios from 'axios';
import router from '@/router';

// Axios instance riêng cho AI backend (base URL khác với API chính)
const instanceAI = axios.create({
  baseURL: import.meta.env.VITE_API_AI_BASE_URL, // vd: https://fabi-ai.iposdev.com
  timeout: 120000, // AI response có thể chậm hơn
  headers: { 'Content-Type': 'application/json' }
});

instanceAI.interceptors.request.use(
  (config) => {
    config.headers = Object.assign(
      {
        Authorization: localStorage.getItem('token') || '',
        'x-client-timezone': new Date().getTimezoneOffset() * -60000,
        'accept-language': 'vi'
      },
      config.headers
    );
    return config;
  },
  (error) => Promise.reject(error)
);

instanceAI.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const { response } = error;
    if (response?.status === 401) {
      router.push('/login');
    }
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

export default instanceAI;
