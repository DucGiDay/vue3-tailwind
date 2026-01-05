import service from '@/service';
import { defineStore } from 'pinia';
export const useStoreManageStore = defineStore('store', {
  state: () => ({}),
  getters: {},

  actions: {
    async getStores(payload) {
      try {
        return service.store.getStores(payload);
      } catch (error) {
        return {
          success: false,
          message: error?.message || 'Lỗi không xác định',
          error
        };
      }
    },
    async getDetailStore(payload) {
      try {
        return service.store.getStore(payload);
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
