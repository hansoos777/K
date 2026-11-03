import * as THREE from 'three'
import { bell } from '../../core/audio'
import { LOOKS, visitorLook } from '../../engine/avatar'
import { box, Candle, cross, cyl, glassWindow, gold, halo, organ, pew, pointedArch, roundArch, std } from '../../engine/props'
import type { BuildCtx, Layout } from '../../engine/stage'
import { planks, stainedGlass, wood } from '../../engine/tex'

type Built = Layout & { api: Record<string, () => void> }

function room(ctx: BuildCtx, W: number, Z0: number, Z1: number, H: number, wallM: THREE.Material, floorM: THREE.Material) {
  const { scene } = ctx
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, Z1 - Z0), floorM)
  floor.rotation.x = -Math.PI / 2
  floor.position.z = (Z0 + Z1) / 2
  scene.add(floor)
  ctx.floor(floor)
  for (const [w, x, z, ry] of [[Z1 - Z0, -W / 2, (Z0 + Z1) / 2, Math.PI / 2], [Z1 - Z0, W / 2, (Z0 + Z1) / 2, -Math.PI / 2], [W, 0, Z0, 0], [W, 0, Z1, Math.PI]] as number[][]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, H), wallM)
    m.position.set(x, H / 2, z)
    m.rotation.y = ry
    scene.add(m)
  }
}

