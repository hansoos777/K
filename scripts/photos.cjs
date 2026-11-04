// 사이트용 공간 사진 찍기 (개발용): 사람 없이 건축만, 가로 1200x800 → public/photos/<world>_<place>.webp
// 사용: npm run build && npx vite preview --port 4174 & node scripts/photos.cjs [christian/modern ...]  (장소를 적으면 그것만, 힌두교는 빼고)
const { chromium } = require('playwright')
const { execFileSync } = require('node:child_process')
// [장소, 카메라 위치 x, z, 바라보는 방향, 거리, 바라보는 높이]
const SHOTS = [
  ['catholic/gothic', 0, 2, 0, 9, 5.5],
  ['catholic/parish', 0, 1, 0, 6, 2.2],
  ['catholic/grotto', 0, 7, 0, 6, 1.6],
  ['catholic/confessional', 0, 3, 0, 5, 1.4],
  ['christian/traditional', 0, 2, 0, 8, 3.2],
  ['christian/modern', 0, 9, 0, 8, 3],
  ['christian/prayer', 0, 1.6, 0, 4.5, 0.8],
  ['temple/daeung', 0, 4, 0, 9, 4.2],
  ['temple/courtyard', 0, 9, 0, 9, 2.6],
  ['temple/meditation', 0, 2.2, 0, 5, 0.8],
]
;(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] })
  const p = await b.newPage({ viewport: { width: 1200, height: 800 } })
  await p.addInitScript(() => localStorage.setItem('oruvia-v1', JSON.stringify({ quality: 'high', sound: false, tutorials: ['temple/daeung', 'catholic/gothic', 'christian/traditional', 'temple/courtyard'] })))
  const only = process.argv.slice(2)
  for (const [r, x, z, yaw, dist, lookY] of SHOTS) {
    if (only.length && !only.includes(r)) continue
    await p.goto('http://localhost:4174/?debug&photo#/w/' + r)
    await p.waitForFunction(() => window.__stage, null, { timeout: 30000 })
    await p.addStyleTag({ content: '.hud-top,.hud-places,.hud-dock,.hud-hint,.sheet,.space-loading,.tour,.spot,.gestures,.joystick{display:none!important}' })
    await p.evaluate(([x, z, yaw, dist, lookY]) => { const s = window.__stage; s.avatar.root.position.set(x, 0, z); s.yaw = yaw; s.dist = dist; s.lookY = lookY; s.pitch = 0.16 }, [x, z, yaw, dist, lookY])
    await p.waitForTimeout(3500)
    await p.screenshot({ path: '/tmp/oruvia-photo.png' })
    execFileSync('python3', ['-c', `from PIL import Image\nImage.open('/tmp/oruvia-photo.png').convert('RGB').save('public/photos/${r.replace('/', '_')}.webp','WEBP',quality=80,method=6)`])
    console.log('ok', r)
  }
  if (only.length) return b.close()
  // 힌두교: PujaTime 가네샤 사원과 나의 신전 (사람이 보이지 않게 위쪽만)
  const q = await b.newPage({ viewport: { width: 1200, height: 1100 } })
  await q.addInitScript(() => localStorage.setItem('pujatime-v1', JSON.stringify({ name: 'A', mainDeity: 'ganesha', otherDeities: ['lakshmi'], familyDeity: '', chosenDeity: '', lastPuja: null, festivalLamps: [], sound: false, journal: [] })))
  await q.goto('http://localhost:4174/hindu/?tab=mandir')
  await q.locator('button:has-text("가네샤")').first().click({ timeout: 30000 })
  await q.locator('button:has-text("사원 안으로 들어가기")').click()
  await q.waitForTimeout(9000)
  await q.screenshot({ path: '/tmp/oruvia-photo.png' })
  execFileSync('python3', ['-c', `from PIL import Image\nim=Image.open('/tmp/oruvia-photo.png').convert('RGB').crop((0,90,1200,890))\nim.save('public/photos/mandir_mandir.webp','WEBP',quality=80,method=6)`])
  console.log('ok mandir/mandir')
  // 나의 신전 사진(mandir_shrine.webp)은 신당 화면에서 신상 주변만 잘라 따로 만든다(자동 촬영은 화면이 어둡게 찍힘)
  await b.close()
})()
