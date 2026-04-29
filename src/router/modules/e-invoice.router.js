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
        path: 'noti-error',
        name: 'NotiErrorList',
        component: () => import('@/views/e-invoice/noti-error/list.vue'),
        meta: {
          title: 'Danh sách thông báo sai sót - HDDT',
          isTableLayout: true
        }
      },
      {
        path: 'noti-error/detail/:id?',
        name: 'NotiErrorDetail',
        component: () => import('@/views/e-invoice/noti-error/detail.vue'),
        meta: {
          title: 'Chi tiết thông báo sai sót - HDDT'
        }
      },
      {
        path: 'agreement-protocol',
        name: 'AgreementProtocol',
        children: [
          {
            path: '',
            name: 'AgreementProtocolList',
            component: () => import('@/views/e-invoice/agreement-protocol/list.vue'),
            meta: {
              title: 'Biên bản thỏa thuận - HDDT',
              isTableLayout: true
            }
          },
          {
            path: 'detail/:id?',
            name: 'AgreementProtocolDetail',
            component: () => import('@/views/e-invoice/agreement-protocol/detail.vue'),
            meta: {
              title: 'Biên bản thỏa thuận - HDDT'
            }
          }
        ]
      },
      {
        path: 'serial-invoice',
        name: 'SerialInvoice',
        children: [
          {
            path: '',
            name: 'SerialInvoiceList',
            component: () => import('@/views/e-invoice/serial-invoice/list.vue'),
            meta: {
              title: 'Ký hiệu hóa đơn - HDDT',
              isTableLayout: true
            }
          },
          {
            path: 'detail/:id?',
            name: 'SerialInvoiceDetail',
            component: () => import('@/views/e-invoice/serial-invoice/detail.vue'),
            meta: {
              title: 'Ký hiệu hóa đơn - HDDT'
            }
          }
        ]
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
