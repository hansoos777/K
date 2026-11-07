// 타격 효과: 파편·체액 방울·연기·불꽃·안개 입자, 바닥에 남는 자국(얼룩·그을음·신발 자국), 화면 유리 금, 글자 팝업
import { G } from './state.js'
import { TAU, R, RI, pick, clamp, lerp, mix, alpha, ell } from './util.js'

// ── 부드러운 원 스프라이트(불꽃·연기·안개를 수백 개 그려도 가볍게) ──
export const SPR = {}
function sprite(color, hard = 0) {
  const s = 64, c = document.createElement('canvas'); c.width = c.height = s
  const x = c.getContext('2d'), g = x.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, alpha(color, 1))
  if (hard) g.addColorStop(hard, alpha(color, 0.75))
  g.addColorStop(1, alpha(color, 0))
  x.fillStyle = g; x.fillRect(0, 0, s, s)
  return c
}
export function initSprites() {
  SPR.fire = ['#fffbe8', '#ffe27a', '#ffa230', '#f2561d', '#a3260f'].map((c) => sprite(c, 0.25))
  SPR.smoke = sprite('#2e2a27')
  SPR.mist = sprite('#eef6e2')
  SPR.dust = sprite('#cdbb98')
  SPR.shadow = sprite('#000000')
  SPR.glow = sprite('#ff9a3c')
  SPR.blue = sprite('#8fd0ff', 0.2)
  SPR.white = sprite('#ffffff', 0.3)
}
const spr = (c, img, x, y, r, a) => {
  if (a <= 0.003) return
  c.globalAlpha = a
  c.drawImage(img, x - r, y - r, r * 2, r * 2)
}

// ── 바닥 자국(decal 캔버스에 계속 쌓인다) ──
function blob(c, r, n, jag, rnd = Math.random) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * TAU + rnd() * 0.3
    const rr = r * (1 - jag / 2 + rnd() * jag)
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr])
  }
  c.beginPath()
  const m = (i) => { const p = pts[i % n], q = pts[(i + 1) % n]; return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2] }
  let s = m(0); c.moveTo(s[0], s[1])
  for (let i = 1; i <= n; i++) { const p = pts[i % n], e = m(i); c.quadraticCurveTo(p[0], p[1], e[0], e[1]) }
  c.closePath()
}

const CUTE_GOO = { roach: '#ffd36b', mosquito: '#ff7d93', fly: '#8fd0ff', ant: '#ffb37a', spider: '#c9a8ff', centipede: '#9be38a' }

