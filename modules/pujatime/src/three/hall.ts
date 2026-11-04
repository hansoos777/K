import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { DeityId } from '../data/deities'
import { ceilingTexture, curtain, damaskTexture, hangingBell, lightShaft, marigolds, pennants, pillarTrim, rangoli, sunburst, swag, tileTexture, torana, type Bead } from './decor'
import { bakeDevotee, CAST, makeDevotee, type DevoteeOpts } from './devotee'
import { brass, brassEnv, canvasTexture, damp, disposeScene, emblemTexture, Flame, keepTexture, makeFlameTextures, makeRenderer } from './kit'

// Global Mandir 홀. 산사처럼 신상을 향해 매트가 줄지어 있고, 바닥을 눌러 이동, 드래그로 둘러봄.
// 지금은 서버가 없어 주변 사람은 미리보기용. 실시간을 붙일 때 DEMO_CROWD를 실제 접속자로 교체할 것.
export const DEMO_CROWD = 38

// 건물(벽·기둥·신상 단)은 아래 수치로 만들고 arch 그룹을 S배로 키움. 사람과 매트 크기는 그대로.
const S = 3
const SANCTUM_S = 1.8 // 신상과 단은 건물보다 덜 키워야 공간이 커 보임
const HALL_W = 13
const HALL_Z_BACK = -9
const HALL_Z_FRONT = 13
const MURTI_Z = -7.2

// 여기부터는 실제 크기
const HALF_W = (HALL_W / 2) * S
const Z_BACK = HALL_Z_BACK * S
const Z_FRONT = HALL_Z_FRONT * S
// 랜선신앙: 교회·성당·대웅전처럼 웅장하게 천장을 높임(7 → 11, 실제 21m → 33m)
const ROOF = 11
const CEILING = ROOF * S
const WALK_X = 14.4 // 기둥 안쪽까지만 걸어감
const WALK_Z_MIN = -16
const WALK_SPEED = 5
const ROWS = 20
const COLS = 12
const CROWD_ROWS = 8 // 사람은 신상에 가까운 앞줄에만 앉힘
const MURTI = new THREE.Vector3(0, 1, MURTI_Z * S)

const SCALE = 0.5
const MAX_YAW = 0.24
interface Person {
  pos: THREE.Vector3
  yaw: number
  cast: number
  bow: number
  k: number
}

// 캐릭터 종류별로 합친 메시를 인스턴스로 그림. 종류 × 재질 수만큼만 드로우콜이 듦.
class Crowd {
  group = new THREE.Group()
  private sets: { who: Person[]; parts: THREE.InstancedMesh[] }[] = []
  private m = new THREE.Matrix4()
  private q = new THREE.Quaternion()
  private e = new THREE.Euler()
  private s = new THREE.Vector3(SCALE, SCALE, SCALE)

  constructor(people: Person[]) {
    CAST.forEach((c, i) => {
      const who = people.filter((p) => p.cast === i)
      if (!who.length) return
      const parts = bakeDevotee(makeDevotee({ ...c, ratio: 2, pose: 'sit' })).map(({ geo, mat }) => {
        const inst = new THREE.InstancedMesh(geo, mat, who.length)
        inst.frustumCulled = false
        return inst
      })
      this.group.add(...parts)
      this.sets.push({ who, parts })
    })
    this.update()
  }

  update() {
    for (const { who, parts } of this.sets) {
      who.forEach((p, i) => {
        this.e.set(p.bow * 1.0, p.yaw, 0, 'YXZ')
        this.m.compose(p.pos, this.q.setFromEuler(this.e), this.s)
        parts.forEach((x) => x.setMatrixAt(i, this.m))
      })
      parts.forEach((x) => (x.instanceMatrix.needsUpdate = true))
    }
  }
}

// 가운데 카펫이 통로가 되도록 좌우로 벌려서 앉힘
const seat = (r: number, c: number) => new THREE.Vector3((c - (COLS - 1) / 2) * 1.75 + (c < COLS / 2 ? -1.6 : 1.6), 0.075, -13 + r * 1.75)

