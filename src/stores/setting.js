// stores/setting.js
import { defineStore } from 'pinia';
import { settingService } from '@/api/services/setting/setting.service';

export const useSettingStore = defineStore('setting', {
  state: () => ({
    orderHistory: [],
    isLoading: false,
    error: null
  }),

  getters: {
    isEmpty: (state) => !state.isLoading && state.orderHistory.length === 0
  },

  actions: {
    async getListOrderHistory(params) {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await settingService.getListOrderHistory(params);
        this.orderHistory = response?.data?.data || [];
      } catch (err) {
        this.error = err.message;
      } finally {
        this.isLoading = false;
      }
    }
  }
});
