import { defineStore } from 'pinia';

const SHARED_STATE_KEYS = ['brandsInStorage', 'brandUid', 'currentBrand', 'currentUser'];

export const useGlobalStore = defineStore('global', {
  state: () => ({
    brandsInStorage: [],
    brandUid: null,
    currentBrand: {},
    currentUser: {}
  }),

  actions: {
    setGlobalState(state) {
      if (!state || typeof state !== 'object') return;

      Object.keys(state).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(state, key)) {
          if (SHARED_STATE_KEYS.includes(key)) {
            this[key] = state[key];
          }
        }
      });
    },

    // Reset state khi unmount
    $reset() {
      this.brandsInStorage = [];
      this.brandUid = null;
      this.currentBrand = {};
      this.currentUser = {};
    }
  }
});
