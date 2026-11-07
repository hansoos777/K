// 벌레 그림. 몸 앞쪽이 +x 방향인 좌표에서 그린다.
// 상태 o: flat(납작하게 터짐) · belly(뒤집힘) · char(새까맣게 탐) · tw(버둥거림 세기)
import { TAU, DEG, clamp, lerp, mix, ell } from './util.js'

const CHAR = '#15100c'
const BASE = {
  roach: {
    1: { body: '#c98a52', dark: '#9a5f30', light: '#f0bf88', leg: '#8f5a2e', rim: '#f6d9a6', head: '#7a4a24', belly: '#e0aa78' },
    2: { body: '#7c3c16', dark: '#4e230b', light: '#b0662f', leg: '#5c2c10', rim: '#c9985a', head: '#3d1c08', belly: '#a4612f' },
    3: { body: '#6e3311', dark: '#2a1204', light: '#c07a3e', leg: '#4b220a', rim: '#d8b36f', head: '#2a1305', belly: '#8f4f22' },
  },
  mosquito: {
    1: { body: '#f3a0b5', dark: '#c76a86', light: '#ffd3df', leg: '#b15a74', band: '#ffffff', head: '#c76a86', blood: '#ff5a6e', belly: '#ffd3df' },
    2: { body: '#3b3b3b', dark: '#1d1d1d', light: '#6a6a6a', leg: '#2a2a2a', band: '#e9e9e9', head: '#222222', blood: '#c4161c', belly: '#777777' },
    3: { body: '#262626', dark: '#0d0d0d', light: '#5a5a5a', leg: '#1a1a1a', band: '#f2f2f2', head: '#151515', blood: '#a3101a', belly: '#5a5a5a' },
  },
  fly: {
    1: { body: '#8fa7c9', dark: '#5d7398', light: '#c8d8ef', leg: '#4a5b7a', eye: '#e0525a', head: '#5d7398', belly: '#c8d8ef' },
    2: { body: '#5b5b5b', dark: '#2a2a2a', light: '#8d8d8d', leg: '#1e1e1e', eye: '#8e2a1c', head: '#3a3a3a', belly: '#9a9a9a' },
    3: { body: '#4d4b48', dark: '#1c1b1a', light: '#8a8783', leg: '#141414', eye: '#8a2a18', head: '#2b2a28', belly: '#8a8783' },
  },
  ant: {
    1: { body: '#e2703f', dark: '#b14e25', light: '#ffab7f', leg: '#a54a22', head: '#c95a2e', belly: '#ffab7f' },
    2: { body: '#2b1d16', dark: '#120b07', light: '#5a4030', leg: '#1d130d', head: '#22160f', belly: '#4a3527' },
    3: { body: '#24160f', dark: '#0b0604', light: '#6b4a35', leg: '#170e09', head: '#1b100a', belly: '#3e2a1d' },
  },
  spider: {
    1: { body: '#7a5aa6', dark: '#563c7d', light: '#b096d6', leg: '#5b4180', head: '#6a4c95', belly: '#b096d6', mark: '#f2d36b' },
    2: { body: '#6b5238', dark: '#3f2e1d', light: '#a2845f', leg: '#4f3b27', head: '#5c4530', belly: '#8a6f50', mark: '#c9b28a' },
    3: { body: '#5a4430', dark: '#22180f', light: '#a88c6a', leg: '#3e2e1f', head: '#4a3726', belly: '#7a6248', mark: '#d4bf9c' },
  },
  centipede: {
    1: { body: '#7fc96b', dark: '#4f9a3f', light: '#b7eaa4', leg: '#f0c75a', head: '#f08a5a', belly: '#b7eaa4' },
    2: { body: '#3b3a23', dark: '#1d1c10', light: '#6d6b45', leg: '#d9a93a', head: '#c2471f', belly: '#8a8650' },
    3: { body: '#2f2e1b', dark: '#100f07', light: '#77724a', leg: '#e0a93a', head: '#b23a17', belly: '#7a7448' },
  },
}

export function palette(b) {
  const B = BASE[b.type][b.style]
  const k = b.charred ? 1 : Math.max(clamp(b.burn * 1.1, 0, 1) * 0.85, b.flatDark || 0)
  if (k <= 0.02) return B
  const P = {}
  for (const key in B) P[key] = mix(B[key], CHAR, k)
  return P
}

