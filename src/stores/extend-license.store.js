import { defineStore } from 'pinia';
import { extendLicenseService } from '@/api/services/extend-license/extend-license.service';
import { handleListHasTotalPageResponse } from '@/common/utils/response.handler';

export const useExtendLicenseStore = defineStore('extendLicense', {
  state: () => ({
    orderHistory: {},
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
        const response = await extendLicenseService.getListOrderHistory(params);
        this.orderHistory = handleListHasTotalPageResponse(response);
      } catch (err) {
        this.error = err?.message;
      } finally {
        this.isLoading = false;
      }
    },
    async getQRPayment(params) {
      try {
        const response = await extendLicenseService.getQRPayment(params);
        return response;
      } catch (err) {
        return err?.message;
      }
    }
  }
});
