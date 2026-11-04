import * as THREE from 'three'
import { bell } from '../../core/audio'
import { LOOKS, visitorLook } from '../../engine/avatar'
import { box, cyl, glassWindow, pew, roundArch, std } from '../../engine/props'
import { lightShaft, sunburst } from '../../engine/pt/decor'
import { brass, brassEnv, canvasTexture, Flame, makeFlameTextures, marbleEnv } from '../../engine/pt/kit'
import { emptyCross } from '../../engine/pt/statues'
import type { BuildCtx, Layout } from '../../engine/stage'
import { stainedGlass, wood } from '../../engine/tex'

type Built = Layout & { api: Record<string, () => void> }

const carpet = () =>
  canvasTexture(128, 512, (c) => {
    c.fillStyle = '#6e1f2a'
    c.fillRect(0, 0, 128, 512)
    c.fillStyle = '#b8955a'
    c.fillRect(0, 0, 6, 512)
    c.fillRect(122, 0, 6, 512)
  }, [1, 8])

/** 짙은 호두나무 마루 */
const floorWood = () =>
  canvasTexture(256, 256, (c) => {
    for (let i = 0; i < 8; i++) {
      const k = 0.9 + ((i * 53) % 10) / 50
      c.fillStyle = `rgb(${Math.round(120 * k)},${Math.round(78 * k)},${Math.round(46 * k)})`
      c.fillRect(0, i * 32, 256, 32)
      c.fillStyle = 'rgba(30,15,5,.4)'
      c.fillRect(0, i * 32, 256, 2)
      c.fillRect((i * 89) % 256, i * 32, 2, 32)
    }
  }, [8, 20])

/** 우물 천장(격자 반자): 상아색 칸, 나무 테, 가운데 작은 금 장식 */
const coffer = () =>
  canvasTexture(256, 256, (c) => {
    c.fillStyle = '#6a4428'
    c.fillRect(0, 0, 256, 256)
    c.fillStyle = '#8a5c36'
    c.fillRect(10, 10, 236, 236)
    c.fillStyle = '#f1e8d6'
    c.fillRect(28, 28, 200, 200)
    c.strokeStyle = 'rgba(120,90,50,.35)'
    c.lineWidth = 4
    c.strokeRect(44, 44, 168, 168)
    c.fillStyle = '#c9a45c'
    c.beginPath()
    c.arc(128, 128, 18, 0, Math.PI * 2)
    c.fill()
    c.fillStyle = '#f1e8d6'
    c.beginPath()
    c.arc(128, 128, 8, 0, Math.PI * 2)
    c.fill()
  }, [6, 12])

/** 아래 벽 나무 판벽 */
const wainscot = () =>
  canvasTexture(256, 128, (c) => {
    c.fillStyle = '#5e3c22'
    c.fillRect(0, 0, 256, 128)
    c.strokeStyle = '#3e2412'
    c.lineWidth = 5
    for (let x = 0; x < 256; x += 64) c.strokeRect(x + 6, 12, 52, 104)
    c.fillStyle = '#b8955a'
    c.fillRect(0, 0, 256, 5)
  }, [14, 1])

/**
 * 전통 교회(개신교): 높은 우물 천장, 양쪽 2층 회중석(갤러리), 가운데 큰 오르간과 빈 십자가,
 * 공명판(덮개)이 있는 높은 강대상, 성찬상과 세례대. 예수상·성모상·성인상은 두지 않는다.
 */
