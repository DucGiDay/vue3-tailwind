// stores/report.js
import { defineStore } from 'pinia';
import { reportService } from '@/api/services/report/report.service';
import { handleReportResponse } from '@/common/utils/response.handler';
import { wait } from '@/common/utils/common';

export const useReportStore = defineStore('report', {
  state: () => ({
    checkAndReviewSaleDetailWithAccountingData: {}, // D05
    checkAndReviewSaleWithAccountingData: {} // D07
  }),

  actions: {
    _setReport(key, data) {
      this[key] = { ...this[key], ...data };
    },

    async getCheckAndReviewSaleDetailWithAccountingReport(payload) {
      try {
        const {
          last_id = null,
          last_tran_id = null,
          next_cursor = null
        } = this.checkAndReviewSaleDetailWithAccountingData || {};
        const onFetchData = async () => {
          const response = await reportService.getCheckAndReviewSaleDetailWithAccountingReport({
            ...payload,
            ...(last_id ? { last_id } : {}),
            ...(last_tran_id ? { last_tran_id } : {}),
            ...(next_cursor ? { last_tran_date: next_cursor } : {})
          });
          if (response?.code === 409) {
            await wait(5000);
            await onFetchData();
          }
        };
        await onFetchData();
        this._setReport(
          'checkAndReviewSaleDetailWithAccountingData',
          handleReportResponse(response)
        );
      } catch (err) {
        this._setReport('checkAndReviewSaleDetailWithAccountingData', { error: err.message });
        throw err;
      }
    },

    async getCheckAndReviewSaleWithAccountingReport(payload) {
      try {
        const { next_cursor = null } = this.checkAndReviewSaleWithAccountingData || {};
        const onFetchData = async () => {
          const response = await reportService.getCheckAndReviewSaleWithAccountingReport({
            ...payload,
            ...(next_cursor ? { last_tran_date: next_cursor } : {})
          });
          if (response?.code === 409) {
            await wait(5000);
            await onFetchData();
          }
        };
        await onFetchData();
        this._setReport('checkAndReviewSaleWithAccountingData', handleReportResponse(response));
      } catch (err) {
        this._setReport('checkAndReviewSaleWithAccountingData', { error: err.message });
        throw err;
      }
    }
  }
});
