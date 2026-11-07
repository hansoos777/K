import * as THREE from 'three'
import type { BuildCtx, Layout } from '../../engine/stage'
import { LOOKS } from '../../engine/avatar'
import { archFrame, box, cyl, glassWindow, gold, halo, hanokRoof, lotusLantern, pointedArch, ridge, roundArch, sky, std } from '../../engine/props'
import { blob, dancheong, glow, marble, roseWindow, stainedGlass, stone as stoneTex } from '../../engine/tex'
import { go } from '../../core/router'

/**
 * 믿어보까 광장: 모든 종교 공간으로 이어지는 공통 월드.
 * 광장 자체는 특정 종교를 상징하지 않는다(빛의 분수·꽃나무·등불·별하늘만).
 * 분위기: 해 질 녘의 은은한 빛, 떠다니는 빛 알갱이, 하늘에서 내려오는 빛기둥 → 성스럽고 조금 환상적으로.
 * 앞쪽 반원에 네 종교의 대형 입구가 같은 크기 비율로 서 있고, 문으로 걸어 들어가면 그 종교 공간이 열린다.
 */
export type GateId = 'christian' | 'catholic' | 'temple' | 'mandir'
export interface Gate { id: GateId; to: string; label: string; x: number; z: number; rot: number; door: [number, number]; front: [number, number] }

/** 문을 지나면 들어갈 공간 */
export const GATE_TO: Record<GateId, string> = { christian: 'christian/traditional', catholic: 'catholic/gothic', temple: 'temple/courtyard', mandir: 'mandir/mandir' }
const R = 27
const ANG: Record<GateId, number> = { christian: -56, catholic: -19, temple: 19, mandir: 56 }

/** 광장 위의 문 위치 (화면 쪽 동작 버튼에서도 씀) */
export function gates(labels: Record<GateId, string>): Gate[] {
  return (Object.keys(ANG) as GateId[]).map((id) => {
    const a = (ANG[id] * Math.PI) / 180
    const x = Math.sin(a) * R, z = -Math.cos(a) * R
    const rot = Math.atan2(-x, -z) // 건물 정면(+z)이 광장 가운데를 보게
    const dx = Math.sin(rot), dz = Math.cos(rot)
    const depth = id === 'temple' ? 0.6 : 7
    return { id, to: GATE_TO[id], label: labels[id], x, z, rot, door: [x + dx * depth, z + dz * depth], front: [x + dx * (depth + 4), z + dz * (depth + 4)] }
  })
}

const lambert = (o: THREE.MeshLambertMaterialParameters) => new THREE.MeshLambertMaterial(o)
const basic = (color: string | THREE.Color, o: THREE.MeshBasicMaterialParameters = {}) => new THREE.MeshBasicMaterial({ color, ...o })
/** 빛처럼 더해지는 재질 (문 안쪽 빛, 빛기둥) */
const additive = (o: THREE.MeshBasicMaterialParameters) => new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, ...o })

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, color = true) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  draw(c.getContext('2d')!)
  const t = new THREE.CanvasTexture(c)
  if (color) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

/** 문 위 현판: 반투명 짙은 바탕 + 금빛 테두리와 글씨 */
function sign(text: string, sub: string, w = 6) {
  const map = canvasTex(1024, 256, (g) => {
    g.fillStyle = 'rgba(46,34,30,0.72)'
    g.beginPath()
    g.roundRect(10, 10, 1004, 236, 36)
    g.fill()
    g.strokeStyle = 'rgba(231,201,140,0.9)'
    g.lineWidth = 5
    g.beginPath()
    g.roundRect(26, 26, 972, 204, 26)
    g.stroke()
    g.textAlign = 'center'
    g.fillStyle = '#fbf1de'
    g.font = '700 88px "LINE Seed Sans KR", "Apple SD Gothic Neo", sans-serif'
    g.fillText(text, 512, 132)
    g.fillStyle = '#e7c98c'
    g.font = '400 44px "LINE Seed Sans KR", "Apple SD Gothic Neo", sans-serif'
    g.fillText(sub, 512, 198)
  })
  return new THREE.Mesh(new THREE.PlaneGeometry(w, w / 4), new THREE.MeshBasicMaterial({ map, transparent: true }))
}

/** 가운데가 뾰족한 박공 지붕 */
function gable(w: number, h: number, d: number, mat: THREE.Material) {
  const s = new THREE.Shape()
  s.moveTo(-w / 2, 0)
  s.lineTo(0, h)
  s.lineTo(w / 2, 0)
  s.closePath()
  const geo = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false })
  geo.translate(0, 0, -d / 2)
  return new THREE.Mesh(geo, mat)
}

