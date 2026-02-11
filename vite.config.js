import { defineConfig } from 'vite';
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

    // {
    //   name: 'configure-cors',
    //   configureServer(server) {
    //     server.middlewares.use((req, res, next) => {
    //       const origin = req.headers.origin;

    //       // Chỉ set origin nếu nó nằm trong allowlist
    //       if (origin && allowedOrigins.includes(origin)) {
    //         res.setHeader('Access-Control-Allow-Origin', origin); // ← Động, không duplicate
    //         res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    //         res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    //         res.setHeader('Access-Control-Allow-Credentials', 'true');
    //       }

    //       // Handle preflight
    //       if (req.method === 'OPTIONS') {
    //         res.statusCode = 204;
    //         res.end();
    //         return;
    //       }

    //       next();
    //     });
    //   }
    // }
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
    // host: '0.0.0.0',
    allowedHosts: ['sub-fabi.nport.link', 'localhost', 'cms.iposdev.com', 'cms.ipos.com'],
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },

  base: '/',

  build: {
    outDir: 'dist',
    assetsDir: 'static',
    target: 'esnext',
    cssCodeSplit: false,
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
