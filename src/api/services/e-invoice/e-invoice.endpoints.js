export const INVOICE_ENDPOINTS = {
  // Dashboard E-Invoice
  LIST_RECENT_INVOCIE: '/api/einvoice/v1/dashboard/recent-invoices',
  STATISTIC_INVOICES_IN_DAYS: '/api/einvoice/v1/dashboard/statistic-invoices-in-days',
  TOTAL_QUANTITY_INVOICES: '/api/invoice/v1/count/remaining_invoice',
  STATUS_INVOICE: '/api/einvoice/v1/dashboard/status-invoices',
  DAILY_STATISTICS: '/api/einvoice/v1/dashboard/daily-statistics',

  // Invoice manage
  VAT_INVOCIE: '/api/v3/pos-cms/vat-invoice',
  SALE_NOT_SYNC_VAT: '/api/v3/pos-client/sale-not-sync-vat',

  // Config store
  STORE_SETTING_INVOICE: '/api/invoice/v1/store-setting-invoice',
  LIST_STORE_SETTING_INVOICE: '/api/invoice/v1/stores/active-invoice-config',

  // Export
  EXPORT_XML: '/api/einvoice/v1/invoice/get-xml',
  EXPORT_PDF: '/api/einvoice/v1/invoice/get-pdf',

  LIST_STORE_GROUP_BY_TAXCODE: '/api/einvoice/v1/invoice/list-store-group-by-taxcode',

  VIEW_INVOICE: '/api/einvoice/v1/invoice/view'
};