export class HallWorld {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.PerspectiveCamera(52, 1, 0.3, 200)
  private arch = new THREE.Group()
  private sanctum = new THREE.Group()
  private env: THREE.Texture
  private raf = 0
  private clock = new THREE.Clock()
  private ro: ResizeObserver
  private flames: Flame[] = []
  private flameTex = makeFlameTextures()
  private lamps = new THREE.Group()
  private lampCount = 0
  private people: Person[] = []
  private crowd: Crowd
  private me: THREE.Group
  private myBody: THREE.Group
  private mySit: THREE.Group
  private myStand: THREE.Group
  private target: THREE.Vector3 | null = null
  private yaw = 0
  private pitch = 0.22
  private dist = 14
  private pinch = 0
  private pointers = new Map<number, { x: number; y: number }>()
  private down: { x: number; y: number; moved: boolean } | null = null
  private ray = new THREE.Raycaster()
  private floor: THREE.Mesh
  private mats: THREE.InstancedMesh
  private seats: THREE.Vector3[] = []
  private ringMark: THREE.Mesh
  private disc: THREE.MeshBasicMaterial
  private discMesh!: THREE.Mesh
  private cutout: THREE.Mesh | null = null
  private bowT = -1
  private move = new THREE.Vector2()
  private joyUsed = false
  private nodT = -1
  private sitting = false
  private nextBow = 2
  private alive = true
  private camGoal = new THREE.Vector3()
  private camLook = new THREE.Vector3()
  private sun!: THREE.Mesh
  private bells: THREE.Group[] = []

