import * as THREE from 'three'
import { bell } from '../../core/audio'
import { update } from '../../core/store'
import { LOOKS, visitorLook } from '../../engine/avatar'
import { archFrame, box, clusterColumn, cyl, glassWindow, pew, pointedArch, rib, std, vault } from '../../engine/props'
import { lightShaft, sunburst } from '../../engine/pt/decor'
import { brass, brassEnv, canvasTexture, Flame, glowTexture, makeFlameTextures, marbleEnv } from '../../engine/pt/kit'
import { ambo, crucifix, mary, realStatue, reredosTexture } from '../../engine/pt/statues'
import type { BuildCtx, Layout } from '../../engine/stage'
import { roseWindow, stainedGlass, stone, wood } from '../../engine/tex'

type Built = Layout & { api: Record<string, () => void> }

/** 붉은 융단(가운데 통로) */
const carpetTexture = () =>
  canvasTexture(128, 512, (c) => {
    c.fillStyle = '#8a1a22'
    c.fillRect(0, 0, 128, 512)
    c.fillStyle = '#e8b84e'
    c.fillRect(0, 0, 10, 512)
    c.fillRect(118, 0, 10, 512)
    c.fillStyle = 'rgba(232,184,78,.35)'
    for (let y = 20; y < 512; y += 64) {
      c.beginPath()
      c.moveTo(64, y)
      c.lineTo(84, y + 20)
      c.lineTo(64, y + 40)
      c.lineTo(44, y + 20)
      c.fill()
    }
  }, [1, 8])

/** 대리석 바닥(따뜻한 상아색 + 금빛 줄) */
const floorTexture = () =>
  canvasTexture(256, 256, (c) => {
    c.fillStyle = '#efe3c8'
    c.fillRect(0, 0, 256, 256)
    c.fillStyle = '#d8c39a'
    c.fillRect(0, 0, 128, 128)
    c.fillRect(128, 128, 128, 128)
    c.strokeStyle = 'rgba(160,110,40,.35)'
    c.lineWidth = 3
    c.strokeRect(0, 0, 256, 256)
  }, [8, 20])

