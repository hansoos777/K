// 무기 그림. 모두 (0,0)을 기준으로, 위쪽(-y)이 앞이다.
import { R, rr, ell, mix } from './util.js'

/** 손등(손바닥으로 내려칠 때 위에서 보이는 모습). 가운데가 손바닥 중심 */
export function drawHand(c, S) {
  const skin = '#efc4a2', dark = '#b97f5c', nail = '#f7ddd2'
  c.lineJoin = 'round'
  c.lineWidth = Math.max(1, S * 0.012)
  // 팔목(아래로 화면 밖까지)
  const g0 = c.createLinearGradient(0, S * 0.2, 0, S * 0.9)
  g0.addColorStop(0, skin); g0.addColorStop(1, '#d9a582')
  c.fillStyle = g0; rr(c, -S * 0.22, S * 0.15, S * 0.44, S * 0.8, S * 0.18); c.fill()
  c.fillStyle = '#3d5a80'; rr(c, -S * 0.27, S * 0.55, S * 0.54, S * 0.5, S * 0.1); c.fill() // 소매
  // 손가락
  const F = [[-0.235, 0.33, 0.125, -0.12], [-0.08, 0.4, 0.13, -0.03], [0.075, 0.38, 0.13, 0.03], [0.215, 0.3, 0.115, 0.13]]
  for (const [x, len, w, a] of F) {
    c.save(); c.translate(x * S, -S * 0.16); c.rotate(a)
    rr(c, -w * S / 2, -len * S, w * S, len * S + S * 0.06, w * S / 2)
    c.fillStyle = skin; c.fill(); c.strokeStyle = dark; c.stroke()
    c.fillStyle = nail; rr(c, -w * S * 0.32, -len * S + S * 0.018, w * S * 0.64, len * S * 0.22, w * S * 0.25); c.fill()
    c.strokeStyle = 'rgba(150,90,60,.45)'
    for (const k of [0.45, 0.72]) { c.beginPath(); c.moveTo(-w * S * 0.25, -len * S * k); c.quadraticCurveTo(0, -len * S * k - S * 0.01, w * S * 0.25, -len * S * k); c.stroke() }
    c.restore()
  }
  // 엄지
  c.save(); c.translate(-S * 0.29, S * 0.06); c.rotate(-1.05)
  rr(c, -S * 0.07, -S * 0.3, S * 0.14, S * 0.34, S * 0.07); c.fillStyle = skin; c.fill(); c.strokeStyle = dark; c.stroke()
  c.fillStyle = nail; rr(c, -S * 0.045, -S * 0.285, S * 0.09, S * 0.07, S * 0.03); c.fill()
  c.restore()
  // 손등
  const g = c.createRadialGradient(-S * 0.05, -S * 0.05, S * 0.05, 0, 0, S * 0.4)
  g.addColorStop(0, '#f6d2b4'); g.addColorStop(1, skin)
  c.fillStyle = g; rr(c, -S * 0.31, -S * 0.24, S * 0.62, S * 0.52, S * 0.17); c.fill(); c.strokeStyle = dark; c.stroke()
  c.fillStyle = 'rgba(255,255,255,.25)'
  for (const x of [-0.23, -0.08, 0.075, 0.21]) { ell(c, x * S, -S * 0.19, S * 0.045, S * 0.025); c.fill() }
  c.strokeStyle = 'rgba(150,100,140,.18)'; c.lineWidth = S * 0.012
  for (const x of [-0.12, 0.02, 0.14]) { c.beginPath(); c.moveTo(x * S, -S * 0.15); c.quadraticCurveTo(x * S + S * 0.02, S * 0.05, x * S * 0.5, S * 0.22); c.stroke() }
}

