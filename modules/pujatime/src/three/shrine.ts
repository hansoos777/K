import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import type { DeityId } from '../data/deities'
import { themeLook, type ShrineTheme } from '../data/themes'
import { getPhoto } from '../lib/photo'
import type { FlowerKind } from '../data/flowers'
import { carvedGoldTexture, ceilingTexture, curtain, damaskTexture, FlowerShower, hangingBell, kalash, lightShaft, marigolds, pennants, PetalRain, pillarTrim, rangoli, sunburst, swag, tileTexture, torana, type Bead } from './decor'
import { CAST, makeDevotee } from './devotee'
import { brass, brassEnv, canvasTexture, damp, disposeScene, emblemTexture, Flame, glowTexture, keepTexture, makeFlameTextures, makeRenderer } from './kit'

// 내 신당. 카메라는 고정이고 손가락·기울기에 따라 살짝만 움직여 입체감을 줌.
// 감실 아치 윤곽. SVG 경로의 상대 베지어 값을 그대로 옮기고, 꼭짓점을 적게 샘플링해 삼각분할 부담을 줄임.
const ARCH = [[0, -14, 12, -20, 22, -20], [0, -22, 16, -32, 30, -32], [4, -20, 22, -30, 36, -30], [8, -14, 18, -22, 28, -30], [10, 8, 20, 16, 28, 30], [14, 0, 32, 10, 36, 30], [14, 0, 30, 10, 30, 32], [10, 0, 22, 6, 22, 20]]

function nichePoints(scale = 1) {
  const raw: [number, number][] = [[84, 412], [84, 196]]
  let [x, y] = [84, 196]
  for (const [a, b, c, d, e, f] of ARCH) {
    const curve = new THREE.CubicBezierCurve(new THREE.Vector2(x, y), new THREE.Vector2(x + a, y + b), new THREE.Vector2(x + c, y + d), new THREE.Vector2(x + e, y + f))
    curve.getPoints(5).slice(1).forEach((p) => raw.push([p.x, p.y]))
    x += e
    y += f
  }
  raw.push([316, 412])
  return raw.map(([px, py]) => new THREE.Vector2(((px - 200) / 100) * scale, ((412 - py) / 100) * (1 + (scale - 1) * 0.6) - (scale - 1) * 0.2))
}

const ART_C = new THREE.Vector3(0, 1.7, -0.32)
const ART_R = 1.26

// 방 모드 치수. 푸자·다르샨 화면의 고정 시점 신당은 이 값을 쓰지 않음.
const ROOM_W = 8 // 벽까지 절반 너비
const ROOM_BACK = -1.25
const ROOM_FRONT = 20
const ROOM_FLOOR = -0.59
const ROOM_TOP = 8.4
const WALK_X = 5.6
const WALK_Z = [2.2, 17] as const
const WALK_SPEED = 4
const CAM_DIST = 8
const MAX_LOOK = 0.6
// 내 신당은 공용 사원보다 차분하게 둠. 천장 꽃줄·깃발·떨어지는 꽃은 나중에 유료 꾸미기로 켤 장식
const ORNATE = false

export interface ShrineCallbacks {
  onBell?: () => void
  onLamp?: () => void
}

export class ShrineWorld {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(27, 0.8, 0.1, 60)
  private raf = 0
  private clock = new THREE.Clock()
  private env: THREE.Texture
  private ro: ResizeObserver
  private flameTex = makeFlameTextures()
  private flame: Flame
  private artiFlame: Flame
  private lamp = new THREE.Group()
  private artiLamp = new THREE.Group()
  private trail: THREE.Sprite[] = []
  private trailPos: THREE.Vector3[] = []
  private nicheGlow: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
  private beam!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>
  private disc: THREE.Mesh
  private discFace: THREE.MeshBasicMaterial
  private murti: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> | null = null
  private small: THREE.Mesh[] = []
  private bell = new THREE.Group()
  private bellHit: THREE.Mesh
  private lampHit: THREE.Mesh
  private hintRing: THREE.Sprite
  private flowers = new THREE.Group()
  private showers: FlowerShower[] = []
  private festive = new THREE.Group()
  private smoke: THREE.Sprite[] = []
  private dust!: THREE.Points
  private dustBase: Float32Array
  private bellAngle = 0
  private bellVel = 0
  private lit = false
  private litAmt = 0
  private hint: 'bell' | 'lamp' | null = null
  private artiAngle: number | null = null
  private px = 0
  private py = 0
  private tx = 0
  private ty = 0
  private cb: ShrineCallbacks = {}
  private flowerCount = 0
  private ray = new THREE.Raycaster()
  private deity: DeityId | null = null
  private alive = true
  // 방 모드: 캐릭터가 걸어다니고 매트에 앉음
  private room: boolean
  private me = new THREE.Group()
  private mySit: THREE.Group | null = null
  private myStand: THREE.Group | null = null
  private move = new THREE.Vector2()
  private target: THREE.Vector3 | null = null
  private onSeated: (() => void) | null = null
  private camPos = new THREE.Vector3(0, 5.2, 16)
  private camLook = new THREE.Vector3(0, 2, 2)
  private yaw = 0
  private drag: { x: number; moved: boolean } | null = null
  private dragged = false
  private roomFlames: Flame[] = []
  private sun: THREE.Mesh
  private petals: PetalRain | null = null
  private bigBells: THREE.Group[] = []
  private bellHits: THREE.Mesh[] = []

  private look

