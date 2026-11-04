import * as THREE from 'three'
import { makeDevotee, type DevoteeOpts } from './pt/devotee'
import { blob } from './tex'

/**
 * 방문자 캐릭터: PujaTime의 2등신 신자 캐릭터(pt/devotee.ts)를 그대로 쓴다.
 * 서 있기 / 두 손 모으기 두 모습을 만들어 두고 자세에 따라 바꾼다.
 */
export type Pose = 'idle' | 'walk' | 'pray' | 'bow' | 'sit' | 'sitpray'
export type AvatarLook = Omit<DevoteeOpts, 'ratio' | 'pose' | 'joined'>

/** 종교별 기본 옷차림 (사용자 캐릭터) */
export const LOOKS: Record<'christian' | 'catholic' | 'mandir' | 'temple', AvatarLook> = {
  christian: { outfit: 'shirt', skin: 0xe8c4a0, cloth: 0x3d5a8a, trim: 0xf4efe4 },
  catholic: { outfit: 'dress', skin: 0xe8c4a0, cloth: 0x6b2b3a, trim: 0xf4efe4, hair: 0x4a2e1a, veil: true },
  mandir: { outfit: 'sari', skin: 0xb97a4c, cloth: 0xc2185b },
  temple: { outfit: 'lay', skin: 0xe8c4a0, cloth: 0x8a8478, trim: 0xd8d0c0 },
}

/** 공간을 채우는 방문객: 종교마다 옷차림과 피부색·나이를 섞음 */
const CASTS: Record<keyof typeof LOOKS, AvatarLook[]> = {
  christian: [
    { outfit: 'shirt', skin: 0xf1d2b4, cloth: 0x2f4a6a, trim: 0xf4efe4 },
    { outfit: 'dress', skin: 0xe0b48c, cloth: 0x8a3a4a, trim: 0xf4efe4, hair: 0x5a3a20 },
    { outfit: 'shirt', skin: 0x8a5a3a, cloth: 0xe8e2d4, trim: 0x3a3f4a },
    { outfit: 'dress', skin: 0xf1d2b4, cloth: 0x2f5a4a, trim: 0xf4efe4, elder: true },
    { outfit: 'shirt', skin: 0xc8946a, cloth: 0x5a4a3a, trim: 0xf4efe4, elder: true },
    { outfit: 'dress', skin: 0xc8946a, cloth: 0x3a4a7a, trim: 0xf4efe4, hair: 0x1c1410 },
  ],
  catholic: [
    { outfit: 'dress', veil: true, skin: 0xf1d2b4, cloth: 0x2a3a5a, trim: 0xf4efe4, hair: 0x3a2a20 },
    { outfit: 'shirt', skin: 0xe0b48c, cloth: 0x4a4a4a, trim: 0xf4efe4 },
    { outfit: 'dress', veil: true, skin: 0xf1d2b4, cloth: 0xf4f0e8, trim: 0x3d68b8, elder: true },
    { outfit: 'shirt', skin: 0x8a5a3a, cloth: 0x5a3a6a, trim: 0xf4efe4, elder: true },
    { outfit: 'dress', veil: true, skin: 0xc8946a, cloth: 0x6b2b3a, trim: 0xf4efe4, hair: 0x1c1410 },
    { outfit: 'shirt', skin: 0xf1d2b4, cloth: 0x3a5a4a, trim: 0xf4efe4 },
  ],
  mandir: [
    { outfit: 'sari', skin: 0xb97a4c, cloth: 0xc2185b },
    { outfit: 'kurta', skin: 0x9c5f37, cloth: 0x1f7a78 },
    { outfit: 'sari', skin: 0xa86a40, cloth: 0x5e35b1, elder: true },
    { outfit: 'kurta', skin: 0xb07848, cloth: 0xfaf3e3, trim: 0xd9892b, elder: true },
  ],
  temple: [
    { outfit: 'monk', skin: 0xe8c4a0, cloth: 0x8c8a84, trim: 0x7a3a1e },
    { outfit: 'lay', skin: 0xf1d2b4, cloth: 0x8a8478, trim: 0xd8d0c0, elder: true },
    { outfit: 'lay', skin: 0xe0b48c, cloth: 0x6a6458, trim: 0xd8d0c0 },
    { outfit: 'monk', skin: 0xd8b088, cloth: 0x8c8a84, trim: 0x7a3a1e, elder: true },
    { outfit: 'dress', skin: 0xf1d2b4, cloth: 0x9a9488, trim: 0xd8d0c0, elder: true },
  ],
}
export function visitorLook(world: keyof typeof LOOKS, i: number): AvatarLook {
  const c = CASTS[world]
  return c[i % c.length]
}

