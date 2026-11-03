import * as THREE from 'three'
import { makeDevotee, type DevoteeOpts } from './pt/devotee'
import { blob } from './tex'

/**
 * 방문자 캐릭터: PujaTime의 2등신 신자 캐릭터(pt/devotee.ts)를 그대로 쓴다.
 * 서 있기 / 두 손 모으기 두 모습을 만들어 두고 자세에 따라 바꾼다.
 */
export type Pose = 'idle' | 'walk' | 'pray' | 'bow'
export type AvatarLook = Omit<DevoteeOpts, 'ratio' | 'pose' | 'joined'>

/** 종교별 기본 옷차림 (사용자 캐릭터) */
export const LOOKS: Record<'christian' | 'catholic' | 'mandir' | 'temple', AvatarLook> = {
  christian: { outfit: 'shirt', skin: 0xe8c4a0, cloth: 0x3d5a8a, trim: 0xf4efe4 },
  catholic: { outfit: 'dress', skin: 0xe8c4a0, cloth: 0x6b2b3a, trim: 0xf4efe4, hair: 0x4a2e1a },
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
    { outfit: 'dress', skin: 0xf1d2b4, cloth: 0x2a3a5a, trim: 0xf4efe4, hair: 0x3a2a20 },
    { outfit: 'shirt', skin: 0xe0b48c, cloth: 0x4a4a4a, trim: 0xf4efe4 },
    { outfit: 'dress', skin: 0xf1d2b4, cloth: 0xf4f0e8, trim: 0x3d68b8, elder: true },
    { outfit: 'shirt', skin: 0x8a5a3a, cloth: 0x5a3a6a, trim: 0xf4efe4, elder: true },
    { outfit: 'dress', skin: 0xc8946a, cloth: 0x6b2b3a, trim: 0xf4efe4, hair: 0x1c1410 },
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
  pose: Pose = 'idle'
  private phase = 0
  private bowB = 0

  constructor(look: AvatarLook, sit = false) {
    this.stand = makeDevotee({ ...look, ratio: 2, pose: sit ? 'sit' : 'stand' })
    this.joined = makeDevotee({ ...look, ratio: 2, pose: sit ? 'sit' : 'stand', joined: true })
    this.joined.visible = false
    this.body.add(this.stand, this.joined)
    this.body.scale.setScalar(SCALE)
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 0.9),
      new THREE.MeshBasicMaterial({ map: blob(), transparent: true, depthWrite: false }),
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = 0.01
    this.root.add(shadow, this.body)
  }

  update(dt: number, moving: boolean) {
    this.pose = moving ? 'walk' : this.pose === 'walk' ? 'idle' : this.pose
    const hands = this.pose === 'pray' || this.pose === 'bow'
    this.stand.visible = !hands
    this.joined.visible = hands
    this.bowB += ((this.pose === 'bow' ? 1 : 0) - this.bowB) * Math.min(1, dt * 4)
    if (moving) this.phase += dt * 12
    else this.phase *= 0.8
    const s = Math.sin(this.phase)
    // 통통 튀며 좌우로 흔들리는 걸음 (PujaTime 캐릭터와 같은 느낌)
    this.body.position.y = moving ? Math.abs(s) * 0.06 : Math.sin(performance.now() / 900) * 0.006
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