/** 문 안쪽에서 새어 나오는 빛: 문 모양 빛판 + 번짐. 반환값으로 밝기를 천천히 바꿈 */
function portal(shape: THREE.Shape, color: string, z: number, y = 0) {
  const g = new THREE.Group()
  const geo = new THREE.ShapeGeometry(shape, 16)
  geo.computeBoundingBox()
  const bb = geo.boundingBox!
  const mat = additive({ color, opacity: 0.7 })
  const m = new THREE.Mesh(geo, mat)
  m.position.set(0, y, z + 0.02)
  // 문 안쪽: 벽 무늬가 비치지 않게 따뜻한 빛 색 바탕
  const back = new THREE.Mesh(geo, basic(new THREE.Color(color).multiplyScalar(0.78).getStyle()))
  back.position.set(0, y, z)
  g.add(back)
  const h = halo(color, Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y) * 1.6, 0.45)
  h.position.set(0, y + (bb.max.y - bb.min.y) * 0.45, z + 0.4)
  g.add(m, h)
  return { g, set: (k: number) => { mat.opacity = 0.5 + k * 0.25; h.material.opacity = 0.18 + k * 0.14 } }
}

/** 따뜻하게 빛나는 창 (안에 불이 켜진 것처럼) */
function litWindow(shape: THREE.Shape, color = '#ffd9a0') {
  return new THREE.Mesh(new THREE.ShapeGeometry(shape, 12), basic(color))
}

function circleShape(r: number) {
  const s = new THREE.Shape()
  s.absarc(0, 0, r, 0, Math.PI * 2, false)
  return s
}

type Built = { g: THREE.Group; pulse: (k: number) => void }

/** 개신교 교회: 흰 회벽, 박공지붕, 종탑과 빈 십자가, 따뜻한 창 */
function church(): Built {
  const g = new THREE.Group()
  const wall = std('#f4eee3', { map: marble('#f4eee3', '#e2d8c6', [1, 1]) }), roof = std('#7a4636'), trim = std('#d9cdb8')
  g.add(box(10, 8, 13, wall, 0, 0, -1.5), gable(10.8, 4.2, 13.6, roof).translateY(8).translateZ(-1.5))
  g.add(box(10.6, 0.4, 13.6, trim, 0, 7.8, -1.5))
  // 종탑
  g.add(box(3.6, 14, 3.6, wall, 0, 0, 4.4), box(4, 0.4, 4, trim, 0, 9, 4.4), box(4, 0.4, 4, trim, 0, 14, 4.4))
  const bell = new THREE.Group()
  for (const r of [0, Math.PI / 2, Math.PI, -Math.PI / 2]) {
    const o = litWindow(roundArch(1.4, 2.6), '#ffe6b8')
    o.position.set(Math.sin(r) * 1.81, 10.6, 4.4 + Math.cos(r) * 1.81)
    o.rotation.y = r
    bell.add(o)
  }
  g.add(bell, cyl(0.01, 2.7, 6.5, roof, 0, 14.4, 4.4, 4).rotateY(Math.PI / 4))
  const c = new THREE.Group()
  c.add(box(0.22, 2.6, 0.22, gold()), box(1.4, 0.22, 0.22, gold(), 0, 1.6, 0))
  c.position.set(0, 20.9, 4.4)
  const ch = halo('#ffe8b8', 3, 0.35)
  ch.position.set(0, 22.4, 4.4)
  g.add(c, ch)
  // 계단과 문
  g.add(box(5, 0.25, 2.4, trim, 0, 0, 7.2), box(4, 0.25, 1.4, trim, 0, 0.25, 6.7))
  const door = roundArch(2.2, 3.6)
  const fr = archFrame(door, std('#8a6a4a'), 0.2, 0.22)
  fr.position.set(0, 0.5, 6.2)
  const p = portal(door, '#ffdca0', 6.25, 0.5)
  g.add(fr, p.g)
  // 창
  for (const x of [-3.2, 3.2]) { const w = litWindow(roundArch(1.2, 3)); w.position.set(x, 3, 5.06); g.add(w) }
  for (const z of [-6.5, -3.5, -0.5, 2.5]) for (const sd of [-1, 1]) { const w = litWindow(roundArch(1.1, 3)); w.position.set(sd * 5.06, 2.6, z); w.rotation.y = sd * Math.PI / 2; g.add(w) }
  return { g, pulse: p.set }
}

