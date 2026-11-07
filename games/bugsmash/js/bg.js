// 바닥 그림: 나무 마루 · 주방 타일 · 컴퓨터 바탕화면(망치로 치면 모니터 유리가 깨지는 느낌)
// 스테이지 맵: 하수구 · 폐건물 · 밀림 · 벌레 소굴. 맵마다 움직이는 분위기(물살·어둠·낙엽·붉은 맥박)가 있다
import { G } from './state.js'
import { seeded, clamp, mix, alpha, rr, ell, R, TAU } from './util.js'

export const BGS = [['floor', '나무 마루'], ['tile', '주방 타일'], ['screen', '컴퓨터 화면'], ['sewer', '하수구'], ['ruin', '폐건물'], ['jungle', '밀림']]

let L = { kind: 'floor' } // 지금 바닥의 배치(물길 위치 등) — 움직이는 분위기에서 쓴다

export function drawBg(kind) { paintBg(G.ctx.bg, kind, G.W, G.H, true) }

/** 바닥을 아무 캔버스에나 그린다(맵 고르기 화면의 작은 그림에도 쓴다) */
export function paintBg(c, kind, W, H, live = false) {
  const r = seeded(11)
  const lay = { kind }
  c.clearRect(0, 0, W, H)
  if (kind === 'tile') tile(c, W, H, r)
  else if (kind === 'screen') screen(c, W, H, r)
  else if (kind === 'sewer') sewer(c, W, H, r, lay)
  else if (kind === 'ruin') ruin(c, W, H, r)
  else if (kind === 'jungle') jungle(c, W, H, r)
  else if (kind === 'nest') nest(c, W, H, r)
  else floor(c, W, H, r)
  const v = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75)
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.38)')
  c.fillStyle = v; c.fillRect(0, 0, W, H)
  // 고운 입자(필름 같은 결) — 그림이 매끈한 컴퓨터 그림처럼 보이지 않게
  c.fillStyle = c.createPattern(grain(), 'repeat'); c.fillRect(0, 0, W, H)
  if (live) { L = lay; amb.leaves = []; amb.rings = []; amb.motes = [] }
}

// ── 공통 도구 ──
let grainTile = null
function grain() {
  if (grainTile) return grainTile
  const s = 160, t = document.createElement('canvas'); t.width = t.height = s
  const x = t.getContext('2d'), d = x.createImageData(s, s)
  for (let i = 0; i < d.data.length; i += 4) {
    const v = Math.random() < 0.5 ? 0 : 255
    d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = Math.random() * 15
  }
  x.putImageData(d, 0, 0)
  return (grainTile = t)
}
function speckle(c, W, H, r, n, cols) {
  for (let i = 0; i < n; i++) {
    c.fillStyle = cols[i % cols.length]
    const s = 0.6 + r() * 1.8
    c.fillRect(r() * W, r() * H, s, s)
  }
}
function blot(c, x, y, rad, col, a) {
  const g = c.createRadialGradient(x, y, 0, x, y, rad)
  g.addColorStop(0, alpha(col, a)); g.addColorStop(1, alpha(col, 0))
  c.fillStyle = g; c.fillRect(x - rad, y - rad, rad * 2, rad * 2)
}
function jag(c, x, y, a, len, steps, r, w, col) {
  c.strokeStyle = col; c.lineWidth = w; c.lineJoin = 'round'; c.lineCap = 'round'
  c.beginPath(); c.moveTo(x, y)
  for (let i = 0; i < steps; i++) { a += (r() - 0.5) * 0.9; x += Math.cos(a) * len / steps; y += Math.sin(a) * len / steps; c.lineTo(x, y) }
  c.stroke()
}
function poly(c, x, y, rad, n, r) {
  c.beginPath()
  for (let i = 0; i < n; i++) { const a = (i / n) * TAU + r() * 0.5, d = rad * (0.6 + r() * 0.5); c[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * d, y + Math.sin(a) * d) }
  c.closePath()
}

