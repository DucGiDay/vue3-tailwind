import { defineStore } from 'pinia';

export const useGlobalStore = defineStore('global', {
  state: () => ({
    brandsInStorage: [],
    brandUid: null,
    currentBrand: {},

    currentUser: {}
  }),

  // getters: {
  //   brandsInStorage: (state) => state.brandsInStorage,
  //   brandUid: (state) => state.brandUid,
  //   currentBrand: (state) => state.currentBrand,

  //   currentUser: (state) => state.currentUser
  // },

  actions: {
    setGlobalState(state) {
      Object.keys(state).forEach((key) => {
        this[key] = state?.[key] || this[key];
      });
    }
  }
});