/** 체액 얼룩. style 1은 만화처럼 별 모양, 2는 단색, 3은 윤기·덩어리·튀는 방울까지 */
export function splat(x, y, { color, size, dir = null, style = 3, type = 'roach', big = false }) {
  const c = G.ctx.decal
  c.save(); c.translate(x, y)
  if (style === 1) {
    const col = CUTE_GOO[type] || '#ffd36b'
    c.fillStyle = col
    c.beginPath()
    const n = 9
    for (let i = 0; i <= n * 2; i++) {
      const a = (i / (n * 2)) * TAU, r = i % 2 ? size * 0.55 : size * (1 + Math.random() * 0.3)
      c[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r)
    }
    c.closePath(); c.fill()
    c.fillStyle = 'rgba(255,255,255,.5)'; ell(c, -size * 0.25, -size * 0.25, size * 0.25, size * 0.16, -0.6); c.fill()
    for (let i = 0; i < 6; i++) {
      const a = R(TAU), d = size * R(1.4, 2.1)
      c.fillStyle = col; ell(c, Math.cos(a) * d, Math.sin(a) * d, size * R(0.08, 0.16), size * R(0.08, 0.16)); c.fill()
    }
    c.restore(); return
  }
  const real = style === 3
  const dark = mix(color, '#000000', 0.35), light = mix(color, '#ffffff', 0.3)
  // 큰 덩어리
  c.globalAlpha = real ? 0.94 : 0.9
  if (real) {
    const g = c.createRadialGradient(-size * 0.15, -size * 0.15, 0, 0, 0, size * 1.1)
    g.addColorStop(0, light); g.addColorStop(0.55, color); g.addColorStop(1, dark)
    c.fillStyle = g
  } else c.fillStyle = color
  blob(c, size * (big ? 1.25 : 1), 13, 0.55); c.fill()
  // 내장 덩어리
  if (real) {
    for (let i = 0; i < RI(3, 6); i++) {
      c.save(); c.translate(R(-0.5, 0.5) * size, R(-0.5, 0.5) * size)
      c.fillStyle = Math.random() < 0.5 ? dark : mix(color, '#5a3a1a', 0.45)
      blob(c, size * R(0.12, 0.28), 7, 0.7); c.fill(); c.restore()
    }
  }
  // 튀는 방울과 줄기
  const n = big ? RI(16, 26) : RI(8, 15)
  for (let i = 0; i < n; i++) {
    const a = dir != null && Math.random() < 0.7 ? dir + R(-0.7, 0.7) : R(TAU)
    const d = size * R(1, big ? 3.2 : 2.3), r = Math.max(0.8, size * R(0.04, 0.13))
    const ex = Math.cos(a) * d, ey = Math.sin(a) * d
    if (Math.random() < 0.45) {
      c.strokeStyle = color; c.lineCap = 'round'
      c.lineWidth = r * 1.3
      c.beginPath(); c.moveTo(Math.cos(a) * size * 0.6, Math.sin(a) * size * 0.6); c.lineTo(ex, ey); c.stroke()
    }
    c.fillStyle = color; ell(c, ex, ey, r * 1.4, r, a); c.fill()
  }
  // 윤기
  if (real) {
    c.globalAlpha = 0.45; c.fillStyle = '#ffffff'
    for (let i = 0; i < 4; i++) { ell(c, R(-0.5, 0.3) * size, R(-0.5, 0.3) * size, size * R(0.04, 0.1), size * R(0.02, 0.05), -0.6); c.fill() }
  }
  c.restore()
}
/** 작은 방울 하나(다친 벌레가 흘리는 체액, 튄 방울이 떨어진 자리) */
export function drip(x, y, color, r) {
  const c = G.ctx.decal
  c.globalAlpha = 0.85; c.fillStyle = color
  ell(c, x, y, r, r * R(0.7, 1), R(TAU)); c.fill(); c.globalAlpha = 1
}
/** 불에 그을린 자국 */
export function scorch(x, y, r, a = 0.1) {
  const c = G.ctx.decal
  spr(c, SPR.shadow, x, y, r, a)
  c.globalAlpha = 1
}
/** 파리채 그물 자국: 터진 자리에 격자가 찍힌다 */
export function meshPrint(x, y, r, ang, color) {
  const c = G.ctx.decal
  c.save(); c.translate(x, y); c.rotate(ang)
  ell(c, 0, 0, r, r); c.clip()
  c.strokeStyle = alpha('#000000', 0.25); c.lineWidth = Math.max(1, r * 0.05)
  const s = Math.max(4, r * 0.18)
  c.beginPath()
  for (let k = -r; k <= r; k += s) { c.moveTo(k, -r); c.lineTo(k, r); c.moveTo(-r, k); c.lineTo(r, k) }
  c.stroke()
  c.strokeStyle = alpha(mix(color, '#ffffff', 0.4), 0.25); c.lineWidth = Math.max(0.6, r * 0.025)
  c.beginPath()
  for (let k = -r + 1.5; k <= r; k += s) { c.moveTo(k, -r); c.lineTo(k, r) }
  c.stroke()
  c.restore()
}
/** 문질러 밟을 때 생기는 긴 얼룩 */
export function smear(x, y, len, ang, color) {
  const c = G.ctx.decal
  c.save(); c.translate(x, y); c.rotate(ang)
  c.globalAlpha = 0.35; c.fillStyle = color
  ell(c, len * 0.3, 0, len * 0.7, len * 0.16); c.fill()
  c.globalAlpha = 0.25
  ell(c, len * 0.6, R(-0.1, 0.1) * len, len * 0.4, len * 0.06); c.fill()
  c.restore()
}
/** 신발 바닥 무늬 자국 */
export function solePrint(x, y, S, rot, outline) {
  const c = G.ctx.decal
  c.save(); c.translate(x, y); c.rotate(rot)
  outline(c, S); c.clip()
  c.strokeStyle = 'rgba(35,25,15,.075)'; c.lineWidth = S * 0.012
  c.beginPath()
  for (let yy = -S * 0.5; yy < S * 0.1; yy += S * 0.045) {
    for (let xx = -S * 0.25; xx < S * 0.25; xx += S * 0.06) {
      c.moveTo(xx, yy); c.lineTo(xx + S * 0.03, yy + S * 0.02); c.lineTo(xx + S * 0.06, yy)
    }
  }
  c.stroke()
  c.fillStyle = 'rgba(35,25,15,.07)'
  for (let i = 0; i < 7; i++) { ell(c, R(-0.12, 0.12) * S, S * R(0.22, 0.45), S * 0.035, S * 0.035); c.fill() }
  c.restore()
}