// ── 하수구: 가운데로 더러운 물이 흐르고 양옆은 젖은 콘크리트 ──
function sewer(c, W, H, r, lay) {
  const g0 = c.createLinearGradient(0, 0, W, H)
  g0.addColorStop(0, '#50544c'); g0.addColorStop(1, '#3d413b')
  c.fillStyle = g0; c.fillRect(0, 0, W, H)
  speckle(c, W, H, r, (W * H) / 90, ['rgba(0,0,0,.22)', 'rgba(255,255,255,.07)', 'rgba(20,30,20,.25)'])
  const slab = clamp(Math.min(W, H) * 0.32, 110, 230)
  c.strokeStyle = 'rgba(20,22,18,.45)'; c.lineWidth = 2
  for (let y = slab * r(); y < H; y += slab) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke() }
  const cw = clamp(W * 0.34, 110, 360), x0 = W / 2 - cw / 2 + (r() - 0.5) * W * 0.08, x1 = x0 + cw
  lay.ch = { x0, x1 }
  // 물길 턱
  c.fillStyle = '#2c302a'; c.fillRect(x0 - 12, 0, cw + 24, H)
  c.fillStyle = 'rgba(255,255,255,.06)'; c.fillRect(x0 - 12, 0, 3, H); c.fillRect(x1 + 9, 0, 3, H)
  const g = c.createLinearGradient(x0, 0, x1, 0)
  g.addColorStop(0, '#141c15'); g.addColorStop(0.5, '#2a3a28'); g.addColorStop(1, '#141c15')
  c.fillStyle = g; c.fillRect(x0, 0, cw, H)
  // 물 위 기름띠·찌꺼기
  for (let i = 0; i < 26; i++) blot(c, x0 + r() * cw, r() * H, 10 + r() * 30, pick3(r, '#6b7a3a', '#3f4a2a', '#7a6a3a'), 0.25)
  // 가장자리 녹색 물때
  for (let y = 0; y < H; y += 5) {
    for (const ex of [x0, x1]) blot(c, ex + (r() - 0.5) * 10, y, 6 + r() * 10, '#6f8f3a', 0.22)
  }
  // 벽 배수관(물길 쪽으로 열린 동그란 관)
  for (let i = 0; i < 4; i++) {
    const left = i % 2 === 0, px = left ? x0 - 30 : x1 + 30, py = (0.15 + i * 0.22 + r() * 0.08) * H, pr = clamp(Math.min(W, H) * 0.06, 20, 40)
    c.fillStyle = '#5e5f58'; ell(c, px, py, pr, pr); c.fill()
    c.fillStyle = '#0d0f0c'; ell(c, px, py, pr * 0.72, pr * 0.72); c.fill()
    c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 2; ell(c, px, py, pr * 0.9, pr * 0.9); c.stroke()
    blot(c, px + (left ? pr : -pr), py + pr * 0.6, pr * 1.2, '#6f8f3a', 0.35)
  }
  // 배수 철망
  const gw = clamp(W * 0.2, 70, 150), gh = gw * 0.6, gx = r() < 0.5 ? x0 * 0.5 - gw / 2 : x1 + (W - x1) * 0.5 - gw / 2, gy = H * (0.55 + r() * 0.2)
  c.fillStyle = '#1a1b18'; rr(c, gx, gy, gw, gh, 6); c.fill()
  c.strokeStyle = '#5a5c55'; c.lineWidth = 4
  for (let x = gx + 10; x < gx + gw - 6; x += 12) { c.beginPath(); c.moveTo(x, gy + 6); c.lineTo(x, gy + gh - 6); c.stroke() }
  c.strokeStyle = '#6b6d65'; c.lineWidth = 3; rr(c, gx, gy, gw, gh, 6); c.stroke()
  // 웅덩이·녹물
  lay.puddles = []
  for (let i = 0; i < 6; i++) {
    const left = r() < 0.5, px = left ? r() * (x0 - 30) + 10 : x1 + 20 + r() * (W - x1 - 30), py = r() * H, pw = 20 + r() * 50
    c.fillStyle = 'rgba(15,22,16,.55)'; ell(c, px, py, pw, pw * 0.5, r()); c.fill()
    c.fillStyle = 'rgba(255,255,255,.08)'; ell(c, px - pw * 0.3, py - pw * 0.12, pw * 0.35, pw * 0.08, -0.3); c.fill()
    lay.puddles.push([px, py, pw])
  }
  for (let i = 0; i < 8; i++) blot(c, r() * W, r() * H, 20 + r() * 50, '#7a4a26', 0.18)
}
const pick3 = (r, a, b, d) => { const v = r(); return v < 0.33 ? a : v < 0.66 ? b : d }

