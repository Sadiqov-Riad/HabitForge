import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
export default defineConfig(() => {
    const apiBaseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:5106';
    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        server: {
            host: true,
            port: 5174,
            strictPort: true,
            proxy: {
                '/api': {
                    target: apiBaseUrl,
                    changeOrigin: true,
                    secure: false,
                },
            },
        },
        preview: {
            host: true,
            port: 4173,
            strictPort: true,
        },
    };
});