// ── 화면 유리 금(망치) ──
export function crack(x, y, size) {
  const c = G.ctx.glass
  const n = RI(10, 16), rays = []
  for (let i = 0; i < n; i++) {
    let a = (i / n) * TAU + R(-0.2, 0.2), px = x, py = y
    const len = size * R(0.35, 1.1), steps = RI(6, 11), pts = [[x, y]]
    for (let s = 0; s < steps; s++) {
      a += R(-0.35, 0.35)
      px += Math.cos(a) * (len / steps); py += Math.sin(a) * (len / steps)
      pts.push([px, py])
    }
    rays.push(pts)
    if (Math.random() < 0.5) { // 가지
      const k = RI(2, pts.length - 2), b = pts[k]
      let ba = a + R(-1, 1), bx = b[0], by = b[1]; const bp = [[bx, by]]
      for (let s = 0; s < 4; s++) { ba += R(-0.4, 0.4); bx += Math.cos(ba) * len * 0.12; by += Math.sin(ba) * len * 0.12; bp.push([bx, by]) }
      rays.push(bp)
    }
  }
  const at = (pts, d) => { // 중심에서 d만큼 떨어진 지점
    let acc = 0
    for (let i = 1; i < pts.length; i++) {
      const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
      if (acc + l >= d) { const t = (d - acc) / l; return [lerp(pts[i - 1][0], pts[i][0], t), lerp(pts[i - 1][1], pts[i][1], t)] }
      acc += l
    }
    return null
  }
  const lines = rays.slice()
  const main = rays.slice(0, n)
  for (const rf of [0.12, 0.26, 0.45]) { // 거미줄처럼 이어지는 고리
    for (let i = 0; i < main.length; i++) {
      if (Math.random() < 0.3) continue
      const a = at(main[i], size * rf * R(0.85, 1.15)), b = at(main[(i + 1) % main.length], size * rf * R(0.85, 1.15))
      if (a && b) lines.push([a, [(a[0] + b[0]) / 2 + R(-4, 4), (a[1] + b[1]) / 2 + R(-4, 4)], b])
    }
  }
  const stroke = (col, w, ox, oy) => {
    c.strokeStyle = col; c.lineWidth = w; c.lineJoin = 'round'; c.lineCap = 'round'
    c.beginPath()
    for (const p of lines) { c.moveTo(p[0][0] + ox, p[0][1] + oy); for (let i = 1; i < p.length; i++) c.lineTo(p[i][0] + ox, p[i][1] + oy) }
    c.stroke()
  }
  stroke('rgba(0,0,0,.35)', 2.2, 1, 1)
  stroke('rgba(255,255,255,.85)', 1.1, 0, 0)
  stroke('rgba(200,230,255,.25)', 4, 0, 0)
  // 가운데 부서진 조각
  for (let i = 0; i < 16; i++) {
    const a = R(TAU), d = R(size * 0.08)
    c.fillStyle = `rgba(255,255,255,${R(0.15, 0.55)})`
    c.beginPath()
    const cx = x + Math.cos(a) * d, cy = y + Math.sin(a) * d, s = R(2, 7)
    c.moveTo(cx, cy); c.lineTo(cx + R(-s, s), cy + R(-s, s)); c.lineTo(cx + R(-s, s), cy + R(-s, s)); c.closePath(); c.fill()
  }
  c.fillStyle = 'rgba(20,20,20,.5)'; ell(c, x, y, 3.5, 3.5); c.fill()
  c.fillStyle = 'rgba(255,255,255,.9)'
  for (let i = 0; i < 6; i++) { const p = pick(lines); const q = pick(p); ell(c, q[0], q[1], 1.3, 1.3); c.fill() }
}

