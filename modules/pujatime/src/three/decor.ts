import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { FLOWER_LOOK, type FlowerKind } from '../data/flowers'
import { brass, canvasTexture } from './kit'

// 내 신당과 공용 사원이 함께 쓰는 금장식·꽃·천. 그림은 전부 캔버스로 그려서 파일 용량이 늘지 않음.

const GOLD = '#e9b84e'

export const damaskTexture = (repeat: [number, number], wall: [string, string] = ['#a3261a', '#7c1610']) =>
  canvasTexture(256, 256, (c) => {
    const g = c.createLinearGradient(0, 0, 0, 256)
    g.addColorStop(0, wall[0])
    g.addColorStop(1, wall[1])
    c.fillStyle = g
    c.fillRect(0, 0, 256, 256)
    c.strokeStyle = 'rgba(240,190,90,.2)'
    c.fillStyle = 'rgba(240,190,90,.07)'
    c.lineWidth = 2
    const motif = (x: number, y: number, s: number) => {
      c.save()
      c.translate(x, y)
      c.scale(s, s)
      for (let i = 0; i < 8; i++) {
        c.rotate(Math.PI / 4)
        c.beginPath()
        c.moveTo(6, 0)
        c.bezierCurveTo(16, -12, 34, -10, 42, 0)
        c.bezierCurveTo(34, 10, 16, 12, 6, 0)
        c.fill()
        c.stroke()
      }
      c.beginPath()
      c.arc(0, 0, 5, 0, Math.PI * 2)
      c.fill()
      c.restore()
    }
    motif(128, 128, 1.1)
    for (const [x, y] of [[0, 0], [256, 0], [0, 256], [256, 256]]) motif(x, y, 0.8)
  }, repeat)

// 바닥은 일부러 단순하게 둠. 시선이 카펫과 랑골리를 따라 신상으로 가도록 함
export const tileTexture = (repeat: [number, number]) =>
  canvasTexture(256, 256, (c) => {
    c.fillStyle = '#f0dfbf'
    c.fillRect(0, 0, 256, 256)
    c.strokeStyle = 'rgba(170,125,60,.14)'
    c.lineWidth = 2
    for (let i = 0; i < 5; i++) {
      c.beginPath()
      c.moveTo((i * 71) % 256, 0)
      c.bezierCurveTo(70, 90, 190, 130, (i * 113) % 256, 256)
      c.stroke()
    }
    c.strokeStyle = 'rgba(176,122,40,.4)'
    c.lineWidth = 3
    c.strokeRect(0, 0, 256, 256)
  }, repeat)

export const ceilingTexture = (repeat: [number, number]) =>
  canvasTexture(256, 256, (c) => {
    c.fillStyle = '#6d1710'
    c.fillRect(0, 0, 256, 256)
    c.strokeStyle = GOLD
    c.lineWidth = 8
    c.strokeRect(4, 4, 248, 248)
    c.fillStyle = '#12635a'
    c.beginPath()
    c.arc(128, 128, 92, 0, Math.PI * 2)
    c.fill()
    c.stroke()
    c.translate(128, 128)
    for (let i = 0; i < 12; i++) {
      c.rotate(Math.PI / 6)
      c.fillStyle = i % 2 ? '#f6c55a' : '#f09a3a'
      c.beginPath()
      c.ellipse(46, 0, 34, 13, 0, 0, Math.PI * 2)
      c.fill()
    }
    c.fillStyle = '#fff0b0'
    c.beginPath()
    c.arc(0, 0, 15, 0, Math.PI * 2)
    c.fill()
  }, repeat)

// 금박 위에 새긴 덩굴 무늬. 어두운 선과 밝은 선을 겹쳐 양각처럼 보이게 함
function scroll(c: CanvasRenderingContext2D, x: number, y: number, r: number, flip: number) {
  const curl = () => {
    c.beginPath()
    for (let a = 0; a < 15; a += 0.3) {
      const k = r * (1 - a / 16)
      const px = x + flip * Math.cos(a) * k
      const py = y + Math.sin(a) * k
      if (a) c.lineTo(px, py)
      else c.moveTo(px, py)
    }
    c.stroke()
  }
  c.save()
  c.lineCap = 'round'
  c.strokeStyle = 'rgba(95,50,10,.85)'
  c.lineWidth = 5
  curl()
  c.translate(-1.5, -2)
  c.strokeStyle = 'rgba(255,245,190,.9)'
  c.lineWidth = 2
  curl()
  c.restore()
}

