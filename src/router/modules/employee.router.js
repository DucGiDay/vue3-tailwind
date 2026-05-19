export const employee = [
  {
    path: '/employee',
    name: 'Employee',
    redirect: '/employee/access',
    meta: {},
    children: [
      {
        path: 'access',
        name: 'access',
        meta: {
          disableSidebar: true,
          layoutClass: '',
        },
        component: () => import('@/views/employee/access.vue'),
      },
    ],
  },
];
