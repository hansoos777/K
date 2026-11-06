// 무기: 톡 치는 무기(tap)는 화면을 누를 때마다 효과 하나가 생기고,
// 누르고 있는 무기(hold)는 손가락을 따라다닌다.
import { G } from './state.js'
import { TAU, R, clamp, lerp, pick, easeIn, easeOut } from './util.js'
import * as FX from './fx.js'
import { SPR } from './fx.js'
import { sfx, loop, vib } from './audio.js'
import { drawHand, drawSwatter, drawRacket, drawSlipper, drawShoe, shoeOutline, drawBook, drawHammer, drawCan, drawFlamer, BOOKS } from './gear.js'

const shadow = (c, x, y, rx, ry, a) => {
  if (a <= 0) return
  c.globalAlpha = a; c.drawImage(SPR.shadow, x - rx, y - ry, rx * 2, ry * 2); c.globalAlpha = 1
}

// ── 손바닥 ──
class Palm {
  constructor(x, y, pid) {
    this.x = x; this.y = y; this.pid = pid; this.t = 0; this.hit = false
    this.S = clamp(G.U * 34, 120, 210)
    this.rot = R(-0.2, 0.2) + (x > G.W / 2 ? 0.18 : -0.18)
    G.warn(x, y, this.S * 0.35)
    sfx.swish(x, 0.15)
  }
  update(dt) {
    this.t += dt
    if (!this.hit && this.t >= 0.06) {
      this.hit = true
      G.strike({ x: this.x, y: this.y, r: this.S * 0.33, dmg: 1.6, air: true, wpn: 'palm' })
      sfx.slap(this.x); G.shake += 6; vib(18)
      FX.pop('찰싹!', this.x, this.y - this.S * 0.45, '#ffd8c2', 0.9, 0.6)
    }
    return this.t < 0.4
  }
  draw(c) {
    const t = this.t, S = this.S
    let sc = 1, al = 1
    if (t < 0.06) sc = lerp(1.55, 1, easeIn(t / 0.06))
    else if (t > 0.22) { const k = (t - 0.22) / 0.18; sc = 1 + k * 0.3; al = 1 - k }
    const off = (sc - 1) * S * 0.35
    shadow(c, this.x + off + 6, this.y + off + 10, S * 0.45, S * 0.5, 0.3 * al)
    c.save(); c.globalAlpha = al; c.translate(this.x - off * 0.3, this.y - off * 0.6); c.rotate(this.rot); c.scale(sc, sc); drawHand(c, S); c.restore()
  }
}

