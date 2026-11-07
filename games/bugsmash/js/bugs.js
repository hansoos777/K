// 벌레 행동: 종류마다 움직이는 방식이 다르다.
// 바퀴벌레는 벽을 따라 달리다 멈추고, 모기는 사람 쪽으로 다가오고, 파리는 앉았다 튀고,
// 개미는 줄지어 걷고, 거미는 가만히 있다 갑자기 달리고 천장에서 내려오며, 지네는 마디가 물결친다.
import { G, diff } from './state.js'
import { TAU, R, RI, pick, clamp, lerp, angDiff } from './util.js'
import { drawBug, palette } from './art.js'
import * as FX from './fx.js'
import { sfx } from './audio.js'

export const SPECS = {
  roach: { name: '바퀴벌레', len: [11, 46, 86], speed: [26, 40, 54], hp: 2, flyer: false, goo: '#e6dcaa', score: 30, resist: 1.6, hitK: 0.42 },
  mosquito: { name: '모기', len: [5, 22, 34], speed: [10, 14, 18], hp: 1, flyer: true, goo: '#b3121d', score: 50, resist: 0.5, hitK: 0.75 },
  fly: { name: '파리', len: [5.4, 24, 38], speed: [22, 32, 40], hp: 1, flyer: true, goo: '#6b4a2a', score: 40, resist: 0.7, hitK: 0.7 },
  ant: { name: '개미', len: [3, 14, 22], speed: [6, 8, 10], hp: 1, flyer: false, goo: '#4a3424', score: 8, resist: 0.5, hitK: 0.9 },
  spider: { name: '거미', len: [7.5, 32, 54], speed: [30, 46, 62], hp: 2, flyer: false, goo: '#d9c78e', score: 45, resist: 1.2, hitK: 0.6 },
  centipede: { name: '지네', len: [26, 110, 210], speed: [12, 17, 22], hp: 3, flyer: false, goo: '#c8d46a', score: 90, resist: 1.4, hitK: 0.5 },
}
export const TYPES = Object.keys(SPECS)

const randIn = (m = 30) => {
  const A = G.area
  return { x: R(A.x0 + m, A.x1 - m), y: R(A.y0 + m, A.y1 - m) }
}
const nearEdge = () => {
  const A = G.area, m = 26
  const s = RI(0, 3)
  if (s === 0) return { x: R(A.x0 + m, A.x1 - m), y: A.y0 + m }
  if (s === 1) return { x: A.x1 - m, y: R(A.y0 + m, A.y1 - m) }
  if (s === 2) return { x: R(A.x0 + m, A.x1 - m), y: A.y1 - m }
  return { x: A.x0 + m, y: R(A.y0 + m, A.y1 - m) }
}

export class Bug {
  constructor(type, x, y, a, opts = {}) {
    const sp = SPECS[type]
    this.type = type; this.spec = sp
    this.style = opts.style || G.style
    this.x = x; this.y = y; this.a = a; this.ta = a
    this.len = clamp(G.U * sp.len[0], sp.len[1], sp.len[2]) * R(0.88, 1.12)
    const D = diff()
    this.base = sp.speed[this.style - 1] * G.U * R(0.85, 1.15) * (opts.speedMul || 1) * D.speed
    this.v = 0; this.vt = this.base
    this.turn = type === 'roach' ? 9 : type === 'fly' ? 14 : type === 'centipede' ? 3.2 : 6
    this.hp = sp.hp
    this.pad = Math.max(14 * D.pad, this.len * sp.hitK * D.pad)
    this.z = sp.flyer ? 1 : 0
    this.t = R(10); this.phase = R(TAU); this.gait = 0
    this.state = 'alive'
    this.mode = sp.flyer ? 'fly' : type === 'spider' ? 'wait' : 'run'
    this.modeT = R(0.3, 1.2)
    this.target = randIn()
    this.burn = 0; this.poison = 0; this.onFire = false; this.charred = false
    this.slow = 1; this.injured = false
    this.rnd = Array.from({ length: 16 }, () => Math.random())
    this.fed = type === 'mosquito' && Math.random() < 0.35
    this.groom = false
    this.life = opts.life ? opts.life * D.life : Infinity
    this.leaving = false; this.exit = null
    this.zapCd = 0
    this.inside = false
    if (type === 'centipede') {
      const n = 16, s = this.len / n
      this.segs = []
      for (let i = 1; i <= n; i++) this.segs.push({ x: x - Math.cos(a) * s * i, y: y - Math.sin(a) * s * i })
      this.pad = Math.max(14 * D.pad, s * 1.4 * D.pad)
    }
    if (opts.dangle) {
      this.mode = 'dangle'; this.a = Math.PI / 2; this.ta = this.a
      this.stopY = R(G.area.y0 + 60, (G.area.y0 + G.area.y1) / 2)
      this.inside = true
    }
    if (opts.path) { this.path = opts.path; this.pi = 0; this.mode = 'march'; this.wig = R(TAU) }
  }

