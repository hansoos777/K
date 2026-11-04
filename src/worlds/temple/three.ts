import * as THREE from 'three'
import { bell, jukbi, moktak, sweepSound } from '../../core/audio'
import { Incense } from '../../engine/pt/incense'
import { brassEnv } from '../../engine/pt/kit'

/** 마당 쓸기 안내 문구 (화면 쪽에서 언어에 맞게 바꿔 넣음) */
export const sweepMsg = { half: '마당이 반쯤 깨끗해졌어요.', done: '마당을 다 쓸었어요. 마음도 맑아졌나요?' }
import { update } from '../../core/store'
import { LOOKS, visitorLook } from '../../engine/avatar'
import { bellMesh, box, bronze, cushion, cyl, halo, hanokRoof, lotusLantern, pine, ridge, sag, sky, std } from '../../engine/props'
import type { BuildCtx, Layout } from '../../engine/stage'
import { dancheong, planks, stone, wood } from '../../engine/tex'

type Built = Layout & { api: Record<string, () => void> }
const LANTERN = ['#ff5a4a', '#ffb347', '#ffe066', '#7ee08a', '#6fb4ff', '#ff8fc8', '#fff4e0']

/** 기와지붕 건물 한 채 (기둥·단청·창호·지붕) */
function hall(len: number, depth: number, height: number, doors: number) {
  const g = new THREE.Group()
  const pillar = std('#8c3a26', { roughness: 0.7 })
  const half = len / 2 - 0.4, hd = depth / 2 - 0.3
  for (let i = 0; i <= doors; i++) {
    const x = -half + (i * 2 * half) / doors
    g.add(cyl(0.22, 0.25, height, pillar, x, 0, hd, 14))
    g.add(cyl(0.22, 0.25, height, pillar, x, 0, -hd, 14))
  }
  // 창호: 은은히 빛나는 한지 격자문
  const hanji = new THREE.MeshStandardMaterial({ color: '#f3e2bd', emissive: '#ffcf7a', emissiveIntensity: 0.55, roughness: 0.9 })
  const lattice = std('#6b3a22')
  for (let i = 0; i < doors; i++) {
    const x = -half + ((i + 0.5) * 2 * half) / doors
    const w = (2 * half) / doors - 0.5
    g.add(box(w, height - 0.6, 0.06, hanji, x, 0.15, hd))
    for (let k = 1; k < 4; k++) g.add(box(0.04, height - 0.6, 0.08, lattice, x - w / 2 + (k * w) / 4, 0.15, hd))
    for (let k = 1; k < 5; k++) g.add(box(w, 0.04, 0.08, lattice, x, 0.15 + (k * (height - 0.6)) / 5, hd))
  }
  g.add(box(len - 0.6, height, depth - 0.7, std('#e9dcc2'), 0, 0, 0))
  // 단청 띠 (처마 아래)
  const band = new THREE.Mesh(new THREE.BoxGeometry(len - 0.2, 0.55, depth - 0.2), [
    std('#2f7a63', { map: dancheong() }), std('#2f7a63', { map: dancheong() }), std('#2f7a63'), std('#2f7a63'),
    std('#2f7a63', { map: dancheong() }), std('#2f7a63', { map: dancheong() }),
  ])
  band.position.y = height + 0.27
  g.add(band)
  const roof = hanokRoof(len + 2.6, depth + 2.4, Math.max(2.2, depth * 0.42), std('#3a3c40', { roughness: 0.6 }), 0.8)
  roof.position.y = height + 0.5
  g.add(roof)
  const ridgeTop = box(len - 1.4, 0.35, 0.4, std('#2a2c30'), 0, height + 0.5 + Math.max(2.2, depth * 0.42) - 0.2, 0)
  g.add(ridgeTop)
  return g
}