let REAL = false // 리얼 모습: 다리·더듬이를 어두운 테두리 + 밝은 심으로 그려 둥근 마디처럼 보이게
function seg(c, p, w, col) {
  const path = () => { c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]) }
  if (REAL && w >= 1) { c.strokeStyle = 'rgba(0,0,0,.45)'; c.lineWidth = w * 1.6; path(); c.stroke() }
  c.strokeStyle = col; c.lineWidth = w; path(); c.stroke()
  if (REAL && w >= 1.2) { c.strokeStyle = 'rgba(255,240,220,.16)'; c.lineWidth = w * 0.35; path(); c.stroke() }
}
/** 다리 하나: 엉덩이 → 무릎 → 발끝. 허벅지는 옆으로, 종아리는 앞/뒤로 뻗는다 */
function legPts(hx, hy, ang, reach, side, swing, lat = 0.6, kneeR = 0.45) {
  const ak = ang + (Math.PI / 2 - ang) * lat
  return [
    hx, hy,
    hx + Math.cos(ak) * reach * kneeR + swing * 0.4, hy + Math.sin(ak) * reach * kneeR * side,
    hx + Math.cos(ang) * reach + swing, hy + Math.sin(ang) * reach * side,
  ]
}
function spines(c, p, n, len, col, w) {
  const kx = p[2], ky = p[3], dx = p[4] - kx, dy = p[5] - ky, L = Math.hypot(dx, dy) || 1
  const ux = dx / L, uy = dy / L
  c.strokeStyle = col; c.lineWidth = w
  c.beginPath()
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1), x = kx + dx * t, y = ky + dy * t, s = i % 2 ? 1 : -1
    c.moveTo(x, y); c.lineTo(x - uy * len * s + ux * len * 0.7, y + ux * len * s + uy * len * 0.7)
  }
  c.stroke()
}
function hairs(c, p, n, len, col, w) {
  c.strokeStyle = col; c.lineWidth = w
  c.beginPath()
  for (let s = 0; s < p.length - 2; s += 2) {
    const ax = p[s], ay = p[s + 1], dx = p[s + 2] - ax, dy = p[s + 3] - ay, L = Math.hypot(dx, dy) || 1
    for (let i = 1; i <= n; i++) {
      const t = i / (n + 1), x = ax + dx * t, y = ay + dy * t, sd = i % 2 ? 1 : -1
      c.moveTo(x, y); c.lineTo(x - (dy / L) * len * sd, y + (dx / L) * len * sd)
    }
  }
  c.stroke()
}
/** 귀여움 모드 눈. 죽으면 X 눈 */
function eyes(c, x, gap, r, dead) {
  for (const s of [-1, 1]) {
    const y = s * gap
    if (dead) {
      c.strokeStyle = '#1a1a1a'; c.lineWidth = r * 0.35; c.lineCap = 'round'
      c.beginPath(); c.moveTo(x - r * 0.6, y - r * 0.6); c.lineTo(x + r * 0.6, y + r * 0.6); c.moveTo(x + r * 0.6, y - r * 0.6); c.lineTo(x - r * 0.6, y + r * 0.6); c.stroke()
      continue
    }
    c.fillStyle = '#ffffff'; ell(c, x, y, r, r); c.fill()
    c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = r * 0.12; c.stroke()
    c.fillStyle = '#1a1a1a'; ell(c, x + r * 0.35, y, r * 0.52, r * 0.52); c.fill()
    c.fillStyle = '#ffffff'; ell(c, x + r * 0.5, y - r * 0.2, r * 0.17, r * 0.17); c.fill()
  }
}
function gloss(c, x, y, rx, ry, a = 0.28) {
  c.fillStyle = `rgba(255,255,255,${a})`; ell(c, x, y, rx, ry); c.fill()
}