  points() {
    if (this.type !== 'centipede') return [[this.x, this.y, this.pad]]
    const p = [[this.x, this.y, this.pad]]
    for (let i = 1; i < this.segs.length; i += 2) p.push([this.segs[i].x, this.segs[i].y, this.pad * 0.75])
    return p
  }
  /** 무기 범위(원 또는 돌아간 사각형)에 닿았나 */
  /** 무기 중심에서 몸통까지 거리(사각형 무기는 몸통 중심이 사각형 안이면 0) */
  coreDist(h) {
    let best = Infinity
    for (const [x, y] of this.points()) {
      let d
      if (h.w) {
        const dx = x - h.x, dy = y - h.y, ca = Math.cos(-h.a), sa = Math.sin(-h.a)
        const lx = Math.abs(dx * ca - dy * sa) - h.w / 2, ly = Math.abs(dx * sa + dy * ca) - h.h / 2
        d = Math.hypot(Math.max(0, lx), Math.max(0, ly))
      } else d = Math.hypot(x - h.x, y - h.y)
      if (d < best) best = d
    }
    return best
  }
  /** 상 난이도: 이만큼 가까이 맞아야 제대로 맞은 것 */
  coreR() { return this.type === 'centipede' ? Math.max(10, (this.len / this.segs.length) * 1.2) : Math.max(10, this.len * 0.3) }
  inShape(h) {
    for (const [x, y, pad] of this.points()) {
      if (h.w) {
        const dx = x - h.x, dy = y - h.y, ca = Math.cos(-h.a), sa = Math.sin(-h.a)
        const lx = dx * ca - dy * sa, ly = dx * sa + dy * ca
        if (Math.abs(lx) < h.w / 2 + pad * 0.6 && Math.abs(ly) < h.h / 2 + pad * 0.6) return true
      } else if (Math.hypot(x - h.x, y - h.y) < h.r + pad) return true
    }
    return false
  }

  // ── 주변 반응 ──
  /** 근처에 큰 충격이 오면 놀라서 달아난다 */
  scare(x, y) {
    if (this.state !== 'alive' || this.mode === 'dangle') return
    const away = Math.atan2(this.y - y, this.x - x)
    if (this.type === 'roach') {
      this.mode = 'flee'; this.modeT = R(0.5, 1.1); this.ta = away + R(-0.5, 0.5)
      if (this.style === 3 && Math.random() < 0.12) { this.mode = 'hop'; this.modeT = R(0.5, 0.8) }
    } else if (this.type === 'spider') { this.mode = 'dash'; this.modeT = R(0.3, 0.7); this.ta = away + R(-0.6, 0.6) }
    else if (this.type === 'ant') { this.mode = 'panic'; this.modeT = R(0.8, 1.6); this.ta = away + R(-1, 1) }
    else if (this.type === 'centipede') { this.mode = 'flee'; this.modeT = R(1, 1.8); this.ta = away + R(-0.4, 0.4) }
    else if (this.spec.flyer) { this.takeoff(away) }
  }
  /** 무기가 내려오는 순간: 날벌레·거미는 확률로 피한다 */
  warn(x, y) {
    if (this.state !== 'alive' || this.mode === 'dangle') return
    const p = { mosquito: [0.08, 0.16, 0.24], fly: [0.18, 0.32, 0.45], spider: [0, 0.08, 0.15], roach: [0, 0.05, 0.1] }[this.type]
    if (!p || Math.random() > p[this.style - 1] * diff().dodge * (this.injured ? 0.3 : 1)) return
    const away = Math.atan2(this.y - y, this.x - x) + R(-0.4, 0.4)
    this.a = away; this.ta = away
    this.v = this.base * (this.spec.flyer ? 5 : 3.5)
    if (this.spec.flyer) this.takeoff(away)
    else { this.mode = this.type === 'spider' ? 'dash' : 'flee'; this.modeT = 0.6 }
  }
  takeoff(dir) {
    this.mode = 'fly'; this.modeT = R(0.15, 0.4); this.flyT = 0; this.groom = false
    this.ta = dir; this.a = dir; this.v = Math.max(this.v, this.base * 2.5)
  }

