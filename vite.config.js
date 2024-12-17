import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite configuration for React
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Default port for Vite development server
  },
  build: {
    outDir: 'dist', // Output folder for production builds
  }
});
