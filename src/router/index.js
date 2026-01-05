import { createRouter, createWebHistory } from 'vue-router';
import { pascalToKebab } from '@/common/ulties';
import AppLayout from '@/layout/AppLayout.vue';

import { reportComponentMap, reportRouters } from './modules/report';
import { pagesExampleRouter, pagesNotHaveLayoutRouter, uikitRouter } from './modules/uikit.router';
import Dashboard from '@/views/pages/Dashboard.vue';
import NotFound from '@/views/pages/NotFound.vue';
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper';

const mapMicroRouters = (microRouters, parentComponentName = '') => {
  return (microRouters || []).map((route) => {
    const path = route.path;
    const componentPath =
      parentComponentName +
      '/' +
      pascalToKebab(route.name) +
      (route?.redirect ? '' : route?.meta?.viewType === 'list' ? '/index.vue' : '.vue');
    // const component = route?.redirect ? null : () => import('../views' + componentPath);
    const component = route?.redirect ? null : reportComponentMap[route?.name] || NotFound;
    const children = route.children ? mapMicroRouters(route.children, componentPath) : [];
    return {
      path,
      name: route.name,
      component,
      children,
      meta: route?.meta || {}
    };
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
        ...uikitRouter
      ]
    },

    { path: '/404', name: 'NotFound', component: NotFound },
    { path: '/:pathMatch(.*)*', component: () => import('@/views/pages/NotFound.vue') },
    ...pagesNotHaveLayoutRouter,
    ...microRouters
  ];

  const router = createRouter({
    history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? '/micro' : '/'),
    routes
  });

  // router.beforeEach((to, from) => {
  //   if (to.meta && to.meta.requiresAuth) {
  //     const token = localStorage.getItem('token');
  //     if (!token) {
  //       return { name: 'Login', query: { redirect: to.fullPath } };
  //     }
  //   }
  // });

  return router;
};

export default createAppRouter;