// ── 파리채 / 망치: 손잡이 끝을 축으로 휘두른다 ──
class Swing {
  constructor(x, y, pid, kind) {
    this.x = x; this.y = y; this.pid = pid; this.t = 0; this.hit = false; this.kind = kind
    const right = x < G.W * 0.62
    if (kind === 'swatter') {
      this.S = clamp(G.U * 25, 88, 150); this.len = this.S * 2.9; this.T = 0.075
      this.pa = right ? 1.12 : Math.PI - 1.12; this.from = right ? 1.0 : -1.0
      this.color = pick(['#e2463b', '#2f7de1', '#f0a91d', '#3aa365'])
    } else {
      this.S = clamp(G.U * 17, 62, 104); this.len = this.S * 2.7; this.T = 0.1
      this.pa = right ? 0.95 : Math.PI - 0.95; this.from = right ? 1.15 : -1.15
    }
    this.px = x + Math.cos(this.pa) * this.len; this.py = y + Math.sin(this.pa) * this.len
    G.warn(x, y, this.S * 0.55)
    sfx.swish(x, kind === 'hammer' ? 0.3 : 0.22)
  }
  swingAt(t) {
    if (t < this.T) return this.from * (1 - easeIn(t / this.T))
    if (t < this.T + 0.12) return -this.from * Math.sin(((t - this.T) / 0.12) * Math.PI) * 0.08
    if (t > 0.3) return this.from * easeOut((t - 0.3) / 0.15) * 0.4
    return 0
  }
  update(dt) {
    this.t += dt
    if (!this.hit && this.t >= this.T) {
      this.hit = true
      const { x, y } = this
      if (this.kind === 'swatter') {
        G.strike({ x, y, r: this.S * 0.55, dmg: 1.6, airBonus: 2, air: true, wpn: 'swatter', mesh: this.S * 0.5 })
        sfx.thwack(x); G.shake += 5; vib(15)
        FX.pop('탁!', x, y - this.S * 0.7, '#ffffff', 0.9, 0.55)
      } else {
        G.strike({ x, y, r: this.S * 0.5, dmg: 6, air: true, wpn: 'hammer', big: true })
        FX.crack(x, y, clamp(G.U * 48, 170, 440))
        FX.shards(x, y, 18)
        sfx.glass(x); G.shake += 20; G.flash = 0.35; vib([35, 25, 60])
        FX.pop('와장창!', x, y - this.S * 0.9, '#d6f1ff', 1.15, 0.8)
      }
    }
    return this.t < 0.45
  }
  draw(c) {
    const s = this.swingAt(this.t)
    const al = this.t > 0.3 ? 1 - (this.t - 0.3) / 0.15 : 1
    const sc = 1 + Math.abs(s) * 0.45
    const ghosts = this.t < this.T ? [0.3, 0.15, 0] : [0]
    for (const gk of ghosts) {
      const ss = s + gk * this.from
      c.save()
      c.globalAlpha = al * (gk ? 0.18 : 1)
      c.translate(this.px, this.py); c.rotate(ss); c.translate(-this.px, -this.py)
      if (!gk) shadow(c, this.x + 10 + Math.abs(ss) * 40, this.y + 14 + Math.abs(ss) * 40, this.S * 0.6, this.S * 0.6, 0.25)
      if (this.kind === 'swatter') {
        c.translate(this.x, this.y); c.rotate(this.pa - Math.PI / 2); c.scale(sc, sc)
        drawSwatter(c, this.S, this.color)
      } else {
        c.translate(this.px, this.py); c.rotate(this.pa)
        c.translate(-this.len, 0); c.scale(sc, sc); c.translate(this.len, 0)
        drawHammer(c, this.len, this.S)
      }
      c.restore()
    }
  }
}

// ── 밟기: 꾹 누르고 있으면 비벼 밟는다 ──
class Foot {
  constructor(x, y, pid) {
    this.x = x; this.y = y; this.pid = pid; this.t = 0; this.hit = false; this.held = pid != null
    this.S = clamp(G.U * 50, 170, 310)
    this.rot = R(-0.3, 0.3) + (x / G.W - 0.5) * 0.4
    this.gt = 0; this.smearT = 0; this.lift = -1; this.victims = []
    G.warn(x, y, this.S * 0.3)
  }
  release() { this.held = false }
  update(dt) {
    this.t += dt
    if (!this.hit && this.t >= 0.09) {
      this.hit = true
      const r = G.strike({ x: this.x, y: this.y, w: this.S * 0.42, h: this.S, a: this.rot, dmg: 3.5, air: false, wpn: 'foot' })
      this.victims = r.killed.map((b) => ({ x: b.x, y: b.y, c: b.goo(), len: b.len }))
      sfx.stomp(this.x); if (r.killed.length) sfx.crunch(this.x, 7, 0.55)
      G.shake += 12; vib(40)
      FX.pop('콱!', this.x, this.y - this.S * 0.4, '#ffe9a8', 1, 0.6)
      FX.dust(this.x, this.y, 10, this.S * 0.3, 140 * (G.U / 4))
      if (!r.hit.length && r.air) FX.pop('날고 있으면 못 밟아요', this.x, this.y + this.S * 0.2, '#ffffff', 0.45, 0.9)
    }
    if (this.hit && this.lift < 0) {
      if (this.held && this.t > 0.18 && this.gt < 1.5) {
        this.gt += dt
        this.rot += Math.cos(this.gt * 16) * dt * 2.6
        this.smearT += dt
        if (this.smearT > 0.07) {
          this.smearT = 0
          for (const v of this.victims) FX.smear(v.x, v.y, v.len * 0.9, this.rot + R(-1.2, 1.2), v.c)
          if (this.victims.length) sfx.crunch(this.x, 2, 0.25)
        }
      } else if (this.t > 0.3) {
        this.lift = this.t
        FX.solePrint(this.x, this.y, this.S, this.rot, shoeOutline)
      }
    }
    return !(this.lift >= 0 && this.t - this.lift > 0.18)
  }
  draw(c) {
    const t = this.t, S = this.S
    let sc = 1, al = 1
    if (t < 0.09) sc = lerp(1.7, 1, easeIn(t / 0.09))
    if (this.lift >= 0) { const k = (t - this.lift) / 0.18; sc = 1 + k * 0.35; al = 1 - k }
    const off = (sc - 1) * S * 0.3
    shadow(c, this.x + off + 8, this.y + off + 12, S * 0.32, S * 0.58, 0.35 * al)
    c.save(); c.globalAlpha = al; c.translate(this.x - off * 0.3, this.y - off * 0.5); c.rotate(this.rot); c.scale(sc, sc); drawShoe(c, S); c.restore()
  }
}

