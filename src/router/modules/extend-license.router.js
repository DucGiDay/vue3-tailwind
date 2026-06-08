export const extendLicenseComponentMap = {
  ExtendLicenseHistory: () => import('@/views/extend-license/extend-license-history.vue'),
};

export const extendLicenseRouter = [
  {
    path: '/extend-license/extend-license-history',
    name: 'ExtendLicense',
    meta: {},
    component: () => import('@/views/extend-license/extend-license-history.vue'),
  },
];
