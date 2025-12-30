import { createApp } from 'vue'
import App from './App.vue'
import createAppRouter from './router'
import { createPinia } from 'pinia'
import './assets/styles/tailwind.css'
import './assets/styles/main.scss'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional


let app = null

function render(props = {}) {
  const { container } = props
  app = createApp(App)
  app.use(createPinia());

  const router = createAppRouter(props?.microRouters || []);
  app.use(router)

  app.use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.app-dark'
      }
    }
  });

  app.component('DataTable', DataTable);
  app.component('Column', Column);
  app.component('ColumnGroup', ColumnGroup);
  app.component('Row', Row);

  // Nếu chạy dưới Qiankun thì mount vào container con
  app.mount(container ? container.querySelector('#sub-app') : '#sub-app')
  console.log('[sub-vue3] mounted ')
}

// 👇 Khi chạy trong Qiankun
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
    localStorage.setItem('router_config', JSON.stringify(props?.microRouters || []));
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

