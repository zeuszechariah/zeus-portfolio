import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    hmr: { host: '192.168.1.2' },
  },
  build: {
    target: 'es2020',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router':       ['react-router-dom'],
          'motion':       ['framer-motion'],
          'gsap':         ['gsap'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
    assetsInlineLimit: 4096,
  },
})
