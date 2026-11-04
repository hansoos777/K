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

/** 현대 교회: 밝은 자연광, 참나무, 천창 빛이 떨어지는 나무 십자가, 곡선 의자, 피아노와 낮은 강단 (공연장 느낌 없이) */
export function buildModern(ctx: BuildCtx): Built {
  const { scene, high } = ctx
  const W = 20, Z0 = -22, Z1 = 12, H = 11
  scene.background = new THREE.Color('#e8e4dc')
  scene.fog = new THREE.Fog('#efe9df', 40, 90)
  scene.add(new THREE.HemisphereLight(0xffffff, 0xb8a890, 2.6))
  const sun = new THREE.DirectionalLight(0xfff4e2, 1.5)
  sun.position.set(14, 16, 6)
  scene.add(sun)
  const oak = std('#c8a476', { map: wood('#c09a6a') })
  const lightOak = std('#d8bc92', { map: wood('#d0b084') })
  const plaster = std('#f6f3ec')
  // 밝은 참나무 마루
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, Z1 - Z0), std('#d2b48a', { map: planks('#c8a476', [8, 14]) }))
  floor.rotation.x = -Math.PI / 2
  floor.position.z = (Z0 + Z1) / 2
  scene.add(floor)
  ctx.floor(floor)
  // 흰 회벽, 뒤·왼쪽 벽
  const wall = (w: number, h: number, x: number, y: number, z: number, ry: number, m: THREE.Material) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m)
    mesh.position.set(x, y, z)
    mesh.rotation.y = ry
    scene.add(mesh)
  }
  wall(Z1 - Z0, H, -W / 2, H / 2, (Z0 + Z1) / 2, Math.PI / 2, plaster)
  wall(W, H, 0, H / 2, Z1, Math.PI, plaster)
  // 오른쪽 벽: 바닥부터 천장까지 세로로 긴 창(맑은 유리, 낮의 빛)
  const glass = new THREE.MeshBasicMaterial({ color: 0xf4f8fb })
  for (let z = Z0 + 3; z < Z1 - 1; z += 3.2) {
    wall(1.2, H - 1.4, W / 2 - 0.02, H / 2, z, -Math.PI / 2, glass)
    scene.add(box(0.2, H, 2, plaster, W / 2 - 0.1, 0, z + 1.6))
    if (high) {
      const sh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 12), new THREE.MeshBasicMaterial({ color: 0xfff6e0, transparent: true, opacity: 0.08, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }))
      sh.position.set(W / 2 - 3, 4.5, z)
      sh.rotation.set(0, -Math.PI / 2, 0.55)
      scene.add(sh)
    }
  }
  // 나무 살 천장
  scene.add(box(W, 0.2, Z1 - Z0, plaster, 0, H, (Z0 + Z1) / 2))
  for (let x = -W / 2 + 0.5; x < W / 2; x += 0.6) scene.add(box(0.12, 0.25, Z1 - Z0, lightOak, x, H - 0.25, (Z0 + Z1) / 2))
  // 정면: 세로 나무 살 벽 + 단순한 나무 십자가 + 위에서 떨어지는 빛(천창)
  scene.add(box(W, H, 0.3, std('#eae4d8'), 0, 0, Z0))
  for (let x = -W / 2 + 0.3; x < W / 2; x += 0.42) scene.add(box(0.2, H, 0.18, oak, x, 0, Z0 + 0.25))
  const cr = cross(4.6, std('#8a6238', { map: wood('#7a5432') }), 0.32)
  cr.position.set(0, 3, Z0 + 0.5)
  scene.add(cr)
  const skylight = new THREE.Mesh(new THREE.PlaneGeometry(3.4, H), new THREE.MeshBasicMaterial({ color: 0xfff3d8, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending }))
  skylight.position.set(0, H / 2, Z0 + 0.6)
  scene.add(skylight, box(3.6, 0.1, 1.2, new THREE.MeshBasicMaterial({ color: 0xffffff }), 0, H - 0.05, Z0 + 0.8))
  const crossGlow = halo('#fff2d0', 7, 0.3)
  crossGlow.position.set(0, 5.2, Z0 + 0.7)
  scene.add(crossGlow)
  // 낮은 강단: 강대상(나무), 성찬상, 피아노, 화분
  const pZ = Z0 + 3.5
  scene.add(box(14, 0.45, 6, lightOak, 0, 0, pZ))
  for (let i = 0; i < 2; i++) scene.add(box(14, 0.22, 0.4, lightOak, 0, i * 0.22, pZ + 3.2 - i * 0.4 + 0.4))
  ctx.block({ x0: -7, z0: Z0, x1: 7, z1: pZ + 3.4 })
  const lectern = new THREE.Group()
  lectern.add(box(0.9, 1.15, 0.5, oak), box(1, 0.05, 0.6, std('#b08a5a'), 0, 1.15, 0))
  const bk = box(0.5, 0.05, 0.36, std('#fff8e8'), 0, 1.2, 0.04)
  bk.rotation.x = -0.25
  lectern.add(bk)
  lectern.position.set(-2.6, 0.45, pZ + 1)
  scene.add(lectern)
  scene.add(box(2.4, 0.9, 0.9, oak, 1.4, 0.45, pZ + 1.6), box(2.5, 0.04, 1, std('#fffaf2'), 1.4, 1.35, pZ + 1.6))
  scene.add(cyl(0.08, 0.1, 0.22, std('#c9a45c'), 1.0, 1.39, pZ + 1.6, 12), cyl(0.2, 0.2, 0.06, std('#d8b47a'), 1.8, 1.39, pZ + 1.6, 16))
  // 그랜드 피아노
  const piano = new THREE.Group()
  const black = std('#1a1a1c')
  const body = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.35, 24, 1, false, 0, Math.PI), black)
  body.scale.set(0.8, 1, 1.3)
  body.position.y = 0.85
  piano.add(body, box(1.6, 0.35, 0.5, black, 0, 0.68, 0.1), box(1.4, 0.04, 0.2, std('#f4f2ee'), 0, 1.03, 0.25))
  for (const [x, z] of [[-0.7, 0.2], [0.7, 0.2], [0, -1]] as const) piano.add(cyl(0.05, 0.05, 0.7, black, x, 0, z, 8))
  piano.position.set(4.8, 0.45, pZ + 0.6)
  piano.rotation.y = -0.5
  scene.add(piano)
  // 올리브 나무 화분
  for (const x of [-6.2, 6.4]) {
    scene.add(cyl(0.45, 0.35, 0.8, std('#d8d0c2'), x, 0.45, pZ - 1.6, 16), cyl(0.06, 0.08, 1.6, std('#7a6248'), x, 1.25, pZ - 1.6, 6))
    for (let i = 0; i < 7; i++) {
      const leaf = new THREE.Mesh(new THREE.IcosahedronGeometry(0.42, 1), std('#8a9a6a', { flatShading: true }))
      leaf.position.set(x + Math.cos(i) * 0.4, 3 + (i % 3) * 0.3, pZ - 1.6 + Math.sin(i * 1.7) * 0.35)
      scene.add(leaf)
    }
  }
  // 펜던트 조명(가는 막대 빛)
  for (let z = Z0 + 8; z < Z1 - 2; z += 5) for (const x of [-4, 4]) {
    scene.add(cyl(0.008, 0.008, 2.5, std('#444'), x, H - 2.5, z, 4), box(2.2, 0.06, 0.12, new THREE.MeshBasicMaterial({ color: 0xfff2d8 }), x, H - 2.6, z))
  }
  // 나무 장의자(등받이·옆판·다리) 두 줄 + 앉은 교인 + 빈 자리
  const pewWood = std('#c49d6c', { map: wood('#b8915e') })
  const people: Parameters<BuildCtx['crowd']>[0] = []
  let pi = 0
  const x0 = 1.0, x1 = W / 2 - 1.6, len = x1 - x0
  for (let r = 0; r < 10; r++) {
    const z = pZ + 5 + r * 1.2
    for (const side of [-1, 1]) {
      const xc = side * (x0 + len / 2)
      const pew = new THREE.Group()
      pew.add(
        box(len, 0.07, 0.46, pewWood, 0, 0.45, 0), // 앉는 판
        box(len, 0.5, 0.05, pewWood, 0, 0.8, 0.24), // 등받이
        box(len, 0.06, 0.08, pewWood, 0, 1.06, 0.25), // 등받이 위 손잡이
        box(len, 0.05, 0.05, pewWood, 0, 0.12, -0.1), // 아래 가로대
      )
      for (const ex of [-len / 2, len / 2]) pew.add(box(0.07, 1.0, 0.56, pewWood, ex, 0.5, 0.03)) // 옆판
      for (const lx of [-len / 4, len / 4]) pew.add(box(0.06, 0.42, 0.06, pewWood, lx, 0.21, -0.12))
      pew.position.set(xc, 0, z)
      scene.add(pew)
      ctx.block({ x0: xc - len / 2 - 0.05, z0: z - 0.3, x1: xc + len / 2 + 0.05, z1: z + 0.3 })
      for (let k = 0; k < 10; k++) {
        const x = side * (x0 + 0.4 + k * ((len - 0.8) / 9))
        if ((r * 7 + k + (side > 0 ? 3 : 0)) % 4 !== 0 && r < 9) people.push({ x, z: z - 0.03, y: 0.45, yaw: Math.PI, look: visitorLook('christian', pi++) })
        else ctx.seat(x, z - 0.03, 0.45, Math.PI)
      }
    }
  }
  ctx.crowd(people)
  ctx.spot('stage', 0, pZ + 4.6, 2)
  ctx.walk({ x0: -W / 2, z0: pZ + 3.4, x1: W / 2, z1: Z1 })
  return {
    spawn: [0, 7],
    yaw: 0,
    look: LOOKS.christian,
    dist: 8,
    maxDist: 14,
    pitch: 0.22,
    lookY: 2.2,
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