export function buildChurch(ctx: BuildCtx): Built {
  const { scene, high } = ctx
  const W = 32, Z0 = -34, Z1 = 40, H = 22
  const GAL = 4.2 // 갤러리 깊이
  const GY = 5.4 // 갤러리 바닥 높이
  const env = brassEnv()
  const marble = marbleEnv()
  const gold = brass(env)
  const walnut = std('#5a3820', { map: wood('#5a3820') })
  scene.background = new THREE.Color('#2a2018')
  scene.fog = new THREE.Fog('#3a2c20', 50, 130)
  scene.add(new THREE.HemisphereLight(0xfff6e8, 0x8a6a48, 2.5))
  const sun = new THREE.DirectionalLight(0xfff0d6, 1.3)
  sun.position.set(10, 18, 8)
  scene.add(sun)

  // 바닥 + 가운데 통로 융단
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, Z1 - Z0), std('#fff', { map: floorWood() }))
  floor.rotation.x = -Math.PI / 2
  floor.position.z = (Z0 + Z1) / 2
  scene.add(floor)
  ctx.floor(floor)
  const aisle = new THREE.Mesh(new THREE.PlaneGeometry(2.4, Z1 - Z0 - 10), std('#fff', { map: carpet() }))
  aisle.rotation.x = -Math.PI / 2
  aisle.position.set(0, 0.015, (Z0 + 10 + Z1) / 2)
  scene.add(aisle)

  // 벽: 상아색 회벽 + 아래 판벽 + 흰 벽기둥
  const plaster = std('#f3ece0')
  const panel = std('#fff', { map: wainscot() })
  const wall = (w: number, h: number, x: number, y: number, z: number, ry: number, m: THREE.Material) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m)
    mesh.position.set(x, y, z)
    mesh.rotation.y = ry
    scene.add(mesh)
  }
  for (const s of [-1, 1]) {
    wall(Z1 - Z0, H, s * W / 2, H / 2, (Z0 + Z1) / 2, s > 0 ? -Math.PI / 2 : Math.PI / 2, plaster)
    wall(Z1 - Z0, 1.6, s * (W / 2 - 0.02), 0.8, (Z0 + Z1) / 2, s > 0 ? -Math.PI / 2 : Math.PI / 2, panel)
  }
  wall(W, H, 0, H / 2, Z1, Math.PI, plaster)
  wall(W, H, 0, H / 2, Z0, 0, std('#ece3d2'))
  const pilaster = new THREE.MeshMatcapMaterial({ matcap: marble, color: 0xfbf7ee })
  for (let z = Z0 + 6; z < Z1; z += 5)
    for (const s of [-1, 1]) {
      scene.add(box(0.7, H - 1, 0.5, pilaster, s * (W / 2 - 0.25), 0, z))
      scene.add(box(1, 0.5, 0.7, pilaster, s * (W / 2 - 0.35), H - 1.5, z))
    }

  // 우물 천장 + 처마 돌림띠
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, Z1 - Z0), new THREE.MeshBasicMaterial({ map: coffer() }))
  ceil.rotation.x = Math.PI / 2
  ceil.position.set(0, H, (Z0 + Z1) / 2)
  scene.add(ceil)
  for (const s of [-1, 1]) scene.add(box(1.2, 0.8, Z1 - Z0, new THREE.MeshMatcapMaterial({ matcap: marble, color: 0xf6efe2 }), s * (W / 2 - 0.6), H - 0.8, (Z0 + Z1) / 2))

  // 높은 창 (갤러리 위, 호박색 유리) + 빛줄기
  let seed = 31
  for (let z = Z0 + 8.5; z < Z1 - 1; z += 5)
    for (const s of [-1, 1]) {
      const g = glassWindow(roundArch(2, 6.4), stainedGlass(seed++, ['#f6e6b8', '#f2d58a', '#fff4d8', '#e8c070', '#f9edd0']), 1.4)
      g.position.set(s * (W / 2 - 0.03), GY + 3.2, z)
      g.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2
      scene.add(g)
      if (high && seed % 2) {
        const sh = lightShaft(3, 14, 0.13)
        sh.position.set(s * (W / 2 - 4), 7, z)
        sh.rotation.set(0, s > 0 ? -Math.PI / 2 : Math.PI / 2, s * 0.55)
        scene.add(sh)
      }
    }

  // 양쪽 2층 회중석(갤러리): 기둥 위 마루 + 난간 + 앉은 교인
  const galleryPeople: Parameters<BuildCtx['crowd']>[0] = []
  let gp = 0
  for (const s of [-1, 1]) {
    const gx = s * (W / 2 - GAL / 2)
    scene.add(box(GAL, 0.35, Z1 - Z0 - 14, walnut, gx, GY - 0.35, (Z0 + 12 + Z1 - 2) / 2))
    const rail = box(0.2, 1.1, Z1 - Z0 - 14, std('#fff', { map: wainscot() }), s * (W / 2 - GAL), GY, (Z0 + 12 + Z1 - 2) / 2)
    scene.add(rail, box(0.3, 0.08, Z1 - Z0 - 14, gold, s * (W / 2 - GAL), GY + 1.1, (Z0 + 12 + Z1 - 2) / 2))
    for (let z = Z0 + 14; z < Z1 - 2; z += 5) {
      scene.add(cyl(0.22, 0.26, GY - 0.35, pilaster, s * (W / 2 - GAL + 0.3), 0, z, 16))
      ctx.block({ x0: s * (W / 2 - GAL + 0.3) - 0.4, z0: z - 0.4, x1: s * (W / 2 - GAL + 0.3) + 0.4, z1: z + 0.4 })
    }
    for (let z = Z0 + 14; z < Z1 - 3; z += 1.4)
      for (let k = 0; k < 2; k++) {
        if ((Math.round(z * 3) + k + (s > 0 ? 1 : 0)) % 3 === 0) continue
        galleryPeople.push({ x: s * (W / 2 - 1.2 - k * 1.3), z, y: GY + 0.05, yaw: Math.PI, look: visitorLook('christian', gp++) })
      }
  }
  ctx.crowd(galleryPeople)

  // 강단: 넓은 단, 계단
  const pZ = Z0 + 5
  scene.add(box(W - GAL * 2 + 2, 1.2, 10, walnut, 0, 0, pZ))
  for (let i = 0; i < 5; i++) scene.add(box(8, 0.24, 0.45, walnut, 0, i * 0.24, pZ + 5 + (4 - i) * 0.45))
  ctx.block({ x0: -W / 2, z0: Z0, x1: W / 2, z1: pZ + 5.2 })

  // 가운데 큰 오르간: 나무 상자 + 금빛 파이프 세 탑 + 그 사이 빈 십자가
  const organ = new THREE.Group()
  organ.add(box(14, 4.2, 1.4, walnut, 0, 1.2, Z0 + 0.8))
  organ.add(box(14.6, 0.4, 1.6, gold, 0, 5.4, Z0 + 0.8))
  const tower = (cx: number, n: number, hMax: number) => {
    for (let i = 0; i < n; i++) {
      const t = i / (n - 1)
      const h = hMax * (0.7 + 0.3 * Math.sin(t * Math.PI))
      organ.add(cyl(0.17, 0.17, h, gold, cx - (n - 1) * 0.19 + i * 0.38, 5.8, Z0 + 0.8, 12))
    }
    organ.add(box(n * 0.38 + 0.5, 0.5, 1.2, walnut, cx, 5.8 + hMax + 0.2, Z0 + 0.8))
  }
  tower(-5, 9, 7)
  tower(5, 9, 7)
  scene.add(organ)
  const burst = sunburst(12, 0.42)
  burst.position.set(0, 12.4, Z0 + 0.3)
  scene.add(burst)
  ctx.every((_t, dt) => (burst.rotation.z += dt * 0.03))
  const cr = emptyCross(6.4, std('#6b4226', { map: wood('#6b4226') }))
  cr.position.set(0, 8.8, Z0 + 0.5) // 강대상 덮개보다 위
  scene.add(cr)

  // 성가대 (흰 가운) — 오르간 앞 두 줄
  const choir: Parameters<BuildCtx['crowd']>[0] = []
  for (let r = 0; r < 2; r++)
    for (let k = 0; k < 8; k++) {
      const x = (k < 4 ? -1 : 1) * (2.4 + (k % 4) * 1.1)
      choir.push({ x, z: Z0 + 2.8 + r * 1.1, y: 1.2 + r * 0.3, yaw: 0, look: { outfit: 'dress', skin: [0xf1d2b4, 0xe0b48c, 0xc8946a, 0x8a5a3a][(r + k) % 4], cloth: 0xf4efe4, trim: 0x6e1f2a, hair: [0x2a1f18, 0x5a3a20, 0x1c1410][k % 3] } })
    }
  ctx.crowd(choir)
  for (let r = 0; r < 2; r++) for (const side of [-1, 1]) {
    const p = pew(4.6, walnut)
    p.position.set(side * 4.1, 1.2 + r * 0.3, Z0 + 3 + r * 1.1)
    p.rotation.y = Math.PI
    scene.add(p)
  }

  // 높은 강대상 + 공명판(소리를 퍼뜨리는 덮개)
  const pulpit = new THREE.Group()
  pulpit.add(cyl(0.35, 0.5, 1.6, walnut, 0, 0, 0, 8))
  pulpit.add(cyl(1.1, 0.9, 1.4, walnut, 0, 1.6, 0, 8))
  pulpit.add(cyl(1.18, 1.18, 0.12, gold, 0, 3.0, 0, 8))
  const bible = box(0.8, 0.1, 0.56, std('#fff8e8'), 0, 3.12, 0.4)
  bible.rotation.x = -0.3
  pulpit.add(bible)
  pulpit.add(cyl(1.6, 1.6, 0.25, walnut, 0, 6.2, -0.4, 8), cyl(1.66, 1.66, 0.08, gold, 0, 6.15, -0.4, 8), cyl(0.15, 0.3, 0.8, gold, 0, 6.45, -0.4, 8))
  pulpit.add(box(0.2, 3.2, 0.2, walnut, 0, 3.0, -1.1))
  pulpit.position.set(0, 1.2, pZ + 1.4)
  scene.add(pulpit)
  for (let i = 0; i < 5; i++) scene.add(box(0.9, 0.3, 0.5, walnut, 1.6 - i * 0.05, 1.2 + i * 0.3, pZ + 2.6 - i * 0.3))

  // 성찬상 (흰 천, 성경, 촛불 두 개, 백합) + 세례대
  const tZ = pZ + 7.2
  scene.add(box(3.4, 1, 1.3, walnut, 0, 0, tZ), box(3.6, 0.06, 1.4, std('#fffaf0'), 0, 1, tZ), box(3.6, 0.6, 0.02, std('#fffaf0'), 0, 0.42, tZ + 0.71))
  ctx.block({ x0: -1.8, z0: tZ - 0.8, x1: 1.8, z1: tZ + 0.8 })
  const { flame: ft, glow: gt } = makeFlameTextures()
  const flames: Flame[] = []
  for (const x of [-1.2, 1.2]) {
    scene.add(cyl(0.1, 0.16, 0.4, gold, x, 1.06, tZ, 10), cyl(0.06, 0.06, 0.6, std('#f6efe0', { emissive: '#2a1e08' }), x, 1.46, tZ, 10))
    const f = new Flame(ft, gt, 0.26)
    f.group.position.set(x, 2.06, tZ)
    scene.add(f.group)
    flames.push(f)
  }
  const book = box(0.7, 0.08, 0.5, std('#fff8e8'), 0, 1.07, tZ)
  scene.add(book, box(0.74, 0.05, 0.54, std('#5a1a1a'), 0, 1.05, tZ))
  const lily = new THREE.IcosahedronGeometry(0.12, 1)
  for (const x of [-0.6, 0.6]) {
    scene.add(cyl(0.12, 0.09, 0.35, gold, x, 1.06, tZ - 0.3, 10))
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2
      const f = new THREE.Mesh(lily, std('#fffdf4', { emissive: '#3a3a30' }))
      f.position.set(x + Math.cos(a) * 0.15, 1.6 + (i % 2) * 0.12, tZ - 0.3 + Math.sin(a) * 0.12)
      f.scale.set(1, 1.4, 1)
      scene.add(f)
    }
  }
  const font = new THREE.Group()
  const stoneM = new THREE.MeshMatcapMaterial({ matcap: marble })
  font.add(cyl(0.25, 0.4, 0.9, stoneM, 0, 0, 0, 12), cyl(0.6, 0.3, 0.3, stoneM, 0, 0.9, 0, 16), cyl(0.5, 0.5, 0.02, std('#a8c8e0'), 0, 1.18, 0, 16))
  font.position.set(-5.2, 1.2, pZ + 3.6)
  scene.add(font)

  // 신랑의 놋쇠 샹들리에 (촛불 고리 두 단)
  for (let z = Z0 + 14; z < Z1 - 2; z += 8) {
    scene.add(cyl(0.02, 0.02, H - 11.2, std('#2a2010'), 0, 11.2, z, 4))
    for (const [ry, r] of [[11, 1.4], [11.8, 0.8]] as const) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.05, 8, 40), gold)
      ring.rotation.x = Math.PI / 2
      ring.position.set(0, ry, z)
      scene.add(ring)
      const n = r > 1 ? 10 : 6
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2
        const x = Math.cos(a) * r, zz = z + Math.sin(a) * r
        scene.add(cyl(0.035, 0.035, 0.22, std('#f6efe0', { emissive: '#2a1e08' }), x, ry, zz, 8))
        const f = new Flame(ft, gt, 0.16)
        f.group.position.set(x, ry + 0.22, zz)
        scene.add(f.group)
        flames.push(f)
      }
    }
    scene.add(cyl(0.2, 0.12, 0.6, gold, 0, 10.6, z, 12))
  }

  // 장의자 + 교인
  const people: Parameters<BuildCtx['crowd']>[0] = []
  let pi = 0
  const PW = 4.6
  for (let r = 0, z = pZ + 10; z <= Z1 - 4; z += 1.3, r++)
    for (const side of [-1, 1]) {
      const p = pew(PW, walnut)
      p.position.set(side * 3.9, 0, z)
      scene.add(p)
      for (let k = 0; k < 3; k++) {
        const x = side * (2.2 + k * 1.4)
        if ((r * 3 + k + (side > 0 ? 2 : 0)) % 4 === 0 || r > 11) { ctx.seat(x, z - 0.05, 0.36, Math.PI); continue }
        people.push({ x, z: z - 0.05, y: 0.36, yaw: Math.PI, look: visitorLook('christian', pi++), joined: pi % 5 === 0 })
      }
    }
  ctx.crowd(people)
  ctx.block({ x0: -6.4, z0: pZ + 9.6, x1: -1.3, z1: Z1 - 3.4 })
  ctx.block({ x0: 1.3, z0: pZ + 9.6, x1: 6.4, z1: Z1 - 3.4 })
  ctx.every((t) => flames.forEach((f) => f.tick(t)))

  ctx.spot('entrance', 0, Z1 - 2, 1.8)
  ctx.spot('pews', 0, -4, 1.8)
  ctx.spot('pulpit', 0, tZ + 1.6, 2)
  ctx.spot('organ', 4.5, pZ + 6, 1.8)
  ctx.walk({ x0: -W / 2 + GAL + 0.4, z0: pZ + 5.2, x1: W / 2 - GAL - 0.4, z1: Z1 })
  ctx.walk({ x0: -W / 2, z0: Z1 - 3, x1: W / 2, z1: Z1 })
  return {
    spawn: [0, Z1 - 11],
    yaw: 0,
    look: LOOKS.christian,
    dist: 9,
    maxDist: 16,
    pitch: 0.22,
    lookY: 3,
    camBox: { min: [-W / 2 + GAL + 0.6, 0.6, Z0 + 1], max: [W / 2 - GAL - 0.6, H - 1, Z1 - 0.4] },
    api: {
      bell: () => bell('church'),
      pray: () => ctx.walkTo(0, tZ + 1.6, () => ctx.pose('pray')),
    },
  }
}
