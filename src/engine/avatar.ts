import * as THREE from 'three'
import { blob } from './tex'

/**
 * 2등신 방문자 캐릭터 (PujaTime 캐릭터와 같은 비율).
 * 기하 도형만으로 만들어 파일 다운로드가 없다.
 */
export type Pose = 'idle' | 'walk' | 'pray' | 'bow'

export interface AvatarLook { robe: string; trim: string; skin: string; hair: string }

export const LOOKS: Record<string, AvatarLook> = {
  christian: { robe: '#3d5a8a', trim: '#e9dcc0', skin: '#f1d2b4', hair: '#3a2a20' },
  catholic: { robe: '#6b2b3a', trim: '#e6cf8c', skin: '#f1d2b4', hair: '#2b1f18' },
  mandir: { robe: '#e8892a', trim: '#f6d24a', skin: '#d9a77c', hair: '#1c1410' },
  temple: { robe: '#8a7a62', trim: '#c9b48a', skin: '#efcfae', hair: '#2a2420' },
}

/** 방문객 캐릭터용: 같은 종교 안에서도 옷 색을 다양하게 */
const ROBES: Record<string, string[]> = {
  christian: ['#3d5a8a', '#6a4a3a', '#2f5a4a', '#5a5a6a', '#8a3a3a'],
  catholic: ['#6b2b3a', '#2a3a5a', '#4a4a4a', '#5a3a6a', '#3a5a4a'],
  mandir: ['#e8892a', '#c8205a', '#f2c230', '#2a8a6a', '#8a2ac8', '#f4f0e0'],
  temple: ['#8a7a62', '#5a5a5a', '#6a5a4a', '#c8a050', '#4a5a6a'],
}
export function visitorLook(world: keyof typeof LOOKS, i: number): AvatarLook {
  const b = LOOKS[world]
  const r = ROBES[world]
  const skins = ['#f1d2b4', '#e0b48c', '#c8946a', '#8a5a3a', '#f4dcc4']
  const hairs = ['#2a1f18', '#1c1410', '#5a3a20', '#b8b0a8', '#3a2a20']
  return { robe: r[i % r.length], trim: b.trim, skin: skins[(i * 3) % skins.length], hair: hairs[(i * 7) % hairs.length] }
}

export class Avatar {
  root = new THREE.Group()
  private body = new THREE.Group()
  private armL: THREE.Object3D
  private armR: THREE.Object3D
  private footL: THREE.Object3D
  private footR: THREE.Object3D
  private head: THREE.Object3D
  pose: Pose = 'idle'
  private phase = 0
  private blend = 0 // 0 = 차렷, 1 = 합장
  private bowB = 0 // 숙여 절하기

  constructor(look: AvatarLook) {
    const mat = (c: string, r = 0.8) => new THREE.MeshStandardMaterial({ color: c, roughness: r })
    const robe = mat(look.robe)
    const trim = mat(look.trim)
    const skin = mat(look.skin, 0.6)
    const hair = mat(look.hair, 0.5)

    // 몸통: 아래가 넓은 옷자락
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.27, 0.46, 20), robe)
    torso.position.y = 0.33
    const hem = new THREE.Mesh(new THREE.TorusGeometry(0.265, 0.025, 6, 24), trim)
    hem.rotation.x = Math.PI / 2
    hem.position.y = 0.11
    const collar = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.025, 6, 20), trim)
    collar.rotation.x = Math.PI / 2
    collar.position.y = 0.56

    // 머리 (몸만큼 큼 → 2등신)
    const head = new THREE.Group()
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.24, 28, 20), skin)
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.252, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.55), hair)
    cap.rotation.x = -0.35
    cap.position.z = -0.02
    const eyeG = new THREE.SphereGeometry(0.028, 10, 8)
    const eyeM = new THREE.MeshBasicMaterial({ color: '#1d1611' })
    const eL = new THREE.Mesh(eyeG, eyeM)
    const eR = new THREE.Mesh(eyeG, eyeM)
    eL.position.set(-0.085, -0.01, 0.215)
    eR.position.set(0.085, -0.01, 0.215)
    const cheekM = new THREE.MeshBasicMaterial({ color: '#f29c9c', transparent: true, opacity: 0.55 })
    const cL = new THREE.Mesh(new THREE.CircleGeometry(0.032, 12), cheekM)
    const cR = cL.clone()
    cL.position.set(-0.14, -0.07, 0.2)
    cR.position.set(0.14, -0.07, 0.2)
    cL.rotation.y = -0.5
    cR.rotation.y = 0.5
    head.add(face, cap, eL, eR, cL, cR)
    head.position.y = 0.8
    this.head = head

    const arm = () => {
      const g = new THREE.Group()
      const sleeve = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.2, 4, 10), robe)
      sleeve.position.y = -0.12
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.052, 12, 10), skin)
      hand.position.y = -0.26
      g.add(sleeve, hand)
      return g
    }
    this.armL = arm()
    this.armR = arm()
    this.armL.position.set(-0.19, 0.52, 0)
    this.armR.position.set(0.19, 0.52, 0)

    const foot = () => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 8), mat('#3a2c22'))
      m.scale.set(1, 0.6, 1.4)
      return m
    }
    this.footL = foot()
    this.footR = foot()
    this.footL.position.set(-0.09, 0.04, 0.03)
    this.footR.position.set(0.09, 0.04, 0.03)

    this.body.add(torso, hem, collar, head, this.armL, this.armR, this.footL, this.footR)
    this.body.traverse((o) => ((o as THREE.Mesh).castShadow = true))

    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.8, 0.8),
      new THREE.MeshBasicMaterial({ map: blob(), transparent: true, depthWrite: false }),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = 0.01
    this.root.add(shadow, this.body)
    this.root.scale.setScalar(1.15)
  }

  update(dt: number, moving: boolean) {
    this.pose = moving ? 'walk' : this.pose === 'walk' ? 'idle' : this.pose
    const target = this.pose === 'pray' || this.pose === 'bow' ? 1 : 0
    this.blend += (target - this.blend) * Math.min(1, dt * 6)
    this.bowB += ((this.pose === 'bow' ? 1 : 0) - this.bowB) * Math.min(1, dt * 4)
    this.body.rotation.x = 0.55 * this.bowB
    if (moving) this.phase += dt * 11
    else this.phase *= 0.85
    const s = Math.sin(this.phase)
    // 걸음: 통통 튀고 발이 번갈아 나감
    this.body.position.y = moving ? Math.abs(s) * 0.05 : Math.sin(performance.now() / 900) * 0.008
    this.body.rotation.z = moving ? s * 0.05 : 0
    this.footL.position.z = 0.03 + (moving ? s * 0.09 : 0)
    this.footR.position.z = 0.03 - (moving ? s * 0.09 : 0)
    // 팔: 걸을 땐 흔들고, 기도할 땐 가슴 앞에서 모음(합장)
    const swing = moving ? s * 0.6 : 0
    const b = this.blend
    this.armL.rotation.set(-swing * (1 - b) - 1.25 * b, 0, -0.12 * (1 - b) - 0.55 * b)
    this.armR.rotation.set(swing * (1 - b) - 1.25 * b, 0, 0.12 * (1 - b) + 0.55 * b)
    this.head.rotation.x = 0.18 * b // 고개를 살짝 숙임
  }

  dispose() {
    this.root.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose()
      const mm = m.material as THREE.Material | undefined
      mm?.dispose()
    })
  }
}
