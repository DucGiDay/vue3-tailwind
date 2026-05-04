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
  { field: 'register_name', header: 'Mẫu hóa đơn' },
  { field: 'pattern', header: 'Mẫu số' },
  { field: 'serial', header: 'Ký hiệu' },
  { field: 'status', header: 'Trạng thái' },
  { field: 'extra_data.start_no', header: 'Dải số MTT' },
  { field: 'start_date', header: 'Ngày bắt đầu', format: 'date' },
  { field: 'note', header: 'Ghi chú' }
];