// ── 입자 ──
export function add(p) { if (G.parts.length < 700) G.parts.push(p) }
export function drops(x, y, color, n, speed, dir = null) {
  for (let i = 0; i < n; i++) {
    const a = dir != null && Math.random() < 0.6 ? dir + R(-0.8, 0.8) : R(TAU), v = speed * R(0.3, 1)
    add({ k: 'drop', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: R(0.12, 0.3), age: 0, r: R(1, 3.2) * (G.U / 4), color })
  }
}
export function bits(x, y, color, n, size) {
  for (let i = 0; i < n; i++) {
    const a = R(TAU), v = R(80, 260) * (G.U / 4)
    add({ k: 'bit', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: R(0.25, 0.5), age: 0, r: size * R(0.15, 0.3), rot: R(TAU), vr: R(-20, 20), color, w: Math.max(1, size * 0.03) })
  }
}
export function sparks(x, y, n, color = '#bfe6ff') {
  for (let i = 0; i < n; i++) {
    const a = R(TAU), v = R(150, 620) * (G.U / 4)
    add({ k: 'spark', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: R(0.12, 0.35), age: 0, color })
  }
}
export function smoke(x, y, n, r = 10, delay = 0) {
  for (let i = 0; i < n; i++) {
    add({ k: 'smoke', x: x + R(-r, r) * 0.4, y: y + R(-r, r) * 0.4, vx: R(-12, 12), vy: R(-30, -8), life: R(1, 2), age: -delay * Math.random(), r: r * R(0.6, 1.1), grow: R(14, 30) * (G.U / 4), a: R(0.18, 0.34) })
  }
}
export function dust(x, y, n, spread, speed) {
  for (let i = 0; i < n; i++) {
    const a = R(TAU), v = speed * R(0.4, 1)
    add({ k: 'dust', x: x + Math.cos(a) * spread * R(0.6, 1), y: y + Math.sin(a) * spread * R(0.6, 1), vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: R(0.5, 1.1), age: 0, r: R(8, 18) * (G.U / 4), a: R(0.25, 0.5) })
  }
}
export function stars(x, y, n) {
  for (let i = 0; i < n; i++) {
    const a = R(TAU), v = R(120, 320) * (G.U / 4)
    add({ k: 'star', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: R(0.4, 0.7), age: 0, r: R(4, 8) * (G.U / 4), rot: R(TAU), color: pick(['#ffe66b', '#ff9ad0', '#9ee7ff', '#b8ff8a']) })
  }
}
export function shards(x, y, n) {
  for (let i = 0; i < n; i++) {
    const a = R(TAU), v = R(100, 500) * (G.U / 4)
    add({ k: 'shard', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: R(0.25, 0.6), age: 0, r: R(2, 6), rot: R(TAU), vr: R(-25, 25) })
  }
}
export function fireAt(x, y, n, r, life = 0.4, spread = 20) {
  for (let i = 0; i < n; i++) {
    if (G.fire.length > 900) return
    G.fire.push({ x: x + R(-spread, spread) * 0.3, y: y + R(-spread, spread) * 0.3, vx: R(-spread, spread), vy: R(-spread, spread) - 10, age: 0, life: life * R(0.6, 1.2), r: r * R(0.6, 1.1), reach: 0, grow: 25 * (G.U / 4), hot: false })
  }
}

