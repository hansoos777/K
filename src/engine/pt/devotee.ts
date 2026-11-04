import * as THREE from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

// PujaTime src/three/devotee.ts 를 가져와 다른 종교 옷차림(shirt·dress·monk·lay)을 더함.
// 신자 캐릭터. 머리 지름을 1로 두고 ratio(등신)로 몸 길이만 바꿈. 앱은 2등신으로 확정.
// 고를 수 있는 캐릭터. 사원 홀의 다른 사람들도 이 목록을 씀.
export const CAST: Omit<DevoteeOpts, 'ratio' | 'pose'>[] = [
  { outfit: 'sari', skin: 0xb97a4c, cloth: 0xc2185b },
  { outfit: 'kurta', skin: 0x9c5f37, cloth: 0x1f7a78 },
  { outfit: 'sari', skin: 0xa86a40, cloth: 0x5e35b1, elder: true },
  { outfit: 'kurta', skin: 0xb07848, cloth: 0xfaf3e3, trim: 0xd9892b, elder: true },
  { outfit: 'sari', skin: 0x8a5230, cloth: 0xf29a2e, trim: 0xc2185b },
  { outfit: 'kurta', skin: 0xc98a5c, cloth: 0xb3402a },
  { outfit: 'sari', skin: 0xc98a5c, cloth: 0x1f8a70 },
  { outfit: 'kurta', skin: 0x8a5230, cloth: 0x3457a6 },
]

export type Outfit = 'sari' | 'kurta' | 'shirt' | 'dress' | 'monk' | 'lay'
export type Pose = 'stand' | 'sit'

export interface DevoteeOpts {
  ratio: number
  outfit: Outfit
  pose: Pose
  skin: number
  cloth: number
  trim?: number
  elder?: boolean
  /** 서 있을 때도 두 손을 모음(기도·합장) */
  joined?: boolean
  /** 머리카락 색 (기본 검정) */
  hair?: number
  /** 미사포: 성당에서 여성 신자가 머리에 쓰는 흰 레이스 천 */
  veil?: boolean
}

const GOLD = 0xe9b84e
const HAIR = 0x2a1a12
const lam = (color: number, extra: THREE.MeshLambertMaterialParameters = {}) => new THREE.MeshLambertMaterial({ color, ...extra })

function lathe(points: [number, number][], mat: THREE.Material, seg = 36) {
  return new THREE.Mesh(new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), seg), mat)
}

function clothTexture(base: number, trim: number, repeat = 6) {
  const el = document.createElement('canvas')
  el.width = 512
  el.height = 256
  const c = el.getContext('2d')!
  const hex = (n: number) => `#${n.toString(16).padStart(6, '0')}`
  c.fillStyle = hex(base)
  c.fillRect(0, 0, 512, 256)
  c.fillStyle = hex(trim)
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 28; x++) {
      c.beginPath()
      c.arc(9 + x * 18 + (y % 2) * 9, 12 + y * 21, 2.6, 0, Math.PI * 2)
      c.fill()
    }
  c.fillRect(0, 228, 512, 22)
  c.fillStyle = hex(base)
  c.fillRect(0, 236, 512, 5)
  const t = new THREE.CanvasTexture(el)
  t.colorSpace = THREE.SRGBColorSpace
  t.wrapS = THREE.RepeatWrapping
  t.repeat.set(repeat / 6, 1)
  t.flipY = false
  return t
}

// 어깨에 걸치는 사리 천(팔루). 경로를 따라 띠를 직접 만듦.
function ribbon(points: THREE.Vector3[], width: number, mat: THREE.Material) {
  const curve = new THREE.CatmullRomCurve3(points)
  const n = 36
  const pos: number[] = []
  const uv: number[] = []
  const idx: number[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const p = curve.getPoint(t)
    const tan = curve.getTangent(t)
    const out = new THREE.Vector3(p.x, 0, p.z).normalize()
    const side = new THREE.Vector3().crossVectors(tan, out).normalize().multiplyScalar(width / 2)
    pos.push(p.x - side.x, p.y - side.y, p.z - side.z, p.x + side.x, p.y + side.y, p.z + side.z)
    uv.push(t * 3, 0.15, t * 3, 0.98)
    if (i < n) idx.push(i * 2, i * 2 + 1, i * 2 + 2, i * 2 + 1, i * 2 + 3, i * 2 + 2)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  g.setIndex(idx)
  g.computeVertexNormals()
  return new THREE.Mesh(g, mat)
}

function limb(a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material) {
  const len = a.distanceTo(b)
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 12), mat)
  m.position.copy(a).add(b).multiplyScalar(0.5)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
  return m
}