/** 플라스틱 파리채. 머리 가운데가 (0,0), 손잡이는 +y로 */
export function drawSwatter(c, S, color) {
  const hw = S, hh = S * 1.1
  c.lineCap = 'round'
  c.strokeStyle = '#d8d8d2'; c.lineWidth = S * 0.06
  c.beginPath(); c.moveTo(0, hh * 0.5); c.lineTo(0, hh * 0.5 + S * 2.6); c.stroke()
  c.strokeStyle = mix(color, '#000000', 0.15); c.lineWidth = S * 0.12
  c.beginPath(); c.moveTo(0, hh * 0.5 + S * 1.9); c.lineTo(0, hh * 0.5 + S * 2.7); c.stroke()
  c.fillStyle = color
  c.beginPath(); c.moveTo(-hw * 0.2, hh * 0.45); c.lineTo(hw * 0.2, hh * 0.45); c.lineTo(S * 0.05, hh * 0.5 + S * 0.25); c.lineTo(-S * 0.05, hh * 0.5 + S * 0.25); c.closePath(); c.fill()
  rr(c, -hw / 2, -hh / 2, hw, hh, S * 0.14); c.fill()
  c.save(); rr(c, -hw / 2 + S * 0.06, -hh / 2 + S * 0.06, hw - S * 0.12, hh - S * 0.12, S * 0.1); c.clip()
  c.fillStyle = mix(color, '#000000', 0.55)
  const cell = S * 0.1, gap = S * 0.022
  for (let x = -hw / 2; x < hw / 2; x += cell) for (let y = -hh / 2; y < hh / 2; y += cell) c.fillRect(x + gap, y + gap, cell - gap * 2, cell - gap * 2)
  c.restore()
  c.strokeStyle = mix(color, '#ffffff', 0.35); c.lineWidth = S * 0.025
  rr(c, -hw / 2 + S * 0.02, -hh / 2 + S * 0.02, hw - S * 0.04, hh - S * 0.04, S * 0.13); c.stroke()
}

/** 전기 파리채. 그물 가운데가 (0,0) */
export function drawRacket(c, S, glow = 0, live = true) {
  const rx = S * 0.5, ry = S * 0.6
  // 손잡이
  c.fillStyle = '#2a63c9'; rr(c, -S * 0.09, ry * 0.92, S * 0.18, S * 1.25, S * 0.07); c.fill()
  c.fillStyle = '#1b3f86'; rr(c, -S * 0.065, ry * 0.92 + S * 0.55, S * 0.13, S * 0.6, S * 0.05); c.fill()
  c.fillStyle = '#e8463a'; ell(c, 0, ry * 0.92 + S * 0.35, S * 0.05, S * 0.05); c.fill()
  c.fillStyle = live ? '#67ff7a' : '#335533'; ell(c, 0, ry * 0.92 + S * 0.2, S * 0.022, S * 0.022); c.fill()
  // 그물
  c.save(); ell(c, 0, 0, rx, ry); c.clip()
  if (glow > 0) { c.fillStyle = `rgba(140,200,255,${0.25 * glow})`; c.fillRect(-rx, -ry, rx * 2, ry * 2) }
  c.strokeStyle = glow > 0.3 ? 'rgba(220,240,255,.95)' : 'rgba(170,180,190,.75)'
  c.lineWidth = Math.max(0.7, S * 0.008)
  c.beginPath()
  for (let k = -rx; k <= rx; k += S * 0.055) { c.moveTo(k, -ry); c.lineTo(k, ry) }
  for (let k = -ry; k <= ry; k += S * 0.055) { c.moveTo(-rx, k); c.lineTo(rx, k) }
  c.stroke()
  c.restore()
  // 테
  c.strokeStyle = '#f2c230'; c.lineWidth = S * 0.075
  ell(c, 0, 0, rx, ry); c.stroke()
  c.strokeStyle = 'rgba(255,255,255,.4)'; c.lineWidth = S * 0.02
  c.beginPath(); c.ellipse(0, 0, rx - S * 0.01, ry - S * 0.01, 0, Math.PI * 1.1, Math.PI * 1.45); c.stroke()
}

