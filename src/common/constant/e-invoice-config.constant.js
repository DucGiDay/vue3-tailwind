const acceptZeroVatObj = {
  label: 'Cho phép xuất vat 0%',
  id: 'accept_zero_vat',
  type: 'checkbox',
};

const blockExportVat0d = {
  label: 'Chặn xuất VAT với hóa đơn 0đ',
  id: 'block_export_vat_0d',
  type: 'checkbox',
};

const invTaxCode = {
  label: 'Mã số thuế',
  id: 'inv_tax_code',
  rules: ['required'],
  isReplaceSpace: true,
  hide: () => true,
};

const exportVatInvoiceDateIsTranDate = {
  label: 'Cho phép xuất VAT ngày xuất là thời gian in bill',
  id: 'export_vat_invoice_date_is_tran_date',
  type: 'checkbox',
};

const version = {
  label: 'Phiên bản',
  id: 'version',
  type: 'radio',
  options: [
    { text: 'Version 1', value: 'invoice_v1' },
    { text: 'Version 2', value: 'invoice_v2' },
  ],
};

const showDiscountByItem = {
  label: 'Mẫu HDDT hiển thị chiết khấu theo từng mặt hàng',
  id: 'config_template_v2',
  type: 'checkbox',
};

const moneyConfigMeinvoice = {
  label: 'Cho phép thập phân đơn giá, thành tiền',
  id: 'money_config_meinvoice',
  type: 'checkbox',
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
        { text: 'Thông tư 78', value: 'circulars_78' },
      ],
    },
    version,
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
    version,
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
    version,
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
        '<ul><li>Version 1: Tạo hóa đơn ở trạng thái nháp</li><li>Version 2: Phát hành hóa đơn máy tính tiền</li></ul>',
    },
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
        { text: 'Xuất hóa đơn', value: 'invoice_v2' },
      ],
    },
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
  ],
};
