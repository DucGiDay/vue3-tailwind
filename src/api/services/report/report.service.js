// api/services/report/report.service.js
import api from '@/api/axios';
import { SALE_AUDIT_REPORT_ENDPOINTS } from './report.endpoints';

export const reportService = {
  getCheckAndReviewSaleDetailWithAccountingReport: (params) => api.get(SALE_AUDIT_REPORT_ENDPOINTS.LIST, { params })
};
