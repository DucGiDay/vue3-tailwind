export const eInvoiceMenu = [
  {
    label: '',
    items: [
      { label: 'Tổng quan', to: '/e-invoice/summary' },
      { label: 'Quản lý hóa đơn', to: '/e-invoice/invoice-manage' },
      { label: 'Hóa đơn bán hàng', to: '/e-invoice/sale-order' },
      { label: 'Cấu hình', to: '/e-invoice/config' },
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
        ],
      },
    ],
  },
];
