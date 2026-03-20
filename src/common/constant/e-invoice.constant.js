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

  null: 'Hóa đơn dự thảo'
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

// export const INVOICE_PARTNERS = ['iPOS-invoice', 'M-invoice', 'Me-invoice', 'S-invoice', 'VNPT-invoice'];
export const INVOICE_PARTNERS = [
  { name: 'IPOS-INVOICE', code: 'IPOSINVOICE' },
  { name: 'M-INVOICE', code: 'MINVOICE' },
  { name: 'ME-INVOICE', code: 'MEINVOICE' },
  { name: 'S-INVOICE', code: 'SINVOICE' },
  { name: 'VNPT-INVOICE', code: 'VNPTINVOICE' }
];
