import { defineStore } from 'pinia';

const SHARED_STATE_KEYS = ['brandUid', 'currentBrand', 'currentUser'];

export const useGlobalStore = defineStore('global', {
  state: () => ({
    brandUid: null,
    currentBrand: JSON.parse(localStorage.getItem('current_brand')) || {},
    currentUser: JSON.parse(localStorage.getItem('user')) || {},
  }),

  getters: {
    // Danh sách stores trong brand hiện tại
    currentBrandStores(state) {
      const cities = state.currentBrand?.cities || [];
      return cities.flatMap((city) => city.stores);
    },

    currentBrandStoreIds(_) {
      return this.currentBrandStores.map((store) => store.id);
    },

    // Danh sách stores được phân quyền tới user
    storesPermissionActive(state) {
      return (state.currentUser?.brands || []).flatMap((brand) =>
        brand.cities.flatMap((city) => city.stores.filter((store) => store.active === 1)),
      );
    },

    storesIdPermissionActive(_) {
      return this.storesPermissionActive.map((store) => store.id);
    },

    // Danh sách brands trong storage
    brandsInStorage(state) {
      return state.currentUser?.brands || [];
    },

    // Danh sách stores trong tất cả brands
    allStores(_) {
      const brands = this.brandsInStorage || [];
      return brands.flatMap((brand) => brand.cities.flatMap((city) => city.stores));
    },

    // Map store_uid -> store object
    storesById(_) {
      const stores = this.allStores || [];
      return stores.reduce((acc, s) => {
        acc[s.id] = s;
        return acc;
      }, {});
    },
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
    },
  },
});