  // ── 매 프레임 ──
  update(dt) {
    this.t += dt
    if (this.zapCd > 0) this.zapCd -= dt
    if (this.state === 'dying') return this.updateDying(dt)
    if (this.state !== 'alive') return
    this.life -= dt
    if (this.life <= 0 && !this.leaving && this.inside) this.leave()

    if (this.leaving) this.aiLeave(dt)
    else this.ai(dt)

    // 독(살충제)
    if (this.poison > 0.25) {
      this.ta += R(-3, 3) * dt * this.poison * 4
      this.vt *= 1 - this.poison * 0.55
      if (this.spec.flyer) this.z = Math.max(0, this.z - dt * this.poison * 0.6)
    }
    this.poison = Math.max(0, this.poison - dt * 0.04)
    // 불
    if (this.burn > 0.25 && !this.onFire) { this.onFire = true; sfx.sizzle(this.x) }
    if (this.onFire) {
      this.burn += dt * 0.5
      this.vt = this.base * 1.5; this.ta += R(-6, 6) * dt
      if (this.spec.flyer) this.z = Math.max(0, this.z - dt * 0.8)
      FX.fireAt(this.x, this.y, 2, this.len * 0.35 + 5, 0.35, this.len * 0.4)
    }
    if (this.burn >= 1) return this.die('burn', 0, { wpn: 'flame' })
    if (this.poison >= 1) return this.die('poison', 0, { wpn: 'spray' })

    this.v = lerp(this.v, this.vt * this.slow, 1 - Math.exp(-dt * 10))
    const d = angDiff(this.a, this.ta)
    this.a += clamp(d, -this.turn * dt, this.turn * dt)
    this.x += Math.cos(this.a) * this.v * dt
    this.y += Math.sin(this.a) * this.v * dt
    this.phase += (this.v * dt) / (this.len * 0.16)
    this.gait = clamp(this.v / (this.base * 0.3), 0, 1)
    if (this.type === 'centipede') this.follow()
    this.bounds()
    if (this.injured && this.z < 0.1 && Math.random() < dt * 6) FX.drip(this.x, this.y, this.goo(), R(1, 2.5) * (G.U / 4))
  }

