export const INVOICE_STATUS = {
  valid_invoices: 'Hóa đơn không hợp lệ',
  rejected_invoices: 'Hóa đơn bị từ chối',
  sent_invoices: 'Hóa đơn đã gửi TCTN',
  summarized_invoices: 'Hóa đơn đã nằm trong danh sách tổng hợp',
  unsend_invoices: 'Hóa đơn chưa gửi TCTN',
  invalid_invoices: 'Hóa đơn hợp lệ',
};

// Mapping text cho trạng thái hóa đơn
export const VAT_PUBLISH_STATUS_MAPPING = {
  // # Hóa đơn chưa gửi TCTN
  0: 'Hóa đơn chưa gửi TCTN',
  1: 'Hóa đơn chưa gửi TCTN',
  2: 'Hóa đơn chưa gửi TCTN',
  3: 'Hóa đơn chưa gửi TCTN',

  // # Hóa đơn đã nằm trong danh sách tổng hợp
  4000: 'Hóa đơn đã nằm trong danh sách tổng hợp',
  4001: 'Hóa đơn đã nằm trong danh sách tổng hợp',
  4002: 'Hóa đơn đã nằm trong danh sách tổng hợp',
  4003: 'Hóa đơn đã nằm trong danh sách tổng hợp',

  // # Hóa đơn bị TCTN từ chối
  8000: 'Hóa đơn bị TCTN từ chối',
  8001: 'Hóa đơn bị TCTN từ chối',
  8002: 'Hóa đơn bị TCTN từ chối',
  8003: 'Hóa đơn bị TCTN từ chối',

  // # Hóa đơn đã gửi TCTN
  12000: 'Hóa đơn đã gửi TCTN',
  12001: 'Hóa đơn đã gửi TCTN',
  12002: 'Hóa đơn đã gửi TCTN',
  12003: 'Hóa đơn đã gửi TCTN',

  // # Hóa đơn không hợp lệ
  24000: 'Hóa đơn không hợp lệ',
  24001: 'Hóa đơn không hợp lệ',
  24002: 'Hóa đơn không hợp lệ',
  24003: 'Hóa đơn không hợp lệ',

  // # Hóa đơn hợp lệ
  28000: 'Hóa đơn hợp lệ',
  28001: 'Hóa đơn hợp lệ',
  28002: 'Hóa đơn hợp lệ',
  28003: 'Hóa đơn hợp lệ',
  32000: 'Hóa đơn hợp lệ',

  null: 'Hóa đơn dự thảo',

  '-1': 'Không xác định',
};

// Mapping màu cho trạng thái hóa đơn
export const VAT_PUBLISH_STATUS_COLOR = {
  // # Hóa đơn chưa gửi TCTN
  0: { label: 'Hóa đơn chưa gửi TCTN', severity: 'warn' },
  1: { label: 'Hóa đơn chưa gửi TCTN', severity: 'warn' },
  2: { label: 'Hóa đơn chưa gửi TCTN', severity: 'warn' },
  3: { label: 'Hóa đơn chưa gửi TCTN', severity: 'warn' },

  // # Hóa đơn đã nằm trong danh sách tổng hợp
  4000: {
    label: 'Hóa đơn đã nằm trong danh sách tổng hợp',
    severity: 'primary',
  },
  4001: {
    label: 'Hóa đơn đã nằm trong danh sách tổng hợp',
    severity: 'primary',
  },
  4002: {
    label: 'Hóa đơn đã nằm trong danh sách tổng hợp',
    severity: 'primary',
  },
  4003: {
    label: 'Hóa đơn đã nằm trong danh sách tổng hợp',
    severity: 'primary',
  },

  // # Hóa đơn bị TCTN từ chối
  8000: { label: 'Hóa đơn bị TCTN từ chối', severity: 'danger' },
  8001: { label: 'Hóa đơn bị TCTN từ chối', severity: 'danger' },
  8002: { label: 'Hóa đơn bị TCTN từ chối', severity: 'danger' },
  8003: { label: 'Hóa đơn bị TCTN từ chối', severity: 'danger' },

  // # Hóa đơn đã gửi TCTN
  12000: { label: 'Hóa đơn đã gửi TCTN', severity: 'info' },
  12001: { label: 'Hóa đơn đã gửi TCTN', severity: 'info' },
  12002: { label: 'Hóa đơn đã gửi TCTN', severity: 'info' },
  12003: { label: 'Hóa đơn đã gửi TCTN', severity: 'info' },

  // # Hóa đơn không hợp lệ
  24000: { label: 'Hóa đơn không hợp lệ', severity: 'danger' },
  24001: { label: 'Hóa đơn không hợp lệ', severity: 'danger' },
  24002: { label: 'Hóa đơn không hợp lệ', severity: 'danger' },
  24003: { label: 'Hóa đơn không hợp lệ', severity: 'danger' },

  // # Hóa đơn hợp lệ
  28000: { label: 'Hóa đơn hợp lệ', severity: 'success' },
  28001: { label: 'Hóa đơn hợp lệ', severity: 'success' },
  28002: { label: 'Hóa đơn hợp lệ', severity: 'success' },
  28003: { label: 'Hóa đơn hợp lệ', severity: 'success' },
  32000: { label: 'Hóa đơn hợp lệ', severity: 'success' },

  null: { label: 'Hóa đơn dự thảo', severity: 'secondary' },
  '-1': { label: 'Không xác định', severity: 'secondary' },
};

