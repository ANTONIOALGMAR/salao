import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        // No rewrite needed if backend expects /api prefix
      },
    },
  },
});
