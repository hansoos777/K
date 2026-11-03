import * as THREE from 'three'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { EmblemArt, GoldDefs } from '../components/DeityEmblem'
import type { DeityId } from '../data/deities'

// 3D 공용 도구. 저사양 폰을 위해 그림자·점광원은 쓰지 않음(멍석에서 프레임이 크게 떨어졌던 원인).
// 빛은 glow 스프라이트와 재질 색으로 표현.

export function makeRenderer(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NoToneMapping
  return renderer
}

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

// 놋쇠 광택은 매트캡 한 장으로 표현. 환경맵(PMREM)은 첫 화면이 멈출 만큼 무거워서 쓰지 않음.
export function brassEnv(_renderer: THREE.WebGLRenderer) {
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
  }

  tick(t: number) {
    const f = Math.sin(t * 9 + this.seed) * 0.05 + Math.sin(t * 17 + this.seed) * 0.03
    this.body.scale.set(this.size * 0.62 * (1 - f), this.size * (1 + f * 1.4), 1)
    this.glow.material.opacity = 0.74 + f * 1.6
  }
}

export const makeFlameTextures = () => ({ flame: flameTexture(), glow: glowTexture() })

const emblemCache = new Map<DeityId, Promise<THREE.Texture>>()

// React SVG 문양을 그대로 텍스처로 구움. 그림 파일이 있으면 그림이 우선.
export function emblemTexture(id: DeityId) {
  const hit = emblemCache.get(id)
  if (hit) return hit
  const job = new Promise<THREE.Texture>((resolve) => {
    const finish = (img: HTMLImageElement) => {
      const t = canvasTexture(1024, 1024, (c) => {
        const r = Math.min(img.width, img.height)
        c.drawImage(img, (img.width - r) / 2, (img.height - r) / 2, r, r, 0, 0, 1024, 1024)
      })
      resolve(t)
    }
    const fallback = () => {
      const svg = renderToStaticMarkup(
        createElement('svg', { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 200 200', width: 1024, height: 1024 },
          createElement(GoldDefs), createElement(EmblemArt, { id })),
      )
      const img = new Image()
      img.onload = () => finish(img)
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
    }
    const real = new Image()
    real.onload = () => finish(real)
    real.onerror = fallback
    real.src = `/deities/${id}.jpg`
  })
  emblemCache.set(id, job)
  return job
}

export function disposeScene(scene: THREE.Object3D) {
  scene.traverse((o) => {
    const m = o as THREE.Mesh
    m.geometry?.dispose?.()
    const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : []
    mats.forEach((mat) => {
      Object.values(mat).forEach((v) => {
        if (v instanceof THREE.Texture && !emblemTextures.has(v)) v.dispose()
      })
      mat.dispose()
    })
  })
}

const emblemTextures = new WeakSet<THREE.Texture>()
export const keepTexture = (t: THREE.Texture) => {
  emblemTextures.add(t)
  return t
}

export const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.exp(-k * dt))
