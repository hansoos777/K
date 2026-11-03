import * as THREE from 'three'
import type { BuildCtx } from './stage'
import { glow, matcap, skyGradient } from './tex'

/**
 * 기본 재질: PujaTime처럼 Lambert(빛 계산이 가볍고 색이 밝게 나옴).
 * 예전 코드의 roughness·metalness 값은 무시한다.
 */
export const std = (color: string, o: Partial<THREE.MeshStandardMaterialParameters> = {}) =>
  new THREE.MeshLambertMaterial({
    color,
    map: o.map ?? null,
    emissive: o.emissive ?? 0x000000,
    emissiveIntensity: o.emissiveIntensity ?? 1,
    side: o.side ?? THREE.FrontSide,
    flatShading: o.flatShading ?? false,
    transparent: o.transparent ?? false,
    opacity: o.opacity ?? 1,
  })

/** 금·청동처럼 반짝이는 재질 (매트캡) */
export const gold = () => new THREE.MeshMatcapMaterial({ matcap: matcap('#fff6c8', '#d9a83a', '#5a3a0c') })
export const bronze = () => new THREE.MeshMatcapMaterial({ matcap: matcap('#f4d9a8', '#8a6330', '#2a1a08') })
export const silverStone = () => new THREE.MeshMatcapMaterial({ matcap: matcap('#ffffff', '#cfcac0', '#6b665e') })

export function box(w: number, h: number, d: number, mat: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y + h / 2, z)
  return m
}

export function cyl(rt: number, rb: number, h: number, mat: THREE.Material, x = 0, y = 0, z = 0, seg = 20) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat)
  m.position.set(x, y + h / 2, z)
  return m
}

/** 하늘 구 (위아래 그라데이션) */
export function sky(scene: THREE.Scene, stops: [number, string][]) {
  const m = new THREE.Mesh(
    new THREE.SphereGeometry(180, 32, 16),
    new THREE.MeshBasicMaterial({ map: skyGradient(stops), side: THREE.BackSide, fog: false, depthWrite: false }),
  )
  scene.add(m)
  return m
}

/** 빛 번짐 스프라이트 */
export function halo(color: string, size: number, opacity = 1) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow(color), transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }))
  s.scale.setScalar(size)
  return s
}

/** 초: 켜면 불꽃이 흔들리고 빛이 번진다 */
export class Candle {
  group = new THREE.Group()
  private flame: THREE.Sprite
  private core: THREE.Mesh
  lit = false
  constructor(ctx: BuildCtx, h = 0.3, r = 0.035, wax = '#f3ead6', lit = false) {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 12), std(wax, { roughness: 0.5, emissive: '#3a2a10', emissiveIntensity: 0.15 }))
    body.position.y = h / 2
    this.core = new THREE.Mesh(new THREE.SphereGeometry(r * 0.55, 8, 6), new THREE.MeshBasicMaterial({ color: '#fff4c2' }))
    this.core.scale.set(1, 1.8, 1)
    this.core.position.y = h + r * 0.9
    this.flame = halo('#ffb84a', r * 9)
    this.flame.position.y = h + r * 1.2
    this.group.add(body, this.core, this.flame)
    this.set(lit)
    const seed = Math.random() * 10
    ctx.every((t) => {
      if (!this.lit) return
      const f = 1 + Math.sin(t * 13 + seed) * 0.08 + Math.sin(t * 7.3 + seed) * 0.06
      this.flame.scale.setScalar(r * 9 * f)
      this.core.scale.set(1, 1.8 * f, 1)
    })
  }
  set(on: boolean) {
    this.lit = on
    this.flame.visible = on
    this.core.visible = on
  }
}

/** 장의자(교회 나무 의자) */
export function pew(w: number, mat: THREE.Material) {
  const g = new THREE.Group()
  g.add(box(w, 0.06, 0.42, mat, 0, 0.42, 0))
  g.add(box(w, 0.5, 0.05, mat, 0, 0.45, 0.2))
  g.add(box(0.06, 0.95, 0.46, mat, -w / 2, 0, 0))
  g.add(box(0.06, 0.95, 0.46, mat, w / 2, 0, 0))
  return g
}

