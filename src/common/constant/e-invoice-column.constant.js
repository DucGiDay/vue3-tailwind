// Columns Tổng quan - Hóa đơn gần nhất
export const LAST_BILL_TABLE_COLUMNS = [
  { field: 'vat_invoice_series', header: 'Ký hiệu' },
  { field: 'vat_invoice_number', header: 'Số hóa đơn điện tử' },
  { field: 'merged_tran_id', header: 'Mã tra cứu' },
  { field: 'vat_invoice_code', header: 'Mã CQT' },
  { field: 'extra_data', header: 'Người mua' },
  { field: 'vat_publish_status', header: 'Trạng thái' },
  { field: 'vat_invoice_date', header: 'Ngày hóa đơn' },
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
    alignFrozen: 'right',
  },
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
    format: 'date',
  },
  { field: 'total_amount', header: 'Tổng tiền', format: 'currency' },
  {
    field: 'invoice_type',
    header: 'Loại hóa đơn',
    classes: '!fb-text-muted-color',
  },
  {
    field: 'action',
    header: '',
    frozen: true,
    alignFrozen: 'right',
    style: { width: '3rem', minWidth: '3rem', padding: '0 0 0 0.25rem !important' },
  },
];

// Columns Hóa đơn bán hàng
export const SALE_ORDER_TABLE_COLUMNS = [
  {
    field: 'tran_id',
    header: 'Mã hóa đơn',
    format: 'truncate',
    frozen: true,
    alignFrozen: 'left',
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
    format: 'datetime',
  },
  {
    field: 'end_date',
    header: 'Thời gian ra',
  },
];

// Columns Biên bản thỏa thuận - Danh sách
export const AGREEMENT_PROTOCOL_TABLE_COLUMNS = [
  { field: 'customer', header: 'Khách hàng' },
  { field: 'origin_invoice', header: 'Hóa đơn sai' },
  { field: 'replace_invoice', header: 'Hóa đơn xử lý' },
  {
    field: 'record_invoice',
    header: 'Biên bản',
  },
  {
    field: 'action',
    header: '',
    frozen: true,
    alignFrozen: 'right',
    style: { width: '3rem', minWidth: '3rem', padding: '0 0 0 0.25rem !important' },
  },
];

// Columns Thông báo sai sót - Danh sách
export const NOTI_ERROR_TABLE_COLUMNS = [
  { field: 'serial', header: 'Ký hiệu' },
  { field: 'reference_key', header: 'Mã tra cứu' },
  { field: 'merged_tran_id', header: 'Mã hóa đơn' },
  { field: 'invoice_number_error', header: 'Số hóa đơn' },
  { field: 'pattern', header: 'Mẫu số' },
  { field: 'status', header: 'Trạng thái' },
  { field: 'type_error', header: 'Loại sai sót' },
  { field: 'extra_data', header: 'Lý do' },
  {
    field: 'created_at',
    header: 'Ngày tạo',
    classes: '!fb-text-muted-color',
    format: 'date',
  },
  {
    field: 'action',
    header: '',
    frozen: true,
    alignFrozen: 'right',
    style: { width: '5rem', minWidth: '5rem', padding: '0 0 0 0.25rem !important' },
  },
];

// Columns Ký hiệu hóa đơn
export const SERIAL_INVOICE_TABLE_COLUMNS = [
  { field: 'register_name', header: 'Mẫu hóa đơn' },
  { field: 'pattern', header: 'Mẫu số' },
  { field: 'serial', header: 'Ký hiệu' },
  { field: 'status', header: 'Trạng thái' },
  { field: 'extra_data.start_no', header: 'Dải số MTT' },
  { field: 'start_date', header: 'Ngày bắt đầu', format: 'date' },
  { field: 'note', header: 'Ghi chú' },
];

// Columns Bảng kê hóa đơn hàng tháng
export const MONTHLY_INVOICE_LIST_COLUMNS = [
  { field: 'invoice_series', header: 'Ký hiệu' },
  { field: 'invoice_number', header: 'Số hóa đơn' },
  { field: 'invoice_date', header: 'Ngày phát hành', format: 'date' },
  { field: 'buyer_name', header: 'Tên người mua' },
  { field: 'buyer_tax_code', header: 'Mã số thuế người mua' },
  { field: 'payment_method', header: 'Phương thức thanh toán' },
  { field: 'amount_before_tax', header: 'Doanh số bán chưa có thuế', format: 'currency' },
  { field: 'vat_amount', header: 'Thuế GTGT', format: 'currency' },
  { field: 'note', header: 'Ghi chú' },
  { field: 'reference_code', header: 'Mã tra cứu' },
];

