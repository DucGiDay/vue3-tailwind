import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

import { reportComponentMap, reportRouters } from './modules/report';
import { extendLicenseComponentMap } from './modules/extend-license.router';
import { eInvoiceRouter, exportVatRouter } from './modules/e-invoice.router';
import { pagesExampleRouter, pagesNotHaveLayoutRouter, uikitRouter } from './modules/uikit.router';
import Dashboard from '@/views/pages/Dashboard.vue';
import NotFound from '@/views/pages/NotFound.vue';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

const componentMap = {
  MicroReport: reportComponentMap,
  ExtendLicense: extendLicenseComponentMap
};

const mapMicroRouters = (routes, inheritedAbstractName = '') => {
  let activeAbstractName = inheritedAbstractName;

  return (routes || [])
    .map((route) => {
      const { path, name, children, meta = {} } = route;
      const isAbstract = meta.isAbstractRoute;

      // Nếu route hiện tại là abstract → update activeAbstractName
      activeAbstractName = isAbstract ? name : inheritedAbstractName;

      // Abstract routes không có component thực
      const component = isAbstract ? null : componentMap?.[activeAbstractName]?.[name] || NotFound;

      // Đệ quy xử lý children routes
      const mappedChildren = children ? mapMicroRouters(children, activeAbstractName) : [];

      return {
        path,
        name,
        component,
        children: mappedChildren,
        meta
      };
    })
    .filter((route) => {
      // Loại bỏ các abstract route không có children để tránh cảnh báo từ Vue Router
      if (route.meta?.isAbstractRoute && (!route.children || route.children.length === 0)) {
        return false;
      }
      return true;
    });
};

const createAppRouter = (microRouter) => {
  const microRouters =
    Object.keys(microRouter).length > 0
      ? mapMicroRouters(microRouter?.children, '').map((route) => ({
          ...route,
          path: '/' + route.path
        }))
      : reportRouters;

  const routes = [
    {
      path: '/',
      name: 'Home',
      component: AppLayout,
      children: [
        {
          path: '/',
          name: 'Dashboard',
          component: Dashboard
        },
        {
          path: '/document',
          name: 'Document',
          redirect: '/pages/documentation'
        },

        ...pagesExampleRouter,
        ...uikitRouter,
        ...eInvoiceRouter
      ]
    },
    ...pagesNotHaveLayoutRouter,
    ...microRouters,
    ...exportVatRouter,
    { path: '/404', name: 'NotFound', component: NotFound },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/pages/NotFound.vue') }
  ];

  const router = createRouter({
    history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? '/micro' : '/'),
    routes
  });

  return router;
};

export default createAppRouter;
