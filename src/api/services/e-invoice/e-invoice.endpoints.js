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

  VIEW_BERFORE_SEND_INVOICE: '/api/einvoice/v1/invoice/view-send-invoice-cqt',
  SEND_INVOICE_CQT: '/api/einvoice/v1/invoice/send-invoice-cqt',

  SYNC_SALE_MINVOICE: '/api/v3/pos-client/sync-sale-minvoice',
  GET_STATUS: '/api/invoice/v1/status',
  SEARCH_BY_TAXCODE: '/api/search-by-tax-code',
  DELETE_DRAFT_INVOICE: '/api/einvoice/v1/invoice/delete-draft',
  AGREEMENT_PROTOCOL_LIST: '/api/einvoice/v1/electronic_invoice_minutes/list',
  AGREEMENT_PROTOCOL_CREATE: '/api/einvoice/v1/electronic_invoice_minutes/create',
  AGREEMENT_PROTOCOL_PDF: (id = '') => `/api/einvoice/v1/electronic_invoice_minutes/${id}/pdf`,
  NOTI_ERROR_LIST: '/api/einvoice/v1/error-notify/list',
  NOTI_ERROR_CREATE: '/api/einvoice/v1/error-notify/create',
  NOTI_ERROR_PDF: (id = '') => `/api/einvoice/v1/error-notify/pdf/${id}`,
  ERROR_TYPE_LIST: '/api/einvoice/v1/error-notify/type',
  INVOICE_TYPE_LIST: '/api/einvoice/v1/error-notify/type-invoice',
  FILTER_INVOICE_BY_NUMBERS: '/api/einvoice/v1/invoice/filter-by-numbers',

  GUEST_VAT_INFO: (id = '') => `/api/einvoice/v1/guest-vat-info${id ? `/${id}` : ''}`, // get, post, put, delete
  GUEST_SESSION: '/api/einvoice/v1/guest-session'
};