// ── 폐건물: 금 간 콘크리트, 잔해, 녹물, 깨진 유리 ──
function ruin(c, W, H, r) {
  const g0 = c.createLinearGradient(0, 0, 0, H)
  g0.addColorStop(0, '#7a766c'); g0.addColorStop(1, '#5d5950')
  c.fillStyle = g0; c.fillRect(0, 0, W, H)
  speckle(c, W, H, r, (W * H) / 70, ['rgba(0,0,0,.2)', 'rgba(255,255,255,.08)'])
  const slab = clamp(Math.min(W, H) * 0.36, 120, 260)
  c.strokeStyle = 'rgba(30,28,24,.5)'; c.lineWidth = 2
  for (let x = slab * r(); x < W; x += slab) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke() }
  for (let y = slab * r(); y < H; y += slab) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke() }
  // 얼룩
  for (let i = 0; i < 10; i++) blot(c, r() * W, r() * H, 30 + r() * 90, '#7a4a26', 0.22)
  for (let i = 0; i < 6; i++) blot(c, r() * W, r() * H, 40 + r() * 90, '#1d1b17', 0.3)
  // 깨진 타일 자리
  const tx = r() * W * 0.6, ty = r() * H * 0.7, ts = clamp(Math.min(W, H) * 0.07, 22, 40)
  for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) {
    if (r() < 0.3) continue
    c.fillStyle = mix('#b9b2a0', '#8a8474', r()); rr(c, tx + i * ts, ty + j * ts, ts - 3, ts - 3, 2); c.fill()
    if (r() < 0.4) jag(c, tx + i * ts + ts * 0.2, ty + j * ts + ts * 0.2, r() * TAU, ts * 0.8, 3, r, 1, 'rgba(40,36,30,.6)')
  }
  // 금
  for (let i = 0; i < 9; i++) {
    const x = r() * W, y = r() * H, a = r() * TAU, len = 80 + r() * 260
    jag(c, x + 1, y + 1, a, len, 9, seeded(i + 3), 2.4, 'rgba(20,18,15,.6)')
    jag(c, x, y, a, len, 9, seeded(i + 3), 1, 'rgba(200,195,180,.25)')
  }
  // 나무판자
  for (let i = 0; i < 2; i++) {
    c.save(); c.translate(r() * W, r() * H); c.rotate(r() * TAU)
    const pw = clamp(W * 0.5, 160, 340), ph = pw * 0.12
    c.fillStyle = 'rgba(0,0,0,.3)'; c.fillRect(-pw / 2 + 5, -ph / 2 + 6, pw, ph)
    c.fillStyle = '#6e5232'; c.fillRect(-pw / 2, -ph / 2, pw, ph)
    c.strokeStyle = 'rgba(40,25,12,.45)'; c.lineWidth = 1
    for (let k = 0; k < 4; k++) { c.beginPath(); c.moveTo(-pw / 2, -ph / 2 + ph * (0.2 + k * 0.2)); c.lineTo(pw / 2, -ph / 2 + ph * (0.25 + k * 0.18)); c.stroke() }
    c.fillStyle = '#3a3a36'; for (const nx of [-0.42, 0.42]) { ell(c, nx * pw, 0, 2.5, 2.5); c.fill() }
    c.restore()
  }
  // 버려진 신문
  c.save(); c.translate(r() * W, r() * H); c.rotate(r() * TAU)
  const nw = clamp(W * 0.28, 90, 180), nh = nw * 0.7
  c.fillStyle = '#c9c2ae'; c.fillRect(-nw / 2, -nh / 2, nw, nh)
  c.fillStyle = 'rgba(60,55,45,.35)'
  for (let k = 0; k < 9; k++) c.fillRect(-nw / 2 + 8, -nh / 2 + 10 + k * nh * 0.09, nw * (k ? 0.8 : 0.5), 2)
  c.restore()
  // 잔해 덩어리
  for (let i = 0; i < 46; i++) {
    const x = r() * W, y = r() * H, s = 3 + r() * (i < 8 ? 22 : 9)
    c.fillStyle = 'rgba(0,0,0,.3)'; poly(c, x + 2, y + 3, s, 6, seeded(i + 50)); c.fill()
    c.fillStyle = mix('#8f8a7e', '#5a564d', r()); poly(c, x, y, s, 6, seeded(i + 50)); c.fill()
  }
  // 깨진 유리 조각
  for (let i = 0; i < 18; i++) {
    const x = r() * W, y = r() * H, s = 3 + r() * 8
    c.fillStyle = 'rgba(210,235,240,.35)'
    c.beginPath(); c.moveTo(x, y); c.lineTo(x + s, y + s * 0.3); c.lineTo(x + s * 0.2, y + s); c.closePath(); c.fill()
  }
}

