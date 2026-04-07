import AppLayoutWithoutAuth from '@/layout/AppLayoutWithoutAuth.vue';
import AppLayoutTable from '@/layout/AppLayoutTable.vue';
import AppLayout from '@/layout/AppLayout.vue';

export const eInvoiceRouter = [
  // {
  //   path: '/e-invoice',
  //   name: 'EInvoicePage',
  //   redirect: '/e-invoice/summary',
  //   meta: {},
  //   children: [
  //     {
  //       path: '/e-invoice/summary',
  //       name: 'EInvoiceSummary',
  //       component: () => import('@/views/e-invoice/summary.vue'),
  //       meta: {
  //         title: 'Tổng quan - HDDT',
  //         isLayoutVue3: true
  //       }
  //     }
  //     // {
  //     //   path: 'invoice-manage',
  //     //   name: 'InvoiceManage',
  //     //   component: () => import('@/views/e-invoice/invoice-manage.vue'),
  //     //   meta: {
  //     //     title: 'Quản lý hóa đơn - HDDT',
  //     //     isLayoutVue3: true
  //     //   }
  //     // },
  //     // {
  //     //   path: 'sale-order',
  //     //   name: 'SaleOrder',
  //     //   component: () => import('@/views/e-invoice/sale-order.vue'),
  //     //   meta: {
  //     //     title: 'Hóa đơn bán hàng - HDDT',
  //     //     isLayoutVue3: true
  //     //   }
  //     // },
  //     // {
  //     //   path: 'config',
  //     //   name: 'Config',
  //     //   component: () => import('@/views/e-invoice/config.vue'),
  //     //   meta: {
  //     //     title: 'Cấu hình - HDDT',
  //     //     isLayoutVue3: true
  //     //   }
  //     // }
  //   ]
  // }
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
    path: '/e-invoice/config',
    name: 'Config',
    component: () => import('@/views/e-invoice/config.vue'),
    meta: {
      title: 'Cấu hình - HDDT',
      isLayoutVue3: true
    }
  }
];
export const eInvoiceTableRouter = [
  {
    path: '/e-invoice',
    name: 'EInvoicePage',
    component: AppLayoutTable,
    // component: AppLayout,
    meta: {},
    children: [
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
        meta: {
          isLayoutVue3: true
        }
      }
    ]
  }
];
