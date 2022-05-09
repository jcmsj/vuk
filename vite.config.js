import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'
// https://vitejs.dev/config/

export default defineConfig({
  server: { 
    https: {
      cert: "./certs/dev.pem",
      key: "./certs/dev.key"
    },
    open: "./index.html",
    port: 80
  },
  plugins: [mkcert(), vue()]
})