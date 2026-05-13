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

  // Danh sách ký hiệu
  getSerialInvoice: (params) => api.get(INVOICE_ENDPOINTS.LIST_SERIAL_INVOICE, { params }),
  // Tạo ký hiệu
  createSerialInvoice: (payload) => api.post(INVOICE_ENDPOINTS.CREATE_SERIAL_INVOICE, payload),
  // Danh sách mẫu hóa đơn theo mst
  getSerialInvoiceTemplate: (params) =>
    api.get(INVOICE_ENDPOINTS.SERIAL_INVOICE_TEMPLATE, { params }),

  // Cập nhật thông tin vat bằng QR
  updateInvoiceByQr: (payload, headers) =>
    api.post('/api/invoice/v1/update-invoice/by-qr', payload, { headers, noAuth: true }),

  // Report API
  previewReport: async (payload) => {
    // Call API thật:
    return api.get(INVOICE_ENDPOINTS.PREVIEW_REPORT, { params: payload });

    // Mock data tạm thời vì BE chưa có API
    const mockRes = {
      data: {
        data: [
          {
            invoice_series: 'C26MOO',
            invoice_number: '00000104',
            invoice_date: 1777973460379,
            buyer_name: 'Khách không lấy hóa đơn',
            buyer_tax_code: '.',
            payment_method: '',
            amount_before_tax: 0.0,
            vat_rate: 0.0,
            vat_amount: 0.0,
            lookup_code: 'M1-26-LH6ZT-05700000104',
          },
          {
            invoice_series: 'C26MOO',
            invoice_number: '00000105',
            invoice_date: 1777973460704,
            buyer_name: 'Khách không lấy hóa đơn',
            buyer_tax_code: '.',
            payment_method: '',
            amount_before_tax: 0.0,
            vat_rate: 0.0,
            vat_amount: 0.0,
            lookup_code: 'M1-26-LH6ZT-05700000105',
          },
          {
            invoice_series: 'C26MOO',
            invoice_number: '00000106',
            invoice_date: 1777973460918,
            buyer_name: 'Khách không lấy hóa đơn',
            buyer_tax_code: '.',
            payment_method: '',
            amount_before_tax: 0.0,
            vat_rate: 0.0,
            vat_amount: 0.0,
            lookup_code: 'M1-26-LH6ZT-05700000106',
          },
          {
            invoice_series: 'C26MOO',
            invoice_number: '00000107',
            invoice_date: 1777973538475,
            buyer_name: 'Khách không lấy hóa đơn',
            buyer_tax_code: '.',
            payment_method: '',
            amount_before_tax: 0.0,
            vat_rate: 0.0,
            vat_amount: 0.0,
            lookup_code: 'M1-26-LH6ZT-05700000107',
          },
          {
            invoice_series: 'C26MOO',
            invoice_number: '00000108',
            invoice_date: 1777973538808,
            buyer_name: 'Khách không lấy hóa đơn',
            buyer_tax_code: '.',
            payment_method: '',
            amount_before_tax: 0.0,
            vat_rate: 0.0,
            vat_amount: 0.0,
            lookup_code: 'M1-26-LH6ZT-05700000108',
          },
          {
            invoice_series: 'C26MOO',
            invoice_number: '00000109',
            invoice_date: 1777973539018,
            buyer_name: 'Khách không lấy hóa đơn',
            buyer_tax_code: '.',
            payment_method: '',
            amount_before_tax: 0.0,
            vat_rate: 0.0,
            vat_amount: 0.0,
            lookup_code: 'M1-26-LH6ZT-05700000109',
          },
          {
            invoice_series: 'C26MAB',
            invoice_number: '00000014',
            invoice_date: 1777974270234,
            buyer_name: 'Khách không lấy hóa đơn',
            buyer_tax_code: '.',
            payment_method: '',
            amount_before_tax: 0.0,
            vat_rate: 0.0,
            vat_amount: 0.0,
            lookup_code: 'M1-26-LH6ZT-00900000014',
          },
          {
            invoice_series: 'C26MAB',
            invoice_number: '00000015',
            invoice_date: 1777974771567,
            buyer_name: 'Khách không lấy hóa đơn',
            buyer_tax_code: '.',
            payment_method: '',
            amount_before_tax: 0.0,
            vat_rate: 0.0,
            vat_amount: 0.0,
            lookup_code: 'M1-26-LH6ZT-00900000015',
          },
          {
            invoice_series: 'C26MAB',
            invoice_number: '00000017',
            invoice_date: 1778126492560,
            buyer_name: 'Khách không lấy hóa đơn',
            buyer_tax_code: '.',
            payment_method: '',
            amount_before_tax: 0.0,
            vat_rate: 0.0,
            vat_amount: 0.0,
            lookup_code: 'M1-26-LH6ZT-00900000017',
          },
          {
            invoice_series: 'C26MAB',
            invoice_number: '00000018',
            invoice_date: 1778142426165,
            buyer_name: 'Khách không lấy hóa đơn',
            buyer_tax_code: '.',
            payment_method: '',
            amount_before_tax: 0.0,
            vat_rate: 0.0,
            vat_amount: 0.0,
            lookup_code: 'None',
          },
          {
            invoice_series: 'C26MAB',
            invoice_number: '00000020',
            invoice_date: 1778222626682,
            buyer_name: 'Khách không lấy hóa đơn',
            buyer_tax_code: '.',
            payment_method: '',
            amount_before_tax: 0.0,
            vat_rate: 0.0,
            vat_amount: 0.0,
            lookup_code: 'M1-26-LH6ZT-00900000020',
          },
          {
            invoice_series: 'C26MAB',
            invoice_number: '00000021',
            invoice_date: 1778222630861,
            buyer_name: 'Khách không lấy hóa đơn',
            buyer_tax_code: '.',
            payment_method: '',
            amount_before_tax: 0.0,
            vat_rate: 0.0,
            vat_amount: 0.0,
            lookup_code: 'M1-26-LH6ZT-00900000021',
          },
        ],
        message: null,
        track_id: 'a6ee5c41-f56c-4b31-89a5-9506b1a0f79c',
        total: 12,
      },
    };

    const page = payload.page || 1;
    const size = payload.size || 10;
    const start = (page - 1) * size;
    const end = start + size;
    const paginatedData = mockRes.data.data.slice(start, end);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            data: paginatedData,
            total: mockRes.data.total,
          },
        });
      }, 500);
    });
  },

  // Report Invoice
  exportReportInvoice: async (payload) => {
    return api.post(INVOICE_ENDPOINTS.EXPORT_REPORT, payload, { responseType: 'blob' });
  },
  getExportReportHistory: async (params) => {
    return api.get(INVOICE_ENDPOINTS.EXPORT_REPORT_HISTORY, { params });
  },
};
