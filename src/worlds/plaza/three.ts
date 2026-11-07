import * as THREE from 'three'
import type { BuildCtx, Layout } from '../../engine/stage'
import { LOOKS } from '../../engine/avatar'
import { box, cyl, gold, halo, hanokRoof, pointedArch, sky, std } from '../../engine/props'
import { go } from '../../core/router'

/**
 * 믿어보까 광장: 모든 종교 공간으로 이어지는 공통 월드.
 * 광장 자체는 특정 종교를 상징하지 않는다(분수·나무·벤치·가로등만).
 * 앞쪽 반원에 네 종교의 대형 입구가 같은 크기 비율로 서 있고, 문으로 걸어 들어가면 그 종교 공간이 열린다.
 */
export type GateId = 'christian' | 'catholic' | 'temple' | 'mandir'
export interface Gate { id: GateId; to: string; label: string; x: number; z: number; rot: number; door: [number, number]; front: [number, number] }

/** 문을 지나면 들어갈 공간 */
export const GATE_TO: Record<GateId, string> = { christian: 'christian/traditional', catholic: 'catholic/gothic', temple: 'temple/courtyard', mandir: 'mandir/mandir' }
const R = 27
const ANG: Record<GateId, number> = { christian: -56, catholic: -19, temple: 19, mandir: 56 }

/** 광장 위의 문 위치 (화면 쪽 동작 버튼에서도 씀) */
export function gates(labels: Record<GateId, string>): Gate[] {
  return (Object.keys(ANG) as GateId[]).map((id) => {
    const a = (ANG[id] * Math.PI) / 180
    const x = Math.sin(a) * R, z = -Math.cos(a) * R
    const rot = Math.atan2(-x, -z) // 건물 정면(+z)이 광장 가운데를 보게
    const dx = Math.sin(rot), dz = Math.cos(rot)
    const depth = id === 'temple' ? 0.6 : 7
    return { id, to: GATE_TO[id], label: labels[id], x, z, rot, door: [x + dx * depth, z + dz * depth], front: [x + dx * (depth + 4), z + dz * (depth + 4)] }
  })
}

function signTexture(text: string, sub: string) {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 256
  const g = c.getContext('2d')!
  g.fillStyle = 'rgba(248,244,238,0.96)'
  g.beginPath()
  g.roundRect(8, 8, 1008, 240, 40)
  g.fill()
  g.fillStyle = '#3a3530'
  g.textAlign = 'center'
  g.font = '700 92px "LINE Seed Sans KR", "Apple SD Gothic Neo", sans-serif'
  g.fillText(text, 512, 128)
  g.font = '400 48px "LINE Seed Sans KR", "Apple SD Gothic Neo", sans-serif'
  g.fillStyle = '#7a6652'
  g.fillText(sub, 512, 206)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

function sign(text: string, sub: string, w = 6) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w / 4), new THREE.MeshBasicMaterial({ map: signTexture(text, sub), transparent: true }))
  return m
}

/** 가운데가 뾰족한 박공 지붕 */
function gable(w: number, h: number, d: number, mat: THREE.Material) {
  const s = new THREE.Shape()
  s.moveTo(-w / 2, 0)
  s.lineTo(0, h)
  s.lineTo(w / 2, 0)
  s.closePath()
  const geo = new THREE.ExtrudeGeometry(s, { depth: d, bevelEnabled: false })
  geo.translate(0, 0, -d / 2)
  return new THREE.Mesh(geo, mat)
}

function stainedTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 256
  const g = c.getContext('2d')!
  const cols = ['#c23b3b', '#2f5fb0', '#e8b23a', '#3c8a5a', '#7a3fa0', '#e07a2a']
  g.fillStyle = '#2a2230'
  g.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 16; i++) {
    g.fillStyle = cols[i % cols.length]
    g.beginPath()
    g.moveTo(128, 128)
    g.arc(128, 128, 120, (i / 16) * Math.PI * 2, ((i + 1) / 16) * Math.PI * 2)
    g.fill()
  }
  g.fillStyle = '#f2d36b'
  g.beginPath()
  g.arc(128, 128, 30, 0, Math.PI * 2)
  g.fill()
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

