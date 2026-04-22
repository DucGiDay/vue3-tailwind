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
  getSaleByListTranId: (params) => api.get(INVOICE_ENDPOINTS.GET_SALE_BY_LIST_TRAN_ID, { params }),
  getSaleChangeLog: (params) => api.get(INVOICE_ENDPOINTS.SALE_CHANGE_LOG, { params }),

  // Quản lý hóa đơn
  getVatInvoice: (params) => api.get(INVOICE_ENDPOINTS.VAT_INVOCIE, { params }),

  // Hóa đơn bán hàng
  getSaleNotSyncVat: (params) => api.get(INVOICE_ENDPOINTS.SALE_NOT_SYNC_VAT, { params }),

  // Danh sách store được cấu hình
  getStoreSettingInvoice: (params) =>
    api.get(INVOICE_ENDPOINTS.LIST_STORE_SETTING_INVOICE, { params }),

  // Tạo/sửa cấu hình store
  updateStoreSettingInvoice: (payload) =>
    api.post(INVOICE_ENDPOINTS.STORE_SETTING_INVOICE, payload),

  // Export XML/PDF
  exportXML: (params) => api.get(INVOICE_ENDPOINTS.EXPORT_XML, { params }),
  exportPDF: (params) => api.get(INVOICE_ENDPOINTS.EXPORT_PDF, { params }),
  sendEmail: (payload) => api.post(INVOICE_ENDPOINTS.RESEND_EMAIL, payload),

  // Danh sách store theo mã số thuế
  getListStoreGroupByTaxCode: (params) =>
    api.get(INVOICE_ENDPOINTS.LIST_STORE_GROUP_BY_TAXCODE, { params }),

  // Xem trước khi gửi CQT
  viewInvoice: (payload) => api.post(INVOICE_ENDPOINTS.VIEW_BERFORE_SEND_INVOICE, payload),
  // Gửi CQT
  sendInvoiceCqt: (payload) => api.post(INVOICE_ENDPOINTS.SEND_INVOICE_CQT, payload),

  // API xuất vat
  syncSaleMinvoice: (payload) => api.post(INVOICE_ENDPOINTS.SYNC_SALE_MINVOICE, payload),

  // API kiểm tra trạng thái (handle sửa/xóa/xuất lại hóa đơn)
  getStatus: (params) => api.get(INVOICE_ENDPOINTS.GET_STATUS, { params }),

  // Lấy thông tin khách hàng theo mã số thuế
  searchByTaxCode: (params) => api.get(INVOICE_ENDPOINTS.SEARCH_BY_TAXCODE, { params }),

  // Xóa Hóa đơn dự thảo
  deleteDraftInvoice: (payload) =>
    api.delete(INVOICE_ENDPOINTS.DELETE_DRAFT_INVOICE, { data: payload }),

  // Danh sách thông tin vat đã lưu
  getGuestVatInfo: (params) =>
    api.get(INVOICE_ENDPOINTS.GUEST_VAT_INFO(), { params, noAuth: true, withCredentials: true }),
  // Tạo thông tin vat
  createGuestVatInfo: (payload) =>
    api.post(INVOICE_ENDPOINTS.GUEST_VAT_INFO(), payload, { noAuth: true, withCredentials: true }),
  // Cập nhật thông tin vat
  updateGuestVatInfo: (id, payload) =>
    api.put(INVOICE_ENDPOINTS.GUEST_VAT_INFO(id), payload, { noAuth: true, withCredentials: true }),
  // Xóa thông tin vat
  deleteGuestVatInfo: (id) =>
    api.delete(INVOICE_ENDPOINTS.GUEST_VAT_INFO(id), { noAuth: true, withCredentials: true }),
  // API guest session
  getGuestSession: (params) =>
    api.get(INVOICE_ENDPOINTS.GUEST_SESSION, { params, noAuth: true, withCredentials: true }),

  // Danh sách biên bản thỏa thuận
  getAgreementProtocolList: (params) =>
    api.get(INVOICE_ENDPOINTS.AGREEMENT_PROTOCOL_LIST, { params }),
  // Tạo biên bản thỏa thuận
  createAgreementProtocol: (payload) =>
    api.post(INVOICE_ENDPOINTS.AGREEMENT_PROTOCOL_CREATE, payload),
  // View/Download PDF biên bản thỏa thuận
  getAgreementProtocolPdf: (id) => api.get(INVOICE_ENDPOINTS.AGREEMENT_PROTOCOL_PDF(id)),

  // Danh sách thông báo sai sót
  getNotiErrorList: (params) => api.get(INVOICE_ENDPOINTS.NOTI_ERROR_LIST, { params }),
  // Tạo thông báo sai sót
  createNotiError: (payload) => api.post(INVOICE_ENDPOINTS.NOTI_ERROR_CREATE, payload),
  // View/Download PDF thông báo sai sót
  getNotiErrorPdf: (id) => api.get(INVOICE_ENDPOINTS.NOTI_ERROR_PDF(id)),
  // Danh sách loại sai sót
  getErrorTypeList: (params) => api.get(INVOICE_ENDPOINTS.ERROR_TYPE_LIST, { params }),

  // Danh sách loại hóa đơn
  getInvoiceTypeList: (params) => api.get(INVOICE_ENDPOINTS.INVOICE_TYPE_LIST, { params }),

  // Lấy thông tin khi người dùng nhập form tạo sai sót
  filterInvoiceByNumbers: (payload) =>
    api.post(INVOICE_ENDPOINTS.FILTER_INVOICE_BY_NUMBERS, payload),

  // API tùy chỉnh
  customService: (url, config) => api.get(url, { noAuth: true, ...config }),

  updateInvoiceByQr: (payload, headers) =>
    api.post('/api/invoice/v1/update-invoice/by-qr', payload, { headers, noAuth: true })
};
