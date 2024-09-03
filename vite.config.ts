import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: './', // Dosya yollarını doğru ayarlamak için
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  build: {
    sourcemap: false, // Disable sourcemaps
  }
});
