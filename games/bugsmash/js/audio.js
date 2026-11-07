// 소리는 전부 Web Audio로 합성한다(음원 파일 없음 → 오프라인에서도 가볍게).
import { G } from './state.js'
import { R } from './util.js'

let ac = null, out = null, noiseBuf = null
const loops = {}

export function audioInit() {
  if (ac) { if (ac.state === 'suspended') ac.resume(); return }
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return
  ac = new AC()
  const comp = ac.createDynamicsCompressor()
  comp.threshold.value = -16; comp.knee.value = 10; comp.ratio.value = 5
  out = ac.createGain()
  out.gain.value = G.settings.sound ? 0.9 : 0
  out.connect(comp); comp.connect(ac.destination)
  noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate)
  const d = noiseBuf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
}

export function setSound(on) {
  if (out) out.gain.setTargetAtTime(on ? 0.9 : 0, ac.currentTime, 0.03)
}

const ok = () => ac && ac.state === 'running' && G.settings.sound
const panOf = (x) => (x == null || !G.W ? 0 : Math.max(-1, Math.min(1, (x / G.W) * 2 - 1)) * 0.6)

function dest(pan) {
  if (pan && ac.createStereoPanner) {
    const p = ac.createStereoPanner(); p.pan.value = pan; p.connect(out); return p
  }
  return out
}