/** 천주교 고딕 대성당: 두 탑, 장미창, 뾰족 아치 문, 첨탑 장식 */
function cathedral(): Built {
  const g = new THREE.Group()
  const st = std('#ddd0b8', { map: stoneTex('#ddd0b8', [3, 4]) }), stTower = std('#ddd0b8', { map: stoneTex('#ddd0b8', [1, 5]) }), slate = std('#4c4a5c'), trim = std('#cfc1a6')
  g.add(box(14, 17, 14, st, 0, 0, -2), gable(14.6, 6, 14.4, slate).translateY(17).translateZ(-2))
  for (const sd of [-1, 1]) {
    g.add(box(4.6, 25, 4.6, stTower, sd * 6.4, 0, 4.4))
    for (const y of [9.4, 17.5, 25]) g.add(box(5, 0.45, 5, trim, sd * 6.4, y - 0.2, 4.4))
    g.add(cyl(0.01, 3.4, 10, slate, sd * 6.4, 25, 4.4, 4).rotateY(Math.PI / 4))
    for (const cx of [-1, 1]) for (const cz of [-1, 1]) g.add(cyl(0.01, 0.35, 2.2, trim, sd * 6.4 + cx * 2.1, 25, 4.4 + cz * 2.1, 6))
    const cr = new THREE.Group()
    cr.add(box(0.18, 1.8, 0.18, gold()), box(1, 0.18, 0.18, gold(), 0, 1.1, 0))
    cr.position.set(sd * 6.4, 35, 4.4)
    g.add(cr)
    // 탑의 긴 색유리 창
    for (const y of [11, 18.6]) {
      const w = glassWindow(pointedArch(1.4, 4.6), stainedGlass(sd + y, ['#b5213b', '#2a5db0', '#e3b341', '#7a3c98']), 1.3)
      w.position.set(sd * 6.4, y, 6.72)
      g.add(w)
    }
  }
  // 장미창
  const rose = glassWindow(circleShape(2.9), roseWindow(2), 1.35)
  rose.position.set(0, 13.4, 5.04)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(3, 0.26, 10, 48), trim)
  ring.position.set(0, 13.4, 5.1)
  const rh = halo('#ffd6e8', 8, 0.18)
  rh.position.set(0, 13.4, 5.6)
  g.add(rose, ring, rh)
  // 갤러리 띠와 작은 아치
  g.add(box(14, 0.5, 0.7, trim, 0, 9.2, 5))
  for (let i = 0; i < 6; i++) { const a = litWindow(pointedArch(0.7, 1.8), '#e9c98c'); a.position.set(-3.5 + i * 1.4, 9.8, 5.02); g.add(a) }
  // 뾰족 아치 정문: 여러 겹 테두리
  const door = pointedArch(3.4, 6.2)
  for (let k = 0; k < 3; k++) {
    const f = archFrame(pointedArch(3.4 + k * 0.7, 6.2 + k * 0.5), trim, 0.25, 0.25)
    f.position.set(0, 0, 5 + 0.06 * (3 - k))
    g.add(f)
  }
  const p = portal(door, '#ffd08a', 5.05)
  g.add(p.g, box(8, 0.3, 2.4, trim, 0, 0, 6.2))
  return { g, pulse: p.set }
}

/** 불교 사찰: 일주문(기둥 한 줄 + 단청 + 기와지붕 + 연등), 뒤로 법당 */
function temple(ctx: BuildCtx): Built {
  const g = new THREE.Group()
  const red = std('#8a2a1c'), dc = std('#ffffff', { map: dancheong() }), tile = std('#3b4047'), stone = std('#cfc6b4', { map: stoneTex('#cfc6b4', [3, 1]) })
  g.add(box(12, 0.5, 4.4, stone, 0, 0, 0), box(9, 0.25, 5.4, stone, 0, 0, 0))
  for (const x of [-3, 3]) g.add(cyl(0.4, 0.44, 5.4, red, x, 0.5, 0, 16), cyl(0.62, 0.66, 0.4, stone, x, 0.5, 0, 16))
  g.add(box(8.8, 0.7, 1.1, dc, 0, 5.3, 0), box(9.4, 0.4, 1.4, dc, 0, 6, 0))
  const roof = hanokRoof(11.5, 4.4, 2, tile, 0.8)
  roof.position.y = 6.35
  g.add(roof)
  // 기둥 사이 은은한 빛 휘장
  const veil = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 4.8), additive({ map: glow('#ffe2b0'), opacity: 0.55 }))
  veil.position.set(0, 3, 0)
  g.add(veil)
  // 연등 (흔들림)
  const lanterns: THREE.Object3D[] = []
  ;['#f4a6b8', '#ffd27a', '#f4a6b8'].forEach((c, i) => {
    const l = lotusLantern(c)
    l.position.set(-2 + i * 2, 4.4, 0.2)
    l.scale.setScalar(1.6)
    g.add(l, box(0.02, 0.7, 0.02, std('#3a2a1a'), -2 + i * 2, 4.7, 0.2))
    lanterns.push(l)
  })
  ctx.every((t) => lanterns.forEach((l, i) => { l.rotation.z = Math.sin(t * 0.9 + i) * 0.06 }))
  // 석등 한 쌍
  const lampS = std('#cfc6b4')
  for (const x of [-5.2, 5.2]) {
    const stone = lampS
    g.add(cyl(0.5, 0.6, 0.4, stone, x, 0, 3, 8), cyl(0.16, 0.2, 1.4, stone, x, 0.4, 3, 8), box(0.8, 0.7, 0.8, stone, x, 1.8, 3), cyl(0.01, 0.75, 0.5, stone, x, 2.5, 3, 4))
    const f = halo('#ffd49a', 1.6, 0.7)
    f.position.set(x, 2.15, 3)
    g.add(f)
  }
  // 뒤쪽 법당
  g.add(box(17, 1, 10, stone, 0, 0, -10), box(14, 5, 7, std('#efe1c4'), 0, 1, -10))
  for (const x of [-6, -2, 2, 6]) g.add(cyl(0.34, 0.36, 5, red, x, 1, -6.4, 12))
  for (const x of [-4, 0, 4]) { const w = litWindow(new THREE.Shape([new THREE.Vector2(-1.2, 0), new THREE.Vector2(1.2, 0), new THREE.Vector2(1.2, 3.2), new THREE.Vector2(-1.2, 3.2)]), '#ffd99a'); w.position.set(x, 1.3, -6.48); g.add(w) }
  const hall = hanokRoof(18, 11, 3.6, tile, 1)
  hall.position.set(0, 6.2, -10)
  g.add(hall, box(15, 0.8, 0.8, dc, 0, 5.6, -6.4))
  return { g, pulse: (k) => { veil.material.opacity = 0.35 + k * 0.25 } }
}