export const carvedGoldTexture = (repeat: [number, number]) =>
  canvasTexture(256, 256, (c) => {
    c.fillStyle = '#fff4d6'
    c.fillRect(0, 0, 256, 256)
    for (let y = 0; y < 2; y++)
      for (let x = 0; x < 2; x++) scroll(c, 64 + x * 128, 64 + y * 128, 50, (x + y) % 2 ? -1 : 1)
  }, repeat)

export function toranaTexture() {
  return canvasTexture(1024, 420, (c) => {
    c.beginPath()
    c.moveTo(0, 44)
    c.lineTo(420, 44)
    c.quadraticCurveTo(486, 40, 512, 0)
    c.quadraticCurveTo(538, 40, 604, 44)
    c.lineTo(1024, 44)
    c.lineTo(1024, 420)
    c.lineTo(930, 420)
    c.lineTo(930, 214)
    // 안쪽 윤곽은 작은 호를 이어 붙인 인도식 아치
    const lobes = 11
    const at = (i: number) => {
      const a = (i / lobes) * Math.PI
      return [512 + Math.cos(a) * 418, 214 - Math.sin(a) * 108]
    }
    for (let i = 0; i < lobes; i++) {
      const [x0, y0] = at(i)
      const [x1, y1] = at(i + 1)
      const mx = (x0 + x1) / 2
      const my = (y0 + y1) / 2
      c.quadraticCurveTo(mx + (mx - 512) * 0.1, my - 34, x1, y1)
    }
    c.lineTo(94, 420)
    c.lineTo(0, 420)
    c.closePath()
    const g = c.createLinearGradient(0, 0, 0, 420)
    g.addColorStop(0, '#fff0b0')
    g.addColorStop(0.4, '#e6ae42')
    g.addColorStop(1, '#a8691d')
    c.fillStyle = g
    c.fill()
    c.save()
    c.clip()
    for (let i = 0; i < 12; i++) {
      scroll(c, 44 + i * 85, 86, 30, i % 2 ? -1 : 1)
      scroll(c, 86 + i * 85, 140, 24, i % 2 ? 1 : -1)
    }
    for (const x of [46, 978]) for (let y = 200; y < 420; y += 62) scroll(c, x, y, 26, y % 4 ? 1 : -1)
    c.fillStyle = '#fff6cf'
    for (let i = 0; i < 52; i++) {
      c.beginPath()
      c.arc(10 + i * 20, 54, 5, 0, Math.PI * 2)
      c.fill()
    }
    c.fillStyle = '#c23b24'
    c.beginPath()
    c.arc(512, 62, 16, 0, Math.PI * 2)
    c.fill()
    c.restore()
    c.strokeStyle = '#6e3c10'
    c.lineWidth = 7
    c.stroke()
  })
}

export function torana(w: number) {
  const h = (w * 420) / 1024
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: toranaTexture(), transparent: true, alphaTest: 0.5 }))
}

/** 위에서 신상으로 내려오는 은은한 빛 */
export function lightShaft(w: number, h: number, opacity: number) {
  const map = canvasTexture(128, 256, (c) => {
    const g = c.createLinearGradient(0, 0, 128, 0)
    g.addColorStop(0, 'rgba(255,225,160,0)')
    g.addColorStop(0.5, 'rgba(255,225,160,1)')
    g.addColorStop(1, 'rgba(255,225,160,0)')
    c.fillStyle = g
    c.fillRect(0, 0, 128, 256)
    c.globalCompositeOperation = 'destination-in'
    const v = c.createLinearGradient(0, 0, 0, 256)
    v.addColorStop(0, 'rgba(0,0,0,.15)')
    v.addColorStop(0.75, 'rgba(0,0,0,1)')
    v.addColorStop(1, 'rgba(0,0,0,0)')
    c.fillStyle = v
    c.fillRect(0, 0, 128, 256)
  })
  return new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }),
  )
}