// ── 슬리퍼 던지기 ──
class Slipper {
  constructor(x, y, pid) {
    this.x = x; this.y = y; this.pid = pid; this.t = 0; this.hit = false
    this.S = clamp(G.U * 34, 120, 200)
    this.sx = clamp(x + R(-G.W * 0.25, G.W * 0.25), 30, G.W - 30); this.sy = G.H + 60
    const d = Math.hypot(x - this.sx, y - this.sy)
    this.T = 0.13 + d / 4200
    this.dir = Math.atan2(y - this.sy, x - this.sx)
    this.rot0 = R(TAU); this.spin = R(1.6, 2.6) * TAU * (Math.random() < 0.5 ? -1 : 1)
    this.color = pick(['#7fb7e8', '#f29bb3', '#9fd98a', '#f6c35a'])
    this.slide = 0
    G.warn(x, y, this.S * 0.4)
    sfx.throwing(x)
  }
  pos() {
    const k = clamp(this.t / this.T, 0, 1)
    const x = lerp(this.sx, this.x, k) + Math.cos(this.dir) * this.slide
    const y = lerp(this.sy, this.y, k) + Math.sin(this.dir) * this.slide
    return { x, y, k }
  }
  update(dt) {
    this.t += dt
    if (!this.hit && this.t >= this.T) {
      this.hit = true
      G.strike({ x: this.x, y: this.y, r: this.S * 0.32, dmg: 2.4, air: true, wpn: 'slipper' })
      sfx.slap(this.x); G.shake += 7; vib(22)
      FX.pop('퍽!', this.x, this.y - this.S * 0.4, '#ffffff', 1, 0.55)
    }
    if (this.hit) this.slide += (this.S * 0.25 - this.slide) * (1 - Math.exp(-dt * 10))
    return this.t < this.T + 0.9
  }
  draw(c) {
    const { x, y, k } = this.pos()
    const h = Math.sin(Math.PI * k)
    const rot = this.rot0 + this.spin * Math.min(k, 1) + (this.hit ? this.slide * 0.004 : 0)
    const al = this.t > this.T + 0.65 ? 1 - (this.t - this.T - 0.65) / 0.25 : 1
    shadow(c, x + h * 50, y + h * 70, this.S * 0.3, this.S * 0.5, 0.3 * al * (1 - h * 0.5))
    c.save(); c.globalAlpha = al; c.translate(x, y); c.rotate(rot); c.scale(1 + h * 0.7, 1 + h * 0.7); drawSlipper(c, this.S, this.color); c.restore()
  }
}

