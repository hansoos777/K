import { getState, subscribe } from './store'

/**
 * 모든 소리는 Web Audio로 그 자리에서 합성한다.
 * 음원 파일이 없으니 저작권 문제·다운로드 용량·CDN 비용이 0이다.
 * 실제 녹음(허가 확인된 것)은 2단계에서 R2에 올려 필요할 때만 받는다.
 */
let ctx: AudioContext | null = null
let master: GainNode | null = null
const live = new Set<AudioScheduledSourceNode>()
let loopTimer: number | undefined

function applyVolume() {
  if (!master || !ctx) return
  const s = getState()
  master.gain.setTargetAtTime(s.sound ? s.volume : 0, ctx.currentTime, 0.05)
}
subscribe(applyVolume)

function ac(): AudioContext | null {
  const s = getState()
  if (!s.sound) return null
  try {
    if (!ctx) {
      ctx = new AudioContext()
      master = ctx.createGain()
      master.connect(ctx.destination)
      applyVolume()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function track(n: AudioScheduledSourceNode) {
  live.add(n)
  n.onended = () => live.delete(n)
}

function partial(c: AudioContext, out: AudioNode, freq: number, gain: number, start: number, decay: number, type: OscillatorType = 'sine') {
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.setValueAtTime(0.0001, start)
  g.gain.exponentialRampToValueAtTime(gain, start + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, start + decay)
  o.connect(g).connect(out)
  o.start(start)
  o.stop(start + decay + 0.05)
  track(o)
}

export type BellKind = 'church' | 'beomjong' | 'ghanta'

/** 종소리. 종류마다 배음과 울림 길이가 다르다 */
export function bell(kind: BellKind = 'church') {
  const c = ac()
  if (!c || !master) return
  const t = c.currentTime + 0.01
  if (kind === 'beomjong') {
    // 한국 범종: 아주 낮고 길게, 가까운 두 음이 만드는 맥놀이(울림이 커졌다 작아짐)
    const f = 64
    partial(c, master, f, 0.5, t, 14)
    partial(c, master, f * 1.006, 0.4, t, 14) // 맥놀이
    partial(c, master, f * 2.0, 0.18, t, 9)
    partial(c, master, f * 2.76, 0.12, t, 6)
    partial(c, master, f * 5.4, 0.05, t, 2.5)
    return
  }
  if (kind === 'ghanta') {
    // 힌두 사원 종(간타): 밝고 금속성
    const f = 620
    ;[1, 1.5, 2.0, 2.74, 3.9, 5.2].forEach((r, i) => partial(c, master!, f * r, 0.22 / (i + 1), t, 3.5 - i * 0.4))
    return
  }
  // 교회·성당 종: 험·프라임·단3도·5도·노미널 배음
  const f = 196
  ;[0.5, 1, 1.2, 1.5, 2, 2.5, 3].forEach((r, i) => partial(c, master!, f * r, 0.2 / (1 + i * 0.6), t, 5 - i * 0.5))
}

/** 죽비: 대나무를 손바닥에 치는 짧고 마른 소리 (선방에서 입선·방선 신호) */
export function jukbi(times = 1) {
  const c = ac()
  if (!c || !master) return
  for (let i = 0; i < times; i++) {
    const t = c.currentTime + 0.01 + i * 0.9
    const len = Math.floor(c.sampleRate * 0.06)
    const buf = c.createBuffer(1, len, c.sampleRate)
    const d = buf.getChannelData(0)
    for (let j = 0; j < len; j++) d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / len, 6)
    const src = c.createBufferSource()
    src.buffer = buf
    const bp = c.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = 1800
    bp.Q.value = 1.2
    const g = c.createGain()
    g.gain.value = 1.4
    src.connect(bp).connect(g).connect(master)
    src.start(t)
    track(src)
  }
}

/** 목탁: 짧고 둥근 나무 소리 */
export function moktak() {
  const c = ac()
  if (!c || !master) return
  const t = c.currentTime + 0.005
  const o = c.createOscillator()
  const g = c.createGain()
  const f = c.createBiquadFilter()
  f.type = 'bandpass'
  f.frequency.value = 900
  f.Q.value = 4
  o.type = 'triangle'
  o.frequency.setValueAtTime(720, t)
  o.frequency.exponentialRampToValueAtTime(520, t + 0.12)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.9, t + 0.003)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18)
  o.connect(f).connect(g).connect(master)
  o.start(t)
  o.stop(t + 0.2)
  track(o)
}

const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12)

/** 파이프 오르간 느낌: 드로바(1·2·3·4·8배음) 합성 */
function organNote(c: AudioContext, n: number, start: number, dur: number, vel = 0.08) {
  const g = c.createGain()
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 2600
  g.gain.setValueAtTime(0.0001, start)
  g.gain.linearRampToValueAtTime(vel, start + 0.06)
  g.gain.setValueAtTime(vel, start + dur - 0.08)
  g.gain.linearRampToValueAtTime(0.0001, start + dur)
  g.connect(lp).connect(master!)
  ;[1, 2, 3, 4, 8].forEach((h, i) => {
    const o = c.createOscillator()
    o.frequency.value = midi(n) * h
    const hg = c.createGain()
    hg.gain.value = [1, 0.5, 0.3, 0.2, 0.08][i]
    o.connect(hg).connect(g)
    o.start(start)
    o.stop(start + dur + 0.02)
    track(o)
  })
}