// 신상 뒤에서 천천히 도는 후광
export function sunburst(size: number, opacity = 0.9) {
  const map = canvasTexture(512, 512, (c) => {
    c.translate(256, 256)
    const g = c.createRadialGradient(0, 0, 10, 0, 0, 256)
    g.addColorStop(0, 'rgba(255,236,170,1)')
    g.addColorStop(0.4, 'rgba(255,180,80,.6)')
    g.addColorStop(1, 'rgba(255,120,40,0)')
    c.fillStyle = g
    c.fillRect(-256, -256, 512, 512)
    for (let i = 0; i < 24; i++) {
      c.rotate(Math.PI / 12)
      const r = c.createLinearGradient(0, 0, 250, 0)
      r.addColorStop(0, 'rgba(255,235,170,.55)')
      r.addColorStop(1, 'rgba(255,190,90,0)')
      c.fillStyle = r
      c.beginPath()
      c.moveTo(0, 0)
      c.lineTo(250, i % 2 ? -13 : -7)
      c.lineTo(250, i % 2 ? 13 : 7)
      c.closePath()
      c.fill()
    }
  })
  return new THREE.Mesh(
    new THREE.PlaneGeometry(size, size),
    new THREE.MeshBasicMaterial({ map, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }),
  )
}

export function rangoli(radius: number) {
  const map = canvasTexture(512, 512, (c) => {
    c.translate(256, 256)
    const ring = (n: number, at: number, len: number, wide: number, color: string) => {
      c.fillStyle = color
      for (let i = 0; i < n; i++) {
        c.rotate((Math.PI * 2) / n)
        c.beginPath()
        c.ellipse(at, 0, len, wide, 0, 0, Math.PI * 2)
        c.fill()
      }
    }
    const disc = (r: number, color: string) => {
      c.fillStyle = color
      c.beginPath()
      c.arc(0, 0, r, 0, Math.PI * 2)
      c.fill()
    }
    disc(254, '#fff1cf')
    disc(244, '#c2185b')
    ring(24, 210, 34, 15, '#f7a823')
    disc(170, '#fff1cf')
    disc(160, '#12735f')
    ring(16, 120, 38, 18, '#ffd24a')
    disc(84, '#fff1cf')
    disc(74, '#d9381e')
    ring(8, 42, 26, 11, '#fff1cf')
    disc(14, '#ffd24a')
  })
  return new THREE.Mesh(new THREE.CircleGeometry(radius, 48), new THREE.MeshLambertMaterial({ map, transparent: true }))
}

export function curtain(w: number, h: number) {
  const map = canvasTexture(256, 512, (c) => {
    for (let x = 0; x < 256; x++) {
      const k = 0.5 + Math.sin(x / 11) * 0.5
      c.fillStyle = `rgb(${130 + k * 90},${18 + k * 34},${28 + k * 40})`
      c.fillRect(x, 0, 1, 512)
    }
    c.fillStyle = GOLD
    c.fillRect(0, 0, 256, 26)
    c.fillRect(0, 474, 256, 16)
    c.fillStyle = '#fff0b0'
    for (let i = 0; i < 14; i++) {
      c.beginPath()
      c.arc(9 + i * 18, 40, 6, 0, Math.PI * 2)
      c.arc(9 + i * 18, 460, 4, 0, Math.PI * 2)
      c.fill()
    }
  })
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map }))
}

// 금잔화: 구를 주름지게 만들어 꽃잎 느낌을 냄
export function marigoldGeometry(detail = 2) {
  const geo = new THREE.IcosahedronGeometry(1, detail)
  const pos = geo.getAttribute('position')
  const v = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    const k = 1 + 0.15 * Math.sin(v.x * 9) * Math.sin(v.y * 9) * Math.sin(v.z * 9)
    pos.setXYZ(i, v.x * k, v.y * k, v.z * k)
  }
  geo.computeVertexNormals()
  return geo
}

export interface Bead {
  p: THREE.Vector3
  r: number
}

