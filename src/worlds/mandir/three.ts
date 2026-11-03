import * as THREE from 'three'
import { bell } from '../../core/audio'
import { LOOKS, visitorLook } from '../../engine/avatar'
import { bellMesh, box, Candle, cyl, gold, halo, instances, sag, sky, std } from '../../engine/props'
import type { BuildCtx, Layout } from '../../engine/stage'
import { marble, rangoli, templeWall } from '../../engine/tex'

type Built = Layout & { api: Record<string, () => void> }

/** 시카라 탑: 층층이 줄어드는 곡면 탑 + 꼭대기 칼라시 */
function shikhara(h: number, r: number) {
  const g = new THREE.Group()
  const pts: THREE.Vector2[] = []
  for (let i = 0; i <= 20; i++) {
    const t = i / 20
    const rr = r * Math.pow(1 - t, 0.55) * (1 + 0.06 * Math.sin(t * Math.PI * 9))
    pts.push(new THREE.Vector2(Math.max(0.05, rr), t * h))
  }
  const body = new THREE.Mesh(new THREE.LatheGeometry(pts, 8), std('#e2a85a', { roughness: 0.75, flatShading: true }))
  body.rotation.y = Math.PI / 8
  g.add(body)
  // 세로 갈비뼈(우루슈링가) 느낌의 작은 탑들
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    const mini = new THREE.Mesh(new THREE.LatheGeometry(pts.map((p) => p.clone().multiplyScalar(0.42)), 6), std('#d6984a', { flatShading: true }))
    mini.position.set(Math.cos(a) * r * 0.82, 0, Math.sin(a) * r * 0.82)
    g.add(mini)
  }
  const amalaka = new THREE.Mesh(new THREE.TorusGeometry(r * 0.22, r * 0.1, 8, 16), std('#d6984a'))
  amalaka.rotation.x = Math.PI / 2
  amalaka.position.y = h * 0.97
  g.add(amalaka)
  const kalash = cyl(0.12, 0.3, 0.9, gold(), 0, h, 0, 12)
  g.add(kalash)
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.6), new THREE.MeshStandardMaterial({ color: '#ff7a1a', side: THREE.DoubleSide }))
  flag.position.set(0.6, h + 2.2, 0)
  g.add(flag, cyl(0.03, 0.03, 2.6, std('#5a3a1a'), 0, h + 0.4, 0, 6))
  return { g, flag }
}

/** 조각 기둥 */
function carvedPillar(h: number, mat: THREE.Material, trim: THREE.Material) {
  const g = new THREE.Group()
  g.add(box(0.7, 0.4, 0.7, mat))
  g.add(cyl(0.24, 0.24, h - 1, mat, 0, 0.4, 0, 8))
  for (let y = 1.0; y < h - 0.8; y += 0.9) g.add(cyl(0.3, 0.3, 0.14, trim, 0, y, 0, 8))
  g.add(box(0.8, 0.3, 0.8, trim, 0, h - 0.6, 0), box(1.1, 0.3, 0.5, mat, 0, h - 0.3, 0))
  return g
}

