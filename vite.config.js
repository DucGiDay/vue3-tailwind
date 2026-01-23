import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import qiankun from 'vite-plugin-qiankun';
import path from 'path';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins: [
    vue(),

    qiankun('fabi-cms-sub-vue3', {
      useDevMode: true
    }),

    Components({
      dirs: ['src/components/Common'],
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
    host: '0.0.0.0',
    cors: true, 
    // Hoặc dùng:
    // headers: {
    //   'Access-Control-Allow-Origin': '*'
    // }
  },

  base: '/',

  build: {
    outDir: 'dist',
    assetsDir: 'static',
    target: 'esnext',
    cssCodeSplit: false, // Quan trọng cho qiankun
    rollupOptions: {
      output: {
        format: 'umd',
        name: 'fabiCmsSubVue3',
        entryFileNames: 'js/[name].js',
        chunkFileNames: 'js/[name].js',
        assetFileNames: 'static/[name].[ext]'
      }
    }
  }
});