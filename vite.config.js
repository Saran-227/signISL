import { defineConfig } from 'vite';

export default defineConfig({
  root: 'Signals',
  server: {
    port: 3000,
    open: true,
    host: true,
    proxy: {
      '/api': {
        target: 'https://isl2.davuniversity.org',
        changeOrigin: true,
        secure: false
      },
      '/media': {
        target: 'https://isl2.davuniversity.org',
        changeOrigin: true,
        secure: false
      },
      '/isl2-app': {
        target: 'https://isl2.davuniversity.org',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/isl2-app/, '')
      }
    }
  }
});
