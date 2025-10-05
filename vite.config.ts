import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    target: 'esnext', // Modern browsers for better performance
    sourcemap: false, // Disable sourcemaps for production
    chunkSizeWarningLimit: 1500, // Suppress chunk warning
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          // Separate TypeScript/large libraries
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  },
  esbuild: {
    // TypeScript optimization
    target: 'esnext',
    minify: true
  }
})