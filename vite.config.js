import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import qiankun from 'vite-plugin-qiankun';
import path from 'path';
import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite';

// const allowedOrigins = [
//   'https://fabidev.ipos.vn',
//   'https://fabi.ipos.vn',
//   'https://fabi.nport.link',
//   'http://localhost:6969'
// ];

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  console.log('BASE URL:', env.VITE_SUB_APP_URL); // check giá trị
  console.log(mode);

  return {
    optimizeDeps: {
      noDiscovery: mode !== 'development'
    },

    plugins: [
      vue(),

      qiankun('fabi-cms-sub-vue3', {
        useDevMode: true
      }),

      // Tự động import các component trong '/components/Common' và component Primevue
      Components({
        dirs: ['src/components/Common'],
        resolvers: [PrimeVueResolver()]
      }),

      // Tự động import $t để xử lý i18n
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
      allowedHosts: ['sub-fabi.nport.link', 'localhost', 'cms.iposdev.com', 'cms.ipos.com'],
      headers: {
        'Access-Control-Allow-Origin': '*'
        // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        // 'Access-Control-Allow-Headers': 'Content-Type'
      }
    },

    base: env.VITE_SUB_APP_URL,

    build: {
      outDir: 'dist',
      assetsDir: 'static',
      target: 'esnext',
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          format: 'system',
          name: 'fabiCmsSubVue3',
          entryFileNames: 'js/[name].js',
          chunkFileNames: 'js/[name].js',
          assetFileNames: 'static/[name].[ext]'
        }
      }
    }
  };
});
