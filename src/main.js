// main.js
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

import MyDesignPreset from './theme/my-design-preset';
import './assets/styles/tailwind.css';
import './assets/styles/main.scss';

let app = null;
let offGlobalStateChange = null;
let pinia = null;
let router = null;

function render(props = {}) {
  const { container, i18n } = props;
  app = createApp(App);

  if (i18n) {
    setupI18n(i18n);
    app.config.globalProperties.$i18n = i18n;
    app.config.globalProperties.$t = i18n.t.bind(i18n);
    app.config.globalProperties.$tc = i18n.tc.bind(i18n);
  }

  pinia = createPinia();
  pinia.use(sessionStoragePlugin);
  app.use(pinia);

  router = createAppRouter(props?.microRouters || {});
  app.use(router);

  app.use(PrimeVue, {
    theme: {
      preset: MyDesignPreset,
      options: {
        darkModeSelector: '.fabi-cms-sub-dark'
      }
    },
    locale: {
      dayNamesMin: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
      dayNames: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
      dayNamesShort: ['CN', 'Hai', 'Ba', 'Tư', 'Năm', 'Sáu', 'Bảy'],
      monthNames: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'],
      monthNamesShort: ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'],
      firstDayOfWeek: 1,
      today: 'Hôm nay',
      clear: 'Xóa'
    }
  });
  app.use(ToastService);
  app.use(ConfirmationService);

  // Nếu chạy dưới Qiankun thì mount vào container con
  app.mount(container ? container.querySelector('#sub-app') : '#sub-app');
  // Gàn các global state từ Vuex Host sang Pinia Sub
  if (props?.onGlobalStateChange) {
    const globalStore = useGlobalStore();
    offGlobalStateChange = props.onGlobalStateChange((state, _prev) => {
      globalStore.setGlobalState(state);
    }, true);
  }

  console.log('[sub-vue3] mounted edited');
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
  }
});

//  Trường hợp chạy độc lập (dev riêng)
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render();
}
