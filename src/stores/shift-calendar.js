import service from '@/service';
import { defineStore } from 'pinia';
export const useShiftCalendarStore = defineStore('shift_calendar', {
  state: () => ({}),
  getters: {},

  actions: {
    async listShiftCalendars(payload) {
      try {
        return service.shiftCalendar.listShiftCalendars(payload);
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
