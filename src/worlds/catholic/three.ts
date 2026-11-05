import * as THREE from 'three'
import { bell } from '../../core/audio'
import { LOOKS, visitorLook } from '../../engine/avatar'
import {
  archFrame, box, Candle, clusterColumn, cross, crucifix, cyl, glassWindow, gold, halo, instances, lightShaft, organ, pew,
  pointedArch, rib, rock, roundArch, sky, std, vault, pine,
} from '../../engine/props'
import type { BuildCtx, Layout } from '../../engine/stage'
import { checker, marble, planks, roseWindow, stainedGlass, stone, wood } from '../../engine/tex'
import { update } from '../../core/store'
import { brassEnv, marbleEnv } from '../../engine/pt/kit'
import { crucifix as plasterCrucifix, mary as plasterMary, realStatue } from '../../engine/pt/statues'

export type Api = Record<string, () => void>
type Built = Layout & { api: Api }

/** 봉헌초 받침: 누를 때마다 한 개씩 켜짐 */
function votiveRack(ctx: BuildCtx, n = 24, cols = 8) {
  const g = new THREE.Group()
  const iron = std('#2a2520', { metalness: 0.4, roughness: 0.5 })
  const rows = Math.ceil(n / cols)
  for (let r = 0; r < rows; r++) g.add(box(cols * 0.16 + 0.1, 0.04, 0.22, iron, 0, 0.7 + r * 0.16, r * -0.2))
  g.add(box(0.05, 0.75, 0.05, iron, -cols * 0.08, 0, 0), box(0.05, 0.75, 0.05, iron, cols * 0.08, 0, 0))
  const candles: Candle[] = []
  for (let i = 0; i < n; i++) {
    const c = new Candle(ctx, 0.1, 0.03, '#c8352a')
    const r = Math.floor(i / cols), k = i % cols
    c.group.position.set(-cols * 0.08 + 0.08 + k * 0.16, 0.74 + r * 0.16, r * -0.2)
    candles.push(c)
    g.add(c.group)
  }
  let lit = 0
  const light = () => {
    if (lit >= n) return false
    candles[lit++].set(true)
    update((s) => ({ candles: s.candles + 1 }))
    return true
  }
  return { group: g, light, count: () => lit }
}