// ── 바퀴벌레 ──
function roach(c, b, P, L, o) {
  const cute = b.style === 1, real = b.style === 3
  const lw = Math.max(1, L * (cute ? 0.05 : 0.032))
  const gait = o.flat || o.belly || o.char ? 0 : b.gait
  const LEGS = [[0.16, 50, 0.46, 0], [0.04, 92, 0.5, 1], [-0.08, 138, 0.68, 0]]
  c.lineCap = 'round'; c.lineJoin = 'round'
  for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
    const [hx, ang, re, po] = LEGS[i]
    if (o.flat && b.rnd[(i * 2 + (side > 0 ? 1 : 0) + 9) % 16] < 0.25) continue
    let a = ang * DEG, r = re * L * (cute ? 0.8 : 1)
    const sw = Math.sin(b.phase + ((po + (side > 0 ? 1 : 0)) % 2) * Math.PI) * L * 0.1 * gait
    if (o.flat) { a += (b.rnd[i + (side > 0 ? 3 : 0)] - 0.5) * 0.9; r *= 1.12 }
    if (o.char) { r *= 0.55; a = lerp(a, Math.PI / 2, 0.45) }
    if (o.belly) { r *= 0.62; a += Math.sin(b.t * 18 + i * 2 + side) * 0.45 * o.tw }
    const p = legPts(hx * L, side * 0.07 * L, a, r, side, sw)
    seg(c, p, lw * (i === 2 ? 1.1 : 1), P.leg)
    if (real && !o.char) spines(c, p, 3, L * 0.035, P.leg, Math.max(0.6, lw * 0.4))
  }
  // 더듬이
  const al = (cute ? 0.5 : 0.95) * L * (o.char ? 0.4 : 1)
  c.strokeStyle = P.dark; c.lineWidth = Math.max(0.7, L * (cute ? 0.025 : 0.012))
  for (const side of [-1, 1]) {
    const w = o.flat ? (b.rnd[6 + (side > 0 ? 1 : 0)] - 0.5) * 1.4 : Math.sin(b.t * (b.mode === 'stop' ? 5 : 2.5) + side * 1.7) * 0.25
    const ang = side * (0.3 + w)
    c.beginPath(); c.moveTo(0.42 * L, side * 0.03 * L)
    c.quadraticCurveTo(0.42 * L + al * 0.5, side * 0.03 * L + Math.sin(ang) * al * 0.2, 0.42 * L + Math.cos(ang) * al, Math.sin(ang) * al)
    c.stroke()
  }
  // 꼬리털
  c.lineWidth = Math.max(0.8, L * 0.02)
  for (const side of [-1, 1]) seg(c, [-0.46 * L, side * 0.04 * L, -0.58 * L, side * 0.09 * L], c.lineWidth, P.dark)
  // 날개 펼침(날아오를 때)
  if (o.wings) {
    c.fillStyle = 'rgba(150,90,45,.45)'
    const f = Math.sin(b.t * 70) * 0.25
    for (const side of [-1, 1]) { ell(c, -0.05 * L, side * 0.35 * L, 0.42 * L, 0.2 * L, side * (0.5 + f)); c.fill() }
  }
  // 배·날개
  const by = cute ? 0.26 : 0.2
  if (o.belly) {
    c.fillStyle = P.belly; ell(c, -0.1 * L, 0, 0.4 * L, by * L); c.fill()
    c.strokeStyle = P.dark; c.lineWidth = Math.max(0.6, L * 0.01)
    for (let k = 0; k < 6; k++) { const x = (-0.42 + k * 0.08) * L; c.beginPath(); c.moveTo(x, -by * L * 0.8); c.quadraticCurveTo(x + 0.03 * L, 0, x, by * L * 0.8); c.stroke() }
  } else {
    ell(c, -0.1 * L, 0, 0.4 * L, by * L)
    if (cute) c.fillStyle = P.body
    else {
      const g = c.createRadialGradient(0.02 * L, -0.07 * L, L * 0.02, -0.08 * L, 0, L * 0.45)
      g.addColorStop(0, P.light); g.addColorStop(0.45, P.body); g.addColorStop(1, P.dark)
      c.fillStyle = g
    }
    c.fill()
    if (!o.char) {
      c.strokeStyle = P.dark; c.lineWidth = Math.max(0.8, L * 0.012)
      c.beginPath(); c.moveTo(0.12 * L, 0); c.quadraticCurveTo(-0.2 * L, 0.025 * L, -0.48 * L, 0.01 * L); c.stroke()
      if (real) {
        c.strokeStyle = 'rgba(0,0,0,.45)'; c.lineWidth = Math.max(0.8, L * 0.014)
        ell(c, -0.1 * L, 0, 0.4 * L, by * L); c.stroke()
        c.strokeStyle = 'rgba(255,215,160,.28)'; c.lineWidth = Math.max(0.8, L * 0.012)
        c.beginPath(); c.ellipse(-0.1 * L, 0, 0.38 * L, by * L * 0.92, 0, Math.PI * 1.12, Math.PI * 1.75); c.stroke()
        c.strokeStyle = 'rgba(255,210,150,.12)'
        for (const s of [-1, 1]) { c.beginPath(); c.moveTo(0.08 * L, s * 0.09 * L); c.quadraticCurveTo(-0.2 * L, s * 0.14 * L, -0.44 * L, s * 0.06 * L); c.stroke() }
        gloss(c, -0.05 * L, -0.08 * L, 0.2 * L, 0.035 * L, 0.22)
      }
      if (cute) gloss(c, -0.12 * L, -0.1 * L, 0.18 * L, 0.05 * L, 0.35)
    }
  }
  // 앞가슴(목 방패)
  c.fillStyle = o.belly ? P.belly : P.rim
  ell(c, 0.26 * L, 0, 0.15 * L, (cute ? 0.21 : 0.19) * L); c.fill()
  if (!o.belly) {
    c.fillStyle = P.dark; ell(c, 0.25 * L, 0, 0.1 * L, 0.12 * L); c.fill()
    if (real && !o.char) gloss(c, 0.28 * L, -0.06 * L, 0.06 * L, 0.025 * L, 0.3)
  }
  c.fillStyle = P.head; ell(c, 0.39 * L, 0, 0.06 * L, 0.07 * L); c.fill()
  if (cute) eyes(c, 0.3 * L, 0.085 * L, 0.075 * L, o.flat || o.char || o.belly)
}