/** 전통 교회: 흰 벽, 나무 트러스 천장, 높은 강단, 파이프 오르간 */
export function buildTraditional(ctx: BuildCtx): Built {
  const { scene } = ctx
  scene.background = new THREE.Color('#1a1612')
  scene.fog = new THREE.Fog('#1a1612', 22, 44)
  const W = 13, Z0 = -22, Z1 = 7, H = 7
  room(ctx, W, Z0, Z1, H, std('#f3ede2', { roughness: 0.95 }), std('#a07a50', { map: planks('#9a7448', [6, 12]), roughness: 0.6 }))
  // 박공 천장 + 나무 트러스
  const roofM = std('#6b4a2c', { map: planks('#6b4a2c', [2, 10]), side: THREE.DoubleSide })
  for (const s of [-1, 1]) {
    const tilt = new THREE.Group()
    const r = new THREE.Mesh(new THREE.PlaneGeometry(W / 2 / Math.cos(0.6) + 0.4, Z1 - Z0), roofM)
    r.rotation.x = Math.PI / 2
    tilt.add(r)
    tilt.rotation.z = -s * 0.6
    tilt.position.set(s * W / 4, H + Math.tan(0.6) * W / 4, (Z0 + Z1) / 2)
    scene.add(tilt)
  }
  const truss = std('#5a3a22', { map: wood('#5a3a22') })
  for (let z = Z0 + 2; z < Z1; z += 3) {
    const t = new THREE.Group()
    t.add(box(W, 0.3, 0.3, truss, 0, H - 0.15, 0))
    for (const s of [-1, 1]) {
      const b = box(W / 2 / Math.cos(0.6), 0.28, 0.28, truss)
      b.position.set(s * W / 4, H + Math.tan(0.6) * W / 4 - 0.1, 0)
      b.rotation.z = -s * 0.6
      t.add(b)
    }
    t.add(box(0.25, Math.tan(0.6) * W / 2, 0.25, truss, 0, H, 0))
    t.position.z = z
    scene.add(t)
  }
  // 둥근 아치 색유리 창
  let seed = 11
  for (let z = Z0 + 3.5; z < Z1 - 2; z += 3.5)
    for (const s of [-1, 1]) {
      const g = glassWindow(roundArch(1.3, 3.8), stainedGlass(seed++, ['#3b6fb8', '#e8c24a', '#c0392b', '#2f8f5b', '#8a4fb0']), 1.5)
      g.position.set(s * (W / 2 - 0.02), 1.8, z)
      g.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2
      scene.add(g)
    }
  // 강단 (높은 단 + 설교대 + 성찬상 + 십자가)
  scene.add(box(W, 0.9, 6, std('#7a5634', { map: planks('#7a5634', [4, 2]) }), 0, 0, Z0 + 3))
  for (let i = 0; i < 3; i++) scene.add(box(5, 0.3, 0.45, std('#8a6238'), 0, i * 0.3, Z0 + 6 + (2 - i) * 0.45))
  ctx.block({ x0: -W / 2, z0: Z0, x1: W / 2, z1: Z0 + 6 })
  const pulpit = new THREE.Group()
  pulpit.add(box(1.4, 1.3, 0.9, std('#5a3a22', { map: wood('#5a3a22') })), box(1.6, 0.08, 1.1, std('#7a5634'), 0, 1.3, 0), box(0.6, 0.5, 0.02, std('#e8dcc0'), 0, 0.5, 0.46))
  pulpit.position.set(0, 0.9, Z0 + 4.6)
  scene.add(pulpit)
  scene.add(box(2.4, 0.9, 0.9, std('#6b4a2c', { map: wood() }), 0, 0, Z0 + 7.6), box(2.5, 0.04, 1, std('#f4efe4'), 0, 0.9, Z0 + 7.6))
  ctx.block({ x0: -1.3, z0: Z0 + 7.1, x1: 1.3, z1: Z0 + 8.1 })
  const cr = cross(2.8, std('#c8a86a', { roughness: 0.4 }), 0.18)
  cr.position.set(0, 3.2, Z0 + 0.1)
  scene.add(cr)
  const crGlow = halo('#fff0c8', 5, 0.25)
  crGlow.position.set(0, 4.6, Z0 + 0.3)
  scene.add(crGlow)
  // 성가대석과 오르간
  for (const s of [-1, 1]) for (let r = 0; r < 2; r++) {
    const p = pew(2.6, std('#6b4a2c', { map: wood() }))
    p.position.set(s * 4.2, 0.9, Z0 + 1.6 + r * 1.1)
    p.rotation.y = Math.PI
    scene.add(p)
  }
  const org = organ(15, 4.2, 3.4)
  org.position.set(0, 0.9, Z0 + 0.6)
  org.position.x = 4.2
  scene.add(org)
  // 장의자
  const pewM = std('#a0703f', { map: wood('#8a5a30'), roughness: 0.55 })
  for (let z = Z0 + 10; z <= Z1 - 3.5; z += 1.15)
    for (const x of [-3.3, 3.3]) {
      const p = pew(4.6, pewM)
      p.position.set(x, 0, z)
      scene.add(p)
    }
  ctx.block({ x0: -5.8, z0: Z0 + 9.6, x1: -0.9, z1: Z1 - 3 })
  ctx.block({ x0: 0.9, z0: Z0 + 9.6, x1: 5.8, z1: Z1 - 3 })
  // 펜던트 조명
  for (let z = Z0 + 6; z < Z1; z += 6) for (const x of [-3, 3]) {
    scene.add(cyl(0.01, 0.01, 2, std('#222'), x, H - 2, z, 4))
    const l = halo('#ffe0a0', 1.4, 0.9)
    l.position.set(x, H - 2.1, z)
    scene.add(l, cyl(0.25, 0.12, 0.25, gold(), x, H - 2.2, z, 12))
  }
  scene.add(new THREE.HemisphereLight('#fff4e0', '#6a5034', 1.7))
  scene.add(new THREE.AmbientLight('#fff0dc', 0.3))
  const sun = new THREE.DirectionalLight('#ffe6c0', 1.2)
  sun.position.set(8, 12, 6)
  scene.add(sun)
  ctx.pointLight('#ffe0b0', 8, 16, [0, 4, Z0 + 5])
  ctx.spot('entrance', 0, 4, 1.6)
  ctx.spot('pews', 0, -6, 1.6)
  ctx.spot('pulpit', 0, Z0 + 9, 2)
  ctx.spot('organ', 4, Z0 + 7.4, 1.6)
  ctx.npc(-2, Z0 + 10, Math.PI, visitorLook('christian', 1), 'pray')
  ctx.npc(3.4, Z0 + 11.15, Math.PI, visitorLook('christian', 2), 'pray')
  ctx.npc(-4.4, Z0 + 13.45, Math.PI, visitorLook('christian', 3), 'idle')
  ctx.walk({ x0: -W / 2, z0: Z0 + 6.5, x1: W / 2, z1: Z1 })
  return {
    spawn: [0, 1.5],
    yaw: 0,
    look: LOOKS.christian,
    dist: 4.6,
    maxDist: 9,
    camBox: { min: [-W / 2 + 0.4, 0.5, Z0 + 0.5], max: [W / 2 - 0.4, H + 1.5, Z1 - 0.3] },
    api: { bell: () => bell('church') },
  }
}

