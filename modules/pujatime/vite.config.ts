import { BRAND } from './src/brand'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // ORUVIA 안에 넣어 빌드할 때는 PWA를 끔(서비스 워커는 ORUVIA가 하나만 둠)
      disable: process.env.ORUVIA_EMBED === '1',
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      workbox: { globPatterns: ['**/*.{js,css,html,svg,woff2,jpg,png,mp3}'], globIgnores: ['admin.html', 'privacy.html', 'robots.txt'], navigateFallbackDenylist: [/^\/admin/, /^\/api/, /^\/privacy/] },
      manifest: {
        name: BRAND,
        short_name: BRAND,
        description: 'Your personal shrine, wherever you are.',
        theme_color: '#e8590c',
        background_color: '#fff3d6',
        display: 'standalone',
        orientation: 'portrait',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
    }),
  ],
})
