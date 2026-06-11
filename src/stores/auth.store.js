// stores/auth.store.js
import { defineStore } from 'pinia';
import { authService } from '@/api/services/auth/auth.service';
import { useGlobalStore } from '@/stores/global.store';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isProcessing: false,
  }),

  getters: {},

  actions: {
    async processLogin(payload) {
      
      this.isProcessing = true;
      try {
        const response = await authService.login(payload);
        console.log(response);
        
        return await this.handleLoginResponse(response);
      } finally {
        this.isProcessing = false;
      }
    },

    async handleLoginResponse(response) {
      const data = response?.data || response;
      const companies = data?.companies;

      if (companies && companies.length) {
        this.isProcessing = false;
        return {
          isChooseCompany: true,
          companies,
        };
      }

      const { user, brands, cities, stores, token, ...rest } = data;

      if (token) {
        localStorage.setItem('token', token);
      }
      localStorage.setItem('fabi-type', user?.is_fabi === 3 ? 'box-cms' : 'pos-cms');

      const brandsCitiesStores = brands
        ? brands.map((brand) => {
            const storesInBrand = stores
              ? stores.filter((store) => store.brand_uid === brand.id)
              : [];
            const citiesIdInBrand = [...new Set(storesInBrand.map((store) => store.city_uid))];
            const citiesInBrand = citiesIdInBrand.map((cityId) => ({
              ...(cities ? cities.find(({ id }) => id === cityId) : {}),
              stores: [],
            }));
            citiesInBrand.forEach((city) => {
              city.stores = storesInBrand.filter((store) => store.city_uid === city.id);
            });
            return {
              ...brand,
              cities: citiesInBrand,
            };
          })
        : [];

      const userInfo = {
        ...user,
        ...rest,
        brands: brandsCitiesStores,
        company_id: rest.company?.company_id,
      };

      console.log('brandsCitiesStores', brandsCitiesStores);
      const current_brand =
        !!brandsCitiesStores && brandsCitiesStores.length ? brandsCitiesStores[0] : {};

      localStorage.setItem('user', JSON.stringify(userInfo));
      localStorage.setItem('current_brand', JSON.stringify(current_brand));

      const globalStore = useGlobalStore();
      globalStore.setGlobalState({ currentUser: userInfo, currentBrand: current_brand });

      window.dispatchEvent(new Event('updateStorage'));
      return data;
    },

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
    },
  },
});
