
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: 'autoUpdate',

      // Habilitar PWA durante el desarrollo
      devOptions: {
        enabled: true
      },

      includeAssets: ['favicon.ico'],

      manifest: {
        name: 'Sumaq Ñan - Sistema de Restaurante',
        short_name: 'Sumaq Ñan',
        description: 'Sistema de gestión para el restaurante Sumaq Ñan',
        lang: 'es',
        theme_color: '#8B4513',
        background_color: '#FFF8F0',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },

      workbox: {
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true
      }
    })
  ]
})