/** 힌두 사원: 층층이 줄어드는 고푸람(탑문), 감실 조각, 금빛 칼라샤, 디야 불빛 */
function gopuram(): Built {
  const g = new THREE.Group()
  const tiers = ['#d9a86a', '#e6bf84', '#d49a62', '#e9c891', '#d6a26b', '#ecd29e', '#dcae74']
  const accents = ['#c4557a', '#3f9a95', '#d86a5a', '#5a7fc4', '#e2a24c']
  const base = std('#d9ab70', { map: marble('#d9ab70', '#c08a52', [2, 1]) })
  g.add(box(12.6, 0.5, 8, std('#cdbb9a'), 0, 0, 0.6), box(12, 6, 7, base, 0, 0.5, 0))
  for (const x of [-4.4, -2.6, 2.6, 4.4]) g.add(cyl(0.3, 0.34, 5.4, std('#e8cf9e'), x, 0.5, 3.8, 12))
  g.add(box(12, 0.5, 1.6, std('#e8cf9e'), 0, 5.9, 3.6))
  const door = roundArch(2.8, 4.6)
  const fr = archFrame(door, gold(), 0.2, 0.2)
  fr.position.set(0, 0.5, 3.5)
  const p = portal(door, '#ffc27a', 3.55, 0.5)
  g.add(fr, p.g)
  let y = 6.5
  for (let i = 0; i < 7; i++) {
    const w = 11 - i * 1.15, d = 6.4 - i * 0.6, h = 1.9
    g.add(box(w, h, d, std(tiers[i]), 0, y, 0), box(w + 0.3, 0.22, d + 0.3, std('#f1dcb0'), 0, y + h - 0.1, 0))
    const n = Math.max(2, Math.floor(w / 1.5))
    for (let k = 0; k < n; k++) {
      const x = -w / 2 + 0.75 + (k * (w - 1.5)) / Math.max(1, n - 1)
      g.add(box(0.6, 1.05, 0.12, std('#6a3a22'), x, y + 0.35, d / 2 + 0.04), box(0.38, 0.78, 0.16, std(accents[(i + k) % accents.length]), x, y + 0.45, d / 2 + 0.08))
    }
    y += h
  }
  const crown = cyl(0.9, 1.6, 1.4, std('#e0b27a'), 0, y, 0, 12)
  crown.scale.set(1.4, 1, 0.7)
  g.add(crown)
  for (const x of [-1.4, -0.7, 0, 0.7, 1.4]) g.add(cyl(0.05, 0.22, 1.1, gold(), x, y + 1.3, 0, 10))
  const top = halo('#ffd890', 4, 0.35)
  top.position.set(0, y + 2, 0)
  g.add(top)
  // 앞의 디야 줄
  for (let i = 0; i < 9; i++) {
    const x = -4.8 + i * 1.2
    g.add(cyl(0.12, 0.08, 0.1, std('#b06a3a'), x, 0.5, 4.7, 8))
    const f = halo('#ffb860', 0.9, 0.8)
    f.position.set(x, 0.72, 4.7)
    g.add(f)
  }
  return { g, pulse: p.set }
}

/** 꽃나무: 연분홍·흰 꽃구름 */
function blossom(x: number, z: number, s: number, pink: boolean, shadow: THREE.Material) {
  const g = new THREE.Group()
  g.add(cyl(0.14 * s, 0.24 * s, 2.6 * s, std('#5a4036'), 0, 0, 0, 8))
  const a = std(pink ? '#f2c4cf' : '#f6e9ec', { flatShading: true }), b = std(pink ? '#e9adbd' : '#efd9df', { flatShading: true })
  for (const [dx, dy, dz, r, m] of [[0, 3.3, 0, 1.6, a], [0.9, 2.8, 0.3, 1.1, b], [-0.8, 2.9, -0.4, 1.15, a], [0.1, 4.1, 0.2, 1.05, b], [-0.3, 3.4, 0.9, 0.9, b]] as const) {
    const o = new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), m)
    o.position.set(dx * s, dy * s, dz * s)
    g.add(o)
  }
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(4.6 * s, 4.6 * s), shadow)
  sh.rotation.x = -Math.PI / 2
  sh.position.y = 0.03
  g.add(sh)
  g.position.set(x, 0, z)
  return g
}