/** 개신교 교회: 흰 회벽, 박공지붕, 종탑과 빈 십자가 */
function church() {
  const g = new THREE.Group()
  const wall = std('#f3eee4'), roof = std('#8a4a34'), wood = std('#5a3820'), glass = std('#a9c7e6', { emissive: 0x23384f })
  g.add(box(10, 8, 13, wall, 0, 0, -1.5), gable(10.8, 4.2, 13.6, roof).translateY(8).translateZ(-1.5))
  g.add(box(3.4, 15, 3.4, wall, 0, 0, 4.4), cyl(0.01, 2.6, 6, roof, 0, 15, 4.4, 4).rotateY(Math.PI / 4))
  g.add(box(0.22, 2.6, 0.22, std('#3a3530'), 0, 21, 4.4), box(1.4, 0.22, 0.22, std('#3a3530'), 0, 22.6, 4.4))
  g.add(box(2.2, 3.6, 0.3, wood, 0, 0, 6.15))
  for (const x of [-3.2, 3.2]) g.add(box(1.2, 3.4, 0.2, glass, x, 3, 5.05))
  for (const z of [-6, -2.5, 1]) for (const s of [-1, 1]) g.add(box(0.2, 3.2, 1.1, glass, s * 5.05, 3, z))
  return g
}

/** 천주교 고딕 대성당: 두 탑, 장미창, 뾰족 아치 문 */
function cathedral() {
  const g = new THREE.Group()
  const stone = std('#ddd2bd'), slate = std('#4a4a56'), wood = std('#4a2e1c')
  g.add(box(14, 17, 14, stone, 0, 0, -2), gable(14.6, 6, 14.4, slate).translateY(17).translateZ(-2))
  for (const s of [-1, 1]) {
    g.add(box(4.4, 25, 4.4, stone, s * 6.4, 0, 4.4), cyl(0.01, 3.4, 9, slate, s * 6.4, 25, 4.4, 4).rotateY(Math.PI / 4))
    g.add(box(0.2, 1.6, 0.2, gold(), s * 6.4, 34, 4.4))
  }
  const rose = new THREE.Mesh(new THREE.CircleGeometry(2.8, 40), new THREE.MeshBasicMaterial({ map: stainedTexture() }))
  rose.position.set(0, 13.5, 5.06)
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.9, 0.22, 8, 40), stone)
  ring.position.copy(rose.position)
  g.add(rose, ring)
  const arch = new THREE.Mesh(new THREE.ShapeGeometry(pointedArch(3.4, 6)), wood)
  arch.position.set(0, 0, 5.07)
  g.add(arch, box(14, 0.6, 0.6, stone, 0, 9.4, 5))
  const glass = new THREE.MeshBasicMaterial({ map: stainedTexture() })
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(new THREE.ShapeGeometry(pointedArch(1.4, 4.4)), glass)
    w.position.set(s * 6.4, 12, 6.62)
    g.add(w)
  }
  return g
}

/** 불교 사찰: 일주문(기둥 한 줄 + 단청 + 기와지붕), 뒤로 법당 */
function temple() {
  const g = new THREE.Group()
  const red = std('#8a2a1c'), green = std('#2f6f5e'), tile = std('#3b4047'), stone = std('#c9c0ae')
  g.add(box(12, 0.5, 4, stone, 0, 0, 0))
  for (const x of [-3, 3]) g.add(cyl(0.38, 0.42, 5.4, red, x, 0.5, 0, 14))
  g.add(box(8.6, 0.6, 1.1, green, 0, 5.4, 0), box(8.6, 0.35, 1.3, std('#c8553d'), 0, 6, 0))
  const roof = hanokRoof(11, 4.2, 1.8, tile, 0.7)
  roof.position.y = 6.3
  g.add(roof)
  // 뒤쪽 법당
  g.add(box(16, 1, 9, stone, 0, 0, -10), box(14, 5, 7, std('#e6d9bf'), 0, 1, -10))
  for (const x of [-6, -2, 2, 6]) g.add(cyl(0.32, 0.34, 5, red, x, 1, -6.4, 12))
  const hall = hanokRoof(17, 11, 3.4, tile, 0.9)
  hall.position.set(0, 6, -10)
  g.add(hall, box(15, 0.5, 0.8, green, 0, 5.8, -6.4))
  return g
}

/** 힌두 사원: 층층이 줄어드는 고푸람(탑문)과 조각 장식 */
function gopuram() {
  const g = new THREE.Group()
  const cols = ['#e2a24c', '#d86a5a', '#3f9a95', '#e8c46a', '#c4557a', '#5aa36a']
  g.add(box(12, 6, 7, std('#d9a35a'), 0, 0, 0))
  g.add(box(2.8, 4.4, 0.3, std('#4a2414'), 0, 0, 3.55))
  let y = 6
  for (let i = 0; i < 7; i++) {
    const w = 11 - i * 1.15, d = 6.4 - i * 0.6, h = 1.9
    g.add(box(w, h, d, std(cols[i % cols.length]), 0, y, 0))
    // 층마다 작은 조각상 자리(감실)
    const n = Math.max(2, Math.floor(w / 1.6))
    for (let k = 0; k < n; k++) g.add(box(0.5, 0.9, 0.2, std(cols[(i + k + 2) % cols.length]), -w / 2 + 0.8 + (k * (w - 1.6)) / Math.max(1, n - 1), y + 0.45, d / 2 + 0.1))
    y += h
  }
  g.add(box(3, 1.2, 2, std('#d86a5a'), 0, y, 0))
  for (const x of [-1, 0, 1]) g.add(cyl(0.06, 0.28, 1.1, gold(), x, y + 1.2, 0, 10))
  return g
}

