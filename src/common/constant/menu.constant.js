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
          { label: 'Biên bản thỏa thuận', to: '/e-invoice/agreement-protocol', grandchild: true }
        ]
      },
      {
        label: 'Quản lý phát hành',
        items: [{ label: 'Ký hiệu hóa đơn', to: '/e-invoice/serial-invoice', grandchild: true }]
      }
    ]
  }
];
