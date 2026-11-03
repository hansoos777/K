import * as THREE from 'three'
import { brass, canvasTexture } from './kit'
import type { BuildCtx } from '../stage'

/**
 * 종교별 중심 상징물. PujaTime 신상처럼 화면의 중심이 되도록 크고 빛나게 만든다.
 * 형태는 전통 도상에 맞춤(설명은 각 함수 주석). 실사 이미지·3D 모델이 생기면 교체할 수 있다.
 */
const lathe = (pts: [number, number][], mat: THREE.Material, seg = 40) =>
  new THREE.Mesh(new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg), mat)

function limb(a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material) {
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, a.distanceTo(b), 6, 14), mat)
  m.position.copy(a).add(b).multiplyScalar(0.5)
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), b.clone().sub(a).normalize())
  return m
}

/** 연꽃 받침: 겹꽃잎 두 줄 */
export function lotusThrone(r: number, mat: THREE.Material, inner?: THREE.Material) {
  const g = new THREE.Group()
  const petal = new THREE.SphereGeometry(1, 16, 12)
  for (const [row, n, rr, tilt, y] of [[0, 16, 1, 0.9, 0.18], [1, 12, 0.82, 0.55, 0.36]] as const) {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + row * 0.2
      const p = new THREE.Mesh(petal, row ? inner ?? mat : mat)
      p.scale.set(r * 0.2, r * 0.3, r * 0.08)
      p.position.set(Math.cos(a) * r * rr, r * y, Math.sin(a) * r * rr)
      // 얇은 쪽(z)이 바깥을 보게 돌리고, 위쪽이 바깥으로 벌어지게 기울임
      p.rotation.set(-tilt * 0.6, Math.PI / 2 - a, 0, 'YXZ')
      g.add(p)
    }
  }
  g.add(lathe([[0, 0], [r * 1.05, 0], [r * 1.08, r * 0.12], [r * 0.9, r * 0.2], [r * 0.85, r * 0.45], [0, r * 0.48]], mat))
  return g
}

/**
 * 석가모니불 좌상: 결가부좌, 오른손은 무릎 아래로 내려 땅을 짚는 항마촉지인(대웅전의 대표 수인),
 * 왼손은 배 앞에 놓음. 정수리의 육계, 나발(소라 모양 머리), 긴 귓불, 미간의 백호.
 */
