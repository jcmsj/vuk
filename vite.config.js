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
            "src": "/vuk.webp",
            "sizes":"512x512",
            "type":"image/webp"
          },
          {
            "src": "/vuk-t.png",
            "sizes":"512x512",
            "type":"image/png",
            "purpose": "maskable"
          },
          {
            "src": "/vuk-p.png",
            "sizes":"512x512",
            "type":"image/png",
          },
          {
            "src":"/favicon.ico",
            "sizes":"128x128",
          }
        ]
      }
    })],
  build: {
    rollupOptions: {
      
    }
  }
})