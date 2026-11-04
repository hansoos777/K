import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { BRAND } from './src/brand'

/** 서비스 이름을 index.html과 앱 manifest에 넣는다(이름은 src/brand.ts 한 곳에서만 관리) */
function brand(): Plugin {
  const manifest = () => JSON.stringify({
    name: `${BRAND.ko} ${BRAND.en}`,
    short_name: BRAND.ko,
    description: BRAND.tagline,
    start_url: '/',
    display: 'standalone',
    background_color: '#0e1118',
    theme_color: '#0e1118',
    lang: 'ko',
    icons: [{ src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }, null, 2)
  return {
    name: 'brand',
    transformIndexHtml: (html) => html.replaceAll('%BRAND_KO%', BRAND.ko).replaceAll('%BRAND%', BRAND.en),
    configureServer(server) {
      server.middlewares.use('/manifest.webmanifest', (_req, res) => {
        res.setHeader('Content-Type', 'application/manifest+json')
        res.end(manifest())
      })
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'manifest.webmanifest', source: manifest() })
    },
  }
}

export default defineConfig({
  plugins: [react(), brand()],
  build: {
    target: 'es2020',
    // 공간(월드)별 코드는 React.lazy로 따로 쪼개져 필요할 때만 받음
    chunkSizeWarningLimit: 400, // 3D 엔진(three.js) 청크는 공간에 들어갈 때만 받음
  },
})
