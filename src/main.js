import { createApp } from 'vue'
import App from './App.vue'
import createAppRouter from './router'
import { createPinia } from 'pinia'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import PrimeVue from 'primevue/config';

import MyDesignPreset from './theme/my-design-preset';
import './assets/styles/tailwind.css'
import './assets/styles/main.scss'

let app = null

function render(props = {}) {
  const { container } = props
  app = createApp(App)
  app.use(createPinia());

  const router = createAppRouter(props?.microRouters || {});
  app.use(router)

  app.use(PrimeVue, {
    theme: {
      preset: MyDesignPreset,
      options: {
        darkModeSelector: '.fabi-cms-sub-dark',
      }
    },
    zIndex: {
      modal: 1100,        //dialog, drawer
      overlay: 1000,      //select, popover
      menu: 1000,         //overlay menus
      tooltip: 1100       //tooltip
    }
  });

  // Nếu chạy dưới Qiankun thì mount vào container con
  app.mount(container ? container.querySelector('#sub-app') : '#sub-app')
  console.log('[sub-vue3] mounted ')
}

// Khi chạy trong Qiankun
renderWithQiankun({
  bootstrap() {
    console.log('[sub-vue3] bootstraped')
  },
  mount(props) {
    console.log('[sub-vue3] - sub nhận', props);
    props.actions.setGlobalState({
      messageFromSub: 'pong'
    });
    localStorage.removeItem('router_config');
    localStorage.setItem('router_config', JSON.stringify(props?.microRouters || {}));
    return Promise.resolve(render(props))
  },
  unmount() {
    console.log('[sub-vue3] unmount')
    if (app) {
      app.unmount()
      app = null
    }
    return Promise.resolve()
  },
})

//  Trường hợp chạy độc lập (dev riêng)
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}

