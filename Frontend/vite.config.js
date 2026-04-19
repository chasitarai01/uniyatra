import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5001',
        ws: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React runtime
          'react-vendor': ['react', 'react-dom'],
          // Router
          'router': ['react-router-dom'],
          // Animation library
          'motion': ['framer-motion'],
          // Icons
          'icons': ['lucide-react', 'react-icons'],
          // State management
          'redux': ['@reduxjs/toolkit', 'react-redux'],
          // HTTP + Sockets
          'network': ['axios', 'socket.io-client'],
        },
      },
    },
  },
})
