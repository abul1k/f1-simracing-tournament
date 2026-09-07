import path from 'path'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Root by default; CI sets VITE_BASE when deploying to a GitHub Pages subpath.
  base: process.env.VITE_BASE ?? '/',
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
      '@data': path.resolve(import.meta.dirname, './data'),
    },
  },
})