  ai(dt) {
    this.modeT -= dt
    const T = this.type
    if (this.mode === 'dangle') return this.aiDangle(dt)
    if (T === 'roach') {
      if (this.mode === 'run') {
        this.vt = this.base
        const dx = this.target.x - this.x, dy = this.target.y - this.y
        this.ta = Math.atan2(dy, dx) + Math.sin(this.t * 3) * 0.15
        if (this.modeT <= 0 || dx * dx + dy * dy < 900) {
          if (Math.random() < 0.45) { this.mode = 'stop'; this.modeT = R(0.2, 1.4) }
          else { this.target = Math.random() < 0.55 ? nearEdge() : randIn(); this.modeT = R(0.8, 2.5) }
        }
      } else if (this.mode === 'stop') {
        this.vt = 0
        if (this.modeT <= 0) { this.mode = 'run'; this.target = Math.random() < 0.55 ? nearEdge() : randIn(); this.modeT = R(0.8, 2.5) }
      } else if (this.mode === 'flee') {
        this.vt = this.base * 1.7
        if (this.modeT <= 0) { this.mode = 'run'; this.target = nearEdge() }
      } else if (this.mode === 'hop') { // 날바퀴(리얼 모드)
        this.vt = this.base * 2; this.z = Math.sin(clamp(1 - this.modeT / 0.8, 0, 1) * Math.PI) * 0.9
        if (this.modeT <= 0) { this.z = 0; this.mode = 'run'; this.target = nearEdge() }
      }
    } else if (T === 'mosquito') {
      if (this.mode === 'fly') {
        this.flyT = (this.flyT || 0) + dt
        this.z = lerp(this.z, 0.7 + Math.sin(this.t * 3) * 0.2, 1 - Math.exp(-dt * 4))
        if (this.modeT <= 0) {
          this.modeT = R(0.1, 0.35)
          this.ta += R(-1.3, 1.3)
          if (G.pointer.has && Math.random() < 0.35) this.ta = Math.atan2(G.pointer.y + R(-60, 60) - this.y, G.pointer.x + R(-60, 60) - this.x)
          this.vt = this.base * R(0.6, 1.3)
        }
        if (this.flyT > R(4, 9) && this.inside) { this.mode = 'land'; this.modeT = 0.4 }
      } else if (this.mode === 'land') {
        this.z = Math.max(0, this.z - dt * 2.2); this.vt = this.base * 0.3
        if (this.z <= 0) { this.mode = 'sit'; this.modeT = R(1.5, 4) }
      } else if (this.mode === 'sit') {
        this.vt = 0; this.z = 0
        if (this.modeT <= 0) this.takeoff(R(TAU))
      }
    } else if (T === 'fly') {
      if (this.mode === 'fly') {
        this.flyT = (this.flyT || 0) + dt
        this.z = lerp(this.z, 0.85, 1 - Math.exp(-dt * 5))
        if (this.modeT <= 0) { this.modeT = R(0.15, 0.5); this.ta += R(-2.2, 2.2); this.vt = this.base * R(0.7, 1.3) }
        if (this.flyT > R(2, 5) && this.inside) { this.mode = 'land'; this.modeT = 0.3 }
      } else if (this.mode === 'land') {
        this.z = Math.max(0, this.z - dt * 3); this.vt = this.base * 0.3
        if (this.z <= 0) { this.mode = 'sit'; this.modeT = R(2, 6) }
      } else if (this.mode === 'sit') {
        this.z = 0
        if (Math.random() < dt * 1.2) { this.groom = !this.groom; this.vt = 0 }
        if (!this.groom && Math.random() < dt * 0.8) { this.vt = this.base * 0.12; this.ta += R(-1, 1) }
        if (this.groom) this.vt = 0
        if (this.modeT <= 0) this.takeoff(R(TAU))
      }
    } else if (T === 'ant') {
      if (this.mode === 'march') {
        this.vt = this.base
        const p = this.path[this.pi]
        if (!p) { this.path = [randIn(), randIn(), randIn()]; this.pi = 0; return }
        this.ta = Math.atan2(p.y - this.y, p.x - this.x) + Math.sin(this.t * 8 + this.wig) * 0.35
        if (Math.hypot(p.x - this.x, p.y - this.y) < 14) this.pi++
      } else if (this.mode === 'panic') {
        this.vt = this.base * 1.8; this.ta += R(-4, 4) * dt
        if (this.modeT <= 0) { this.mode = 'march'; this.path = [randIn(), randIn(), randIn(), randIn()]; this.pi = 0 }
      }
    } else if (T === 'spider') {
      if (this.mode === 'wait') {
        this.vt = 0
        if (this.modeT <= 0) { this.mode = 'dash'; this.modeT = R(0.25, 0.7); const p = randIn(); this.ta = Math.atan2(p.y - this.y, p.x - this.x) }
      } else if (this.mode === 'dash') {
        this.vt = this.base * R(0.9, 1.2)
        if (this.modeT <= 0) { this.mode = 'wait'; this.modeT = R(0.8, 3.2) }
      }
    } else if (T === 'centipede') {
      const fast = this.mode === 'flee'
      this.vt = this.base * (fast ? 1.7 : 1)
      if (!fast) {
        const dx = this.target.x - this.x, dy = this.target.y - this.y
        this.ta = Math.atan2(dy, dx) + Math.sin(this.t * 1.6) * 0.5
        if (dx * dx + dy * dy < 1600 || this.modeT <= 0) { this.target = randIn(); this.modeT = R(2, 5) }
      } else if (this.modeT <= 0) { this.mode = 'run'; this.target = randIn() }
    }
  }
  aiDangle(dt) {
    this.vt = 0; this.v = 0
    if (this.y < this.stopY) this.y += dt * G.U * 9
    else {
      this.hang = (this.hang || 0) + dt
      this.y = this.stopY + Math.sin(this.hang * 2) * 4
      if (this.hang > 2.5 + this.rnd[0] * 2) { this.mode = 'wait'; this.modeT = R(0.3, 1) }
    }
    this.x += Math.sin(this.t * 1.3) * dt * 6
    this.a = Math.PI / 2
    this.ta = this.a
  }
  leave() {
    this.leaving = true
    const A = G.area
    const opts = [{ x: -80, y: this.y, d: this.x - A.x0 }, { x: G.W + 80, y: this.y, d: A.x1 - this.x }, { x: this.x, y: -80, d: this.y - A.y0 }, { x: this.x, y: G.H + 80, d: A.y1 - this.y }]
    opts.sort((a, b) => a.d - b.d)
    this.exit = opts[0]
    if (this.mode === 'dangle') this.mode = 'run'
  }
  aiLeave() {
    this.vt = this.base * 1.2
    this.ta = Math.atan2(this.exit.y - this.y, this.exit.x - this.x)
    if (this.spec.flyer) { this.mode = 'fly'; this.z = lerp(this.z, 0.8, 0.05) }
    if (this.x < -60 || this.x > G.W + 60 || this.y < -60 || this.y > G.H + 60) {
      this.state = 'gone'
      G.onEscape && G.onEscape(this)
    }
  }
  bounds() {
    if (this.leaving || this.mode === 'dangle') return
    const A = G.area
    const inside = this.x > A.x0 && this.x < A.x1 && this.y > A.y0 && this.y < A.y1
    if (inside) { this.inside = true; return }
    let tx = clamp(this.x, A.x0 + 50, A.x1 - 50), ty = clamp(this.y, A.y0 + 50, A.y1 - 50)
    this.ta = Math.atan2(ty - this.y, tx - this.x)
    if (this.vt < this.base * 0.5) this.vt = this.base * 0.7
    if (this.type === 'ant' && this.mode === 'march' && this.inside) { this.path = [randIn(), randIn(), randIn()]; this.pi = 0 }
    if (this.mode === 'stop' || this.mode === 'wait') { this.mode = this.type === 'spider' ? 'dash' : 'run'; this.modeT = 0.5; this.target = randIn() }
    if (this.mode === 'sit') this.takeoff(this.ta)
    // 완전히 밖으로 나가 버리지 않게
    this.x = clamp(this.x, -100, G.W + 100); this.y = clamp(this.y, -100, G.H + 100)
  }
  follow() {
    const sp = this.len / this.segs.length
    let px = this.x, py = this.y
    for (const s of this.segs) {
      const dx = s.x - px, dy = s.y - py, d = Math.hypot(dx, dy) || 1
      s.x = px + (dx / d) * sp; s.y = py + (dy / d) * sp
      px = s.x; py = s.y
    }
  }
  goo() {
    if (this.type === 'mosquito' && this.fed) return '#b3121d'
    return this.spec.goo
  }