/** 뾰족 아치 모양 (고딕 창·문) */
export function pointedArch(w: number, h: number) {
  const s = new THREE.Shape()
  const r = w * 0.9
  s.moveTo(-w / 2, 0)
  s.lineTo(-w / 2, h - w * 0.75)
  s.absarc(-w / 2 + r, h - w * 0.75, r, Math.PI, Math.PI - Math.acos(0.5 / 0.9) * 0.98, true)
  s.lineTo(0, h)
  s.absarc(w / 2 - r, h - w * 0.75, r, Math.acos(0.5 / 0.9) * 0.98, 0, true)
  s.lineTo(w / 2, 0)
  s.lineTo(-w / 2, 0)
  return s
}

/** 둥근 아치 모양 (로마네스크·현대) */
export function roundArch(w: number, h: number) {
  const s = new THREE.Shape()
  s.moveTo(-w / 2, 0)
  s.lineTo(-w / 2, h - w / 2)
  s.absarc(0, h - w / 2, w / 2, Math.PI, 0, true)
  s.lineTo(w / 2, 0)
  s.lineTo(-w / 2, 0)
  return s
}

/** 빛나는 색유리 창 (emissive라 조명 없이도 빛남) */
export function glassWindow(shape: THREE.Shape, map: THREE.Texture, intensity = 1.6) {
  const geo = new THREE.ShapeGeometry(shape, 16)
  // ShapeGeometry UV를 0..1로 맞춤
  geo.computeBoundingBox()
  const bb = geo.boundingBox!
  const uv = geo.attributes.uv as THREE.BufferAttribute
  const pos = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) - bb.min.x) / (bb.max.x - bb.min.x), (pos.getY(i) - bb.min.y) / (bb.max.y - bb.min.y))
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map, color: new THREE.Color(intensity, intensity, intensity), side: THREE.DoubleSide, toneMapped: false }))
  return m
}

/** 창틀 (아치 테두리) */
export function archFrame(shape: THREE.Shape, mat: THREE.Material, depth = 0.25, border = 0.12) {
  const pts = shape.getPoints(24)
  const bb = new THREE.Box2().setFromPoints(pts)
  const c = bb.getCenter(new THREE.Vector2())
  const sx = (bb.max.x - bb.min.x + border * 2) / (bb.max.x - bb.min.x)
  const sy = (bb.max.y - bb.min.y + border) / (bb.max.y - bb.min.y)
  const o = new THREE.Shape(pts.map((p) => new THREE.Vector2((p.x - c.x) * sx + c.x, (p.y - bb.min.y) * sy + bb.min.y)))
  o.holes.push(new THREE.Path(pts))
  return new THREE.Mesh(new THREE.ExtrudeGeometry(o, { depth, bevelEnabled: false }), mat)
}

/** 십자가 */
export function cross(h: number, mat: THREE.Material, t = 0.08) {
  const g = new THREE.Group()
  g.add(box(t, h, t, mat))
  g.add(box(h * 0.6, t, t, mat, 0, h * 0.68, 0))
  return g
}

/** 십자고상: 단순화한 몸 형태를 정중하게 */
export function crucifix(h: number) {
  const g = cross(h, std('#4a2e1a'), h * 0.06)
  const body = std('#e9dcc4', { roughness: 0.6 })
  const s = h / 2
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.06 * s, 12, 10), body)
  head.position.set(0, h * 0.62, h * 0.05)
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.05 * s, 0.22 * s, 4, 8), body)
  torso.position.set(0, h * 0.47, h * 0.05)
  const arms = new THREE.Mesh(new THREE.CapsuleGeometry(0.025 * s, h * 0.42, 4, 8), body)
  arms.rotation.z = Math.PI / 2
  arms.position.set(0, h * 0.66, h * 0.05)
  const legs = new THREE.Mesh(new THREE.CapsuleGeometry(0.035 * s, 0.24 * s, 4, 8), body)
  legs.position.set(0, h * 0.3, h * 0.05)
  g.add(head, torso, arms, legs)
  return g
}

