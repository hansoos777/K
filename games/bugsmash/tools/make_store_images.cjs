// 앱인토스 등록용 이미지를 만든다 → games/bugsmash/store/
//   thumbnail-1932x828.png(썸네일), screen-1~4.png(세로 636×1048) — 앱 로고는 store/logo-600.png(받은 그림)
// 쓰는 법: games/bugsmash 폴더를 웹 서버로 띄운 뒤(예: python3 -m http.server 8765)
//   node tools/make_store_images.cjs http://127.0.0.1:8765
const { chromium } = require('playwright')
const fs = require('fs'), path = require('path')

const BASE = process.argv[2] || 'http://127.0.0.1:8765'
const OUT = path.join(__dirname, '..', 'store')
fs.mkdirSync(OUT, { recursive: true })

;(async () => {
  const b = await chromium.launch()
  // 1) 로고·썸네일(그림 페이지의 캔버스를 그대로 저장)
  const p = await b.newPage({ viewport: { width: 2000, height: 1600 } })
  await p.goto(`${BASE}/tools/store.html`, { waitUntil: 'load' })
  await p.waitForFunction(() => window.__done === true, null, { timeout: 20000 })
  // 앱 로고(logo-600.png)는 따로 받은 그림을 쓰므로 여기서 만들지 않는다
  for (const [id, file] of [['thumb', 'thumbnail-1932x828.png']]) {
    const url = await p.evaluate((id) => document.getElementById(id).toDataURL('image/png'), id)
    fs.writeFileSync(path.join(OUT, file), Buffer.from(url.split(',')[1], 'base64'))
  }
  await p.close()

  // 2) 실제 게임 화면(세로 636×1048 = 318×524 화면을 2배로)
  const g = await b.newPage({ viewport: { width: 318, height: 524 }, deviceScaleFactor: 2, hasTouch: true })
  await g.goto(`${BASE}/?store=1`, { waitUntil: 'load' })
  await g.waitForTimeout(1200)
  const api = (fn, arg) => g.evaluate(fn, arg)
  const target = () => api(() => { const b = window.__bugsmash.G.bugs.find((b) => b.state === 'alive' && b.inside); return b ? [b.x, b.y] : null })
  const hit = async (n, wait) => { for (let i = 0; i < n; i++) { const q = await target(); if (q) await g.mouse.click(q[0], q[1]); await g.waitForTimeout(wait) } }
  await api(() => { const { G } = window.__bugsmash; Object.assign(G.settings, { style: 3, diff: 2, bg: 'floor', sound: false, vibe: false }) })

  // ① 메뉴
  await api(() => window.__bugsmash.toMenu())
  await g.waitForTimeout(2500)
  await g.screenshot({ path: path.join(OUT, 'screen-1.png') })

  // ② 하수구 웨이브: 책·망치로 쾅
  await api(() => window.__bugsmash.startGame('maps', 1))
  await g.waitForTimeout(4200)
  await api(() => window.__bugsmash.selectWeapon('book')); await hit(2, 700)
  await api(() => window.__bugsmash.selectWeapon('hammer')); await hit(2, 150)
  await g.waitForTimeout(250)
  await g.screenshot({ path: path.join(OUT, 'screen-2.png') })

  // ③ 폐건물 보스(엄마 거미)
  await api(() => window.__bugsmash.startGame('maps', 2))
  for (let w = 0; w < 3; w++) { await g.waitForTimeout(1600); await api(() => window.__bugsmash.skipWave()) }
  await g.waitForTimeout(2600)
  // 실에 매달려 내려오는 중이면 화면 가운데에 내려놓는다
  await api(() => { const b = window.__bugsmash.G.bugs.find((x) => x.boss); if (b) Object.assign(b, { mode: 'wait', modeT: 3, x: 170, y: 290, a: -1.9, ta: -1.9 }) })
  await g.waitForTimeout(700)
  await api(() => window.__bugsmash.selectWeapon('swatter'))
  const bq = await api(() => { const b = window.__bugsmash.G.bugs.find((x) => x.boss); return b ? [b.x, b.y] : [160, 260] })
  await g.mouse.move(bq[0] + 30, bq[1] + 40)
  await g.mouse.click(bq[0], bq[1]); await g.waitForTimeout(650)
  await g.screenshot({ path: path.join(OUT, 'screen-3.png') })

  // ④ 밀림에서 화염방사기
  await api(() => window.__bugsmash.startGame('maps', 3))
  await g.waitForTimeout(4500)
  await api(() => window.__bugsmash.selectWeapon('flame'))
  const fq = (await target()) || [160, 250]
  await g.mouse.move(fq[0], fq[1]); await g.mouse.down()
  for (let i = 0; i < 30; i++) { const q = await target(); if (q) await g.mouse.move(q[0], q[1], { steps: 3 }); await g.waitForTimeout(45) }
  await g.screenshot({ path: path.join(OUT, 'screen-4.png') })
  await g.mouse.up()

  await b.close()
  for (const f of fs.readdirSync(OUT)) console.log(f, fs.statSync(path.join(OUT, f)).size)
})()
