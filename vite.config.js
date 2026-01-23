import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import qiankun from 'vite-plugin-qiankun';
import path from 'path';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

const allowedOrigins = [
  'https://fabidev.ipos.vn',
  'https://fabi.ipos.vn',
  'https://fabi.nport.link', // Chạy https cho local
  'http://localhost:6969'
];

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
    }),
    AutoImport({
      imports: [
        'vue',
        {
          '@/common/i18n/index': ['$t']
        }
      ]
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
    port: 5173,
    cors: {
      origin: allowedOrigins,
      credentials: true
    },
    headers: {
      'Access-Control-Allow-Origin': allowedOrigins.join(','),
      'Access-Control-Allow-Credentials': 'true'
    }
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
