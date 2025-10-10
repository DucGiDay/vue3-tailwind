import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import './assets/tailwind.css'
import { renderWithQiankun, qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

let app = null

function render(props = {}) {
  const { container } = props
  app = createApp(App)
  app.use(createPinia())
  app.use(router)
  // Nếu chạy dưới Qiankun thì mount vào container con
  app.mount(container ? container.querySelector('#app') : '#app')
  console.log('[sub-vue3] mounted ✅')
}

// 👇 Khi chạy trong Qiankun
renderWithQiankun({
  bootstrap() {
    console.log('[sub-vue3] bootstraped')
  },
  mount(props) {
    console.log('[sub-vue3] mount start')
    return Promise.resolve(render(props))
  },
  unmount(props) {
    console.log('[sub-vue3] unmount')
    if (app) {
      app.unmount()
      app = null
    }
    return Promise.resolve()
  },
})

// ✅ Trường hợp chạy độc lập (dev riêng)
if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render()
}

// // ✅ Các lifecycle mà Qiankun cần
// export async function bootstrap() {
//   console.log('[vue3] app bootstraped')
// }

// export async function mount(props) {
//   console.log('[vue3] app mount', props)
//   render(props)
// }

// export async function unmount() {
//   console.log('[vue3] app unmount')
//   if (app) {
//     app.unmount()
//     app = null
//   }
// }

// export async function mount(props) {
//   console.log('[vue3] app mount', props)
