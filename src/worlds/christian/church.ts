import * as THREE from 'three'
import { bell } from '../../core/audio'
import { LOOKS, visitorLook } from '../../engine/avatar'
import { box, cyl, glassWindow, pew, roundArch, std } from '../../engine/props'
import { lightShaft, sunburst } from '../../engine/pt/decor'
import { brass, brassEnv, canvasTexture, Flame, glowTexture, makeFlameTextures } from '../../engine/pt/kit'
import { emptyCross } from '../../engine/pt/statues'
import type { BuildCtx, Layout } from '../../engine/stage'
import { planks, stainedGlass, wood } from '../../engine/tex'

type Built = Layout & { api: Record<string, () => void> }

const carpet = () =>
  canvasTexture(128, 512, (c) => {
    c.fillStyle = '#7a2230'
    c.fillRect(0, 0, 128, 512)
    c.fillStyle = '#c9a45c'
    c.fillRect(0, 0, 8, 512)
    c.fillRect(120, 0, 8, 512)
  }, [1, 8])

/** 벽 아래쪽 나무 판벽 */
const wainscot = () =>
  canvasTexture(256, 128, (c) => {
    c.fillStyle = '#8a5a34'
    c.fillRect(0, 0, 256, 128)
    c.strokeStyle = '#5a3a1e'
    c.lineWidth = 5
    for (let x = 0; x < 256; x += 64) c.strokeRect(x + 6, 10, 52, 108)
    c.fillStyle = '#c9a45c'
    c.fillRect(0, 0, 256, 6)
  }, [12, 1])

