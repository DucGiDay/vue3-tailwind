export const INVOICE_ENDPOINTS = {
  // Dashboard E-Invoice
  LIST_RECENT_INVOCIE: '/api/einvoice/v1/dashboard/recent-invoices',
  STATISTIC_INVOICES_IN_DAYS: '/api/einvoice/v1/dashboard/statistic-invoices-in-days',
  TOTAL_QUANTITY_INVOICES: '/api/invoice/v1/count/remaining_invoice',
  STATUS_INVOICE: '/api/einvoice/v1/dashboard/status-invoices',
  DAILY_STATISTICS: '/api/einvoice/v1/dashboard/daily-statistics',
  GET_SALE_BY_LIST_TRAN_ID: '/api/v3/pos-cms/get-sale-by-list-tran-id',
  SALE_CHANGE_LOG: '/api/v3/pos-cms/sale-change-log',

  // Invoice manage
  VAT_INVOCIE: '/api/v3/pos-cms/vat-invoice',
  SALE_NOT_SYNC_VAT: '/api/v3/pos-client/sale-not-sync-vat',

  // Config store
  STORE_SETTING_INVOICE: '/api/invoice/v1/store-setting-invoice',
  LIST_STORE_SETTING_INVOICE: '/api/invoice/v1/stores/active-invoice-config',

  // Export
  EXPORT_XML: '/api/einvoice/v1/invoice/get-xml',
  EXPORT_PDF: '/api/einvoice/v1/invoice/get-pdf',
  RESEND_EMAIL: '/api/einvoice/v1/invoice/resend-email',

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
  GUEST_SESSION: '/api/einvoice/v1/guest-session',
  LIST_SERIAL_INVOICE: '/api/einvoice/v1/invoice_serials/list',
  CREATE_SERIAL_INVOICE: '/api/einvoice/v1/invoice_serials/create',
  SERIAL_INVOICE_TEMPLATE: '/api/einvoice/v1/invoice_serials/template',

  LIST_POS_CONFIG_TIME: '/api/einvoice/v1/mtt_schedule_config/list',
  CREATE_POS_CONFIG_TIME: '/api/einvoice/v1/mtt_schedule_config/create',
  UPDATE_POS_CONFIG_TIME: (id = '') => `/api/einvoice/v1/mtt_schedule_config/${id}`,
  LIST_POS_INVOICE: '/api/einvoice/v1/batch_invoice/invoices',
  CREATE_POS_INVOICE: '/api/einvoice/v1/batch_invoice/create_and_send',
  LIST_BATCH_INVOICE: '/api/einvoice/v1/batch_invoice/list',

  // Report Invoice API
  PREVIEW_REPORT: '/api/invoice/v1/invoice-report/preview',
  EXPORT_REPORT: '/api/invoice/v1/invoice-report/export',
  EXPORT_REPORT_HISTORY: '/api/invoice/v1/invoice-report/export/history',
};