/** 사찰 마당 (해 질 녘) */
export function buildCourtyard(ctx: BuildCtx): Built {
  const { scene, high } = ctx
  sky(scene, [[0, '#6f8fb0'], [0.45, '#c9b8b0'], [0.62, '#f2c69a'], [1, '#f7dfb8']])
  scene.fog = new THREE.Fog('#d8c6b0', 30, 150)

  // 겹겹이 산
  const rc = ['#9fb0b8', '#8399a3', '#6b8576', '#4f6c5a']
  rc.forEach((c, i) => {
    const r = ridge(400, 40 - i * 7, c, i * 1.7 + 1, -150 + i * 28)
    r.position.y = -2
    scene.add(r)
  })
  // 땅과 돌길
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), std('#7d8a5a', { roughness: 1 }))
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)
  ctx.floor(ground)
  const yard = new THREE.Mesh(new THREE.PlaneGeometry(26, 22), std('#cbbfa4', { roughness: 1 }))
  yard.rotation.x = -Math.PI / 2
  yard.position.set(0, 0.01, -4)
  scene.add(yard)
  const path = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 22), std('#a59a86', { map: stone('#b0a690', [2, 10]) }))
  path.rotation.x = -Math.PI / 2
  path.position.set(0, 0.02, 14)
  scene.add(path)

  // 일주문
  const il = new THREE.Group()
  const p = std('#7a3020', { roughness: 0.7 })
  il.add(cyl(0.32, 0.34, 4.2, p, -1.8, 0, 0, 16), cyl(0.32, 0.34, 4.2, p, 1.8, 0, 0, 16))
  il.add(box(5.2, 0.7, 0.8, std('#2f7a63', { map: dancheong() }), 0, 3.8, 0))
  il.add(box(1.6, 0.6, 0.06, std('#1d2a3a'), 0, 3.0, 0.42))
  const ilRoof = hanokRoof(7, 3.4, 1.6, std('#3a3c40', { roughness: 0.6 }), 0.7)
  ilRoof.position.y = 4.5
  il.add(ilRoof)
  il.position.set(0, 0, 18)
  scene.add(il)
  ctx.block({ x0: -2.3, z0: 17.5, x1: -1.3, z1: 18.5 })
  ctx.block({ x0: 1.3, z0: 17.5, x1: 2.3, z1: 18.5 })

  // 대웅전 (돌 기단 위)
  const base = box(17, 1.1, 9.5, std('#b8ad98', { map: stone('#bdb29c', [6, 2]) }), 0, 0, -17)
  scene.add(base)
  for (let i = 0; i < 3; i++) scene.add(box(4, 0.37, 0.5, std('#c4b9a4'), 0, i * 0.37, -12 + (2 - i) * 0.5 - 0.2))
  const main = hall(15, 8, 4.2, 5)
  main.position.set(0, 1.1, -17)
  scene.add(main)
  ctx.block({ x0: -8.6, z0: -22, x1: 8.6, z1: -12.2 })
  // 현판
  scene.add(box(2.6, 0.8, 0.1, std('#1d2a3a'), 0, 5.8, -12.6), box(2.2, 0.5, 0.11, std('#d9b25a'), 0, 5.95, -12.58))

  // 석탑 (삼층)
  const tower = new THREE.Group()
  const ts = std('#bfb6a6', { roughness: 0.95 })
  tower.add(box(2.4, 0.8, 2.4, ts))
  for (let i = 0; i < 3; i++) {
    const w = 1.6 - i * 0.28
    tower.add(box(w, 0.9 - i * 0.1, w, ts, 0, 0.8 + i * 1.25, 0))
    tower.add(box(w + 0.9, 0.22, w + 0.9, ts, 0, 1.7 + i * 1.25 - i * 0.1, 0))
  }
  tower.add(cyl(0.06, 0.12, 1.4, bronze(), 0, 4.6, 0, 8))
  tower.position.set(-5, 0, -7)
  scene.add(tower)
  ctx.block({ x0: -6.4, z0: -8.4, x1: -3.6, z1: -5.6 })

  // 향로 (돌 받침 위 큰 청동 향로, 가는 연기 띠)
  scene.add(box(1.6, 0.7, 1.6, std('#b8ad98', { map: stone('#bdb29c', [1, 1]) }), 0, 0, -9.5))
  const inc = new Incense(brassEnv(), 1.7, { count: 3, smokeH: 3.6 })
  inc.group.position.set(0, 0.7, -9.5)
  scene.add(inc.group)
  ctx.block({ x0: -0.9, z0: -10.4, x1: 0.9, z1: -8.6 })
  ctx.every((t, dt) => inc.tick(t, dt))

  // 마당의 낙엽 (빗자루로 쓸면 밀려나며 사라짐)
  const LEAF = [0xc8862a, 0xb5562a, 0xd9a63a, 0x9a6a2a, 0xc87a3a]
  const leafGeo = new THREE.PlaneGeometry(0.2, 0.11)
  leafGeo.rotateX(-Math.PI / 2)
  const N = high ? 320 : 200
  const leaves = new THREE.InstancedMesh(leafGeo, new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide }), N)
  const lp: { x: number; z: number; r: number; s: number; gone: boolean }[] = []
  const ld = new THREE.Object3D()
  const lc = new THREE.Color()
  for (let i = 0; i < N; i++) {
    let x = 0, z = 0
    do { x = -11 + Math.random() * 22; z = -8 + Math.random() * 17 } while (Math.abs(x) < 1.2 && z > -10 && z < -8.4)
    lp.push({ x, z, r: Math.random() * Math.PI, s: 0.8 + Math.random() * 0.6, gone: false })
    lc.setHex(LEAF[i % LEAF.length])
    leaves.setColorAt(i, lc)
  }
  const placeLeaf = (i: number) => {
    const l = lp[i]
    ld.position.set(l.x, 0.03, l.z)
    ld.rotation.set(0, l.r, 0)
    ld.scale.setScalar(l.gone ? 0.0001 : l.s)
    ld.updateMatrix()
    leaves.setMatrixAt(i, ld.matrix)
  }
  lp.forEach((_, i) => placeLeaf(i))
  scene.add(leaves)
  let swept = 0, said = 0, swish = 0
  ctx.every((_t, dt) => {
    if (!ctx.isSweeping()) return
    const me = ctx.me()
    let changed = false
    swish -= dt
    lp.forEach((l, i) => {
      if (l.gone) return
      const dx = l.x - me.x, dz = l.z - me.z
      const d = Math.hypot(dx, dz)
      if (d > 1.2) return
      // 쓸린 낙엽은 바깥으로 밀려나며 작아지다 사라짐
      l.x += (dx / (d || 1)) * dt * 2.4
      l.z += (dz / (d || 1)) * dt * 2.4
      l.r += dt * 4
      l.s *= 1 - dt * 2.2
      if (l.s < 0.12) { l.gone = true; swept++ }
      placeLeaf(i)
      changed = true
      if (swish <= 0) { sweepSound(); swish = 0.45 }
    })
    if (changed) leaves.instanceMatrix.needsUpdate = true
    const pct = swept / N
    if (pct > 0.5 && said < 1) { said = 1; ctx.say(sweepMsg.half) }
    if (pct > 0.95 && said < 2) { said = 2; ctx.say(sweepMsg.done) }
  })

  // 범종각
  const pav = new THREE.Group()
  pav.add(box(5, 0.5, 5, std('#b8ad98', { map: stone('#bdb29c', [2, 2]) })))
  for (const x of [-1.9, 1.9]) for (const z of [-1.9, 1.9]) pav.add(cyl(0.18, 0.2, 3.6, p, x, 0.5, z, 12))
  pav.add(box(4.4, 0.4, 4.4, std('#2f7a63', { map: dancheong() }), 0, 4.1, 0))
  const pr = hanokRoof(5.8, 5.8, 2, std('#3a3c40', { roughness: 0.6 }), 0.7)
  pr.position.y = 4.5
  pav.add(pr)
  const big = bellMesh(0.9, 2, bronze(), 1.08)
  big.position.y = 1.4
  pav.add(big)
  pav.add(cyl(0.05, 0.05, 0.6, std('#333'), 0, 3.4, 0))
  const log = new THREE.Group()
  const logM = cyl(0.14, 0.14, 1.8, std('#8a6a44', { map: wood('#8a6a44') }), 0, -0.9, 0)
  logM.rotation.z = Math.PI / 2
  logM.position.set(-1.4, -0.4, 0)
  log.add(logM)
  log.position.set(0, 2.6, 0)
  pav.add(log)
  pav.position.set(10, 0, -3)
  scene.add(pav)
  ctx.block({ x0: 7.5, z0: -5.5, x1: 12.5, z1: -0.5 })
  let swing = 0
  ctx.every((_t, dt) => {
    if (swing > 0) {
      swing = Math.max(0, swing - dt)
      log.position.x = -Math.sin(swing * 4) * 0.5 * swing
    }
  })
  const strike = () => {
    swing = 1.2
    setTimeout(() => bell('beomjong'), 250)
  }
  ctx.tap(pav, strike, [10, 0.4])

  // 연등 줄
  const lanterns: { g: THREE.Group; on: boolean; color: string }[] = []
  const lines: [THREE.Vector3, THREE.Vector3][] = [
    [new THREE.Vector3(-10, 4, -10), new THREE.Vector3(10, 4, -10)],
    [new THREE.Vector3(-10, 4, -4), new THREE.Vector3(6, 4, -4)],
    [new THREE.Vector3(-10, 4, 2), new THREE.Vector3(10, 4, 2)],
  ]
  for (const [a, b] of lines) {
    for (const end of [a, b]) scene.add(cyl(0.06, 0.08, 4, std('#5a3a1a'), end.x, 0, end.z, 6))
    const pts = sag(a, b, 12, 1.2)
    const curve = new THREE.CatmullRomCurve3(pts)
    scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 30, 0.01, 4), std('#3a2a1a')))
    pts.slice(1, -1).forEach((pt, i) => {
      const color = LANTERN[(i + lanterns.length) % LANTERN.length]
      const lg = lotusLantern(color)
      lg.position.copy(pt).add(new THREE.Vector3(0, -0.35, 0))
      lg.scale.setScalar(0.9)
      scene.add(lg)
      lanterns.push({ g: lg, on: true, color })
    })
  }
  // 처음엔 꺼진(흐린) 상태
  const dim = (l: (typeof lanterns)[number], on: boolean) => {
    l.on = on
    l.g.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.MeshBasicMaterial | undefined
      if (!m) return
      if (o instanceof THREE.Sprite) o.visible = on
      else if (m.color && o.parent === l.g) m.color.set(on ? l.color : '#d9cfbf')
    })
  }
  lanterns.forEach((l) => dim(l, false))
  let litCount = 0
  const lightLantern = () => {
    const next = lanterns.find((l) => !l.on)
    if (!next) return false
    dim(next, true)
    litCount++
    update((s) => ({ lanterns: s.lanterns + 1 }))
    return true
  }
  lanterns.forEach((l) => ctx.tap(l.g, () => {
    if (!l.on) {
      dim(l, true)
      litCount++
      update((s) => ({ lanterns: s.lanterns + 1 }))
    }
  }))

  // 소나무
  const pines: [number, number][] = [[-14, 6], [-16, -6], [-13, -16], [14, 10], [16, -12], [-18, 14], [18, 2], [-9, 24], [9, 26], [-22, -2], [22, -20], [-20, -22]]
  pines.forEach(([x, z], i) => scene.add(pine(5 + (i % 3) * 1.5, x, z)))

  scene.add(new THREE.HemisphereLight('#ffe8cf', '#5a6a4a', 1.5))
  const sun = new THREE.DirectionalLight('#ffd2a0', 1.6)
  sun.position.set(-20, 18, 15)
  scene.add(sun)
  ctx.pointLight('#ffcf7a', 4, 12, [0, 3, -12])

  ctx.spot('gate', 0, 15.5, 2)
  ctx.spot('pagoda', -3.2, -5.2, 1.8)
  ctx.spot('burner', 0, -7.6, 1.6)
  ctx.spot('hall', 0, -11, 2.2)
  ctx.spot('bell', 10, 0.4, 1.8)
  ctx.npc(-1.2, -11.2, Math.PI, visitorLook('temple', 1), 'bow')
  ctx.npc(1.4, -11, Math.PI, visitorLook('temple', 2), 'pray')
  ctx.npc(-6.6, -4.6, -2.4, visitorLook('temple', 3), 'pray')
  ctx.npc(5, 6, 0.4, visitorLook('temple', 4), 'idle')
  ctx.walk({ x0: -16, z0: -12.2, x1: 16, z1: 24 })
  return {
    spawn: [0, 10],
    yaw: 0,
    look: LOOKS.temple,
    dist: 5.2,
    maxDist: 12,
    camBox: { min: [-40, 0.6, -40], max: [40, 20, 40] },
    api: {
      lantern: () => { lightLantern() },
      bell: () => ctx.walkTo(10, 0.4, strike),
      moktak: () => moktak(),
      incense: () => ctx.walkTo(0, -7.8, () => { ctx.face(0, -9.5); inc.light(180); ctx.pose('pray') }),
      lit: () => void litCount,
    },
  }
}