function tree(x: number, z: number, s = 1) {
  const g = new THREE.Group()
  g.add(cyl(0.16 * s, 0.22 * s, 2.4 * s, std('#6a4a32'), 0, 0, 0, 8))
  const leaf = std('#7fa35a', { flatShading: true })
  for (const [dx, dy, dz, r] of [[0, 3.2, 0, 1.6], [0.8, 2.7, 0.3, 1.1], [-0.7, 2.8, -0.4, 1.15], [0.1, 3.9, 0.2, 1.05]]) {
    const m = new THREE.Mesh(new THREE.IcosahedronGeometry(r * s, 1), leaf)
    m.position.set(dx * s, dy * s, dz * s)
    g.add(m)
  }
  g.position.set(x, 0, z)
  return g
}

function bench(x: number, z: number, rot: number) {
  const g = new THREE.Group()
  const wood = std('#a8794f'), iron = std('#3a3530')
  g.add(box(2, 0.12, 0.55, wood, 0, 0.45, 0), box(2, 0.5, 0.1, wood, 0, 0.6, -0.26))
  for (const s of [-1, 1]) g.add(box(0.08, 0.45, 0.5, iron, s * 0.85, 0, 0))
  g.position.set(x, 0, z)
  g.rotation.y = rot
  return g
}

function lamp(x: number, z: number) {
  const g = new THREE.Group()
  g.add(cyl(0.06, 0.09, 3.6, std('#3a3530'), 0, 0, 0, 8), new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 10), new THREE.MeshBasicMaterial({ color: 0xfff1d0 })).translateY(3.7))
  const h = halo('#ffe2a8', 1.6, 0.5)
  h.position.y = 3.7
  g.add(h)
  g.position.set(x, 0, z)
  return g
}