/** 욕실 슬리퍼(위에서 본 모습). 길이 S */
export function drawSlipper(c, S, color = '#7fb7e8') {
  const w = S * 0.2
  c.beginPath()
  c.moveTo(0, -S * 0.5)
  c.bezierCurveTo(w * 1.25, -S * 0.5, w * 1.3, -S * 0.2, w * 1.1, S * 0.05)
  c.bezierCurveTo(w * 0.95, S * 0.3, w * 1.05, S * 0.5, 0, S * 0.5)
  c.bezierCurveTo(-w * 1.05, S * 0.5, -w * 0.95, S * 0.3, -w * 1.1, S * 0.05)
  c.bezierCurveTo(-w * 1.3, -S * 0.2, -w * 1.25, -S * 0.5, 0, -S * 0.5)
  c.closePath()
  c.fillStyle = color; c.fill()
  c.strokeStyle = mix(color, '#000000', 0.3); c.lineWidth = S * 0.02; c.stroke()
  c.fillStyle = mix(color, '#ffffff', 0.35)
  for (let i = 0; i < 18; i++) { ell(c, R(-w * 0.8, w * 0.8), R(S * 0.0, S * 0.42), S * 0.012, S * 0.012); c.fill() }
  // 발등 끈
  c.fillStyle = mix(color, '#000000', 0.25)
  rr(c, -w * 1.25, -S * 0.32, w * 2.5, S * 0.26, S * 0.08); c.fill()
  c.fillStyle = 'rgba(255,255,255,.22)'; rr(c, -w * 1.1, -S * 0.29, w * 2.2, S * 0.05, S * 0.03); c.fill()
}

/** 운동화 바깥 선(바닥 자국에도 쓴다). 길이 S, 앞코가 -y */
export function shoeOutline(c, S) {
  const w = S * 0.2
  c.beginPath()
  c.moveTo(0, -S * 0.5)
  c.bezierCurveTo(w * 1.1, -S * 0.5, w * 1.25, -S * 0.25, w * 1.1, -S * 0.08)
  c.bezierCurveTo(w * 0.95, S * 0.12, w * 0.9, S * 0.32, w * 0.85, S * 0.4)
  c.bezierCurveTo(w * 0.75, S * 0.53, -w * 0.75, S * 0.53, -w * 0.85, S * 0.4)
  c.bezierCurveTo(-w * 0.8, S * 0.25, -w * 0.7, S * 0.05, -w * 0.85, -S * 0.1)
  c.bezierCurveTo(-w * 1.0, -S * 0.3, -w * 0.8, -S * 0.5, 0, -S * 0.5)
  c.closePath()
}
/** 운동화(위에서). 발목 자리에 청바지 다리가 보인다 */
export function drawShoe(c, S) {
  const w = S * 0.2
  c.save(); c.scale(1.06, 1.03); shoeOutline(c, S); c.fillStyle = '#ecebe6'; c.fill(); c.strokeStyle = '#9a978f'; c.lineWidth = S * 0.01; c.stroke(); c.restore()
  c.save(); c.scale(0.9, 0.93); shoeOutline(c, S)
  const g = c.createLinearGradient(-w, 0, w, 0); g.addColorStop(0, '#2f3c52'); g.addColorStop(0.5, '#475a78'); g.addColorStop(1, '#2f3c52')
  c.fillStyle = g; c.fill(); c.restore()
  c.fillStyle = '#d6d3cb'; ell(c, 0, -S * 0.38, w * 0.75, S * 0.1); c.fill() // 앞코 고무
  c.strokeStyle = '#e8463a'; c.lineWidth = S * 0.03
  c.beginPath(); c.moveTo(w * 0.85, -S * 0.05); c.quadraticCurveTo(w * 0.3, S * 0.12, w * 0.75, S * 0.3); c.stroke()
  c.beginPath(); c.moveTo(-w * 0.8, -S * 0.05); c.quadraticCurveTo(-w * 0.3, S * 0.12, -w * 0.72, S * 0.3); c.stroke()
  c.strokeStyle = '#f4f2ec'; c.lineWidth = S * 0.018
  for (let i = 0; i < 5; i++) {
    const y = -S * 0.22 + i * S * 0.065
    c.beginPath(); c.moveTo(-w * 0.35, y); c.lineTo(w * 0.35, y + S * 0.03); c.moveTo(w * 0.35, y); c.lineTo(-w * 0.35, y + S * 0.03); c.stroke()
  }
  // 청바지 다리(발목)
  const gj = c.createRadialGradient(-w * 0.15, S * 0.25, 0, 0, S * 0.3, w * 0.75)
  gj.addColorStop(0, '#5a7fb5'); gj.addColorStop(1, '#2e4b78')
  c.fillStyle = gj; ell(c, 0, S * 0.3, w * 0.68, S * 0.15); c.fill()
  c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 1
  for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(i * w * 0.15, S * 0.18); c.lineTo(i * w * 0.15 + w * 0.08, S * 0.42); c.stroke() }
}

