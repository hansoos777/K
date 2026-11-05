// 공간 미리보기 이미지 만들기 (개발용): 실제 3D 공간을 열어 조작부를 숨기고 찍은 뒤 WebP로 저장.
// 사용: npm run build && npx vite preview --port 4174 & node scripts/thumbs.cjs
// 결과: public/thumbs/<world>_<place>.webp (카드용 세로 480x640, 줄 카드용 가로 320x200은 CSS로 잘라 씀)
const { chromium } = require('playwright')
const { execFileSync } = require('node:child_process')
const places = process.argv.slice(2).length ? process.argv.slice(2) : [
  'christian/traditional', 'christian/modern', 'christian/prayer',
  'catholic/parish', 'catholic/gothic', 'catholic/grotto', 'catholic/confessional',
  'temple/daeung', 'temple/courtyard', 'temple/meditation',
]
;(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
  const p = await b.newPage({ viewport: { width: 600, height: 720 }, deviceScaleFactor: 1 })
  await p.addInitScript(() => localStorage.setItem('oruvia-v1', JSON.stringify({ quality: 'high', sound: false, tutorials: ['temple/daeung','catholic/gothic','christian/traditional','temple/courtyard'] })))
  for (const r of places) {
    await p.goto('http://localhost:4174/#/w/' + r)
    await p.waitForSelector('.stage-canvas', { timeout: 20000 })
    await p.addStyleTag({ content: '.hud-top,.hud-places,.hud-dock,.hud-hint,.sheet,.space-loading,.tour,.spot,.gestures,.joystick{display:none!important}' })
    await p.waitForTimeout(2500)
    const png = `/tmp/site-thumb.png`
    await p.screenshot({ path: png })
    execFileSync('python3', ['-c', `
from PIL import Image
im=Image.open('${png}').convert('RGB')
im.save('public/thumbs/${r.replace('/', '_')}.webp','WEBP',quality=78,method=6)
`])
    console.log('ok', r)
  }
  await b.close()
})()