export function buddha(matcap: THREE.Texture, h = 3) {
  const g = new THREE.Group()
  const gold = brass(matcap)
  const k = h / 3
  // 무릎(결가부좌)과 가사 자락
  const lap = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), gold)
  lap.scale.set(1.15 * k, 0.34 * k, 0.72 * k)
  lap.position.set(0, 0.32 * k, 0.12 * k)
  g.add(lap)
  for (const s of [-1, 1]) {
    const foot = new THREE.Mesh(new THREE.SphereGeometry(0.16 * k, 16, 12), gold)
    foot.scale.set(1.3, 0.6, 0.8)
    foot.position.set(s * 0.32 * k, 0.56 * k, 0.5 * k)
    foot.rotation.z = s * 0.4
    g.add(foot)
  }
  // 몸통 (어깨가 넓고 허리가 잘록)
  g.add(lathe([[0.62 * k, 0.45 * k], [0.6 * k, 0.8 * k], [0.66 * k, 1.25 * k], [0.62 * k, 1.5 * k], [0.32 * k, 1.66 * k], [0.18 * k, 1.72 * k], [0, 1.73 * k]], gold))
  // 가사: 왼쪽 어깨를 덮는 옷 주름
  for (let i = 0; i < 5; i++) {
    const fold = new THREE.Mesh(new THREE.TorusGeometry(0.62 * k, 0.025 * k, 6, 40, Math.PI * 0.9), gold)
    fold.position.set(-0.08 * k, (0.75 + i * 0.17) * k, 0.02 * k)
    fold.rotation.set(Math.PI / 2 - 0.1, 0.55, 0.2)
    g.add(fold)
  }
  // 팔: 왼손은 배 앞, 오른손은 오른 무릎 아래로(항마촉지인)
  const sh = 1.5 * k
  g.add(limb(new THREE.Vector3(-0.58 * k, sh, 0), new THREE.Vector3(-0.62 * k, 0.95 * k, 0.25 * k), 0.15 * k, gold))
  g.add(limb(new THREE.Vector3(-0.62 * k, 0.95 * k, 0.25 * k), new THREE.Vector3(-0.12 * k, 0.72 * k, 0.5 * k), 0.12 * k, gold))
  const lh = new THREE.Mesh(new THREE.SphereGeometry(0.15 * k, 14, 10), gold)
  lh.scale.set(1.3, 0.5, 1)
  lh.position.set(-0.05 * k, 0.7 * k, 0.52 * k)
  g.add(lh)
  g.add(limb(new THREE.Vector3(0.58 * k, sh, 0), new THREE.Vector3(0.68 * k, 0.95 * k, 0.28 * k), 0.15 * k, gold))
  g.add(limb(new THREE.Vector3(0.68 * k, 0.95 * k, 0.28 * k), new THREE.Vector3(0.72 * k, 0.42 * k, 0.68 * k), 0.12 * k, gold))
  const rh = new THREE.Mesh(new THREE.SphereGeometry(0.14 * k, 14, 10), gold)
  rh.scale.set(0.8, 1.4, 0.7)
  rh.position.set(0.72 * k, 0.32 * k, 0.72 * k)
  g.add(rh)
  // 목의 삼도(세 줄 주름)
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.19 * k, 0.012 * k, 6, 24), gold)
    ring.rotation.x = Math.PI / 2
    ring.position.y = (1.76 + i * 0.05) * k
    g.add(ring)
  }
  // 머리
  const hy = 2.18 * k
  const headM = new THREE.Mesh(new THREE.SphereGeometry(0.38 * k, 32, 24), gold)
  headM.scale.set(0.95, 1.08, 0.98)
  headM.position.y = hy
  g.add(headM)
  // 나발: 머리를 덮는 작은 소라 모양 돌기들
  const curl = new THREE.SphereGeometry(0.05 * k, 8, 6)
  const curls = new THREE.InstancedMesh(curl, gold, 220)
  const d = new THREE.Object3D()
  let n = 0
  for (let i = 0; i < 400 && n < 220; i++) {
    const phi = Math.acos(1 - (i + 0.5) / 400 * 1.1)
    const th = i * 2.399
    const v = new THREE.Vector3(Math.sin(phi) * Math.cos(th), Math.cos(phi), Math.sin(phi) * Math.sin(th))
    if (v.z > 0.55 && v.y < 0.55) continue // 얼굴 쪽은 비움
    if (v.y < -0.05) continue
    d.position.set(v.x * 0.37 * k, hy + v.y * 0.41 * k, v.z * 0.38 * k)
    d.updateMatrix()
    curls.setMatrixAt(n++, d.matrix)
  }
  curls.count = n
  g.add(curls)
  // 육계(정수리의 솟은 부분)
  const ush = new THREE.Mesh(new THREE.SphereGeometry(0.2 * k, 20, 14), gold)
  ush.position.y = hy + 0.4 * k
  g.add(ush)
  // 긴 귓불
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.06 * k, 0.32 * k, 4, 10), gold)
    ear.position.set(s * 0.36 * k, hy - 0.12 * k, -0.02 * k)
    g.add(ear)
    // 반쯤 감은 눈
    const eye = new THREE.Mesh(new THREE.TorusGeometry(0.06 * k, 0.012 * k, 6, 16, Math.PI), new THREE.MeshBasicMaterial({ color: 0x6a3e10 }))
    eye.rotation.z = Math.PI
    eye.position.set(s * 0.13 * k, hy + 0.02 * k, 0.36 * k)
    g.add(eye)
  }
  // 백호(미간의 흰 털)와 코·입
  const urna = new THREE.Mesh(new THREE.SphereGeometry(0.03 * k, 10, 8), brass(matcap, 0xfff6e0))
  urna.position.set(0, hy + 0.1 * k, 0.37 * k)
  const nose = new THREE.Mesh(new THREE.ConeGeometry(0.05 * k, 0.14 * k, 10), gold)
  nose.position.set(0, hy - 0.06 * k, 0.38 * k)
  nose.rotation.x = 0.3
  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.05 * k, 0.01 * k, 6, 12, Math.PI), new THREE.MeshBasicMaterial({ color: 0x7a4410 }))
  mouth.rotation.z = Math.PI
  mouth.position.set(0, hy - 0.17 * k, 0.35 * k)
  g.add(urna, nose, mouth)
  return g
}