// ── 모기 ──
function mosquito(c, b, P, L, o) {
  const cute = b.style === 1
  const flying = b.z > 0.05 && !o.flat && !o.belly && !o.char
  const lw = Math.max(0.7, L * 0.028)
  const LEGS = [[0.06, 35, 1.0], [0.03, 95, 0.95], [0, 150, 1.15]]
  c.lineCap = 'round'; c.lineJoin = 'round'
  for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
    const [hx, ang, re] = LEGS[i]
    if (o.flat && b.rnd[(i * 2 + (side > 0 ? 1 : 0) + 9) % 16] < 0.25) continue
    let a = ang * DEG, r = re * L * (cute ? 0.6 : 1)
    if (flying) a += Math.sin(b.t * 3 + i) * 0.06
    if (o.flat) { a += (b.rnd[i + (side > 0 ? 3 : 0)] - 0.5) * 1.2; r *= 1.05 }
    if (o.char) r *= 0.5
    if (o.belly) { r *= 0.7; a += Math.sin(b.t * 20 + i + side) * 0.4 * o.tw }
    const p = legPts(hx * L, side * 0.03 * L, a, r, side, 0, 0.3, 0.4)
    seg(c, p, lw, P.leg)
    if (!cute && !o.char) { c.setLineDash([L * 0.06, L * 0.07]); seg(c, p, lw * 0.75, P.band); c.setLineDash([]) }
  }
  // 날개
  if (flying) {
    const f = Math.sin(b.t * 95)
    c.fillStyle = 'rgba(220,230,240,.2)'
    for (const side of [-1, 1]) for (const k of [-1, 1]) { ell(c, -0.08 * L, side * (0.16 + 0.12 * k * f) * L, 0.42 * L, 0.09 * L, side * (0.35 + 0.3 * k)); c.fill() }
  } else if (!o.char) {
    c.fillStyle = 'rgba(205,215,225,.32)'
    ell(c, -0.25 * L, 0, 0.42 * L, 0.075 * L); c.fill()
  }
  // 배
  const fed = b.fed
  const aw = (fed ? 0.12 : 0.07) * L * (cute ? 1.6 : 1)
  ell(c, -0.3 * L, 0, 0.33 * L, aw)
  c.fillStyle = fed ? P.blood : o.belly ? P.belly : P.body
  c.fill()
  if (!cute && !fed && !o.char) {
    c.save(); ell(c, -0.3 * L, 0, 0.33 * L, aw); c.clip()
    c.fillStyle = P.band
    for (let k = 0; k < 5; k++) c.fillRect((-0.6 + k * 0.12) * L, -aw, 0.035 * L, aw * 2)
    c.restore()
  }
  if (fed && !o.char) gloss(c, -0.3 * L, -aw * 0.4, 0.15 * L, aw * 0.3, 0.35)
  // 가슴·머리·주둥이
  c.fillStyle = P.dark; ell(c, 0.05 * L, 0, 0.12 * L, 0.1 * L * (cute ? 1.4 : 1)); c.fill()
  if (b.style === 3 && !o.char) { c.strokeStyle = P.band; c.lineWidth = Math.max(0.6, L * 0.02); c.beginPath(); c.moveTo(-0.03 * L, 0); c.lineTo(0.13 * L, 0); c.stroke() }
  c.fillStyle = P.head; ell(c, 0.2 * L, 0, 0.06 * L * (cute ? 2 : 1), 0.055 * L * (cute ? 2 : 1)); c.fill()
  seg(c, [0.24 * L, 0, (cute ? 0.48 : 0.64) * L, 0], lw * 0.85, P.dark)
  c.lineWidth = Math.max(0.5, L * 0.015)
  for (const side of [-1, 1]) seg(c, [0.22 * L, side * 0.02 * L, 0.36 * L, side * 0.08 * L], c.lineWidth, P.dark)
  if (cute) eyes(c, 0.23 * L, 0.06 * L, 0.055 * L, o.flat || o.char || o.belly)
}