export function buildMandir(ctx: BuildCtx): Built {
  const { scene, high } = ctx
  sky(scene, [[0, '#2a1a3a'], [0.5, '#8a3a4a'], [0.72, '#f08a4a'], [1, '#ffd28a']])
  scene.fog = new THREE.Fog('#a8584a', 30, 120)

  // 바깥 마당
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), std('#c9a77a', { roughness: 1 }))
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)
  ctx.floor(ground)

  // 기단과 만다파 바닥(대리석)
  const plinth = box(14, 0.6, 22, std('#e6d6bc', { map: marble('#efe3cc', '#c9b08a', [3, 5]), roughness: 0.4 }), 0, 0, -8)
  scene.add(plinth)
  ctx.floor(plinth)
  for (let i = 0; i < 3; i++) scene.add(box(5, 0.2, 0.5, std('#e0cfb2'), 0, i * 0.2, 3.2 + (2 - i) * 0.5))

  const wallM = std('#8c2a14', { map: templeWall(), roughness: 0.7 })
  const stoneM = std('#e8b878', { roughness: 0.8 })
  const goldM = gold()

  // 만다파: 기둥 홀 (z 2 ~ -12)
  for (let z = 1; z >= -11; z -= 3)
    for (const x of [-5, -2.2, 2.2, 5]) {
      const p = carvedPillar(5, stoneM, goldM)
      p.position.set(x, 0.6, z)
      scene.add(p)
      ctx.block({ x0: x - 0.45, z0: z - 0.45, x1: x + 0.45, z1: z + 0.45 })
    }
  // 지붕판과 처마
  scene.add(box(13, 0.5, 15, std('#d89a5a'), 0, 5.6, -5))
  scene.add(box(14, 0.3, 16, std('#b8703a'), 0, 6.1, -5))
  for (let i = 0; i < 4; i++) scene.add(box(12 - i * 2.4, 0.6, 14 - i * 2.4, std(i % 2 ? '#e0a85a' : '#c8803a'), 0, 6.4 + i * 0.6, -5))
  // 옆벽 (붉은 금 무늬)
  for (const x of [-6.4, 6.4]) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(15, 5), wallM)
    w.position.set(x, 3.1, -5)
    w.rotation.y = x < 0 ? Math.PI / 2 : -Math.PI / 2
    scene.add(w)
  }
  // 성소(가르바그리하) + 시카라
  const sanctum = box(6, 6, 6, std('#d89a5a', { roughness: 0.8 }), 0, 0.6, -16)
  scene.add(sanctum)
  ctx.block({ x0: -3.2, z0: -19.5, x1: 3.2, z1: -12.8 })
  const { g: tower, flag } = shikhara(13, 3.4)
  tower.position.set(0, 6.6, -16)
  scene.add(tower)
  ctx.every((t) => (flag.rotation.y = Math.sin(t * 2) * 0.25))
  // 성소 문 + 금 토라나
  const door = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3.4), new THREE.MeshBasicMaterial({ color: '#ffb35a', toneMapped: false }))
  door.position.set(0, 2.3, -12.98)
  scene.add(door)
  const torana = new THREE.Mesh(new THREE.TorusGeometry(1.5, 0.12, 8, 32, Math.PI), goldM)
  torana.position.set(0, 3.95, -12.9)
  scene.add(torana, box(0.25, 3.4, 0.25, goldM, -1.5, 0.6, -12.9), box(0.25, 3.4, 0.25, goldM, 1.5, 0.6, -12.9))
  const sanctumGlow = halo('#ffc070', 7, 0.6)
  sanctumGlow.position.set(0, 2.5, -12.6)
  scene.add(sanctumGlow)
  // 아칸다 죠티(꺼지지 않는 등)
  const jyoti = new Candle(ctx, 0.3, 0.12, '#d9a040', true)
  jyoti.group.position.set(0, 0.6, -12.3)
  scene.add(jyoti.group, cyl(0.35, 0.2, 0.15, goldM, 0, 0.6, -12.3))

  // 랑골리 (만다파 한가운데)
  const rg = new THREE.Mesh(new THREE.CircleGeometry(1.8, 48), std('#fff', { map: rangoli(), roughness: 0.9 }))
  rg.rotation.x = -Math.PI / 2
  rg.position.set(0, 0.62, -6)
  scene.add(rg)

  // 금잔화 꽃줄 (기둥 사이)
  const marigold = new THREE.IcosahedronGeometry(0.09, 0)
  const orange = std('#ff8c1a', { roughness: 0.8, emissive: '#5a2000', emissiveIntensity: 0.3 })
  const yellow = std('#ffd21a', { roughness: 0.8, emissive: '#5a4000', emissiveIntensity: 0.3 })
  const o: THREE.Vector3[] = [], y: THREE.Vector3[] = []
  for (let z = 1; z >= -11; z -= 3) {
    sag(new THREE.Vector3(-5, 5.2, z), new THREE.Vector3(5, 5.2, z), 40, 1).forEach((p, i) => (i % 2 ? o : y).push(p))
  }
  for (const x of [-5, 5]) sag(new THREE.Vector3(x, 5.2, 1), new THREE.Vector3(x, 5.2, -11), 50, 0.8).forEach((p, i) => (i % 2 ? y : o).push(p))
  scene.add(instances(marigold, orange, o), instances(marigold, yellow, y))

  // 큰 종 (입구 위)
  const bg = new THREE.Group()
  const bm = bellMesh(0.35, 0.7, goldM)
  bg.add(bm, cyl(0.02, 0.02, 1.2, std('#3a2a1a'), 0, 0.7, 0, 6))
  bg.position.set(0, 3.4, 2.2)
  scene.add(bg)
  let swing = 0
  ctx.every((_t, dt) => {
    if (swing <= 0) return
    swing = Math.max(0, swing - dt)
    bg.rotation.x = Math.sin(swing * 9) * 0.35 * swing
  })
  const ring = () => {
    swing = 1.4
    bell('ghanta')
  }
  ctx.tap(bg, ring, [0, 3])

  // 디야 줄 (입구 계단 양옆)
  const diyas: Candle[] = []
  for (let i = 0; i < 12; i++) {
    const side = i < 6 ? -1 : 1
    const k = i % 6
    const d = new Candle(ctx, 0.05, 0.05, '#b5652a')
    d.group.position.set(side * (1.2 + k * 0.5), 0.62, 2.6)
    const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 6, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), std('#b5652a'))
    bowl.position.set(d.group.position.x, 0.7, 2.6)
    scene.add(d.group, bowl)
    diyas.push(d)
  }
  let lit = 0
  const lightDiya = () => {
    if (lit >= diyas.length) return
    diyas[lit++].set(true)
  }

  // 바깥 정원: 야자수 대신 둥근 나무, 등불 기둥
  for (const [x, z] of [[-12, 6], [12, 8], [-14, -10], [14, -14], [-10, 16], [10, 18]] as [number, number][]) {
    const tr = new THREE.Group()
    tr.add(cyl(0.18, 0.25, 3, std('#6a4a2a'), 0, 0, 0, 8))
    const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 1), std('#4a7a3a', { flatShading: true }))
    crown.position.y = 3.6
    tr.add(crown)
    tr.position.set(x, 0, z)
    scene.add(tr)
  }
  for (const x of [-3, 3]) for (const z of [8, 13]) {
    scene.add(cyl(0.08, 0.12, 1.6, goldM, x, 0, z, 8))
    const l = halo('#ffc060', 1.4, 0.9)
    l.position.set(x, 1.8, z)
    scene.add(l)
  }

  scene.add(new THREE.HemisphereLight('#ffd8b0', '#7a4a2a', 1.6))
  const sun = new THREE.DirectionalLight('#ffb070', 1.5)
  sun.position.set(-15, 12, 18)
  scene.add(sun)
  ctx.pointLight('#ffb35a', 10, 18, [0, 3, -10])
  if (high) ctx.pointLight('#ff9a4a', 5, 10, [0, 2, 3])

  // 안내 지점
  ctx.spot('gate', 0, 6, 2)
  ctx.spot('bell', 0, 3.2, 1.4)
  ctx.spot('rangoli', 0, -4, 1.8)
  ctx.spot('sanctum', 0, -10.5, 2)
  // 방문객 (연출)
  ctx.npc(-1.6, -9.6, Math.PI, visitorLook('mandir', 1), 'pray')
  ctx.npc(1.5, -9.8, Math.PI, visitorLook('mandir', 2), 'bow')
  ctx.npc(-3.4, -6.5, Math.PI * 0.8, visitorLook('mandir', 3), 'pray')
  ctx.npc(3.6, -2, -Math.PI * 0.6, visitorLook('mandir', 4), 'idle')
  ctx.npc(-6, 8, 0.6, visitorLook('mandir', 5), 'idle')
  // 아르티: 등불을 시계 방향으로 돌리며 노래 — 종과 디야를 함께
  const aarti = () => {
    ctx.walkTo(0, -10.5, () => {
      ctx.pose('pray')
      ring()
      for (let i = 0; i < diyas.length; i++) setTimeout(lightDiya, i * 150)
    })
  }
  ctx.walk({ x0: -20, z0: 2.8, x1: 20, z1: 24 })
  ctx.walk({ x0: -6.2, z0: -12.8, x1: 6.2, z1: 3.6 })
  return {
    spawn: [0, 14],
    yaw: 0,
    look: LOOKS.mandir,
    dist: 5,
    maxDist: 11,
    camBox: { min: [-30, 0.8, -30], max: [30, 5.2, 30] }, // 만다파 지붕(5.6m) 아래로
    api: {
      bell: () => ctx.walkTo(0, 3, ring),
      diya: () => lightDiya(),
      pray: () => ctx.walkTo(0, -10.5, () => ctx.pose('pray')),
      aarti,
    },
  }
}