/** 불상 뒤 광배: 불꽃 무늬 금 광배와 머리 둘레 원 */
export function mandorla(w: number) {
  const map = canvasTexture(512, 768, (c) => {
    c.translate(256, 470)
    const outline = () => {
      c.beginPath()
      c.moveTo(0, -460)
      c.bezierCurveTo(140, -380, 250, -200, 240, 40)
      c.bezierCurveTo(232, 190, 140, 290, 0, 296)
      c.bezierCurveTo(-140, 290, -232, 190, -240, 40)
      c.bezierCurveTo(-250, -200, -140, -380, 0, -460)
    }
    outline()
    const g = c.createRadialGradient(0, -120, 20, 0, -60, 420)
    g.addColorStop(0, '#fff3c0')
    g.addColorStop(0.45, '#e7b04a')
    g.addColorStop(1, '#9a5a14')
    c.fillStyle = g
    c.fill()
    c.save()
    outline()
    c.clip()
    // 불꽃 무늬
    c.strokeStyle = 'rgba(120,60,10,.7)'
    c.lineWidth = 4
    for (let i = 0; i < 26; i++) {
      const a = -Math.PI / 2 + (i - 13) * 0.17
      c.beginPath()
      c.moveTo(Math.cos(a) * 200, Math.sin(a) * 200 - 80)
      c.quadraticCurveTo(Math.cos(a + 0.15) * 260, Math.sin(a + 0.15) * 260 - 90, Math.cos(a) * 300, Math.sin(a) * 300 - 110)
      c.stroke()
    }
    // 머리 광배와 몸 광배
    for (const [y, r] of [[-160, 120], [40, 200]] as const) {
      c.lineWidth = 6
      c.strokeStyle = '#fff4c8'
      c.beginPath()
      c.arc(0, y, r, 0, Math.PI * 2)
      c.stroke()
      c.lineWidth = 3
      c.strokeStyle = 'rgba(120,60,10,.8)'
      c.beginPath()
      c.arc(0, y, r - 14, 0, Math.PI * 2)
      c.stroke()
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * Math.PI * 2
        c.fillStyle = i % 2 ? '#c8402a' : '#2f7a63'
        c.beginPath()
        c.arc(Math.cos(a) * (r - 32), y + Math.sin(a) * (r - 32), 7, 0, Math.PI * 2)
        c.fill()
      }
    }
    c.restore()
    outline()
    c.strokeStyle = '#6a3a0a'
    c.lineWidth = 8
    c.stroke()
  })
  const h = (w * 768) / 512
  return new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map, transparent: true, alphaTest: 0.4 }))
}