// ── 파리 ──
function fly(c, b, P, L, o) {
  const cute = b.style === 1, real = b.style === 3
  const flying = b.z > 0.05 && !o.flat && !o.belly && !o.char
  const lw = Math.max(0.8, L * 0.045)
  const LEGS = [[0.1, 45, 0.42], [0.04, 95, 0.45], [-0.02, 140, 0.5]]
  c.lineCap = 'round'; c.lineJoin = 'round'
  for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
    const [hx, ang, re] = LEGS[i]
    if (o.flat && b.rnd[(i * 2 + (side > 0 ? 1 : 0) + 9) % 16] < 0.25) continue
    let a = ang * DEG, r = re * L
    let sw = Math.sin(b.phase + ((i + (side > 0 ? 1 : 0)) % 2) * Math.PI) * L * 0.06 * (o.flat ? 0 : b.gait)
    if (i === 0 && b.groom && !flying && !o.flat) { a = (12 + Math.sin(b.t * 24) * 10) * DEG; r = L * 0.4; sw = 0 }
    if (flying) r *= 0.8
    if (o.flat) { a += (b.rnd[i + (side > 0 ? 3 : 0)] - 0.5) * 1; r *= 1.1 }
    if (o.char) r *= 0.5
    if (o.belly) { r *= 0.7; a += Math.sin(b.t * 22 + i * 2 + side) * 0.5 * o.tw }
    const p = legPts(hx * L, side * 0.05 * L, a, r, side, sw)
    seg(c, p, lw, P.leg)
    if (real && !o.char) hairs(c, p, 2, L * 0.03, P.leg, 0.6)
  }
  // 날개
  if (flying) {
    c.fillStyle = 'rgba(200,210,225,.2)'
    for (const side of [-1, 1]) for (const k of [-1, 1]) { ell(c, -0.05 * L, side * (0.25 + 0.1 * k) * L, 0.4 * L, 0.14 * L, side * (0.6 + 0.4 * k)); c.fill() }
  } else if (!o.char && !o.belly) {
    for (const side of [-1, 1]) {
      const an = Math.PI - side * (o.flat ? 0.8 : 0.4)
      const cx = 0.02 * L + Math.cos(an) * 0.3 * L, cy = side * 0.05 * L + Math.sin(an) * 0.3 * L
      c.fillStyle = cute ? 'rgba(235,245,255,.6)' : 'rgba(190,200,215,.4)'
      ell(c, cx, cy, 0.33 * L, 0.11 * L, an); c.fill()
      if (!cute) {
        c.strokeStyle = 'rgba(40,40,40,.35)'; c.lineWidth = 0.6
        c.beginPath(); c.moveTo(0.02 * L, side * 0.05 * L); c.lineTo(cx + Math.cos(an) * 0.3 * L, cy + Math.sin(an) * 0.3 * L); c.stroke()
      }
    }
  }
  // 배
  ell(c, -0.2 * L, 0, 0.26 * L, 0.21 * L)
  if (cute || o.belly) c.fillStyle = o.belly ? P.belly : P.body
  else {
    const g = c.createRadialGradient(-0.15 * L, -0.06 * L, 0, -0.2 * L, 0, 0.27 * L)
    g.addColorStop(0, P.light); g.addColorStop(0.6, P.body); g.addColorStop(1, P.dark)
    c.fillStyle = g
  }
  c.fill()
  if (real && !o.char && !o.belly) {
    c.fillStyle = 'rgba(20,20,20,.45)'
    c.fillRect(-0.4 * L, -0.025 * L, 0.36 * L, 0.05 * L)
    for (const s of [-1, 1]) { ell(c, -0.25 * L, s * 0.1 * L, 0.06 * L, 0.04 * L); c.fill() }
  }
  // 가슴
  c.fillStyle = o.belly ? P.belly : P.body; ell(c, 0.08 * L, 0, 0.17 * L, 0.17 * L); c.fill()
  if (!cute && !o.char && !o.belly) {
    c.strokeStyle = P.dark; c.lineWidth = Math.max(0.8, L * 0.03)
    for (const y of [-0.1, -0.035, 0.035, 0.1]) { c.beginPath(); c.moveTo(-0.04 * L, y * L); c.lineTo(0.2 * L, y * L * 0.8); c.stroke() }
  }
  if (real && !o.char) {
    c.strokeStyle = '#111111'; c.lineWidth = 0.6
    c.beginPath()
    for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; c.moveTo(0.08 * L + Math.cos(a) * 0.16 * L, Math.sin(a) * 0.16 * L); c.lineTo(0.08 * L + Math.cos(a) * 0.21 * L, Math.sin(a) * 0.21 * L) }
    c.stroke()
  }
  // 머리·겹눈
  c.fillStyle = P.head; ell(c, 0.28 * L, 0, 0.1 * L, 0.16 * L); c.fill()
  if (cute) eyes(c, 0.3 * L, 0.09 * L, 0.085 * L, o.flat || o.char || o.belly)
  else {
    for (const s of [-1, 1]) {
      c.fillStyle = P.eye; ell(c, 0.3 * L, s * 0.095 * L, 0.085 * L, 0.09 * L); c.fill()
      if (!o.char) gloss(c, 0.32 * L, s * 0.085 * L - 0.03 * L, 0.03 * L, 0.02 * L, 0.4)
    }
  }
}

