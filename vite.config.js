import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'Cedrik-Musik',
        short_name: 'Cedrik-Musik',
        description: 'Suivi des élèves de guitare',
        theme_color: '#0a0a0a',
        background_color: '#1a1a1a',
        display: 'standalone',
        start_url: '/guitar-app/',
        scope: '/guitar-app/',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  base: '/guitar-app/',
})
