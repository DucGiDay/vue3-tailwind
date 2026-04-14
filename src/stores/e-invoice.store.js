import { defineStore } from 'pinia';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';

export const useEInoiveStore = defineStore('eInoive', {
  state: () => ({
    recentInvoice: {},
    statisticInvoice: {},
    totalQuantityInvoices: {},
    statusInvoices: {},
    dailyStatistics: {},
    vatInvoice: {},
    errorTypeList: {},
    agreementProtocolList: {},
    saleNotSyncVat: {},
    storeSettingInvoices: {},
    listTaxStores: {
      data: [],
      isLoading: false
    },
    guestVatOptions: []
  }),

  getters: {
    dailyStatisticsData: (state) => state.dailyStatistics?.data || [],
    dailyStatisticsDate() {
      return this.dailyStatisticsData.map((e) => e.date);
    },
    dailyStatisticsInvoice() {
      return this.dailyStatisticsData.map((e) => e.total_invoices);
    }
  },

  actions: {
    async getListRecentInvoice(params) {
      try {
        this.recentInvoice.isLoading = true;
        const response = await invoiceService.getListRecentInvoice(params);
        this.recentInvoice.data = response?.data?.invoices || [];
      } catch (err) {
        this.recentInvoice.error = err?.message;
      } finally {
        this.recentInvoice.isLoading = false;
      }
    },

    async getStatisticInvoice(params) {
      try {
        this.statisticInvoice.isLoading = true;
        const response = await invoiceService.getStatisticInvoice(params);
        this.statisticInvoice.data = response?.data || {};
      } catch (err) {
        this.statisticInvoice.error = err?.message;
      } finally {
        this.statisticInvoice.isLoading = false;
      }
    },

    async getTotalQuantityInvoices(params) {
      try {
        this.totalQuantityInvoices.isLoading = true;
        const response = await invoiceService.getTotalQuantityInvoices(params);
        this.totalQuantityInvoices.data = response?.data || {};
      } catch (err) {
        this.totalQuantityInvoices.error = err?.message;
      } finally {
        this.totalQuantityInvoices.isLoading = false;
      }
    },

    async getStatusInvoices(params) {
      try {
        this.statusInvoices.isLoading = true;
        const response = await invoiceService.getStatusInvoices(params);
        this.statusInvoices.data = response?.data || {};
        // this.statusInvoices.data = {
        //   valid_invoices: 234,
        //   unsend_invoices: 57,
        //   summarized_invoices: 89,
        //   rejected_invoices: 23,
        //   sent_invoices: 178,
        //   invalid_invoices: 12
        // };
      } catch (err) {
        this.statusInvoices.error = err?.message;
      } finally {
        this.statusInvoices.isLoading = false;
      }
    },

    async getDailyStatistics(params) {
      try {
        this.dailyStatistics.isLoading = true;
        const response = await invoiceService.getDailyStatistics(params);
        this.dailyStatistics.data = response?.data?.statistics || [];
        // this.dailyStatistics.data = [
        //   { date: '2026-03-07', total_invoices: 142 },
        //   { date: '2026-03-08', total_invoices: 87 },
        //   { date: '2026-03-09', total_invoices: 213 },
        //   { date: '2026-03-10', total_invoices: 56 },
        //   { date: '2026-03-11', total_invoices: 178 },
        //   { date: '2026-03-12', total_invoices: 95 },
        //   { date: '2026-03-13', total_invoices: 304 },
        //   { date: '2026-03-14', total_invoices: 121 }
        // ];
      } catch (err) {
        this.dailyStatistics.error = err?.message;
      } finally {
        this.dailyStatistics.isLoading = false;
      }
    },

    async getVatInvoice(params) {
      try {
        const response = await invoiceService.getVatInvoice(params);
        this.vatInvoice.data = response;
      } catch (err) {
        this.vatInvoice.error = err?.message;
      }
    },
    async getSaleNotSyncVat(params) {
      try {
        const response = await invoiceService.getSaleNotSyncVat(params);
        this.saleNotSyncVat.data = response;
      } catch (err) {
        this.saleNotSyncVat.error = err?.message;
      }
    },
    async getErrorType(params) {
      try {
        const response = await invoiceService.getVatInvoice(params);
        this.errorTypeList.data = response;
      } catch (err) {
        this.errorTypeList.error = err?.message;
      }
    },
    async getAgreementProtocolList(params) {
      try {
        const response = await invoiceService.getVatInvoice(params);
        this.agreementProtocolList.data = response;
      } catch (err) {
        this.agreementProtocolList.error = err?.message;
      }
    },
    async getStoreSettingInvoice(params) {
      try {
        const response = await invoiceService.getStoreSettingInvoice(params);
        this.storeSettingInvoices.data = response;
      } catch (err) {
        this.storeSettingInvoices.error = err?.message;
      }
    },
    async updateStoreSettingInvoice(payload) {
      try {
        const response = await invoiceService.updateStoreSettingInvoice(payload);
        return {
          data: response?.data || null,
          error: null
        };
      } catch (err) {
        return {
          data: null,
          error: err
        };
      }
    },

    async getListStoreGroupByTaxCode(params) {
      if (this.listTaxStores.data.length > 0) return;
      try {
        this.listTaxStores.isLoading = true;
        const response = await invoiceService.getListStoreGroupByTaxCode(params);
        this.listTaxStores.data = response?.data || [];
      } catch (err) {
        console.error('Error getListStoreGroupByTaxCode', err);
      } finally {
        this.listTaxStores.isLoading = false;
      }
    },
    async exportVatInvoice(payload) {
      try {
        const response = await invoiceService.syncSaleMinvoice(payload);
        return {
          data: response?.data || null,
          error: null
        };
      } catch (err) {
        return {
          data: null,
          error: err
        };
      }
    },
    async fetchGuestVatInfo(params, config) {
      try {
        const response = await invoiceService.getGuestVatInfo(params, config);
        this.guestVatOptions = response?.data || [];
      } catch (err) {
        console.error('Error fetchGuestVatInfo', err);
        this.guestVatOptions = [];
      }
    },
    async fetchGuestSession(params, config) {
      try {
        const response = await invoiceService.getGuestSession(params, config);
        return response?.data || null;
      } catch (err) {
        console.error('Error fetchGuestSession', err);
        return null;
      }
    }
  }
});