/** 십자고상: 짙은 나무 십자가, 끝은 금장식, 상아색 성체(정중하게 단순화) */
export function crucifix(h: number, matcap: THREE.Texture, ivory: THREE.Texture) {
  const g = new THREE.Group()
  const wood = new THREE.MeshLambertMaterial({ color: 0x4a2a16 })
  const gold = brass(matcap)
  const t = h * 0.07
  const v = new THREE.Mesh(new THREE.BoxGeometry(t, h, t * 0.8), wood)
  v.position.y = h / 2
  const bar = new THREE.Mesh(new THREE.BoxGeometry(h * 0.62, t, t * 0.8), wood)
  bar.position.y = h * 0.72
  g.add(v, bar)
  for (const [x, y] of [[0, h], [-h * 0.31, h * 0.72], [h * 0.31, h * 0.72]] as const) {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(t * 0.75, 14, 10), gold)
    cap.position.set(x, y, 0)
    g.add(cap)
  }
  // 명패(INRI)
  const plate = new THREE.Mesh(new THREE.BoxGeometry(t * 2.2, t * 0.9, t * 0.3), gold)
  plate.position.set(0, h * 0.88, t * 0.5)
  g.add(plate)
  const body = new THREE.MeshMatcapMaterial({ matcap: ivory, color: 0xfff4e0 })
  const z = t * 0.6
  const head = new THREE.Mesh(new THREE.SphereGeometry(h * 0.045, 18, 14), body)
  head.position.set(h * 0.012, h * 0.7, z + h * 0.01)
  head.rotation.z = -0.3
  const torso = lathe([[h * 0.055, 0], [h * 0.06, h * 0.08], [h * 0.07, h * 0.15], [h * 0.04, h * 0.19], [0, h * 0.2]], body, 20)
  torso.position.set(0, h * 0.46, z)
  const cloth = lathe([[h * 0.07, 0], [h * 0.075, h * 0.04], [h * 0.06, h * 0.07], [0, h * 0.07]], new THREE.MeshMatcapMaterial({ matcap: ivory, color: 0xf0e2c4 }), 20)
  cloth.position.set(0, h * 0.4, z)
  g.add(head, torso, cloth)
  for (const s of [-1, 1]) {
    g.add(limb(new THREE.Vector3(s * h * 0.06, h * 0.64, z), new THREE.Vector3(s * h * 0.29, h * 0.73, z), h * 0.016, body))
    g.add(limb(new THREE.Vector3(s * h * 0.03, h * 0.4, z), new THREE.Vector3(s * h * 0.008, h * 0.18, z + h * 0.01), h * 0.024, body))
  }
  return g
}

/** 성모상: 흰 대리석 옷, 푸른 망토, 모은 두 손, 머리 위 열두 별 */
export function mary(h: number, marble: THREE.Texture, matcap: THREE.Texture) {
  const g = new THREE.Group()
  const white = new THREE.MeshMatcapMaterial({ matcap: marble })
  const blue = new THREE.MeshMatcapMaterial({ matcap: marble, color: 0x6f9ce8 })
  const k = h / 1.7
  g.add(lathe([[0.36 * k, 0], [0.34 * k, 0.1 * k], [0.28 * k, 0.6 * k], [0.24 * k, 1.0 * k], [0.26 * k, 1.2 * k], [0.18 * k, 1.36 * k], [0, 1.4 * k]], white))
  // 망토: 뒤쪽 반을 감싸는 열린 원통
  const mantle = new THREE.Mesh(new THREE.CylinderGeometry(0.27 * k, 0.4 * k, 1.36 * k, 32, 1, true, Math.PI * 0.35, Math.PI * 1.3), blue)
  mantle.position.y = 0.7 * k
  ;(mantle.material as THREE.Material).side = THREE.DoubleSide
  g.add(mantle)
  // 베일과 얼굴
  const face = new THREE.Mesh(new THREE.SphereGeometry(0.15 * k, 24, 18), white)
  face.position.set(0, 1.52 * k, 0.03 * k)
  const veil = new THREE.Mesh(new THREE.SphereGeometry(0.19 * k, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.62), white)
  veil.position.set(0, 1.53 * k, -0.02 * k)
  veil.rotation.x = -0.35
  const veilBack = new THREE.Mesh(new THREE.CylinderGeometry(0.17 * k, 0.26 * k, 0.4 * k, 24, 1, true, Math.PI * 0.3, Math.PI * 1.4), white)
  veilBack.position.set(0, 1.32 * k, -0.02 * k)
  ;(veilBack.material as THREE.Material).side = THREE.DoubleSide
  g.add(face, veil, veilBack)
  // 기도하는 손
  const hands = new THREE.Mesh(new THREE.SphereGeometry(0.06 * k, 12, 10), white)
  hands.scale.set(0.6, 1.6, 0.8)
  hands.position.set(0, 1.08 * k, 0.27 * k)
  g.add(hands)
  for (const s of [-1, 1]) g.add(limb(new THREE.Vector3(s * 0.24 * k, 1.28 * k, 0.02 * k), new THREE.Vector3(s * 0.04 * k, 1.06 * k, 0.24 * k), 0.06 * k, white))
  // 열두 별 고리
  const star = brass(matcap)
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2
    const s = new THREE.Mesh(new THREE.OctahedronGeometry(0.03 * k), star)
    s.position.set(Math.cos(a) * 0.24 * k, 1.82 * k, Math.sin(a) * 0.24 * k)
    g.add(s)
  }
  return g
}