/** 두 점 사이에 늘어지는 꽃줄 */
export function swag(a: THREE.Vector3, b: THREE.Vector3, n: number, sag: number, r: number): Bead[] {
  return Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n
    const p = a.clone().lerp(b, t)
    p.y -= Math.sin(t * Math.PI) * sag
    return { p, r }
  })
}

/** 아래로 내려오는 꽃줄 */
export const strand = (top: THREE.Vector3, n: number, gap: number, r: number): Bead[] =>
  Array.from({ length: n }, (_, i) => ({ p: top.clone().setY(top.y - i * gap), r: r * (1 - (i / n) * 0.3) }))

export function marigolds(beads: Bead[]) {
  const inst = new THREE.InstancedMesh(marigoldGeometry(), new THREE.MeshLambertMaterial({ color: 0xffffff }), beads.length)
  const colors = [0xf6a81f, 0xee8a17, 0xf9bc33, 0xf6a81f, 0xd9381e].map((c) => new THREE.Color(c))
  const m = new THREE.Matrix4()
  const q = new THREE.Quaternion()
  const e = new THREE.Euler()
  const s = new THREE.Vector3()
  beads.forEach(({ p, r }, i) => {
    q.setFromEuler(e.set(i * 1.3, i * 2.1, i * 0.7))
    inst.setMatrixAt(i, m.compose(p, q, s.setScalar(r)))
    inst.setColorAt(i, colors[i % colors.length])
  })
  inst.frustumCulled = false
  return inst
}

/** x축 방향으로 걸린 삼각 깃발 줄 */
export function pennants(rows: { z: number; y: number }[], halfW: number, n: number, size: number, sag: number) {
  const shape = new THREE.Shape()
  shape.moveTo(-size / 2, 0)
  shape.lineTo(size / 2, 0)
  shape.lineTo(0, -size * 1.5)
  shape.closePath()
  const inst = new THREE.InstancedMesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }), rows.length * n)
  const colors = [0xf7a823, 0xd9381e, 0xffd24a, 0x12735f, 0xc2185b].map((c) => new THREE.Color(c))
  const m = new THREE.Matrix4()
  rows.forEach(({ z, y }, r) => {
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n
      inst.setMatrixAt(r * n + i, m.makeTranslation(-halfW + t * halfW * 2, y - Math.sin(t * Math.PI) * sag, z))
      inst.setColorAt(r * n + i, colors[i % colors.length])
    }
  })
  inst.frustumCulled = false
  return inst
}

/** 천장이나 장식에 매달린 큰 종. 그룹의 원점이 고리 위치 */
export function hangingBell(matcap: THREE.Texture, chain: number) {
  const mat = brass(matcap)
  const g = new THREE.Group()
  const link = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, chain, 8), mat)
  link.position.y = -chain / 2
  const dome = new THREE.Mesh(
    new THREE.LatheGeometry([[0, 0.05], [0.1, 0.02], [0.17, -0.06], [0.21, -0.2], [0.26, -0.36], [0.36, -0.5], [0.46, -0.6], [0.5, -0.66], [0.44, -0.66], [0, -0.6]].map(([x, y]) => new THREE.Vector2(x, y)), 28),
    mat,
  )
  dome.position.y = -chain
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.09, 14, 10), mat)
  ball.position.y = -chain - 0.76
  g.add(link, dome, ball)
  return g
}

