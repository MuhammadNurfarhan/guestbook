import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Fonts from 'unplugin-fonts/vite'
import Vue from '@vitejs/plugin-vue'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'fs';

import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    AutoImport({
      imports: [
        'vue',
        'vue-i18n',
        {
          'vue-router/auto': ['useRoute', 'useRouter'],
        },
      ],
      resolvers: [ElementPlusResolver()],
      dts: 'src/auto-imports.d.ts',
      dirs: ['src/stores'],
      eslintrc: {
        enabled: true,
      },
      vueTemplate: true,
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      dirs: ['src/components', 'src/layouts', 'src/views/**/components'],
      dts: 'src/components.d.ts',
    }),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        configFile: 'src/styles/settings.scss',
      },
    }),
    Fonts({
      google: {
        families: [
          {
            name: 'Roboto',
            styles: 'wght@100;300;400;500;700;900',
          },
        ],
      },
    }),
    mkcert(),
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: ['.js', '.json', '.jsx', '.mjs', '.ts', '.tsx', '.vue'],
  },
  server: {
    host: '0.0.0.0',
    port: 443,
    cors: true,
    open: true,
    https: {
      key: readFileSync('key.pem'),
      cert: readFileSync('cert.pem'),
    },
    proxy: {
      '/api': {
        target: 'http://192.168.111.9:8080',
        changeOrigin: true,
      }
    }
  },
  build: {
    target: 'es2015',
    outDir: 'dist',
    assetsDir: 'static',
    sourcemap: false,
    chunkSizeWarningLimit: 2000,
  },
})