  constructor(private canvas: HTMLCanvasElement, private deity: DeityId, youLabel: string, avatar = 0) {
    this.renderer = makeRenderer(canvas)
    this.env = brassEnv(this.renderer)
    this.scene.background = new THREE.Color('#4a150b')
    this.scene.fog = new THREE.Fog('#5c1c0e', 60, 140)
    this.scene.add(new THREE.HemisphereLight(0xfff3dc, 0xc98f5f, 2.7))
    const sun = new THREE.DirectionalLight(0xfff0d0, 1.4)
    sun.position.set(-5, 9, 6)
    this.scene.add(sun)

    this.arch.scale.setScalar(S)
    this.sanctum.scale.setScalar(SANCTUM_S)
    this.sanctum.position.z = MURTI_Z * (S - SANCTUM_S)
    this.scene.add(this.arch, this.sanctum)
    this.floor = this.buildShell()
    this.buildPillars()
    this.disc = this.buildSanctum()
    this.mats = this.buildMats()
    this.sanctum.add(this.lamps)
    this.buildLampStands()
    this.buildDecor()

    const ring = new THREE.RingGeometry(0.34, 0.42, 32)
    ring.rotateX(-Math.PI / 2)
    this.ringMark = new THREE.Mesh(ring, new THREE.MeshBasicMaterial({ color: 0xfff0b0, transparent: true, opacity: 0.85 }))
    this.ringMark.visible = false
    this.scene.add(this.ringMark)

    const taken = new Set<number>()
    for (let i = 0; i < DEMO_CROWD; i++) {
      const s = (i * 17 + 3) % (CROWD_ROWS * COLS)
      if (taken.has(s) || s === this.startSeat()) continue
      taken.add(s)
      this.people.push({ pos: this.seats[s].clone(), yaw: Math.PI, cast: i % CAST.length, bow: 0, k: 0 })
    }
    this.crowd = new Crowd(this.people)
    this.scene.add(this.crowd.group)

    const look: Omit<DevoteeOpts, 'pose'> = { ...CAST[avatar], ratio: 2 }
    this.mySit = makeDevotee({ ...look, pose: 'sit' })
    this.myStand = makeDevotee({ ...look, pose: 'stand' })
    this.myStand.visible = false
    this.myBody = new THREE.Group()
    this.myBody.scale.setScalar(SCALE)
    this.myBody.add(this.mySit, this.myStand)
    this.me = new THREE.Group()
    this.me.add(this.myBody)
    const label = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: canvasTexture(128, 56, (c) => {
          c.fillStyle = 'rgba(255,250,235,.94)'
          c.beginPath()
          c.roundRect(4, 4, 120, 48, 24)
          c.fill()
          c.fillStyle = '#a23c10'
          c.font = '500 28px Mukta, sans-serif'
          c.textAlign = 'center'
          c.textBaseline = 'middle'
          c.fillText(youLabel, 64, 29)
        }),
        transparent: true,
        depthTest: false,
      }),
    )
    label.scale.set(0.38, 0.166, 1)
    label.position.y = 1.32
    this.me.add(label)
    this.me.position.copy(this.seats[this.startSeat()])
    this.me.rotation.y = Math.PI
    this.sitting = true
    this.scene.add(this.me)

    this.yaw = Math.atan2(this.me.position.x - MURTI.x, this.me.position.z - MURTI.z)
    this.placeCamera(1)
    void this.loadEmblem()
    this.loadMurti()

    canvas.addEventListener('pointerdown', this.onDown)
    canvas.addEventListener('pointermove', this.onMove)
    canvas.addEventListener('pointerup', this.onUp)
    canvas.addEventListener('pointercancel', this.onUp)
    canvas.addEventListener('wheel', this.onWheel, { passive: false })
    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(canvas.parentElement!)
    this.resize()
    this.loop()
  }

  private startSeat() {
    return 8 * COLS + 5
  }

  private async loadEmblem() {
    const t = keepTexture(await emblemTexture(this.deity))
    if (!this.alive) return
    this.disc.map = t
    this.disc.color.set(0xffffff)
    this.disc.needsUpdate = true
  }

  // public/models/<id>.glb 이 있으면 실사 신상을 받침대 위에 세우고 메달을 숨김
  private loadMurti() {
    new GLTFLoader().load(`/models/${this.deity}.glb`, (gltf) => {
      if (!this.alive) return
      const model = gltf.scene
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const k = (4.4 * SANCTUM_S) / size.y
      model.scale.setScalar(k)
      const c = box.getCenter(new THREE.Vector3()).multiplyScalar(k)
      model.position.set(-c.x, 0.9 * SANCTUM_S - box.min.y * k, MURTI.z - c.z)
      this.scene.add(model)
      this.discMesh.visible = false
    }, undefined, () => this.loadCutout())
  }

  // 3D 파일이 없으면 배경을 지운 실사 이미지를 받침대 위에 세움. 정면 시점이 대부분이라 잘 어울림
  private loadCutout() {
    new THREE.TextureLoader().load(`/deities/${this.deity}-murti.png`, (tex) => {
      if (!this.alive) return
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 4
      const img = tex.image as HTMLImageElement
      const h = 4.25 * SANCTUM_S
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry((h * img.width) / img.height, h),
        new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.04, side: THREE.DoubleSide }),
      )
      plane.position.set(0, 0.9 * SANCTUM_S + h / 2, MURTI.z + 0.2)
      this.scene.add(plane)
      this.cutout = plane
      this.discMesh.visible = false
    })
  }

  private buildShell() {
    const floorTex = tileTexture([14, 22])
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(HALL_W + 2, HALL_Z_FRONT - HALL_Z_BACK + 2), new THREE.MeshLambertMaterial({ map: floorTex }))
    floor.rotation.x = -Math.PI / 2
    this.arch.add(floor)

    const carpet = new THREE.Mesh(
      new THREE.PlaneGeometry(1.2, 20),
      new THREE.MeshLambertMaterial({
        map: canvasTexture(128, 128, (c) => {
          c.fillStyle = '#b42a1a'
          c.fillRect(0, 0, 128, 128)
          c.fillStyle = '#e9b84e'
          c.fillRect(0, 0, 12, 128)
          c.fillRect(116, 0, 12, 128)
        }, [1, 16]),
      }),
    )
    carpet.rotation.x = -Math.PI / 2
    carpet.position.set(0, 0.012, 3)
    this.arch.add(carpet)

    const stone = damaskTexture([5 * S, 2 * S])
    const wallMat = new THREE.MeshLambertMaterial({ map: stone })
    const H = ROOF
    for (const s of [-1, 1]) {
      const w = new THREE.Mesh(new THREE.PlaneGeometry(HALL_Z_FRONT - HALL_Z_BACK, H), wallMat)
      w.position.set(s * (HALL_W / 2), H / 2, 0)
      w.rotation.y = -s * (Math.PI / 2)
      this.arch.add(w)
      // 격자창과 들어오는 햇빛
      for (const z of [-3.5, 3, 9]) {
        const jali = new THREE.Mesh(
          new THREE.PlaneGeometry(2.4, 3.4),
          new THREE.MeshBasicMaterial({
            map: canvasTexture(160, 220, (c) => {
              const g = c.createLinearGradient(0, 0, 0, 220)
              g.addColorStop(0, '#ffe9a8')
              g.addColorStop(1, '#ff9d3c')
              c.fillStyle = g
              c.fillRect(0, 0, 160, 220)
              c.strokeStyle = '#b5791f'
              c.lineWidth = 7
              for (let i = -220; i < 220; i += 30) {
                c.beginPath()
                c.moveTo(i, 0)
                c.lineTo(i + 220, 220)
                c.moveTo(i + 160, 0)
                c.lineTo(i - 60, 220)
                c.stroke()
              }
              c.lineWidth = 12
              c.strokeRect(0, 0, 160, 220)
            }),
          }),
        )
        jali.position.set(s * (HALL_W / 2 - 0.02), 3.2, z)
        jali.rotation.y = -s * (Math.PI / 2)
        this.arch.add(jali)
        // 높은 창(위에서 빛이 들어오게)
        const hi = jali.clone()
        hi.scale.set(0.8, 1.2, 1)
        hi.position.y = 8.2
        this.arch.add(hi)
      }
    }
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(HALL_W, HALL_Z_FRONT - HALL_Z_BACK), new THREE.MeshBasicMaterial({ map: ceilingTexture([4, 7]) }))
    ceil.rotation.x = Math.PI / 2
    ceil.position.y = H
    this.arch.add(ceil)
    const beam = new THREE.BoxGeometry(HALL_W, 0.34, 0.4)
    const beams = new THREE.InstancedMesh(beam, brass(this.env), 9)
    const m = new THREE.Matrix4()
    for (let i = 0; i < 9; i++) {
      m.makeTranslation(0, H - 0.17, HALL_Z_BACK + 1.5 + i * 2.5)
      beams.setMatrixAt(i, m)
    }
    this.arch.add(beams)
    const front = new THREE.Mesh(new THREE.PlaneGeometry(HALL_W, H), wallMat)
    front.position.set(0, H / 2, HALL_Z_FRONT)
    front.rotation.y = Math.PI
    this.arch.add(front)
    return floor
  }

  private buildPillars() {
    const pts = [[0.42, 0], [0.42, 0.22], [0.3, 0.3], [0.27, 0.9], [0.34, 1], [0.27, 1.1], [0.24, 5.4], [0.34, 5.7], [0.5, 6.1], [0.5, 6.8], [0, 6.8]].map(([x, y]) => new THREE.Vector2(x, y))
    const geo = new THREE.LatheGeometry(pts, 16)
    const spots: [number, number][] = []
    for (const s of [-1, 1]) for (let k = 0; k < 7; k++) spots.push([s * 5.3, -6.6 + k * 3.2])
    const inst = new THREE.InstancedMesh(geo, new THREE.MeshLambertMaterial({ color: 0xa8291c }), spots.length)
    const m = new THREE.Matrix4()
    const k = ROOF / 6.8 // 기둥도 천장까지
    spots.forEach(([x, z], i) => inst.setMatrixAt(i, m.makeTranslation(x, 0, z).multiply(new THREE.Matrix4().makeScale(1, k, 1))))
    this.arch.add(inst, ...pillarTrim(this.env, spots, { y0: 0, top: ROOF, r: 0.25, rings: [1.05, 2.4, 3.7, 5, 6.6, 8.2, 9.6] }))
  }

  // 신상 주변의 금장식, 천, 꽃줄, 매달린 등잔
  private buildDecor() {
    const P = MURTI.z - 1.6 // 신상 바로 뒤
    this.sun = sunburst(25, 0.38)
    this.sun.position.set(0, 5.6, Z_BACK + 0.2)
    const shaft = lightShaft(18, 22, 0.16)
    shaft.position.set(0, 11, P + 0.5)
    this.scene.add(shaft)
    const gate = torana(32)
    gate.position.set(0, 21 - 6.6, P + 0.2)
    this.scene.add(this.sun, gate)
    for (const s of [-1, 1]) {
      const drape = curtain(7, CEILING)
      drape.position.set(s * 16, CEILING / 2, Z_BACK + 0.15)
      this.scene.add(drape)
      const bell = hangingBell(this.env, 4)
      bell.position.set(s * 10.5, 18, P + 0.6)
      bell.scale.setScalar(2)
      this.bells.push(bell)
      this.scene.add(bell)
    }

    const pillar = (k: number) => -19.8 + k * 9.6
    const beads: Bead[] = []
    for (const k of [1, 2, 3, 4]) {
      const z = pillar(k)
      beads.push(...swag(new THREE.Vector3(-15.6, 16, z), new THREE.Vector3(15.6, 16, z), 46, 3.4, 0.36))
    }
    // 높은 천장 아래 한 줄 더
    for (const k of [1, 2, 3, 4]) beads.push(...swag(new THREE.Vector3(-15.6, 25, pillar(k)), new THREE.Vector3(15.6, 25, pillar(k)), 46, 3.6, 0.36))
    this.scene.add(marigolds(beads), pennants([-5.4, 4.2, 13.8, 23.4].map((z) => ({ z, y: 28 })), 18.5, 26, 1.1, 1.6))

    // 천장의 등잔
    const spots = [-14, -2, 10, 22].flatMap((z) => [[-9, z], [9, z]])
    const LAMP_Y = 14
    const chains = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.05, 0.05, CEILING - LAMP_Y, 6), brass(this.env), spots.length)
    const bowls = new THREE.InstancedMesh(new THREE.LatheGeometry([[0, -0.3], [0.3, -0.26], [0.62, -0.05], [0.7, 0.06], [0, 0.04]].map(([x, y]) => new THREE.Vector2(x, y)), 18), brass(this.env), spots.length)
    const m = new THREE.Matrix4()
    spots.forEach(([x, z], i) => {
      chains.setMatrixAt(i, m.makeTranslation(x, (CEILING + LAMP_Y) / 2, z))
      bowls.setMatrixAt(i, m.makeTranslation(x, LAMP_Y, z))
      const f = new Flame(this.flameTex.flame, this.flameTex.glow, 0.9)
      f.group.position.set(x, LAMP_Y + 0.1, z)
      f.group.visible = true
      this.flames.push(f)
      this.scene.add(f.group)
    })
    const mat = rangoli(3)
    mat.rotation.x = -Math.PI / 2
    mat.position.set(0, 0.05, -15.2)
    this.scene.add(chains, bowls, mat)
  }

  private buildSanctum() {
    // 뒷벽 벽화: 그림이 없을 때 쓰는 붉은 금박 문양. public/deities/mural.jpg 를 쓰도록 나중에 교체 가능.
    const mural = canvasTexture(1024, 512, (c) => {
      const g = c.createRadialGradient(512, 280, 60, 512, 280, 620)
      g.addColorStop(0, '#b0431f')
      g.addColorStop(1, '#4b120a')
      c.fillStyle = g
      c.fillRect(0, 0, 1024, 512)
      c.strokeStyle = 'rgba(240,195,100,.5)'
      for (let y = 0; y < 5; y++)
        for (let x = 0; x < 11; x++) {
          c.save()
          c.translate(46 + x * 94 + (y % 2) * 47, 56 + y * 100)
          for (let a = 0; a < 8; a++) {
            c.rotate(Math.PI / 4)
            c.beginPath()
            c.ellipse(16, 0, 16, 6, 0, 0, Math.PI * 2)
            c.stroke()
          }
          c.restore()
        }
      c.lineWidth = 10
      c.strokeStyle = '#e0ad4a'
      c.strokeRect(10, 10, 1004, 492)
    })
    const back = new THREE.Mesh(new THREE.PlaneGeometry(HALL_W, 7), new THREE.MeshBasicMaterial({ map: mural }))
    back.position.set(0, 3.5, HALL_Z_BACK)
    this.arch.add(back)
    const upper = new THREE.Mesh(new THREE.PlaneGeometry(HALL_W, ROOF - 7), new THREE.MeshLambertMaterial({ map: damaskTexture([5 * S, 2 * S]) }))
    upper.position.set(0, 7 + (ROOF - 7) / 2, HALL_Z_BACK)
    this.arch.add(upper)

    const marble = new THREE.MeshLambertMaterial({ color: 0xfff6e6 })
    ;[[6.6, 0.3, 3.6, 0.15], [5.2, 0.3, 2.9, 0.45], [3.8, 0.3, 2.2, 0.75]].forEach(([w, h, d, y]) => {
      const s = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, 0.04), marble)
      s.position.set(0, y, MURTI_Z)
      this.sanctum.add(s)
    })

    const face = new THREE.MeshBasicMaterial({ color: 0x8a5a2c })
    const geo = new THREE.CylinderGeometry(1.75, 1.75, 0.22, 64)
    geo.rotateX(Math.PI / 2)
    const disc = new THREE.Mesh(geo, [brass(this.env), face, brass(this.env)])
    disc.position.set(0, 3.1, MURTI_Z)
    disc.rotation.z = Math.PI / 2
    this.discMesh = disc
    this.sanctum.add(disc)

    // 광배
    const halo = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.09, 12, 72), brass(this.env))
    halo.position.set(0, 3.1, MURTI_Z - 0.1)
    this.sanctum.add(halo)
    const rayGeo = new THREE.ConeGeometry(0.11, 0.48, 6)
    const rays = new THREE.InstancedMesh(rayGeo, brass(this.env), 36)
    const m = new THREE.Matrix4()
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2
      m.makeRotationZ(a - Math.PI / 2).setPosition(Math.cos(a) * 2.42, 3.1 + Math.sin(a) * 2.42, MURTI_Z - 0.1)
      rays.setMatrixAt(i, m)
    }
    this.sanctum.add(rays)
    return face
  }

  private buildMats() {
    const geo = new RoundedBoxGeometry(1.15, 0.07, 1.15, 2, 0.03)
    const inst = new THREE.InstancedMesh(geo, new THREE.MeshLambertMaterial({ color: 0xffffff }), ROWS * COLS)
    const colors = [0xc23b24, 0xa8301d, 0xd2622a].map((c) => new THREE.Color(c))
    const m = new THREE.Matrix4()
    let i = 0
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++) {
        const p = seat(r, c)
        this.seats.push(p)
        m.makeTranslation(p.x, 0.04, p.z)
        inst.setMatrixAt(i, m)
        inst.setColorAt(i, colors[(r + c) % 3])
        i++
      }
    this.scene.add(inst)
    return inst
  }

  private buildLampStands() {
    const mat = brass(this.env)
    const geo = new THREE.LatheGeometry(
      [[0.3, 0], [0.3, 0.05], [0.08, 0.12], [0.05, 1.1], [0.09, 1.2], [0.05, 1.3], [0.28, 1.5], [0.3, 1.56], [0, 1.52]].map(([x, y]) => new THREE.Vector2(x, y)),
      16,
    )
    for (const x of [-2.9, 2.9, -4.3, 4.3]) {
      const s = new THREE.Mesh(geo, mat)
      s.position.set(x, 0, -5)
      const f = new Flame(this.flameTex.flame, this.flameTex.glow, 0.34)
      f.group.position.set(x, 1.58, -5)
      f.group.visible = true
      this.flames.push(f)
      this.arch.add(s, f.group)
    }
  }

  /** 조이스틱 입력. 범위 -1~1 */
  setMove(x: number, y: number) {
    this.move.set(x, y)
  }

  /** 합장: 몸을 살짝 숙임 */
  namaste() {
    this.nodT = 0
  }

  /** 절: 앉은 자세에서 바닥까지 숙였다 올라옴 */
  pranam() {
    this.bowT = 0
    this.pose(true)
  }

  private pose(sit: boolean) {
    this.mySit.visible = sit
    this.myStand.visible = !sit
  }

  /** 신상 앞 줄에 램프를 하나 올림. 지금은 이 기기에서만 보임 */
  lightLamp() {
    const i = this.lampCount++ % 14
    const x = (i - 6.5) * 0.42
    const g = new THREE.Group()
    const bowl = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.07, 0.07, 14),
      brass(this.env),
    )
    const f = new Flame(this.flameTex.flame, this.flameTex.glow, 0.2)
    f.group.position.y = 0.04
    f.group.visible = true
    this.flames.push(f)
    g.add(bowl, f.group)
    g.position.set(x, 0.335, -5.5)
    this.lamps.add(g)
  }

  private placeCamera(k: number) {
    const focus = this.me.position.clone().add(new THREE.Vector3(0, 0.9, 0))
    const cp = Math.cos(this.pitch)
    this.camGoal.set(
      focus.x + Math.sin(this.yaw) * cp * this.dist,
      focus.y + Math.sin(this.pitch) * this.dist,
      focus.z + Math.cos(this.yaw) * cp * this.dist,
    )
    this.camGoal.y = Math.min(this.camGoal.y, CEILING - 1)
    this.camGoal.x = THREE.MathUtils.clamp(this.camGoal.x, -HALF_W + 1.2, HALF_W - 1.2)
    this.camGoal.z = THREE.MathUtils.clamp(this.camGoal.z, Z_BACK + 1.5, Z_FRONT - 1.2)
    this.camera.position.lerp(this.camGoal, k)
    const look = focus.clone().add(new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).multiplyScalar(2.2))
    look.y += 5.4 // 랜선신앙: 높은 천장이 보이도록 더 위쪽을 봄
    this.camLook.lerp(look, k)
    this.camera.lookAt(this.camLook)
  }

  private onDown = (e: PointerEvent) => {
    this.canvas.setPointerCapture(e.pointerId)
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (this.pointers.size === 1) this.down = { x: e.clientX, y: e.clientY, moved: false }
    if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()]
      this.pinch = Math.hypot(a.x - b.x, a.y - b.y)
      if (this.down) this.down.moved = true
    }
  }

  private onMove = (e: PointerEvent) => {
    const prev = this.pointers.get(e.pointerId)
    if (!prev) return
    const dx = e.clientX - prev.x
    const dy = e.clientY - prev.y
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
    if (this.pointers.size === 2) {
      const [a, b] = [...this.pointers.values()]
      const d = Math.hypot(a.x - b.x, a.y - b.y)
      this.dist = THREE.MathUtils.clamp(this.dist * (this.pinch / d), 3, 20)
      this.pinch = d
      return
    }
    if (this.down && Math.hypot(e.clientX - this.down.x, e.clientY - this.down.y) > 8) this.down.moved = true
    if (this.down?.moved) {
      this.yaw -= dx * 0.006
      this.pitch = THREE.MathUtils.clamp(this.pitch + dy * 0.004, 0.08, 1.1)
    }
  }

  private onUp = (e: PointerEvent) => {
    this.pointers.delete(e.pointerId)
    if (this.down && !this.down.moved) this.tapFloor(e)
    if (!this.pointers.size) this.down = null
  }

  private onWheel = (e: WheelEvent) => {
    e.preventDefault()
    this.dist = THREE.MathUtils.clamp(this.dist + e.deltaY * 0.004, 3, 20)
  }

  private tapFloor(e: PointerEvent) {
    const r = this.canvas.getBoundingClientRect()
    this.ray.setFromCamera(new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1), this.camera)
    const hit = this.ray.intersectObject(this.floor)[0]
    if (!hit) return
    const p = hit.point.clone()
    p.x = THREE.MathUtils.clamp(p.x, -WALK_X, WALK_X)
    p.z = THREE.MathUtils.clamp(p.z, WALK_Z_MIN, Z_FRONT - 1)
    // 매트 근처를 누르면 그 매트에 앉음
    const near = this.seats.find((s) => s.distanceTo(p) < 0.75 && !this.people.some((q) => q.pos.distanceTo(s) < 0.1))
    if (near) p.copy(near)
    this.target = p.setY(near ? near.y : 0)
    this.sitting = false
    this.pose(false)
    this.ringMark.position.set(p.x, 0.1, p.z)
    this.ringMark.visible = true
  }

  private resize() {
    const p = this.canvas.parentElement!
    this.renderer.setSize(p.clientWidth, p.clientHeight, false)
    this.camera.aspect = p.clientWidth / p.clientHeight
    this.camera.updateProjectionMatrix()
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop)
    if (document.hidden) return
    const dt = Math.min(this.clock.getDelta(), 0.05)
    const t = this.clock.elapsedTime
    this.flames.forEach((f) => f.tick(t))
    this.sun.rotation.z = t * 0.06
    this.bells.forEach((b, i) => (b.rotation.z = Math.sin(t * 0.8 + i) * 0.03))
    // 평면 신상이 납작해 보이지 않게 항상 카메라 쪽을 향함
    if (this.cutout) this.cutout.rotation.y = Math.atan2(this.camera.position.x - this.cutout.position.x, this.camera.position.z - this.cutout.position.z)

    const push = this.move.length()
    if (push > 0.08) {
      // 카메라가 보는 방향을 기준으로 앞뒤좌우 이동
      this.target = null
      this.ringMark.visible = false
      this.joyUsed = true
      this.sitting = false
      this.pose(false)
      const dir = new THREE.Vector3(
        Math.cos(this.yaw) * this.move.x + Math.sin(this.yaw) * this.move.y,
        0,
        -Math.sin(this.yaw) * this.move.x + Math.cos(this.yaw) * this.move.y,
      )
      const p = this.me.position
      p.addScaledVector(dir, WALK_SPEED * dt)
      p.x = THREE.MathUtils.clamp(p.x, -WALK_X, WALK_X)
      p.z = THREE.MathUtils.clamp(p.z, WALK_Z_MIN, Z_FRONT - 1)
      p.y = 0
      const want = Math.atan2(dir.x, dir.z)
      const diff = Math.atan2(Math.sin(want - this.me.rotation.y), Math.cos(want - this.me.rotation.y))
      this.me.rotation.y += diff * Math.min(1, dt * 12)
      this.myBody.position.y = Math.abs(Math.sin(t * 9)) * 0.07
      this.myBody.rotation.z = Math.sin(t * 9) * 0.06
    } else if (this.joyUsed) {
      // 손을 떼면 빈 매트 위일 때만 앉음
      this.joyUsed = false
      this.myBody.position.y = 0
      this.myBody.rotation.z = 0
      const near = this.seats.find((s) => s.distanceTo(this.me.position) < 0.8 && !this.people.some((q) => q.pos.distanceTo(s) < 0.1))
      if (near) {
        this.me.position.copy(near)
        this.sitting = true
        this.pose(true)
      }
    } else if (this.target) {
      const to = this.target.clone().sub(this.me.position).setY(0)
      const d = to.length()
      if (d < 0.05) {
        this.me.position.copy(this.target)
        this.target = null
        this.ringMark.visible = false
        // 도착하면 신상을 향해 앉음
        this.sitting = true
        this.pose(true)
      } else {
        const step = Math.min(WALK_SPEED * dt, d)
        this.me.position.addScaledVector(to.normalize(), step)
        const want = Math.atan2(to.x, to.z)
        const diff = Math.atan2(Math.sin(want - this.me.rotation.y), Math.cos(want - this.me.rotation.y))
        this.me.rotation.y += diff * Math.min(1, dt * 10)
        this.myBody.position.y = Math.abs(Math.sin(t * 9)) * 0.07
        this.myBody.rotation.z = Math.sin(t * 9) * 0.06
      }
    } else {
      this.myBody.position.y = 0
      this.myBody.rotation.z = 0
      if (this.sitting) {
        const want = Math.atan2(MURTI.x - this.me.position.x, MURTI.z - this.me.position.z)
        const diff = Math.atan2(Math.sin(want - this.me.rotation.y), Math.cos(want - this.me.rotation.y))
        this.me.rotation.y += diff * Math.min(1, dt * 4)
      }
    }

    let tilt = 0
    if (this.bowT >= 0) {
      this.bowT += dt / 3.2
      tilt = Math.sin(Math.min(this.bowT, 1) * Math.PI) * 1.15
      if (this.bowT >= 1) this.bowT = -1
    } else if (this.nodT >= 0) {
      this.nodT += dt / 1.8
      tilt = Math.sin(Math.min(this.nodT, 1) * Math.PI) * 0.34
      if (this.nodT >= 1) this.nodT = -1
    }
    this.myBody.rotation.x = damp(this.myBody.rotation.x, tilt, 12, dt)

    // 미리보기 사람들이 가끔 절함
    if (t > this.nextBow) {
      this.nextBow = t + 2.5 + Math.random() * 3
      const p = this.people[Math.floor(Math.random() * this.people.length)]
      if (p) p.bow = 0.0001
    }
    this.people.forEach((p) => {
      if (p.bow > 0) {
        p.k += dt / 3.4
        p.bow = p.k >= 1 ? 0 : Math.sin(p.k * Math.PI)
        if (p.k >= 1) p.k = 0
      }
    })
    this.crowd.update()

    // 어느 자리에서든 신상이 화면에 남도록 신상 방향을 기준으로 회전 폭을 제한
    const toMurti = Math.atan2(this.me.position.x - MURTI.x, this.me.position.z - MURTI.z)
    this.yaw = THREE.MathUtils.clamp(this.yaw, toMurti - MAX_YAW, toMurti + MAX_YAW)
    this.placeCamera(Math.min(1, dt * 5))
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.alive = false
    cancelAnimationFrame(this.raf)
    this.ro.disconnect()
    this.canvas.removeEventListener('pointerdown', this.onDown)
    this.canvas.removeEventListener('pointermove', this.onMove)
    this.canvas.removeEventListener('pointerup', this.onUp)
    this.canvas.removeEventListener('pointercancel', this.onUp)
    this.canvas.removeEventListener('wheel', this.onWheel)
    disposeScene(this.scene)
    this.env.dispose()
    this.renderer.dispose()
  }
}
