import * as THREE from 'three'

/**
 * 절차적 텍스처: 이미지 파일을 받지 않고 캔버스로 그린다(용량 0, 저작권 걱정 없음).
 * 같은 인자는 캐시해서 다시 그리지 않는다.
 */
const cache = new Map<string, THREE.Texture>()

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')!] as const
}

function make(key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D, w: number, h: number) => void, repeat?: [number, number], color = true) {
  const k = key + (repeat ? repeat.join('x') : '')
  const hit = cache.get(k)
  if (hit) return hit
  const [c, g] = canvas(w, h)
  draw(g, w, h)
  const t = new THREE.CanvasTexture(c)
  if (color) t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(repeat[0], repeat[1])
  }
  cache.set(k, t)
  return t
}

/** 시드 고정 난수 (같은 모양이 매번 나오게) */
export function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296)
}

export function marble(base = '#e9e3d6', vein = '#b9ae98', repeat: [number, number] = [4, 4], tile = true) {
  return make(`marble${base}${vein}${tile}`, 512, 512, (g, w, h) => {
    g.fillStyle = base
    g.fillRect(0, 0, w, h)
    const r = rng(7)
    for (let i = 0; i < 26; i++) {
      g.strokeStyle = vein
      g.globalAlpha = 0.08 + r() * 0.18
      g.lineWidth = 0.6 + r() * 1.8
      g.beginPath()
      let x = r() * w, y = r() * h
      g.moveTo(x, y)
      for (let k = 0; k < 8; k++) {
        x += (r() - 0.5) * 120
        y += (r() - 0.3) * 90
        g.lineTo(x, y)
      }
      g.stroke()
    }
    g.globalAlpha = 1
    if (tile) {
      g.strokeStyle = 'rgba(0,0,0,.10)'
      g.lineWidth = 2
      g.strokeRect(1, 1, w - 2, h - 2)
    }
  }, repeat)
}

export function checker(a: string, b: string, repeat: [number, number]) {
  return make(`chk${a}${b}`, 256, 256, (g) => {
    for (let y = 0; y < 2; y++) for (let x = 0; x < 2; x++) {
      g.fillStyle = (x + y) % 2 ? a : b
      g.fillRect(x * 128, y * 128, 128, 128)
    }
    g.strokeStyle = 'rgba(0,0,0,.12)'
    g.strokeRect(0, 0, 256, 256)
  }, repeat)
}

export function wood(base = '#6b4a2c', repeat: [number, number] = [1, 1]) {
  return make(`wood${base}`, 256, 256, (g, w, h) => {
    g.fillStyle = base
    g.fillRect(0, 0, w, h)
    const r = rng(3)
    for (let i = 0; i < 70; i++) {
      g.strokeStyle = `rgba(${r() < 0.5 ? '0,0,0' : '255,230,200'},${0.03 + r() * 0.06})`
      g.lineWidth = 1 + r() * 2
      const y = r() * h
      g.beginPath()
      g.moveTo(0, y)
      g.bezierCurveTo(w * 0.3, y + (r() - 0.5) * 8, w * 0.7, y + (r() - 0.5) * 8, w, y)
      g.stroke()
    }
  }, repeat)
}

export function planks(base = '#7a5634', repeat: [number, number] = [6, 6]) {
  return make(`planks${base}`, 256, 256, (g, w, h) => {
    const r = rng(11)
    for (let i = 0; i < 4; i++) {
      const l = 0.85 + r() * 0.3
      g.fillStyle = shade(base, l)
      g.fillRect(0, (i * h) / 4, w, h / 4)
      g.fillStyle = 'rgba(0,0,0,.25)'
      g.fillRect(0, (i * h) / 4, w, 2)
      g.fillRect((r() * w) | 0, (i * h) / 4, 2, h / 4)
    }
  }, repeat)
}

export function stone(base = '#8d877c', repeat: [number, number] = [4, 4]) {
  return make(`stone${base}`, 256, 256, (g, w, h) => {
    const r = rng(5)
    g.fillStyle = shade(base, 0.7)
    g.fillRect(0, 0, w, h)
    const rows = 6
    for (let y = 0; y < rows; y++) {
      const off = (y % 2) * 32
      for (let x = -1; x < 4; x++) {
        g.fillStyle = shade(base, 0.85 + r() * 0.3)
        g.fillRect(x * 64 + off + 2, y * (h / rows) + 2, 60, h / rows - 4)
      }
    }
  }, repeat)
}

/** 색유리: 납선으로 나뉜 색 조각. emissive로 쓰면 빛나는 창이 된다 */
export function stainedGlass(seed: number, palette = ['#b5213b', '#2a5db0', '#e3b341', '#2f8f5b', '#7a3c98', '#d9682b']) {
  return make(`glass${seed}${palette.join()}`, 128, 256, (g, w, h) => {
    const r = rng(seed)
    g.fillStyle = '#111'
    g.fillRect(0, 0, w, h)
    const cols = 4, rows = 10
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < cols; x++) {
        g.fillStyle = palette[Math.floor(r() * palette.length)]
        const cw = w / cols, ch = h / rows
        g.beginPath()
        g.moveTo(x * cw + 2 + r() * 3, y * ch + 2)
        g.lineTo((x + 1) * cw - 2, y * ch + 2 + r() * 3)
        g.lineTo((x + 1) * cw - 2 - r() * 3, (y + 1) * ch - 2)
        g.lineTo(x * cw + 2, (y + 1) * ch - 2 - r() * 3)
        g.fill()
      }
    // 가운데 둥근 메달리온
    g.fillStyle = palette[2]
    g.beginPath()
    g.arc(w / 2, h * 0.42, w * 0.22, 0, Math.PI * 2)
    g.fill()
    g.strokeStyle = '#111'
    g.lineWidth = 4
    g.stroke()
    g.fillStyle = palette[0]
    g.beginPath()
    g.arc(w / 2, h * 0.42, w * 0.1, 0, Math.PI * 2)
    g.fill()
  })
}

