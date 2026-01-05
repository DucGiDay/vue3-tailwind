import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import qiankun from 'vite-plugin-qiankun';
import path from 'path';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import Components from 'unplugin-vue-components/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),

    // 👇 plugin giúp app chạy được cả dev và build mode trong Qiankun
    qiankun('fabi-cms-sub-vue3', {
      useDevMode: true //  cho phép chạy ở vite dev server
    }),

    Components({
      dirs: ['src/components/Common'], // Chỉ tự động generated component nằm trong các thư mục này
      resolvers: [PrimeVueResolver()]
    })
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      vue: 'vue/dist/vue.esm-bundler.js'
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/scss/_variables.scss" as *;`,
        silenceDeprecations: ['legacy-js-api']
      }
    }
  },

  server: {
    port: 5173
    // cors: true,
    // origin: 'http://localhost:5173',
  },
  base: '/'

  // build: {
  //   outDir: 'dist',
  //   assetsDir: 'static',
  //   target: 'esnext',
  //   cssCodeSplit: true,
  //   rollupOptions: {
  //     output: {
  //       format: 'umd',
  //       name: 'fabi-cms-sub-vue3',
  //       entryFileNames: 'js/[name].js',
  //       chunkFileNames: 'js/[name].js',
  //       assetFileNames: 'assets/[name].[ext]',
  //     },
  //   },
  // },
});
