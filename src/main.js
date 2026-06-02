// main.js
import { createApp, h } from 'vue';
import App from './App.vue';
import createAppRouter from './router';
import { createPinia } from 'pinia';
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import { useGlobalStore } from './stores/global.store';
import { sessionStoragePlugin } from './common/plugins/session-storage-plugin';
import { setupI18n } from './common/i18n';
import MarkdownItPlugin from './common/plugins/markdown-it';

import MyDesignPreset from './theme/my-design-preset';
import MyLocaleTheme from './theme/my-locale-theme';
import './assets/styles/tailwind.css';
import './assets/styles/main.scss';
import SmartReport from '@/components/PageComponent/smart-report/SmartReport.vue';

const handleChunkError = () => {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault(); // Ngăn crash

    // Thông báo nhẹ nhàng
    const confirmed = window.confirm(
      'Hệ thống vừa được cập nhật.\nBấm OK để tải lại trang.',
    );

    if (confirmed) {
      // Tránh reload loop
      const last = sessionStorage.getItem('chunk_reload_at');
      const now = Date.now();
      if (!last || now - Number(last) > 30000) {
        sessionStorage.setItem('chunk_reload_at', String(now));
        window.location.reload();
      }
    }
  });
};

handleChunkError();

let app = null;
let offGlobalStateChange = null;
let pinia = null;
let router = null;

function render(props = {}) {
  const { container, i18n } = props;
  const rootComponent = props?.componentName === 'smart-report' ? SmartReport : App;
  // Nếu là chế độ nhúng lẻ Smart Report
  if (props?.componentName === 'smart-report') {
    // h(Component, Props, Children)
    // Cách này "ép" props onClose vào thẳng component SmartReport
    app = createApp({
      render: () =>
        h(SmartReport, {
          reportType: props?.reportType,
          onClose: props?.onClose || (() => {}), // Truyền function từ host vào prop 'onClose'
        }),
    });
  } else {
    app = createApp(App);
  }
  // app = createApp(rootComponent);

  if (i18n) {
    setupI18n(i18n);
    app.config.globalProperties.$i18n = i18n;
    app.config.globalProperties.$t = i18n.t.bind(i18n);
    app.config.globalProperties.$tc = i18n.tc.bind(i18n);
  }

  pinia = createPinia();
  pinia.use(sessionStoragePlugin);
  app.use(pinia);

  router = createAppRouter(props?.microRouters || {}, props?.componentName);
  app.use(router);

  app.use(PrimeVue, {
    theme: {
      preset: MyDesignPreset,
      options: {
        darkModeSelector: '.fabi-cms-sub-dark',
      },
    },
    locale: MyLocaleTheme,
  });
  app.use(ToastService);
  app.use(ConfirmationService);
  app.use(MarkdownItPlugin);

  // Nếu chạy dưới Qiankun thì mount vào container con
  app.mount(container ? container.querySelector('#sub-app') : '#sub-app');
  // Gàn các global state từ Vuex Host sang Pinia Sub
  if (props?.onGlobalStateChange) {
    const globalStore = useGlobalStore();
    offGlobalStateChange = props.onGlobalStateChange((state, _prev) => {
      globalStore.setGlobalState(state);
    }, true);
  }

  console.log('[sub-vue3] mounted');
}

// Khi chạy trong Qiankun
renderWithQiankun({
  bootstrap() {
    console.log('[sub-vue3] bootstraped');
  },
  mount(props) {
    console.log('[sub-vue3] - sub nhận', props?.messageFromHost);
    props?.actions?.setGlobalState?.({
      messageFromSub: 'pong',
    });
    return Promise.resolve(render(props));
  },
  unmount() {
    console.log('[sub-vue3] unmount');

    if (offGlobalStateChange) {
      offGlobalStateChange();
      offGlobalStateChange = null;
    }

    if (pinia) {
      pinia._s.forEach((store) => {
        store.$dispose?.();
      });
      pinia = null;
    }

    if (router) {
      router = null;
    }

    if (app) {
      app.unmount();
      app = null;
    }

    return Promise.resolve();
  },
});

//  Trường hợp chạy độc lập (dev riêng)
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}