export function roseWindow(seed = 1) {
  return make(`rose${seed}`, 512, 512, (g, w) => {
    const c = w / 2
    const pal = ['#b5213b', '#2a5db0', '#e3b341', '#2f8f5b', '#7a3c98']
    g.fillStyle = '#0d0810'
    g.fillRect(0, 0, w, w)
    for (let ring = 4; ring >= 1; ring--) {
      const n = ring * 8
      for (let i = 0; i < n; i++) {
        g.fillStyle = pal[(i + ring) % pal.length]
        g.beginPath()
        const a0 = (i / n) * Math.PI * 2, a1 = ((i + 0.86) / n) * Math.PI * 2
        g.arc(c, c, (ring / 4) * c * 0.96, a0, a1)
        g.arc(c, c, ((ring - 1) / 4) * c * 0.96 + 6, a1, a0, true)
        g.fill()
      }
    }
    g.fillStyle = '#e3b341'
    g.beginPath()
    g.arc(c, c, c * 0.12, 0, Math.PI * 2)
    g.fill()
  })
}

/** 단청 띠 (녹청·주홍·감청 반복 문양) */
export function dancheong() {
  return make('dancheong', 512, 64, (g, w, h) => {
    g.fillStyle = '#2f7a63'
    g.fillRect(0, 0, w, h)
    for (let x = 0; x < w; x += 64) {
      g.fillStyle = '#c8553d'
      g.fillRect(x + 4, 6, 56, h - 12)
      g.fillStyle = '#f2e3c2'
      g.beginPath()
      g.arc(x + 32, h / 2, 18, 0, Math.PI * 2)
      g.fill()
      g.fillStyle = '#2b4f9a'
      g.beginPath()
      g.arc(x + 32, h / 2, 11, 0, Math.PI * 2)
      g.fill()
      g.fillStyle = '#e8b93c'
      g.beginPath()
      g.arc(x + 32, h / 2, 4, 0, Math.PI * 2)
      g.fill()
    }
    g.fillStyle = '#1d1d1d'
    g.fillRect(0, 0, w, 3)
    g.fillRect(0, h - 3, w, 3)
  }, [4, 1])
}

/** 붉은 바탕 금 무늬 (만디르 벽) */
export function templeWall(base = '#8c2a14', gold = '#e0a640') {
  return make(`twall${base}`, 256, 256, (g, w, h) => {
    g.fillStyle = base
    g.fillRect(0, 0, w, h)
    g.strokeStyle = gold
    g.globalAlpha = 0.55
    g.lineWidth = 2
    for (let y = 32; y < h; y += 64)
      for (let x = 32; x < w; x += 64) {
        g.beginPath()
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI * 2
          g.ellipse(x + Math.cos(a) * 10, y + Math.sin(a) * 10, 9, 4, a, 0, Math.PI * 2)
        }
        g.stroke()
      }
    g.globalAlpha = 1
  }, [3, 2])
}

/** 둥근 빛 번짐 (불꽃·등·후광) */
export function glow(color = '#ffcf6a') {
  return make(`glow${color}`, 128, 128, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, '#ffffff')
    grd.addColorStop(0.2, color)
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** 바닥 그림자 원 */
export function blob() {
  return make('blob', 64, 64, (g, w) => {
    const grd = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2)
    grd.addColorStop(0, 'rgba(0,0,0,.55)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** 매트캡: 환경맵 없이 금속 광택을 흉내 (PMREM보다 훨씬 가벼움) */
export function matcap(hi: string, mid: string, lo: string) {
  return make(`mc${hi}${mid}${lo}`, 128, 128, (g, w) => {
    const grd = g.createRadialGradient(w * 0.35, w * 0.3, 2, w / 2, w / 2, w / 2)
    grd.addColorStop(0, hi)
    grd.addColorStop(0.45, mid)
    grd.addColorStop(1, lo)
    g.fillStyle = grd
    g.fillRect(0, 0, w, w)
  })
}

/** 하늘 그라데이션(위→아래) */
export function skyGradient(stops: [number, string][]) {
  return make(`sky${stops.flat().join()}`, 8, 256, (g, _w, h) => {
    const grd = g.createLinearGradient(0, 0, 0, h)
    stops.forEach(([o, c]) => grd.addColorStop(o, c))
    g.fillStyle = grd
    g.fillRect(0, 0, 8, h)
  })
}

/** 랑골리 (만디르 바닥 문양) */
export function rangoli() {
  return make('rangoli', 512, 512, (g, w) => {
    const c = w / 2
    const cols = ['#e8473c', '#f2a33a', '#f6d24a', '#2f9e6a', '#2b6fd1', '#e86aa8']
    for (let ring = 6; ring >= 1; ring--) {
      const n = 8 + ring * 2
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2
        g.fillStyle = cols[(ring + i) % cols.length]
        g.beginPath()
        g.ellipse(c + Math.cos(a) * ring * 34, c + Math.sin(a) * ring * 34, 22, 10, a, 0, Math.PI * 2)
        g.fill()
      }
    }
    g.fillStyle = '#fff6dc'
    g.beginPath()
    g.arc(c, c, 26, 0, Math.PI * 2)
    g.fill()
  })
}

export function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16)
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)))
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`
}

export function disposeTextures() {
  cache.forEach((t) => t.dispose())
  cache.clear()
}
