import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// https://vitejs.dev/config/

export default defineConfig({
  server: { 
    https: true,
    open: "./index.html",
    port: 80
  },
  plugins: [vue()]
})