/** 부드러운 패드(현대 예배용) */
function padNote(c: AudioContext, n: number, start: number, dur: number, vel = 0.05) {
  const g = c.createGain()
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 1200
  g.gain.setValueAtTime(0.0001, start)
  g.gain.linearRampToValueAtTime(vel, start + 0.8)
  g.gain.linearRampToValueAtTime(0.0001, start + dur + 0.6)
  g.connect(lp).connect(master!)
  ;[-0.06, 0.06].forEach((det) => {
    const o = c.createOscillator()
    o.type = 'sawtooth'
    o.frequency.value = midi(n + det)
    o.connect(g)
    o.start(start)
    o.stop(start + dur + 0.7)
    track(o)
  })
}

/**
 * 공개 저작물 선율: OLD HUNDREDTH (Genevan Psalter, 1551).
 * [MIDI 음, 박] 목록. 화음은 같은 박에 아래 음을 더함.
 */
const OLD_100TH: [number, number][] = [
  [67, 2], [67, 1], [66, 1], [64, 1], [62, 1], [67, 1], [69, 1], [71, 2],
  [71, 2], [71, 1], [71, 1], [69, 1], [67, 1], [72, 1], [71, 1], [69, 2],
  [67, 2], [69, 1], [71, 1], [69, 1], [67, 1], [64, 1], [66, 1], [67, 2],
  [74, 2], [71, 1], [67, 1], [69, 1], [72, 1], [71, 1], [69, 1], [67, 3],
]
const BASS: Record<number, number> = { 67: 55, 66: 50, 64: 52, 62: 55, 69: 54, 71: 55, 72: 57, 74: 55 }

export type Music = 'hymn-organ' | 'worship-pad' | 'cathedral-organ'

/** 음악 재생. 다른 소리는 멈추고 새로 시작. 재생 길이(초)를 돌려줌, 못 틀면 0 */
export function playMusic(kind: Music): number {
  stopAll()
  const c = ac()
  if (!c || !master) return 0
  const t0 = c.currentTime
  let t = t0 + 0.1
  if (kind === 'hymn-organ') {
    const beat = 0.62
    for (const [n, b] of OLD_100TH) {
      const d = b * beat
      organNote(c, n, t, d * 0.97)
      organNote(c, n - 4 > 60 ? n - 4 : n - 3, t, d * 0.97, 0.05)
      organNote(c, BASS[n] ?? 55, t, d * 0.97, 0.06)
      t += d
    }
    return t - t0
  }
  if (kind === 'cathedral-organ') {
    // 넓은 공간을 채우는 느린 화음 진행 (자작)
    const chords = [[50, 57, 62, 65], [48, 55, 60, 64], [46, 53, 58, 62], [45, 52, 57, 61], [50, 57, 62, 66]]
    for (const ch of chords) {
      ch.forEach((n) => organNote(c, n, t, 4.2, 0.045))
      t += 4
    }
    return t - t0 + 0.3
  }
  // 현대 예배 패드: I–V–vi–IV (D장조, 흔한 진행이라 저작권 대상 아님)
  const prog = [[62, 66, 69], [57, 61, 64], [59, 62, 66], [55, 59, 62]]
  for (let r = 0; r < 2; r++)
    for (const ch of prog) {
      ch.forEach((n) => padNote(c, n, t, 3.6))
      padNote(c, ch[0] - 12, t, 3.6, 0.04)
      t += 4
    }
  return t - t0 + 0.7
}

/** 숲·바람 환경음 (노이즈를 걸러 천천히 움직임) */
export function playWind(): boolean {
  stopAll()
  const c = ac()
  if (!c || !master) return false
  const len = c.sampleRate * 4
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02 // 브라운 노이즈
    d[i] = last * 3.5
  }
  const src = c.createBufferSource()
  src.buffer = buf
  src.loop = true
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 500
  const lfo = c.createOscillator()
  const lfoG = c.createGain()
  lfo.frequency.value = 0.08
  lfoG.gain.value = 250
  lfo.connect(lfoG).connect(lp.frequency)
  const g = c.createGain()
  g.gain.value = 0.25
  src.connect(lp).connect(g).connect(master)
  src.start()
  lfo.start()
  track(src)
  track(lfo)
  // 가끔 먼 풍경(風磬) 소리
  loopTimer = window.setInterval(() => {
    if (Math.random() < 0.5 && ctx && master) {
      const t0 = ctx.currentTime
      partial(ctx, master, 1760, 0.04, t0, 2.2)
      partial(ctx, master, 1760 * 2.4, 0.015, t0, 1.2)
    }
  }, 7000)
  return true
}

export function isPlaying() {
  return live.size > 0
}

/** 공간을 나갈 때 반드시 호출: 소리 노드 정리, 컨텍스트 일시정지(배터리 절약) */
export function stopAll() {
  window.clearInterval(loopTimer)
  for (const n of live) {
    try {
      n.stop()
    } catch {
      /* 이미 멈춤 */
    }
  }
  live.clear()
}

export function suspendAudio() {
  stopAll()
  if (ctx && ctx.state === 'running') void ctx.suspend()
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) suspendAudio()
})