function head(g: THREE.Group, y: number, o: DevoteeOpts) {
  const skin = lam(o.skin)
  const h = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 24), skin)
  h.scale.set(1.03, 0.97, 0.97)
  h.position.y = y
  g.add(h)
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), skin)
    ear.position.set(s * 0.5, y - 0.02, 0)
    g.add(ear)
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.058, 16, 12), new THREE.MeshBasicMaterial({ color: 0x1d1109 }))
    eye.scale.set(0.9, 1.15, 0.45)
    eye.position.set(s * 0.19, y - 0.06, 0.462)
    g.add(eye)
    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }))
    shine.position.set(s * 0.19 + 0.016, y - 0.035, 0.487)
    g.add(shine)
    const blush = new THREE.Mesh(new THREE.CircleGeometry(0.075, 20), new THREE.MeshBasicMaterial({ color: 0xee7d73, transparent: true, opacity: 0.42 }))
    blush.scale.y = 0.62
    blush.position.set(s * 0.29, y - 0.15, 0.405)
    blush.rotation.y = s * 0.6
    g.add(blush)
    const earring = new THREE.Mesh(new THREE.SphereGeometry(0.034, 10, 8), lam(GOLD))
    if (o.outfit === 'sari') {
      earring.position.set(s * 0.51, y - 0.12, 0.02)
      g.add(earring)
    }
  }
  const grandpa = o.elder && (o.outfit === 'kurta' || o.outfit === 'shirt' || o.outfit === 'lay')
  const grandma = o.elder && (o.outfit === 'sari' || o.outfit === 'dress')
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.011, 8, 16, Math.PI), new THREE.MeshBasicMaterial({ color: 0x7a3320 }))
  smile.rotation.z = Math.PI
  smile.position.set(0, y - (grandpa ? 0.22 : 0.14), grandpa ? 0.455 : 0.477)
  g.add(smile)

  if (o.elder) {
    // 동그란 안경
    const rim = lam(GOLD)
    for (const s of [-1, 1]) {
      const lens = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.012, 8, 28), rim)
      lens.position.set(s * 0.19, y - 0.06, 0.475)
      lens.rotation.y = s * 0.28
      g.add(lens)
    }
    const bridge = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.01, 8, 12, Math.PI), rim)
    bridge.position.set(0, y - 0.09, 0.49)
    g.add(bridge)
  }
  if (grandpa) {
    const white = lam(0xf0ece4)
    for (const s of [-1, 1]) {
      const stache = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), white)
      stache.scale.set(1.2, 0.5, 0.5)
      stache.position.set(s * 0.085, y - 0.15, 0.46)
      stache.rotation.z = s * 0.3
      g.add(stache)
      const brow = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), white)
      brow.scale.set(1.15, 0.38, 0.4)
      brow.position.set(s * 0.19, y + 0.07, 0.462)
      g.add(brow)
      for (const k of [0, 1, 2]) {
        const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), white)
        tuft.position.set(s * (0.47 - k * 0.03), y + 0.12 - k * 0.1, -0.1 - k * 0.06)
        g.add(tuft)
      }
    }
  }

  const hindu = o.outfit === 'sari' || o.outfit === 'kurta'
  if (hindu) {
    const mark = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 10), new THREE.MeshBasicMaterial({ color: 0xd2281c }))
    mark.scale.set(o.outfit === 'sari' ? 1 : 0.6, o.outfit === 'sari' ? 1 : 1.8, 0.4)
    mark.position.set(0, y + 0.1, 0.474)
    g.add(mark)
  }
  // 스님: 삭발 (머리카락 없음)
  if (o.outfit === 'monk') return

  const hairMat = lam(o.elder ? 0xdedad2 : o.hair ?? HAIR)
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.525, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), hairMat)
  cap.rotation.x = -0.3
  cap.scale.set(1.02, 1, 1)
  cap.position.set(0, y + 0.02, -0.03)
  if (grandpa) return
  g.add(cap)
  if (grandma) {
    for (const s of [-1, 1]) {
      const lock = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), hairMat)
      lock.scale.set(0.82, 0.34, 0.5)
      lock.position.set(s * 0.27, y + 0.3, 0.26)
      lock.rotation.set(0.5, 0, -s * 0.62)
      g.add(lock)
    }
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 16), hairMat)
    bun.position.set(0, y + 0.5, -0.3)
    g.add(bun)
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      const fl = new THREE.Mesh(new THREE.SphereGeometry(0.042, 10, 8), lam(0xfff6e0))
      fl.position.set(Math.cos(a) * 0.2, y + 0.4, -0.3 + Math.sin(a) * 0.2)
      g.add(fl)
    }
  } else if (o.outfit === 'sari') {
    // 가르마를 탄 앞머리와 어깨로 내려오는 땋은 머리
    for (const s of [-1, 1]) {
      const lock = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), hairMat)
      lock.scale.set(0.82, 0.34, 0.5)
      lock.position.set(s * 0.27, y + 0.3, 0.26)
      lock.rotation.set(0.5, 0, -s * 0.62)
      g.add(lock)
    }
    const braid = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.42, y - 0.06, -0.12),
      new THREE.Vector3(-0.47, y - 0.32, 0.06),
      new THREE.Vector3(-0.42, y - 0.6, 0.22),
      new THREE.Vector3(-0.38, y - 0.86, 0.3),
    ])
    for (let i = 0; i <= 8; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.085 - i * 0.004, 12, 10), hairMat)
      b.position.copy(braid.getPoint(i / 8))
      g.add(b)
    }
    const tie = new THREE.Mesh(new THREE.SphereGeometry(0.062, 12, 10), lam(0xf6a81f))
    tie.position.copy(braid.getPoint(1)).add(new THREE.Vector3(0, -0.06, 0))
    g.add(tie)
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      const fl = new THREE.Mesh(new THREE.SphereGeometry(0.052, 10, 8), lam(i % 2 ? 0xf6a81f : 0xfff6e0))
      fl.position.set(0.37 + Math.cos(a) * 0.075, y + 0.3 + Math.sin(a) * 0.075, 0.27)
      g.add(fl)
    }
    const center = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), lam(0xffd862))
    center.position.set(0.37, y + 0.3, 0.3)
    g.add(center)
  } else if (o.outfit === 'dress') {
    // 단발: 양옆으로 내려오는 머리와 앞머리
    for (const s of [-1, 1]) {
      const side = new THREE.Mesh(new THREE.SphereGeometry(0.3, 20, 14), hairMat)
      side.scale.set(0.5, 0.95, 0.75)
      side.position.set(s * 0.4, y - 0.08, -0.04)
      g.add(side)
    }
    const back = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 16), hairMat)
    back.scale.set(1.02, 0.95, 0.7)
    back.position.set(0, y - 0.06, -0.2)
    g.add(back)
    const bang = new THREE.Mesh(new THREE.SphereGeometry(0.36, 20, 14), hairMat)
    bang.scale.set(1.1, 0.3, 0.5)
    bang.position.set(0, y + 0.3, 0.24)
    bang.rotation.x = 0.45
    g.add(bang)
    if (o.veil) veil(g, y)
  } else {
    const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.34, 20, 14), hairMat)
    fringe.scale.set(1.08, 0.32, 0.5)
    fringe.position.set(0.08, y + 0.32, 0.25)
    fringe.rotation.set(0.5, 0, -0.2)
    g.add(fringe)
  }
}