/** 현대 교회: 무대·LED 스크린·움직이는 조명 */
export function buildModern(ctx: BuildCtx): Built {
  const { scene, high } = ctx
  scene.background = new THREE.Color('#06070c')
  scene.fog = new THREE.Fog('#06070c', 20, 50)
  const W = 24, Z0 = -16, Z1 = 14, H = 10
  room(ctx, W, Z0, Z1, H, std('#14161f', { roughness: 0.9 }), std('#2a2c36', { roughness: 0.7 }))
  // 무대
  const stage = box(18, 1, 7, std('#1b1d26', { roughness: 0.4, metalness: 0.2 }), 0, 0, Z0 + 3.5)
  scene.add(stage)
  const edge = box(18, 0.06, 0.06, new THREE.MeshBasicMaterial({ color: '#5a6cff', toneMapped: false }), 0, 1, Z0 + 7)
  scene.add(edge)
  ctx.block({ x0: -9, z0: Z0, x1: 9, z1: Z0 + 7 })
  // LED 스크린 (천천히 색이 흐름)
  const screenMat = new THREE.MeshBasicMaterial({ color: '#2a3a8a', toneMapped: false })
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(13, 5.5), screenMat)
  scr.position.set(0, 5.2, Z0 + 0.1)
  scene.add(scr)
  ;[-1, 1].forEach((s) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.6), screenMat)
    m.position.set(s * 10, 5.5, Z0 + 0.5)
    m.rotation.y = -s * 0.35
    scene.add(m)
  })
  const lc = cross(3, new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }), 0.22)
  lc.position.set(0, 3.6, Z0 + 0.15)
  scene.add(lc)
  const c1 = new THREE.Color('#2a3a9a'), c2 = new THREE.Color('#8a2a7a'), c3 = new THREE.Color('#1a6a8a')
  ctx.every((t) => {
    const k = (Math.sin(t * 0.3) + 1) / 2, j = (Math.sin(t * 0.17 + 1) + 1) / 2
    screenMat.color.copy(c1).lerp(c2, k).lerp(c3, j * 0.5)
  })
  // 악기: 드럼, 건반, 마이크
  const kit = new THREE.Group()
  const shell = std('#a8a8b8', { metalness: 0.5, roughness: 0.3 })
  kit.add(cyl(0.45, 0.45, 0.5, shell, 0, 1, 0), cyl(0.28, 0.28, 0.3, shell, -0.7, 1.5, 0.2), cyl(0.28, 0.28, 0.3, shell, 0.7, 1.5, 0.2), cyl(0.4, 0.4, 0.02, gold(), -1.1, 2.2, 0.4), cyl(0.4, 0.4, 0.02, gold(), 1.1, 2.3, 0.4))
  kit.position.set(4, 0, Z0 + 2.5)
  scene.add(kit, box(2, 0.12, 0.6, std('#111'), -4, 1.9, Z0 + 3), box(0.08, 0.9, 0.08, std('#333'), -4.8, 1, Z0 + 3), box(0.08, 0.9, 0.08, std('#333'), -3.2, 1, Z0 + 3))
  for (const x of [-1.5, 0, 1.5]) scene.add(cyl(0.02, 0.03, 1.5, std('#555', { metalness: 0.6 }), x, 1, Z0 + 5.5, 6), cyl(0.05, 0.05, 0.14, std('#222'), x, 2.5, Z0 + 5.5, 8))
  // 움직이는 조명 빔
  const beams: THREE.Mesh[] = []
  const beamColors = ['#5a6cff', '#ff5aa8', '#ffe8a8', '#5affd8', '#a85aff']
  for (let i = 0; i < (high ? 8 : 4); i++) {
    const g = new THREE.ConeGeometry(1.2, 12, 16, 1, true)
    g.translate(0, -6, 0)
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: beamColors[i % 5], transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }))
    m.position.set(-8 + i * (16 / ((high ? 8 : 4) - 1)), H - 0.3, Z0 + 4)
    scene.add(m)
    beams.push(m)
  }
  ctx.every((t) => beams.forEach((b, i) => {
    b.rotation.z = Math.sin(t * 0.6 + i) * 0.5
    b.rotation.x = 0.3 + Math.cos(t * 0.45 + i * 1.7) * 0.35
  }))
  // 의자 (InstancedMesh 한 번에)
  const seats: THREE.Matrix4[] = []
  const d = new THREE.Object3D()
  for (let r = 0; r < 9; r++) {
    const n = 14 + r
    for (let c = 0; c < n; c++) {
      const x = -((n - 1) * 0.75) / 2 + c * 0.75
      if (Math.abs(x) < 0.9) continue
      d.position.set(x, 0, Z0 + 10 + r * 1.2)
      d.rotation.y = Math.atan2(x, 18) * 0.6
      d.updateMatrix()
      seats.push(d.matrix.clone())
    }
  }
  const chairGeo = new THREE.BoxGeometry(0.55, 0.9, 0.55)
  chairGeo.translate(0, 0.45, 0)
  const chairs = new THREE.InstancedMesh(chairGeo, std('#2a2e48', { roughness: 0.8 }), seats.length)
  seats.forEach((m, i) => chairs.setMatrixAt(i, m))
  scene.add(chairs)
  ctx.block({ x0: -10, z0: Z0 + 9.5, x1: -0.9, z1: Z0 + 20.5 })
  ctx.block({ x0: 0.9, z0: Z0 + 9.5, x1: 10, z1: Z0 + 20.5 })
  // 객석 조명
  scene.add(new THREE.HemisphereLight('#6a7aff', '#1a1020', 0.9))
  const front = new THREE.DirectionalLight('#ffe8d0', 1.2)
  front.position.set(0, 8, 10)
  scene.add(front)
  ctx.pointLight('#7a8aff', 12, 20, [0, 6, Z0 + 4])
  ctx.pointLight('#ff6ab0', 6, 14, [-8, 4, Z0 + 3])
  ctx.spot('stage', 0, Z0 + 8, 2.2)
  ctx.npc(-2, Z0 + 10, Math.PI, visitorLook('christian', 0), 'idle')
  ctx.npc(2.6, Z0 + 11.2, Math.PI, visitorLook('christian', 2), 'pray')
  ctx.npc(-4, Z0 + 12.4, Math.PI, visitorLook('christian', 4), 'idle')
  ctx.walk({ x0: -W / 2, z0: Z0 + 7.2, x1: W / 2, z1: Z1 })
  return {
    spawn: [0, 5],
    yaw: 0,
    look: LOOKS.christian,
    dist: 5.4,
    maxDist: 11,
    camBox: { min: [-W / 2 + 0.4, 0.5, Z0 + 0.5], max: [W / 2 - 0.4, H - 0.5, Z1 - 0.3] },
    api: {},
  }
}

