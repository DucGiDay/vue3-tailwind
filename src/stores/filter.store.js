// Các filter được đồng bộ với host app
import { defineStore } from 'pinia';
import moment from 'moment';

export const useFilterStore = defineStore('filter', {
  state: () => getDefaultFilter(),

  actions: {
    updateFilter(newFilter) {
      Object.assign(this, newFilter);
    },

    resetFilter() {
      this.$reset();
    },
  },
});

function getDefaultFilter() {
  return {
    activeMem: 0,
    report: {
      start_date: new Date().setHours(0, 0, 0, 0),
      end_date: new Date().setHours(23, 59, 59, 999),
      stores_uid: [],
      store_uid: '',
      store_compared_uid: '',
      stores_compared_uid: [],
    },
    invoice: {
      store_uid_by_tax_code: {},
      start_date: moment().subtract(6, 'days').startOf('day').valueOf(),
      end_date: moment().endOf('day').valueOf(),
    },
  };
}