// ── 밀림: 흙바닥, 이끼, 뿌리, 수북한 낙엽, 나뭇잎 사이 햇빛 ──
function jungle(c, W, H, r) {
  const g0 = c.createLinearGradient(0, 0, W, H)
  g0.addColorStop(0, '#4b3a24'); g0.addColorStop(1, '#33281a')
  c.fillStyle = g0; c.fillRect(0, 0, W, H)
  speckle(c, W, H, r, (W * H) / 60, ['rgba(0,0,0,.2)', 'rgba(140,110,70,.18)'])
  for (let i = 0; i < 14; i++) blot(c, r() * W, r() * H, 40 + r() * 100, '#4f7a2e', 0.35)
  // 뿌리
  for (let i = 0; i < 5; i++) {
    const x = r() * W, y = r() * H, a = r() * TAU, len = 200 + r() * 300, w = 8 + r() * 12
    const ex = x + Math.cos(a) * len, ey = y + Math.sin(a) * len, mx = (x + ex) / 2 + (r() - 0.5) * 120, my = (y + ey) / 2 + (r() - 0.5) * 120
    c.lineCap = 'round'
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = w + 4; c.beginPath(); c.moveTo(x + 3, y + 4); c.quadraticCurveTo(mx + 3, my + 4, ex + 3, ey + 4); c.stroke()
    c.strokeStyle = '#5a3d22'; c.lineWidth = w; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(mx, my, ex, ey); c.stroke()
    c.strokeStyle = 'rgba(200,160,110,.25)'; c.lineWidth = w * 0.25; c.beginPath(); c.moveTo(x - 2, y - 2); c.quadraticCurveTo(mx - 2, my - 2, ex - 2, ey - 2); c.stroke()
  }
  // 돌
  for (let i = 0; i < 10; i++) {
    const x = r() * W, y = r() * H, s = 5 + r() * 14
    c.fillStyle = 'rgba(0,0,0,.35)'; ell(c, x + 2, y + 3, s, s * 0.7); c.fill()
    c.fillStyle = mix('#8a877a', '#5b594f', r()); ell(c, x, y, s, s * 0.7); c.fill()
    c.fillStyle = 'rgba(255,255,255,.15)'; ell(c, x - s * 0.3, y - s * 0.25, s * 0.4, s * 0.2); c.fill()
  }
  // 잔가지
  c.strokeStyle = '#6b4a2a'; c.lineCap = 'round'
  for (let i = 0; i < 22; i++) {
    const x = r() * W, y = r() * H, a = r() * TAU, len = 20 + r() * 60
    c.lineWidth = 1.5 + r() * 2; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len)
    c.moveTo(x + Math.cos(a) * len * 0.5, y + Math.sin(a) * len * 0.5); c.lineTo(x + Math.cos(a + 0.6) * len * 0.8, y + Math.sin(a + 0.6) * len * 0.8); c.stroke()
  }
  // 낙엽
  const cols = ['#5d7f2f', '#7a9a3a', '#8a6a2a', '#a5822f', '#4a6a28', '#6b4a22', '#93702c']
  const n = Math.round((W * H) / 1600)
  for (let i = 0; i < n; i++) drawLeaf(c, r() * W, r() * H, 7 + r() * 14, r() * TAU, cols[Math.floor(r() * cols.length)], 0.92)
  // 고사리(가장자리)
  for (let i = 0; i < 4; i++) {
    const x = i % 2 ? W - 10 : 10, y = (0.15 + i * 0.25) * H, a = i % 2 ? Math.PI + 0.3 : -0.3, len = clamp(Math.min(W, H) * 0.35, 100, 220)
    c.strokeStyle = '#3f6a22'; c.lineWidth = 3; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len); c.stroke()
    for (let k = 1; k < 14; k++) for (const s of [-1, 1]) {
      const t = k / 14, bx = x + Math.cos(a) * len * t, by = y + Math.sin(a) * len * t, la = a + s * 1.2
      drawLeaf(c, bx + Math.cos(la) * 12 * (1 - t * 0.6), by + Math.sin(la) * 12 * (1 - t * 0.6), 13 * (1 - t * 0.6), la, '#4f8a2a', 0.95)
    }
  }
  // 나뭇잎 사이로 드는 햇빛
  for (let i = 0; i < 12; i++) blot(c, r() * W, r() * H, 40 + r() * 110, '#fff2b0', 0.12)
}
function drawLeaf(c, x, y, s, a, col, al = 1) {
  c.save(); c.translate(x, y); c.rotate(a); c.globalAlpha = al
  c.fillStyle = col
  c.beginPath(); c.moveTo(-s, 0); c.quadraticCurveTo(0, -s * 0.55, s, 0); c.quadraticCurveTo(0, s * 0.55, -s, 0); c.fill()
  c.strokeStyle = 'rgba(30,25,10,.35)'; c.lineWidth = 0.8
  c.beginPath(); c.moveTo(-s * 1.15, 0); c.lineTo(s * 0.9, 0); c.stroke()
  c.globalAlpha = 1; c.restore()
}