export function update(dt) {
  const P = G.parts
  for (let i = P.length - 1; i >= 0; i--) {
    const p = P[i]
    p.age += dt
    if (p.age < 0) continue
    const drag = p.k === 'drop' || p.k === 'bit' ? 7 : p.k === 'dust' ? 4 : p.k === 'spark' ? 3 : 1.2
    p.vx *= Math.exp(-drag * dt); p.vy *= Math.exp(-drag * dt)
    p.x += p.vx * dt; p.y += p.vy * dt
    if (p.rot != null) p.rot += (p.vr || 0) * dt
    if (p.age >= p.life) {
      if (p.k === 'drop') drip(p.x, p.y, p.color, p.r)
      else if (p.k === 'bit') {
        const c = G.ctx.decal
        c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.strokeStyle = p.color; c.lineWidth = p.w; c.lineCap = 'round'
        c.beginPath(); c.moveTo(-p.r, 0); c.lineTo(0, p.r * 0.3); c.lineTo(p.r, 0); c.stroke(); c.restore()
      }
      P.splice(i, 1)
    }
  }
  // 불꽃
  const F = G.fire
  for (let i = F.length - 1; i >= 0; i--) {
    const p = F[i]
    p.age += dt
    if (p.age < p.reach) { p.x += p.vx * dt; p.y += p.vy * dt }
    else {
      p.vx *= Math.exp(-5 * dt); p.vy *= Math.exp(-5 * dt)
      p.x += p.vx * dt + R(-30, 30) * dt; p.y += p.vy * dt + R(-30, 30) * dt
      p.hot = true
    }
    p.r += p.grow * dt
    if (p.age >= p.life) {
      if (Math.random() < 0.18) smoke(p.x, p.y, 1, p.r * 0.8)
      F.splice(i, 1)
    }
  }
  // 살충제 안개
  const M = G.mist
  for (let i = M.length - 1; i >= 0; i--) {
    const m = M[i]
    m.age += dt
    m.vx *= Math.exp(-3.2 * dt); m.vy *= Math.exp(-3.2 * dt)
    m.x += m.vx * dt + R(-8, 8) * dt; m.y += m.vy * dt + R(-8, 8) * dt
    m.r = Math.min(m.r + 42 * (G.U / 4) * dt, 46 * (G.U / 4))
    if (m.age >= m.life) M.splice(i, 1)
  }
  // 바닥에 남은 불
  const GF = G.grounds
  for (let i = GF.length - 1; i >= 0; i--) {
    const g = GF[i]
    g.age += dt
    const k = 1 - g.age / g.life
    if (Math.random() < 0.7) fireAt(g.x, g.y, 1, g.r * 0.5 * k + 2, 0.35, g.r)
    if (Math.random() < 0.05) scorch(g.x + R(-g.r, g.r), g.y + R(-g.r, g.r), g.r * 1.2, 0.05)
    if (g.age >= g.life) GF.splice(i, 1)
  }
  // 전기 아크
  for (let i = G.arcs.length - 1; i >= 0; i--) { G.arcs[i].age += dt; if (G.arcs[i].age > G.arcs[i].life) G.arcs.splice(i, 1) }
  // 글자
  for (let i = G.pops.length - 1; i >= 0; i--) { const p = G.pops[i]; p.age += dt; if (p.age > p.life) G.pops.splice(i, 1) }
}