/** 고딕 대성당 (PujaTime 사원 홀과 같은 방식: 밝은 재질 색 + 빛 번짐 + 금장식 + 앉아 있는 신자들) */
export function buildCathedral(ctx: BuildCtx): Built {
  const { scene, high } = ctx
  const W = 22, Z0 = -34, Z1 = 34, NAVE = 15
  const env = brassEnv()
  const gold = brass(env)
  const marble = marbleEnv()
  scene.background = new THREE.Color('#1a1018')
  scene.fog = new THREE.Fog('#2a1a1c', 50, 120)
  scene.add(new THREE.HemisphereLight(0xfff3e0, 0x8a6a50, 2.4))
  const sun = new THREE.DirectionalLight(0xfff0d0, 1.2)
  sun.position.set(-6, 20, 10)
  scene.add(sun)

  const stoneM = std('#e6dcc8', { map: stone('#ddd2bc', [6, 4]) })
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, Z1 - Z0), std('#fff', { map: floorTexture() }))
  floor.rotation.x = -Math.PI / 2
  floor.position.z = (Z0 + Z1) / 2
  scene.add(floor)
  ctx.floor(floor)
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(2.4, Z1 - Z0 - 10), std('#fff', { map: carpetTexture() }))
  carpet.rotation.x = -Math.PI / 2
  carpet.position.set(0, 0.015, (Z0 + 10 + Z1) / 2)
  scene.add(carpet)

  // 벽·높은 신랑·궁륭 천장
  const wall = (w: number, h: number, x: number, y: number, z: number, ry: number, m: THREE.Material = stoneM) => {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m)
    mesh.position.set(x, y, z)
    mesh.rotation.y = ry
    scene.add(mesh)
  }
  wall(Z1 - Z0, 12, -W / 2, 6, (Z0 + Z1) / 2, Math.PI / 2)
  wall(Z1 - Z0, 12, W / 2, 6, (Z0 + Z1) / 2, -Math.PI / 2)
  wall(W, 30, 0, 15, Z1, Math.PI)
  wall(Z1 - Z0, 10, -NAVE / 2, 16, (Z0 + Z1) / 2, Math.PI / 2)
  wall(Z1 - Z0, 10, NAVE / 2, 16, (Z0 + Z1) / 2, -Math.PI / 2)
  scene.add(vault(NAVE, 24, 32, Z0, Z1, std('#4a3e56')))
  const sideV = vault(W / 2 - NAVE / 2, 11, 13, Z0, Z1, std('#5a4c5a'))
  sideV.position.x = -(W / 2 + NAVE / 2) / 2
  const sideV2 = sideV.clone()
  sideV2.position.x = -sideV.position.x
  scene.add(sideV, sideV2)
  const ribM = brass(env, 0xd8c8a8)
  for (let z = Z0 + 3; z <= Z1 - 2; z += 5) scene.add(rib(NAVE, 24, 32, z, ribM, 0.14))

  // 다발 기둥(금 기둥머리) + 아치
  for (let z = Z0 + 3; z <= Z1 - 2; z += 5)
    for (const x of [-NAVE / 2, NAVE / 2]) {
      const c = clusterColumn(21, 0.45, stoneM)
      c.position.set(x, 0, z)
      scene.add(c, cyl(0.75, 0.6, 0.5, gold, x, 20.6, z, 12))
      ctx.block({ x0: x - 0.7, z0: z - 0.7, x1: x + 0.7, z1: z + 0.7 })
    }
  for (let z = Z0 + 5.5; z <= Z1 - 2; z += 5)
    for (const x of [-NAVE / 2, NAVE / 2]) {
      const a = archFrame(pointedArch(4, 10.5), stoneM, 0.6, 0.4)
      a.position.set(x - 0.3 * Math.sign(x), 0, z)
      a.rotation.y = Math.PI / 2
      scene.add(a)
    }

  // 색유리 창(측랑·높은 창) + 빛줄기
  let seed = 3
  for (let z = Z0 + 5.5; z <= Z1 - 2; z += 5)
    for (const s of [-1, 1]) {
      const low = glassWindow(pointedArch(2, 7), stainedGlass(seed++), 1.7)
      low.position.set(s * (W / 2 - 0.02), 2.6, z)
      low.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2
      scene.add(low)
      const hi = glassWindow(pointedArch(2.6, 7), stainedGlass(seed++, ['#2a5db0', '#1d3f80', '#b5213b', '#e3b341', '#3b7dd8']), 1.6)
      hi.position.set(s * (NAVE / 2 - 0.02), 13, z)
      hi.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2
      scene.add(hi)
      if (high && seed % 3 === 0) {
        const sh = lightShaft(3, 16, 0.18)
        sh.position.set(s * (NAVE / 2 - 2.5), 9, z)
        sh.rotation.set(0, s > 0 ? -Math.PI / 2 : Math.PI / 2, s * 0.45)
        scene.add(sh)
      }
    }

  // 제단 영역: 계단·제대·금빛 레레도스·십자고상·후광
  const sZ = Z0 + 4
  scene.add(box(W - 2, 0.6, 8, std('#efe3c8', { map: floorTexture() }), 0, 0, sZ))
  for (let i = 0; i < 3; i++) scene.add(box(8, 0.2, 0.5, std('#f4ead4'), 0, i * 0.2, sZ + 4 + (2 - i) * 0.5))
  ctx.block({ x0: -W / 2, z0: Z0, x1: W / 2, z1: sZ + 4.2 })
  const reredos = new THREE.Mesh(new THREE.PlaneGeometry(14, 10.5), new THREE.MeshBasicMaterial({ map: reredosTexture(), transparent: true, alphaTest: 0.05 }))
  reredos.position.set(0, 0.6 + 5.25, Z0 + 0.2)
  scene.add(reredos)
  const burst = sunburst(16, 0.65)
  burst.position.set(0, 9, Z0 + 0.6)
  scene.add(burst)
  ctx.every((_t, dt) => (burst.rotation.z += dt * 0.04))
  const cru = crucifix(6, env, marble)
  cru.position.set(0, 4.6, Z0 + 1.2)
  scene.add(cru)
  realStatue(ctx, 'crucifix', new THREE.Vector3(0, 4.6, Z0 + 1.3), 6.4, cru, 0.2)
  const altar = new THREE.Group()
  altar.add(box(4.6, 1.2, 1.4, new THREE.MeshMatcapMaterial({ matcap: marble })), box(4.8, 0.08, 1.6, std('#fffaf0'), 0, 1.2, 0), box(4.6, 0.6, 0.02, gold, 0, 0.4, 0.71))
  altar.position.set(0, 0.6, sZ + 1)
  scene.add(altar)
  // 제대 촛불(PujaTime 불꽃)
  const { flame: ft, glow: gt } = makeFlameTextures()
  const flames: Flame[] = []
  const candle = (x: number, y: number, z: number, h: number, size = 0.28) => {
    scene.add(cyl(0.06, 0.06, h, std('#f6efe0', { emissive: '#2a1e08' }), x, y, z, 10))
    const f = new Flame(ft, gt, size)
    f.group.position.set(x, y + h, z)
    scene.add(f.group)
    flames.push(f)
  }
  for (let i = 0; i < 6; i++) {
    const x = -1.9 + i * 0.76
    scene.add(cyl(0.12, 0.18, 0.5, gold, x, 1.88, sZ + 0.8, 10))
    candle(x, 2.38, sZ + 0.8, 0.7)
  }
  // 감실과 감실등
  scene.add(box(1.2, 1.1, 0.8, gold, 0, 0.6, Z0 + 1.6))
  const lamp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('255,120,110', '230,30,30'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
  lamp.scale.setScalar(1.4)
  lamp.position.set(2.2, 3.2, Z0 + 2)
  scene.add(lamp, cyl(0.1, 0.14, 0.25, gold, 2.2, 3.05, Z0 + 2, 10))
  // 주교좌
  const cathedra = new THREE.Group()
  cathedra.add(box(1.2, 0.6, 1, std('#8a1a22')), box(1.2, 2.6, 0.15, std('#8a1a22'), 0, 0.6, -0.45), box(1.4, 0.3, 0.3, gold, 0, 3.2, -0.45))
  cathedra.position.set(5.6, 0.6, sZ - 1.6)
  cathedra.rotation.y = -0.6
  scene.add(cathedra)
  // 장미창 (입구 위 + 제단 위)
  const roseM = new THREE.MeshBasicMaterial({ map: roseWindow(), color: new THREE.Color(1.6, 1.6, 1.6) })
  const rose = new THREE.Mesh(new THREE.CircleGeometry(4.2, 64), roseM)
  rose.position.set(0, 18, Z1 - 0.04)
  rose.rotation.y = Math.PI
  scene.add(rose, new THREE.Mesh(new THREE.TorusGeometry(4.3, 0.3, 10, 64), gold).translateY(18).translateZ(Z1 - 0.1))
  const rose2 = new THREE.Mesh(new THREE.CircleGeometry(3.2, 64), roseM)
  rose2.position.set(0, 17, Z0 + 0.05)
  scene.add(rose2)
  wall(W, 30, 0, 15, Z0, 0, std('#3a2a2a'))

  // 성모 제대 (왼쪽 측랑 앞) + 봉헌초
  const m = mary(2.6, marble, env)
  m.position.set(-W / 2 + 1.6, 1.2, -4)
  m.rotation.y = Math.PI / 2
  scene.add(m, box(1.6, 1.2, 1.6, new THREE.MeshMatcapMaterial({ matcap: marble }), -W / 2 + 1.6, 0, -4))
  realStatue(ctx, 'mary', new THREE.Vector3(-W / 2 + 1.6, 1.2, -4), 2.8, m, 0.6)
  const maryGlow = sunburst(4, 0.5)
  maryGlow.position.set(-W / 2 + 0.6, 3.3, -4)
  maryGlow.rotation.y = Math.PI / 2
  scene.add(maryGlow)
  ctx.block({ x0: -W / 2, z0: -5, x1: -W / 2 + 2.4, z1: -3 })
  // 예수 성심상 (오른쪽 측랑 앞, 성모 제대와 마주 봄) — 제대 중심은 십자고상, 성심상은 측면에
  // 실사 석고상 사진(public/statues/sacredheart.png)이 있을 때만 받침과 함께 나타남
  const heartChapel = new THREE.Group()
  heartChapel.add(box(1.6, 1.2, 1.6, new THREE.MeshMatcapMaterial({ matcap: marble }), W / 2 - 1.6, 0, -4))
  const heartGlow = sunburst(4, 0.4)
  heartGlow.position.set(W / 2 - 0.6, 3.3, -4)
  heartGlow.rotation.y = -Math.PI / 2
  heartChapel.add(heartGlow)
  heartChapel.visible = false
  scene.add(heartChapel)
  // 방향만 알려 주는 빈 기준점(코드로 만든 상은 두지 않음)
  const heartFacing = new THREE.Object3D()
  heartFacing.rotation.y = -Math.PI / 2
  realStatue(ctx, 'sacredheart', new THREE.Vector3(W / 2 - 1.6, 1.2, -4), 2.8, heartFacing, 0.6, () => {
    heartChapel.visible = true
    ctx.block({ x0: W / 2 - 2.6, z0: -5, x1: W / 2, z1: -3 })
  })
  // 독서대(앰보): 제단 왼쪽 앞 — 개신교의 강대상과 다른 말씀 전례의 자리
  const am = ambo(marble, env)
  am.position.set(-3.4, 0.6, sZ + 2.4)
  am.rotation.y = 0.35
  scene.add(am)
  // 봉헌초 받침: 성모 제대 옆 벽 쪽, 기둥과 기둥 사이(z -8.5)라 신랑 쪽에서 보면 가리지 않음
  const rackX = -W / 2 + 0.95, rackZ = -8.5
  const rack = new THREE.Group()
  const iron = brass(env, 0x8a7050)
  for (let r = 0; r < 3; r++) rack.add(box(0.5, 0.04, 2.6, iron, rackX - r * 0.2, 0.8 + r * 0.16, rackZ))
  rack.add(box(0.06, 0.8, 0.06, iron, rackX, 0, rackZ - 1.2), box(0.06, 0.8, 0.06, iron, rackX, 0, rackZ + 1.2))
  scene.add(rack)
  const votives: Flame[] = []
  for (let i = 0; i < 24; i++) {
    const r = Math.floor(i / 8), k = i % 8
    const x = rackX - r * 0.2, y = 0.84 + r * 0.16, z = rackZ - 1.1 + k * 0.31
    rack.add(cyl(0.05, 0.05, 0.1, std('#c8352a', { emissive: '#3a0a06' }), x, y, z, 8))
    const f = new Flame(ft, gt, 0.14)
    f.group.position.set(x, y + 0.1, z)
    f.group.visible = i < 9
    scene.add(f.group)
    votives.push(f)
  }
  ctx.block({ x0: rackX - 0.7, z0: rackZ - 1.4, x1: rackX + 0.35, z1: rackZ + 1.4 })
  let lit = 9
  const lightCandle = () => {
    if (lit < votives.length) votives[lit++].group.visible = true
    update((s) => ({ candles: s.candles + 1 }))
  }
  // 받침 앞 측랑 자리(기둥 사이)에서 받침을 바라보고 켬
  const vX = rackX + 1.4, vZ = rackZ
  const goLight = () => ctx.walkTo(vX, vZ, () => { ctx.face(rackX, rackZ); lightCandle(); ctx.pose('pray') })
  ctx.tap(rack, goLight)

  // 신랑에 매단 금빛 등
  for (let z = Z0 + 10; z < Z1 - 2; z += 7) {
    scene.add(cyl(0.015, 0.015, 8, std('#2a2010'), 0, 13, z, 4))
    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.06, 8, 32), gold)
    ring.rotation.x = Math.PI / 2
    ring.position.set(0, 13, z)
    scene.add(ring)
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2
      candle(Math.cos(a) * 1.1, 13.02, z + Math.sin(a) * 1.1, 0.2, 0.16)
    }
  }

  // 장의자 + 앉아 있는 신자들
  const pewM = std('#9a6236', { map: wood('#8a5530') })
  const people: Parameters<BuildCtx['crowd']>[0] = []
  let pi = 0
  for (let r = 0, z = sZ + 7; z <= Z1 - 5; z += 1.3, r++)
    for (const side of [-1, 1]) {
      const p = pew(3.6, pewM)
      p.position.set(side * 3.2, 0, z)
      scene.add(p)
      for (let k = 0; k < 3; k++) {
        const x = side * (1.9 + k * 1.2)
        if ((r * 3 + k + (side > 0 ? 1 : 0)) % 4 === 0 || r > 11) { ctx.seat(x, z - 0.05, 0.36, Math.PI); continue }
        people.push({ x, z: z - 0.05, y: 0.36, yaw: Math.PI, look: visitorLook('catholic', pi++), joined: pi % 3 === 0 })
      }
    }
  ctx.crowd(people)
  ctx.block({ x0: -5.2, z0: sZ + 6.6, x1: -1.3, z1: Z1 - 4.4 })
  ctx.block({ x0: 1.3, z0: sZ + 6.6, x1: 5.2, z1: Z1 - 4.4 })
  // 성수대 (입구)
  for (const x of [-2, 2]) {
    scene.add(cyl(0.1, 0.16, 1, new THREE.MeshMatcapMaterial({ matcap: marble }), x, 0, Z1 - 2), cyl(0.42, 0.16, 0.2, new THREE.MeshMatcapMaterial({ matcap: marble }), x, 1, Z1 - 2))
    ctx.block({ x0: x - 0.5, z0: Z1 - 2.5, x1: x + 0.5, z1: Z1 - 1.5 })
  }
  // 14처 (양쪽 벽)
  for (let i = 0; i < 14; i++) {
    const s = i < 7 ? -1 : 1
    const p = new THREE.Group()
    p.add(box(0.8, 1, 0.08, gold), box(0.64, 0.8, 0.09, std('#5a3a2a'), 0, 0.1, 0.01))
    p.position.set(s * (W / 2 - 0.06), 2.2, sZ + 7 + (i % 7) * 4.4)
    p.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2
    scene.add(p)
  }
  ctx.every((t) => { flames.forEach((f) => f.tick(t)); votives.forEach((f) => f.group.visible && f.tick(t)) })

  ctx.spot('font', 0, Z1 - 3, 1.8)
  ctx.spot('nave', 0, -6, 1.8)
  ctx.spot('altar', 0, sZ + 5.6, 2.2)
  ctx.spot('votive', vX, vZ, 1.4)
  ctx.spot('station', W / 2 - 1.6, sZ + 9, 1.6)
  ctx.spot('heart', W / 2 - 3.4, -4, 1.6)
  ctx.spot('mary', -W / 2 + 3.4, -4.8, 1.4)
  ctx.npc(-W / 2 + 3.4, -4, -Math.PI / 2, visitorLook('catholic', 2), 'pray')
  ctx.walk({ x0: -W / 2, z0: sZ + 4.2, x1: W / 2, z1: Z1 })
  ctx.walk({ x0: -4, z0: sZ + 4, x1: 4, z1: sZ + 6 })
  return {
    spawn: [0, Z1 - 12],
    yaw: 0,
    look: LOOKS.catholic,
    dist: 8,
    maxDist: 16,
    pitch: 0.24,
    lookY: 2.4,
    camBox: { min: [-W / 2 + 0.5, 0.6, Z0 + 1], max: [W / 2 - 0.5, 18, Z1 - 0.4] },
    api: {
      candle: goLight,
      bell: () => bell('church'),
      kneel: () => ctx.walkTo(0, sZ + 5.6, () => ctx.pose('pray')),
    },
  }
}