// ── 벌레 소굴: 축축한 동굴, 거미줄, 알 무더기, 빛나는 버섯 ──
function nest(c, W, H, r) {
  const g0 = c.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7)
  g0.addColorStop(0, '#4a2a22'); g0.addColorStop(1, '#140908')
  c.fillStyle = g0; c.fillRect(0, 0, W, H)
  for (let i = 0; i < 70; i++) blot(c, r() * W, r() * H, 20 + r() * 70, r() < 0.5 ? '#000000' : '#7a4a3a', 0.18)
  speckle(c, W, H, r, (W * H) / 80, ['rgba(0,0,0,.25)', 'rgba(200,140,120,.08)'])
  // 울퉁불퉁한 주름
  c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 3
  for (let i = 0; i < 14; i++) {
    const x = r() * W, y = r() * H
    c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x + (r() - 0.5) * 200, y + (r() - 0.5) * 200, x + (r() - 0.5) * 200, y + (r() - 0.5) * 200, x + (r() - 0.5) * 260, y + (r() - 0.5) * 260); c.stroke()
  }
  // 알 무더기
  for (let k = 0; k < 7; k++) {
    const cx = r() * W, cy = r() * H, n = 6 + Math.floor(r() * 10), es = clamp(Math.min(W, H) * 0.018, 6, 12)
    blot(c, cx, cy, es * 6, '#d8c890', 0.15)
    for (let i = 0; i < n; i++) {
      const a = r() * TAU, d = r() * es * 3, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d
      const g = c.createRadialGradient(x - es * 0.3, y - es * 0.3, 0, x, y, es)
      g.addColorStop(0, '#fbf3cf'); g.addColorStop(1, '#bfae74')
      c.fillStyle = g; ell(c, x, y, es, es * 0.72, r() * TAU); c.fill()
      c.strokeStyle = 'rgba(60,40,20,.4)'; c.lineWidth = 0.8; c.stroke()
    }
  }
  // 빛나는 버섯 점
  for (let i = 0; i < 16; i++) { const x = r() * W, y = r() * H; blot(c, x, y, 14, '#7fffd0', 0.25); c.fillStyle = '#c9fff0'; ell(c, x, y, 2, 2); c.fill() }
  // 구석 거미줄
  c.strokeStyle = 'rgba(240,235,225,.18)'; c.lineWidth = 1
  for (const [cx, cy] of [[0, 0], [W, 0], [0, H], [W, H]]) {
    const rad = clamp(Math.min(W, H) * 0.4, 120, 300)
    for (let k = 0; k < 9; k++) { const a = Math.atan2(H / 2 - cy, W / 2 - cx) + (k - 4) * 0.18; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad); c.stroke() }
    for (let ring = 1; ring < 6; ring++) {
      c.beginPath()
      for (let k = 0; k < 9; k++) { const a = Math.atan2(H / 2 - cy, W / 2 - cx) + (k - 4) * 0.18, d = (rad * ring) / 6; c[k ? 'lineTo' : 'moveTo'](cx + Math.cos(a) * d, cy + Math.sin(a) * d) }
      c.stroke()
    }
  }
}