/** 두꺼운 책(표지). 가운데가 (0,0) */
export function drawBook(c, w, h, cover, title) {
  c.fillStyle = '#efe6cf'; rr(c, -w / 2 + w * 0.04, -h / 2 + h * 0.02, w, h * 0.98, w * 0.02); c.fill()
  c.strokeStyle = 'rgba(120,100,70,.35)'; c.lineWidth = 1
  for (let i = 1; i < 5; i++) { c.beginPath(); c.moveTo(w / 2 + w * 0.04 - i * 1.5, -h / 2 + 6); c.lineTo(w / 2 + w * 0.04 - i * 1.5, h / 2 - 4); c.stroke() }
  const g = c.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2)
  g.addColorStop(0, mix(cover, '#ffffff', 0.12)); g.addColorStop(1, mix(cover, '#000000', 0.2))
  c.fillStyle = g; rr(c, -w / 2, -h / 2, w, h, w * 0.03); c.fill()
  c.fillStyle = mix(cover, '#000000', 0.35); c.fillRect(-w / 2, -h / 2, w * 0.11, h)
  c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 2
  for (const y of [-0.38, -0.3, 0.3, 0.38]) { c.beginPath(); c.moveTo(-w / 2, y * h); c.lineTo(-w / 2 + w * 0.11, y * h); c.stroke() }
  c.strokeStyle = '#d9b55a'; c.lineWidth = Math.max(1, w * 0.012)
  rr(c, -w / 2 + w * 0.17, -h / 2 + w * 0.07, w * 0.76, h - w * 0.14, w * 0.02); c.stroke()
  c.fillStyle = '#e8c66a'; c.textAlign = 'center'; c.textBaseline = 'middle'
  c.font = `${Math.round(w * 0.13)}px "Black Han Sans", sans-serif`
  c.fillText(title, w * 0.05, -h * 0.12)
  c.font = `${Math.round(w * 0.055)}px sans-serif`
  c.fillText('제 3 판', w * 0.05, h * 0.02)
}

/** 망치. 손잡이 끝이 (0,0), 머리는 (-len,0) */
export function drawHammer(c, len, S) {
  const g = c.createLinearGradient(0, -S * 0.07, 0, S * 0.07)
  g.addColorStop(0, '#c48a52'); g.addColorStop(0.5, '#a86d3a'); g.addColorStop(1, '#7d4e25')
  c.fillStyle = g; rr(c, -len, -S * 0.075, len, S * 0.15, S * 0.06); c.fill()
  c.fillStyle = '#c23a2b'; rr(c, -len * 0.32, -S * 0.095, len * 0.32, S * 0.19, S * 0.08); c.fill()
  c.fillStyle = 'rgba(0,0,0,.25)'
  for (let i = 1; i < 6; i++) c.fillRect(-len * 0.32 + i * len * 0.05, -S * 0.095, 2, S * 0.19)
  c.save(); c.translate(-len, 0)
  const m = c.createLinearGradient(-S * 0.2, 0, S * 0.2, 0)
  m.addColorStop(0, '#5f666d'); m.addColorStop(0.45, '#c9d0d6'); m.addColorStop(1, '#4a5057')
  c.fillStyle = m
  rr(c, -S * 0.19, -S * 0.58, S * 0.38, S * 0.62, S * 0.06); c.fill()
  c.beginPath(); c.moveTo(-S * 0.16, S * 0.02); c.lineTo(S * 0.16, S * 0.02); c.lineTo(S * 0.1, S * 0.48); c.quadraticCurveTo(0, S * 0.3, -S * 0.1, S * 0.48); c.closePath(); c.fill()
  c.fillStyle = '#3a3f44'; rr(c, -S * 0.22, -S * 0.66, S * 0.44, S * 0.14, S * 0.04); c.fill()
  c.restore()
}