/** 놋쇠 물항아리에 망고잎과 코코넛을 얹은 칼라시 */
export function kalash(matcap: THREE.Texture) {
  const g = new THREE.Group()
  const pot = new THREE.Mesh(
    new THREE.LatheGeometry([[0, 0], [0.16, 0], [0.3, 0.12], [0.35, 0.28], [0.27, 0.44], [0.15, 0.53], [0.19, 0.6], [0, 0.6]].map(([x, y]) => new THREE.Vector2(x, y)), 24),
    brass(matcap),
  )
  const coconut = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 12), new THREE.MeshLambertMaterial({ color: 0x8a5a2c }))
  coconut.scale.y = 1.2
  coconut.position.y = 0.76
  const leaf = new THREE.Shape()
  leaf.moveTo(0, 0)
  leaf.bezierCurveTo(-0.09, 0.12, -0.07, 0.25, 0, 0.42)
  leaf.bezierCurveTo(0.07, 0.25, 0.09, 0.12, 0, 0)
  const leafGeo = new THREE.ShapeGeometry(leaf)
  const leafMat = new THREE.MeshLambertMaterial({ color: 0x4f8a34, side: THREE.DoubleSide })
  for (let i = 0; i < 7; i++) {
    const l = new THREE.Mesh(leafGeo, leafMat)
    const a = (i / 7) * Math.PI * 2
    l.position.set(Math.cos(a) * 0.15, 0.6, Math.sin(a) * 0.15)
    l.rotation.set(0, -a + Math.PI / 2, 0, 'YXZ')
    l.rotateX(1.05)
    g.add(l)
  }
  g.add(pot, coconut)
  return g
}

export function pillarTrim(matcap: THREE.Texture, spots: [number, number][], { y0, top, r, rings }: { y0: number; top: number; r: number; rings: number[] }) {
  const lathe = (pts: number[][]) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), 16)
  const mat = brass(matcap)
  const base = new THREE.InstancedMesh(lathe([[r * 1.8, 0], [r * 1.8, 0.24], [r * 1.25, 0.36], [0, 0.36]]), mat, spots.length)
  const head = new THREE.InstancedMesh(lathe([[r * 0.95, top - 1.8], [r * 1.5, top - 1.4], [r * 2.2, top - 0.9], [r * 2.2, top], [0, top]]), mat, spots.length)
  const band = new THREE.InstancedMesh(new THREE.TorusGeometry(r * 1.2, 0.05, 8, 18), mat, spots.length * rings.length)
  const m = new THREE.Matrix4()
  const flat = new THREE.Matrix4().makeRotationX(Math.PI / 2)
  spots.forEach(([x, z], i) => {
    base.setMatrixAt(i, m.makeTranslation(x, y0, z))
    head.setMatrixAt(i, m)
    rings.forEach((y, k) => band.setMatrixAt(i * rings.length + k, m.clone().setPosition(x, y0 + y, z).multiply(flat)))
  })
  return [base, head, band]
}

// 꽃 한 송이 모양. 꽃잎을 합쳐 한 덩어리로 만들어 많이 떨어져도 가벼움
function flowerGeometry(kind: FlowerKind) {
  const { n, fill, core, len, wid } = FLOWER_LOOK[kind]
  const paint = (g: THREE.BufferGeometry, hex: string) => {
    const c = new THREE.Color(hex)
    const count = g.getAttribute('position').count
    g.setAttribute('color', new THREE.BufferAttribute(new Float32Array(Array.from({ length: count }, () => [c.r, c.g, c.b]).flat()), 3))
    return g
  }
  const parts: THREE.BufferGeometry[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const p = new THREE.SphereGeometry(1, 5, 3)
    p.scale(0.11 * len, 0.035, 0.06 * wid)
    p.rotateZ(0.3)
    p.rotateY(-a)
    p.translate(Math.cos(a) * 0.1 * len, 0.02, Math.sin(a) * 0.1 * len)
    parts.push(paint(p, fill))
  }
  const c = new THREE.SphereGeometry(0.055, 6, 4)
  c.translate(0, 0.05, 0)
  parts.push(paint(c, core))
  const merged = mergeGeometries(parts)
  parts.forEach((p) => p.dispose())
  return merged
}

// 공양한 꽃이 위에서 우수수 떨어져 제단에 쌓임
export class FlowerShower {
  mesh: THREE.InstancedMesh
  private items: { x: number; y: number; z: number; ground: number; v: number; delay: number; seed: number; tilt: number; spin: number; s: number; done: boolean }[] = []
  private m = new THREE.Matrix4()
  private q = new THREE.Quaternion()
  private e = new THREE.Euler()
  private p = new THREE.Vector3()
  private sv = new THREE.Vector3()
  private falling: number