/** 성모상: 흰 옷, 푸른 망토, 머리 위 별빛 고리 */
export function mary(h = 1.4) {
  const g = new THREE.Group()
  const s = h / 1.4
  const mantle = new THREE.Mesh(
    new THREE.LatheGeometry([0.32, 0.3, 0.26, 0.2, 0.16, 0.15, 0.16, 0].map((r, i) => new THREE.Vector2(r * s, [0, 0.2, 0.5, 0.8, 1.0, 1.1, 1.18, 1.3][i] * s)), 28),
    std('#3d68b8', { roughness: 0.55 }),
  )
  const robe = new THREE.Mesh(new THREE.CylinderGeometry(0.1 * s, 0.24 * s, 1.0 * s, 20, 1, true, -0.7, 1.4), std('#f4f1ea', { roughness: 0.5 }))
  robe.position.set(0, 0.5 * s, 0.03 * s)
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.1 * s, 16, 12), std('#f1e2cd', { roughness: 0.5 }))
  face.position.set(0, 1.2 * s, 0.05 * s)
  const hands = new THREE.Mesh(new THREE.ConeGeometry(0.05 * s, 0.14 * s, 8), std('#f1e2cd'))
  hands.position.set(0, 0.82 * s, 0.18 * s)
  hands.rotation.x = 0.4
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.14 * s, 0.01 * s, 6, 24), gold())
  ring.rotation.x = Math.PI / 2.3
  ring.position.set(0, 1.42 * s, 0)
  g.add(mantle, robe, face, hands, ring)
  return g
}

/** 종 (교회·사찰 공통 몸통, 비율만 다름) */
export function bellMesh(r: number, h: number, mat: THREE.Material, flare = 1.15) {
  const pts: THREE.Vector2[] = []
  for (let i = 0; i <= 12; i++) {
    const t = i / 12
    const rr = r * (0.55 + 0.45 * Math.pow(t, 1.6)) * (t > 0.92 ? flare : 1)
    pts.push(new THREE.Vector2(rr, h * (1 - t)))
  }
  pts.unshift(new THREE.Vector2(0, h))
  return new THREE.Mesh(new THREE.LatheGeometry(pts, 28), mat)
}

/**
 * 한옥 지붕: 길이 방향으로 뽑은 단면에, 네 귀를 들어 올려 처마 곡선(앙곡)을 만든다
 */
export function hanokRoof(len: number, depth: number, h: number, mat: THREE.Material, lift = 0.5) {
  const s = new THREE.Shape()
  const d = depth / 2
  s.moveTo(-d - 0.4, 0)
  s.quadraticCurveTo(-d * 0.5, h * 0.35, 0, h)
  s.quadraticCurveTo(d * 0.5, h * 0.35, d + 0.4, 0)
  s.lineTo(d + 0.4, -0.18)
  s.quadraticCurveTo(d * 0.5, h * 0.2, 0, h - 0.2)
  s.quadraticCurveTo(-d * 0.5, h * 0.2, -d - 0.4, -0.18)
  const geo = new THREE.ExtrudeGeometry(s, { depth: len, bevelEnabled: false, steps: 24 })
  geo.translate(0, 0, -len / 2)
  geo.rotateY(Math.PI / 2)
  const p = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), z = p.getZ(i), y = p.getY(i)
    const ex = Math.pow(Math.abs(x) / (len / 2), 5)
    const ez = Math.pow(Math.max(0, Math.abs(z) - d * 0.6) / (d * 0.4 + 0.4), 2)
    p.setY(i, y + lift * ex * (0.4 + ez) + lift * 0.25 * ez)
  }
  geo.computeVertexNormals()
  return new THREE.Mesh(geo, mat)
}