// ── 개미 ──
function ant(c, b, P, L, o) {
  const cute = b.style === 1, real = b.style === 3
  const lw = Math.max(0.8, L * (cute ? 0.07 : 0.05))
  const gait = o.flat || o.belly || o.char ? 0 : b.gait
  const LEGS = [[0.12, 55, 0.55], [0.08, 95, 0.6], [0.04, 135, 0.72]]
  c.lineCap = 'round'; c.lineJoin = 'round'
  for (const side of [-1, 1]) for (let i = 0; i < 3; i++) {
    const [hx, ang, re] = LEGS[i]
    if (o.flat && b.rnd[(i * 2 + (side > 0 ? 1 : 0) + 9) % 16] < 0.25) continue
    let a = ang * DEG, r = re * L
    const sw = Math.sin(b.phase + ((i + (side > 0 ? 1 : 0)) % 2) * Math.PI) * L * 0.12 * gait
    if (o.flat) { a += (b.rnd[i + (side > 0 ? 3 : 0)] - 0.5) * 1; r *= 1.1 }
    if (o.char) r *= 0.5
    if (o.belly) { r *= 0.65; a += Math.sin(b.t * 24 + i + side) * 0.5 * o.tw }
    seg(c, legPts(hx * L, side * 0.04 * L, a, r, side, sw), lw, P.leg)
  }
  // 더듬이(꺾인 모양)
  c.lineWidth = Math.max(0.7, L * 0.04)
  for (const side of [-1, 1]) {
    const w = o.flat ? b.rnd[6] - 0.5 : Math.sin(b.t * 7 + side) * 0.06
    seg(c, [0.4 * L, side * 0.05 * L, 0.54 * L, side * 0.2 * L, 0.74 * L, side * (0.12 + w) * L], c.lineWidth, P.dark)
  }
  const fillG = (x, rx, ry) => {
    ell(c, x, 0, rx, ry)
    if (real && !o.char && !o.belly) {
      const g = c.createRadialGradient(x - rx * 0.2, -ry * 0.35, 0, x, 0, rx)
      g.addColorStop(0, P.light); g.addColorStop(0.5, P.body); g.addColorStop(1, P.dark); c.fillStyle = g
    } else c.fillStyle = o.belly ? P.belly : P.body
    c.fill()
  }
  fillG(-0.3 * L, 0.22 * L, 0.17 * L * (cute ? 1.15 : 1))
  fillG(-0.06 * L, 0.05 * L, 0.045 * L)
  fillG(0.1 * L, 0.14 * L, 0.07 * L)
  c.fillStyle = P.head; ell(c, 0.33 * L, 0, 0.12 * L * (cute ? 1.2 : 1), 0.11 * L * (cute ? 1.25 : 1)); c.fill()
  c.strokeStyle = P.dark; c.lineWidth = Math.max(0.7, L * 0.035)
  for (const s of [-1, 1]) { c.beginPath(); c.moveTo(0.42 * L, s * 0.05 * L); c.quadraticCurveTo(0.5 * L, s * 0.04 * L, 0.49 * L, -s * 0.01 * L); c.stroke() }
  if (cute) eyes(c, 0.36 * L, 0.06 * L, 0.055 * L, o.flat || o.char || o.belly)
}

// ── 거미 ──
function spider(c, b, P, L, o) {
  const cute = b.style === 1, real = b.style === 3
  const lw = Math.max(1.2, L * (cute ? 0.065 : 0.055))
  const gait = o.flat || o.belly || o.char ? 0 : b.gait
  const BASE_A = [38, 72, 108, 148], REACH = [1.2, 1.08, 1.02, 1.25]
  c.lineCap = 'round'; c.lineJoin = 'round'
  for (const side of [-1, 1]) for (let i = 0; i < 4; i++) {
    if (o.flat && b.rnd[(i * 2 + (side > 0 ? 1 : 0) + 9) % 16] < 0.25) continue
    let a = BASE_A[i] * DEG, r = REACH[i] * L * (cute ? 0.75 : 1)
    const sw = Math.sin(b.phase + ((i + (side > 0 ? 1 : 0)) % 2) * Math.PI) * L * 0.12 * gait
    if (b.mode === 'wait' && !o.flat) a += Math.sin(b.t * 2 + i) * 0.03
    if (o.flat) { a += (b.rnd[i + (side > 0 ? 4 : 0)] - 0.5) * 0.7; r *= 1.05 }
    if (o.char) { r *= 0.45; a = lerp(a, Math.PI / 2, 0.3) }
    if (o.belly) { r *= 0.55; a += Math.sin(b.t * 16 + i * 1.7 + side) * 0.5 * o.tw }
    const p = legPts(0.12 * L + (1.5 - i) * 0.03 * L, side * 0.07 * L, a, r, side, sw, 0.45, 0.55)
    seg(c, p, lw, P.leg)
    if (real && !o.char) hairs(c, p, 4, L * 0.035, P.leg, 0.7)
    if (real && !o.char && !o.flat) { c.fillStyle = P.dark; ell(c, p[2], p[3], lw * 0.7, lw * 0.7); c.fill() }
  }
  // 더듬이다리
  for (const side of [-1, 1]) seg(c, [0.28 * L, side * 0.04 * L, 0.38 * L, side * 0.08 * L, 0.42 * L, side * 0.05 * L], lw * 0.9, P.leg)
  // 배
  ell(c, -0.28 * L, 0, 0.3 * L, 0.24 * L * (cute ? 1.15 : 1))
  if (cute || o.belly) c.fillStyle = o.belly ? P.belly : P.body
  else {
    const g = c.createRadialGradient(-0.22 * L, -0.08 * L, 0, -0.28 * L, 0, 0.32 * L)
    g.addColorStop(0, P.light); g.addColorStop(0.5, P.body); g.addColorStop(1, P.dark); c.fillStyle = g
  }
  c.fill()
  if (!o.char && !o.belly) {
    c.fillStyle = cute ? P.mark : mix(BASE.spider[b.style].mark, '#000000', 0.1)
    if (cute) { ell(c, -0.3 * L, 0, 0.08 * L, 0.08 * L); c.fill() }
    else {
      ell(c, -0.2 * L, 0, 0.12 * L, 0.035 * L); c.fill()
      c.strokeStyle = P.dark; c.lineWidth = Math.max(0.8, L * 0.02)
      for (let k = 0; k < 3; k++) { const x = (-0.3 - k * 0.07) * L; c.beginPath(); c.moveTo(x - 0.03 * L, -0.1 * L); c.lineTo(x, 0); c.lineTo(x - 0.03 * L, 0.1 * L); c.stroke() }
    }
    if (real) {
      c.strokeStyle = P.dark; c.lineWidth = 0.7; c.beginPath()
      for (let i = 0; i < 24; i++) { const a = (i / 24) * TAU; c.moveTo(-0.28 * L + Math.cos(a) * 0.29 * L, Math.sin(a) * 0.23 * L); c.lineTo(-0.28 * L + Math.cos(a) * 0.33 * L, Math.sin(a) * 0.27 * L) }
      c.stroke()
    }
  }
  // 머리가슴
  c.fillStyle = o.belly ? P.belly : P.head; ell(c, 0.12 * L, 0, 0.2 * L, 0.16 * L); c.fill()
  if (!cute && !o.char && !o.belly) { c.fillStyle = BASE.spider[b.style].mark; ell(c, 0.1 * L, 0, 0.12 * L, 0.03 * L); c.globalAlpha = 0.6; c.fill(); c.globalAlpha = 1 }
  if (cute) eyes(c, 0.24 * L, 0.06 * L, 0.065 * L, o.flat || o.char || o.belly)
  else if (!o.belly) {
    c.fillStyle = '#0a0a0a'
    for (const s of [-1, 1]) { ell(c, 0.27 * L, s * 0.04 * L, 0.03 * L, 0.03 * L); c.fill(); ell(c, 0.24 * L, s * 0.085 * L, 0.018 * L, 0.018 * L); c.fill() }
    ell(c, 0.3 * L, -0.015 * L, 0.015 * L, 0.015 * L); c.fill(); ell(c, 0.3 * L, 0.015 * L, 0.015 * L, 0.015 * L); c.fill()
    if (real && !o.char) for (const s of [-1, 1]) gloss(c, 0.275 * L, s * 0.04 * L - 0.01 * L, 0.01 * L, 0.01 * L, 0.8)
  }
}

