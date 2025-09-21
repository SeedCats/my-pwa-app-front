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
          },
        ]
      }

    })
  ]
});