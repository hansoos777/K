import * as THREE from 'three'
import { jukbi, moktak } from '../../core/audio'
import { update } from '../../core/store'
import { LOOKS, visitorLook } from '../../engine/avatar'
import { cyl, box, std } from '../../engine/props'
import { lightShaft, sunburst } from '../../engine/pt/decor'
import { brass, brassEnv, canvasTexture, Flame, glowTexture, makeFlameTextures } from '../../engine/pt/kit'
import { buddha, dancheongBand, dancheongCeiling, lotusThrone, mandorla, maruTexture, realStatue } from '../../engine/pt/statues'
import type { BuildCtx, Layout } from '../../engine/stage'

type Built = Layout & { api: Record<string, () => void> }
const LANTERN = [0xff5a4a, 0xffb347, 0xffe066, 0x7ee08a, 0x6fb4ff, 0xff8fc8, 0xfff4e0]

/** 한지 격자문: 안쪽에서 빛이 비치는 창호 */
const latticeTexture = () =>
  canvasTexture(256, 512, (c) => {
    c.fillStyle = '#fff0cf'
    c.fillRect(0, 0, 256, 512)
    const g = c.createRadialGradient(128, 256, 10, 128, 256, 300)
    g.addColorStop(0, 'rgba(255,220,150,.5)')
    g.addColorStop(1, 'rgba(255,200,120,0)')
    c.fillStyle = g
    c.fillRect(0, 0, 256, 512)
    c.strokeStyle = '#7a3a1e'
    c.lineWidth = 7
    c.strokeRect(4, 4, 248, 504)
    c.lineWidth = 4
    for (let x = 0; x <= 256; x += 32) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, 512); c.stroke() }
    for (let y = 0; y <= 512; y += 32) { c.beginPath(); c.moveTo(0, y); c.lineTo(256, y); c.stroke() }
    // 꽃살 무늬 띠
    c.fillStyle = '#c8553d'
    c.fillRect(0, 230, 256, 52)
    c.fillStyle = '#fff0cf'
    for (let x = 16; x < 256; x += 32) { c.beginPath(); c.arc(x, 256, 10, 0, Math.PI * 2); c.fill() }
  })

/** 탱화 자리: 붉은 바탕에 금빛 구름·연꽃 */
const thangkaTexture = () =>
  canvasTexture(512, 512, (c) => {
    const g = c.createLinearGradient(0, 0, 0, 512)
    g.addColorStop(0, '#8a2416')
    g.addColorStop(1, '#5a140c')
    c.fillStyle = g
    c.fillRect(0, 0, 512, 512)
    c.strokeStyle = 'rgba(240,190,90,.45)'
    c.lineWidth = 3
    for (let i = 0; i < 18; i++) {
      const x = (i * 97) % 512, y = (i * 151) % 512
      c.beginPath()
      c.arc(x, y, 26, Math.PI, 0)
      c.arc(x + 34, y, 18, Math.PI, 0)
      c.arc(x + 62, y, 12, Math.PI, 0)
      c.stroke()
    }
    c.strokeStyle = '#e8b84e'
    c.lineWidth = 10
    c.strokeRect(10, 10, 492, 492)
  }, [3, 1])