// ── 지네(마디가 머리를 따라온다, 월드 좌표에서 그린다) ──
function centipede(c, b, P, o) {
  const cute = b.style === 1, real = b.style === 3
  const pts = [{ x: b.x, y: b.y }].concat(b.segs)
  const n = pts.length, sp = b.len / b.segs.length, w = sp * (cute ? 1.8 : 1.5)
  const gait = o.flat || o.belly || o.char ? 0 : b.gait
  const dirAt = (i) => {
    const p = pts[i], q = pts[Math.max(0, i - 1)], r = pts[Math.min(n - 1, i + 1)]
    return Math.atan2(q.y - r.y, q.x - r.x)
  }
  c.lineCap = 'round'; c.lineJoin = 'round'
  // 다리
  for (let i = 1; i < n; i++) {
    const p = pts[i], a = dirAt(i)
    for (const side of [-1, 1]) {
      let wave = Math.sin(b.phase * 1.2 - i * 0.8) * 0.5 * gait
      if (o.flat) wave = (b.rnd[(i + (side > 0 ? 5 : 0)) % 16] - 0.5) * 0.8
      if (o.belly) wave = Math.sin(b.t * 15 - i * 0.6) * 0.6 * o.tw
      const last = i === n - 1
      const la = last ? a + Math.PI + side * 0.35 : a + side * (Math.PI / 2 + 0.3) + wave * side
      const len = (last ? w * 2 : w * 1.0) * (o.char ? 0.5 : 1)
      const bx = p.x + Math.cos(a + side * Math.PI / 2) * w * 0.35, by = p.y + Math.sin(a + side * Math.PI / 2) * w * 0.35
      const kx = bx + Math.cos(la - side * 0.4) * len * 0.5, ky = by + Math.sin(la - side * 0.4) * len * 0.5
      seg(c, [bx, by, kx, ky, bx + Math.cos(la) * len, by + Math.sin(la) * len], Math.max(0.8, w * 0.12), P.leg)
    }
  }
  // 마디(꼬리 → 머리 순)
  for (let i = n - 1; i >= 1; i--) {
    const p = pts[i], a = dirAt(i)
    const taper = 1 - (i / n) * 0.25
    ell(c, p.x, p.y, sp * 0.66, w * 0.5 * taper, a)
    c.fillStyle = o.belly ? P.belly : i === 1 && !cute ? P.head : P.body; c.fill()
    c.strokeStyle = P.dark; c.lineWidth = Math.max(0.6, w * 0.06); c.stroke()
    if (real && !o.char && !o.belly) { ell(c, p.x + Math.cos(a - 1.2) * w * 0.15, p.y + Math.sin(a - 1.2) * w * 0.15, sp * 0.35, w * 0.08, a); c.fillStyle = 'rgba(255,255,255,.18)'; c.fill() }
  }
  // 머리
  const a = b.a
  c.save(); c.translate(b.x, b.y); c.rotate(a)
  c.lineWidth = Math.max(0.8, w * 0.08)
  for (const s of [-1, 1]) {
    const wv = o.flat ? 0 : Math.sin(b.t * 6 + s) * 0.15
    c.strokeStyle = P.leg
    c.beginPath(); c.moveTo(sp * 0.5, s * w * 0.15); c.quadraticCurveTo(sp * 1.6, s * w * (0.5 + wv), sp * 2.6, s * w * (0.9 + wv)); c.stroke()
    c.strokeStyle = P.dark
    c.beginPath(); c.moveTo(sp * 0.4, s * w * 0.3); c.quadraticCurveTo(sp * 0.9, s * w * 0.45, sp * 0.85, s * w * 0.1); c.stroke()
  }
  c.fillStyle = o.belly ? P.belly : P.head; ell(c, 0, 0, sp * 0.8, w * 0.55); c.fill()
  c.strokeStyle = P.dark; c.lineWidth = Math.max(0.6, w * 0.06); c.stroke()
  if (real && !o.char) gloss(c, sp * 0.1, -w * 0.18, sp * 0.4, w * 0.1, 0.25)
  if (cute) eyes(c, sp * 0.2, w * 0.25, w * 0.2, o.flat || o.char || o.belly)
  c.restore()
}