  constructor(kind: FlowerKind, n: number) {
    this.mesh = new THREE.InstancedMesh(flowerGeometry(kind), new THREE.MeshLambertMaterial({ vertexColors: true }), n)
    this.mesh.frustumCulled = false
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    this.falling = n
    for (let i = 0; i < n; i++) {
      const spread = (Math.random() + Math.random() - 1) * 1.2
      this.items.push({
        x: spread,
        y: still ? 0 : 5.6 + Math.random() * 1.2,
        z: 0.55 + Math.random() * 0.85,
        ground: 0.2 + Math.random() * 0.09,
        v: 0.5 + Math.random() * 0.5,
        delay: still ? 0 : Math.random() * 1.5,
        seed: Math.random() * 10,
        tilt: (Math.random() - 0.5) * 0.5,
        spin: Math.random() * Math.PI * 2,
        s: 0.85 + Math.random() * 0.45,
        done: false,
      })
    }
    this.tick(0, 0)
  }

  dispose() {
    this.mesh.geometry.dispose()
    ;(this.mesh.material as THREE.Material).dispose()
    this.mesh.dispose()
  }

  tick(dt: number, t: number) {
    if (!this.falling) return
    this.items.forEach((f, i) => {
      if (!f.done) {
        f.delay -= dt
        if (f.delay <= 0) {
          f.v = Math.min(f.v + dt * 1.6, 2.1)
          f.y -= f.v * dt
        }
        if (f.y <= f.ground) {
          f.y = f.ground
          f.done = true
          this.falling--
        }
      }
      const sway = f.done ? 0 : 0.16
      this.p.set(f.x + Math.sin(t * 1.8 + f.seed) * sway, f.y, f.z + Math.cos(t * 1.4 + f.seed) * sway * 0.5)
      if (f.done) this.q.setFromEuler(this.e.set(f.tilt, f.spin, f.tilt * 0.6))
      else this.q.setFromEuler(this.e.set(t * 2.1 + f.seed, t * 1.3 + f.spin, t * 1.7))
      this.mesh.setMatrixAt(i, this.m.compose(this.p, this.q, this.sv.setScalar(f.s)))
    })
    this.mesh.instanceMatrix.needsUpdate = true
  }
}

// 공중에서 천천히 떨어지는 금잔화. 범위 안에서 위아래로 돌고 돌아서 개수가 늘지 않음
export class PetalRain {
  mesh: THREE.InstancedMesh
  private items: { x: number; y: number; z: number; s: number; v: number; seed: number }[] = []
  private m = new THREE.Matrix4()
  private q = new THREE.Quaternion()
  private e = new THREE.Euler()
  private p = new THREE.Vector3()
  private s = new THREE.Vector3()

  constructor(n: number, private box: THREE.Box3, r: number) {
    this.mesh = new THREE.InstancedMesh(marigoldGeometry(1), new THREE.MeshLambertMaterial({ color: 0xffffff }), n)
    this.mesh.frustumCulled = false
    const colors = [0xf6a81f, 0xf9bc33, 0xee8a17].map((c) => new THREE.Color(c))
    const size = box.getSize(new THREE.Vector3())
    for (let i = 0; i < n; i++) {
      this.items.push({
        x: box.min.x + Math.random() * size.x,
        y: box.min.y + Math.random() * size.y,
        z: box.min.z + Math.random() * size.z,
        s: r * (0.7 + Math.random() * 0.6),
        v: size.y * (0.05 + Math.random() * 0.04),
        seed: Math.random() * 10,
      })
      this.mesh.setColorAt(i, colors[i % 3])
    }
  }

  tick(dt: number, t: number) {
    const { min, max } = this.box
    this.items.forEach((f, i) => {
      f.y -= f.v * dt
      if (f.y < min.y) f.y = max.y
      this.p.set(f.x + Math.sin(t * 0.7 + f.seed) * 0.5, f.y, f.z + Math.cos(t * 0.5 + f.seed) * 0.3)
      this.q.setFromEuler(this.e.set(t + f.seed, t * 0.6, 0))
      this.mesh.setMatrixAt(i, this.m.compose(this.p, this.q, this.s.setScalar(f.s)))
    })
    this.mesh.instanceMatrix.needsUpdate = true
  }
}
