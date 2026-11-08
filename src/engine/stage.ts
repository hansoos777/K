import * as THREE from 'three'
import { Avatar, type AvatarLook } from './avatar'
import { bakeDevotee, makeDevotee } from './pt/devotee'
import { disposeTextures } from './tex'

/**
 * 믿어보까 3D 무대. 모든 종교 공간이 같이 쓴다.
 * - 바닥을 누르면 걸어가고, 드래그하면 둘러보고, 두 손가락/휠로 확대·축소
 * - PC는 WASD·방향키로도 이동
 * - 프레임이 떨어지면 해상도를 자동으로 낮춤(저사양 폰 대응)
 * - 화면이 숨겨지면 그리기를 멈춤(배터리)
 * - 나갈 때 dispose()로 GPU 메모리를 모두 해제
 */
export interface Rect { x0: number; z0: number; x1: number; z1: number }

export interface BuildCtx {
  scene: THREE.Scene
  camera: THREE.Camera
  high: boolean
  /** 걸을 수 있는 영역 */
  walk(r: Rect): void
  /** 막힌 영역(기둥·의자 등) */
  block(r: Rect): void
  /** 눌러서 이동할 수 있는 바닥 메시 */
  floor(m: THREE.Object3D): void
  /** 누를 수 있는 물체: 누르면 그 앞(approach)으로 걸어가 fn 실행 */
  tap(o: THREE.Object3D, fn: () => void, approach?: [number, number]): void
  /** 매 프레임 실행 */
  every(fn: (t: number, dt: number) => void): void
  /** 실시간 점광원은 개수를 제한 (고급 모드 6개, 절약 모드 2개) */
  pointLight(color: string, intensity: number, distance: number, pos: [number, number, number]): THREE.PointLight | null
  /** 아바타 자세 (기도할 때 합장) */
  pose(p: 'idle' | 'pray' | 'bow' | 'sit'): void
  /** 아바타를 걸어가게 함 */
  walkTo(x: number, z: number, then?: () => void): void
  /** 화면에 짧은 안내 문구 */
  say(msg: string): void
  /** 가까이 가면 안내가 뜨는 지점 (id는 화면 쪽에서 문구·동작과 연결) */
  spot(id: string, x: number, z: number, r?: number): void
  /** 공간을 함께 채우는 방문객 (실제 사용자가 아님 · 장식용) */
  npc(x: number, z: number, yaw: number, look: AvatarLook, pose?: 'idle' | 'pray' | 'bow'): void
  /** 앉을 수 있는 자리 (장의자 빈 자리·의자·방석). y는 앉은 높이, yaw는 바라보는 방향 */
  seat(x: number, z: number, y: number, yaw: number): void
  /** 캐릭터를 (x, z) 쪽으로 돌리고 카메라도 그 뒤로 (가리지 않게 보기) */
  face(x: number, z: number): void
  /** 지금 캐릭터 위치 (바닥 기준) */
  me(): THREE.Vector3
  /** 빗자루로 쓰는 중인지 */
  isSweeping(): boolean
  /** 앉아 있는 많은 사람 (PujaTime 사원 홀처럼 종류별로 합쳐 인스턴스로 그림). bow가 있으면 가끔 절함 */
  crowd(people: { x: number; z: number; y?: number; yaw: number; look: AvatarLook; joined?: boolean; bows?: boolean }[], scale?: number): void
}

export interface Layout {
  spawn: [number, number]
  /** 처음 바라보는 방향(라디안, 0 = -z 쪽) */
  yaw: number
  look: AvatarLook
  /** 카메라가 벽 밖으로 나가지 않게 가둘 상자 */
  camBox?: { min: [number, number, number]; max: [number, number, number] }
  dist?: number
  maxDist?: number
  /** 카메라 높이 각도(라디안). 넓은 법당·성당은 낮게(PujaTime 0.22) */
  pitch?: number
  /** 카메라가 바라보는 높이(캐릭터 머리 위로 얼마나). 큰 상징물이 있으면 높게 */
  lookY?: number
}

export type Builder = (ctx: BuildCtx) => Layout

export interface StageOptions {
  high: boolean
  onTap?: () => void
  onSay?: (msg: string) => void
  /** 안내 지점에 들어가거나 나올 때 */
  onSpot?: (id: string | null) => void
  /** 빈자리 가까이 왔을 때('near') · 앉았을 때('seated') · 아무것도 아닐 때(null) */
  onSeat?: (s: 'near' | 'seated' | null) => void
}