/** 미사포: 정수리부터 뒤통수·어깨까지 덮는 흰 레이스 (앞머리는 보이게 뒤로 젖혀 씀) */
let laceTex: THREE.CanvasTexture | null = null
function veil(g: THREE.Group, y: number) {
  if (!laceTex) {
    const el = document.createElement('canvas')
    el.width = el.height = 64
    const c = el.getContext('2d')!
    // 성긴 레이스: 반투명 흰 바탕에 더 하얀 꽃무늬 고리 (머리카락이 살짝 비침)
    c.fillStyle = 'rgba(255, 255, 255, .55)'
    c.fillRect(0, 0, 64, 64)
    c.strokeStyle = 'rgba(255, 255, 255, 1)'
    c.lineWidth = 2.2
    for (const [x, yy] of [[16, 16], [48, 16], [16, 48], [48, 48], [32, 32]]) { c.beginPath(); c.arc(x, yy, 6, 0, Math.PI * 2); c.stroke() }
    laceTex = new THREE.CanvasTexture(el)
    laceTex.wrapS = laceTex.wrapT = THREE.RepeatWrapping
    laceTex.repeat.set(12, 5)
    laceTex.colorSpace = THREE.SRGBColorSpace
  }
  const mat = lam(0xffffff, { map: laceTex, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false })
  // 정수리에서 뒤로 얹은 모양: 앞머리와 이마는 드러나게 많이 젖힘
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.565, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), mat)
  top.position.set(0, y + 0.01, -0.08)
  top.rotation.x = -0.75
  g.add(top)
  // 뒤로 늘어진 부분
  const drape = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 0.5, 24, 1, true, Math.PI / 2, Math.PI), mat)
  drape.position.set(0, y - 0.3, -0.16)
  g.add(drape)
}