  // ── 맞았을 때 ──
  damage(dmg, kind, dir, h = {}) {
    if (this.state !== 'alive') return false
    this.hp -= kind === 'zap' ? 99 : dmg
    if (this.hp <= 0) { this.die(kind === 'zap' ? 'zap' : 'squish', dir, h); return true }
    // 버텼다(다쳐서 절뚝이며 체액을 흘린다)
    this.injured = true; this.slow = 0.55
    FX.splat(this.x, this.y, { color: this.goo(), size: this.len * 0.18, style: this.style, type: this.type })
    sfx.crunch(this.x, 3, 0.35)
    if (h.graze) FX.pop('빗맞음!', this.x, this.y - 40, '#ffb0a0', 0.65)
    else if (this.style > 1 && Math.random() < 0.6) FX.pop(pick(['아직 살아있다!', '버텼다!', '질기다…']), this.x, this.y - 40, '#ffe28a', 0.6)
    this.scare(h.x ?? this.x, h.y ?? this.y)
    return false
  }
  die(kind, dir = R(TAU), h = {}) {
    if (this.state !== 'alive') return
    this.state = 'dying'; this.dk = kind; this.dt0 = 0; this.dir = dir; this.h = h
    G.onKill && G.onKill(this, kind, h)
    if (kind === 'squish') { this.bake(); this.state = 'dead'; return }
    if (kind === 'zap') { this.charred = true; this.burn = 1; this.dieDur = this.z > 0.05 ? 0.35 : 0.15; this.z0 = this.z }
    else if (kind === 'burn') { this.dieDur = 0.9; sfx.sizzle(this.x) }
    else if (kind === 'poison') { this.dieDur = R(2.2, 3.2); this.tw = 1 }
  }
  updateDying(dt) {
    this.t += dt
    this.dt0 += dt
    const k = clamp(this.dt0 / this.dieDur, 0, 1)
    if (this.dk === 'zap') {
      this.z = this.z0 * (1 - k)
      if (Math.random() < 0.3) FX.smoke(this.x, this.y, 1, this.len * 0.3)
    } else if (this.dk === 'burn') {
      this.burn = lerp(this.burn, 1, k)
      if (k > 0.6) this.charred = true
      if (this.spec.flyer) this.z = Math.max(0, this.z - dt * 2)
      FX.fireAt(this.x, this.y, 2, (this.len * 0.4 + 6) * (1 - k * 0.6), 0.35, this.len * 0.4)
    } else if (this.dk === 'poison') {
      this.tw = Math.pow(1 - k, 1.4)
      if (this.spec.flyer) this.z = Math.max(0, this.z - dt * 2)
      this.a += Math.sin(this.t * 9) * dt * this.tw * 1.5
      this.phase += dt * 20 * this.tw
    }
    if (this.dt0 >= this.dieDur) { this.bake(); this.state = 'dead' }
  }
  /** 시체를 바닥 자국으로 굳힌다(이후에는 그리기 비용 0) */
  bake() {
    const c = G.ctx.decal
    if (this.dk === 'squish') {
      const big = !!(this.h && this.h.big)
      const col = this.goo()
      const size = this.len * (this.type === 'centipede' ? 0.18 : this.type === 'mosquito' ? (this.fed ? 0.75 : 0.45) : 0.42) * (big ? 1.3 : 1)
      if (this.type === 'centipede') {
        for (let i = 0; i < this.segs.length; i += 3) FX.splat(this.segs[i].x, this.segs[i].y, { color: col, size: size * 1.6, style: this.style, type: this.type, big })
      }
      FX.splat(this.x, this.y, { color: col, size: size * (this.type === 'centipede' ? 2 : 1), dir: this.dir, style: this.style, type: this.type, big })
      this.z = 0
      this.flatDark = this.style === 3 ? 0.3 : this.style === 2 ? 0.18 : 0
      c.globalAlpha = 0.95
      drawBug(c, this, { flat: true, big })
      c.globalAlpha = 1
      if (this.style > 1 && this.type !== 'mosquito' && this.type !== 'ant' && this.type !== 'centipede') {
        // 몸통이 갈라지고 가운데로 체액이 배어 나온다
        c.save(); c.translate(this.x, this.y); c.rotate(this.a + R(-0.5, 0.5))
        c.strokeStyle = col; c.lineWidth = Math.max(1.5, this.len * 0.05); c.lineJoin = 'round'
        c.beginPath(); c.moveTo(-this.len * 0.05, -this.len * 0.22)
        for (let k = 1; k <= 5; k++) c.lineTo(R(-0.07, 0.07) * this.len, (-0.22 + k * 0.088) * this.len)
        c.stroke(); c.restore()
        FX.splat(this.x + R(-0.12, 0.12) * this.len, this.y + R(-0.12, 0.12) * this.len, { color: col, size: size * 0.55, style: this.style, type: this.type })
        // 부서진 껍질 조각
        const P = palette(this)
        for (let k = 0; k < RI(4, 8); k++) {
          const a = R(TAU), d = this.len * R(0.25, 0.7), s = this.len * R(0.04, 0.09)
          c.save(); c.translate(this.x + Math.cos(a) * d, this.y + Math.sin(a) * d); c.rotate(R(TAU))
          c.fillStyle = Math.random() < 0.5 ? P.body : P.dark
          c.beginPath(); c.moveTo(-s, -s * 0.4); c.lineTo(s * 0.8, -s * 0.7); c.lineTo(s, s * 0.5); c.lineTo(-s * 0.5, s * 0.7); c.closePath(); c.fill()
          c.restore()
        }
      }
      if (this.style === 1) FX.stars(this.x, this.y, 7)
      else {
        FX.drops(this.x, this.y, col, big ? 14 : 7, 320 * (G.U / 4), this.dir)
        if (this.style === 3 && this.len > 20) FX.bits(this.x, this.y, this.style === 3 ? '#3a1d0c' : col, RI(1, 3), this.len)
      }
    } else if (this.dk === 'poison') {
      this.tw = 0; this.z = 0
      FX.splat(this.x, this.y, { color: '#d8e6c4', size: this.len * 0.35, style: 2, type: this.type })
      drawBug(c, this, { belly: true, tw: 0 })
    } else {
      this.z = 0; this.charred = true
      FX.scorch(this.x, this.y, this.len * 1.1, 0.35)
      drawBug(c, this, { char: true })
      FX.smoke(this.x, this.y, 8, this.len * 0.4, 1.2)
    }
  }
}

