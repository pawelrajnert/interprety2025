import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/products': {
                target: 'http://localhost:2115', // Your backend URL
                changeOrigin: true,
                secure: false,
            },
            '/orders': {
                target: 'http://localhost:2115', // Your backend URL
                changeOrigin: true,
                secure: false,
            },
            '/categories': {
                target: 'http://localhost:2115', // Your backend URL
                changeOrigin: true,
                secure: false,
            },
            '/status': {
                target: 'http://localhost:2115', // Your backend URL
                changeOrigin: true,
                secure: false,
            },
            '/login': {
                target: 'http://localhost:2115', // Your backend URL
                changeOrigin: true,
                secure: false,
            },
            '/register': {
                target: 'http://localhost:2115', // Your backend URL
                changeOrigin: true,
                secure: false,
            },
            '/password': {
                target: 'http://localhost:2115', // Your backend URL
                changeOrigin: true,
                secure: false,
            },
            '/init': {
                target: 'http://localhost:2115', // Your backend URL
                changeOrigin: true,
                secure: false,
            },
            // If you have other routes, you can use a wildcard like this:
            // '/api': {
            //   target: 'http://localhost:2115',
            //   changeOrigin: true,
            //   rewrite: (path) => path.replace(/^\/api/, ''),
            // }
        },
    },
})
