import { audioPrefs, isSoundOn } from './store'
import { tanpuraLoop } from './tanpura'

// 녹음 파일 없이 Web Audio로 만든 소리. 만트라 음성은 넣지 않음(합성 음성으로 읽으면 결례).
let ctx: AudioContext | null = null
let sfx: GainNode | null = null
let music: GainNode | null = null

function audio() {
  if (!isSoundOn()) return null
  ctx ??= new AudioContext()
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

// 효과음이 모두 지나가는 음량 조절기. 기본값 2/3에서 원래 크기
function sfxOut(c: AudioContext) {
  if (!sfx) {
    sfx = c.createGain()
    sfx.connect(c.destination)
  }
  sfx.gain.value = audioPrefs().sfx * 1.5
  return sfx
}

function musicOut(c: AudioContext) {
  if (!music) {
    music = c.createGain()
    music.connect(c.destination)
  }
  return music
}

/** 배경으로 쓰는 탄푸라 음량. 0~1, 기본값 0.3에서 푸자 때 지속음과 같은 크기 */
export function setDroneVolume(v: number) {
  if (music) music.gain.value = v / 0.3
}

// 놋쇠 종: 정수배가 아닌 배음을 겹치고 각각 다른 속도로 사라지게 함
export function ringBell() {
  const c = audio()
  if (!c) return
  const out = c.createGain()
  out.gain.value = 0.32
  out.connect(sfxOut(c))
  const base = 622
  ;[
    [1, 1, 4.5],
    [1.51, 0.5, 3],
    [2.76, 0.42, 2.2],
    [4.07, 0.2, 1.3],
    [6.2, 0.1, 0.7],
  ].forEach(([ratio, level, decay]) => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.frequency.value = base * ratio
    g.gain.setValueAtTime(0, c.currentTime)
    g.gain.linearRampToValueAtTime(level, c.currentTime + 0.006)
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + decay)
    o.connect(g).connect(out)
    o.start()
    o.stop(c.currentTime + decay)
  })
}

// 불 붙일 때 나는 작은 숨소리
export function softStrike() {
  const c = audio()
  if (!c) return
  const len = c.sampleRate * 0.5
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 2
  const src = c.createBufferSource()
  const filter = c.createBiquadFilter()
  const g = c.createGain()
  src.buffer = buf
  filter.type = 'bandpass'
  filter.frequency.value = 1300
  g.gain.value = 0.14
  src.connect(filter).connect(g).connect(sfxOut(c))
  src.start()
}

export function softChime() {
  const c = audio()
  if (!c) return
  ;[784, 1175].forEach((f, i) => {
    const o = c.createOscillator()
    const g = c.createGain()
    const t = c.currentTime + i * 0.11
    o.type = 'sine'
    o.frequency.value = f
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.07, t + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.4)
    o.connect(g).connect(sfxOut(c))
    o.start(t)
    o.stop(t + 1.4)
  })
}

let tanpura: AudioBuffer | null = null

// 앱 전체의 배경 탄푸라. 스코프가 끝나면 stop을 호출해야 함.
export function startDrone() {
  const c = audio()
  if (!c) return () => {}
  if (!tanpura) {
    const samples = tanpuraLoop(c.sampleRate)
    tanpura = c.createBuffer(1, samples.length, c.sampleRate)
    tanpura.copyToChannel(samples, 0)
  }
  const src = c.createBufferSource()
  const master = c.createGain()
  src.buffer = tanpura
  src.loop = true
  master.gain.setValueAtTime(0, c.currentTime)
  master.gain.linearRampToValueAtTime(0.9, c.currentTime + 1.5)
  src.connect(master).connect(musicOut(c))
  src.start()
  return () => {
    const end = c.currentTime + 1.2
    master.gain.cancelScheduledValues(c.currentTime)
    master.gain.setValueAtTime(master.gain.value, c.currentTime)
    master.gain.linearRampToValueAtTime(0, end)
    src.stop(end)
  }
}
