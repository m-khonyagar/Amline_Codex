import path from 'node:path'
import { defineConfig, normalizePath } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // viteTsConfigPaths({
    //   root: '../../',
    // }),
    viteStaticCopy({
      targets: [
        // {
        //   src: normalizePath(path.resolve('libs/assets/src/*')),
        //   dest: 'assets',
        // },
        {
          src: normalizePath(path.resolve('liara.json')),
          dest: './',
        },
        {
          src: normalizePath(path.resolve('liara_nginx.conf')),
          dest: './',
        },
      ],
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true,
        additionalData: '@import "@/assets/styles/_functions.scss";',
      },
    },
  },

  server: {
    port: 3001,
  },
})
