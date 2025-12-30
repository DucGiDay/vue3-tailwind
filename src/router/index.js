import { createRouter, createWebHistory } from "vue-router";

import { pascalToKebab } from "@/common/ulties";
import { componentMap } from "./modules/report";
import Home from "@/components/PageComponent/Home.vue";
import NotFound from "@/views/default-pages/NotFound.vue";
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

const _renderWithQiankun = renderWithQiankun();

const mapMicroRoutes = (microRouters, parentComponentName = '') => {
  return microRouters.map(route => {
    const path = route.path;
    const componentPath = parentComponentName + '/' + pascalToKebab(route.name) + (route?.redirect ? '' : (route?.meta?.viewType === 'list' ? '/index.vue' : '.vue'));
    // const component = route?.redirect ? null : () => import('../views' + componentPath);
    const component = route?.redirect ? null : (componentMap[route?.name] || NotFound);
    const children = route.children ? mapMicroRoutes(route.children, componentPath) : [];
    return {
      path,
      name: route.name,
      component,
      children,
      meta: route?.meta || {},
    };
  });
}

const createAppRouter = (microRouters) => {
  const microRouter = mapMicroRoutes(microRouters.children, '').map(route => ({ ...route, path: '/' + route.path }));
  const routes = [
    { path: "/", name: "Home", component: Home, redirect: '/report' },
    { path: "/404", name: "NotFound", component: NotFound },
    { path: "/:pathMatch(.*)*", component: () => import('@/views/default-pages/NotFound.vue') },
    ...microRouter
  ];

  const router = createRouter({
    history: createWebHistory(qiankunWindow.__POWERED_BY_QIANKUN__ ? "/micro" : "/"),
    routes,
  });

  // Global auth guard: routes with meta.requiresAuth require a token in localStorage
  router.beforeEach((to, from) => {
    if (to.meta && to.meta.requiresAuth) {
      const token = localStorage.getItem("token");
      if (!token) {
        return { name: "Login", query: { redirect: to.fullPath } };
      }
    }
  });

  return router;
}


export default createAppRouter;