/** 개신교 십자가: 장식 없는 빈 십자가(부활을 뜻함) */
export function emptyCross(h: number, mat: THREE.Material) {
  const g = new THREE.Group()
  const t = h * 0.09
  const v = new THREE.Mesh(new THREE.BoxGeometry(t, h, t), mat)
  v.position.y = h / 2
  const bar = new THREE.Mesh(new THREE.BoxGeometry(h * 0.6, t, t), mat)
  bar.position.y = h * 0.7
  g.add(v, bar)
  return g
}

/** 금빛 고딕 제단 장식(레레도스): 뾰족 아치 칸과 성인 자리 */
export function reredosTexture() {
  return canvasTexture(1024, 768, (c) => {
    const g = c.createLinearGradient(0, 0, 0, 768)
    g.addColorStop(0, '#fff0b8')
    g.addColorStop(0.5, '#d9a440')
    g.addColorStop(1, '#8a5a1a')
    c.fillStyle = '#1a0e08'
    c.fillRect(0, 0, 1024, 768)
    const arch = (x: number, y: number, w: number, h: number) => {
      c.beginPath()
      c.moveTo(x, y + h)
      c.lineTo(x, y + w * 0.6)
      c.quadraticCurveTo(x, y, x + w / 2, y - w * 0.3)
      c.quadraticCurveTo(x + w, y, x + w, y + w * 0.6)
      c.lineTo(x + w, y + h)
      c.closePath()
    }
    // 바깥 틀
    c.fillStyle = g
    arch(20, 120, 984, 640)
    c.fill()
    // 일곱 칸 (가운데가 가장 높음)
    const cols = 7
    for (let i = 0; i < cols; i++) {
      const w = 110, gap = (984 - cols * w) / (cols + 1)
      const x = 20 + gap + i * (w + gap)
      const top = 260 + Math.abs(i - 3) * 50
      c.fillStyle = i === 3 ? '#3a1e10' : '#5a2a18'
      arch(x, top, w, 700 - top)
      c.fill()
      c.strokeStyle = '#fff2c0'
      c.lineWidth = 5
      c.stroke()
      // 성인 실루엣(칸마다 서 있는 상)
      if (i !== 3) {
        c.fillStyle = 'rgba(255,230,170,.75)'
        c.beginPath()
        c.ellipse(x + w / 2, top + 120, 18, 22, 0, 0, Math.PI * 2)
        c.fill()
        c.beginPath()
        c.moveTo(x + w / 2 - 30, 690)
        c.quadraticCurveTo(x + w / 2 - 34, top + 170, x + w / 2, top + 145)
        c.quadraticCurveTo(x + w / 2 + 34, top + 170, x + w / 2 + 30, 690)
        c.fill()
      }
      // 첨탑 장식
      c.fillStyle = '#fff2c0'
      c.beginPath()
      c.moveTo(x + w / 2, top - 120)
      c.lineTo(x + w / 2 - 10, top - 40)
      c.lineTo(x + w / 2 + 10, top - 40)
      c.fill()
    }
    c.strokeStyle = '#6a3a0a'
    c.lineWidth = 8
    arch(20, 120, 984, 640)
    c.stroke()
  })
}