/** 명상실 (선방) */
export function buildMeditation(ctx: BuildCtx): Built & { api: Record<string, () => void> } {
  const { scene } = ctx
  scene.background = new THREE.Color('#0e0c0a')
  scene.fog = new THREE.Fog('#0e0c0a', 12, 30)
  const W = 12, Z0 = -8, Z1 = 6
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, Z1 - Z0), std('#8a6a44', { map: planks('#9a7448', [6, 7]), roughness: 0.6 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.z = (Z0 + Z1) / 2
  scene.add(floor)
  ctx.floor(floor)
  const wallM = std('#e8dcc2', { roughness: 0.95 })
  const hanji = new THREE.MeshStandardMaterial({ color: '#efe2c4', emissive: '#9ab0d8', emissiveIntensity: 0.35, roughness: 0.9 })
  const frame = std('#5a3a22')
  for (const [w, x, z, ry] of [[Z1 - Z0, -W / 2, (Z0 + Z1) / 2, Math.PI / 2], [W, 0, Z0, 0], [W, 0, Z1, Math.PI]] as number[][]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 4.5), wallM)
    m.position.set(x, 2.25, z)
    m.rotation.y = ry
    scene.add(m)
  }
  // 오른쪽 벽 전체가 달빛 드는 창호
  const win = new THREE.Mesh(new THREE.PlaneGeometry(Z1 - Z0, 4.5), hanji)
  win.position.set(W / 2, 2.25, (Z0 + Z1) / 2)
  win.rotation.y = -Math.PI / 2
  scene.add(win)
  for (let z = Z0; z <= Z1; z += 0.7) scene.add(box(0.06, 4.5, 0.05, frame, W / 2 - 0.04, 0, z))
  for (let y = 0.7; y < 4.5; y += 0.7) scene.add(box(0.06, 0.05, Z1 - Z0, frame, W / 2 - 0.04, y, (Z0 + Z1) / 2))
  // 기둥과 서까래
  const beam = std('#6b4a2c', { map: wood('#6b4a2c') })
  for (const x of [-W / 2 + 0.2, W / 2 - 0.2]) for (let z = Z0 + 0.2; z <= Z1; z += 4.6) scene.add(cyl(0.18, 0.2, 4.5, beam, x, 0, z, 12))
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, Z1 - Z0), std('#5a3a22', { map: planks('#5a3a22', [10, 2]) }))
  ceil.rotation.x = Math.PI / 2
  ceil.position.set(0, 4.5, (Z0 + Z1) / 2)
  scene.add(ceil)
  // 방석 줄
  for (let r = 0; r < 3; r++)
    for (let c = 0; c < 4; c++) {
      const cu = cushion(r === 1 && c === 1 ? '#8c3a2c' : '#6b2c24')
      cu.position.set(-3.6 + c * 2.4, 0, -4 + r * 2.4)
      scene.add(cu)
      const taken = (r === 0 && (c === 0 || c === 3)) || (r === 1 && c === 2)
      if (!taken) ctx.seat(cu.position.x, cu.position.z, 0.1, Math.PI)
    }
  // 앞쪽 작은 탁자, 향, 죽비
  scene.add(box(1.6, 0.4, 0.6, std('#4a2e1a', { map: wood('#4a2e1a') }), 0, 0, Z0 + 1))
  const inc = halo('#ffb080', 0.25, 0.9)
  inc.position.set(0.3, 0.75, Z0 + 1)
  scene.add(inc, cyl(0.12, 0.1, 0.18, std('#6a5a3a'), 0.3, 0.4, Z0 + 1))
  const stick = box(0.06, 0.04, 0.5, std('#c8a86a'), -0.4, 0.4, Z0 + 1)
  scene.add(stick)
  ctx.block({ x0: -0.9, z0: Z0 + 0.6, x1: 0.9, z1: Z0 + 1.4 })
  // 달빛
  const moon = new THREE.DirectionalLight('#a8c0ff', 1.0)
  moon.position.set(12, 8, 0)
  scene.add(moon)
  scene.add(new THREE.HemisphereLight('#c8c0b0', '#3a2a1a', 0.9))
  ctx.pointLight('#ffcf9a', 3, 8, [0, 1.6, Z0 + 1.5])
  ctx.spot('cushion', -1.2, -1.6, 1.2)
  ctx.npc(-3.6, -4, Math.PI, visitorLook('temple', 0), 'pray')
  ctx.npc(3.6, -4, Math.PI, visitorLook('temple', 3), 'pray')
  ctx.npc(1.2, -1.6, Math.PI, visitorLook('temple', 4), 'pray')
  ctx.walk({ x0: -W / 2, z0: Z0 + 0.5, x1: W / 2, z1: Z1 })
  const cushionPos: [number, number] = [-1.2, -1.6]
  return {
    spawn: [0, 0.6],
    yaw: 0,
    look: LOOKS.temple,
    dist: 4.4,
    maxDist: 7,
    camBox: { min: [-W / 2 + 0.3, 0.5, Z0 + 0.3], max: [W / 2 - 0.4, 4.2, Z1 - 0.3] },
    api: {
      sit: () => ctx.walkTo(cushionPos[0], cushionPos[1], () => ctx.pose('pray')),
      stand: () => ctx.pose('idle'),
      jukbi: () => jukbi(1),
    },
  }
}
