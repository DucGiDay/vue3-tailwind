export const INVOICE_STATUS = {
  valid_invoices: 'Hóa đơn không hợp lệ',
  rejected_invoices: 'Hóa đơn bị từ chối',
  sent_invoices: 'Hóa đơn đã gửi TCTN',
  summarized_invoices: 'Hóa đơn đã nằm trong danh sách tổng hợp',
  unsend_invoices: 'Hóa đơn chưa gửi TCTN',
  invalid_invoices: 'Hóa đơn hợp lệ'
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

  '-1': 'Không xác định'
};

// Mapping màu cho trạng thái hóa đơn
export const VAT_PUBLISH_STATUS_COLOR = {
  // # Hóa đơn chưa gửi TCTN
  0: { label: 'Hóa đơn chưa gửi TCTN', class: 'fb-text-warning-700 fb-bg-warning-100' },
  1: { label: 'Hóa đơn chưa gửi TCTN', class: 'fb-text-warning-700 fb-bg-warning-100' },
  2: { label: 'Hóa đơn chưa gửi TCTN', class: 'fb-text-warning-700 fb-bg-warning-100' },
  3: { label: 'Hóa đơn chưa gửi TCTN', class: 'fb-text-warning-700 fb-bg-warning-100' },

  // # Hóa đơn đã nằm trong danh sách tổng hợp
  4000: {
    label: 'Hóa đơn đã nằm trong danh sách tổng hợp',
    class: 'fb-text-primary-700 fb-bg-primary-100'
  },
  4001: {
    label: 'Hóa đơn đã nằm trong danh sách tổng hợp',
    class: 'fb-text-primary-700 fb-bg-primary-100'
  },
  4002: {
    label: 'Hóa đơn đã nằm trong danh sách tổng hợp',
    class: 'fb-text-primary-700 fb-bg-primary-100'
  },
  4003: {
    label: 'Hóa đơn đã nằm trong danh sách tổng hợp',
    class: 'fb-text-primary-700 fb-bg-primary-100'
  },

  // # Hóa đơn bị TCTN từ chối
  8000: { label: 'Hóa đơn bị TCTN từ chối', class: 'fb-text-error-700 fb-bg-error-100' },
  8001: { label: 'Hóa đơn bị TCTN từ chối', class: 'fb-text-error-700 fb-bg-error-100' },
  8002: { label: 'Hóa đơn bị TCTN từ chối', class: 'fb-text-error-700 fb-bg-error-100' },
  8003: { label: 'Hóa đơn bị TCTN từ chối', class: 'fb-text-error-700 fb-bg-error-100' },

  // # Hóa đơn đã gửi TCTN
  12000: { label: 'Hóa đơn đã gửi TCTN', class: 'fb-text-primary-700 fb-bg-primary-100' },
  12001: { label: 'Hóa đơn đã gửi TCTN', class: 'fb-text-primary-700 fb-bg-primary-100' },
  12002: { label: 'Hóa đơn đã gửi TCTN', class: 'fb-text-primary-700 fb-bg-primary-100' },
  12003: { label: 'Hóa đơn đã gửi TCTN', class: 'fb-text-primary-700 fb-bg-primary-100' },

  // # Hóa đơn không hợp lệ
  24000: { label: 'Hóa đơn không hợp lệ', class: 'fb-text-error-700 fb-bg-error-100' },
  24001: { label: 'Hóa đơn không hợp lệ', class: 'fb-text-error-700 fb-bg-error-100' },
  24002: { label: 'Hóa đơn không hợp lệ', class: 'fb-text-error-700 fb-bg-error-100' },
  24003: { label: 'Hóa đơn không hợp lệ', class: 'fb-text-error-700 fb-bg-error-100' },

  // # Hóa đơn hợp lệ
  28000: { label: 'Hóa đơn hợp lệ', class: 'fb-text-success-700 fb-bg-success-100' },
  28001: { label: 'Hóa đơn hợp lệ', class: 'fb-text-success-700 fb-bg-success-100' },
  28002: { label: 'Hóa đơn hợp lệ', class: 'fb-text-success-700 fb-bg-success-100' },
  28003: { label: 'Hóa đơn hợp lệ', class: 'fb-text-success-700 fb-bg-success-100' },
  32000: { label: 'Hóa đơn hợp lệ', class: 'fb-text-success-700 fb-bg-success-100' },

  null: { label: 'Hóa đơn dự thảo', class: 'fb-text-gray-blue-700 fb-bg-gray-blue-100' },
  '-1': { label: 'Không xác định', class: 'fb-text-gray-700 fb-bg-gray-100 fb-border' }
};

// Fiter trang thái trang Quản lý hóa đơn
export const VAT_PUBLISH_STATUS_LIST = [
  { label: 'Hóa đơn nháp', value: '1' },
  { label: 'Đã phát hành', value: '2' },
  { label: 'Chưa đồng bộ', value: '3' },
  { label: 'Phát hành lỗi', value: '4' }
];

export const INVOICE_PARTNERS = [
  { name: 'IPOS-INVOICE', code: 'IPOSINVOICE' },
  { name: 'M-INVOICE', code: 'MINVOICE' },
  { name: 'ME-INVOICE', code: 'MEINVOICE' },
  { name: 'S-INVOICE', code: 'SINVOICE' },
  { name: 'VNPT-INVOICE', code: 'VNPTINVOICE' }
];