/** 사이프러스: 어두운 세로 실루엣으로 화면을 정돈 */
function cypress(x: number, z: number, h: number) {
  const g = new THREE.Group()
  const m = new THREE.Mesh(new THREE.SphereGeometry(1, 10, 12), std('#4d6658', { flatShading: true }))
  m.scale.set(0.9, h / 2, 0.9)
  m.position.y = h / 2 + 0.3
  g.add(m)
  g.position.set(x, 0, z)
  return g
}

function bench(x: number, z: number, rot: number, mat: THREE.Material, shadow: THREE.Material) {
  const g = new THREE.Group()
  g.add(box(2.2, 0.16, 0.6, mat, 0, 0.42, 0), box(0.4, 0.42, 0.5, mat, -0.8, 0, 0), box(0.4, 0.42, 0.5, mat, 0.8, 0, 0))
  const sh = new THREE.Mesh(new THREE.PlaneGeometry(3, 1.3), shadow)
  sh.rotation.x = -Math.PI / 2
  sh.position.y = 0.03
  g.add(sh)
  g.position.set(x, 0, z)
  g.rotation.y = rot
  return g
}

/** 돌기둥 위에 떠 있는 빛 구슬 (가로등 대신) */
function lantern(x: number, z: number, mat: THREE.Material, orbs: THREE.Object3D[]) {
  const g = new THREE.Group()
  g.add(cyl(0.32, 0.4, 0.3, mat, 0, 0, 0, 8), cyl(0.14, 0.18, 2.3, mat, 0, 0.3, 0, 8), cyl(0.34, 0.2, 0.3, mat, 0, 2.6, 0, 8))
  const orb = new THREE.Group()
  orb.add(new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), basic('#fff4dc')), halo('#ffdca0', 1.8, 0.42))
  orb.position.y = 3.35
  g.add(orb)
  orbs.push(orb)
  g.position.set(x, 0, z)
  return g
}

/** 광장 바닥: 대리석 원형 포석 + 금빛 상감(중립적인 별·원 무늬). 금빛 선만 은은하게 빛남 */
function plazaFloor() {
  const N = 1024, c = N / 2
  const lines = (g: CanvasRenderingContext2D, col: string) => {
    g.strokeStyle = col
    g.lineWidth = 5
    for (const r of [0.97, 0.66, 0.3]) { g.beginPath(); g.arc(c, c, r * c, 0, Math.PI * 2); g.stroke() }
    g.lineWidth = 3
    g.beginPath(); g.arc(c, c, 0.94 * c, 0, Math.PI * 2); g.stroke()
    // 8갈래 별: 바깥 원과 안쪽 원 사이
    g.lineWidth = 4
    g.beginPath()
    for (let i = 0; i <= 16; i++) {
      const a = (i / 16) * Math.PI * 2 - Math.PI / 2
      const r = (i % 2 ? 0.36 : 0.62) * c
      const px = c + Math.cos(a) * r, py = c + Math.sin(a) * r
      if (i) g.lineTo(px, py); else g.moveTo(px, py)
    }
    g.stroke()
    for (let i = 0; i < 64; i++) {
      const a = (i / 64) * Math.PI * 2
      g.beginPath(); g.arc(c + Math.cos(a) * 0.805 * c, c + Math.sin(a) * 0.805 * c, 4, 0, Math.PI * 2); g.fillStyle = col; g.fill()
    }
  }
  const map = canvasTex(N, N, (g) => {
    g.fillStyle = '#eee4d2'
    g.fillRect(0, 0, N, N)
    // 동심원 포석
    let seed = 3
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
    for (let ring = 0; ring < 14; ring++) {
      const r0 = (ring / 14) * c, r1 = ((ring + 1) / 14) * c
      const n = 6 + ring * 6
      for (let i = 0; i < n; i++) {
        const a0 = (i / n) * Math.PI * 2, a1 = ((i + 1) / n) * Math.PI * 2
        const k = 0.94 + rnd() * 0.08
        g.fillStyle = `rgb(${238 * k | 0},${228 * k | 0},${210 * k | 0})`
        g.beginPath()
        g.arc(c, c, r1 - 1.5, a0 + 0.004, a1 - 0.004)
        g.arc(c, c, r0 + 1.5, a1 - 0.004, a0 + 0.004, true)
        g.fill()
      }
    }
    g.globalAlpha = 0.18
    g.fillStyle = '#c9b58f'
    g.beginPath(); g.arc(c, c, 0.66 * c, 0, Math.PI * 2); g.arc(c, c, 0.3 * c, 0, Math.PI * 2, true); g.fill()
    g.globalAlpha = 1
    lines(g, '#c9a45c')
  })
  const emissiveMap = canvasTex(N, N, (g) => { g.fillStyle = '#000'; g.fillRect(0, 0, N, N); lines(g, '#fff') })
  return lambert({ map, emissiveMap, emissive: new THREE.Color('#ffcf7a'), emissiveIntensity: 0.2 })
}