// ── 두꺼운 책 ──
class Book {
  constructor(x, y, pid) {
    this.x = x; this.y = y; this.pid = pid; this.t = 0; this.hit = false
    this.w = clamp(G.U * 46, 170, 320); this.h = this.w * 1.32
    this.a = R(-0.4, 0.4)
    const [title, cover] = pick(BOOKS); this.title = title; this.cover = cover
    G.warn(x, y, this.w * 0.6)
    sfx.swish(x, 0.3)
  }
  update(dt) {
    this.t += dt
    if (!this.hit && this.t >= 0.12) {
      this.hit = true
      G.strike({ x: this.x, y: this.y, w: this.w, h: this.h, a: this.a, dmg: 4, air: true, wpn: 'book' })
      sfx.thud(this.x); G.shake += 16; vib(50)
      const ca = Math.cos(this.a), sa = Math.sin(this.a)
      for (let i = 0; i < 34; i++) {
        const u = R(-0.5, 0.5), side = Math.floor(R(4))
        const lx = side < 2 ? u * this.w : (side === 2 ? -0.5 : 0.5) * this.w
        const ly = side < 2 ? (side === 0 ? -0.5 : 0.5) * this.h : u * this.h
        const px = this.x + lx * ca - ly * sa, py = this.y + lx * sa + ly * ca
        FX.dust(px, py, 1, 4, 260 * (G.U / 4))
      }
      FX.pop('쾅!', this.x, this.y - this.h * 0.55, '#ffd23f', 1.3, 0.7)
    }
    return this.t < 0.85
  }
  draw(c) {
    const t = this.t
    let sc = 1, al = 1
    if (t < 0.12) sc = lerp(1.8, 1, easeIn(t / 0.12))
    else if (t > 0.65) { const k = (t - 0.65) / 0.2; sc = 1 + k * 0.25; al = 1 - k }
    const off = (sc - 1) * this.w * 0.3
    shadow(c, this.x + off + 10, this.y + off + 16, this.w * 0.62 * sc, this.h * 0.6 * sc, 0.4 * al)
    c.save(); c.globalAlpha = al; c.translate(this.x - off * 0.3, this.y - off * 0.5); c.rotate(this.a); c.scale(sc, sc); drawBook(c, this.w, this.h, this.cover, this.title); c.restore()
  }
}