export function buildPlaza(ctx: BuildCtx, labels: Record<GateId, string>, subs: Record<GateId, string>): Layout {
  const { scene } = ctx
  sky(scene, [[0, '#9cc3e6'], [0.55, '#dfe9ef'], [1, '#f6eadb']])
  scene.fog = new THREE.Fog('#e9e4da', 70, 170)
  scene.add(new THREE.HemisphereLight(0xfff8ec, 0x8a9a6a, 2.3))
  const sun = new THREE.DirectionalLight(0xfff0d6, 1.5)
  sun.position.set(20, 30, 14)
  scene.add(sun)

  // 땅: 잔디 + 돌 광장 + 각 입구로 가는 길
  const grass = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), std('#a4c27e'))
  grass.rotation.x = -Math.PI / 2
  scene.add(grass)
  ctx.floor(grass)
  const plaza = new THREE.Mesh(new THREE.CircleGeometry(17, 64), std('#e8dfcf'))
  plaza.rotation.x = -Math.PI / 2
  plaza.position.y = 0.01
  scene.add(plaza)
  const ringM = new THREE.Mesh(new THREE.RingGeometry(16.5, 17, 64), std('#c9bba3'))
  ringM.rotation.x = -Math.PI / 2
  ringM.position.y = 0.02
  scene.add(ringM)

  // 가운데 분수 (중립 상징)
  const stone = std('#d8cfbf'), water = new THREE.MeshBasicMaterial({ color: 0x9fd0e6, transparent: true, opacity: 0.85 })
  scene.add(cyl(3, 3.2, 0.6, stone, 0, 0, 0, 40), new THREE.Mesh(new THREE.CircleGeometry(2.75, 40), water).rotateX(-Math.PI / 2).translateZ(0.56))
  scene.add(cyl(0.4, 0.55, 1.5, stone, 0, 0.6, 0, 20), cyl(1.2, 1.05, 0.25, stone, 0, 2.1, 0, 28), new THREE.Mesh(new THREE.CircleGeometry(1.05, 28), water).rotateX(-Math.PI / 2).translateZ(2.37))
  const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.16, 1.6, 8), water)
  spout.position.y = 3.1
  scene.add(spout)
  ctx.block({ x0: -3.3, z0: -3.3, x1: 3.3, z1: 3.3 })
  ctx.spot('fountain', 0, 4.6, 1.6)
  ctx.every((t) => { spout.scale.y = 1 + Math.sin(t * 3) * 0.08 })

  // 나무·벤치·가로등: 광장 테두리에 고르게
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2 + 0.11
    const r = i % 2 ? 19.5 : 21.5
    const x = Math.sin(a) * r, z = Math.cos(a) * r
    // 입구로 가는 길(앞쪽 반원)은 비워 둠
    if (z < -8 && Math.abs(x) < 23) continue
    scene.add(tree(x, z, 1.1))
    ctx.block({ x0: x - 0.5, z0: z - 0.5, x1: x + 0.5, z1: z + 0.5 })
  }
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 8
    const x = Math.sin(a) * 8.5, z = Math.cos(a) * 8.5
    scene.add(bench(x, z, Math.atan2(-x, -z) + Math.PI))
    scene.add(lamp(Math.sin(a + 0.36) * 10, Math.cos(a + 0.36) * 10))
  }

  // 네 종교의 입구
  const gs = gates(labels)
  const make: Record<GateId, () => THREE.Group> = { christian: church, catholic: cathedral, temple, mandir: gopuram }
  const path = std('#ddd2bf')
  for (const gt of gs) {
    const b = make[gt.id]()
    b.position.set(gt.x, 0, gt.z)
    b.rotation.y = gt.rot
    scene.add(b)
    // 표지판: 문 위
    const sg = sign(labels[gt.id], subs[gt.id], 5.6)
    const dx = Math.sin(gt.rot), dz = Math.cos(gt.rot)
    sg.position.set(gt.door[0] + dx * 0.6, gt.id === 'temple' ? 8.6 : 7.2, gt.door[1] + dz * 0.6)
    sg.rotation.y = gt.rot
    scene.add(sg)
    // 광장에서 입구까지 길
    const len = Math.hypot(gt.door[0], gt.door[1]) - 16
    const road = new THREE.Mesh(new THREE.PlaneGeometry(4.2, len), path)
    road.rotation.x = -Math.PI / 2
    road.rotation.z = -gt.rot
    road.position.set((gt.door[0] / Math.hypot(...gt.door)) * (16 + len / 2), 0.015, (gt.door[1] / Math.hypot(...gt.door)) * (16 + len / 2))
    scene.add(road)
    // 건물 몸체는 막고(문 앞은 비움). 일주문은 기둥 사이로 지나가고, 뒤쪽 법당만 막음
    const [back, half] = gt.id === 'temple' ? [10, 6.5] : gt.id === 'catholic' ? [2, 5.6] : [1.5, 4.6]
    const cx = gt.x - dx * back, cz = gt.z - dz * back
    ctx.block({ x0: cx - half, z0: cz - half, x1: cx + half, z1: cz + half })
    ctx.spot(`gate-${gt.id}`, gt.front[0], gt.front[1], 3.2)
  }

  // 문을 지나면 그 종교 공간으로 (짧게 어두워지며 전환)
  let busy = false
  ctx.every(() => {
    if (busy) return
    const me = ctx.me()
    for (const gt of gs) {
      if (Math.hypot(me.x - gt.door[0], me.z - gt.door[1]) < 2.3) {
        busy = true
        try { sessionStorage.setItem('plazaFrom', gt.id) } catch { /* 저장 못 해도 이동은 함 */ }
        const fade = document.createElement('div')
        fade.className = 'gate-fade'
        document.body.appendChild(fade)
        requestAnimationFrame(() => fade.classList.add('on'))
        setTimeout(() => { go(`w/${gt.to}`); setTimeout(() => fade.remove(), 700) }, 450)
        return
      }
    }
  })

  ctx.walk({ x0: -38, z0: -42, x1: 38, z1: 26 })

  // 다른 공간에서 돌아오면 그 입구 앞에서 광장 쪽을 보고 시작
  let spawn: [number, number] = [0, 11]
  let yaw = 0
  try {
    const back = sessionStorage.getItem('plazaReturn') as GateId | null
    const gt = gs.find((g) => g.id === back)
    if (gt) {
      spawn = [gt.front[0], gt.front[1]]
      yaw = Math.atan2(gt.front[0], gt.front[1]) // 광장 가운데 쪽
      sessionStorage.removeItem('plazaReturn')
    }
  } catch { /* 처음 입장 */ }
  return { spawn, yaw, look: LOOKS.christian, dist: 9, maxDist: 22, pitch: 0.32, lookY: 2.2, camBox: { min: [-50, 0.8, -56], max: [50, 30, 36] } }
}
