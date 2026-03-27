import api from '@/api/axios';
import { INVOICE_ENDPOINTS } from './e-invoice.endpoints';

export const invoiceService = {
  // Dashboard Invoice
  getListRecentInvoice: (params) => api.get(INVOICE_ENDPOINTS.LIST_RECENT_INVOCIE, { params }),
  getStatisticInvoice: (params) =>
    api.get(INVOICE_ENDPOINTS.STATISTIC_INVOICES_IN_DAYS, { params }),
  getTotalQuantityInvoices: (params) =>
    api.get(INVOICE_ENDPOINTS.TOTAL_QUANTITY_INVOICES, { params }),
  getStatusInvoices: (params) => api.get(INVOICE_ENDPOINTS.STATUS_INVOICE, { params }),
  getDailyStatistics: (params) => api.get(INVOICE_ENDPOINTS.DAILY_STATISTICS, { params }),

  // Invoice Manage
  getVatInvoice: (params) => api.get(INVOICE_ENDPOINTS.VAT_INVOCIE, { params }),
  getSaleNotSyncVat: (params) => api.get(INVOICE_ENDPOINTS.SALE_NOT_SYNC_VAT, { params }),

  getStoreSettingInvoice: (params) =>
    api.get(INVOICE_ENDPOINTS.LIST_STORE_SETTING_INVOICE, { params }),
  updateStoreSettingInvoice: (payload) =>
    api.post(INVOICE_ENDPOINTS.STORE_SETTING_INVOICE, payload),

  exportXML: (params) => api.get(INVOICE_ENDPOINTS.EXPORT_XML, { params }),
  exportPDF: (params) => api.get(INVOICE_ENDPOINTS.EXPORT_PDF, { params }),

  getListStoreGroupByTaxCode: (params) =>
    api.get(INVOICE_ENDPOINTS.LIST_STORE_GROUP_BY_TAXCODE, { params }),

  viewInvoice: (params) => api.get(INVOICE_ENDPOINTS.VIEW_INVOICE, { params }),
  syncSaleMinvoice: (payload) => api.post(INVOICE_ENDPOINTS.SYNC_SALE_MINVOICE, payload),

  getImageInvoice: (url, config) => api.get(url, { noAuth: true, ...config })
};
