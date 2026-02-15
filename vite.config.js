import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),

    VitePWA({
      registerType: 'autoUpdate',  // Automatically updates the service worker
      devOptions: { enabled: true },  // Enables PWA in development mode for testing
      workbox: {
        clientsClaim: true,
        skipWaiting: true
      },
        icons: [
          {
            src: 'icon192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ],

        "screenshots": [
          {
            "src": "screenshot.png",
            "sizes": "1600x800",
            "type": "image/png",
            "form_factor": "wide",
            "label": "Homepage"
          }
        ]
      }
  ],
  
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },

});