/** 전통 교회 (PujaTime 방식: 밝은 재질 색 + 빛 번짐 + 많은 사람) */
export function buildChurch(ctx: BuildCtx): Built {
  const { scene, high } = ctx
  const W = 18, Z0 = -28, Z1 = 10, H = 10
  const env = brassEnv()
  const gold = brass(env)
  scene.background = new THREE.Color('#2a2018')
  scene.fog = new THREE.Fog('#3a2c20', 30, 70)
  scene.add(new THREE.HemisphereLight(0xfffaf0, 0x9a7a58, 2.6))
  const sun = new THREE.DirectionalLight(0xfff2d8, 1.3)
  sun.position.set(8, 14, 6)
  scene.add(sun)

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, Z1 - Z0), std('#c08a58', { map: planks('#b07a48', [8, 18]) }))
  floor.rotation.x = -Math.PI / 2
  floor.position.z = (Z0 + Z1) / 2
  scene.add(floor)
  ctx.floor(floor)
  const aisle = new THREE.Mesh(new THREE.PlaneGeometry(2.2, Z1 - Z0 - 9), std('#fff', { map: carpet() }))
  aisle.rotation.x = -Math.PI / 2
  aisle.position.set(0, 0.015, (Z0 + 9 + Z1) / 2)
  scene.add(aisle)

  // 흰 벽 + 나무 판벽
  const white = std('#fbf6ec')
  const panel = std('#fff', { map: wainscot() })
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(Z1 - Z0, H), white)
    w.position.set(s * W / 2, H / 2, (Z0 + Z1) / 2)
    w.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2
    const p = new THREE.Mesh(new THREE.PlaneGeometry(Z1 - Z0, 1.4), panel)
    p.position.set(s * (W / 2 - 0.02), 0.7, (Z0 + Z1) / 2)
    p.rotation.y = w.rotation.y
    scene.add(w, p)
  }
  for (const [z, ry] of [[Z0, 0], [Z1, Math.PI]] as const) {
    const w = new THREE.Mesh(new THREE.PlaneGeometry(W, H + 6), white)
    w.position.set(0, (H + 6) / 2, z)
    w.rotation.y = ry
    scene.add(w)
  }
  // 박공 천장 + 나무 트러스
  const roofM = std('#7a5232', { map: planks('#6b4a2c', [3, 14]), side: THREE.DoubleSide })
  const slope = 0.55, half = W / 2
  for (const s of [-1, 1]) {
    const tilt = new THREE.Group()
    const r = new THREE.Mesh(new THREE.PlaneGeometry(half / Math.cos(slope) + 0.5, Z1 - Z0), roofM)
    r.rotation.x = Math.PI / 2
    tilt.add(r)
    tilt.rotation.z = -s * slope
    tilt.position.set(s * half / 2, H + Math.tan(slope) * half / 2, (Z0 + Z1) / 2)
    scene.add(tilt)
  }
  const truss = std('#5a3a22', { map: wood('#5a3a22') })
  for (let z = Z0 + 3; z < Z1; z += 4) {
    scene.add(box(W, 0.35, 0.35, truss, 0, H - 0.2, z))
    for (const s of [-1, 1]) {
      const b = box(half / Math.cos(slope), 0.3, 0.3, truss)
      b.position.set(s * half / 2, H + Math.tan(slope) * half / 2 - 0.1, z)
      b.rotation.z = -s * slope
      scene.add(b)
    }
    scene.add(box(0.3, Math.tan(slope) * half, 0.3, truss, 0, H, z))
  }
  // 둥근 아치 색유리 창(따뜻한 색) + 빛줄기
  let seed = 21
  for (let z = Z0 + 9; z < Z1 - 2; z += 4.2)
    for (const s of [-1, 1]) {
      const g = glassWindow(roundArch(1.6, 5), stainedGlass(seed++, ['#e8c24a', '#f2d88a', '#3b6fb8', '#c0392b', '#2f8f5b', '#f6e6b0']), 1.6)
      g.position.set(s * (W / 2 - 0.03), 2.6, z)
      g.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2
      scene.add(g)
      if (high && seed % 2) {
        const sh = lightShaft(2.4, 10, 0.16)
        sh.position.set(s * (W / 2 - 2.4), 4.6, z)
        sh.rotation.set(0, s > 0 ? -Math.PI / 2 : Math.PI / 2, s * 0.5)
        scene.add(sh)
      }
    }

  // 강단: 높은 단, 성가대석, 오르간, 십자가
  const pZ = Z0 + 4
  scene.add(box(W - 2, 1, 8, std('#9a6a40', { map: planks('#8a5a34', [4, 3]) }), 0, 0, pZ))
  for (let i = 0; i < 4; i++) scene.add(box(6, 0.25, 0.45, std('#a07048'), 0, i * 0.25, pZ + 4 + (3 - i) * 0.45))
  ctx.block({ x0: -W / 2, z0: Z0, x1: W / 2, z1: pZ + 4.2 })
  // 빈 십자가 + 은은한 빛
  const burst = sunburst(13, 0.45)
  burst.position.set(0, 7.4, Z0 + 0.2)
  scene.add(burst)
  ctx.every((_t, dt) => (burst.rotation.z += dt * 0.03))
  const cr = emptyCross(5.2, brass(env, 0xffe8c0))
  cr.position.set(0, 4.6, Z0 + 0.4)
  scene.add(cr)
  // 오르간 파이프 (뒷벽 양쪽)
  for (const side of [-1, 1])
    for (let i = 0; i < 11; i++) {
      const h = 3.6 + Math.sin((i / 10) * Math.PI) * 2.4
      scene.add(cyl(0.16, 0.16, h, gold, side * (3.4 + i * 0.38), 1, Z0 + 0.6, 10))
    }
  // 성가대 (흰 가운) 두 줄
  const choir: Parameters<BuildCtx['crowd']>[0] = []
  for (let r = 0; r < 2; r++)
    for (let k = 0; k < 6; k++) {
      const x = (k < 3 ? -1 : 1) * (3 + (k % 3) * 1.2)
      choir.push({ x, z: pZ - 1.6 + r * 1.1, y: 1 + r * 0.25, yaw: 0, look: { outfit: 'dress', skin: [0xf1d2b4, 0xe0b48c, 0xc8946a, 0x8a5a3a][(r + k) % 4], cloth: 0xf4efe4, trim: 0x7a2230, hair: [0x2a1f18, 0x5a3a20, 0x1c1410][k % 3] } })
    }
  ctx.crowd(choir)
  for (let r = 0; r < 2; r++) for (const side of [-1, 1]) {
    const p = pew(4, std('#6b4a2c', { map: wood() }))
    p.position.set(side * 4.2, 1 + r * 0.25, pZ - 1.4 + r * 1.1)
    p.rotation.y = Math.PI
    scene.add(p)
  }
  // 강대상(설교대): 가운데 높은 자리, 펼친 성경
  const pulpit = new THREE.Group()
  pulpit.add(box(2, 1.6, 1.2, std('#6b4226', { map: wood('#6b4226') })), box(2.2, 0.1, 1.4, gold, 0, 1.6, 0), box(1.9, 0.2, 0.02, gold, 0, 0.8, 0.61))
  const bible = box(0.8, 0.1, 0.56, std('#fff8e8'), 0, 1.72, 0.1)
  bible.rotation.x = -0.25
  pulpit.add(bible, box(0.84, 0.06, 0.6, std('#6a1e1e'), 0, 1.68, 0.1).rotateX(-0.25))
  pulpit.position.set(0, 1, pZ + 1.4)
  scene.add(pulpit)
  // 성찬상: 백합과 촛불
  const tZ = pZ + 6.6
  scene.add(box(3, 1, 1.2, std('#7a5232', { map: wood('#7a5232') }), 0, 0, tZ), box(3.2, 0.06, 1.3, std('#fffaf0'), 0, 1, tZ), box(3.2, 0.5, 0.02, gold, 0, 0.5, tZ + 0.66))
  ctx.block({ x0: -1.6, z0: tZ - 0.7, x1: 1.6, z1: tZ + 0.7 })
  const { flame: ft, glow: gt } = makeFlameTextures()
  const flames: Flame[] = []
  for (const x of [-1.1, 1.1]) {
    scene.add(cyl(0.1, 0.16, 0.4, gold, x, 1.06, tZ, 10), cyl(0.06, 0.06, 0.6, std('#f6efe0', { emissive: '#2a1e08' }), x, 1.46, tZ, 10))
    const f = new Flame(ft, gt, 0.26)
    f.group.position.set(x, 2.06, tZ)
    scene.add(f.group)
    flames.push(f)
  }
  scene.add(cyl(0.18, 0.12, 0.5, gold, 0, 1.06, tZ, 12))
  const lily = new THREE.IcosahedronGeometry(0.12, 1)
  for (let i = 0; i < 9; i++) {
    const a = (i / 9) * Math.PI * 2
    const f = new THREE.Mesh(lily, std('#fffdf4', { emissive: '#3a3a30' }))
    f.position.set(Math.cos(a) * 0.25, 1.75 + (i % 3) * 0.1, tZ + Math.sin(a) * 0.2)
    f.scale.set(1, 1.4, 1)
    scene.add(f)
  }
  // 펜던트 등
  const glowT = glowTexture('255,246,220', '255,200,120')
  for (let z = Z0 + 10; z < Z1; z += 6) for (const x of [-4.5, 4.5]) {
    scene.add(cyl(0.012, 0.012, 3.4, std('#222'), x, H - 3.4, z, 4), cyl(0.45, 0.18, 0.35, gold, x, H - 3.7, z, 16))
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.8 }))
    s.scale.setScalar(2.4)
    s.position.set(x, H - 3.8, z)
    scene.add(s)
  }
  // 장의자 + 앉아 있는 교인
  const pewM = std('#a06a3a', { map: wood('#8a5530') })
  const people: Parameters<BuildCtx['crowd']>[0] = []
  let pi = 0
  for (let r = 0, z = pZ + 9; z <= Z1 - 4; z += 1.3, r++)
    for (const side of [-1, 1]) {
      const p = pew(4.4, pewM)
      p.position.set(side * 3.5, 0, z)
      scene.add(p)
      for (let k = 0; k < 3; k++) {
        if ((r * 3 + k + (side > 0 ? 2 : 0)) % 4 === 0 || r > 9) continue
        people.push({ x: side * (1.9 + k * 1.3), z: z - 0.05, y: 0.36, yaw: Math.PI, look: visitorLook('christian', pi++), joined: pi % 4 === 0 })
      }
    }
  ctx.crowd(people)
  ctx.block({ x0: -5.9, z0: pZ + 8.6, x1: -1.1, z1: Z1 - 3.4 })
  ctx.block({ x0: 1.1, z0: pZ + 8.6, x1: 5.9, z1: Z1 - 3.4 })
  ctx.every((t) => flames.forEach((f) => f.tick(t)))

  ctx.spot('entrance', 0, Z1 - 2, 1.8)
  ctx.spot('pews', 0, -4, 1.8)
  ctx.spot('pulpit', 0, tZ + 1.6, 2)
  ctx.spot('organ', 5.5, pZ + 5, 1.8)
  ctx.walk({ x0: -W / 2, z0: pZ + 4.2, x1: W / 2, z1: Z1 })
  return {
    spawn: [0, 0],
    yaw: 0,
    look: LOOKS.christian,
    dist: 8,
    maxDist: 15,
    pitch: 0.24,
    lookY: 2,
    camBox: { min: [-W / 2 + 0.5, 0.6, Z0 + 1], max: [W / 2 - 0.5, H - 0.6, Z1 - 0.4] },
    api: {
      bell: () => bell('church'),
      pray: () => ctx.walkTo(0, tZ + 1.6, () => ctx.pose('pray')),
    },
  }
}
