import { createRouter, createWebHistory } from "vue-router";
import userRoutes from "./modules/user";
import reportRoutes from "./modules/report";
import Login from "../views/Login.vue";
import Home from "../components/Home.vue";
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

const _renderWithQiankun = renderWithQiankun();

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/login", name: "Login", component: Login },
  ...userRoutes,
  ...reportRoutes,
  { path: "/:pathMatch(.*)*", redirect: "/" },
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

export default router;