export function buildDaeung(ctx: BuildCtx): Built {
  const { scene, high } = ctx
  const W = 28, Z0 = -22, Z1 = 14, H = 13
  const env = brassEnv()
  const gold = brass(env)
  scene.background = new THREE.Color('#2a1408')
  scene.fog = new THREE.Fog('#3a1c0c', 34, 70)
  scene.add(new THREE.HemisphereLight(0xfff3dc, 0xb08050, 2.6))
  const sun = new THREE.DirectionalLight(0xfff0d0, 1.2)
  sun.position.set(-5, 12, 8)
  scene.add(sun)

  // 마루 바닥
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, Z1 - Z0), std('#b07a48', { map: maruTexture([8, 10]) }))
  floor.rotation.x = -Math.PI / 2
  floor.position.z = (Z0 + Z1) / 2
  scene.add(floor)
  ctx.floor(floor)

  // 우물반자 단청 천장
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(W, Z1 - Z0), new THREE.MeshBasicMaterial({ map: dancheongCeiling([10, 13]) }))
  ceil.rotation.x = Math.PI / 2
  ceil.position.set(0, H, (Z0 + Z1) / 2)
  scene.add(ceil)

  // 옆벽: 빛이 비치는 한지 격자문
  const lat = new THREE.MeshBasicMaterial({ map: latticeTexture() })
  for (const s of [-1, 1]) for (let z = Z0 + 4; z < Z1; z += 3.2) {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(3, 6.4), lat)
    d.position.set(s * (W / 2 - 0.02), 3.6, z)
    d.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2
    scene.add(d)
  }
  const wallM = std('#7a3a1e')
  for (const s of [-1, 1]) {
    const up = new THREE.Mesh(new THREE.PlaneGeometry(Z1 - Z0, H - 6.8), wallM)
    up.position.set(s * (W / 2 - 0.01), 6.8 + (H - 6.8) / 2, (Z0 + Z1) / 2)
    up.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2
    scene.add(up)
  }
  // 뒷벽(불상 뒤): 탱화
  const back = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshBasicMaterial({ map: thangkaTexture() }))
  back.position.set(0, H / 2, Z0)
  scene.add(back)
  // 앞벽(입구 쪽)도 격자문
  for (let x = -W / 2 + 1.6; x < W / 2; x += 3.2) {
    const d = new THREE.Mesh(new THREE.PlaneGeometry(3, 6.4), lat)
    d.position.set(x, 3.6, Z1 - 0.02)
    d.rotation.y = Math.PI
    scene.add(d)
  }

  // 붉은 기둥 + 단청 들보
  const pillar = std('#9a2e1e')
  const bandM = new THREE.MeshBasicMaterial({ map: dancheongBand([1, 1]) })
  for (const x of [-7.5, 7.5]) for (let z = Z0 + 6; z <= Z1 - 2; z += 7) {
    scene.add(cyl(0.5, 0.55, H - 1.2, pillar, x, 0, z, 20), cyl(0.75, 0.8, 0.5, std('#c9bba0'), x, 0, z, 12))
    ctx.block({ x0: x - 0.7, z0: z - 0.7, x1: x + 0.7, z1: z + 0.7 })
  }
  for (const x of [-7.5, 7.5]) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, Z1 - Z0), [bandM, bandM, std('#2f7a63'), std('#2f7a63'), bandM, bandM])
    beam.position.set(x, H - 1.2, (Z0 + Z1) / 2)
    scene.add(beam)
  }
  for (let z = Z0 + 6; z <= Z1 - 2; z += 7) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(W, 1.0, 0.8), bandM)
    beam.position.set(0, H - 1.0, z)
    scene.add(beam)
  }

  // 수미단(불단) + 불상 + 광배 + 닫집
  const altarZ = Z0 + 5
  const base = new THREE.Group()
  base.add(box(10, 0.8, 6, std('#7a2c1e'), 0, 0, 0), box(9, 1.2, 5, std('#2f6a58'), 0, 0.8, 0), box(9.2, 0.25, 5.2, gold, 0, 2.0, 0))
  const front = new THREE.Mesh(new THREE.PlaneGeometry(9, 1.2), bandM)
  front.position.set(0, 1.4, 2.51)
  base.add(front)
  base.position.set(0, 0, altarZ)
  scene.add(base)
  ctx.block({ x0: -5.2, z0: Z0, x1: 5.2, z1: altarZ + 3.2 })
  const throne = lotusThrone(1.9, gold, brass(env, 0xffc8c0))
  throne.position.set(0, 2.25, altarZ)
  scene.add(throne)
  const b = buddha(env, 5.4)
  b.position.set(0, 3.1, altarZ)
  scene.add(b)
  // 실사 불상 사진이 있으면 연꽃 받침 위에 세움(받침 포함 사진이라 받침은 숨김)
  const realGroup = new THREE.Group()
  realGroup.add(b, throne)
  scene.add(realGroup)
  realStatue(ctx, 'buddha', new THREE.Vector3(0, 2.1, altarZ), 7.4, realGroup, 0.35)
  const halo = mandorla(7.6)
  halo.position.set(0, 3.1 + 5.4 * 0.62, altarZ - 1.1)
  scene.add(halo)
  const burst = sunburst(15, 0.5)
  burst.position.set(0, 7.2, altarZ - 1.3)
  scene.add(burst)
  ctx.every((_t, dt) => (burst.rotation.z += dt * 0.05))
  const headGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('255,240,200', '255,190,90'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55 }))
  headGlow.scale.setScalar(4)
  headGlow.position.set(0, 3.1 + 5.4 * 0.73, altarZ - 0.3)
  scene.add(headGlow)
  if (high) {
    const shaft = lightShaft(6, 11, 0.32)
    shaft.position.set(0, 6.5, altarZ + 1.6)
    scene.add(shaft)
  }
  // 닫집(불상 위 지붕 모양 장식)
  const canopy = new THREE.Group()
  canopy.add(box(8, 0.9, 4.4, bandM), box(8.6, 0.3, 5, gold, 0, 0.9, 0), box(7, 0.6, 3.6, std('#7a2c1e'), 0, 1.2, 0))
  for (let i = 0; i < 9; i++) {
    const tas = cyl(0.05, 0.12, 0.7, gold, -3.6 + i * 0.9, -0.7, 2.25, 8)
    canopy.add(tas)
  }
  canopy.position.set(0, H - 2.6, altarZ)
  scene.add(canopy)

  // 불단 앞 탁자: 촛대·향로·공양물
  const tableZ = altarZ + 4.4
  scene.add(box(6, 0.9, 1.4, std('#8a2e1e'), 0, 0, tableZ), box(6.2, 0.08, 1.5, gold, 0, 0.9, tableZ))
  ctx.block({ x0: -3.1, z0: tableZ - 0.8, x1: 3.1, z1: tableZ + 0.8 })
  const { flame: ft, glow: gt } = makeFlameTextures()
  const flames: Flame[] = []
  for (const x of [-2.2, 2.2]) {
    scene.add(cyl(0.12, 0.22, 0.9, gold, x, 0.95, tableZ, 12))
    const c = cyl(0.1, 0.1, 0.5, std('#f6efe0', { emissive: '#3a2a10' }), x, 1.85, tableZ, 12)
    scene.add(c)
    const f = new Flame(ft, gt, 0.4)
    f.group.position.set(x, 2.38, tableZ)
    scene.add(f.group)
    flames.push(f)
  }
  scene.add(cyl(0.4, 0.3, 0.4, brass(env, 0xc8a070), 0, 0.98, tableZ, 16))
  for (const [x, col] of [[-1.2, 0xe86a4a], [1.2, 0xf2c24a], [-0.6, 0x9ad06a], [0.6, 0xf28a6a]] as const) {
    scene.add(cyl(0.28, 0.18, 0.18, gold, x, 0.98, tableZ, 12))
    const fruit = new THREE.Mesh(new THREE.SphereGeometry(0.22, 12, 10), std('#fff', { emissive: '#000' }))
    ;(fruit.material as THREE.MeshLambertMaterial).color.setHex(col)
    fruit.position.set(x, 1.32, tableZ)
    scene.add(fruit)
  }
  // 향 연기
  const smoke: THREE.Sprite[] = []
  const smokeTex = glowTexture('240,236,228', '220,214,204')
  for (let i = 0; i < (high ? 12 : 6); i++) {
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: smokeTex, transparent: true, depthWrite: false, opacity: 0 }))
    scene.add(sp)
    smoke.push(sp)
  }
  let incense = 60
  ctx.every((t, dt) => {
    flames.forEach((f) => f.tick(t))
    if (incense <= 0) { smoke.forEach((s) => (s.material.opacity = 0)); return }
    incense -= dt
    smoke.forEach((s, i) => {
      const k = (t * 0.18 + i / smoke.length) % 1
      s.position.set(Math.sin(t * 0.8 + i) * 0.3 * k, 1.3 + k * 4.5, tableZ + Math.cos(t * 0.6 + i) * 0.2 * k)
      s.scale.setScalar(0.4 + k * 1.6)
      s.material.opacity = 0.35 * (1 - k) * Math.min(1, incense / 4)
    })
  })

  // 천장 가득한 연등 (인스턴스 한 번에)
  const lanternGeo = new THREE.SphereGeometry(0.34, 14, 10)
  lanternGeo.scale(1, 0.85, 1)
  const lanterns = new THREE.InstancedMesh(lanternGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }), 400)
  const tassel = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.02, 0.08, 0.5, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), 400)
  const dd = new THREE.Object3D()
  const col = new THREE.Color()
  let li = 0
  for (let z = Z0 + 9; z <= Z1 - 1.5; z += 1.35)
    for (let x = -W / 2 + 1.5; x <= W / 2 - 1.5; x += 1.3) {
      if (li >= 400) break
      const y = H - 2.1 - Math.sin((x + z) * 0.7) * 0.2
      dd.position.set(x, y, z)
      dd.updateMatrix()
      lanterns.setMatrixAt(li, dd.matrix)
      dd.position.y = y - 0.5
      dd.updateMatrix()
      tassel.setMatrixAt(li, dd.matrix)
      col.setHex(LANTERN[(li * 7 + Math.floor(z)) % LANTERN.length])
      lanterns.setColorAt(li, col)
      tassel.setColorAt(li, col)
      li++
    }
  lanterns.count = tassel.count = li
  scene.add(lanterns, tassel)
  // 연등 빛 (몇 개만 번짐 스프라이트)
  const lg = glowTexture('255,240,210', '255,170,90')
  for (let i = 0; i < (high ? 40 : 16); i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: lg, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.35 }))
    s.scale.setScalar(2.2)
    s.position.set(-W / 2 + 2 + ((i * 7.3) % (W - 4)), H - 2.3, Z0 + 10 + ((i * 3.7) % (Z1 - Z0 - 12)))
    scene.add(s)
  }

  // 방석 줄과 앉아 있는 스님·불자 (가운데 통로를 비움)
  const people: Parameters<BuildCtx['crowd']>[0] = []
  const cushionGeo = new THREE.CylinderGeometry(0.42, 0.45, 0.12, 20)
  const cushionPts: THREE.Vector3[] = []
  let pi = 0
  for (let r = 0; r < 6; r++)
    for (let c = 0; c < 8; c++) {
      const x = (c < 4 ? -1 : 1) * (2.2 + (c % 4) * 1.5)
      const z = altarZ + 8 + r * 1.7
      cushionPts.push(new THREE.Vector3(x, 0.06, z))
      if ((r * 8 + c) % 3 !== 1 && r < 5) people.push({ x, z, y: 0.12, yaw: Math.PI, look: visitorLook('temple', pi++), joined: pi % 2 === 0, bows: pi % 3 === 0 })
    }
  const cushions = new THREE.InstancedMesh(cushionGeo, std('#8c3a2c'), cushionPts.length)
  cushionPts.forEach((p, i) => { dd.position.copy(p); dd.rotation.set(0, 0, 0); dd.updateMatrix(); cushions.setMatrixAt(i, dd.matrix) })
  scene.add(cushions)
  ctx.crowd(people)

  ctx.spot('altar', 0, tableZ + 1.6, 2)
  ctx.spot('cushion', 0, altarZ + 7.4, 1.4)
  ctx.walk({ x0: -W / 2, z0: altarZ + 3.2, x1: W / 2, z1: Z1 })
  let lanternCount = 0
  return {
    spawn: [0, 3],
    yaw: 0,
    look: LOOKS.temple,
    dist: 8,
    maxDist: 14,
    pitch: 0.24,
    lookY: 2.2,
    camBox: { min: [-W / 2 + 0.5, 0.6, Z0 + 1], max: [W / 2 - 0.5, H - 3.8, Z1 - 0.4] },
    api: {
      bow: () => ctx.walkTo(0, altarZ + 7.4, () => ctx.pose('bow')),
      incense: () => ctx.walkTo(0, tableZ + 1.6, () => { incense = 180; ctx.pose('pray') }),
      moktak: () => moktak(),
      jukbi: () => jukbi(1),
      lantern: () => {
        // 연등 하나를 더 밝힘(색을 바꿔 반짝)
        const i = (lanternCount++ * 37) % li
        col.setHex(0xffffff)
        lanterns.setColorAt(i, col)
        lanterns.instanceColor!.needsUpdate = true
        setTimeout(() => { col.setHex(LANTERN[i % LANTERN.length]); lanterns.setColorAt(i, col); lanterns.instanceColor!.needsUpdate = true }, 1200)
        update((s) => ({ lanterns: s.lanterns + 1 }))
      },
    },
  }
}
