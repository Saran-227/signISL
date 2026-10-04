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

function copyStaticAssetsPlugin() {
  return {
    name: 'copy-static-assets',
    closeBundle() {
      const outDir = resolve(signalsDir, 'dist');
      if (!fs.existsSync(outDir)) return;

      const entries = fs.readdirSync(signalsDir, { withFileTypes: true });
      for (const entry of entries) {
        if (['dist', 'node_modules', '.git', '.vite'].includes(entry.name)) continue;
        if (entry.name.endsWith('.html')) continue;
        
        const srcPath = resolve(signalsDir, entry.name);
        const destPath = resolve(outDir, entry.name);
        fs.cpSync(srcPath, destPath, { recursive: true, force: true });
      }
    }
  };
}

export default defineConfig({
  root: 'Signals',
  plugins: [copyStaticAssetsPlugin()],
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