// ── 움직이는 분위기 ──
const amb = { leaves: [], rings: [], motes: [], flick: 0, flickT: 2 }
/** 벌레보다 아래에 그리는 것(하수구 물살·물방울 고리) */
export function ambientUnder(c, dt) {
  if (L.kind === 'sewer' && L.ch) {
    const { x0, x1 } = L.ch, cw = x1 - x0, H = G.H
    c.save(); c.beginPath(); c.rect(x0, 0, cw, H); c.clip()
    c.strokeStyle = 'rgba(190,210,170,.09)'; c.lineWidth = 2; c.lineCap = 'round'
    for (let i = 0; i < 16; i++) {
      const x = x0 + ((i * 47.3) % cw), y = ((G.t * (50 + (i % 4) * 12) + i * 97) % (H + 80)) - 40
      c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + 4, y + 16, x, y + 34); c.stroke()
    }
    c.restore()
    if (Math.random() < dt * 2.2) {
      const p = L.puddles && Math.random() < 0.4 ? L.puddles[Math.floor(Math.random() * L.puddles.length)] : null
      amb.rings.push(p ? { x: p[0] + R(-p[2], p[2]) * 0.5, y: p[1], age: 0 } : { x: R(x0, x1), y: R(H), age: 0 })
    }
    for (let i = amb.rings.length - 1; i >= 0; i--) {
      const g = amb.rings[i]; g.age += dt
      if (g.age > 1.2) { amb.rings.splice(i, 1); continue }
      c.strokeStyle = `rgba(210,225,200,${0.35 * (1 - g.age / 1.2)})`; c.lineWidth = 1.2
      ell(c, g.x, g.y, 4 + g.age * 26, (4 + g.age * 26) * 0.45); c.stroke()
    }
  }
}
/** 벌레보다 위에 그리는 것(폐건물 어둠·먼지, 밀림 낙엽, 소굴의 붉은 맥박) */
export function ambientOver(c, dt) {
  const W = G.W, H = G.H
  if (L.kind === 'jungle') {
    if (amb.leaves.length < 7 && Math.random() < dt * 0.8) amb.leaves.push({ x: R(W), y: -20, s: R(8, 16), a: R(TAU), va: R(-2, 2), vx: R(-20, 20), ph: R(TAU), col: ['#7a9a3a', '#a5822f', '#5d7f2f'][Math.floor(R(3))] })
    for (let i = amb.leaves.length - 1; i >= 0; i--) {
      const l = amb.leaves[i]
      l.ph += dt * 2; l.y += dt * 40; l.x += (l.vx + Math.sin(l.ph) * 30) * dt; l.a += l.va * dt
      if (l.y > H + 20) { amb.leaves.splice(i, 1); continue }
      c.globalAlpha = 0.25; c.fillStyle = '#000000'; ell(c, l.x + 18, l.y + 26, l.s, l.s * 0.45, l.a); c.fill(); c.globalAlpha = 1
      drawLeaf(c, l.x, l.y, l.s, l.a, l.col, 0.95)
    }
  } else if (L.kind === 'ruin') {
    if (amb.motes.length < 40) amb.motes.push({ x: R(W), y: R(H), vx: R(-6, 6), vy: R(-6, 6), s: R(0.6, 1.8) })
    c.fillStyle = 'rgba(255,245,220,.35)'
    for (const m of amb.motes) {
      m.x += m.vx * dt; m.y += m.vy * dt
      if (m.x < 0) m.x += W; if (m.x > W) m.x -= W; if (m.y < 0) m.y += H; if (m.y > H) m.y -= H
      c.fillRect(m.x, m.y, m.s, m.s)
    }
    // 손전등: 손가락(마우스) 근처만 밝고 나머지는 어둡다. 가끔 형광등처럼 깜빡인다
    amb.flickT -= dt
    if (amb.flickT <= 0) { amb.flick = 0.12; amb.flickT = R(2.5, 7) }
    amb.flick = Math.max(0, amb.flick - dt)
    const px = G.pointer.x >= 0 ? G.pointer.x : W / 2, py = G.pointer.y >= 0 ? G.pointer.y : H / 2
    const rad = Math.min(W, H) * 0.55
    const dark = amb.flick > 0 ? 0.82 : 0.6
    const g = c.createRadialGradient(px, py, rad * 0.12, px, py, rad)
    g.addColorStop(0, 'rgba(6,6,10,0)'); g.addColorStop(0.6, `rgba(6,6,10,${dark * 0.7})`); g.addColorStop(1, `rgba(6,6,10,${dark})`)
    c.fillStyle = g; c.fillRect(0, 0, W, H)
  } else if (L.kind === 'nest') {
    const p = 0.1 + 0.07 * Math.sin(G.t * 2.2)
    const g = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.max(W, H) * 0.7)
    g.addColorStop(0, 'rgba(120,0,0,0)'); g.addColorStop(1, `rgba(120,10,0,${p})`)
    c.fillStyle = g; c.fillRect(0, 0, W, H)
  }
}

