export const eInvoiceRouter = [
  {
    path: '/e-invoice',
    name: 'EInvoicePage',
    redirect: '/invoice/summary',
    meta: {},
    children: [
      {
        path: '/e-invoice/summary',
        name: 'EInvoiceSummary',
        component: () => import('@/views/e-invoice/summary.vue'),
        meta: {
          title: 'Tổng quan - HDDT',
          isLayoutVue3: true
        }
      },
      {
        path: 'invoice-manage',
        name: 'InvoiceManage',
        component: () => import('@/views/e-invoice/invoice-manage.vue'),
        meta: {
          title: 'Quản lý hóa đơn - HDDT',
          isLayoutVue3: true
        }
      },
      {
        path: 'sale-order',
        name: 'SaleOrder',
        component: () => import('@/views/e-invoice/sale-order.vue'),
        meta: {
          title: 'Hóa đơn bán hàng - HDDT',
          isLayoutVue3: true
        }
      },
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/e-invoice/config.vue'),
        meta: {
          title: 'Cấu hình - HDDT',
          isLayoutVue3: true
        }
      }
    ]
  }
];

export const exportVatRouter = [
  {
    path: '/export-vat',
    name: 'ExportVat',
    // component: () => import('@/views/e-invoice/export-vat.vue')
  }
];

// export const eInvoiceComponentMap = {
//   Summary: () => import('@/views/e-invoice/summary.vue'),
//   InvoiceManage: () => import('@/views/e-invoice/invoice-manage.vue'),
//   SaleOrder: () => import('@/views/e-invoice/sale-order.vue'),
//   Config: () => import('@/views/e-invoice/config.vue')
// };
