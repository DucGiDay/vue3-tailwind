import { defineStore } from 'pinia';

const SHARED_STATE_KEYS = ['brandUid', 'currentBrand', 'currentUser'];

export const useGlobalStore = defineStore('global', {
  state: () => ({
    brandUid: null,
    currentBrand: {},
    currentUser: {}
  }),

  getters: {
    storesAccessibleInCurrentBrand(state) {
      const cities = state.currentBrand.cities || [];
      return cities.flatMap((city) => city.stores);
    },

    storesIdAccessibleInCurrentBrand(_) {
      return this.storesAccessibleInCurrentBrand.map((store) => store.id);
    },

    storesPermissionActive(state) {
      return (state.currentUser.brands || []).flatMap((brand) =>
        brand.cities.flatMap((city) => city.stores.filter((store) => store.active === 1))
      );
    },

    storesIdPermissionActive(_) {
      return this.storesPermissionActive.map((store) => store.id);
    },

    brandsInStorage(state) {
      return state.currentUser?.brands || [];
    }
  },

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
      this.brandUid = null;
      this.currentBrand = {};
      this.currentUser = {};
    }
  }
});