/** 연등: 부드럽게 빛나는 연꽃 등 */
export function lotusLantern(color: string) {
  const g = new THREE.Group()
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 12), new THREE.MeshBasicMaterial({ color, toneMapped: false }))
  body.scale.set(1, 0.85, 1)
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.06, 8), std('#5a3a1a'))
  cap.position.y = 0.2
  g.add(body, cap)
  for (let i = 0; i < 8; i++) {
    const petal = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), new THREE.MeshBasicMaterial({ color, toneMapped: false }))
    const a = (i / 8) * Math.PI * 2
    petal.scale.set(0.5, 1, 0.3)
    petal.position.set(Math.cos(a) * 0.2, -0.04, Math.sin(a) * 0.2)
    petal.lookAt(0, -0.4, 0)
    g.add(petal)
  }
  const h = halo(color, 1.2, 0.55)
  g.add(h)
  return g
}

/** 오르간 파이프 벽 */
export function organ(n: number, w: number, hMax: number) {
  const g = new THREE.Group()
  const m = gold()
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const h = hMax * (0.55 + 0.45 * Math.cos((t - 0.5) * Math.PI))
    const p = cyl(w / n / 2.4, w / n / 2.4, h, m, -w / 2 + t * w, 0, 0, 10)
    g.add(p)
    const mouth = box(w / n / 2, 0.08, 0.02, std('#1a1208'), -w / 2 + t * w, 0.35, w / n / 2.4)
    g.add(mouth)
  }
  return g
}

/** 먼지 빛줄기 (스테인드글라스에서 들어오는 빛) */
export function lightShaft(w: number, h: number, color: string, opacity = 0.12) {
  const geo = new THREE.PlaneGeometry(w, h)
  const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }))
  return m
}

/** 산 능선 (멀리 겹겹이) */
export function ridge(width: number, height: number, color: string, seed: number, z: number) {
  const s = new THREE.Shape()
  s.moveTo(-width / 2, -5)
  const n = 24
  for (let i = 0; i <= n; i++) {
    const x = -width / 2 + (i / n) * width
    const y = height * (0.45 + 0.35 * Math.sin(i * 0.7 + seed) + 0.2 * Math.sin(i * 1.9 + seed * 2))
    s.lineTo(x, y)
  }
  s.lineTo(width / 2, -5)
  const m = new THREE.Mesh(new THREE.ShapeGeometry(s), new THREE.MeshBasicMaterial({ color, fog: true }))
  m.position.z = z
  return m
}

/** 소나무 (단순한 층층 원뿔) */
export function pine(h: number, x: number, z: number) {
  const g = new THREE.Group()
  g.add(cyl(0.08, 0.12, h * 0.4, std('#5a3a24'), 0, 0, 0, 6))
  const leaf = std('#2f5a3f', { roughness: 0.9 })
  for (let i = 0; i < 3; i++) {
    const c = new THREE.Mesh(new THREE.ConeGeometry(h * (0.32 - i * 0.07), h * 0.35, 7), leaf)
    c.position.y = h * (0.42 + i * 0.18)
    g.add(c)
  }
  g.position.set(x, 0, z)
  return g
}

/** 방석 */
export function cushion(color: string) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.36, 0.1, 24), std(color, { roughness: 0.9 }))
  m.position.y = 0.05
  return m
}