function floor(c, W, H, r) {
  const tones = ['#b07c4f', '#a8744a', '#b9865a', '#9f6d43', '#ad7b50', '#a36f45']
  const ph = clamp(Math.min(W, H) * 0.14, 46, 90)
  for (let y = 0; y < H; y += ph) {
    let x = -r() * W * 0.6
    while (x < W) {
      const pw = W * (0.5 + r() * 0.7), base = tones[Math.floor(r() * tones.length)]
      const g = c.createLinearGradient(0, y, 0, y + ph)
      g.addColorStop(0, mix(base, '#ffffff', 0.06)); g.addColorStop(1, mix(base, '#000000', 0.1))
      c.fillStyle = g; c.fillRect(x, y, pw, ph)
      // 나뭇결
      for (let k = 0; k < 9; k++) {
        c.strokeStyle = alpha(mix(base, '#3a1f0a', 0.6), 0.06 + r() * 0.12)
        c.lineWidth = 0.6 + r() * 1.4
        const yy = y + r() * ph, amp = r() * ph * 0.12, f = 0.004 + r() * 0.012, p = r() * 10
        c.beginPath()
        for (let xx = x; xx <= x + pw; xx += 8) { const v = yy + Math.sin(xx * f + p) * amp; xx === x ? c.moveTo(xx, v) : c.lineTo(xx, v) }
        c.stroke()
      }
      if (r() < 0.35) { // 옹이
        const kx = x + r() * pw, ky = y + ph * (0.3 + r() * 0.4)
        for (let k = 3; k > 0; k--) { c.strokeStyle = alpha('#3a1f0a', 0.12 * k); c.lineWidth = 1; ell(c, kx, ky, k * 5 + 3, k * 2 + 1.5); c.stroke() }
      }
      c.fillStyle = 'rgba(40,20,8,.55)'; c.fillRect(x, y, 1.5, ph)
      x += pw
    }
    c.fillStyle = 'rgba(40,20,8,.6)'; c.fillRect(0, y, W, 1.6)
    c.fillStyle = 'rgba(255,240,220,.07)'; c.fillRect(0, y + 1.6, W, 1)
  }
  // 창문 빛
  const g = c.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, 'rgba(255,240,210,.12)'); g.addColorStop(0.5, 'rgba(255,240,210,0)')
  c.fillStyle = g; c.fillRect(0, 0, W, H)
}

function tile(c, W, H, r) {
  const ts = clamp(Math.min(W, H) * 0.17, 60, 112), gr = 3
  c.fillStyle = '#bfb7a8'; c.fillRect(0, 0, W, H)
  for (let y = -ts * 0.3; y < H; y += ts) for (let x = -ts * 0.2; x < W; x += ts) {
    const base = mix('#f1ede4', '#d9d2c3', r() * 0.5)
    const g = c.createLinearGradient(x, y, x + ts, y + ts)
    g.addColorStop(0, mix(base, '#ffffff', 0.4)); g.addColorStop(1, base)
    c.fillStyle = g; rr(c, x + gr, y + gr, ts - gr * 2, ts - gr * 2, 3); c.fill()
    c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1.2
    c.beginPath(); c.moveTo(x + gr + 2, y + ts - gr - 2); c.lineTo(x + gr + 2, y + gr + 2); c.lineTo(x + ts - gr - 2, y + gr + 2); c.stroke()
    c.strokeStyle = 'rgba(90,80,60,.18)'
    c.beginPath(); c.moveTo(x + ts - gr - 1, y + gr + 2); c.lineTo(x + ts - gr - 1, y + ts - gr - 1); c.lineTo(x + gr + 2, y + ts - gr - 1); c.stroke()
    if (r() < 0.06) { c.fillStyle = 'rgba(150,120,70,.12)'; ell(c, x + ts * r(), y + ts * r(), 6 + r() * 10, 4 + r() * 6); c.fill() }
  }
  const g = c.createLinearGradient(0, 0, W * 0.6, H)
  g.addColorStop(0, 'rgba(255,255,255,.18)'); g.addColorStop(0.4, 'rgba(255,255,255,0)')
  c.fillStyle = g; c.fillRect(0, 0, W, H)
}

