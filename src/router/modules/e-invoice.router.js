import AppLayoutWithoutAuth from '@/layout/AppLayoutWithoutAuth.vue';

export const eInvoiceRouter = [
  {
    path: '/e-invoice',
    name: 'EInvoicePage',
    redirect: '/e-invoice/summary',
    meta: {},
    children: [
      {
        path: '/e-invoice/summary',
        name: 'EInvoiceSummary',
        component: () => import('@/views/e-invoice/summary.vue'),
        meta: {
          title: 'Tổng quan - HDDT'
        }
      },
      {
        path: 'invoice-manage',
        name: 'InvoiceManage',
        component: () => import('@/views/e-invoice/invoice-manage.vue'),
        meta: {
          title: 'Quản lý hóa đơn - HDDT',
          isTableLayout: true
        }
      },
      {
        path: 'sale-order',
        name: 'SaleOrder',
        component: () => import('@/views/e-invoice/sale-order.vue'),
        meta: {
          title: 'Hóa đơn bán hàng - HDDT',
          isTableLayout: true
        }
      },
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/e-invoice/config.vue'),
        meta: {
          title: 'Cấu hình - HDDT'
        }
      },
      {
        path: 'error-type',
        name: 'ErrorTypeList',
        component: () => import('@/views/e-invoice/error-type/list.vue'),
        meta: {
          title: 'Danh sách loại sai sót - HDDT',
          isTableLayout: true
        }
      },
      {
        path: 'error-type/detail/:id?',
        name: 'ErrorTypeDetail',
        component: () => import('@/views/e-invoice/error-type/detail.vue'),
        meta: {
          title: 'Chi tiết loại sai sót - HDDT'
        }
      },
      {
        path: 'agreement-protocol',
        name: 'AgreementProtocol',
        component: () => import('@/views/e-invoice/agreement-protocol/list.vue'),
        meta: {
          title: 'Biên bản thỏa thuận - HDDT',
          isTableLayout: true
        }
      },
      {
        path: 'agreement-protocol/detail/:id?',
        name: 'AgreementProtocolDetail',
        component: () => import('@/views/e-invoice/agreement-protocol/detail.vue'),
        meta: {
          title: 'Chi tiết biên bản thỏa thuận - HDDT'
        }
      }
    ]
  }
];

export const exportVatRouter = [
  {
    path: '/export-vat',
    name: 'ExportVatLayout',
    component: AppLayoutWithoutAuth,
    children: [
      {
        path: '',
        name: 'ExportVat',
        component: () => import('@/views/e-invoice/export-vat.vue'),
        meta: {}
      }
    ]
  }
];
