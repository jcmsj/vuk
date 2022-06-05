import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'
import { VitePWA } from 'vite-plugin-pwa'
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
  plugins: [mkcert(), vue(), 
    VitePWA({
      manifest:{
        "name": "Vuk",
        "background_color": "white",
        "theme_color":"#FFFFFF",
        "icons" : [
          {
            "src": "./public/app.webp",
            "sizes":"512x512",
            "type":"image/webp"
          },
          {
            "src":"./public/favicon.ico",
            "sizes":"32x32",
          }
        ]
      }
    })],
  build: {
    rollupOptions: {
      
    }
  }
})