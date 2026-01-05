import service from '@/service';
import { defineStore } from 'pinia';
export const useCategoryStore = defineStore('category', {
  state: () => ({
    typies: []
  }),
  getters: {},

  actions: {
    async getCategories(payload) {
      try {
        const res = await service.category.getCategories(payload);
        this.typies = (res.data || []).map((item) => ({ label: item.label, des: item.des, id: item.id }));
        return res;
      } catch (error) {
        return {
          success: false,
          message: error?.message || 'Lỗi không xác định',
          error
        };
      }
    },
    async getDetailCategory(payload) {
      try {
        return service.category.getCategory(payload);
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