export class Stage {
  renderer: THREE.WebGLRenderer
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(55, 1, 0.1, 400)
  avatar: Avatar
  private walkRects: Rect[] = []
  private blocks: Rect[] = []
  private floors: THREE.Object3D[] = []
  private taps: { o: THREE.Object3D; fn: () => void; approach?: [number, number] }[] = []
  private updaters: ((t: number, dt: number) => void)[] = []
  private spots: { id: string; x: number; z: number; r: number }[] = []
  private seats: { x: number; z: number; y: number; yaw: number; taken?: boolean; fx: number; fz: number; ax: number; az: number }[] = []
  /** 자리 앞 발 놓는 띠(다리 뻗는 공간): 장의자 줄 사이로 들어갈 수 있게 */
  private lanes: { x0: number; z0: number; x1: number; z1: number }[] = []
  private nearSeat: Stage['seats'][number] | null = null
  private seatState: 'near' | 'seated' | null = null
  private seatedAt: { x: number; z: number; y: number; yaw: number; from: THREE.Vector3 } | null = null
  private curSpot: string | null = null
  private npcs: Avatar[] = []
  private stick = new THREE.Vector2()
  private path: THREE.Vector2[] = []
  private grid: { x0: number; z0: number; nx: number; nz: number; cell: number; ok: Uint8Array } | null = null
  private beacon: THREE.Group
  private lights = 0
  private maxLights: number
  private target: THREE.Vector2 | null = null
  private pending: (() => void) | null = null
  private yaw = 0
  private pitch = 0.4
  private lookY = 0.55
  private dist = 4.6
  private maxDist = 7
  private camBox?: THREE.Box3
  private keys = new Set<string>()
  private raf = 0
  private last = 0
  private clock = 0
  private pointers = new Map<number, { x: number; y: number; sx: number; sy: number; t: number }>()
  private pinch = 0
  private frames = 0
  private fpsT = 0
  private pr: number
  private ray = new THREE.Raycaster()
  private marker: THREE.Mesh
  private disposed = false
  private ro: ResizeObserver

