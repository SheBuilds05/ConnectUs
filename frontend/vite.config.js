import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  // 1. Monorepo Fix: Ensures relative paths work correctly on Vercel
  base: './',
  
  plugins: [
    react(),
    tailwindcss(),
  ],

  // 2. Resolve Fix: Helps Vite find your 'src' folder regardless of environment
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },

  // 3. Build Optimization: Prevents the "3 modules transformed" hang
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false, // Disabling sourcemaps speeds up Vercel builds significantly
    rollupOptions: {
      // Manual Chunks: Splits your large App.tsx into smaller pieces
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react'],
        },
      },
    },
  },

  esbuild: {
    loader: 'tsx',
    include: /src\/.*\.[tj]sx?$/,
    exclude: [],
  },

  test: {
    globals: true,
    environment: 'jsdom',
    watch: false,
  },
})