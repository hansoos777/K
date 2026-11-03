import * as THREE from 'three'

/**
 * PujaTime src/three/kit.ts 에서 가져온 3D 공용 도구 (신상 문양 부분만 뺌).
 * 저사양 폰을 위해 그림자·점광원 대신 glow 스프라이트와 재질 색으로 빛을 표현한다.
 */
export function canvasTexture(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void, repeat?: [number, number]) {
  const el = document.createElement('canvas')
  el.width = w
  el.height = h
  draw(el.getContext('2d')!)
  const t = new THREE.CanvasTexture(el)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(...repeat)
  }
  return t
}

/** 놋쇠·금 광택 매트캡 (PujaTime과 같은 그림) */
export function brassEnv() {
  return canvasTexture(256, 256, (c) => {
    c.fillStyle = '#3a1c08'
    c.fillRect(0, 0, 256, 256)
    const g = c.createRadialGradient(92, 78, 6, 128, 128, 128)
    g.addColorStop(0, '#fff6cf')
    g.addColorStop(0.2, '#ffd98a')
    g.addColorStop(0.5, '#d29a3c')
    g.addColorStop(0.8, '#7c4a16')
    g.addColorStop(1, '#f0bd68')
    c.fillStyle = g
    c.beginPath()
    c.arc(128, 128, 128, 0, Math.PI * 2)
    c.fill()
  })
}

/** 흰 대리석 매트캡 (성모상·성인상) */
export function marbleEnv() {
  return canvasTexture(256, 256, (c) => {
    c.fillStyle = '#9a948a'
    c.fillRect(0, 0, 256, 256)
    const g = c.createRadialGradient(96, 80, 6, 128, 128, 128)
    g.addColorStop(0, '#ffffff')
    g.addColorStop(0.35, '#f4f0e8')
    g.addColorStop(0.75, '#c9c2b4')
    g.addColorStop(1, '#efe8da')
    c.fillStyle = g
    c.beginPath()
    c.arc(128, 128, 128, 0, Math.PI * 2)
    c.fill()
  })
}

/** 청동 매트캡 (범종) */
export function bronzeEnv() {
  return canvasTexture(256, 256, (c) => {
    c.fillStyle = '#1a120a'
    c.fillRect(0, 0, 256, 256)
    const g = c.createRadialGradient(92, 78, 6, 128, 128, 128)
    g.addColorStop(0, '#f4dcae')
    g.addColorStop(0.3, '#9a7440')
    g.addColorStop(0.7, '#4a3418')
    g.addColorStop(1, '#8a6a3a')
    c.fillStyle = g
    c.beginPath()
    c.arc(128, 128, 128, 0, Math.PI * 2)
    c.fill()
  })
}

export const brass = (matcap: THREE.Texture, color = 0xffffff) => new THREE.MeshMatcapMaterial({ matcap, color })

export const glowTexture = (inner = '255,226,150', outer = '255,150,50') =>
  canvasTexture(128, 128, (c) => {
    const g = c.createRadialGradient(64, 64, 2, 64, 64, 64)
    g.addColorStop(0, `rgba(${inner},1)`)
    g.addColorStop(0.3, `rgba(${outer},.45)`)
    g.addColorStop(1, `rgba(${outer},0)`)
    c.fillStyle = g
    c.fillRect(0, 0, 128, 128)
  })

const flameTexture = () =>
  canvasTexture(96, 160, (c) => {
    const flame = (s: number, col: CanvasGradient | string) => {
      c.save()
      c.translate(48, 150)
      c.scale(s, s)
      c.beginPath()
      c.moveTo(0, 0)
      c.bezierCurveTo(-42, -22, -30, -70, 0, -140)
      c.bezierCurveTo(30, -70, 42, -22, 0, 0)
      c.fillStyle = col
      c.fill()
      c.restore()
    }
    const g = c.createLinearGradient(0, 150, 0, 10)
    g.addColorStop(0, '#e8481a')
    g.addColorStop(0.4, '#ffa726')
    g.addColorStop(1, '#ffe681')
    flame(1, g)
    flame(0.55, '#fff5c4')
  })

/** PujaTime의 불꽃: 불꽃 스프라이트 + 빛 번짐 */
export class Flame {
  group = new THREE.Group()
  private body: THREE.Sprite
  private glow: THREE.Sprite
  private seed = Math.random() * 10
  constructor(flameTex: THREE.Texture, glowTex: THREE.Texture, private size = 0.3) {
    this.body = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }))
    this.glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.85 }))
    this.body.center.set(0.5, 0.05)
    this.glow.scale.setScalar(size * 4.4)
    this.glow.position.y = size * 0.4
    this.group.add(this.glow, this.body)
    this.tick(0)
  }
  tick(t: number) {
    const f = Math.sin(t * 9 + this.seed) * 0.05 + Math.sin(t * 17 + this.seed) * 0.03
    this.body.scale.set(this.size * 0.62 * (1 - f), this.size * (1 + f * 1.4), 1)
    this.glow.material.opacity = 0.74 + f * 1.6
  }
}

export const makeFlameTextures = () => ({ flame: flameTexture(), glow: glowTexture() })

export const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt))