// ── 누르고 있는 무기 ──
const racket = {
  on: false, x: 0, y: 0, S: 0, glow: 0, tilt: 0, lx: 0,
  down(x, y) { this.on = true; this.x = this.lx = x; this.y = y; this.S = clamp(G.U * 30, 110, 180); sfx.swish(x, 0.2) },
  move(x, y) { this.tilt = clamp((x - this.lx) * 0.01, -0.4, 0.4); this.lx = this.x; this.x = x; this.y = y },
  up() { this.on = false },
  update(dt) {
    this.glow = Math.max(0, this.glow - dt * 5)
    this.tilt *= Math.exp(-dt * 6)
    loop('hum', this.on ? 1 : 0)
    if (!this.on) return
    const rx = this.S * 0.5, ry = this.S * 0.6
    for (const b of G.bugs) {
      if (b.state !== 'alive' || b.zapCd > 0) continue
      const hit = b.points().some(([x, y, pad]) => ((x - this.x) / (rx + pad * 0.5)) ** 2 + ((y - this.y) / (ry + pad * 0.5)) ** 2 < 1)
      if (!hit) continue
      b.zapCd = 0.2
      G.strike({ x: b.x, y: b.y, r: 1, dmg: 99, kind: 'zap', air: true, wpn: 'racket', only: b })
      for (let i = 0; i < 4; i++) { const a = R(TAU); FX.arc(b.x, b.y, this.x + Math.cos(a) * rx, this.y + Math.sin(a) * ry) }
      FX.sparks(b.x, b.y, 16)
      this.glow = 1; G.shake += 3; G.flash = Math.max(G.flash, 0.12)
      sfx.zap(b.x); vib(25)
      FX.pop(pick(['파지직!', '타닥!', '지지직!']), b.x, b.y - 50, '#bfe6ff', 0.9, 0.6)
    }
  },
  draw(c) {
    if (!this.on) return
    c.save(); c.translate(this.x, this.y); c.rotate(this.tilt)
    if (this.glow > 0) { c.globalCompositeOperation = 'lighter'; c.globalAlpha = this.glow * 0.6; c.drawImage(SPR.blue, -this.S, -this.S, this.S * 2, this.S * 2); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over' }
    drawRacket(c, this.S, this.glow, true)
    c.restore()
  },
}

const spray = {
  on: false, x: 0, y: 0, acc: 0,
  nozzle() { const k = G.U / 4; return { x: this.x + 46 * k, y: this.y + 62 * k } },
  down(x, y) { this.on = true; this.x = x; this.y = y },
  move(x, y) { this.x = x; this.y = y },
  up() { this.on = false },
  update(dt) {
    loop('hiss', this.on ? 1 : 0, this.x)
    if (!this.on) return
    const n = this.nozzle(), d = Math.atan2(this.y - n.y, this.x - n.x)
    this.acc += dt * 110
    while (this.acc >= 1) {
      this.acc -= 1
      if (G.mist.length > 420) break
      const a = d + R(-0.28, 0.28), v = R(330, 560) * (G.U / 4)
      G.mist.push({ x: n.x, y: n.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 4, age: 0, life: R(1.1, 1.7) })
    }
    if (Math.random() < dt * 3) FX.pop('칙~', this.x + R(-30, 30), this.y - 40, '#e6ffd6', 0.55, 0.5)
  },
  draw(c) {
    if (!this.on) return
    const n = this.nozzle(), d = Math.atan2(this.y - n.y, this.x - n.x)
    const S = clamp(G.U * 26, 90, 150)
    c.save(); c.translate(n.x, n.y); c.rotate(d + Math.PI / 2); c.translate(0, S * 0.62); drawCan(c, S); c.restore()
  },
}

const flame = {
  on: false, x: 0, y: 0, acc: 0, gacc: 0,
  gun() {
    const bx = clamp(G.W * 0.5 + (this.x - G.W * 0.5) * 0.35, 40, G.W - 40), by = G.H + 40
    const d = Math.atan2(this.y - by, this.x - bx), L = (G.H - G.area.y1) + 70
    return { bx, by, d, tx: bx + Math.cos(d) * L, ty: by + Math.sin(d) * L }
  },
  down(x, y) { this.on = true; this.x = x; this.y = y },
  move(x, y) { this.x = x; this.y = y },
  up() { this.on = false },
  update(dt) {
    loop('flame', this.on ? 1 : 0, this.x)
    if (!this.on) return
    const g = this.gun()
    const D = Math.max(40, Math.hypot(this.x - g.tx, this.y - g.ty))
    const reach = 0.3, sp = D / reach
    this.acc += dt * 280
    while (this.acc >= 1) {
      this.acc -= 1
      if (G.fire.length > 900) break
      const a = g.d + R(-0.06, 0.06), v = sp * R(0.85, 1.1)
      G.fire.push({ x: g.tx, y: g.ty, vx: Math.cos(a) * v, vy: Math.sin(a) * v, age: 0, life: R(0.45, 0.72), r: R(7, 12) * (G.U / 4), reach: reach * R(0.75, 1.05), grow: 110 * (G.U / 4), hot: true })
    }
    this.gacc += dt
    if (this.gacc > 0.05) {
      this.gacc = 0
      if (G.grounds.length < 45) G.grounds.push({ x: this.x + R(-20, 20) * (G.U / 4), y: this.y + R(-20, 20) * (G.U / 4), life: R(1, 2.2), age: 0, r: R(8, 18) * (G.U / 4) })
      FX.scorch(this.x + R(-12, 12), this.y + R(-12, 12), R(16, 30) * (G.U / 4), 0.05)
    }
    if (Math.random() < 0.35) sfx.crackle(this.x)
    if (Math.random() < dt * 2) FX.pop('화르륵!', this.x + R(-40, 40), this.y - 60, '#ffb347', 0.8, 0.6)
  },
  draw(c) {
    if (!this.on) return
    const g = this.gun()
    c.globalCompositeOperation = 'lighter'
    const r = clamp(G.U * 40, 140, 320)
    c.globalAlpha = 0.22; c.drawImage(SPR.glow, this.x - r, this.y - r, r * 2, r * 2)
    c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'
    const S = clamp(G.U * 30, 110, 170)
    c.save(); c.translate(g.tx, g.ty); c.rotate(g.d + Math.PI / 2); drawFlamer(c, S, G.t); c.restore()
  },
}

// ── 무기 목록 ──
const icon = (fn) => fn
export const WEAPONS = [
  { id: 'palm', name: '손바닥', kind: 'tap', cd: 0.1, make: (x, y, p) => new Palm(x, y, p), hint: '톡 쳐서 찰싹! 빠르게 여러 번 칠 수 있어요.',
    icon: icon((c, s) => { c.translate(s / 2, s * 0.56); drawHand(c, s * 0.72) }) },
  { id: 'swatter', name: '파리채', kind: 'tap', cd: 0.18, make: (x, y, p) => new Swing(x, y, p, 'swatter'), hint: '날아다니는 모기·파리에 두 배로 세요.',
    icon: icon((c, s) => { c.translate(s * 0.42, s * 0.3); c.rotate(-0.5); drawSwatter(c, s * 0.36, '#e2463b') }) },
  { id: 'racket', name: '전기채', kind: 'hold', obj: racket, hint: '누른 채로 휘둘러요. 그물에 닿는 벌레는 지지직!',
    icon: icon((c, s) => { c.translate(s * 0.44, s * 0.38); c.rotate(-0.45); drawRacket(c, s * 0.46, 0.6) }) },
  { id: 'slipper', name: '슬리퍼', kind: 'tap', cd: 0.22, make: (x, y, p) => new Slipper(x, y, p), hint: '던져요! 날아가는 동안 벌레가 움직이니 앞을 노려요.',
    icon: icon((c, s) => { c.translate(s / 2, s / 2); c.rotate(0.6); drawSlipper(c, s * 0.8, '#7fb7e8') }) },
  { id: 'foot', name: '밟기', kind: 'tap', cd: 0.25, make: (x, y, p) => new Foot(x, y, p), hint: '꾹 누르고 있으면 비벼 밟아요. 날고 있는 벌레는 못 밟아요.',
    icon: icon((c, s) => { c.translate(s / 2, s / 2); c.rotate(0.35); drawShoe(c, s * 0.86) }) },
  { id: 'book', name: '두꺼운 책', kind: 'tap', cd: 0.55, make: (x, y, p) => new Book(x, y, p), hint: '넓게 한 방에 쾅. 느리지만 여러 마리를 잡아요.',
    icon: icon((c, s) => { c.translate(s / 2, s / 2); c.rotate(-0.2); drawBook(c, s * 0.58, s * 0.76, '#7a1f2b', '사전') }) },
  { id: 'hammer', name: '망치', kind: 'tap', cd: 0.3, make: (x, y, p) => new Swing(x, y, p, 'hammer'), hint: '가장 강력해요. 대신 화면 유리가 깨져요.',
    icon: icon((c, s) => { c.translate(s * 0.86, s * 0.82); c.rotate(-2.4); drawHammer(c, s * 0.78, s * 0.36) }) },
  { id: 'spray', name: '살충제', kind: 'hold', obj: spray, hint: '누른 채로 뿌려요. 뒤집혀 버둥대다 조용해져요.',
    icon: icon((c, s) => { c.translate(s / 2, s / 2); c.rotate(0.4); drawCan(c, s * 0.78) }) },
  { id: 'flame', name: '화염방사기', kind: 'hold', obj: flame, hint: '누른 채로 끌어서 태워요. 바닥에 불이 남아요.',
    icon: icon((c, s) => {
      c.save(); c.translate(s * 0.38, s * 0.42); c.rotate(0.6); drawFlamer(c, s * 0.5, 0); c.restore()
      const g = c.createRadialGradient(s * 0.6, s * 0.28, 0, s * 0.6, s * 0.28, s * 0.3)
      g.addColorStop(0, '#fff3b0'); g.addColorStop(0.4, '#ff9a2a'); g.addColorStop(1, 'rgba(230,60,20,0)')
      c.fillStyle = g; c.fillRect(0, 0, s, s)
    }) },
]
export const byId = Object.fromEntries(WEAPONS.map((w) => [w.id, w]))
export const holds = [racket, spray, flame]
export function stopHolds() { for (const h of holds) h.up() }