/** 단청 천장(우물반자): 칸마다 연꽃 문양 */
export function dancheongCeiling(repeat: [number, number]) {
  return canvasTexture(256, 256, (c) => {
    c.fillStyle = '#2f6a58'
    c.fillRect(0, 0, 256, 256)
    c.fillStyle = '#7a2c1e'
    c.fillRect(0, 0, 256, 14)
    c.fillRect(0, 0, 14, 256)
    c.fillStyle = '#e8c27a'
    c.fillRect(14, 14, 242, 4)
    c.fillRect(14, 14, 4, 242)
    c.translate(135, 135)
    const ring = (n: number, r: number, len: number, wid: number, col: string) => {
      c.fillStyle = col
      for (let i = 0; i < n; i++) {
        c.rotate((Math.PI * 2) / n)
        c.beginPath()
        c.ellipse(r, 0, len, wid, 0, 0, Math.PI * 2)
        c.fill()
      }
    }
    c.fillStyle = '#1d3f80'
    c.beginPath()
    c.arc(0, 0, 100, 0, Math.PI * 2)
    c.fill()
    ring(16, 76, 22, 11, '#f2e3c2')
    ring(12, 50, 20, 10, '#c8553d')
    ring(8, 26, 14, 8, '#f6d24a')
    c.fillStyle = '#fff6dc'
    c.beginPath()
    c.arc(0, 0, 10, 0, Math.PI * 2)
    c.fill()
  }, repeat)
}

/** 붉은 기둥 위 단청 띠 */
export function dancheongBand(repeat: [number, number]) {
  return canvasTexture(512, 128, (c) => {
    c.fillStyle = '#2f7a63'
    c.fillRect(0, 0, 512, 128)
    for (let x = 0; x < 512; x += 128) {
      c.fillStyle = '#c8553d'
      c.fillRect(x + 6, 10, 116, 108)
      c.fillStyle = '#1d3f80'
      c.beginPath()
      c.arc(x + 64, 64, 44, 0, Math.PI * 2)
      c.fill()
      c.fillStyle = '#f2e3c2'
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2
        c.beginPath()
        c.ellipse(x + 64 + Math.cos(a) * 28, 64 + Math.sin(a) * 28, 12, 6, a, 0, Math.PI * 2)
        c.fill()
      }
      c.fillStyle = '#f6d24a'
      c.beginPath()
      c.arc(x + 64, 64, 12, 0, Math.PI * 2)
      c.fill()
    }
    c.fillStyle = '#111'
    c.fillRect(0, 0, 512, 5)
    c.fillRect(0, 123, 512, 5)
  }, repeat)
}

/** 따뜻한 나무 마루 */
export function maruTexture(repeat: [number, number]) {
  return canvasTexture(256, 256, (c) => {
    for (let i = 0; i < 8; i++) {
      const k = 0.85 + ((i * 37) % 10) / 40
      c.fillStyle = `rgb(${Math.round(176 * k)},${Math.round(122 * k)},${Math.round(72 * k)})`
      c.fillRect(0, i * 32, 256, 32)
      c.fillStyle = 'rgba(60,30,10,.35)'
      c.fillRect(0, i * 32, 256, 2)
      c.fillRect((i * 97) % 256, i * 32, 2, 32)
    }
  }, repeat)
}

/**
 * 실사 성상: public/statues/<id>.png(배경을 지운 사진)가 있으면 받침 위에 세우고 코드로 만든 상은 숨긴다.
 * PujaTime의 신상과 같은 방식(정면 사진을 카메라 쪽으로 돌려 세움). 파일이 없으면 코드 상이 그대로 남는다.
 * @param base 받침 윗면 가운데 위치, @param h 상의 높이(m), @param maxYaw 좌우로 돌아가는 최대 각도
 */
export function realStatue(ctx: BuildCtx, id: string, base: THREE.Vector3, h: number, fallback: THREE.Object3D, maxYaw = 0.5) {
  new THREE.TextureLoader().load(`/statues/${id}.png`, (tex) => {
    const img = tex.image as HTMLImageElement
    if (!img?.width) return
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry((h * img.width) / img.height, h),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.04, side: THREE.DoubleSide }),
    )
    plane.position.set(base.x, base.y + h / 2, base.z)
    const face = fallback.rotation.y
    ctx.scene.add(plane)
    fallback.visible = false
    ctx.every(() => {
      const a = Math.atan2(ctx.camera.position.x - plane.position.x, ctx.camera.position.z - plane.position.z)
      let d = a - face
      d = Math.atan2(Math.sin(d), Math.cos(d))
      plane.rotation.y = face + Math.max(-maxYaw, Math.min(maxYaw, d))
    })
  }, undefined, () => { /* 사진이 없으면 코드로 만든 상을 그대로 씀 */ })
}