const DRAW = { roach, mosquito, fly, ant, spider }

/** 벌레 한 마리를 그린다. o는 상태(납작·뒤집힘·탐) */
export function drawBug(c, b, o = {}) {
  const P = palette(b)
  REAL = b.style === 3 && !o.char
  if (b.type === 'centipede') {
    c.save()
    if (o.flat) { c.translate(b.x, b.y); c.scale(1.08, 1.08); c.translate(-b.x, -b.y) }
    centipede(c, b, P, o)
    c.restore()
    REAL = false
    return
  }
  c.save()
  c.translate(b.x, b.y)
  c.rotate(b.a)
  const sc = 1 + b.z * 0.22
  if (o.flat) c.scale(1.12 * (o.big ? 1.15 : 1), 1.45 * (o.big ? 1.25 : 1))
  else c.scale(sc, sc)
  DRAW[b.type](c, b, P, b.len, o)
  c.restore()
  REAL = false
}

/** 바닥에 붙어 있는 벌레 밑의 부드러운 그림자(빛은 왼쪽 위에서) */
export function drawGroundShadow(c, b, img) {
  if (b.z > 0.05 || b.mode === 'dangle') return
  const k = b.style === 1 ? 0.25 : b.style === 2 ? 0.38 : 0.55
  c.globalAlpha = k
  if (b.type === 'centipede') {
    const pts = [b].concat(b.segs), r = (b.len / b.segs.length) * 1.3
    for (let i = 0; i < pts.length; i += 2) c.drawImage(img, pts[i].x + r * 0.3 - r, pts[i].y + r * 0.45 - r, r * 2, r * 2)
  } else {
    const L = b.len * (b.type === 'spider' ? 1.5 : b.type === 'mosquito' ? 0.9 : 1)
    c.save(); c.translate(b.x + L * 0.06, b.y + L * 0.09); c.rotate(b.a)
    c.drawImage(img, -L * 0.68, -L * 0.4, L * 1.36, L * 0.8)
    c.restore()
  }
  c.globalAlpha = 1
}

/** 날고 있는 벌레의 그림자 */
export function drawShadow(c, b, img) {
  if (b.z <= 0.02) return
  const off = b.z * 18 + 2
  c.globalAlpha = 0.28 * (1 - b.z * 0.4)
  const r = b.len * (0.6 + b.z * 0.3)
  c.drawImage(img, b.x + off - r, b.y + off * 1.4 - r * 0.7, r * 2, r * 1.4)
  c.globalAlpha = 1
}

/** 메뉴·도감용 작은 그림(정지 자세) */
export function drawThumb(c, type, style, size) {
  const len = type === 'centipede' ? size * 0.9 : type === 'spider' ? size * 0.42 : type === 'mosquito' ? size * 0.45 : size * 0.62
  const b = { type, style, x: size / 2, y: size / 2, a: -Math.PI / 2, z: 0, len, phase: 1, gait: 0, t: 1, burn: 0, mode: 'stop', rnd: Array(16).fill(0.5), segs: [], fed: false, groom: false }
  if (type === 'centipede') {
    b.len = size * 0.85; b.x = size / 2; b.y = size * 0.12
    const n = 12
    for (let i = 1; i <= n; i++) b.segs.push({ x: size / 2 + Math.sin(i * 0.55) * size * 0.12, y: size * 0.12 + i * (b.len / n) })
    b.a = Math.atan2(b.y - b.segs[0].y, b.x - b.segs[0].x)
  } else if (type === 'spider') b.x = size / 2, b.y = size * 0.55
  drawBug(c, b, {})
}