// Columns Tổng quan - Hóa đơn gần nhất
export const LAST_BILL_TABLE_COLUMNS = [
  { field: 'vat_invoice_series', header: 'Ký hiệu' },
  { field: 'vat_invoice_number', header: 'Số hóa đơn điện tử' },
  { field: 'merged_tran_id', header: 'Mã tra cứu' },
  { field: 'vat_invoice_code', header: 'Mã CQT' },
  { field: 'extra_data', header: 'Người mua' },
  { field: 'vat_publish_status', header: 'Trạng thái' },
  { field: 'vat_invoice_date', header: 'Ngày hóa đơn' }
];

// Columns Cấu hình - Danh sách cấu hình
export const STORE_CONFIG_TABLE_COLUMNS = [
  { field: 'store_name', header: 'Cửa hàng', frozen: true },
  { field: 'partner_id', header: 'Đối tác' },
  { field: 'fb_store_id', header: 'POS ID' },
  { field: 'inv_user_name', header: 'Tài khoản' },
  { field: 'inv_tax_code', header: 'Mã số thuế' },
  { field: 'inv_series', header: 'Ký hiệu' },
  { field: 'mau_hd', header: 'Mẫu hóa đơn' },
  { field: 'version', header: 'Phiên bản' },
  {
    field: 'action',
    header: '',
    style: { padding: '0 0.5rem !important' },
    frozen: true,
    alignFrozen: 'right'
  }
];

// Columns Quản lý hóa đơn
export const INVOICE_MANAGE_TABLE_COLUMNS = [
  { field: 'inv_series', header: 'Ký hiệu' },
  { field: 'tran_id', header: 'Mã tra cứu' },
  { field: 'vat_publish_status', header: 'Trạng thái' },
  { field: 'vat_invoice_number', header: 'Số hóa đơn', classes: '!fb-text-muted-color' },
  { field: 'inv_buyerDisplayName', header: 'Người mua', classes: '!fb-text-muted-color' },
  { field: 'inv_buyerLegalName', header: 'Thông tin khách hàng' },
  {
    field: 'vat_invoice_date',
    header: 'Ngày hóa đơn',
    classes: '!fb-text-muted-color',
    format: 'date'
  },
  { field: 'total_amount', header: 'Tổng tiền', format: 'currency' },
  {
    field: 'invoice_type',
    header: 'Loại hóa đơn',
    classes: '!fb-text-muted-color'
  },
  {
    field: 'action',
    header: '',
    frozen: true,
    alignFrozen: 'right',
    style: { width: '3rem', minWidth: '3rem', padding: '0 0 0 0.25rem !important' }
  }
];

// Columns Hóa đơn bán hàng
export const SALE_ORDER_TABLE_COLUMNS = [
  {
    field: 'tran_id',
    header: 'Mã hóa đơn',
    format: 'truncate',
    frozen: true,
    alignFrozen: 'left'
  },
  { field: 'vat_invoice_number', header: 'Số hóa đơn điện tử' },
  { field: 'vat_amount', header: 'Giá trị VAT', sortable: true },
  { field: 'shift_id', header: 'Mã ca', format: 'truncate' },
  { field: 'staff', header: 'Nhân viên' },
  { field: 'table_name', header: 'Bàn' },
  { field: 'area_name', header: 'Khu vực' },
  { field: 'total_amount', header: 'Tổng tiền', format: 'currency' },
  {
    field: 'start_date',
    header: 'Thời gian vào',
    format: 'datetime'
  },
  {
    field: 'end_date',
    header: 'Thời gian ra'
  }
];

// Columns Biên bản thỏa thuận - Danh sách
export const AGREEMENT_PROTOCOL_TABLE_COLUMNS = [
  { field: 'customer', header: 'Khách hàng' },
  { field: 'origin_invoice', header: 'Hóa đơn sai' },
  { field: 'replace_invoice', header: 'Hóa đơn xử lý' },
  {
    field: 'record_invoice',
    header: 'Biên bản'
  },
  {
    field: 'action',
    header: '',
    frozen: true,
    alignFrozen: 'right',
    style: { width: '3rem', minWidth: '3rem', padding: '0 0 0 0.25rem !important' }
  }
];

// Columns Thông báo sai sót - Danh sách
export const NOTI_ERROR_TABLE_COLUMNS = [
  { field: 'serial', header: 'Ký hiệu' },
  { field: 'reference_key', header: 'Mã tra cứu' },
  { field: 'invoice_number_error', header: 'Số hóa đơn' },
  { field: 'pattern', header: 'Mẫu số' },
  { field: 'status', header: 'Trạng thái' },
  { field: 'type_error', header: 'Loại sai sót' },
  { field: 'extra_data', header: 'Lý do' },
  {
    field: 'created_at',
    header: 'Ngày tạo',
    classes: '!fb-text-muted-color',
    format: 'date'
  },
  {
    field: 'action',
    header: '',
    frozen: true,
    alignFrozen: 'right',
    style: { width: '5rem', minWidth: '5rem', padding: '0 0 0 0.25rem !important' }
  }
];

// Columns Ký hiệu hóa đơn
export const SERIAL_INVOICE_TABLE_COLUMNS = [
  { field: 'inv_pattern_name', header: 'Mẫu hóa đơn' },
  { field: 'inv_pattern', header: 'Mẫu số' },
  { field: 'inv_series', header: 'Ký hiệu' },
  { field: 'status', header: 'Trạng thái' },
  { field: 'mtt_range', header: 'Dải số MTT' },
  { field: 'current_number', header: 'Số hiện tại' },
  { field: 'start_date', header: 'Ngày bắt đầu', format: 'date' },
  { field: 'note', header: 'Ghi chú' }
];
