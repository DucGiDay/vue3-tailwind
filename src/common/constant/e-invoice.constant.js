export const INVOICE_STATUS = {
  valid_invoices: 'Hóa đơn không hợp lệ',
  rejected_invoices: 'Hóa đơn bị từ chối',
  sent_invoices: 'Hóa đơn đã gửi TCTN',
  summarized_invoices: 'Hóa đơn đã nằm trong danh sách tổng hợp',
  unsend_invoices: 'Hóa đơn chưa gửi TCTN',
  invalid_invoices: 'Hóa đơn hợp lệ'
};

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

export const VAT_PUBLISH_STATUS_LIST = [
  // { label: 'Hóa đơn chưa gửi TCTN', value: '0,1,2,3' },
  // { label: 'Hóa đơn đã nằm trong danh sách tổng hợp', value: '4000,4001,4002,4003' },
  // { label: 'Hóa đơn bị TCTN từ chối', value: '8000,8001,8002,8003' },
  // { label: 'Hóa đơn đã gửi TCTN', value: '12000,12001,12002,12003' },
  // { label: 'Hóa đơn không hợp lệ', value: '24000,24001,24002,24003' },
  // { label: 'Hóa đơn hợp lệ', value: '28000,28001,28002,28003,32000' },
  // { label: 'Hóa đơn dự thảo', value: 'null' },
  // { label: 'Không xác định', value: '-1' }
  { label: 'Hóa đơn nháp', value: '1' },
  { label: 'Đã phát hành', value: '2' },
  { label: 'Chưa đồng bộ', value: '3' },
  { label: 'Phát hành lỗi', value: '4' }
];

// export const INVOICE_PARTNERS = ['iPOS-invoice', 'M-invoice', 'Me-invoice', 'S-invoice', 'VNPT-invoice'];
export const INVOICE_PARTNERS = [
  { name: 'IPOS-INVOICE', code: 'IPOSINVOICE' },
  { name: 'M-INVOICE', code: 'MINVOICE' },
  { name: 'ME-INVOICE', code: 'MEINVOICE' },
  { name: 'S-INVOICE', code: 'SINVOICE' },
  { name: 'VNPT-INVOICE', code: 'VNPTINVOICE' }
];

const acceptZeroVatObj = {
  label: 'Cho phép xuất vat 0%',
  id: 'accept_zero_vat',
  type: 'checkbox'
};

const blockExportVat0d = {
  label: 'Chặn xuất VAT với hóa đơn 0đ',
  id: 'block_export_vat_0d',
  type: 'checkbox'
};

const invTaxCode = { label: 'Mã số thuế', id: 'inv_tax_code', rules: ['required'], isReplaceSpace: true };

const exportVatInvoiceDateIsTranDate = {
  label: 'Cho phép xuất VAT ngày xuất là thời gian in bill',
  id: 'export_vat_invoice_date_is_tran_date',
  type: 'checkbox'
};

const version = {
  label: 'Phiên bản',
  id: 'version',
  type: 'radio',
  options: [
    { text: 'Version 1', value: 'invoice_v1' },
    { text: 'Version 2', value: 'invoice_v2' }
  ]
};

const showDiscountByItem = {
  label: 'Mẫu HDDT hiển thị chiết khấu theo từng mặt hàng',
  id: 'config_template_v2',
  type: 'checkbox'
};

const moneyConfigMeinvoice = {
  label: 'Cho phép thập phân đơn giá, thành tiền',
  id: 'money_config_meinvoice',
  type: 'checkbox'
};

