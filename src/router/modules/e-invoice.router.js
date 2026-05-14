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
          title: 'Tổng quan - HDDT',
        },
      },
      {
        path: 'invoice-manage',
        name: 'InvoiceManage',
        component: () => import('@/views/e-invoice/invoice-manage.vue'),
        meta: {
          title: 'Quản lý hóa đơn - HDDT',
          isTableViewPaginate: true,
        },
      },
      {
        path: 'sale-order',
        name: 'SaleOrder',
        component: () => import('@/views/e-invoice/sale-order.vue'),
        meta: {
          title: 'Hóa đơn bán hàng - HDDT',
          isTableViewPaginate: true,
        },
      },
      {
        path: 'config',
        name: 'Config',
        component: () => import('@/views/e-invoice/config.vue'),
        meta: {
          title: 'Cấu hình - HDDT',
        },
      },
      {
        path: 'noti-error',
        name: 'NotiErrorList',
        component: () => import('@/views/e-invoice/noti-error/list.vue'),
        meta: {
          title: 'Danh sách thông báo sai sót - HDDT',
          isTableViewPaginate: true,
        },
      },
      {
        path: 'noti-error/detail/:id?',
        name: 'NotiErrorDetail',
        component: () => import('@/views/e-invoice/noti-error/detail.vue'),
        meta: {
          title: 'Chi tiết thông báo sai sót - HDDT',
        },
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
              isTableViewPaginate: true,
            },
          },
          {
            path: 'detail/:id?',
            name: 'AgreementProtocolDetail',
            component: () => import('@/views/e-invoice/agreement-protocol/detail.vue'),
            meta: {
              title: 'Biên bản thỏa thuận - HDDT',
            },
          },
        ],
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
              isTableViewPaginate: true,
            },
          },
          {
            path: 'detail/:id?',
            name: 'SerialInvoiceDetail',
            component: () => import('@/views/e-invoice/serial-invoice/detail.vue'),
            meta: {
              title: 'Ký hiệu hóa đơn - HDDT',
            },
          },
        ],
      },
      {
        path: 'pos-invoice',
        name: 'POSInvoiceList',
        children: [
          {
            path: '',
            name: 'POSInvoiceListMain',
            component: () => import('@/views/e-invoice/pos-invoice/pos-list.vue'),
            meta: {
              title: 'Gửi hóa đơn MTT - HDDT',
              isTableLayout: true,
            },
          },
          {
            path: 'create',
            name: 'POSInvoiceCreate',
            component: () => import('@/views/e-invoice/pos-invoice/create.vue'),
            meta: {
              title: 'Tạo máy tính tiền - HDDT',
            },
          },
          {
            path: 'config-time',
            name: 'POSInvoiceConfigTime',
            component: () => import('@/views/e-invoice/pos-invoice/config-time.vue'),
            meta: {
              title: 'Cấu hình thời gian gửi - HDDT',
            },
          },
        ],
      },
      {
        path: 'report',
        name: 'ReportInvoice',
        children: [
          {
            path: 'monthly-invoice-list',
            name: 'MonthlyInvoiceList',
            component: () => import('@/views/e-invoice/report/monthly-invoice-list.vue'),
            meta: {
              title: 'Bảng kê hóa đơn hàng tháng - HDDT',
            },
          },
          {
            path: 'detail-sales',
            name: 'DetailSales',
            component: () => import('@/views/e-invoice/report/detail-sales.vue'),
            meta: {
              title: 'Báo cáo chi tiết bán hàng - HDDT',
            },
          },
          {
            path: 'summary-sales',
            name: 'SummarySales',
            component: () => import('@/views/e-invoice/report/summary-sales.vue'),
            meta: {
              title: 'Báo cáo tổng hợp bán hàng - HDDT',
            },
          },
          {
            path: 'detail-invoice-list',
            name: 'DetailInvoiceList',
            component: () => import('@/views/e-invoice/report/detail-invoice-list.vue'),
            meta: {
              title: 'Bảng kê chi tiết hóa đơn - HDDT',
            },
          },
          {
            path: 'invoice-usage-status',
            name: 'InvoiceUsageStatus',
            component: () => import('@/views/e-invoice/report/invoice-usage-status.vue'),
            meta: {
              title: 'Tình hình sử dụng hóa đơn - HDDT',
            },
          },
          {
            path: 'export-invoice-history',
            name: 'ExportInvoiceHistory',
            component: () => import('@/views/e-invoice/report/export-invoice-history.vue'),
            meta: {
              title: 'Lịch sử xuất báo cáo - HDDT',
            },
          },
        ],
      },
    ],
  },
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
        meta: {},
      },
    ],
  },
];
