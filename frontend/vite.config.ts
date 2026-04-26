import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        watch: {
            usePolling: true,
        },
        host: true,
        port: 5173,
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, './src'),
        }
    }
})