export const STORE_CONNECT_PARTNER_CONFIG_KEYS = {
  MINVOICE: [
    invTaxCode,
    { label: 'Mẫu hoá đơn', id: 'inv_template_id', rules: ['required'] },
    { label: 'Ký hiệu', id: 'inv_series', rules: ['required'] },
    {
      label: 'Thông tư',
      id: 'inv_circulars',
      type: 'radio',
      defaultValue: 'circulars_78',
      hide: () => true,
      options: [
        { text: 'Thông tư 32', value: 'circulars_32' },
        { text: 'Thông tư 78', value: 'circulars_78' }
      ]
    },
    version
    // showDiscountByItem,
    // acceptZeroVatObj,
    // {
    //   label: 'Cho phép Ký tự động',
    //   id: 'enable_savesign',
    //   type: 'checkbox'
    // },
    // blockExportVat0d,

    // exportVatInvoiceDateIsTranDate,
    // moneyConfigMeinvoice
  ],
  MEINVOICE: [
    { label: 'Tài khoản', id: 'inv_user_name', rules: ['required'] },
    { label: 'Mật khẩu', id: 'inv_password', rules: ['required'] },
    invTaxCode,
    { label: 'Ký hiệu', id: 'inv_series', rules: ['required'] },
    version
    // acceptZeroVatObj,
    // {
    //   label: 'Cho phép Ký tự động',
    //   tooltip:
    //     '<ul><li>+ Điều kiện áp dụng: Khách hàng cần sử dụng chữ ký HSM</li><li>+ Khách hàng muốn tự động gửi HĐ lên CQT, vui lòng liên hệ kinh doanh Misa để hỗ trợ cấu hình trên Me-Invoice</li></ul>',
    //   id: 'enable_savesign',
    //   type: 'checkbox',
    //   hide: (c) => c.version == 'invoice_v1'
    // },
    // blockExportVat0d,
    // exportVatInvoiceDateIsTranDate,
    // {
    //   label: 'Cho phép thập phân đơn giá, thành tiền',
    //   id: 'money_config_meinvoice',
    //   type: 'checkbox'
    // },
    // {
    //   label: 'Cho phép gửi mail sau khi xuất vat',
    //   id: 'is_send_email',
    //   type: 'checkbox'
    // }
  ],
  SINVOICE: [
    { label: 'Tài khoản', id: 'inv_user_name', rules: ['required'] },
    { label: 'Mật khẩu', id: 'inv_password', rules: ['required'] },
    invTaxCode,
    { label: 'Ký hiệu', id: 'inv_series', rules: ['required'] },
    // acceptZeroVatObj,
    // blockExportVat0d,
    // exportVatInvoiceDateIsTranDate,
    // moneyConfigMeinvoice,
    version
  ],
  VNPTINVOICE: [
    { label: 'Link trang đăng nhập VNPT', id: 'link_api_vnpt', rules: ['required'] },
    invTaxCode,
    { label: 'Tài khoản admin', id: 'inv_user_name', rules: ['required'] },
    { label: 'Mật khẩu admin', id: 'inv_password', rules: ['required'] },
    { label: 'Mẫu hoá đơn', id: 'inv_template_id', rules: ['required'] },
    { label: 'Tài khoản service', id: 'inv_user_name_service', rules: ['required'] },
    { label: 'Mật khẩu service', id: 'inv_password_service', rules: ['required'] },
    { label: 'Ký hiệu', id: 'inv_series', rules: ['required'] },
    {
      ...version,
      label: 'Phiên bản',
      tooltip:
        '<ul><li>Version 1: Tạo hóa đơn ở trạng thái nháp</li><li>Version 2: Phát hành hóa đơn máy tính tiền</li></ul>'
    }
    // acceptZeroVatObj,
    // blockExportVat0d
  ],
  IPOSINVOICE: [
    { label: 'Tài khoản', id: 'inv_user_name', rules: ['required'] },
    { label: 'Mật khẩu', id: 'inv_password', rules: ['required'] },
    invTaxCode,
    { label: 'Ký hiệu', id: 'inv_series', rules: ['required'] },
    { label: 'Mẫu hoá đơn', id: 'inv_template_id', rules: ['required'] },
    {
      label: 'Phiên bản',
      id: 'version',
      type: 'radio',
      options: [
        { text: 'Tạo hóa đơn', value: 'invoice_v1' },
        { text: 'Xuất hóa đơn', value: 'invoice_v2' }
      ]
    }
    // showDiscountByItem,
    // acceptZeroVatObj,
    // {
    //   label: 'Cho phép Ký tự động',
    //   tooltip:
    //     '<ul><li>+ Điều kiện áp dụng: Khách hàng cần sử dụng chữ ký HSM</li><li>+ Vui lòng liên hệ kinh doanh iPOS để được hỗ trợ cấu hình</li></ul>',
    //   id: 'enable_savesign',
    //   type: 'checkbox',
    //   hide: (c) => c.version == 'invoice_v2'
    // },
    // blockExportVat0d,
    // exportVatInvoiceDateIsTranDate
  ]
};