const SCALE = 0.55

export class Avatar {
  root = new THREE.Group()
  private body = new THREE.Group()
  private stand: THREE.Group
  private joined: THREE.Group
  private seated: THREE.Group
  private seatedPray: THREE.Group
  private broom: THREE.Group
  /** 빗자루 들고 쓰는 중 */
  sweeping = false
  pose: Pose = 'idle'
  private phase = 0
  private bowB = 0

  constructor(look: AvatarLook, sit = false) {
    this.stand = makeDevotee({ ...look, ratio: 2, pose: sit ? 'sit' : 'stand' })
    this.joined = makeDevotee({ ...look, ratio: 2, pose: sit ? 'sit' : 'stand', joined: true })
    this.joined.visible = false
    // 앉은 모습(의자·장의자·방석 공통): 그냥 앉기 / 앉은 채로 두 손 모아 기도
    this.seated = makeDevotee({ ...look, ratio: 2, pose: 'sit' })
    this.seated.visible = false
    this.seatedPray = makeDevotee({ ...look, ratio: 2, pose: 'sit', joined: true })
    this.seatedPray.visible = false
    this.body.add(this.stand, this.joined, this.seated, this.seatedPray)
    // 빗자루 (사찰 마당 쓸기) — 몸 크기와 상관없이 실제 길이로
    this.broom = new THREE.Group()
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.02, 1.05, 8), new THREE.MeshLambertMaterial({ color: 0x9a7448 }))
    stick.position.y = 0.52
    const head = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.38, 12, 1, true), new THREE.MeshLambertMaterial({ color: 0xc9a86a, side: THREE.DoubleSide }))
    head.position.y = -0.05
    head.rotation.x = Math.PI
    const tie = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.012, 6, 12), new THREE.MeshLambertMaterial({ color: 0x7a3a1e }))
    tie.rotation.x = Math.PI / 2
    tie.position.y = 0.12
    this.broom.add(stick, head, tie)
    this.broom.position.set(0.22, 0.12, 0.34)
    this.broom.rotation.x = 0.55
    this.broom.visible = false
    this.body.scale.setScalar(SCALE)
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 0.9),
      new THREE.MeshBasicMaterial({ map: blob(), transparent: true, depthWrite: false }),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = 0.01
    this.root.add(shadow, this.body, this.broom)
  }

  update(dt: number, moving: boolean) {
    this.pose = moving ? 'walk' : this.pose === 'walk' ? 'idle' : this.pose
    const hands = this.pose === 'pray' || this.pose === 'bow'
    const sit = this.pose === 'sit' || this.pose === 'sitpray'
    this.stand.visible = !hands && !sit
    this.joined.visible = hands && !sit
    this.seated.visible = this.pose === 'sit'
    this.seatedPray.visible = this.pose === 'sitpray'
    this.broom.visible = this.sweeping && !sit
    if (this.sweeping && !sit) {
      // 쓱쓱: 빗자루를 좌우로 쓸고 몸도 조금 흔들림
      const k = performance.now() / 1000
      this.broom.rotation.z = Math.sin(k * 7) * 0.55
      this.broom.position.x = 0.22 + Math.sin(k * 7) * 0.12
      this.body.rotation.y = Math.sin(k * 7) * 0.12
    } else this.body.rotation.y = 0
    this.bowB += ((this.pose === 'bow' ? 1 : 0) - this.bowB) * Math.min(1, dt * 4)
    if (moving) this.phase += dt * 12
    else this.phase *= 0.8
    const s = Math.sin(this.phase)
    // 통통 튀며 좌우로 흔들리는 걸음 (PujaTime 캐릭터와 같은 느낌)
    this.body.position.y = moving ? Math.abs(s) * 0.06 : sit ? 0 : Math.sin(performance.now() / 900) * 0.006
    this.body.rotation.z = moving ? s * 0.07 : 0
    this.body.rotation.x = 0.5 * this.bowB
  }

  dispose() {
    this.root.traverse((o) => {
      const m = o as THREE.Mesh
      m.geometry?.dispose()
      const mm = m.material as THREE.Material | THREE.Material[] | undefined
      if (Array.isArray(mm)) mm.forEach((x) => x.dispose())
      else mm?.dispose()
    })
  }
}