function noise({ t = 0, dur = 0.1, type = 'bandpass', f = 1000, f2, q = 1, gain = 0.5, attack = 0.002, x }) {
  const now = ac.currentTime + t
  const src = ac.createBufferSource(); src.buffer = noiseBuf
  const fl = ac.createBiquadFilter(); fl.type = type; fl.Q.value = q
  fl.frequency.setValueAtTime(f, now)
  if (f2) fl.frequency.exponentialRampToValueAtTime(f2, now + dur)
  const g = ac.createGain()
  g.gain.setValueAtTime(0.0001, now)
  g.gain.exponentialRampToValueAtTime(gain, now + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
  src.connect(fl); fl.connect(g); g.connect(dest(panOf(x)))
  src.start(now, Math.random() * 1.5); src.stop(now + dur + 0.05)
}

function tone({ t = 0, dur = 0.1, type = 'sine', f = 200, f2, gain = 0.5, attack = 0.003, x }) {
  const now = ac.currentTime + t
  const o = ac.createOscillator(); o.type = type
  o.frequency.setValueAtTime(f, now)
  if (f2) o.frequency.exponentialRampToValueAtTime(f2, now + dur)
  const g = ac.createGain()
  g.gain.setValueAtTime(0.0001, now)
  g.gain.exponentialRampToValueAtTime(gain, now + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur)
  o.connect(g); g.connect(dest(panOf(x)))
  o.start(now); o.stop(now + dur + 0.05)
}

const S = {
  slap(x) {
    noise({ dur: 0.09, type: 'highpass', f: 900, gain: 0.9, x })
    noise({ dur: 0.04, f: 2600, q: 0.8, gain: 0.5, x })
    tone({ dur: 0.08, f: 180, f2: 60, gain: 0.6, x })
  },
  swish(x, g = 0.25) { noise({ dur: 0.13, f: 500, f2: 2600, q: 1.3, gain: g, attack: 0.06, x }) },
  throwing(x) { noise({ dur: 0.28, f: 400, f2: 1800, q: 1.6, gain: 0.25, attack: 0.15, x }) },
  thwack(x) {
    noise({ dur: 0.05, f: 3200, q: 1.5, gain: 0.8, x })
    tone({ dur: 0.03, type: 'triangle', f: 900, f2: 300, gain: 0.2, x })
    tone({ dur: 0.07, f: 140, f2: 70, gain: 0.35, x })
  },
  zap(x) {
    for (let i = 0; i < 5; i++) noise({ t: i * 0.018 + R(0.01), dur: 0.03, type: 'highpass', f: 2500, gain: 0.6, x })
    tone({ dur: 0.14, type: 'square', f: 110, gain: 0.12, x })
    tone({ dur: 0.1, type: 'sawtooth', f: 2200, f2: 300, gain: 0.08, x })
    noise({ dur: 0.05, type: 'lowpass', f: 1400, gain: 0.9, x })
  },
  thud(x) {
    tone({ dur: 0.38, f: 95, f2: 36, gain: 1, x })
    noise({ dur: 0.28, type: 'lowpass', f: 420, gain: 0.8, x })
    noise({ dur: 0.05, f: 1900, q: 0.7, gain: 0.45, x })
  },
  glass(x) {
    noise({ dur: 0.14, type: 'highpass', f: 1800, gain: 1, x })
    tone({ dur: 0.22, f: 120, f2: 45, gain: 0.8, x })
    for (let i = 0; i < 16; i++) tone({ t: R(0.02, 0.55), dur: R(0.05, 0.25), f: R(2600, 7500), gain: R(0.03, 0.1), x })
    noise({ t: 0.04, dur: 0.45, type: 'highpass', f: 5200, gain: 0.14, x })
  },
  stomp(x) {
    tone({ dur: 0.26, f: 75, f2: 34, gain: 0.9, x })
    noise({ dur: 0.16, type: 'lowpass', f: 650, gain: 0.6, x })
  },
  crunch(x, n = 6, g = 0.5) {
    let t = 0
    for (let i = 0; i < n; i++) { noise({ t, dur: 0.022, f: R(1500, 4200), q: 3, gain: g, x }); t += R(0.01, 0.03) }
  },
  squish(x) {
    noise({ dur: 0.13, f: 1500, f2: 300, q: 2, gain: 0.5, x })
    tone({ dur: 0.06, f: 300, f2: 80, gain: 0.25, x })
  },
  pop(x) {
    tone({ dur: 0.05, f: 900, f2: 200, gain: 0.3, x })
    noise({ dur: 0.03, f: 2200, gain: 0.25, x })
  },
  boing(x) { // 귀여움 모드 처치음
    tone({ dur: 0.16, type: 'triangle', f: 520, f2: 1300, gain: 0.25, x })
    tone({ t: 0.05, dur: 0.12, type: 'sine', f: 1500, f2: 2200, gain: 0.12, x })
  },
  sizzle(x) { noise({ dur: 0.5, type: 'highpass', f: 4200, gain: 0.16, attack: 0.02, x }) },
  crackle(x) { noise({ dur: 0.016, type: 'highpass', f: 2500, gain: R(0.08, 0.28), x }) },
  click() { tone({ dur: 0.04, type: 'triangle', f: 640, gain: 0.12 }) },
  fanfare() {
    [523, 659, 784, 1046].forEach((f, i) => tone({ t: i * 0.11, dur: 0.22, type: 'triangle', f, gain: 0.2 }))
  },
  whistle() { tone({ dur: 0.35, type: 'sine', f: 1200, f2: 500, gain: 0.12 }) },
  heartbeat() { // 보스가 있을 때 낮게 쿵-쿵
    tone({ dur: 0.18, f: 62, f2: 40, gain: 0.55 })
    tone({ t: 0.2, dur: 0.16, f: 55, f2: 38, gain: 0.4 })
  },
}

/** 효과음: 소리가 꺼졌거나 아직 사용자가 화면을 안 눌렀으면 조용히 넘어간다 */
export const sfx = new Proxy(S, {
  get(target, k) { return (...a) => { if (ok()) try { target[k](...a) } catch { /* 무시 */ } } },
})

// ── 계속 나는 소리(살충제 칙~, 화염 화르륵, 모기 윙~) ──
function noiseSrc() {
  const s = ac.createBufferSource(); s.buffer = noiseBuf; s.loop = true; s.start(); return s
}
function build(name) {
  const g = ac.createGain(); g.gain.value = 0; g.connect(out)
  if (name === 'hiss') {
    const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2600
    noiseSrc().connect(f); f.connect(g)
  } else if (name === 'flame') {
    const a = ac.createBiquadFilter(); a.type = 'lowpass'; a.frequency.value = 750
    const b = ac.createBiquadFilter(); b.type = 'bandpass'; b.frequency.value = 160; b.Q.value = 0.7
    const gb = ac.createGain(); gb.gain.value = 2.2
    noiseSrc().connect(a); a.connect(g)
    noiseSrc().connect(b); b.connect(gb); gb.connect(g)
  } else if (name === 'hum') {
    const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = 100
    const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 450
    o.connect(f); f.connect(g); o.start()
  } else if (name === 'mosq' || name === 'fly') {
    const o = ac.createOscillator(); o.type = 'sawtooth'; o.frequency.value = name === 'mosq' ? 580 : 190
    const lfo = ac.createOscillator(); lfo.frequency.value = name === 'mosq' ? 7 : 11
    const lg = ac.createGain(); lg.gain.value = name === 'mosq' ? 28 : 16
    lfo.connect(lg); lg.connect(o.frequency); lfo.start()
    const f = ac.createBiquadFilter()
    f.type = name === 'mosq' ? 'bandpass' : 'lowpass'; f.frequency.value = name === 'mosq' ? 1100 : 650; f.Q.value = 1.4
    let node = g
    if (ac.createStereoPanner) { const p = ac.createStereoPanner(); p.connect(g); node = p; loops[name + 'Pan'] = p }
    o.connect(f); f.connect(node); o.start()
    loops[name + 'Osc'] = o
  }
  return g
}
/** 지속음 크기를 0~1로 맞춘다 */
export function loop(name, level, x) {
  if (!ac || ac.state !== 'running') return
  if (!loops[name]) { if (level <= 0) return; loops[name] = build(name) }
  const max = { hiss: 0.22, flame: 0.5, hum: 0.05, mosq: 0.06, fly: 0.07 }[name]
  loops[name].gain.setTargetAtTime(G.settings.sound ? level * max : 0, ac.currentTime, 0.06)
  const p = loops[name + 'Pan']
  if (p && x != null) p.pan.setTargetAtTime(panOf(x), ac.currentTime, 0.1)
  const o = loops[name + 'Osc']
  if (o) o.detune.setTargetAtTime(R(-60, 60), ac.currentTime, 0.2)
}
export function stopLoops() { for (const k of ['hiss', 'flame', 'hum', 'mosq', 'fly']) loop(k, 0) }

export function vib(p) {
  if (!G.settings.vibe || !navigator.vibrate) return
  try { navigator.vibrate(p) } catch { /* 무시 */ }
}