// Fiter trang thái trang Quản lý hóa đơn
export const VAT_PUBLISH_STATUS_LIST = [
  { label: 'Hóa đơn nháp', value: '1' },
  { label: 'Đã phát hành', value: '2' },
  { label: 'Chưa đồng bộ', value: '3' },
  { label: 'Phát hành lỗi', value: '4' },
];

export const INVOICE_PARTNERS = [
  { name: 'IPOS-INVOICE', code: 'IPOSINVOICE' },
  { name: 'M-INVOICE', code: 'MINVOICE' },
  { name: 'ME-INVOICE', code: 'MEINVOICE' },
  { name: 'S-INVOICE', code: 'SINVOICE' },
  { name: 'VNPT-INVOICE', code: 'VNPTINVOICE' },
];

// Mapping màu ký hiệu hóa đơn
export const SERIAL_INVOICE_COLOR = {
  0: { label: 'Không hoạt động', class: 'fb-text-gray-700 fb-bg-gray-100 fb-border' },
  1: { label: 'Hoạt động', class: 'fb-text-success-700 fb-bg-success-100' },
};
// Mapping màu Thông báo sai sót
export const NOTI_ERROR_STATUS_COLOR = {
  0: { label: 'Chưa gửi TCTN', severity: 'secondary' },
  1: { label: 'Đã gửi TCTN', severity: 'success' },
};

export const AGREEMENT_TYPE_MAP = {
  1: 'Biên bản thay thế hóa đơn',
  2: 'Biên bản điều chỉnh tăng',
  3: 'Biên bản điều chỉnh giảm',
  4: 'Biên bản điều chỉnh thông tin hóa đơn',
};

export const AGREEMENT_STATUS_MAP = {
  0: 'Chưa có chữ ký số',
  1: 'Người bán đã ký',
  2: 'Người bán và người mua đã ký',
};

export const CREATE_MTT_TABLE_COLUMNS = [
  { field: 'no', header: 'STT' },
  { field: 'merged_tran_id', header: 'Mã giao dịch' },
  { field: 'vat_invoice_code', header: 'Mẫu số' },
  { field: 'vat_invoice_series', header: 'Ký hiệu' },
  { field: 'vat_invoice_number', header: 'Số hóa đơn' },
  { field: 'vat_invoice_date', header: 'Ngày hóa đơn', format: 'date' },
];

export const STOP_ON_ERROR_OPTIONS = [
  { label: 'Dừng lại khi có lỗi', value: true },
  { label: 'Tiếp tục khi có lỗi', value: false },
];

export const QUANTITY_PACKAGE_OPTIONS = [
  { label: 'Gói 1 Hóa đơn', value: 1 },
  { label: 'Gói 10 Hóa đơn', value: 10 },
  { label: 'Gói 50 Hóa đơn', value: 50 },
  { label: 'Gói 100 Hóa đơn', value: 100 },
  { label: 'Gói 150 Hóa đơn', value: 150 },
  { label: 'Gói 200 Hóa đơn', value: 200 },
  { label: 'Gói 250 Hóa đơn', value: 250 },
];

export const MAX_RETRY_OPTIONS = [
  { label: '1 lần', value: 1 },
  { label: '2 lần', value: 2 },
  { label: '3 lần', value: 3 },
  { label: '4 lần', value: 4 },
  { label: '5 lần', value: 5 },
  { label: '6 lần', value: 6 },
  { label: '7 lần', value: 7 },
  { label: '8 lần', value: 8 },
  { label: '9 lần', value: 9 },
  { label: '10 lần', value: 10 },
];