/** 기도실: 작고 조용한 방, 촛불 하나와 나무 십자가 */
export function buildPrayer(ctx: BuildCtx): Built {
  const { scene } = ctx
  scene.background = new THREE.Color('#0d0a08')
  scene.fog = new THREE.Fog('#0d0a08', 10, 22)
  const W = 7, Z0 = -5, Z1 = 5, H = 4
  room(ctx, W, Z0, Z1, H, std('#d8c8b0', { roughness: 0.95 }), std('#7a5634', { map: planks('#7a5634', [4, 6]) }))
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, Z1 - Z0), std('#4a3220'))
  ceil.rotation.x = Math.PI / 2
  ceil.position.set(0, H, 0)
  scene.add(ceil)
  // 나무 십자가
  const cr = cross(1.8, std('#7b5532', { map: wood('#7b5532') }), 0.14)
  cr.position.set(0, 1.4, Z0 + 0.1)
  scene.add(cr)
  // 창 (밤하늘과 달)
  const win = glassWindow(pointedArch(1.2, 2), stainedGlass(77, ['#1a2a5a', '#2a3a7a', '#3a4a8a', '#e3d6a0', '#1a2a5a']), 1.2)
  win.position.set(-W / 2 + 0.02, 1.2, -1)
  win.rotation.y = Math.PI / 2
  scene.add(win)
  // 탁자, 성경, 촛불
  scene.add(box(1.4, 0.8, 0.6, std('#5a3a22', { map: wood('#5a3a22') }), 0, 0, Z0 + 1.2))
  scene.add(box(0.5, 0.08, 0.36, std('#6a1e1e'), -0.3, 0.8, Z0 + 1.2), box(0.46, 0.06, 0.32, std('#f4ecd8'), -0.3, 0.86, Z0 + 1.2))
  const c = new Candle(ctx, 0.35, 0.05, '#f3ead6', true)
  c.group.position.set(0.35, 0.8, Z0 + 1.2)
  scene.add(c.group)
  const g = halo('#ffcf6a', 3.5, 0.35)
  g.position.set(0.35, 1.3, Z0 + 1.2)
  scene.add(g)
  scene.add(box(1.6, 0.2, 0.4, std('#5a3d24', { map: wood() }), 0, 0, Z0 + 2.3))
  ctx.block({ x0: -0.8, z0: Z0 + 0.8, x1: 0.8, z1: Z0 + 1.6 })
  scene.add(new THREE.HemisphereLight('#e8d0a8', '#2a1a10', 0.9))
  ctx.pointLight('#ffc070', 6, 9, [0.35, 1.4, Z0 + 1.4])
  const moon = new THREE.DirectionalLight('#9ab0ff', 0.5)
  moon.position.set(-6, 4, -1)
  scene.add(moon)
  ctx.spot('table', 0, Z0 + 2.9, 1.2)
  ctx.walk({ x0: -W / 2, z0: Z0 + 1.6, x1: W / 2, z1: Z1 })
  return {
    spawn: [0, 0.2],
    yaw: 0,
    look: LOOKS.christian,
    dist: 3.8,
    maxDist: 5,
    camBox: { min: [-W / 2 + 0.3, 0.5, Z0 + 0.3], max: [W / 2 - 0.3, H - 0.3, Z1 - 0.3] },
    api: { kneel: () => ctx.walkTo(0, Z0 + 2.9, () => ctx.pose('pray')), stand: () => ctx.pose('idle') },
  }
}