// Columns Báo cáo chi tiết bán hàng
export const DETAIL_SALES_COLUMNS = [
  { field: 'buyer_name', header: 'Đơn vị mua hàng' },
  { field: 'buyer_tax_code', header: 'MST đơn vị mua hàng' },
  { field: 'buyer_code', header: 'Mã khách hàng' },
  { field: 'buyer_id', header: 'Căn cước' },
  { field: 'passport', header: 'Hộ chiếu' },
  { field: 'buyer_address', header: 'Địa chỉ' },
  { field: 'sale_date', header: 'Ngày bán (Xuất HD)', format: 'date' },
  { field: 'invoice_template', header: 'Mẫu HĐ' },
  { field: 'serial', header: 'Ký hiệu' },
  { field: 'invoice_number', header: 'Số HĐ' },
  { field: 'description', header: 'Diễn giải' },
  { field: 'item_id', header: 'Mã hàng' },
  { field: 'item_name', header: 'Tên hàng' },
  { field: 'unit_id', header: 'ĐVT' },
  { field: 'quantity', header: 'Số lượng' },
  { field: 'unit_price', header: 'Đơn giá', format: 'currency' },
  { field: 'discount', header: 'Chiết khấu', format: 'currency' },
  { field: 'revenue', header: 'Doanh thu', format: 'currency' },
  { field: 'vat_rate', header: 'Thuế suất' },
  { field: 'vat_amount', header: 'Tiền thuế', format: 'currency' },
  { field: 'total_amount', header: 'Thành tiền', format: 'currency' },
  { field: 'exchange_rate', header: 'Tỷ giá' },
  { field: 'note', header: 'Ghi chú' },
  { field: 'tran_id', header: 'Mã đơn hàng' },
  { field: 'lookup_code', header: 'Mã đặt hàng' },
  { field: 'reference_code', header: 'Mã tra cứu' },
];

// Columns Báo cáo tổng hợp bán hàng
export const SUMMARY_SALES_COLUMNS = [
  { field: 'item_id', header: 'Mã hàng' },
  { field: 'item_name', header: 'Tên hàng' },
  { field: 'unit_id', header: 'ĐVT' },
  { field: 'quantity', header: 'Số lượng' },
  { field: 'unit_price', header: 'Đơn giá', format: 'currency' },
  { field: 'revenue', header: 'Doanh thu', format: 'currency' },
  { field: 'discount', header: 'Chiết khấu', format: 'currency' },
  { field: 'vat_amount', header: 'Tiền thuế', format: 'currency' },
  { field: 'total_amount', header: 'Thành tiền', format: 'currency' },
  { field: 'note', header: 'Ghi chú' },
];
// Columns Bảng kê chi tiết hóa đơn
export const DETAIL_INVOICE_LIST_COLUMNS = [
  { field: 'invoice_series', header: 'Ký hiệu' },
  { field: 'invoice_number', header: 'Số HĐ' },
  { field: 'buyer_tax_code', header: 'MST khách hàng' },
  { field: 'buyer_name', header: 'Tên khách hàng' },
  { field: 'invoice_date', header: 'Ngày phát hành', format: 'date' },
  { field: 'payment_method', header: 'PTTT' },
  { field: 'total_amount', header: 'Tổng tiền', format: 'currency' },
  { field: 'status', header: 'Trạng thái' },
];

export const HISTORY_ACTION_COLUMNS = [
  { field: 'timestamp', header: 'Thời gian', format: 'datetime' },
  { field: 'updated_by', header: 'Người thao tác' },
  { field: 'tax_code', header: 'Mã số thuế' },
  { field: 'series', header: 'Ký hiệu' },
  { field: 'action_desc', header: 'Thao tác' },
  {
    field: 'detail',
    header: '',
    frozen: true,
    alignFrozen: 'right',
    style: { width: '3rem', minWidth: '3rem', padding: '0 0 0 0.25rem !important' },
  },
];
