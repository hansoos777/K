import * as THREE from 'three'
import { brass, canvasTexture, glowTexture } from './kit'

/** 연기 띠 텍스처: 아래는 진하고 위로 갈수록 옅어지며, 가운데가 가장 짙음 */
const smokeTex = () =>
  canvasTexture(64, 256, (c) => {
    const v = c.createLinearGradient(0, 256, 0, 0)
    v.addColorStop(0, 'rgba(255,255,255,0)')
    v.addColorStop(0.08, 'rgba(250,248,244,.9)')
    v.addColorStop(0.55, 'rgba(240,238,234,.45)')
    v.addColorStop(1, 'rgba(235,232,228,0)')
    c.fillStyle = v
    c.fillRect(0, 0, 64, 256)
    c.globalCompositeOperation = 'destination-in'
    const h = c.createLinearGradient(0, 0, 64, 0)
    h.addColorStop(0, 'rgba(0,0,0,0)')
    h.addColorStop(0.5, 'rgba(0,0,0,1)')
    h.addColorStop(1, 'rgba(0,0,0,0)')
    c.fillStyle = h
    c.fillRect(0, 0, 64, 256)
  })

/**
 * 향로와 향: 세 발 청동 향로, 재, 향 세 개(끝이 붉게 타는), 가늘게 올라가며 흔들리는 연기 띠.
 * light()로 피우고 tick(t, dt)를 매 프레임 부른다.
 */
export class Incense {
  group = new THREE.Group()
  private sticks = new THREE.Group()
  private ribbons: { mesh: THREE.Mesh; base: Float32Array; phase: number; amp: number }[] = []
  private tips: THREE.Sprite[] = []
  private burn = 0
  private H: number

  constructor(matcap: THREE.Texture, size = 1, opts: { count?: number; smokeH?: number; lid?: boolean } = {}) {
    const s = size
    this.H = (opts.smokeH ?? 3.2) * s
    const bronze = brass(matcap, 0xb89868)
    // 향로: 몸통(둥근 그릇) + 테두리 + 세 발
    const bowl = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.32, 0.02], [0.42, 0.12], [0.44, 0.26], [0.4, 0.34], [0.46, 0.36], [0.46, 0.4]].map(([x, y]) => new THREE.Vector2(x * s, y * s)), 32), bronze)
    bowl.position.y = 0.18 * s
    this.group.add(bowl)
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.035 * s, 0.05 * s, 0.24 * s, 8), bronze)
      leg.position.set(Math.cos(a) * 0.26 * s, 0.1 * s, Math.sin(a) * 0.26 * s)
      leg.rotation.z = Math.cos(a) * 0.25
      leg.rotation.x = -Math.sin(a) * 0.25
      this.group.add(leg)
    }
    // 손잡이 귀
    for (const side of [-1, 1]) {
      const ear = new THREE.Mesh(new THREE.TorusGeometry(0.07 * s, 0.02 * s, 6, 14, Math.PI), bronze)
      ear.position.set(side * 0.47 * s, 0.56 * s, 0)
      ear.rotation.y = Math.PI / 2
      this.group.add(ear)
    }
    // 재
    const ash = new THREE.Mesh(new THREE.CircleGeometry(0.4 * s, 28), new THREE.MeshLambertMaterial({ color: 0xcfc8bc }))
    ash.rotation.x = -Math.PI / 2
    ash.position.y = 0.53 * s
    this.group.add(ash)
    // 향(꽂혀 있는 붉은 갈색 막대) + 타는 끝
    const n = opts.count ?? 3
    const stickM = new THREE.MeshLambertMaterial({ color: 0x8a3a24 })
    const tipTex = glowTexture('255,190,120', '255,90,30')
    for (let i = 0; i < n; i++) {
      const x = (i - (n - 1) / 2) * 0.09 * s
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.008 * s, 0.008 * s, 0.6 * s, 6), stickM)
      stick.position.set(x, 0.83 * s, 0)
      stick.rotation.z = (i - (n - 1) / 2) * 0.05
      this.sticks.add(stick)
      const tip = new THREE.Sprite(new THREE.SpriteMaterial({ map: tipTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
      tip.scale.setScalar(0.08 * s)
      tip.position.set(x + Math.sin(stick.rotation.z) * -0.3 * s, 1.13 * s, 0)
      this.sticks.add(tip)
      this.tips.push(tip)
      // 연기 띠 두 장(서로 엇갈려 입체감)
      for (let k = 0; k < 2; k++) {
        const geo = new THREE.PlaneGeometry(0.16 * s, this.H, 1, 40)
        geo.translate(0, this.H / 2, 0)
        const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: smokeTex(), transparent: true, depthWrite: false, side: THREE.DoubleSide, opacity: 0 }))
        mesh.position.set(tip.position.x, tip.position.y, 0)
        mesh.rotation.y = k * Math.PI / 2 + i * 0.6
        this.group.add(mesh)
        this.ribbons.push({ mesh, base: (geo.attributes.position.array as Float32Array).slice(), phase: Math.random() * 6, amp: (0.12 + Math.random() * 0.08) * s })
      }
    }
    this.sticks.visible = false
    this.group.add(this.sticks)
  }

  /** 향을 피움(초 단위로 타는 시간) */
  light(seconds = 180) {
    this.burn = seconds
    this.sticks.visible = true
  }

  get burning() {
    return this.burn > 0
  }

  tick(t: number, dt: number) {
    if (this.burn <= 0) {
      if (this.sticks.visible) this.sticks.visible = false
      this.ribbons.forEach((r) => ((r.mesh.material as THREE.MeshBasicMaterial).opacity = 0))
      return
    }
    this.burn -= dt
    const fade = Math.min(1, this.burn / 6, (180 - this.burn) / 2 + 0.2)
    this.tips.forEach((p, i) => ((p.material as THREE.SpriteMaterial).opacity = 0.75 + Math.sin(t * 5 + i) * 0.25))
    for (const r of this.ribbons) {
      const pos = r.mesh.geometry.attributes.position as THREE.BufferAttribute
      for (let i = 0; i < pos.count; i++) {
        const y = r.base[i * 3 + 1]
        const k = y / this.H
        // 위로 갈수록 크게 흔들리고 넓게 퍼짐
        const sway = Math.sin(y * 2.2 - t * 1.6 + r.phase) * r.amp * k * 1.6 + Math.sin(y * 5.1 - t * 2.7 + r.phase) * r.amp * 0.25 * k
        pos.setX(i, r.base[i * 3] * (1 + k * 5) + sway)
        pos.setZ(i, Math.cos(y * 1.7 - t * 1.2 + r.phase) * r.amp * 0.6 * k)
      }
      pos.needsUpdate = true
      ;(r.mesh.material as THREE.MeshBasicMaterial).opacity = 0.5 * fade
    }
  }
}