/** 고딕 대성당 */
export function buildGothic(ctx: BuildCtx): Built {
  const { scene, high } = ctx
  scene.background = new THREE.Color('#0b0910')
  scene.fog = new THREE.Fog('#141018', 24, 60)
  const W = 14, L = 36, Z0 = -28, Z1 = 8
  const stoneM = std('#d8cfbd', { map: stone('#c9bfab', [6, 3]), roughness: 0.9 })
  const darkStone = std('#6f675b', { roughness: 0.9 })

  // 바닥: 흑백 대리석
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, L), std('#ddd', { map: checker('#efe9dc', '#4a3f38', [7, 18]), roughness: 0.35 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.set(0, 0, (Z0 + Z1) / 2)
  scene.add(floor)
  ctx.floor(floor)

  // 옆벽·뒷벽
  const wall = (w: number, h: number, x: number, z: number, ry: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), stoneM)
    m.position.set(x, h / 2, z)
    m.rotation.y = ry
    scene.add(m)
  }
  wall(L, 10, -W / 2, (Z0 + Z1) / 2, Math.PI / 2)
  wall(L, 10, W / 2, (Z0 + Z1) / 2, -Math.PI / 2)
  wall(W, 22, 0, Z1, Math.PI)
  wall(W, 22, 0, Z0, 0)
  // 높은 신랑 벽(클리어스토리)과 천장
  const nave = 9
  wall(L, 8, -nave / 2, (Z0 + Z1) / 2, Math.PI / 2)
  scene.children.at(-1)!.position.y = 13
  wall(L, 8, nave / 2, (Z0 + Z1) / 2, -Math.PI / 2)
  scene.children.at(-1)!.position.y = 13
  const v = vault(nave, 17, 22, Z0, Z1, std('#5a5266', { roughness: 0.95 }))
  scene.add(v)
  const sideV1 = vault(W / 2 - nave / 2, 8, 10, Z0, Z1, darkStone.clone())
  sideV1.position.x = -(W / 2 + nave / 2) / 2
  const sideV2 = sideV1.clone()
  sideV2.position.x = (W / 2 + nave / 2) / 2
  scene.add(sideV1, sideV2)
  const ribM = std('#8d8474', { roughness: 0.8 })
  for (let z = Z0 + 2; z <= Z1 - 2; z += 4) scene.add(rib(nave, 17, 22, z, ribM, 0.14))

  // 기둥 + 아케이드 아치
  for (let z = Z0 + 2; z <= Z1 - 2; z += 4) {
    for (const x of [-nave / 2, nave / 2]) {
      const c = clusterColumn(17, 0.38, stoneM)
      c.position.set(x, 0, z)
      scene.add(c)
      ctx.block({ x0: x - 0.6, z0: z - 0.6, x1: x + 0.6, z1: z + 0.6 })
    }
  }
  for (let z = Z0 + 4; z <= Z1 - 2; z += 4)
    for (const x of [-nave / 2, nave / 2]) {
      const a = archFrame(pointedArch(3.2, 8.5), stoneM, 0.6, 0.35)
      a.position.set(x + 0.3 * Math.sign(-x), 0, z - 2)
      a.rotation.y = Math.PI / 2
      scene.add(a)
    }

  // 측랑 창과 클리어스토리 창 (빛나는 색유리)
  let seed = 1
  for (let z = Z0 + 4; z <= Z1 - 2; z += 4) {
    for (const side of [-1, 1]) {
      const low = glassWindow(pointedArch(1.6, 5.5), stainedGlass(seed++), 1.5)
      low.position.set(side * (W / 2 - 0.02), 2.4, z - 2)
      low.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2
      scene.add(low)
      const hi = glassWindow(pointedArch(1.8, 5), stainedGlass(seed++, ['#2a5db0', '#1d3f80', '#b5213b', '#e3b341', '#3b7dd8']), 1.4)
      hi.position.set(side * (nave / 2 - 0.02), 11, z - 2)
      hi.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2
      scene.add(hi)
      if (high) {
        const sh = lightShaft(1.6, 9, side > 0 ? '#9fc4ff' : '#ffcf8a', 0.06)
        sh.position.set(side * (W / 2 - 2.2), 4.5, z - 2)
        sh.rotation.set(0, side > 0 ? -Math.PI / 2 : Math.PI / 2, side * 0.5)
        scene.add(sh)
      }
    }
  }

  // 제단 영역 (단을 높임)
  const sanct = box(10, 0.45, 7, std('#cfc6b4', { map: marble('#e9e3d6', '#b9ae98', [3, 2]), roughness: 0.3 }), 0, 0, Z0 + 3.5)
  scene.add(sanct)
  for (let i = 0; i < 3; i++) scene.add(box(10 - i * 0.01, 0.15, 0.4, std('#d8cfbd', { roughness: 0.4 }), 0, i * 0.15, Z0 + 7 + 0.4 * (2 - i)))
  ctx.block({ x0: -5, z0: Z0, x1: 5, z1: Z0 + 6.2 })
  const altar = box(3.4, 1.05, 1.1, std('#f2ede2', { roughness: 0.3 }), 0, 0.45, Z0 + 4)
  scene.add(altar)
  scene.add(box(3.6, 0.06, 1.2, std('#fffaf0'), 0, 1.5, Z0 + 4))
  scene.add(box(3.4, 0.25, 0.02, gold(), 0, 1.22, Z0 + 4.56))
  const candles: Candle[] = []
  for (let i = 0; i < 6; i++) {
    const c = new Candle(ctx, 0.55, 0.045, '#f3ead6', true)
    c.group.position.set(-1.35 + i * 0.54, 1.53, Z0 + 3.8)
    scene.add(c.group)
    candles.push(c)
  }
  // 걸린 십자고상 + 주교좌(카테드라)
  const cru = crucifix(2.6)
  cru.position.set(0, 4.2, Z0 + 3)
  scene.add(cru)
  const cathedra = new THREE.Group()
  cathedra.add(box(0.9, 0.5, 0.8, std('#7a2232'), 0, 0, 0), box(0.9, 1.8, 0.12, std('#7a2232'), 0, 0.5, -0.38), box(1, 0.2, 0.2, gold(), 0, 2.2, -0.38))
  cathedra.position.set(3.6, 0.45, Z0 + 2.4)
  cathedra.rotation.y = -0.5
  scene.add(cathedra)

  // 장미창 (뒷벽 높이)
  const rose = new THREE.Mesh(new THREE.CircleGeometry(3.6, 48), new THREE.MeshBasicMaterial({ map: roseWindow(), color: new THREE.Color(1.7, 1.7, 1.7), toneMapped: false }))
  rose.position.set(0, 14, Z0 + 0.03)
  scene.add(rose)
  const roseRing = new THREE.Mesh(new THREE.TorusGeometry(3.7, 0.25, 8, 48), stoneM)
  roseRing.position.copy(rose.position)
  scene.add(roseRing)
  for (const x of [-3, 3]) {
    const lw = glassWindow(pointedArch(1.4, 6), stainedGlass(40 + x), 1.5)
    lw.position.set(x, 3.5, Z0 + 0.03)
    scene.add(lw)
  }

  // 장의자 (가운데 통로를 비움)
  const pewM = std('#a0703f', { map: wood('#8a5a30'), roughness: 0.55 })
  for (let z = Z0 + 9; z <= Z1 - 5; z += 1.15)
    for (const x of [-2.55, 2.55]) {
      const p = pew(3.2, pewM)
      p.position.set(x, 0, z)
      scene.add(p)
    }
  ctx.block({ x0: -4.2, z0: Z0 + 8.6, x1: -0.9, z1: Z1 - 4.4 })
  ctx.block({ x0: 0.9, z0: Z0 + 8.6, x1: 4.2, z1: Z1 - 4.4 })

  // 입구 위 오르간
  const org = organ(21, 6, 5)
  org.position.set(0, 8, Z1 - 0.6)
  org.rotation.y = Math.PI
  scene.add(org)
  scene.add(box(7, 0.4, 1.6, std('#4a2e1a'), 0, 7.6, Z1 - 0.8))

  // 봉헌초 (오른쪽 측랑)
  const rack = votiveRack(ctx, 24, 8)
  rack.group.position.set(5.6, 0, -6)
  rack.group.rotation.y = -Math.PI / 2
  scene.add(rack.group)
  ctx.block({ x0: 5.2, z0: -7, x1: 7, z1: -5 })
  ctx.tap(rack.group, () => {
    rack.light()
    ctx.pose('pray')
  }, [4.4, -6])

  // 십자가의 길 14처 (양쪽 벽)
  const plaques: THREE.Object3D[] = []
  for (let i = 0; i < 14; i++) {
    const side = i < 7 ? -1 : 1
    const z = Z0 + 9 + (i % 7) * 3.6
    const p = new THREE.Group()
    p.add(box(0.7, 0.9, 0.06, std('#3a2a1a'), 0, 0, 0), box(0.56, 0.7, 0.07, std('#c9b38a', { roughness: 0.5 }), 0, 0.1, 0.01), cyl(0.05, 0.05, 0.02, gold(), 0, 0.95, 0))
    p.position.set(side * (W / 2 - 0.05), 2.1, z)
    p.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2
    scene.add(p)
    plaques.push(p)
  }

  // 조명: 어두운 실내 + 제단에 따뜻한 빛
  scene.add(new THREE.HemisphereLight('#b8acd8', '#5a4030', 1.5))
  scene.add(new THREE.AmbientLight('#ffe8d0', 0.35))
  const key = new THREE.DirectionalLight('#ffe2b0', 1.1)
  key.position.set(-4, 20, 6)
  scene.add(key)
  ctx.pointLight('#ffc87a', 14, 22, [0, 5, Z0 + 6])
  ctx.pointLight('#ffb35a', 4, 8, [5, 1.6, -6])
  ctx.pointLight('#7fa6ff', 5, 18, [-5.5, 6, -10])
  ctx.pointLight('#ff9f7a', 5, 18, [5.5, 6, -16])
  ctx.pointLight('#ffe0b0', 5, 20, [0, 6, 2])
  const altarGlow = halo('#ffcf7a', 7, 0.45)
  altarGlow.position.set(0, 2.2, Z0 + 4)
  scene.add(altarGlow)

  ctx.spot('font', 0, 5.5, 1.6)
  ctx.spot('nave', 0, -6, 1.6)
  ctx.spot('altar', 0, Z0 + 7.6, 2)
  ctx.spot('votive', 4.4, -6, 1.4)
  ctx.spot('station', -5.8, Z0 + 9, 1.6)
  ctx.npc(-1.6, Z0 + 9, Math.PI, visitorLook('catholic', 1), 'pray')
  ctx.npc(-3.2, Z0 + 11.3, Math.PI, visitorLook('catholic', 2), 'pray')
  ctx.npc(2.4, Z0 + 10.15, Math.PI, visitorLook('catholic', 3), 'pray')
  ctx.npc(5.8, -9, Math.PI / 2, visitorLook('catholic', 4), 'idle')
  // 걸을 수 있는 곳
  ctx.walk({ x0: -W / 2, z0: Z0 + 6.2, x1: W / 2, z1: Z1 })
  ctx.walk({ x0: -5, z0: Z0 + 6, x1: 5, z1: Z0 + 7.5 })

  return {
    spawn: [0, 1],
    yaw: 0,
    look: LOOKS.catholic,
    dist: 4.6,
    maxDist: 9,
    camBox: { min: [-W / 2 + 0.4, 0.5, Z0 + 0.5], max: [W / 2 - 0.4, 15, Z1 - 0.4] },
    api: {
      candle: () => ctx.walkTo(4.4, -6, () => { rack.light(); ctx.pose('pray') }),
      bell: () => bell('church'),
    },
  }
}

