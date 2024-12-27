import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@api': path.resolve(__dirname, 'src/api'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            '@config': path.resolve(__dirname, 'src/config'),
            '@components': path.resolve(__dirname, 'src/components'),
            '@views': path.resolve(__dirname, 'src/views'),
            '@hooks': path.resolve(__dirname, 'src/hooks'),
        },
    },
    server: {
        proxy: {
            '/uploads': {
                target: 'http://localhost:3000', // Cible du proxy (votre serveur Express)
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/uploads/, '/uploads'), // Conserve la route après /uploads
            },
        },
    },
})