/** 보통 섞기로 그리는 입자(방울, 먼지, 연기, 안개 등) */
export function drawNormal(c) {
  for (const m of G.mist) spr(c, SPR.mist, m.x, m.y, m.r, 0.22 * (1 - m.age / m.life))
  for (const p of G.parts) {
    if (p.age < 0) continue
    const k = p.age / p.life
    if (p.k === 'drop') {
      c.globalAlpha = 1; c.fillStyle = p.color; ell(c, p.x, p.y, p.r, p.r); c.fill()
    } else if (p.k === 'bit') {
      c.globalAlpha = 1; c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.strokeStyle = p.color; c.lineWidth = p.w; c.lineCap = 'round'
      c.beginPath(); c.moveTo(-p.r, 0); c.lineTo(0, p.r * 0.3); c.lineTo(p.r, 0); c.stroke(); c.restore()
    } else if (p.k === 'smoke') {
      spr(c, SPR.smoke, p.x, p.y, p.r + p.grow * p.age, p.a * (1 - k))
    } else if (p.k === 'dust') {
      spr(c, SPR.dust, p.x, p.y, p.r * (1 + k * 1.5), p.a * (1 - k))
    } else if (p.k === 'star') {
      c.globalAlpha = 1 - k; c.fillStyle = p.color; star(c, p.x, p.y, p.r * (1 - k * 0.4), p.rot)
    }
  }
  c.globalAlpha = 1
}
function star(c, x, y, r, rot) {
  c.beginPath()
  for (let i = 0; i < 10; i++) { const a = rot + (i / 10) * TAU, rr = i % 2 ? r * 0.45 : r; c[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * rr, y + Math.sin(a) * rr) }
  c.closePath(); c.fill()
}
/** 빛을 더하는 입자(불꽃, 전기 불똥, 유리 반짝임) */
export function drawAdditive(c) {
  c.globalCompositeOperation = 'lighter'
  for (const p of G.fire) {
    const f = p.age / p.life
    const idx = f < 0.12 ? 0 : f < 0.3 ? 1 : f < 0.55 ? 2 : f < 0.8 ? 3 : 4
    spr(c, SPR.fire[idx], p.x, p.y, p.r, (1 - f) * 0.85)
  }
  for (const p of G.parts) {
    if (p.k === 'spark') {
      const k = p.age / p.life
      c.globalAlpha = 1 - k; c.strokeStyle = p.color; c.lineWidth = 1.6
      c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(p.x - p.vx * 0.03, p.y - p.vy * 0.03); c.stroke()
    } else if (p.k === 'shard') {
      const k = p.age / p.life
      c.globalAlpha = (1 - k) * (0.5 + 0.5 * Math.sin(p.age * 60)); c.fillStyle = '#ffffff'
      c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); c.restore()
    }
  }
  // 전기 아크
  for (const a of G.arcs) {
    const k = 1 - a.age / a.life
    c.globalAlpha = k
    c.strokeStyle = 'rgba(120,180,255,.55)'; c.lineWidth = 5
    poly(c, a.pts)
    c.strokeStyle = '#f4fbff'; c.lineWidth = 1.6
    poly(c, a.pts)
  }
  c.globalAlpha = 1
  c.globalCompositeOperation = 'source-over'
}
function poly(c, pts) { c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]); c.stroke() }
export function arc(x1, y1, x2, y2) {
  const pts = [[x1, y1]], n = 7
  for (let i = 1; i < n; i++) {
    const t = i / n, j = Math.hypot(x2 - x1, y2 - y1) * 0.12
    pts.push([lerp(x1, x2, t) + R(-j, j), lerp(y1, y2, t) + R(-j, j)])
  }
  pts.push([x2, y2])
  G.arcs.push({ pts, age: 0, life: R(0.08, 0.16) })
}

// ── 글자 팝업 ──
export function pop(text, x, y, color = '#ffffff', size = 1, life = 0.8) {
  if (G.pops.length > 30) G.pops.shift()
  G.pops.push({ text, x: clamp(x, 60, G.W - 60), y: clamp(y, 70, G.H - 60), color, size: size * clamp(G.U * 7, 22, 44), age: 0, life, rot: R(-0.15, 0.15) })
}
export function drawPops(c) {
  c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round'
  for (const p of G.pops) {
    const k = p.age / p.life
    const sc = k < 0.12 ? lerp(0.4, 1.2, k / 0.12) : k < 0.22 ? lerp(1.2, 1, (k - 0.12) / 0.1) : 1
    c.save()
    c.translate(p.x, p.y - k * 40); c.rotate(p.rot); c.scale(sc, sc)
    c.globalAlpha = k > 0.7 ? 1 - (k - 0.7) / 0.3 : 1
    c.font = `${Math.round(p.size)}px "Black Han Sans", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif`
    c.strokeStyle = '#17120c'; c.lineWidth = p.size * 0.2
    c.strokeText(p.text, 0, 0)
    c.fillStyle = p.color; c.fillText(p.text, 0, 0)
    c.restore()
  }
  c.globalAlpha = 1
}
