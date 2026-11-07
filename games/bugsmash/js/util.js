export const TAU = Math.PI * 2
export const DEG = Math.PI / 180
export const R = (a = 1, b) => (b === undefined ? Math.random() * a : a + Math.random() * (b - a))
export const RI = (a, b) => Math.floor(R(a, b + 1))
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]
export const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
export const lerp = (a, b, t) => a + (b - a) * t
export const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by)
export const easeIn = (t) => t * t
export const easeOut = (t) => 1 - (1 - t) * (1 - t)
export function angDiff(a, b) {
  let d = (b - a) % TAU
  if (d > Math.PI) d -= TAU
  if (d < -Math.PI) d += TAU
  return d
}
export function seeded(seed) {
  let s = (seed * 2654435761) >>> 0 || 1
  return () => {
    s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0
    return s / 4294967296
  }
}
const rgbCache = {}
export function rgb(h) {
  if (rgbCache[h]) return rgbCache[h]
  if (h[0] !== '#') { // 'rgb(r,g,b)' — mix() 결과를 다시 섞을 때
    const m = h.match(/[\d.]+/g) || [0, 0, 0]
    return (rgbCache[h] = [+m[0], +m[1], +m[2]])
  }
  let x = h.slice(1)
  if (x.length === 3) x = x.split('').map((c) => c + c).join('')
  const n = parseInt(x, 16)
  return (rgbCache[h] = [(n >> 16) & 255, (n >> 8) & 255, n & 255])
}
const mixCache = new Map()
/** 두 hex 색을 t만큼 섞는다(입력은 항상 hex) */
export function mix(a, b, t) {
  t = clamp(t, 0, 1)
  if (t <= 0.001) return a
  const q = Math.round(t * 32)
  const k = a + b + q
  let v = mixCache.get(k)
  if (v) return v
  const A = rgb(a), B = rgb(b), f = q / 32
  v = `rgb(${Math.round(A[0] + (B[0] - A[0]) * f)},${Math.round(A[1] + (B[1] - A[1]) * f)},${Math.round(A[2] + (B[2] - A[2]) * f)})`
  mixCache.set(k, v)
  return v
}
export function alpha(h, a) {
  const [r, g, b] = rgb(h)
  return `rgba(${r},${g},${b},${a})`
}
/** 둥근 사각형 경로(구형 브라우저에도 되도록 직접 그림) */
export function rr(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2)
  c.beginPath()
  c.moveTo(x + r, y)
  c.arcTo(x + w, y, x + w, y + h, r)
  c.arcTo(x + w, y + h, x, y + h, r)
  c.arcTo(x, y + h, x, y, r)
  c.arcTo(x, y, x + w, y, r)
  c.closePath()
}
export function ell(c, x, y, rx, ry, rot = 0) {
  c.beginPath()
  c.ellipse(x, y, Math.max(rx, 0.01), Math.max(ry, 0.01), rot, 0, TAU)
}