// ── 등장 ──
function edgeStart(m = 50) {
  const A = G.area, s = RI(0, 3)
  if (s === 0) return { x: R(A.x0 + 40, A.x1 - 40), y: A.y0 - m, a: Math.PI / 2 }
  if (s === 1) return { x: A.x1 + m, y: R(A.y0 + 40, A.y1 - 40), a: Math.PI }
  if (s === 2) return { x: R(A.x0 + 40, A.x1 - 40), y: A.y1 + m, a: -Math.PI / 2 }
  return { x: A.x0 - m, y: R(A.y0 + 40, A.y1 - 40), a: 0 }
}

/** 벌레를 화면 가장자리에서 들여보낸다. 개미는 줄지어, 거미는 가끔 위에서 내려온다 */
export function spawn(type, n = 1, opts = {}) {
  const out = []
  if (type === 'ant') {
    const s = edgeStart(30), path = [randIn(), randIn(), randIn(), randIn()]
    if (opts.life) path.push(...[edgeStart(140)].map((p) => ({ x: p.x, y: p.y })))
    for (let i = 0; i < n; i++) {
      const b = new Bug('ant', s.x - Math.cos(s.a) * i * 22 + R(-4, 4), s.y - Math.sin(s.a) * i * 22 + R(-4, 4), s.a, { ...opts, path })
      out.push(b)
    }
  } else {
    for (let i = 0; i < n; i++) {
      let b
      if (type === 'spider' && Math.random() < (opts.dangleChance ?? 0.4)) {
        b = new Bug('spider', R(G.area.x0 + 40, G.area.x1 - 40), -30, Math.PI / 2, { ...opts, dangle: true })
      } else {
        const s = edgeStart(type === 'centipede' ? 30 : 50)
        b = new Bug(type, s.x, s.y, s.a + R(-0.3, 0.3), opts)
      }
      out.push(b)
    }
  }
  G.bugs.push(...out)
  return out
}