function screen(c, W, H, r) {
  const g = c.createLinearGradient(0, 0, W * 0.3, H)
  g.addColorStop(0, '#2a8790'); g.addColorStop(1, '#14445e')
  c.fillStyle = g; c.fillRect(0, 0, W, H)
  const rg = c.createRadialGradient(W * 0.65, H * 0.45, 0, W * 0.65, H * 0.45, Math.max(W, H) * 0.6)
  rg.addColorStop(0, 'rgba(160,230,220,.25)'); rg.addColorStop(1, 'rgba(160,230,220,0)')
  c.fillStyle = rg; c.fillRect(0, 0, W, H)
  // 언덕 실루엣(배경화면)
  c.fillStyle = 'rgba(10,40,50,.35)'
  c.beginPath(); c.moveTo(0, H * 0.75)
  for (let x = 0; x <= W; x += 20) c.lineTo(x, H * 0.72 + Math.sin(x * 0.006) * H * 0.05 + Math.sin(x * 0.017) * H * 0.015)
  c.lineTo(W, H); c.lineTo(0, H); c.closePath(); c.fill()
  // 바탕화면 아이콘
  const s = clamp(Math.min(W, H) * 0.09, 34, 52), x0 = 16, y0 = (G.area.y0 || 70) + 14
  const items = [['folder', '내 문서'], ['doc', '보고서_최종_진짜최종'], ['folder', '사진'], ['doc', '할 일.txt'], ['trash', '휴지통']]
  c.textAlign = 'center'; c.textBaseline = 'top'
  c.font = `${Math.round(s * 0.26)}px "Jua", sans-serif`
  items.forEach(([k, label], i) => {
    const x = x0 + s * 0.8, y = y0 + i * s * 1.9
    if (y + s * 1.6 > H - 110) return
    if (k === 'folder') {
      c.fillStyle = '#e9b949'; rr(c, x - s * 0.5, y + s * 0.1, s * 0.42, s * 0.2, 3); c.fill()
      c.fillStyle = '#f6cf5f'; rr(c, x - s * 0.5, y + s * 0.2, s, s * 0.66, 4); c.fill()
    } else if (k === 'doc') {
      c.fillStyle = '#f4f6f8'; rr(c, x - s * 0.36, y, s * 0.72, s * 0.9, 3); c.fill()
      c.fillStyle = '#4a7bd1'; for (let j = 0; j < 4; j++) c.fillRect(x - s * 0.24, y + s * (0.22 + j * 0.15), s * 0.48, 2)
    } else {
      c.fillStyle = '#c9d2da'; rr(c, x - s * 0.32, y + s * 0.15, s * 0.64, s * 0.75, 4); c.fill()
      c.fillStyle = '#9aa5ae'; rr(c, x - s * 0.4, y + s * 0.05, s * 0.8, s * 0.12, 3); c.fill()
      c.strokeStyle = '#8a959e'; c.lineWidth = 2; for (let j = -1; j <= 1; j++) { c.beginPath(); c.moveTo(x + j * s * 0.16, y + s * 0.28); c.lineTo(x + j * s * 0.16, y + s * 0.8); c.stroke() }
    }
    c.fillStyle = 'rgba(0,0,0,.45)'
    const lab = label.length > 8 ? label.slice(0, 7) + '…' : label
    c.fillText(lab, x + 1, y + s * 0.98 + 1)
    c.fillStyle = '#ffffff'; c.fillText(lab, x, y + s * 0.98)
  })
  // 화면 결(주사선)과 유리 반사
  c.fillStyle = 'rgba(0,0,0,.05)'
  for (let y = 0; y < H; y += 3) c.fillRect(0, y, W, 1)
  const gl = c.createLinearGradient(0, 0, W, H * 0.7)
  gl.addColorStop(0, 'rgba(255,255,255,.16)'); gl.addColorStop(0.35, 'rgba(255,255,255,.03)'); gl.addColorStop(0.36, 'rgba(255,255,255,0)')
  c.fillStyle = gl; c.fillRect(0, 0, W, H)
}
