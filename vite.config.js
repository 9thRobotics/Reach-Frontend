import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: 'localhost', // Ensure the server listens on localhost
        port: 5173,        // Change port to 5173
        proxy: {
            '/api': {
                target: 'http://localhost:3000', // Backend API URL
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Clean up paths
            },
        },
    },
});
