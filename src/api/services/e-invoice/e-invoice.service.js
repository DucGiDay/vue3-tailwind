import api from '@/api/axios';
import { INVOICE_ENDPOINTS } from './e-invoice.endpoints';

export const invoiceService = {
  // Dashboard Invoice
  getListRecentInvoice: (params) => api.get(INVOICE_ENDPOINTS.LIST_RECENT_INVOCIE, { params }),
  getStatisticInvoice: (params) => api.get(INVOICE_ENDPOINTS.STATISTIC_INVOICES_IN_DAYS, { params }),
  getTotalQuantityInvoices: (params) => api.get(INVOICE_ENDPOINTS.TOTAL_QUANTITY_INVOICES, { params }),
  getStatusInvoices: (params) => api.get(INVOICE_ENDPOINTS.STATUS_INVOICE, { params }),
  getDailyStatistics: (params) => api.get(INVOICE_ENDPOINTS.DAILY_STATISTICS, { params }),

  // Invoice Manage
  getVatInvoice: (params) => api.get(INVOICE_ENDPOINTS.VAT_INVOCIE, { params }),
};