/** 살충제 깡통. 분사구가 -y */
export function drawCan(c, S) {
  c.fillStyle = '#b9c0c6'; rr(c, -S * 0.17, -S * 0.56, S * 0.34, S * 0.12, S * 0.05); c.fill()
  c.fillStyle = '#222222'; rr(c, -S * 0.05, -S * 0.66, S * 0.1, S * 0.12, S * 0.02); c.fill()
  const g = c.createLinearGradient(-S * 0.18, 0, S * 0.18, 0)
  g.addColorStop(0, '#1f6b3a'); g.addColorStop(0.45, '#3fa45f'); g.addColorStop(1, '#174f2b')
  c.fillStyle = g; rr(c, -S * 0.18, -S * 0.46, S * 0.36, S * 0.96, S * 0.06); c.fill()
  c.fillStyle = '#ffd23f'; c.fillRect(-S * 0.18, -S * 0.2, S * 0.36, S * 0.34)
  c.strokeStyle = '#1b1b1b'; c.lineWidth = S * 0.03; c.lineCap = 'round'
  ell(c, 0, -S * 0.03, S * 0.07, S * 0.045); c.stroke()
  c.beginPath()
  for (const s of [-1, 1]) for (const y of [-0.06, -0.01, 0.03]) { c.moveTo(s * S * 0.05, y * S); c.lineTo(s * S * 0.12, (y - 0.02) * S) }
  c.moveTo(-S * 0.12, -S * 0.13); c.lineTo(S * 0.12, S * 0.07); c.moveTo(S * 0.12, -S * 0.13); c.lineTo(-S * 0.12, S * 0.07)
  c.stroke()
}

/** 화염방사기 총(위에서). 총구가 (0,0), 몸통은 +y로 */
export function drawFlamer(c, S, t = 0) {
  c.fillStyle = '#3a3a3a'; rr(c, -S * 0.07, 0, S * 0.14, S * 1.1, S * 0.04); c.fill()
  c.fillStyle = '#5b5b5b'; rr(c, -S * 0.1, -S * 0.04, S * 0.2, S * 0.12, S * 0.03); c.fill()
  c.fillStyle = '#7a1f14'; rr(c, -S * 0.2, S * 0.55, S * 0.4, S * 0.3, S * 0.08); c.fill()
  c.fillStyle = '#ffcc1f'; c.fillRect(-S * 0.2, S * 0.62, S * 0.4, S * 0.04)
  c.fillStyle = '#2a2a2a'; rr(c, S * 0.08, S * 0.3, S * 0.22, S * 0.08, S * 0.03); c.fill()
  // 불씨
  const f = 0.8 + Math.sin(t * 40) * 0.2
  c.fillStyle = 'rgba(90,160,255,.85)'; ell(c, 0, -S * 0.07, S * 0.035 * f, S * 0.06 * f); c.fill()
  c.fillStyle = 'rgba(255,200,80,.9)'; ell(c, 0, -S * 0.1, S * 0.02 * f, S * 0.04 * f); c.fill()
}

export const BOOKS = [['국어사전', '#7a1f2b'], ['전공 원서', '#1f3a6b'], ['백과사전', '#2f5d3a'], ['영어 단어장', '#5b3a7a'], ['두꺼운 소설', '#3a2a22'], ['요리 대백과', '#8a5a14']]