/** 본당(일반 성당): 밝은 벽, 나무 천장, 감실과 감실등 */
export function buildParish(ctx: BuildCtx): Built {
  const { scene } = ctx
  scene.background = new THREE.Color('#1a1512')
  scene.fog = new THREE.Fog('#1a1512', 30, 60)
  const W = 14, Z0 = -18, Z1 = 13
  const L = Z1 - Z0
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, L), std('#aaa', { map: marble('#d8d0c2', '#a89c86', [4, 8]), roughness: 0.4 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.z = (Z0 + Z1) / 2
  scene.add(floor)
  ctx.floor(floor)
  const wallM = std('#efe8dc', { roughness: 0.95 })
  const wall = (w: number, h: number, x: number, z: number, ry: number) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallM)
    m.position.set(x, h / 2, z)
    m.rotation.y = ry
    scene.add(m)
  }
  wall(L, 8, -W / 2, (Z0 + Z1) / 2, Math.PI / 2)
  wall(L, 8, W / 2, (Z0 + Z1) / 2, -Math.PI / 2)
  wall(W, 8, 0, Z1, Math.PI)
  wall(W, 8, 0, Z0, 0)
  // 나무 천장과 들보
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, L), std('#7a5634', { map: planks('#7a5634', [2, 8]) }))
  ceil.rotation.x = Math.PI / 2
  ceil.position.set(0, 8, (Z0 + Z1) / 2)
  scene.add(ceil)
  for (let z = Z0 + 2; z < Z1; z += 3) scene.add(box(W, 0.35, 0.3, std('#5a3a22'), 0, 7.6, z))
  // 창
  let seed = 60
  for (let z = Z0 + 4; z < Z1 - 1; z += 4)
    for (const s of [-1, 1]) {
      const g = glassWindow(roundArch(1.2, 3.4), stainedGlass(seed++, ['#e3b341', '#f0d070', '#3b7dd8', '#c0392b', '#2f8f5b']), 1.4)
      g.position.set(s * (W / 2 - 0.02), 3, z)
      g.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2
      scene.add(g)
    }
  // 제단 단
  scene.add(box(W, 0.4, 5, std('#bdb3a2', { roughness: 0.5 }), 0, 0, Z0 + 2.5))
  ctx.block({ x0: -W / 2, z0: Z0, x1: W / 2, z1: Z0 + 5 })
  // 뒷벽 십자고상, 감실, 감실등
  const back = box(5, 6, 0.2, std('#8a6a4a', { map: wood('#7a5634') }), 0, 0.4, Z0 + 0.12)
  scene.add(back)
  const env = brassEnv(), marbleT = marbleEnv()
  const cru = plasterCrucifix(3, env, marbleT)
  cru.position.set(0, 2.6, Z0 + 0.4)
  scene.add(cru)
  realStatue(ctx, 'crucifix', new THREE.Vector3(0, 2.6, Z0 + 0.45), 3.2, cru, 0.2)
  const tab = box(0.8, 0.8, 0.5, gold(), 0, 1.4, Z0 + 0.6)
  scene.add(tab, box(1.4, 1, 0.7, std('#e8e0d0'), 0, 0.4, Z0 + 0.6))
  const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), new THREE.MeshBasicMaterial({ color: '#ff2a2a', toneMapped: false }))
  lamp.position.set(1.2, 1.9, Z0 + 0.8)
  const lampHalo = halo('#ff3b3b', 1.2, 0.8)
  lampHalo.position.copy(lamp.position)
  scene.add(lamp, lampHalo)
  ctx.every((t) => lampHalo.material.opacity = 0.65 + Math.sin(t * 2.3) * 0.15)
  // 제대
  scene.add(box(2.6, 1, 1, std('#f4efe4', { roughness: 0.3 }), 0, 0.4, Z0 + 3), box(2.7, 0.05, 1.1, std('#fffaf0'), 0, 1.4, Z0 + 3), box(2.6, 0.18, 0.02, std('#4e8c4a'), 0, 1.15, Z0 + 3.51))
  for (const x of [-1, 1]) {
    const c = new Candle(ctx, 0.45, 0.04, '#f3ead6', true)
    c.group.position.set(x, 1.43, Z0 + 2.9)
    scene.add(c.group)
  }
  // 독서대
  const ambo = new THREE.Group()
  ambo.add(cyl(0.25, 0.3, 1.1, std('#6b4a2c', { map: wood() }), 0, 0, 0), box(0.7, 0.05, 0.5, std('#8a6238'), 0, 1.15, 0))
  ambo.position.set(3.2, 0.4, Z0 + 4)
  scene.add(ambo)
  // 성모상 (왼쪽)
  const m = plasterMary(1.7, marbleT, env)
  m.position.set(-4.2, 0.4, Z0 + 2)
  m.rotation.y = 0.4
  realStatue(ctx, 'mary', new THREE.Vector3(-4.2, 0.4, Z0 + 2), 1.9, m, 0.6)
  scene.add(m, box(0.8, 0.4, 0.8, std('#d8cfbd'), -4.2, 0.4, Z0 + 2).translateY(-0.4))
  // 예수 성심상 (오른쪽, 성모상과 마주 봄)
  // 실사 석고상 사진이 있을 때만 받침과 함께 나타남
  const shBase = box(0.8, 0.4, 0.8, std('#d8cfbd'), 4.4, 0, Z0 + 2)
  shBase.visible = false
  scene.add(shBase)
  const shFacing = new THREE.Object3D()
  shFacing.rotation.y = -0.4
  realStatue(ctx, 'sacredheart', new THREE.Vector3(4.4, 0.4, Z0 + 2), 1.9, shFacing, 0.6, () => (shBase.visible = true))
  // 성수대 (입구)
  for (const x of [-1.6, 1.6]) {
    const f = new THREE.Group()
    f.add(cyl(0.08, 0.12, 0.9, std('#cfc6b4'), 0, 0, 0), cyl(0.3, 0.12, 0.15, std('#e8e2d4'), 0, 0.9, 0), cyl(0.26, 0.26, 0.02, std('#9fc8e8', { roughness: 0.1, metalness: 0.2 }), 0, 1.03, 0))
    f.position.set(x, 0, Z1 - 1)
    scene.add(f)
    ctx.block({ x0: x - 0.35, z0: Z1 - 1.35, x1: x + 0.35, z1: Z1 - 0.65 })
  }
  // 장의자
  const pewM = std('#b07c48', { map: wood('#9a6a3a'), roughness: 0.55 })
  for (let z = Z0 + 6.5; z <= Z1 - 3; z += 1.1)
    for (const x of [-2.6, 2.6]) {
      const p = pew(3.4, pewM)
      p.position.set(x, 0, z)
      scene.add(p)
    }
  for (let z = Z0 + 6.5; z <= Z1 - 3; z += 2.2) for (const x of [-1.6, 1.6, -3.2, 3.2]) ctx.seat(x, z - 0.05, 0.36, Math.PI)
  ctx.block({ x0: -4.4, z0: Z0 + 6.1, x1: -0.8, z1: Z1 - 2.5 })
  ctx.block({ x0: 0.8, z0: Z0 + 6.1, x1: 4.4, z1: Z1 - 2.5 })
  // 14처
  for (let i = 0; i < 14; i++) {
    const s = i < 7 ? -1 : 1
    const p = new THREE.Group()
    p.add(box(0.5, 0.6, 0.05, std('#3a2a1a')), box(0.4, 0.46, 0.06, std('#c9b38a'), 0, 0.07, 0.005))
    p.position.set(s * (W / 2 - 0.04), 2.2, Z0 + 6 + (i % 7) * 2.6)
    p.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2
    scene.add(p)
  }
  // 종 (밖의 종탑을 대신해 입구 옆 작은 종)
  scene.add(new THREE.HemisphereLight('#fff2dc', '#6a5034', 1.6))
  scene.add(new THREE.AmbientLight('#fff0dc', 0.3))
  const sun = new THREE.DirectionalLight('#ffe6c0', 1.2)
  sun.position.set(6, 10, 4)
  scene.add(sun)
  ctx.pointLight('#ffd49a', 8, 14, [0, 3.5, Z0 + 3])
  ctx.spot('tabernacle', 0, Z0 + 5.6, 1.8)
  ctx.spot('font', 0, Z1 - 2, 1.4)
  ctx.npc(-1.8, Z0 + 6.5, Math.PI, visitorLook('catholic', 0), 'pray')
  ctx.npc(3, Z0 + 7.6, Math.PI, visitorLook('catholic', 4), 'pray')
  ctx.walk({ x0: -W / 2, z0: Z0 + 5, x1: W / 2, z1: Z1 })
  return {
    spawn: [0, Z1 - 6],
    yaw: 0,
    look: LOOKS.catholic,
    dist: 4.2,
    maxDist: 7,
    camBox: { min: [-W / 2 + 0.3, 0.5, Z0 + 0.5], max: [W / 2 - 0.3, 7.5, Z1 - 0.3] },
    api: { bell: () => bell('church') },
  }
}

