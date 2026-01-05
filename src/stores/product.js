import service from '@/service';
import { defineStore } from 'pinia';
export const useProductStore = defineStore('product', {
  state: () => ({}),
  getters: {},

  actions: {
    async getProducts(payload) {
      try {
        return service.menu.getProducts(payload);
      } catch (error) {
        return {
          success: false,
          message: error?.message || 'Lỗi không xác định',
          error
        };
      }
    },
    async getDetailProduct(payload) {
      try {
        return service.menu.getProduct(payload);
      } catch (error) {
        return {
          success: false,
          message: error?.message || 'Lỗi không xác định',
          error
        };
      }
    }
  }
});