function arms(g: THREE.Group, shoulderY: number, chestZ: number, spread: number, armR: number, skin: THREE.Material, joined: boolean, sleeve?: THREE.Material) {
  for (const s of [-1, 1]) {
    const sh = new THREE.Vector3(s * spread, shoulderY, 0.02)
    const hand = joined
      ? new THREE.Vector3(s * 0.05, shoulderY - 0.1, chestZ + 0.2)
      : new THREE.Vector3(s * (spread + 0.1), shoulderY - 0.46, 0.05)
    const elbow = joined
      ? new THREE.Vector3(s * (spread + 0.08), shoulderY - 0.3, chestZ * 0.5)
      : sh.clone().lerp(hand, 0.5).add(new THREE.Vector3(s * 0.02, -0.06, -0.02))
    g.add(limb(sh, elbow, armR * 1.05, sleeve ?? skin), limb(elbow, hand, armR, skin))
    const palm = new THREE.Mesh(new THREE.SphereGeometry(armR * 1.3, 12, 10), skin)
    if (joined) {
      // 합장: 손바닥을 세워 맞댐
      palm.scale.set(0.5, 1.7, 1)
      palm.position.set(s * 0.032, hand.y + 0.1, hand.z)
    } else palm.position.copy(hand)
    g.add(palm)
    if (!sleeve) {
      const bangle = new THREE.Mesh(new THREE.TorusGeometry(armR * 1.2, 0.016, 8, 18), lam(GOLD))
      bangle.position.copy(elbow.clone().lerp(hand, 0.72))
      bangle.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), hand.clone().sub(elbow).normalize())
      g.add(bangle)
    }
  }
}

/** 원피스(dress)와 승복(monk): 발목까지 내려오는 긴 옷. 승복은 갈색 가사를 왼쪽 어깨에 걸침 */
function longRobe(g: THREE.Group, o: DevoteeOpts, d: { sit: boolean; hw: number; legsH: number; torsoH: number; waist: number; neck: number; armR: number; skin: THREE.Material }) {
  const { sit, hw, legsH, torsoH, waist, neck, armR, skin } = d
  const cloth = lam(o.cloth)
  if (sit) g.add(lathe([[0, 0], [hw + 0.42, 0], [hw + 0.44, 0.07], [hw + 0.3, 0.17], [hw + 0.04, 0.26], [0, 0.28]], cloth))
  else g.add(lathe([[hw + 0.16, 0.02], [hw + 0.12, legsH * 0.5], [hw + 0.02, legsH + 0.03]], cloth), lathe([[0, 0.02], [hw + 0.16, 0.02]], cloth))
  g.add(lathe([[hw + 0.01, waist - 0.02], [hw, waist + 0.04], [hw * 0.96, waist + torsoH * 0.55], [hw * 0.72, neck - 0.02], [0.12, neck + 0.05], [0, neck + 0.06]], cloth))
  if (o.outfit === 'monk') {
    // 가사: 왼쪽 어깨에서 오른쪽 허리로
    const kasaya = lam(o.trim ?? 0x7a3a1e, { side: THREE.DoubleSide })
    g.add(ribbon([
      new THREE.Vector3(-hw * 0.86, neck + 0.04, 0.02),
      new THREE.Vector3(-hw * 0.4, neck - 0.08, hw * 0.9),
      new THREE.Vector3(hw * 0.3, waist + torsoH * 0.4, hw * 1.02),
      new THREE.Vector3(hw * 0.9, waist + 0.02, hw * 0.5),
      new THREE.Vector3(hw * 0.9, waist - 0.02, -hw * 0.6),
      new THREE.Vector3(-hw * 0.6, neck - 0.1, -hw * 0.9),
    ], 0.36, kasaya))
  } else {
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.022, 8, 24), lam(o.trim ?? 0xf4efe4))
    collar.rotation.x = Math.PI / 2
    collar.position.y = neck + 0.03
    g.add(collar)
  }
  arms(g, neck - 0.07, hw * 0.8, hw * 1.02, armR, skin, sit || !!o.joined, cloth)
}

