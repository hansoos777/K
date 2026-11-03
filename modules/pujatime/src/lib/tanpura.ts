// 탄푸라 줄 네 개를 차례로 튕기는 소리를 계산해서 만듦. 음정이 고정된 현악기 모델이라 음이 늘어지거나 일렁이지 않음.
const CYCLE = 7.2
const PLUCKS: [number, number, number][] = [
  // 시작 시각(초), 음높이(Hz), 세기: 파, 높은 사, 높은 사, 낮은 사
  [0, 98, 0.8],
  [1.5, 130.81, 0.9],
  [3, 130.81, 0.8],
  [4.5, 65.41, 1],
]

// 항상 같은 소리가 나도록 고정된 난수 사용
function noise(seed: number) {
  let x = seed
  return () => {
    x = (x * 1664525 + 1013904223) >>> 0
    return x / 2147483648 - 1
  }
}

// 카플러스-스트롱 현 모델. 끝이 시작으로 이어지도록 고리 모양으로 더해서 반복할 때 끊기지 않음
function pluck(out: Float32Array, sr: number, at: number, freq: number, level: number, seed: number) {
  const period = sr / freq - 0.5
  const n = Math.floor(period - 0.1)
  const frac = period - n
  const c = (1 - frac) / (1 + frac)
  const line = new Float32Array(n)
  const rand = noise(seed)
  let smooth = 0
  for (let i = 0; i < n; i++) {
    smooth = smooth * 0.35 + rand() * 0.65
    line[i] = smooth
  }
  const keep = 10 ** (-3 / (6.5 * freq))
  const start = Math.floor(at * sr)
  const fade = Math.floor(0.6 * sr)
  let p = 0
  let prev = 0
  let apIn = 0
  let apOut = 0
  for (let i = 0; i < out.length; i++) {
    const x = line[p]
    const mixed = (x * 0.82 + prev * 0.18) * keep
    prev = x
    const y = c * mixed + apIn - c * apOut
    apIn = mixed
    apOut = y
    // 줄이 브리지에 스치며 나는 지바리 울림
    line[p] = y > 0.2 ? 0.2 + (y - 0.2) * 0.45 : y
    p = (p + 1) % n
    const left = out.length - i
    const attack = Math.min(1, i / (0.004 * sr))
    out[(start + i) % out.length] += x * level * attack * (left < fade ? left / fade : 1)
  }
}

/** 7.2초짜리 반복 구간. 값은 -0.8~0.8 */
export function tanpuraLoop(sr: number) {
  const out = new Float32Array(Math.floor(CYCLE * sr))
  PLUCKS.forEach(([at, freq, level], i) => pluck(out, sr, at, freq, level, 99 + i * 7919))
  const mean = out.reduce((sum, v) => sum + v, 0) / out.length
  let peak = 0
  for (let i = 0; i < out.length; i++) {
    out[i] -= mean
    peak = Math.max(peak, Math.abs(out[i]))
  }
  for (let i = 0; i < out.length; i++) out[i] *= 0.8 / peak
  return out
}