  constructor(private canvas: HTMLCanvasElement, room = false, private avatar = 0, theme?: ShrineTheme) {
    this.room = room
    this.look = themeLook(theme)
    this.renderer = makeRenderer(canvas)
    this.env = brassEnv(this.renderer)
    this.scene.background = new THREE.Color(this.look.bg)

    const hemi = new THREE.HemisphereLight(0xfff4dc, 0xd9a878, 2.2)
    const sun = new THREE.DirectionalLight(0xfff0d0, 1.8)
    sun.position.set(-3, 6, 7)
    this.scene.add(hemi, sun)
    if (room) {
      // 금장식이 도드라지는 붉은 사원. 점광원 대신 glow 스프라이트로 표현
      this.scene.fog = new THREE.Fog(this.look.bg, 24, 52)
      hemi.intensity = 2
      hemi.color.set(0xffd9a8)
      hemi.groundColor.set(0x8a4a24)
      sun.intensity = 1.4
      sun.position.set(0, 6, 10)
      sun.color.set(0xffc98a)
    }

    this.buildRoom()
    this.buildNiche()
    this.buildAltar()
    this.buildGarland()
    this.buildBell()

    // 감실 안쪽에서 도는 후광과 위쪽 금장식. 감실 틀에 가려져 안쪽만 보임
    this.sun = sunburst(4.4, 0.6)
    this.sun.position.set(0, 2.1, -0.84)
    const gate = torana(room ? 12 : 7.4)
    gate.position.set(0, room ? 5.95 : 4.25, -0.36)
    this.scene.add(this.sun, gate)
    if (ORNATE) this.petals = new PetalRain(room ? 14 : 12, room ? new THREE.Box3(new THREE.Vector3(-3.2, 0.3, 0.2), new THREE.Vector3(3.2, 6, 3)) : new THREE.Box3(new THREE.Vector3(-3.2, 0.3, 0.4), new THREE.Vector3(3.2, 5.6, 2)), room ? 0.1 : 0.08)
    if (this.petals) this.scene.add(this.petals.mesh)
    for (const s of [-1, 1]) {
      const k = kalash(this.env)
      k.position.set(s * 2.25, 0.16, 0.7)
      this.scene.add(k)
    }

    this.flame = new Flame(this.flameTex.flame, this.flameTex.glow, 0.3)
    this.buildDiya(this.lamp, this.flame)
    this.lamp.position.set(-1.24, 0.16, 0.72)
    this.scene.add(this.lamp)

    this.artiFlame = new Flame(this.flameTex.flame, this.flameTex.glow, 0.27)
    this.buildDiya(this.artiLamp, this.artiFlame)
    this.artiLamp.scale.setScalar(0.9)
    this.artiLamp.visible = false
    this.scene.add(this.artiLamp)

    const glowTex = glowTexture()
    for (let i = 0; i < 22; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }))
      s.visible = false
      this.trail.push(s)
      this.scene.add(s)
    }

    // 판(메달리온)과 옆에 모신 작은 신
    const discGeo = new THREE.CylinderGeometry(1, 1, 0.09, 64)
    discGeo.rotateX(Math.PI / 2)
    this.discFace = new THREE.MeshBasicMaterial({ color: 0xffffff })
    this.disc = new THREE.Mesh(discGeo, [brass(this.env), this.discFace, brass(this.env)])
    this.disc.scale.set(1.02, 1.02, 1)
    this.disc.position.set(0, 1.74, -0.82)
    this.disc.rotation.z = Math.PI / 2
    this.scene.add(this.disc)
    for (const x of [-0.95, 0.95]) {
      const m = new THREE.Mesh(discGeo, [brass(this.env), new THREE.MeshBasicMaterial({ color: 0xffffff }), brass(this.env)])
      m.scale.set(0.21, 0.21, 0.5)
      m.position.set(x, 0.54, -0.76)
      m.rotation.z = Math.PI / 2
      m.visible = false
      this.small.push(m)
      this.scene.add(m)
    }

    // 램프가 켜지면 감실 안쪽을 밝히는 빛
    this.nicheGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.3, 3.2),
      new THREE.MeshBasicMaterial({
        map: canvasTexture(128, 180, (c) => {
          const g = c.createRadialGradient(64, 170, 4, 64, 150, 130)
          g.addColorStop(0, 'rgba(255,196,96,.95)')
          g.addColorStop(1, 'rgba(255,130,40,0)')
          c.fillStyle = g
          c.fillRect(0, 0, 128, 180)
        }),
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    )
    this.nicheGlow.position.set(0, 1.5, -0.86)
    this.scene.add(this.nicheGlow)

    // 터치 판정용 투명 상자
    const hitMat = new THREE.MeshBasicMaterial({ visible: false })
    this.bellHit = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.7, 0.7), hitMat)
    this.bellHit.position.set(1.5, 2.72, 0.3)
    this.lampHit = new THREE.Mesh(new THREE.BoxGeometry(1, 0.9, 0.9), hitMat)
    this.lampHit.position.set(-1.2, 0.5, 0.72)
    this.scene.add(this.bellHit, this.lampHit)

    this.hintRing = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: canvasTexture(128, 128, (c) => {
          c.strokeStyle = '#fff2c0'
          c.lineWidth = 4
          c.fillStyle = 'rgba(255,220,130,.2)'
          c.beginPath()
          c.arc(64, 64, 58, 0, Math.PI * 2)
          c.fill()
          c.stroke()
        }),
        transparent: true,
        depthTest: false,
      }),
    )
    this.hintRing.visible = false
    this.scene.add(this.hintRing, this.flowers, this.festive)

    this.buildIncense()
    this.buildDust()
    const d = this.dust.geometry.getAttribute('position').array as Float32Array
    this.dustBase = d.slice()

    if (room) {
      this.camera.fov = 55
      this.buildRoomExtras()
      canvas.addEventListener('pointerdown', this.onDown)
      canvas.addEventListener('pointermove', this.onDrag)
      canvas.addEventListener('pointerup', this.onUp)
      canvas.addEventListener('pointercancel', this.onUp)
    }
    this.camera.position.set(0, 2.5, 12)
    this.camera.lookAt(0, 2.3, 0)

    canvas.addEventListener('click', this.onClick)
    window.addEventListener('pointermove', this.onPointer)
    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(canvas.parentElement!)
    this.resize()
    this.loop()
  }

  // 등불이 켜진 저녁의 넓은 기도방: 어두운 나무 벽과 기둥, 달이 보이는 창, 매달린 등잔
  private buildRoomExtras() {
    const len = ROOM_FRONT - ROOM_BACK
    const midZ = (ROOM_FRONT + ROOM_BACK) / 2
    const height = ROOM_TOP - ROOM_FLOOR

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W * 2, len), new THREE.MeshLambertMaterial({ map: tileTexture([8, 20]) }))
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, ROOM_FLOOR, midZ)
    this.scene.add(floor)

    const back = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W * 2, height), new THREE.MeshBasicMaterial({ map: damaskTexture([5, 3], this.look.wall) }))
    back.position.set(0, ROOM_FLOOR + height / 2, ROOM_BACK)
    const sideMat = new THREE.MeshBasicMaterial({ map: damaskTexture([7, 3], this.look.wall) })
    for (const s of [-1, 1]) {
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(len, height), sideMat)
      wall.position.set(s * ROOM_W, ROOM_FLOOR + height / 2, midZ)
      wall.rotation.y = -s * (Math.PI / 2)
      this.scene.add(wall)
      const drape = curtain(2.6, height)
      drape.position.set(s * 6.5, ROOM_FLOOR + height / 2, ROOM_BACK + 0.05)
      this.scene.add(drape)
    }
    const front = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W * 2, height), sideMat)
    front.position.set(0, ROOM_FLOOR + height / 2, ROOM_FRONT)
    front.rotation.y = Math.PI
    this.scene.add(back, front)

    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W * 2, len), new THREE.MeshBasicMaterial({ map: ceilingTexture([4, 10]) }))
    ceil.rotation.x = Math.PI / 2
    ceil.position.set(0, ROOM_TOP, midZ)
    const beams = new THREE.InstancedMesh(new THREE.BoxGeometry(ROOM_W * 2, 0.32, 0.42), brass(this.env), 7)
    const m = new THREE.Matrix4()
    for (let i = 0; i < 7; i++) beams.setMatrixAt(i, m.makeTranslation(0, ROOM_TOP - 0.16, ROOM_BACK + 1.5 + i * 2.8))
    this.scene.add(ceil, beams)

    // 신상 뒤와 바닥에 번지는 등불빛
    const glow = (w: number, h: number, opacity: number) =>
      new THREE.Mesh(
        new THREE.PlaneGeometry(w, h),
        new THREE.MeshBasicMaterial({ map: glowTexture('255,190,110', '235,105,35'), transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }),
      )
    const wallGlow = glow(15, 11, 0.62)
    wallGlow.position.set(0, 2.6, ROOM_BACK + 0.04)
    const floorGlow = glow(15, 13, 0.34)
    floorGlow.rotation.x = -Math.PI / 2
    floorGlow.position.set(0, ROOM_FLOOR + 0.02, 3.4)
    this.scene.add(wallGlow, floorGlow)

    // 달이 보이는 아치 창
    const windowMat = new THREE.MeshBasicMaterial({
      transparent: true,
      alphaTest: 0.5,
      map: canvasTexture(180, 300, (c) => {
        c.beginPath()
        c.moveTo(6, 296)
        c.lineTo(6, 92)
        c.arc(90, 92, 84, Math.PI, 0)
        c.lineTo(174, 296)
        c.closePath()
        const g = c.createLinearGradient(0, 0, 0, 300)
        g.addColorStop(0, '#16224f')
        g.addColorStop(0.62, '#4b2f6b')
        g.addColorStop(1, '#d9713a')
        c.fillStyle = g
        c.fill()
        c.save()
        c.clip()
        c.fillStyle = '#fff4cf'
        c.beginPath()
        c.arc(118, 76, 20, 0, Math.PI * 2)
        c.fill()
        for (let i = 0; i < 16; i++) c.fillRect((i * 47) % 170, (i * 31) % 150, 2, 2)
        c.strokeStyle = 'rgba(30,12,5,.9)'
        c.lineWidth = 3
        for (let i = -300; i < 300; i += 30) {
          c.beginPath()
          c.moveTo(i, 0)
          c.lineTo(i + 300, 300)
          c.moveTo(i + 180, 0)
          c.lineTo(i - 120, 300)
          c.stroke()
        }
        c.restore()
        c.strokeStyle = '#c99a4a'
        c.lineWidth = 7
        c.stroke()
      }),
    })
    for (const s of [-1, 1])
      for (const z of [4, 9, 14]) {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 3.8), windowMat)
        win.position.set(s * (ROOM_W - 0.03), 3.2, z)
        win.rotation.y = -s * (Math.PI / 2)
        this.scene.add(win)
      }

    // 나무 기둥과 기둥마다 놓인 등잔
    const pillarGeo = new THREE.LatheGeometry(
      [[0.38, 0], [0.38, 0.2], [0.27, 0.3], [0.24, 0.9], [0.31, 1], [0.24, 1.1], [0.2, 7.2], [0.3, 7.6], [0.46, 8.1], [0.46, 9], [0, 9]].map(([x, y]) => new THREE.Vector2(x, y)),
      14,
    )
    const zs = [1.6, 6.4, 11.2, 16]
    const pillars = new THREE.InstancedMesh(pillarGeo, new THREE.MeshLambertMaterial({ color: this.look.pillar }), zs.length * 2)
    const bowls = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.2, 0.09, 0.1, 14), brass(this.env), zs.length * 2 + 4)
    let n = 0
    const addFlame = (x: number, y: number, z: number, size: number) => {
      const f = new Flame(this.flameTex.flame, this.flameTex.glow, size)
      f.group.position.set(x, y + 0.05, z)
      f.group.visible = true
      this.roomFlames.push(f)
      this.scene.add(f.group)
      bowls.setMatrixAt(n++, m.makeTranslation(x, y, z))
    }
    zs.forEach((z, i) => {
      for (const s of [-1, 1]) {
        pillars.setMatrixAt(i * 2 + (s + 1) / 2, m.makeTranslation(s * 6.6, ROOM_FLOOR, z))
        addFlame(s * 6.15, 2.5, z, 0.3)
      }
    })

    // 천장에 매달린 등잔
    const chains = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.018, 0.018, 3.4, 6), brass(this.env), 4)
    ;[[-3.4, 6], [3.4, 6], [-3.4, 12], [3.4, 12]].forEach(([x, z], i) => {
      chains.setMatrixAt(i, m.makeTranslation(x, ROOM_TOP - 1.7, z))
      addFlame(x, ROOM_TOP - 3.4, z, 0.42)
    })
    this.scene.add(pillars, bowls, chains)
    this.scene.add(...pillarTrim(this.env, zs.flatMap((z): [number, number][] => [[-6.6, z], [6.6, z]]), { y0: ROOM_FLOOR, top: 9, r: 0.22, rings: [2, 3.6, 5.2, 6.8] }))

    // 기둥 사이와 방을 가로지르는 금잔화 줄, 삼각 깃발
    const beads: Bead[] = []
    for (const z of [6.4, 11.2]) beads.push(...swag(new THREE.Vector3(-6.5, 6.9, z), new THREE.Vector3(6.5, 6.9, z), 36, 1.3, 0.14))
    if (ORNATE) this.scene.add(marigolds(beads), pennants([{ z: 4, y: 7.7 }, { z: 8.8, y: 7.7 }, { z: 13.6, y: 7.7 }], 7.6, 22, 0.42, 0.7))

    // 신상 앞을 가장 밝게: 위에서 내리는 빛, 제단의 꽃 공양과 켜진 등잔
    const shaft = lightShaft(3.8, 8, 0.2)
    shaft.position.set(0, 4.1, -0.25)
    this.scene.add(shaft)
    const offering: Bead[] = []
    for (const s of [-1, 1])
      for (let i = 0; i < 9; i++) {
        const a = i * 2.4
        const k = 0.04 * i
        offering.push({ p: new THREE.Vector3(s * 1.62 + Math.cos(a) * k, 0.26 + (8 - i) * 0.016, 1.12 + Math.sin(a) * k * 0.7), r: 0.095 })
      }
    this.scene.add(marigolds(offering))
    for (const s of [-1, 1]) {
      const g = new THREE.Group()
      const f = new Flame(this.flameTex.flame, this.flameTex.glow, 0.26)
      this.buildDiya(g, f)
      f.group.visible = true
      g.scale.setScalar(0.6)
      g.position.set(s * 1.12 - 0.15, 0.2, 1.3)
      this.roomFlames.push(f)
      this.scene.add(g)
    }

    // 감실 양옆의 큰 종. 눌러서 울릴 수 있음
    for (const s of [-1, 1]) {
      const b = hangingBell(this.env, 1.7)
      b.position.set(s * 3.75, 8, 0.1)
      b.scale.setScalar(1.25)
      this.bigBells.push(b)
      const hit = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.2, 1), new THREE.MeshBasicMaterial({ visible: false }))
      hit.position.set(s * 3.75, 5, 0.1)
      this.bellHits.push(hit)
      this.scene.add(b, hit)
    }

    const rug = rangoli(1.9)
    rug.rotation.x = -Math.PI / 2
    rug.position.set(0, -0.58, 4.1)
    this.scene.add(rug)

    const mat = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.08, 1.2, 2, 0.03), new THREE.MeshLambertMaterial({ color: 0xd2622a }))
    mat.position.set(0, -0.54, 3.3)
    this.scene.add(mat)

    // 화분 두 개
    for (const [x, z] of [[-3.6, 1.2], [3.6, 1.2]]) {
      const pot = this.lathe([[0, 0], [0.32, 0], [0.42, 0.5], [0.46, 0.56], [0, 0.56]], new THREE.MeshLambertMaterial({ color: 0xb5582c }), 20)
      pot.position.set(x, -0.59, z)
      this.scene.add(pot)
      for (let i = 0; i < 9; i++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), new THREE.MeshLambertMaterial({ color: i % 2 ? 0x4f7d34 : 0x5f9140 }))
        const a = i * 2.4
        leaf.position.set(x + Math.cos(a) * 0.24, 0.12 + i * 0.09, z + Math.sin(a) * 0.24)
        leaf.scale.set(1, 0.7, 1)
        this.scene.add(leaf)
      }
    }

    const look = { ...CAST[this.avatar], ratio: 2 }
    this.mySit = makeDevotee({ ...look, pose: 'sit' })
    this.myStand = makeDevotee({ ...look, pose: 'stand' })
    this.mySit.visible = false
    this.me.add(this.mySit, this.myStand)
    this.me.scale.setScalar(0.64)
    this.me.position.set(0, ROOM_FLOOR, 9)
    this.me.rotation.y = Math.PI
    this.scene.add(this.me)
  }

  /** 조이스틱 입력. 범위 -1~1 */
  setMove(x: number, y: number) {
    this.move.set(x, y)
    if (x || y) {
      this.target = null
      this.onSeated = null
    }
  }

  private walkTo(x: number, z: number, seated: (() => void) | null = null) {
    this.target = new THREE.Vector3(THREE.MathUtils.clamp(x, -WALK_X, WALK_X), ROOM_FLOOR, THREE.MathUtils.clamp(z, ...WALK_Z))
    this.onSeated = seated
  }

  /** 매트까지 걸어가 앉은 뒤 콜백 호출 */
  sitAtMat(done: () => void) {
    this.walkTo(0, 3.3, done)
  }

  private updateRoom(dt: number, t: number) {
    const p = this.me.position
    let walking = false
    let dir: THREE.Vector3 | null = null
    if (this.move.length() > 0.08) {
      // 카메라가 돌아간 만큼 조이스틱 방향도 돌림
      dir = new THREE.Vector3(
        Math.cos(this.yaw) * this.move.x + Math.sin(this.yaw) * this.move.y,
        0,
        -Math.sin(this.yaw) * this.move.x + Math.cos(this.yaw) * this.move.y,
      ).normalize()
    } else if (this.target) {
      const to = this.target.clone().sub(p).setY(0)
      if (to.length() < 0.06) {
        p.copy(this.target)
        this.target = null
        if (this.onSeated) {
          this.me.rotation.y = Math.PI
          this.mySit!.visible = true
          this.myStand!.visible = false
          p.y = -0.5
          const done = this.onSeated
          this.onSeated = null
          setTimeout(done, 650)
        }
      } else dir = to.normalize()
    }
    if (dir) {
      walking = true
      this.mySit!.visible = false
      this.myStand!.visible = true
      p.y = ROOM_FLOOR
      p.addScaledVector(dir, WALK_SPEED * dt)
      p.x = THREE.MathUtils.clamp(p.x, -WALK_X, WALK_X)
      p.z = THREE.MathUtils.clamp(p.z, ...WALK_Z)
      const want = Math.atan2(dir.x, dir.z)
      const diff = Math.atan2(Math.sin(want - this.me.rotation.y), Math.cos(want - this.me.rotation.y))
      this.me.rotation.y += diff * Math.min(1, dt * 12)
    }
    const active = walking ? this.myStand! : this.mySit!.visible ? this.mySit! : this.myStand!
    active.position.y = walking ? Math.abs(Math.sin(t * 9)) * 0.1 : 0
    active.rotation.z = walking ? Math.sin(t * 9) * 0.06 : 0

    const k = Math.min(1, dt * 3)
    const sin = Math.sin(this.yaw)
    const cos = Math.cos(this.yaw)
    this.camPos.lerp(new THREE.Vector3(
      THREE.MathUtils.clamp(p.x + sin * CAM_DIST, -ROOM_W + 0.6, ROOM_W - 0.6),
      3.9,
      Math.min(p.z + cos * CAM_DIST, ROOM_FRONT - 0.5),
    ), k)
    this.camLook.lerp(new THREE.Vector3(p.x - sin * 3, 1.7, p.z - cos * 3), k)
    this.camera.position.copy(this.camPos)
    this.camera.lookAt(this.camLook)
  }

  private buildRoom() {
    const wall = new THREE.Mesh(new THREE.PlaneGeometry(9, 8), new THREE.MeshBasicMaterial({ map: damaskTexture([3, 3], this.look.wall) }))
    wall.position.set(0, 3, -1.25)
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 8), new THREE.MeshBasicMaterial({ map: tileTexture([12, 7]) }))
    floor.rotation.x = -Math.PI / 2
    floor.position.set(0, -0.6, 2.7)
    this.beam = new THREE.Mesh(
      new THREE.PlaneGeometry(9, 9),
      new THREE.MeshBasicMaterial({
        map: canvasTexture(256, 256, (c) => {
          const g = c.createLinearGradient(0, 0, 256, 256)
          g.addColorStop(0, 'rgba(255,248,220,.75)')
          g.addColorStop(0.7, 'rgba(255,248,220,0)')
          c.fillStyle = g
          c.fillRect(0, 0, 256, 256)
        }),
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    )
    this.beam.position.set(-1, 3, 1.6)
    this.scene.add(this.beam)
    this.beam.visible = false
    if (!this.room) this.scene.add(wall, floor)
  }

  private buildNiche() {
    const outer = new THREE.Shape(nichePoints(1.2))
    outer.holes.push(new THREE.Path(nichePoints(1)))
    const frame = new THREE.Mesh(
      new THREE.ExtrudeGeometry(outer, { depth: 0.5, bevelEnabled: true, bevelSize: 0.03, bevelThickness: 0.04, bevelSegments: 2, curveSegments: 6 }),
      new THREE.MeshMatcapMaterial({ matcap: this.env, map: carvedGoldTexture([1, 1]) }),
    )
    frame.position.z = -0.9
    this.scene.add(frame)

    const trimShape = new THREE.Shape(nichePoints(1.13))
    trimShape.holes.push(new THREE.Path(nichePoints(1.1)))
    const trim = new THREE.Mesh(new THREE.ExtrudeGeometry(trimShape, { depth: 0.04, bevelEnabled: false }), brass(this.env))
    trim.position.z = -0.37
    this.scene.add(trim)
    const lip = new THREE.Shape(nichePoints(1.03))
    lip.holes.push(new THREE.Path(nichePoints(1)))
    const lipMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(lip, { depth: 0.03, bevelEnabled: false }), brass(this.env))
    lipMesh.position.z = -0.37
    this.scene.add(lipMesh)

    const backTex = canvasTexture(256, 340, (c) => {
      const g = c.createRadialGradient(128, 190, 20, 128, 180, 230)
      g.addColorStop(0, '#c2552a')
      g.addColorStop(0.55, '#7c2312')
      g.addColorStop(1, '#3f0d07')
      c.fillStyle = g
      c.fillRect(0, 0, 256, 340)
    })
    const back = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(nichePoints(1))), new THREE.MeshBasicMaterial({ map: backTex }))
    const uv = back.geometry.getAttribute('uv')
    const pos = back.geometry.getAttribute('position')
    for (let i = 0; i < uv.count; i++) uv.setXY(i, (pos.getX(i) + 1.2) / 2.4, pos.getY(i) / 3.2)
    back.position.z = -0.88
    this.scene.add(back)
  }

  private buildAltar() {
    const marble = new THREE.MeshLambertMaterial({
      map: canvasTexture(256, 256, (c) => {
        c.fillStyle = '#fff9ee'
        c.fillRect(0, 0, 256, 256)
        c.strokeStyle = 'rgba(170,140,110,.22)'
        for (let i = 0; i < 14; i++) {
          c.beginPath()
          c.moveTo((i * 53) % 256, 0)
          c.bezierCurveTo(60, 80, 200, 140, (i * 97) % 256, 256)
          c.stroke()
        }
      }),
    })
    const top = new THREE.Mesh(new RoundedBoxGeometry(5.2, 0.28, 2.6, 3, 0.05), marble)
    top.position.set(0, 0.02, 0.2)
    const step = new THREE.Mesh(new RoundedBoxGeometry(5.7, 0.36, 3.2, 3, 0.05), marble)
    step.position.set(0, -0.42, 0.4)
    const clothTex = canvasTexture(256, 512, (c) => {
      const g = c.createLinearGradient(0, 0, 0, 512)
      g.addColorStop(0, '#d03a22')
      g.addColorStop(1, '#8c1c13')
      c.fillStyle = g
      c.fillRect(0, 0, 256, 512)
      c.fillStyle = '#e9b84e'
      c.fillRect(0, 0, 10, 512)
      c.fillRect(246, 0, 10, 512)
      c.fillRect(0, 470, 256, 10)
      for (let i = 0; i < 12; i++) {
        c.beginPath()
        c.arc(14 + i * 21, 490, 5, 0, Math.PI * 2)
        c.fill()
      }
    })
    const cloth = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 2.75), new THREE.MeshLambertMaterial({ map: clothTex }))
    cloth.rotation.x = -Math.PI / 2
    cloth.position.set(0, 0.17, 0.2)
    const fall = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.72), new THREE.MeshLambertMaterial({ map: clothTex }))
    fall.position.set(0, -0.2, 1.585)
    this.scene.add(top, step, cloth, fall)
  }

  private buildGarland() {
    const pts: { p: THREE.Vector3; r: number }[] = []
    const add = (a: THREE.Vector3, b: THREE.Vector3, n: number) => {
      for (let i = 0; i <= n; i++) {
        const t = i / n
        const p = a.clone().lerp(b, t)
        p.y -= Math.sin(t * Math.PI) * 0.34
        pts.push({ p, r: 0.085 })
      }
    }
    const L = new THREE.Vector3(-2.15, 4.6, 0.2)
    const M = new THREE.Vector3(0, 3.92, 0.2)
    const R = new THREE.Vector3(2.15, 4.6, 0.2)
    add(L, M, 26)
    add(M, R, 26)
    for (let i = 0; i < 6; i++) {
      pts.push({ p: new THREE.Vector3(-2.15, 4.7 + i * 0.13, 0.2), r: 0.078 })
      pts.push({ p: new THREE.Vector3(2.15, 4.7 + i * 0.13, 0.2), r: 0.078 })
    }

    this.scene.add(marigolds(pts))

    const leafShape = new THREE.Shape()
    leafShape.moveTo(0, 0)
    leafShape.bezierCurveTo(-0.1, -0.13, -0.08, -0.25, 0, -0.38)
    leafShape.bezierCurveTo(0.08, -0.25, 0.1, -0.13, 0, 0)
    const leafGeo = new THREE.ShapeGeometry(leafShape)
    const hang = pts.filter((_, i) => i < 53 && i % 6 === 2)
    const m = new THREE.Matrix4()
    const q = new THREE.Quaternion()
    const leaves = new THREE.InstancedMesh(leafGeo, new THREE.MeshLambertMaterial({ color: 0x4f7d34, side: THREE.DoubleSide }), hang.length)
    hang.forEach(({ p }, i) => {
      m.compose(new THREE.Vector3(p.x, p.y - 0.05, p.z + 0.03), q.identity(), new THREE.Vector3(1, 1, 1))
      leaves.setMatrixAt(i, m)
    })
    this.scene.add(leaves)
  }

  private lathe(points: [number, number][], mat: THREE.Material, seg = 40) {
    return new THREE.Mesh(new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), seg), mat)
  }

  private buildBell() {
    const mat = brass(this.env)
    this.bell.position.set(1.72, 4.1, 0.25)
    const dome = this.lathe(
      [[0, -0.28], [0.1, -0.3], [0.17, -0.36], [0.21, -0.47], [0.24, -0.62], [0.29, -0.76], [0.38, -0.88], [0.4, -0.92], [0.36, -0.92], [0.3, -0.84], [0, -0.8]],
      mat,
    )
    const links = new THREE.InstancedMesh(new THREE.TorusGeometry(0.035, 0.011, 8, 14), mat, 7)
    const m = new THREE.Matrix4()
    for (let i = 0; i < 7; i++) {
      m.makeRotationY(i % 2 ? Math.PI / 2 : 0).setPosition(0, -i * 0.042, 0)
      links.setMatrixAt(i, m)
    }
    const clapper = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), mat)
    clapper.position.y = -0.98
    this.bell.add(links, dome, clapper)
    this.scene.add(this.bell)
  }

  private buildDiya(group: THREE.Group, flame: Flame) {
    const mat = brass(this.env)
    const bowl = this.lathe([[0, -0.1], [0.17, -0.1], [0.3, -0.04], [0.37, 0.06], [0.38, 0.11], [0.33, 0.1], [0.27, 0.03], [0, 0.02]], mat)
    bowl.scale.z = 0.86
    const spout = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.3, 14), mat)
    spout.rotation.z = -Math.PI / 2 - 0.25
    spout.position.set(0.42, 0.11, 0)
    const ghee = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.29, 0.01, 28), new THREE.MeshBasicMaterial({ color: 0xa8701f }))
    ghee.position.y = 0.075
    ghee.scale.z = 0.86
    const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.018, 0.22, 8), new THREE.MeshBasicMaterial({ color: 0x3d2010 }))
    wick.rotation.z = -1.1
    wick.position.set(0.47, 0.16, 0)
    flame.group.position.set(0.56, 0.19, 0.02)
    flame.group.visible = false
    group.add(bowl, spout, ghee, wick, flame.group)
  }

  private buildIncense() {
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.012, 1.05, 6), new THREE.MeshBasicMaterial({ color: 0x6d3a1d }))
    stick.rotation.z = 0.13
    stick.position.set(1.52, 0.72, 0.5)
    const holder = this.lathe([[0, 0], [0.18, 0], [0.2, 0.05], [0.13, 0.11], [0.05, 0.13], [0, 0.13]], brass(this.env), 20)
    holder.position.set(1.59, 0.16, 0.5)
    this.scene.add(stick, holder)
    const tex = glowTexture('255,255,255', '245,240,235')
    for (let i = 0; i < 9; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, opacity: 0 }))
      this.smoke.push(s)
      this.scene.add(s)
    }
  }

  private buildDust() {
    const n = 46
    const a = new Float32Array(n * 3)
    for (let i = 0; i < n; i++) {
      a[i * 3] = -2.8 + ((i * 7.3) % 5)
      a[i * 3 + 1] = 0.5 + ((i * 3.1) % 4.3)
      a[i * 3 + 2] = 0.2 + ((i * 1.7) % 2.2)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(a, 3))
    this.dust = new THREE.Points(g, new THREE.PointsMaterial({ color: 0xfff2c4, size: 0.035, transparent: true, opacity: 0.75, depthWrite: false }))
    this.scene.add(this.dust)
  }

  setCallbacks(cb: ShrineCallbacks) {
    this.cb = cb
  }

  // 실사 이미지가 있으면 감실 안에 신상을 세우고 메달을 숨김. 없으면 메달 유지
  private loadMurti(id: DeityId) {
    const photo = id === 'custom' ? getPhoto() : null
    if (id === 'custom' && !photo) return
    new THREE.TextureLoader().load(photo ?? `/deities/${id}-murti.png`, (tex) => {
      if (!this.alive || this.deity !== id) return
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 4
      const img = tex.image as HTMLImageElement
      const h = photo ? Math.min(2.25, (1.8 * img.height) / img.width) : Math.min(2.6, (2.1 * img.height) / img.width)
      if (this.murti) {
        this.scene.remove(this.murti)
        this.murti.geometry.dispose()
        this.murti.material.dispose()
      }
      this.murti = new THREE.Mesh(
        new THREE.PlaneGeometry((h * img.width) / img.height, h),
        new THREE.MeshBasicMaterial({ map: tex, transparent: !photo, alphaTest: photo ? 0 : 0.04 }),
      )
      this.murti.position.set(0, (photo ? 0.42 : 0.18) + h / 2, -0.6)
      if (photo) {
        // 사진은 놋쇠 액자에 넣어 세움
        const w = (h * img.width) / img.height
        const frame = new THREE.Mesh(new THREE.BoxGeometry(w + 0.16, h + 0.16, 0.06), brass(this.env))
        frame.position.z = -0.05
        this.murti.add(frame)
      }
      this.scene.add(this.murti)
      this.disc.visible = false
    })
  }

  async setDeity(id: DeityId, others: DeityId[]) {
    if (this.deity !== id) {
      this.deity = id
      const t = keepTexture(await emblemTexture(id))
      if (!this.alive || this.deity !== id) return
      this.discFace.map = t
      this.discFace.needsUpdate = true
      this.loadMurti(id)
    }
    for (let i = 0; i < this.small.length; i++) {
      const o = others[i]
      this.small[i].visible = !!o
      if (o) {
        const t = keepTexture(await emblemTexture(o))
        if (!this.alive) return
        const face = (this.small[i].material as THREE.MeshBasicMaterial[])[1]
        face.map = t
        face.needsUpdate = true
      }
    }
  }

  setLit(lit: boolean) {
    this.lit = lit
    this.flame.group.visible = lit
  }

  setHideLamp(hide: boolean) {
    this.lamp.visible = !hide
  }

  setHint(h: 'bell' | 'lamp' | null) {
    this.hint = h
    this.hintRing.visible = !!h
    if (h === 'bell') this.hintRing.position.set(1.72, 3.5, 1)
    if (h === 'lamp') this.hintRing.position.set(-1.2, 0.5, 1.4)
  }

  swingBell() {
    this.bellVel = 2.1
  }

  setFlowers(list: FlowerKind[]) {
    for (let i = this.flowerCount; i < list.length; i++) {
      const shower = new FlowerShower(list[i], 40)
      this.showers.push(shower)
      this.flowers.add(shower.mesh)
      // 계속 올려도 폰이 느려지지 않도록 오래된 꽃부터 치움
      if (this.showers.length > 5) {
        const old = this.showers.shift()!
        this.flowers.remove(old.mesh)
        old.dispose()
      }
    }
    this.flowerCount = list.length
  }

  setFestival(on: boolean) {
    if (on === this.festive.visible && this.festive.children.length) return
    this.festive.visible = on
    if (on && !this.festive.children.length) {
      for (const x of [-2.2, -1.7, 1.25, 1.7, 2.15]) {
        const g = new THREE.Group()
        const f = new Flame(this.flameTex.flame, this.flameTex.glow, 0.26)
        this.buildDiya(g, f)
        f.group.visible = true
        g.scale.setScalar(0.58)
        g.position.set(x, 0.2, 1.3)
        g.userData.flame = f
        this.festive.add(g)
      }
    }
  }

  setArti(angle: number | null) {
    this.artiAngle = angle
    this.artiLamp.visible = angle !== null
    this.artiFlame.group.visible = angle !== null
    if (angle === null) this.trail.forEach((s) => (s.visible = false))
  }

  private onDown = (e: PointerEvent) => {
    this.drag = { x: e.clientX, moved: false }
    this.dragged = false
  }

  // 방 모드에서 드래그하면 좌우로 둘러봄
  private onDrag = (e: PointerEvent) => {
    if (!this.drag) return
    const dx = e.clientX - this.drag.x
    if (!this.drag.moved && Math.abs(dx) < 8) return
    this.drag.moved = true
    this.drag.x = e.clientX
    this.yaw = THREE.MathUtils.clamp(this.yaw - dx * 0.005, -MAX_LOOK, MAX_LOOK)
  }

  private onUp = () => {
    this.dragged = !!this.drag?.moved
    this.drag = null
  }

  private onClick = (e: MouseEvent) => {
    if (this.dragged) return
    const r = this.canvas.getBoundingClientRect()
    const p = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    this.ray.setFromCamera(p, this.camera)
    if (this.ray.intersectObjects([this.bellHit, ...this.bellHits]).length) this.cb.onBell?.()
    else if (this.ray.intersectObject(this.lampHit).length) this.cb.onLamp?.()
    else if (this.room) {
      const hit = this.ray.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.6), new THREE.Vector3())
      if (hit) this.walkTo(hit.x, hit.z)
    }
  }

  private onPointer = (e: PointerEvent) => {
    this.tx = (e.clientX / innerWidth - 0.5) * 2
    this.ty = (e.clientY / innerHeight - 0.5) * 2
  }

  private resize() {
    const p = this.canvas.parentElement!
    const w = p.clientWidth
    const h = p.clientHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    if (document.hidden) return
    const dt = Math.min(this.clock.getDelta(), 0.05)
    const t = this.clock.elapsedTime

    if (this.room) this.updateRoom(dt, t)
    else {
      this.px = damp(this.px, this.tx, 2.5, dt)
      this.py = damp(this.py, this.ty, 2.5, dt)
      this.camera.position.set(this.px * 0.32, 2.5 - this.py * 0.14, 12)
      this.camera.lookAt(0, 2.3, 0)
    }

    this.litAmt = damp(this.litAmt, this.lit || this.artiAngle !== null ? 1 : 0, 1.4, dt)
    this.nicheGlow.material.opacity = this.room ? Math.max(0.35, this.litAmt) : this.litAmt
    this.beam.material.opacity = (this.room ? 0.32 : 0.75) + Math.sin(t * 0.55) * (this.room ? 0.08 : 0.2)
    this.flame.tick(t)
    this.artiFlame.tick(t)
    this.roomFlames.forEach((f) => f.tick(t))

    // 종: 감쇠 진자
    this.bellVel += (-this.bellAngle * 14 - this.bellVel * 0.9) * dt
    this.bellAngle += this.bellVel * dt
    this.bell.rotation.z = this.bellAngle * 0.5
    this.bigBells.forEach((b, i) => (b.rotation.z = this.bellAngle * (i ? -0.32 : 0.32)))
    this.sun.rotation.z = t * 0.08
    this.petals?.tick(dt, t)

    this.smoke.forEach((s, i) => {
      const k = (t * 0.1 + i / this.smoke.length) % 1
      s.position.set(1.45 + Math.sin(k * 7 + i) * 0.16 * k, 1.25 + k * 2.2, 0.5)
      s.scale.setScalar(0.1 + k * 0.5)
      s.material.opacity = Math.sin(k * Math.PI) * 0.26
    })

    const d = this.dust.geometry.getAttribute('position') as THREE.BufferAttribute
    for (let i = 0; i < d.count; i++) {
      d.setY(i, this.dustBase[i * 3 + 1] + Math.sin(t * 0.22 + i) * 0.18)
      d.setX(i, this.dustBase[i * 3] + Math.cos(t * 0.17 + i * 2) * 0.14)
    }
    d.needsUpdate = true

    this.showers.forEach((s) => s.tick(dt, t))

    this.festive.children.forEach((g) => (g.userData.flame as Flame).tick(t))

    if (this.hint) this.hintRing.scale.setScalar((this.hint === 'bell' ? 1.15 : 0.95) * (1 + Math.sin(t * 2.8) * 0.08))

    if (this.artiAngle !== null) {
      const a = this.artiAngle
      const p = new THREE.Vector3(ART_C.x + Math.cos(a) * ART_R, ART_C.y - Math.sin(a) * ART_R, 0.5)
      this.artiLamp.position.copy(p).add(new THREE.Vector3(-0.5, -0.1, 0))
      this.trailPos.unshift(p.clone().add(new THREE.Vector3(0.02, 0.1, 0)))
      this.trailPos.length = Math.min(this.trailPos.length, this.trail.length)
      this.trail.forEach((s, i) => {
        const q = this.trailPos[i]
        s.visible = !!q
        if (q) {
          s.position.copy(q)
          s.scale.setScalar(0.72 - i * 0.022)
          s.material.opacity = 0.34 * (1 - i / this.trail.length)
        }
      })
    }

    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.alive = false
    cancelAnimationFrame(this.raf)
    this.ro.disconnect()
    this.canvas.removeEventListener('click', this.onClick)
    this.canvas.removeEventListener('pointerdown', this.onDown)
    this.canvas.removeEventListener('pointermove', this.onDrag)
    this.canvas.removeEventListener('pointerup', this.onUp)
    this.canvas.removeEventListener('pointercancel', this.onUp)
    window.removeEventListener('pointermove', this.onPointer)
    disposeScene(this.scene)
    this.env.dispose()
    this.renderer.dispose()
  }
}