export function makeDevotee(o: DevoteeOpts) {
  const g = new THREE.Group()
  const trim = o.trim ?? GOLD
  const skin = lam(o.skin)
  const body = o.ratio - 1
  const sit = o.pose === 'sit'
  const tex = clothTexture(o.cloth, trim)
  const clothMat = lam(0xffffff, { map: tex })
  const plain = lam(o.cloth)
  const armR = 0.085 + (3 - o.ratio) * 0.012

  const legsH = sit ? 0.22 : body * 0.5
  const torsoH = sit ? Math.max(0.42, body * 0.5) : body * 0.5
  const waist = legsH
  const neck = waist + torsoH
  const hw = 0.3 + (3 - o.ratio) * 0.05 // 등신이 낮을수록 통통하게

  if (o.outfit === 'sari') {
    if (sit) {
      const lap = lathe([[0, 0], [hw + 0.42, 0], [hw + 0.44, 0.07], [hw + 0.3, 0.17], [hw + 0.04, 0.26], [0, 0.28]], clothMat)
      g.add(lap)
    } else {
      const s = lathe([[hw + 0.2, 0], [hw + 0.19, 0.06], [hw + 0.08, legsH * 0.6], [hw, legsH + 0.03]], clothMat)
      const inner = lathe([[0, 0.002], [hw + 0.19, 0.002]], plain)
      g.add(s, inner)
    }
    const blouse = lam(trim === GOLD ? 0xf0b43a : trim)
    const torso = lathe([[hw + 0.01, waist - 0.02], [hw, waist + 0.04], [hw * 0.96, waist + torsoH * 0.55], [hw * 0.72, neck - 0.02], [0.12, neck + 0.05], [0, neck + 0.06]], blouse)
    g.add(torso)
    const palluMat = lam(0xffffff, { map: clothTexture(o.cloth, trim, 3), side: THREE.DoubleSide })
    const pts = [
      new THREE.Vector3(-hw * 0.96, waist - 0.02, 0.1),
      new THREE.Vector3(-hw * 0.62, waist + torsoH * 0.18, hw * 0.92),
      new THREE.Vector3(0, waist + torsoH * 0.5, hw * 1.03),
      new THREE.Vector3(hw * 0.6, neck - 0.06, hw * 0.7),
      new THREE.Vector3(hw * 0.86, neck + 0.04, 0.02),
      new THREE.Vector3(hw * 0.74, neck - 0.06, -hw * 0.66),
      new THREE.Vector3(hw * 0.62, waist + torsoH * 0.2, -hw * 1.04),
      new THREE.Vector3(hw * 0.64, sit ? 0.14 : legsH * 0.4, -(hw + (sit ? 0.28 : 0.1))),
    ]
    g.add(ribbon(pts, 0.3, palluMat))
    const necklace = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 8, 24), lam(GOLD))
    necklace.rotation.x = Math.PI / 2 - 0.5
    necklace.position.set(0, neck - 0.01, 0.07)
    g.add(necklace)
    arms(g, neck - 0.07, hw * 0.8, hw * 1.02, armR, skin, sit || !!o.joined)
  } else if (o.outfit === 'dress' || o.outfit === 'monk') {
    longRobe(g, o, { sit, hw, legsH, torsoH, waist, neck, armR, skin })
  } else {
    const western = o.outfit === 'shirt' || o.outfit === 'lay'
    const pajama = lam(o.outfit === 'shirt' ? 0x3a4050 : o.outfit === 'lay' ? 0x8a8478 : 0xfff7e6)
    if (sit) {
      // 양반다리: 무릎 두 개와 교차한 정강이
      for (const s of [-1, 1]) {
        g.add(limb(new THREE.Vector3(s * (hw + 0.26), 0.13, 0.18), new THREE.Vector3(-s * 0.1, 0.13, 0.36), 0.125, pajama))
        const foot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), skin)
        foot.scale.set(1.3, 0.7, 0.8)
        foot.position.set(-s * 0.24, 0.1, 0.44)
        g.add(foot)
      }
    } else {
      for (const s of [-1, 1]) {
        g.add(limb(new THREE.Vector3(s * hw * 0.48, 0.09, 0), new THREE.Vector3(s * hw * 0.48, legsH, 0), 0.115 + (3 - o.ratio) * 0.02, pajama))
        const foot = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), lam(western ? 0x2a2420 : 0x8a4a1e))
        foot.scale.set(0.95, 0.55, 1.35)
        foot.position.set(s * hw * 0.48, 0.05, 0.05)
        g.add(foot)
      }
    }
    const hem = sit ? 0.24 : western ? waist - 0.02 : legsH * 0.42
    const flare = sit ? 0.13 : 0.1
    const tunic = lathe([[hw + flare, hem], [hw + (sit ? 0.14 : 0.06), waist], [hw, waist + torsoH * 0.5], [hw * 0.74, neck - 0.02], [0.12, neck + 0.05], [0, neck + 0.06]], plain)
    const hemRing = new THREE.Mesh(new THREE.CylinderGeometry(hw + flare, hw + flare, 0.05, 36, 1, true), lam(trim, { side: THREE.DoubleSide }))
    hemRing.position.y = hem + 0.02
    g.add(tunic, hemRing)
    const placket = new THREE.Mesh(new THREE.BoxGeometry(0.06, torsoH * (western ? 0.8 : 0.5), 0.02), lam(western ? (o.trim ?? 0xf4efe4) : trim))
    placket.position.set(0, neck - torsoH * 0.25, hw * 0.92)
    placket.rotation.x = -0.14
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.024, 8, 24), lam(trim))
    collar.rotation.x = Math.PI / 2
    collar.position.y = neck + 0.03
    g.add(placket, collar)
    arms(g, neck - 0.07, hw * 0.8, hw * 1.02, armR, skin, sit || !!o.joined, plain)
  }

  head(g, neck + 0.5, o)
  if (o.elder && !sit) {
    // 지팡이
    const x = hw * 1.02 + 0.1
    g.add(limb(new THREE.Vector3(x + 0.03, 0.02, 0.1), new THREE.Vector3(x, neck - 0.46, 0.07), 0.024, lam(0x7a4a22)))
  }
  return g
}

