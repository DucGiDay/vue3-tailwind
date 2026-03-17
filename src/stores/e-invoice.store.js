import { defineStore } from 'pinia';
import { invoiceService } from '@/api/services/e-invoice/e-invoice.service';

export const useEInoiveStore = defineStore('eInoive', {
  state: () => ({
    recentInvoice: {},
    statisticInvoice: {},
    totalQuantityInvoices: {},
    statusInvoices: {},
    dailyStatistics: {},
    vatInvoice: {}
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
    }
  }
});