  constructor(private host: HTMLElement, build: Builder, private opts: StageOptions) {
    const photo = location.search.includes('photo') // 사이트 이미지 촬영용: 사람 없이 건축만
    const high = opts.high
    this.maxLights = high ? 6 : 2
    this.renderer = new THREE.WebGLRenderer({ antialias: high, powerPreference: high ? 'high-performance' : 'low-power' })
    this.pr = Math.min(window.devicePixelRatio || 1, high ? 1.75 : 1)
    this.renderer.setPixelRatio(this.pr)
    this.renderer.outputColorSpace = THREE.SRGBColorSpace
    // PujaTime과 같은 색 처리: 톤매핑 없이 재질 색 그대로(따뜻하고 선명하게)
    this.renderer.toneMapping = THREE.NoToneMapping
    this.renderer.domElement.className = 'stage-canvas'
    host.appendChild(this.renderer.domElement)

    const ctx: BuildCtx = {
      scene: this.scene,
      camera: this.camera,
      high,
      walk: (r) => this.walkRects.push(norm(r)),
      block: (r) => this.blocks.push(norm(r)),
      floor: (m) => this.floors.push(m),
      tap: (o, fn, approach) => this.taps.push({ o, fn, approach }),
      every: (fn) => this.updaters.push(fn),
      pointLight: (color, intensity, distance, pos) => {
        if (this.lights >= this.maxLights) return null
        this.lights++
        const l = new THREE.PointLight(color, intensity, distance, 1) // 감쇠를 완만하게(넓게 은은한 빛)
        l.position.set(...pos)
        this.scene.add(l)
        return l
      },
      pose: (p) => this.setPose(p),
      walkTo: (x, z, then) => this.walkTo(x, z, then),
      say: (msg) => this.opts.onSay?.(msg),
      spot: (id, x, z, r = 1.6) => this.spots.push({ id, x, z, r }),
      npc: (x, z, yaw, look, pose = 'pray') => {
        if (photo) return
        const a = new Avatar(look)
        a.root.position.set(x, 0, z)
        a.root.rotation.y = yaw
        a.pose = pose
        a.root.scale.setScalar(1.05 + Math.random() * 0.15)
        this.scene.add(a.root)
        this.npcs.push(a)
        this.blocks.push({ x0: x - 0.3, z0: z - 0.3, x1: x + 0.3, z1: z + 0.3 })
      },
      seat: (x, z, y, yaw) => {
        // 앉은 사람이 바라보는 쪽(앞)으로 0.5m = 다리 뻗는 자리. 줄 방향(옆)으로 길게 띠를 깐다
        const fx = Math.sin(yaw), fz = Math.cos(yaw)
        const ax = x + fx * 0.5, az = z + fz * 0.5
        this.seats.push({ x, z, y, yaw, fx, fz, ax, az })
        this.addLane(x, z, yaw)
      },
      face: (x, z) => this.face(x, z),
      me: () => this.avatar.root.position,
      isSweeping: () => this.avatar.sweeping,
      crowd: (people, scale = 0.55) => {
        // 앉은 사람 앞도 지나갈 수 있게(실제로 줄 안쪽 빈자리로 들어갈 때처럼)
        for (const w of people) if ((w.y ?? 0) > 0.2) this.addLane(w.x, w.z, w.yaw)
        if (photo) return
        const groups = new Map<string, typeof people>()
        for (const p of people) {
          const k = JSON.stringify([p.look, !!p.joined])
          groups.set(k, [...(groups.get(k) ?? []), p])
        }
        const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(scale, scale, scale)
        const sets: { who: typeof people; parts: THREE.InstancedMesh[]; seeds: number[] }[] = []
        for (const who of groups.values()) {
          const parts = bakeDevotee(makeDevotee({ ...who[0].look, ratio: 2, pose: 'sit', joined: who[0].joined })).map(({ geo, mat }) => {
            const inst = new THREE.InstancedMesh(geo, mat, who.length)
            inst.frustumCulled = false
            this.scene.add(inst)
            return inst
          })
          sets.push({ who, parts, seeds: who.map(() => Math.random() * 20) })
        }
        const place = (t: number) => {
          for (const { who, parts, seeds } of sets) {
            who.forEach((p, i) => {
              // 절하는 사람은 몇 초마다 천천히 숙였다 일어남
              const b = p.bows ? Math.max(0, Math.sin((t + seeds[i]) * 0.35)) ** 6 : 0
              e.set(b * 0.9, p.yaw, 0, 'YXZ')
              m.compose(new THREE.Vector3(p.x, p.y ?? 0.02, p.z), q.setFromEuler(e), sc)
              parts.forEach((x) => x.setMatrixAt(i, m))
            })
            parts.forEach((x) => (x.instanceMatrix.needsUpdate = true))
          }
        }
        place(0)
        if (people.some((p) => p.bows)) this.updaters.push((t) => place(t))
        for (const p of people) this.blocks.push({ x0: p.x - 0.3, z0: p.z - 0.3, x1: p.x + 0.3, z1: p.z + 0.3 })
      },
    }
    const layout = build(ctx)

    this.avatar = new Avatar(layout.look)
    this.avatar.root.scale.setScalar(1.2)
    this.avatar.root.position.set(layout.spawn[0], 0, layout.spawn[1])
    this.avatar.root.rotation.y = layout.yaw + Math.PI
    this.yaw = layout.yaw
    this.dist = layout.dist ?? 4.6
    this.maxDist = layout.maxDist ?? 7
    this.pitch = layout.pitch ?? this.pitch
    this.lookY = layout.lookY ?? 0.55
    if (layout.camBox) this.camBox = new THREE.Box3(new THREE.Vector3(...layout.camBox.min), new THREE.Vector3(...layout.camBox.max))
    this.scene.add(this.avatar.root)
    if (photo) this.avatar.root.visible = false

    // 누른 곳 표시 고리
    this.marker = new THREE.Mesh(
      new THREE.RingGeometry(0.16, 0.22, 32),
      new THREE.MeshBasicMaterial({ color: '#fff3c8', transparent: true, opacity: 0, depthWrite: false }),
    )
    this.marker.rotation.x = -Math.PI / 2
    this.scene.add(this.marker)

    // 튜토리얼에서 가야 할 곳을 알려 주는 빛 기둥
    this.beacon = new THREE.Group()
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.62, 40), new THREE.MeshBasicMaterial({ color: '#ffe7a0', transparent: true, opacity: 0.9, depthWrite: false, side: THREE.DoubleSide }))
    ring.rotation.x = -Math.PI / 2
    ring.position.y = 0.03
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 3, 24, 1, true), new THREE.MeshBasicMaterial({ color: '#ffe7a0', transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }))
    col.position.y = 1.5
    this.beacon.add(ring, col)
    this.beacon.visible = false
    this.scene.add(this.beacon)

    const el = this.renderer.domElement
    el.addEventListener('pointerdown', this.onDown)
    el.addEventListener('pointermove', this.onMove)
    el.addEventListener('pointerup', this.onUp)
    el.addEventListener('pointercancel', this.onUp)
    el.addEventListener('wheel', this.onWheel, { passive: false })
    window.addEventListener('keydown', this.onKey)
    window.addEventListener('keyup', this.onKey)
    document.addEventListener('visibilitychange', this.onVis)
    this.ro = new ResizeObserver(() => this.resize())
    this.ro.observe(host)
    this.resize()
    this.last = performance.now()
    this.raf = requestAnimationFrame(this.loop)
  }

  /** 아바타를 그 자리로 걸어가게 함 */
  walkTo(x: number, z: number, then?: () => void) {
    this.standUp()
    this.avatar.pose = 'idle'
    const a = this.avatar.root.position
    this.path = this.findPath(a.x, a.z, x, z)
    this.pending = then ?? null
    this.target = this.path.shift() ?? null
    if (!this.target) {
      this.pending = null
      then?.()
      return
    }
    const last = this.path.at(-1) ?? this.target
    this.showMarker(last.x, last.y)
  }

  setPose(p: 'idle' | 'pray' | 'bow' | 'sit') {
    if (p === 'sit') {
      this.sitHere()
      return
    }
    this.target = null
    this.path = []
    if (this.seatedAt) {
      // 앉은 채로 기도(두 손 모음). 다시 누르면 손을 내림. 절은 일어나서
      if (p === 'pray') { this.avatar.pose = this.avatar.pose === 'sitpray' ? 'sit' : 'sitpray'; return }
      this.standUp()
    }
    this.avatar.pose = p
  }

  /** 지금 가까이 있는 빈자리에 앉음 (빈자리까지 직접 걸어가야 함). 없으면 false */
  sitHere() {
    const s = this.nearSeat
    if (!s || this.seatedAt) return false
    this.target = null
    this.path = []
    const from = new THREE.Vector3(s.ax, 0, s.az)
    this.seatedAt = { ...s, from }
    s.taken = true
    this.avatar.root.position.set(s.x, s.y, s.z)
    this.avatar.root.rotation.y = s.yaw
    this.yaw = s.yaw + Math.PI
    this.avatar.pose = 'sit'
    return true
  }

  /** 예전 이름(가까운 빈자리에 앉기)도 유지: 이제는 가까이 있을 때만 앉는다 */
  sitNearest() {
    return this.sitHere()
  }

  /** 앉아 있으면 일어나 자리 앞에 섬 */
  standUp() {
    if (!this.seatedAt) return
    const seat = this.seats.find((x) => x.x === this.seatedAt!.x && x.z === this.seatedAt!.z)
    if (seat) seat.taken = false
    this.avatar.root.position.copy(this.seatedAt.from)
    this.avatar.root.position.y = 0
    this.seatedAt = null
    this.avatar.pose = 'idle'
  }

  /** 자리 앞 0.5m에 줄 방향으로 긴 띠(다리 뻗는 공간)를 깐다 */
  private addLane(x: number, z: number, yaw: number) {
    const fx = Math.sin(yaw), fz = Math.cos(yaw)
    const ax = x + fx * 0.5, az = z + fz * 0.5
    // 줄 끝 옆판·통로까지 이어지도록 옆으로 넉넉히(1.3m), 앞뒤는 다리 뻗는 폭만큼
    const along = 1.3, across = 0.16
    const ux = Math.abs(fz), uz = Math.abs(fx)
    this.lanes.push({ x0: ax - along * ux - across * (1 - ux), z0: az - along * uz - across * (1 - uz), x1: ax + along * ux + across * (1 - ux), z1: az + along * uz + across * (1 - uz) })
  }

  get seated() {
    return !!this.seatedAt
  }

  /** 캐릭터가 (x, z)를 바라보게 하고 카메라는 그 뒤에서 */
  face(x: number, z: number) {
    const a = this.avatar.root.position
    this.avatar.root.rotation.y = Math.atan2(x - a.x, z - a.z)
    this.yaw = Math.atan2(a.x - x, a.z - z)
  }

  /** 빗자루 들기/내려놓기 */
  setSweep(on: boolean) {
    this.standUp()
    this.avatar.sweeping = on
  }

  get sweeping() {
    return this.avatar.sweeping
  }

  /** 조이스틱 값 (-1..1). 위로 밀면 y가 -1 */
  setStick(x: number, y: number) {
    this.stick.set(x, y)
    if (x || y) {
      this.target = null
      this.path = []
    }
  }

  /** 튜토리얼 표시등: 해당 안내 지점 위에 빛 기둥 */
  showBeacon(id: string | null) {
    const s = id ? this.spots.find((p) => p.id === id) : null
    this.beacon.visible = !!s
    if (s) this.beacon.position.set(s.x, 0, s.z)
  }

  get spotIds() {
    return this.spots.map((s) => s.id)
  }

  // ── 길찾기: 걸을 수 있는 칸으로 격자를 만들고 A*로 장애물을 돌아간다 ──
  private buildGrid() {
    // 장의자 줄 사이 좁은 길도 찾을 수 있게 자리가 있는 공간은 더 촘촘하게
    const cell = this.lanes.length ? 0.2 : 0.4
    const x0 = Math.min(...this.walkRects.map((r) => r.x0)), x1 = Math.max(...this.walkRects.map((r) => r.x1))
    const z0 = Math.min(...this.walkRects.map((r) => r.z0)), z1 = Math.max(...this.walkRects.map((r) => r.z1))
    const nx = Math.ceil((x1 - x0) / cell), nz = Math.ceil((z1 - z0) / cell)
    const ok = new Uint8Array(nx * nz)
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) ok[j * nx + i] = this.canStand(x0 + (i + 0.5) * cell, z0 + (j + 0.5) * cell) ? 1 : 0
    this.grid = { x0, z0, nx, nz, cell, ok }
  }

  private findPath(sx: number, sz: number, tx: number, tz: number): THREE.Vector2[] {
    if (this.canStand(tx, tz) && this.lineClear(sx, sz, tx, tz)) return [new THREE.Vector2(tx, tz)]
    if (!this.grid) this.buildGrid()
    const g = this.grid!
    const idx = (x: number, z: number) => {
      const i = Math.max(0, Math.min(g.nx - 1, Math.floor((x - g.x0) / g.cell)))
      const j = Math.max(0, Math.min(g.nz - 1, Math.floor((z - g.z0) / g.cell)))
      return j * g.nx + i
    }
    const center = (k: number) => new THREE.Vector2(g.x0 + ((k % g.nx) + 0.5) * g.cell, g.z0 + (Math.floor(k / g.nx) + 0.5) * g.cell)
    // 목표가 막힌 칸이면 가장 가까운 걸을 수 있는 칸으로
    let goal = idx(tx, tz)
    if (!g.ok[goal]) {
      let best = -1, bd = Infinity
      for (let k = 0; k < g.ok.length; k++) if (g.ok[k]) {
        const c = center(k)
        const d = (c.x - tx) ** 2 + (c.y - tz) ** 2
        if (d < bd) { bd = d; best = k }
      }
      if (best < 0) return []
      goal = best
    }
    const start = idx(sx, sz)
    const N = g.ok.length
    const gs = new Float32Array(N).fill(Infinity)
    const from = new Int32Array(N).fill(-1)
    const closed = new Uint8Array(N)
    const gx = g.x0 + ((goal % g.nx) + 0.5) * g.cell, gz = g.z0 + (Math.floor(goal / g.nx) + 0.5) * g.cell
    const h = (k: number) => Math.hypot(g.x0 + ((k % g.nx) + 0.5) * g.cell - gx, g.z0 + (Math.floor(k / g.nx) + 0.5) * g.cell - gz) / g.cell
    // 이진 힙(우선순위 큐): 칸이 많아도(0.2m 격자) 빠르게
    const heap: number[] = [], pri: number[] = []
    const push = (k: number, f: number) => {
      heap.push(k); pri.push(f)
      let i = heap.length - 1
      while (i > 0) { const pIdx = (i - 1) >> 1; if (pri[pIdx] <= pri[i]) break; [heap[i], heap[pIdx]] = [heap[pIdx], heap[i]]; [pri[i], pri[pIdx]] = [pri[pIdx], pri[i]]; i = pIdx }
    }
    const pop = () => {
      const top = heap[0]
      const lk = heap.pop()!, lf = pri.pop()!
      if (heap.length) {
        heap[0] = lk; pri[0] = lf
        let i = 0
        for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && pri[l] < pri[m]) m = l; if (r < heap.length && pri[r] < pri[m]) m = r; if (m === i) break; [heap[i], heap[m]] = [heap[m], heap[i]]; [pri[i], pri[m]] = [pri[m], pri[i]]; i = m }
      }
      return top
    }
    gs[start] = 0
    push(start, h(start))
    let found = false
    while (heap.length) {
      const cur = pop()
      if (closed[cur]) continue
      if (cur === goal) { found = true; break }
      closed[cur] = 1
      const ci = cur % g.nx, cj = Math.floor(cur / g.nx)
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        if (!di && !dj) continue
        const ni = ci + di, nj = cj + dj
        if (ni < 0 || nj < 0 || ni >= g.nx || nj >= g.nz) continue
        const nk = nj * g.nx + ni
        if (!g.ok[nk] || closed[nk]) continue
        if (di && dj && (!g.ok[cj * g.nx + ni] || !g.ok[nj * g.nx + ci])) continue // 모서리 자르기 방지
        const ng = gs[cur] + (di && dj ? 1.414 : 1)
        if (ng < gs[nk]) {
          gs[nk] = ng
          from[nk] = cur
          push(nk, ng + h(nk))
        }
      }
    }
    if (!found) return []
    const cells: THREE.Vector2[] = []
    for (let k = goal; k !== -1 && k !== start; k = from[k]) cells.unshift(center(k))
    if (this.canStand(tx, tz)) cells[cells.length - 1] = new THREE.Vector2(tx, tz)
    // 직선으로 갈 수 있는 중간 점은 건너뛰어 부드럽게
    const out: THREE.Vector2[] = []
    let px = sx, pz = sz
    for (let i = 0; i < cells.length; i++) {
      const next = cells[i + 1]
      if (next && this.lineClear(px, pz, next.x, next.y)) continue
      out.push(cells[i])
      px = cells[i].x
      pz = cells[i].y
    }
    return out
  }

  private lineClear(ax: number, az: number, bx: number, bz: number) {
    const d = Math.hypot(bx - ax, bz - az)
    // 좁은 줄 사이 길에서 모서리를 깎지 않도록 촘촘히 확인
    const n = Math.ceil(d / (this.lanes.length ? 0.08 : 0.2))
    for (let i = 1; i <= n; i++) if (!this.canStand(ax + ((bx - ax) * i) / n, az + ((bz - az) * i) / n)) return false
    return true
  }

  private showMarker(x: number, z: number) {
    this.marker.position.set(x, 0.02, z)
    ;(this.marker.material as THREE.MeshBasicMaterial).opacity = 0.9
    this.marker.scale.setScalar(1)
  }

  private resize() {
    const w = this.host.clientWidth, h = this.host.clientHeight
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    // 세로 화면에서는 시야를 넓혀 공간이 답답하지 않게
    this.camera.fov = w < h ? 62 : 50
    this.camera.updateProjectionMatrix()
  }

  private canStand(x: number, z: number) {
    const r = 0.25
    const inside = this.walkRects.some((w) => x > w.x0 + r && x < w.x1 - r && z > w.z0 + r && z < w.z1 - r)
    if (!inside) return false
    if (this.lanes.length && this.lanes.some((l) => x > l.x0 && x < l.x1 && z > l.z0 && z < l.z1)) return true
    return !this.blocks.some((b) => x > b.x0 - r && x < b.x1 + r && z > b.z0 - r && z < b.z1 + r)
  }

  private loop = (now: number) => {
    if (this.disposed) return
    this.raf = requestAnimationFrame(this.loop)
    const dt = Math.min(0.05, (now - this.last) / 1000)
    this.last = now
    this.clock += dt
    this.step(dt)
    for (const f of this.updaters) f(this.clock, dt)
    this.renderer.render(this.scene, this.camera)
    this.govern(dt)
  }

  /** 2초 평균 프레임이 낮으면 해상도를 한 단계 낮춤 */
  private govern(dt: number) {
    this.frames++
    this.fpsT += dt
    if (this.fpsT < 2) return
    const fps = this.frames / this.fpsT
    this.frames = 0
    this.fpsT = 0
    if (fps < 38 && this.pr > 0.75) {
      this.pr = Math.max(0.75, this.pr - 0.25)
      this.renderer.setPixelRatio(this.pr)
      this.resize()
    }
  }

  private step(dt: number) {
    const a = this.avatar.root
    let moving = false
    // 키보드 이동 (카메라 기준)
    let kx = 0, kz = 0
    if (this.keys.has('w') || this.keys.has('arrowup')) kz -= 1
    if (this.keys.has('s') || this.keys.has('arrowdown')) kz += 1
    if (this.keys.has('a') || this.keys.has('arrowleft')) kx -= 1
    if (this.keys.has('d') || this.keys.has('arrowright')) kx += 1
    let dir: THREE.Vector2 | null = null
    let speedK = 1
    if (!kx && !kz && this.stick.lengthSq() > 0.01) {
      kx = this.stick.x
      kz = this.stick.y
      speedK = Math.min(1, this.stick.length())
    }
    if (kx || kz) {
      this.standUp()
      this.target = null
      this.path = []
      if (this.avatar.pose !== 'walk') this.avatar.pose = 'idle'
      const s = Math.sin(this.yaw), c = Math.cos(this.yaw)
      dir = new THREE.Vector2(kx * c + kz * s, -kx * s + kz * c).normalize()
    } else if (this.target) {
      const d = new THREE.Vector2(this.target.x - a.position.x, this.target.y - a.position.z)
      if (d.length() < 0.12) {
        this.target = this.path.shift() ?? null
        if (!this.target) {
          const fn = this.pending
          this.pending = null
          fn?.()
        }
      } else dir = d.normalize()
    }
    if (dir) {
      // Shift: 달리기 (넓은 광장에서 쓰기 좋게)
      const speed = 2.6 * speedK * (this.keys.has('shift') ? 1.9 : 1)
      const nx = a.position.x + dir.x * speed * dt
      const nz = a.position.z + dir.y * speed * dt
      // 눌러서 찾아가는 길(격자·직선 검사를 이미 통과한 길)은 그대로 따라감. 조이스틱·키보드만 매 걸음 부딪힘 확인
      const following = !kx && !kz && !!this.target
      if (following || this.canStand(nx, nz)) {
        a.position.x = nx
        a.position.z = nz
        moving = true
      } else if (this.canStand(nx, a.position.z)) {
        a.position.x = nx
        moving = true
      } else if (this.canStand(a.position.x, nz)) {
        a.position.z = nz
        moving = true
      } else {
        // 막히면 멈추고, 기다리던 동작은 그 자리에서 실행
        this.target = null
        this.path = []
        const fn = this.pending
        this.pending = null
        fn?.()
      }
      if (moving) {
        const want = Math.atan2(dir.x, dir.y)
        let diff = want - a.rotation.y
        diff = Math.atan2(Math.sin(diff), Math.cos(diff))
        a.rotation.y += diff * Math.min(1, dt * 10)
      }
    }
    if (this.avatar.pose === 'walk' && this.seatedAt) this.avatar.pose = 'sit'
    // 빈자리 가까이(자리 앞 0.55m 안) 오면 '앉기' 버튼
    if (!this.seatedAt) {
      let best: Stage['seats'][number] | null = null, bd = 0.55
      for (const s of this.seats) {
        if (s.taken) continue
        const d = Math.hypot(s.ax - a.position.x, s.az - a.position.z)
        if (d < bd) { bd = d; best = s }
      }
      this.nearSeat = best
    } else this.nearSeat = null
    const ss = this.seatedAt ? 'seated' : this.nearSeat ? 'near' : null
    if (ss !== this.seatState) {
      this.seatState = ss
      this.opts.onSeat?.(ss)
    }
    this.avatar.update(dt, moving && !this.seatedAt)
    for (const n of this.npcs) n.update(dt, false)

    // 안내 지점 들어감/나옴
    let near: string | null = null, nd = Infinity
    for (const sp of this.spots) {
      const d = Math.hypot(sp.x - a.position.x, sp.z - a.position.z)
      if (d < sp.r && d < nd) { nd = d; near = sp.id }
    }
    if (near !== this.curSpot) {
      this.curSpot = near
      this.opts.onSpot?.(near)
    }
    if (this.beacon.visible) this.beacon.rotation.y += dt

    const mk = this.marker.material as THREE.MeshBasicMaterial
    if (mk.opacity > 0) {
      mk.opacity = Math.max(0, mk.opacity - dt * 1.2)
      this.marker.scale.multiplyScalar(1 + dt * 0.8)
    }

    // 3인칭 카메라: 아바타 뒤에서 따라감
    const head = new THREE.Vector3(a.position.x, 1.0 + (this.seatedAt ? this.seatedAt.y - 0.5 : 0), a.position.z)
    const off = new THREE.Vector3(
      Math.sin(this.yaw) * Math.cos(this.pitch),
      Math.sin(this.pitch),
      Math.cos(this.yaw) * Math.cos(this.pitch),
    ).multiplyScalar(this.dist)
    const want = head.clone().add(off)
    if (this.camBox) want.clamp(this.camBox.min, this.camBox.max)
    this.camera.position.lerp(want, Math.min(1, dt * 6))
    // 캐릭터가 화면 아래쪽에 오도록 앞쪽을 바라봄
    this.camera.lookAt(head.x - Math.sin(this.yaw) * 1.6, head.y + this.lookY, head.z - Math.cos(this.yaw) * 1.6)
  }

  private pick(ev: PointerEvent) {
    const r = this.renderer.domElement.getBoundingClientRect()
    const p = new THREE.Vector2(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1)
    this.ray.setFromCamera(p, this.camera)
    const objs = this.taps.map((t) => t.o)
    const hit = this.ray.intersectObjects(objs, true)[0]
    if (hit) {
      const t = this.taps.find((x) => isAncestor(x.o, hit.object))
      if (t) {
        this.opts.onTap?.()
        if (t.approach) this.walkTo(t.approach[0], t.approach[1], t.fn)
        else t.fn()
        return
      }
    }
    const f = this.ray.intersectObjects(this.floors, true)[0]
    if (f) {
      this.opts.onTap?.()
      this.walkTo(f.point.x, f.point.z)
    }
  }

  private onDown = (e: PointerEvent) => {
    this.renderer.domElement.setPointerCapture(e.pointerId)
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY, t: performance.now() })
    if (this.pointers.size === 2) this.pinch = pinchDist(this.pointers)
  }
  private onMove = (e: PointerEvent) => {
    const p = this.pointers.get(e.pointerId)
    if (!p) return
    if (this.pointers.size === 2) {
      p.x = e.clientX
      p.y = e.clientY
      const d = pinchDist(this.pointers)
      this.dist = clamp(this.dist * (this.pinch / d), 1.8, this.maxDist)
      this.pinch = d
      return
    }
    const dx = e.clientX - p.x, dy = e.clientY - p.y
    p.x = e.clientX
    p.y = e.clientY
    this.yaw -= dx * 0.006
    this.pitch = clamp(this.pitch + dy * 0.004, 0.05, 1.1)
  }
  private onUp = (e: PointerEvent) => {
    const p = this.pointers.get(e.pointerId)
    this.pointers.delete(e.pointerId)
    if (!p || e.type === 'pointercancel') return
    const moved = Math.hypot(e.clientX - p.sx, e.clientY - p.sy)
    if (moved < 8 && performance.now() - p.t < 400 && this.pointers.size === 0) this.pick(e)
  }
  private onWheel = (e: WheelEvent) => {
    e.preventDefault()
    this.dist = clamp(this.dist * (1 + Math.sign(e.deltaY) * 0.1), 1.8, this.maxDist)
  }
  private onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return
    const k = e.key.toLowerCase()
    if (!['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift'].includes(k)) return
    if (e.type === 'keydown') this.keys.add(k)
    else this.keys.delete(k)
  }
  private onVis = () => {
    if (document.hidden) cancelAnimationFrame(this.raf)
    else if (!this.disposed) {
      this.last = performance.now()
      this.raf = requestAnimationFrame(this.loop)
    }
  }

  /** GPU 메모리까지 모두 해제 */
  dispose() {
    this.disposed = true
    cancelAnimationFrame(this.raf)
    this.ro.disconnect()
    const el = this.renderer.domElement
    el.removeEventListener('pointerdown', this.onDown)
    el.removeEventListener('pointermove', this.onMove)
    el.removeEventListener('pointerup', this.onUp)
    el.removeEventListener('pointercancel', this.onUp)
    el.removeEventListener('wheel', this.onWheel)
    window.removeEventListener('keydown', this.onKey)
    window.removeEventListener('keyup', this.onKey)
    document.removeEventListener('visibilitychange', this.onVis)
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose()
      const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []
      mats.forEach((x) => {
        // 공간에서 직접 만든 텍스처(현판·바닥 무늬 등)도 함께 해제
        for (const v of Object.values(x)) if (v instanceof THREE.Texture) v.dispose()
        x.dispose()
      })
    })
    disposeTextures()
    this.renderer.dispose()
    // 그래픽 컨텍스트를 바로 돌려줌: 다음 화면(PujaTime 등)이 3D를 새로 만들 때 휴대폰 메모리가 겹치지 않게
    this.renderer.forceContextLoss()
    el.remove()
  }
}

function norm(r: Rect): Rect {
  return { x0: Math.min(r.x0, r.x1), x1: Math.max(r.x0, r.x1), z0: Math.min(r.z0, r.z1), z1: Math.max(r.z0, r.z1) }
}
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v))
function pinchDist(m: Map<number, { x: number; y: number }>) {
  const [a, b] = [...m.values()]
  return Math.hypot(a.x - b.x, a.y - b.y) || 1
}
function isAncestor(a: THREE.Object3D, b: THREE.Object3D | null): boolean {
  for (let o = b; o; o = o.parent) if (o === a) return true
  return false
}
