import App from './App.vue';
import createAppRouter from './router';
import { createPinia } from 'pinia';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import PrimeVue from 'primevue/config';
import { useGlobalStore } from './stores/global';
import { sessionStoragePlugin } from './common/plugins/session-storage-plugin';
import { setupI18n } from './common/i18n';

import MyDesignPreset from './theme/my-design-preset';
import './assets/styles/tailwind.css';
import './assets/styles/main.scss';

let app = null;

function render(props = {}) {
  const { container, i18n } = props;
  app = createApp(App);

  if (i18n) {
    setupI18n(i18n);

    app.config.globalProperties.$i18n = i18n;
    app.config.globalProperties.$t = i18n.t.bind(i18n);
    app.config.globalProperties.$tc = i18n.tc.bind(i18n);
  }

  const pinia = createPinia();
  pinia.use(sessionStoragePlugin);
  app.use(pinia);

  const globalStore = useGlobalStore();

  // Gàn các global state từ Vuex Host sang Pinia Sub
  if (props?.onGlobalStateChange) {
    props.onGlobalStateChange((state, prev) => {
      globalStore.setGlobalState(state);
    }, true);
  }

  const router = createAppRouter(props?.microRouters || {});
  app.use(router);

  app.use(PrimeVue, {
    theme: {
      preset: MyDesignPreset,
      options: {
        darkModeSelector: '.fabi-cms-sub-dark'
      }
    },
    zIndex: {
      modal: 1100, //dialog, drawer
      overlay: 1000, //select, popover
      menu: 1000, //overlay menus
      tooltip: 1100 //tooltip
    }
  });

  // Nếu chạy dưới Qiankun thì mount vào container con
  app.mount(container ? container.querySelector('#sub-app') : '#sub-app');
  console.log('[sub-vue3] mounted ');
}

// Khi chạy trong Qiankun
renderWithQiankun({
  bootstrap() {
    console.log('[sub-vue3] bootstraped');
  },
  mount(props) {
    console.log('[sub-vue3] - sub nhận', props?.messageFromHost);
    props.actions.setGlobalState({
      messageFromSub: 'pong'
    });
    // localStorage.removeItem('router_config');
    // localStorage.setItem('router_config', JSON.stringify(props?.microRouters || {}));
    return Promise.resolve(render(props));
  },
  unmount() {
    console.log('[sub-vue3] unmount');
    if (app) {
      app.unmount();
      app = null;
    }
    return Promise.resolve();
  }
});

//  Trường hợp chạy độc lập (dev riêng)
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}
