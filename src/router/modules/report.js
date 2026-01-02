export const reportComponentMap = {
  'DuckReport': () => import('@/views/micro-report/duck-report/index.vue'),

  // D05
  'SaleAudit': () => import('@/views/micro-report/sale-audit/index.vue'),
};

export const reportRouters = [
  {
    path: '/report',
    name: 'Report',
    meta: { title: 'Báo cáo', requiresAuth: true },
    redirect: '/report/sale-audit',
    children: [
      {
        path: 'sale-audit',
        name: 'SaleAudit',
        meta: { title: 'Báo cáo bán hàng', requiresAuth: true, viewType: 'list' },
        component: () => import('@/views/micro-report/sale-audit/index.vue'),
      },
    ]
  }
]