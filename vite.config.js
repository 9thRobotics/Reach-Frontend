import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Reach-Frontend/', // Adjust this to match your GitHub repository name if deploying to GitHub Pages
  server: {
    port: 5173, // Default Vite development server port
    proxy: {
      '/api': 'http://localhost:3000', // Proxy API requests to your backend
    },
  },
});