/** 빛기둥: 가운데만 밝고 좌우·위아래로 부드럽게 사라지는 판 */
function beamTex() {
  return canvasTex(64, 256, (g) => {
    const img = g.createImageData(64, 256)
    for (let y = 0; y < 256; y++) for (let x = 0; x < 64; x++) {
      const h = Math.exp(-Math.pow((x - 31.5) / 13, 2))
      const v = y / 255
      const vert = Math.min(1, v / 0.25) * Math.pow(1 - v, 0.15) * (v > 0.96 ? (1 - v) / 0.04 : 1)
      const a = h * vert * 255
      img.data.set([255, 255, 255, a], (y * 64 + x) * 4)
    }
    g.putImageData(img, 0, 0)
  })
}

export function buildPlaza(ctx: BuildCtx, labels: Record<GateId, string>, subs: Record<GateId, string>): Layout {
  const { scene } = ctx
  // 해 질 녘 하늘: 위는 푸른 보랏빛, 지평선은 복숭아빛
  sky(scene, [[0, '#3c4677'], [0.3, '#6f73a6'], [0.5, '#b8a3c0'], [0.62, '#e9bfae'], [0.72, '#f6d6b0'], [1, '#f3e2c8']])
  scene.fog = new THREE.Fog('#dcc4bf', 42, 150)
  scene.add(new THREE.HemisphereLight(0xffe7d2, 0x6a6888, 1.55))
  const sun = new THREE.DirectionalLight(0xffcf9a, 1.1)
  sun.position.set(-26, 16, 32)
  scene.add(sun)
  const fill = new THREE.DirectionalLight(0xb8c4ff, 0.35)
  fill.position.set(30, 20, -10)
  scene.add(fill)

  // 별과 달 (안개에 묻히지 않게)
  {
    const n = 240, pos = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, e = 0.35 + Math.random() * 1.1
      pos.set([Math.cos(a) * Math.cos(e) * 165, Math.sin(e) * 165, Math.sin(a) * Math.cos(e) * 165], i * 3)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xfff6e8, size: 1.6, sizeAttenuation: false, fog: false, transparent: true, opacity: 0.75, depthWrite: false })))
    const moon = new THREE.Mesh(new THREE.CircleGeometry(5, 40), basic('#fff6e2', { fog: false }))
    moon.position.set(34, 58, -150)
    moon.lookAt(0, 0, 0)
    const mg = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow('#ffe9c8'), transparent: true, opacity: 0.55, fog: false, depthWrite: false, blending: THREE.AdditiveBlending }))
    mg.scale.setScalar(34)
    mg.material.opacity = 0.35
    mg.position.copy(moon.position)
    scene.add(moon, mg)
  }
  // 멀리 겹겹의 능선 (안개로 옅어짐)
  {
    const far = ridge(520, 46, '#8f86ad', 2, -130)
    const mid = ridge(520, 26, '#a796b3', 5, -98)
    const back = ridge(520, 30, '#9a8fb0', 7, 0)
    back.rotation.y = Math.PI
    back.position.z = 110
    scene.add(far, mid, back)
  }

  // 땅: 잔디 + 대리석 광장 + 각 입구로 가는 길
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), std('#8ea27a'))
  grass.rotation.x = -Math.PI / 2
  scene.add(grass)
  ctx.floor(grass)
  const floorMat = plazaFloor()
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(17, 96), floorMat)
  plaza.rotation.x = -Math.PI / 2
  plaza.position.y = 0.01
  scene.add(plaza)
  const curb = new THREE.Mesh(new THREE.TorusGeometry(17.05, 0.18, 6, 96), std('#d8cbb2'))
  curb.rotation.x = -Math.PI / 2
  curb.position.y = 0.04
  scene.add(curb)
  // 바닥에 은은히 숨 쉬는 빛 고리
  const glowRing = new THREE.Mesh(new THREE.RingGeometry(10.8, 11.4, 96), additive({ color: '#ffd9a0', opacity: 0.1 }))
  glowRing.rotation.x = -Math.PI / 2
  glowRing.position.y = 0.03
  scene.add(glowRing)
  const shadow = new THREE.MeshBasicMaterial({ map: blob(), transparent: true, depthWrite: false, opacity: 0.5 })

  // 가운데: 빛의 분수 (특정 종교 상징 없이, 떠 있는 빛 구슬과 금빛 고리)
  const marbleM = std('#efe7da', { map: marble('#efe7da', '#cdbfa6', [2, 1]) })
  const water = basic('#a9dbe8', { transparent: true, opacity: 0.82 })
  scene.add(cyl(3.1, 3.3, 0.65, marbleM, 0, 0, 0, 48), new THREE.Mesh(new THREE.CircleGeometry(2.85, 48), water).rotateX(-Math.PI / 2).translateZ(0.58))
  const rim = new THREE.Mesh(new THREE.TorusGeometry(3.12, 0.08, 8, 64), gold())
  rim.rotation.x = -Math.PI / 2
  rim.position.y = 0.66
  scene.add(rim)
  scene.add(cyl(0.35, 0.55, 1.6, marbleM, 0, 0.6, 0, 20), cyl(1.25, 0.9, 0.35, marbleM, 0, 2.1, 0, 32), new THREE.Mesh(new THREE.CircleGeometry(1.12, 32), water).rotateX(-Math.PI / 2).translateZ(2.46))
  const wHalo = halo('#bfefff', 7, 0.25)
  wHalo.position.y = 0.8
  scene.add(wHalo)
  const orb = new THREE.Group()
  orb.add(new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 16), basic('#fff7e6')), halo('#ffe4b0', 3.6, 0.5), halo('#ffffff', 1.4, 0.7))
  const rings: THREE.Mesh[] = []
  for (let i = 0; i < 3; i++) {
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.9 + i * 0.28, 0.025, 6, 64), gold())
    orb.add(r)
    rings.push(r)
  }
  orb.position.y = 4
  scene.add(orb)
  ctx.pointLight('#ffd9a0', 0.7, 12, [0, 4, 0])
  // 하늘에서 내려오는 빛기둥
  const beamMat = additive({ map: beamTex(), color: '#ffe2bc', opacity: 0.1, side: THREE.DoubleSide, fog: false })
  const beam = new THREE.Group()
  for (let i = 0; i < 3; i++) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(6, 44), beamMat)
    m.rotation.y = (i / 3) * Math.PI
    beam.add(m)
  }
  beam.position.y = 22.5
  scene.add(beam)
  ctx.block({ x0: -3.4, z0: -3.4, x1: 3.4, z1: 3.4 })
  ctx.spot('fountain', 0, 4.6, 1.6)

  // 떠다니는 빛 알갱이 (금빛·분홍·하늘빛이 천천히 떠오름)
  const MOTES = ctx.high ? 360 : 180
  const mp = new Float32Array(MOTES * 3), mc = new Float32Array(MOTES * 3), seed = new Float32Array(MOTES)
  const palette = [new THREE.Color('#ffe2a8'), new THREE.Color('#ffd0dc'), new THREE.Color('#cfe6ff'), new THREE.Color('#fff4dc')]
  for (let i = 0; i < MOTES; i++) {
    const a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * 34
    mp.set([Math.sin(a) * r, Math.random() * 10, -6 + Math.cos(a) * r], i * 3)
    const c = palette[i % palette.length]
    mc.set([c.r, c.g, c.b], i * 3)
    seed[i] = Math.random() * 100
  }
  const mGeo = new THREE.BufferGeometry()
  mGeo.setAttribute('position', new THREE.BufferAttribute(mp, 3))
  mGeo.setAttribute('color', new THREE.BufferAttribute(mc, 3))
  const motes = new THREE.Points(mGeo, new THREE.PointsMaterial({ map: glow('#ffffff'), size: 0.42, vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending }))
  scene.add(motes)

  // 꽃나무·사이프러스: 광장 테두리 (입구로 가는 앞쪽은 비움)
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2 + 0.1
    const r = i % 2 ? 19.5 : 21.8
    const x = Math.sin(a) * r, z = Math.cos(a) * r
    if (z < -8 && Math.abs(x) < 23) continue
    if (i % 3 === 2) scene.add(cypress(x, z, 6.5))
    else scene.add(blossom(x, z, 1.15, i % 2 === 0, shadow))
    ctx.block({ x0: x - 0.6, z0: z - 0.6, x1: x + 0.6, z1: z + 0.6 })
  }
  // 대리석 벤치와 빛 구슬 등
  const orbs: THREE.Object3D[] = []
  const lampStone = std('#e3d8c4')
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8
    const x = Math.sin(a) * 8.5, z = Math.cos(a) * 8.5
    scene.add(bench(x, z, Math.atan2(-x, -z) + Math.PI, marbleM, shadow))
    // 등은 벤치 뒤에 (시작 위치 앞을 가리지 않게)
    scene.add(lantern(Math.sin(a) * 10.6, Math.cos(a) * 10.6, lampStone, orbs))
  }

  // 네 종교의 입구
  const gs = gates(labels)
  const make: Record<GateId, () => Built> = { christian: church, catholic: cathedral, temple: () => temple(ctx), mandir: gopuram }
  const path = std('#e6dccb', { map: stoneTex('#e6dccb', [1, 4]) })
  const pulses: ((k: number) => void)[] = []
  const pathLights: THREE.Sprite[] = []
  for (const gt of gs) {
    const b = make[gt.id]()
    b.g.position.set(gt.x, 0, gt.z)
    b.g.rotation.y = gt.rot
    scene.add(b.g)
    pulses.push(b.pulse)
    // 현판: 문 위
    const sg = sign(labels[gt.id], subs[gt.id], 5.2)
    const dx = Math.sin(gt.rot), dz = Math.cos(gt.rot)
    sg.position.set(gt.door[0] + dx * 0.7, gt.id === 'temple' ? 8.9 : gt.id === 'catholic' ? 7.6 : gt.id === 'mandir' ? 7.1 : 5.4, gt.door[1] + dz * 0.7)
    sg.rotation.y = gt.rot
    scene.add(sg)
    // 광장에서 입구까지 길 + 길가의 작은 빛
    const dist = Math.hypot(gt.door[0], gt.door[1])
    const len = dist - 16
    const ux = gt.door[0] / dist, uz = gt.door[1] / dist
    const road = new THREE.Mesh(new THREE.PlaneGeometry(4.2, len), path)
    road.rotation.x = -Math.PI / 2
    road.rotation.z = -gt.rot
    road.position.set(ux * (16 + len / 2), 0.015, uz * (16 + len / 2))
    scene.add(road)
    for (let d = 17.5; d < dist - 1; d += 2.6) for (const sd of [-1, 1]) {
      const px = ux * d + uz * sd * 2.35, pz = uz * d - ux * sd * 2.35
      const st = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 6), basic('#fff0cc'))
      st.position.set(px, 0.12, pz)
      const h = halo('#ffd79a', 1.1, 0.55)
      h.position.set(px, 0.2, pz)
      scene.add(st, h)
      pathLights.push(h)
    }
    // 건물 몸체는 막고(문 앞은 비움). 일주문은 기둥 사이로 지나가고, 뒤쪽 법당만 막음
    const [back, half] = gt.id === 'temple' ? [10, 6.5] : gt.id === 'catholic' ? [2, 5.6] : [1.5, 4.6]
    const cx = gt.x - dx * back, cz = gt.z - dz * back
    ctx.block({ x0: cx - half, z0: cz - half, x1: cx + half, z1: cz + half })
    ctx.spot(`gate-${gt.id}`, gt.front[0], gt.front[1], 3.2)
  }

  // 은은한 움직임: 빛 구슬은 천천히 떠오르고, 문빛과 바닥 금선은 숨 쉬듯
  ctx.every((t, dt) => {
    orb.position.y = 4 + Math.sin(t * 0.8) * 0.18
    rings.forEach((r, i) => { r.rotation.x = t * (0.25 + i * 0.12); r.rotation.y = t * (0.18 - i * 0.07) })
    const k = 0.5 + 0.5 * Math.sin(t * 0.9)
    floorMat.emissiveIntensity = 0.12 + k * 0.12
    ;(glowRing.material as THREE.MeshBasicMaterial).opacity = 0.05 + k * 0.07
    beamMat.opacity = 0.07 + k * 0.04
    beam.rotation.y = t * 0.03
    pulses.forEach((f, i) => f(0.5 + 0.5 * Math.sin(t * 0.8 + i * 1.3)))
    orbs.forEach((o, i) => { o.position.y = 3.35 + Math.sin(t * 1.1 + i) * 0.09 })
    pathLights.forEach((h, i) => { h.material.opacity = 0.4 + 0.2 * Math.sin(t * 1.6 + i * 0.7) })
    const p = mGeo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < MOTES; i++) {
      let y = p.getY(i) + dt * (0.18 + (seed[i] % 1) * 0.25)
      if (y > 11) y = 0.2
      p.setXYZ(i, p.getX(i) + Math.sin(t * 0.5 + seed[i]) * dt * 0.25, y, p.getZ(i) + Math.cos(t * 0.4 + seed[i]) * dt * 0.2)
    }
    p.needsUpdate = true
  })

  // 문을 지나면 그 종교 공간으로 (따뜻한 빛으로 번지며 전환)
  let busy = false
  ctx.every(() => {
    if (busy) return
    const me = ctx.me()
    for (const gt of gs) {
      if (Math.hypot(me.x - gt.door[0], me.z - gt.door[1]) < 2.3) {
        busy = true
        try { sessionStorage.setItem('plazaFrom', gt.id) } catch { /* 저장 못 해도 이동은 함 */ }
        const fade = document.createElement('div')
        fade.className = 'gate-fade'
        document.body.appendChild(fade)
        requestAnimationFrame(() => fade.classList.add('on'))
        setTimeout(() => { go(`w/${gt.to}`); setTimeout(() => fade.remove(), 700) }, 450)
        return
      }
    }
  })

  ctx.walk({ x0: -38, z0: -42, x1: 38, z1: 26 })

  // 다른 공간에서 돌아오면 그 입구 앞에서 시작
  let spawn: [number, number] = [0, 11]
  let yaw = 0
  try {
    const back = sessionStorage.getItem('plazaReturn') as GateId | null
    const gt = gs.find((g) => g.id === back)
    if (gt) {
      spawn = [gt.front[0], gt.front[1]]
      yaw = Math.atan2(-gt.front[0], -gt.front[1]) // 방금 나온 건물을 바라봄 (카메라가 문 안으로 파묻히지 않게)
      sessionStorage.removeItem('plazaReturn')
    }
  } catch { /* 처음 입장 */ }
  return { spawn, yaw, look: LOOKS.christian, dist: 9, maxDist: 22, pitch: 0.32, lookY: 2.2, camBox: { min: [-50, 0.8, -56], max: [50, 30, 36] } }
}
