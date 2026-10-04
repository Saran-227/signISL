import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

const signalsDir = resolve(__dirname, 'Signals');
const htmlFiles = fs.readdirSync(signalsDir)
  .filter(file => file.endsWith('.html') && !file.includes(' ') && !file.includes('-prep'))
  .reduce((entries, file) => {
    const name = file.replace(/\.html$/, '');
    entries[name] = resolve(signalsDir, file);
    return entries;
  }, {});

export default defineConfig({
  root: 'Signals',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: htmlFiles
    }
  },
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