/** 성모 동산: 해 질 녘 성당 마당의 바위 동굴 */
export function buildGrotto(ctx: BuildCtx): Built {
  const { scene, high } = ctx
  sky(scene, [[0, '#1b2440'], [0.55, '#5a4a6a'], [0.8, '#d98a5a'], [1, '#f2c27a']])
  scene.fog = new THREE.Fog('#4a3f55', 14, 60)
  const ground = new THREE.Mesh(new THREE.CircleGeometry(40, 48), std('#4a5a3a', { roughness: 1 }))
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)
  ctx.floor(ground)
  // 돌길
  const path = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 16), std('#9a9080', { map: stone('#a09684', [2, 8]) }))
  path.rotation.x = -Math.PI / 2
  path.position.set(0, 0.01, 4)
  scene.add(path)
  // 바위 동굴
  let s = 1
  for (let i = 0; i <= 16; i++) {
    const a = Math.PI * (i / 16)
    const r = 3.3
    const x = Math.cos(a) * r, y = Math.sin(a) * r * 1.25
    const rk = rock(0.9 + (i % 3) * 0.25, i % 2 ? '#6a665e' : '#7a756b', s++)
    rk.position.set(x, y, -6 + Math.sin(i) * 0.3)
    scene.add(rk)
    const back = rock(1.2, '#57534c', s++)
    back.position.set(x * 0.7, y * 0.8, -7.2)
    scene.add(back)
  }
  const cave = new THREE.Mesh(new THREE.CircleGeometry(3, 32, 0, Math.PI), std('#1a1714', { roughness: 1 }))
  cave.position.set(0, 0, -6.6)
  cave.scale.y = 1.3
  scene.add(cave)
  for (let i = 0; i < 6; i++) {
    const rk = rock(1.1, '#6a665e', 50 + i)
    rk.position.set(-5 + i * 2, 0.2, -6.2 - (i % 2))
    if (Math.abs(rk.position.x) > 2.6) scene.add(rk)
  }
  // 성모상 (동굴 안 높은 곳)
  const m = plasterMary(2.2, marbleEnv(), brassEnv())
  m.position.set(0.9, 2.1, -6.1)
  m.rotation.y = -0.2
  realStatue(ctx, 'mary', new THREE.Vector3(0.9, 2.1, -6.1), 2.4, m, 0.5)
  scene.add(m, rock(0.5, '#77736b', 99).translateX(0.9).translateY(2).translateZ(-6.1))
  const mHalo = halo('#cfe0ff', 3, 0.35)
  mHalo.position.set(0.9, 3.2, -5.9)
  scene.add(mHalo)
  // 꽃
  const flowerPts: THREE.Vector3[] = []
  for (let i = 0; i < 80; i++) flowerPts.push(new THREE.Vector3((Math.random() - 0.5) * 6, 0.15 + Math.random() * 0.2, -5 + Math.random() * 0.9))
  scene.add(instances(new THREE.IcosahedronGeometry(0.08, 0), std('#f2f0ea', { roughness: 0.6, emissive: '#3a3a3a' }), flowerPts.slice(0, 40)))
  scene.add(instances(new THREE.IcosahedronGeometry(0.08, 0), std('#f6c3d0', { roughness: 0.6 }), flowerPts.slice(40)))
  // 봉헌초 받침
  const rack = votiveRack(ctx, 24, 12)
  rack.group.position.set(0, 0, -3.6)
  rack.group.scale.setScalar(1.4)
  scene.add(rack.group)
  ctx.block({ x0: -1.5, z0: -4.3, x1: 1.5, z1: -3.2 })
  ctx.tap(rack.group, () => { rack.light(); ctx.pose('pray') }, [0, -2.4])
  // 무릎틀
  scene.add(box(2.6, 0.2, 0.4, std('#5a3d24', { map: wood() }), 0, 0, -1.6))
  ctx.block({ x0: -1.4, z0: -1.85, x1: 1.4, z1: -1.35 })
  // 나무와 정원등
  for (const [x, z] of [[-7, -3], [7, -2], [-9, 4], [9, 6], [-6, 10], [6, 12]] as [number, number][]) scene.add(pine(4 + Math.abs(x) * 0.2, x, z))
  for (const z of [2, 7]) for (const x of [-1.6, 1.6]) {
    const p = cyl(0.04, 0.05, 1.2, std('#222'), x, 0, z)
    const l = halo('#ffd48a', 1.2, 0.9)
    l.position.set(x, 1.3, z)
    scene.add(p, l)
  }
  // 성당 실루엣 (뒤쪽 멀리)
  const church = new THREE.Group()
  church.add(box(10, 8, 6, std('#2a2430')), box(2.4, 16, 2.4, std('#2a2430'), -5, 0, 0))
  const spire = new THREE.Mesh(new THREE.ConeGeometry(1.4, 5, 4), std('#2a2430'))
  spire.position.set(-5, 18.5, 0)
  church.add(spire)
  for (let i = 0; i < 4; i++) church.add(box(0.8, 1.6, 0.1, new THREE.MeshBasicMaterial({ color: '#ffcf7a' }), -3 + i * 2.2, 3, 3.05))
  church.position.set(-10, 0, -18)
  church.rotation.y = 0.4
  scene.add(church)

  scene.add(new THREE.HemisphereLight('#b8c4f0', '#4a3a28', 1.3))
  const sun = new THREE.DirectionalLight('#ffb27a', 0.9)
  sun.position.set(10, 6, 8)
  scene.add(sun)
  ctx.pointLight('#ffb35a', high ? 14 : 8, 7, [0, 1.6, -3])
  ctx.pointLight('#cfe0ff', 6, 6, [0.9, 3.5, -5])
  ctx.spot('rack', 0, -2.4, 1.4)
  ctx.npc(-1.2, -2.2, Math.PI, visitorLook('catholic', 2), 'pray')
  ctx.npc(2.6, -1, Math.PI * 1.1, visitorLook('catholic', 3), 'pray')
  ctx.walk({ x0: -12, z0: -3.2, x1: 12, z1: 14 })
  return {
    spawn: [0, 9],
    yaw: 0,
    look: LOOKS.catholic,
    dist: 4,
    maxDist: 9,
    camBox: { min: [-20, 0.4, -5], max: [20, 12, 20] },
    api: { candle: () => ctx.walkTo(0, -2.4, () => { rack.light(); ctx.pose('pray') }), bell: () => bell('church') },
  }
}

