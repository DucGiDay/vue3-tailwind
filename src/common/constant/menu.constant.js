export const eInvoiceMenu = [
  {
    label: '',
    items: [
      { label: 'Tổng quan', to: '/e-invoice/summary' },
      {
        label: 'Quản lý hóa đơn',
        items: [
          { label: 'Danh sách hóa đơn', to: '/e-invoice/invoice-manage' },
          { label: 'Hóa đơn bán hàng', to: '/e-invoice/sale-order' },
        ],
      },
      {
        label: 'Quản lý sai sót',
        items: [
          { label: 'Thông báo sai sót', to: '/e-invoice/noti-error', grandchild: true },
          { label: 'Biên bản thỏa thuận', to: '/e-invoice/agreement-protocol', grandchild: true },
        ],
      },
      {
        label: 'Quản lý phát hành',
        items: [{ label: 'Ký hiệu hóa đơn', to: '/e-invoice/serial-invoice', grandchild: true }],
      },
      { label: 'Gửi hóa đơn MTT', to: '/e-invoice/pos-invoice' },
      {
        label: 'Báo cáo',
        items: [
          {
            label: 'Bảng kê hóa đơn hàng tháng',
            to: '/e-invoice/report/monthly-invoice-list',
            grandchild: true,
          },
          {
            label: 'Báo cáo chi tiết bán hàng',
            to: '/e-invoice/report/detail-sales',
            grandchild: true,
          },
          {
            label: 'Báo cáo tổng hợp bán hàng',
            to: '/e-invoice/report/summary-sales',
            grandchild: true,
          },
          {
            label: 'Bảng kê chi tiết hóa đơn',
            to: '/e-invoice/report/detail-invoice-list',
            grandchild: true,
          },
          {
            label: 'Tình hình sử dụng hóa đơn',
            to: '/e-invoice/report/invoice-usage-status',
            grandchild: true,
          },
          {
            label: 'Lịch sử xuất báo cáo',
            to: '/e-invoice/report/export-invoice-history',
            grandchild: true,
          },
        ],
      },

      ...(import.meta.env.PROD ? {} : { label: 'Cấu hình', to: '/e-invoice/config' }),
      { label: 'Lịch sử thao tác', to: '/e-invoice/history-action' },
    ],
  },
];

export const employee = [
  {
    label: '',
    items: [
      { label: 'Danh sách nhân viên', url: '/employee/list' },
      { label: 'Danh sách chức vụ', url: '/employee/role' },
      { label: 'Quản lý truy cập', to: '/employee/access' },
    ],
  },
];
