import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],
  base: '/groomsmen-invitation/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
