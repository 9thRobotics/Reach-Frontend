import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000', // Proxy API requests to the backend
    },
  },
  base: '/Reach-Frontend/', // Base path for GitHub Pages deployment
});
