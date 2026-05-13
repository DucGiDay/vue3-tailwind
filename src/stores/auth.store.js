// stores/auth.store.js
import { defineStore } from 'pinia';
import { authService } from '@/api/services/auth/auth.service';

export const useAuthStore = defineStore('auth', {
  state: () => ({}),

  getters: {},

  actions: {
    async logout() {
      try {
        // await authService.logout();
        const tableLayoutOnboarding = localStorage.getItem('tableLayoutOnboarding');
        localStorage.clear();
        if (tableLayoutOnboarding !== null) {
          localStorage.setItem('tableLayoutOnboarding', tableLayoutOnboarding);
        }
        sessionStorage.clear();
      } catch (_) {
      } finally {
        this._setLogout();
      }
    },

    _setLogout() {
      const tableLayoutOnboarding = localStorage.getItem('tableLayoutOnboarding');
      localStorage.clear();
      if (tableLayoutOnboarding !== null) {
        localStorage.setItem('tableLayoutOnboarding', tableLayoutOnboarding);
      }
      sessionStorage.clear();
    }
  }
});
