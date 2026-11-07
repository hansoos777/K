// 바닥 그림: 나무 마루 · 주방 타일 · 컴퓨터 바탕화면(망치로 치면 모니터 유리가 깨지는 느낌)
import { G } from './state.js'
import { seeded, clamp, mix, alpha, rr, ell } from './util.js'

export const BGS = [['floor', '나무 마루'], ['tile', '주방 타일'], ['screen', '컴퓨터 화면']]

export function drawBg(kind) {
  const c = G.ctx.bg, W = G.W, H = G.H, r = seeded(11)
  c.clearRect(0, 0, W, H)
  if (kind === 'tile') tile(c, W, H, r)
  else if (kind === 'screen') screen(c, W, H, r)
  else floor(c, W, H, r)
  const v = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75)
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.38)')
  c.fillStyle = v; c.fillRect(0, 0, W, H)
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