/** 뾰족 궁륭 천장 (z0~z1 방향으로 뻗은 고딕 천장 안쪽 면) */
export function vault(width: number, spring: number, peak: number, z0: number, z1: number, mat: THREE.Material) {
  const segU = 24, segV = 2
  const pos: number[] = [], uv: number[] = [], idx: number[] = []
  const w = width / 2
  const arch = (u: number) => {
    // 왼쪽 반(0..0.5)과 오른쪽 반(0.5..1)을 원호 두 개로: 꼭대기가 뾰족
    const side = u < 0.5 ? -1 : 1
    const k = u < 0.5 ? u * 2 : (1 - u) * 2 // 0(벽) → 1(꼭대기)
    const a = (k * Math.PI) / 2
    const x = side * w * (1 - Math.sin(a) * 1.0)
    const y = spring + (peak - spring) * (1 - Math.cos(a)) ** 0.85
    return [x, y]
  }
  for (let j = 0; j <= segV; j++)
    for (let i = 0; i <= segU; i++) {
      const [x, y] = arch(i / segU)
      pos.push(x, y, z0 + ((z1 - z0) * j) / segV)
      uv.push(i / segU, j / segV)
    }
  for (let j = 0; j < segV; j++)
    for (let i = 0; i < segU; i++) {
      const a = j * (segU + 1) + i, b = a + 1, c = a + segU + 1, d = c + 1
      idx.push(a, c, b, b, c, d)
    }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  g.setIndex(idx)
  g.computeVertexNormals()
  const m = new THREE.Mesh(g, mat)
  ;(m.material as THREE.Material).side = THREE.DoubleSide
  return m
}

/** 궁륭 갈비뼈(리브): 뾰족 아치 곡선을 따라 만든 관 */
export function rib(width: number, spring: number, peak: number, z: number, mat: THREE.Material, r = 0.12) {
  const w = width / 2
  const pts: THREE.Vector3[] = []
  for (let i = 0; i <= 24; i++) {
    const u = i / 24
    const side = u < 0.5 ? -1 : 1
    const k = u < 0.5 ? u * 2 : (1 - u) * 2
    const a = (k * Math.PI) / 2
    pts.push(new THREE.Vector3(side * w * (1 - Math.sin(a)), spring + (peak - spring) * (1 - Math.cos(a)) ** 0.85, z))
  }
  return new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, r, 6), mat)
}

/** 다발 기둥(고딕) */
export function clusterColumn(h: number, r: number, mat: THREE.Material) {
  const g = new THREE.Group()
  g.add(cyl(r, r, h, mat, 0, 0, 0, 16))
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2 + Math.PI / 4
    g.add(cyl(r * 0.38, r * 0.38, h, mat, Math.cos(a) * r, 0, Math.sin(a) * r, 10))
  }
  g.add(cyl(r * 1.5, r * 1.6, 0.4, mat, 0, 0, 0, 8))
  g.add(cyl(r * 1.5, r * 1.2, 0.35, mat, 0, h - 0.35, 0, 8))
  return g
}

/** 울퉁불퉁한 바위 */
export function rock(r: number, color: string, seed: number) {
  const geo = new THREE.IcosahedronGeometry(r, 2)
  const p = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i)
    const n = 1 + 0.22 * Math.sin(x * 3.1 + seed) * Math.cos(z * 2.7 + seed) + 0.1 * Math.sin(y * 5 + seed)
    p.setXYZ(i, x * n, y * n * 0.85, z * n)
  }
  geo.computeVertexNormals()
  return new THREE.Mesh(geo, std(color, { roughness: 0.95, flatShading: true }))
}

/** 늘어진 줄 위의 꽃·등 위치 (현수선 근사) */
export function sag(a: THREE.Vector3, b: THREE.Vector3, n: number, drop: number) {
  const out: THREE.Vector3[] = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const p = a.clone().lerp(b, t)
    p.y -= drop * 4 * t * (1 - t)
    out.push(p)
  }
  return out
}

/** 같은 모양을 여러 개: InstancedMesh로 한 번에 그림(그리기 호출 1회) */
export function instances(geo: THREE.BufferGeometry, mat: THREE.Material, pts: THREE.Vector3[], scale = 1) {
  const m = new THREE.InstancedMesh(geo, mat, pts.length)
  const d = new THREE.Object3D()
  pts.forEach((p, i) => {
    d.position.copy(p)
    d.scale.setScalar(scale)
    d.rotation.set(Math.random() * 3, Math.random() * 3, 0)
    d.updateMatrix()
    m.setMatrixAt(i, d.matrix)
  })
  return m
}