/** 고해소 안내 공간 (입력·저장 없음) */
export function buildConfessional(ctx: BuildCtx): Built {
  const { scene } = ctx
  scene.background = new THREE.Color('#120d0a')
  scene.fog = new THREE.Fog('#120d0a', 8, 20)
  const W = 9, Z0 = -5, Z1 = 7
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, Z1 - Z0), std('#888', { map: marble('#b8ae9c', '#8a7e6a', [3, 3]) }))
  floor.rotation.x = -Math.PI / 2
  floor.position.z = (Z0 + Z1) / 2
  scene.add(floor)
  ctx.floor(floor)
  const wallM = std('#5a4a3a', { map: stone('#6a5a48', [4, 2]) })
  for (const [w, x, z, ry] of [[Z1 - Z0, -W / 2, (Z0 + Z1) / 2, Math.PI / 2], [Z1 - Z0, W / 2, (Z0 + Z1) / 2, -Math.PI / 2], [W, 0, Z0, 0], [W, 0, Z1, Math.PI]] as number[][]) {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, 6), wallM)
    m.position.set(x, 3, z)
    m.rotation.y = ry
    scene.add(m)
  }
  // 세 칸 나무 고해소
  const woodM = std('#5a3a22', { map: wood('#5a3a22'), roughness: 0.55 })
  const booth = new THREE.Group()
  booth.add(box(4.6, 3, 1.4, woodM, 0, 0, 0))
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 2.6, 0.8, 4, 1), woodM)
  roof.rotation.y = Math.PI / 4
  roof.scale.z = 0.4
  roof.position.y = 3.4
  booth.add(roof)
  for (const x of [-1.5, 0, 1.5]) {
    booth.add(box(1.2, 2.3, 0.05, x === 0 ? std('#3a2414', { map: wood('#3a2414') }) : std('#6b1e2a', { roughness: 0.9 }), x, 0.1, 0.72))
    booth.add(box(1.3, 0.12, 0.08, gold(), x, 2.45, 0.72))
  }
  booth.add(cross(0.5, gold(), 0.05).translateY(2.6).translateZ(0.75))
  booth.position.set(0, 0, Z0 + 0.8)
  scene.add(booth)
  ctx.block({ x0: -2.4, z0: Z0, x1: 2.4, z1: Z0 + 1.6 })
  scene.add(box(1.4, 0.2, 0.4, woodM, -2.9, 0, Z0 + 2.2))
  scene.add(new THREE.HemisphereLight('#e8d0a8', '#3a2a1a', 1.3))
  ctx.pointLight('#ffcf8a', 6, 12, [0, 3.2, Z0 + 3])
  const c = new Candle(ctx, 0.5, 0.05, '#f3ead6', true)
  c.group.position.set(3, 0, Z0 + 0.6)
  scene.add(c.group, cyl(0.15, 0.2, 0.9, std('#3a2a1a'), 3, 0, Z0 + 0.6).translateY(-0.9))
  c.group.position.y = 0.9
  ctx.walk({ x0: -W / 2, z0: Z0 + 1.6, x1: W / 2, z1: Z1 })
  return {
    spawn: [0, 2],
    yaw: 0,
    look: LOOKS.catholic,
    dist: 4,
    maxDist: 6,
    camBox: { min: [-W / 2 + 0.3, 0.5, Z0 + 0.3], max: [W / 2 - 0.3, 5, Z1 - 0.3] },
    api: {},
  }
}
