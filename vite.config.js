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
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/data/heartrate'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-heart-rate',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/data/stress'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-stress',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/data/bmi'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-bmi',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 10
            }
          }
        ]
      },
      
      includeAssets: ['vite.svg', 'screenshot.png'],  // Assets to cache
      injectRegister: 'auto',  // Automatically injects the service worker registration

      manifest: {
        id: '/',
        name: 'My Vue PWA',
        short_name: 'VuePWA',
        description: 'A Progressive Web App built with Vue and Vite',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',

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

    })
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