// 메시 수십 개를 재질별로 합쳐 드로우콜을 줄임. 사원 홀에서 수십 명을 그릴 때 필요.
export function bakeDevotee(g: THREE.Group) {
  g.updateMatrixWorld(true)
  const buckets = new Map<string, { mat: THREE.MeshLambertMaterial | THREE.MeshBasicMaterial; geos: THREE.BufferGeometry[] }>()
  g.traverse((o) => {
    const mesh = o as THREE.Mesh
    if (!mesh.isMesh) return
    const mat = mesh.material as THREE.MeshLambertMaterial
    const key = `${mat.type}|${mat.map?.uuid ?? ''}|${mat.transparent}|${mat.side}`
    let bucket = buckets.get(key)
    if (!bucket) {
      const m = mat.clone()
      m.color.set(0xffffff)
      m.vertexColors = true
      bucket = { mat: m, geos: [] }
      buckets.set(key, bucket)
    }
    const geo = (mesh.geometry.index ? mesh.geometry.toNonIndexed() : mesh.geometry.clone()).applyMatrix4(mesh.matrixWorld)
    const n = geo.getAttribute('position').count
    Object.keys(geo.attributes).forEach((k) => {
      if (k !== 'position' && k !== 'normal' && k !== 'uv') geo.deleteAttribute(k)
    })
    if (!geo.getAttribute('uv')) geo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2))
    const c = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) mat.color.toArray(c, i * 3)
    geo.setAttribute('color', new THREE.BufferAttribute(c, 3))
    bucket.geos.push(geo)
  })
  return [...buckets.values()].map(({ mat, geos }) => ({ mat, geo: mergeGeometries(geos)! }))
}
