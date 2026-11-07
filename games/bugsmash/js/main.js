// 벌레 박살 — 게임 흐름(메뉴 · 자유 모드 · 60초 도전 · 공포 극복 코스), 입력, 그리기
import { G, DIFF, diff } from './state.js'
import { R, pick, clamp, lerp } from './util.js'
import * as FX from './fx.js'
import { SPR, initSprites } from './fx.js'
import { SPECS, TYPES, spawn } from './bugs.js'
import { drawBug, drawShadow, drawThumb } from './art.js'
import { WEAPONS, byId, holds, stopHolds } from './weapons.js'
import { drawBg, BGS } from './bg.js'
import { audioInit, sfx, loop, stopLoops, setSound } from './audio.js'
import { MARKUP } from './ui.js'

const $ = (s) => document.querySelector(s)
const $$ = (s) => [...document.querySelectorAll(s)]

// ── 저장(이 기기에만) ──
const KEY = 'bugsmash.v1'
const save = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} } })()
save.stats = save.stats || { kills: {}, weapons: {}, total: 0, rounds: 0 }
save.best = save.best || 0
save.bestBy = save.bestBy || { 2: save.best } // 난이도별 60초 최고 기록(예전 기록은 '중')
save.course = save.course || 0
if (save.settings) Object.assign(G.settings, save.settings)
function persist() {
  save.settings = G.settings
  try { localStorage.setItem(KEY, JSON.stringify(save)) } catch { /* 저장 못 해도 게임은 된다 */ }
}

const DIFF_DESC = {
  1: '벌레가 느리고 잘 안 피해요. 근처만 쳐도 잡혀요. 점수 ×0.8',
  2: '보통 속도. 무기 범위 안에 들어오면 잡혀요.',
  3: '벌레가 훨씬 빠르고 잘 피해요. 몸통 한가운데를 정확히 맞혀야 죽어요. 빗맞으면 다치기만 해요. 점수 ×1.5',
}
const STYLE_DESC = {
  1: '동글동글 눈 달린 벌레. 잡으면 별이 튀어요. 벌레가 무섭다면 여기서 시작하세요.',
  2: '진짜 벌레 색과 모양을 단순하게. 체액은 조금만.',
  3: '윤기 나는 등껍질, 가시 돋은 다리, 튀는 체액까지. 각오하고 들어오세요.',
}
export const COURSE = [
  { title: '개미 몇 마리쯤이야', style: 1, spawn: [['ant', 10]], tip: '아주 작고 귀여운 개미부터 시작해요. 손바닥으로 톡톡 눌러 보세요.' },
  { title: '동글동글 바퀴벌레', style: 1, spawn: [['roach', 3]], tip: '눈이 커다란 바퀴벌레예요. 생각보다 빠르니까 멈췄을 때 노려요.' },
  { title: '윙윙 모기와 파리', style: 2, spawn: [['mosquito', 3], ['fly', 3]], tip: '날아다니는 벌레는 파리채(두 배로 세요)나 전기채가 좋아요.' },
  { title: '거미가 내려왔다', style: 2, spawn: [['spider', 4]], tip: '거미는 가만히 있다가 갑자기 달려요. 실에 매달려 내려오기도 해요.' },
  { title: '진짜 같은 바퀴벌레', style: 3, spawn: [['roach', 4]], tip: '이제 진짜처럼 보여요. 무서우면 왼쪽 위 일시정지를 누르세요. 화면이 흐려져요.' },
  { title: '지네 등장', style: 3, spawn: [['centipede', 2], ['spider', 2]], tip: '지네는 질겨요. 두꺼운 책이나 망치처럼 센 무기로 잡아요.' },
  { title: '바퀴벌레 대발생', style: 3, spawn: [['roach', 14], ['fly', 3]], tip: '마지막 단계예요. 화염방사기도 써 보세요. 여기까지 왔다면 이미 이긴 거예요.' },
]

// ── 화면 만들기 ──
const root = document.getElementById('app') || document.body
root.insertAdjacentHTML('beforeend', MARKUP)
const stage = $('#stage')
const cvs = { bg: $('#cv-bg'), decal: $('#cv-decal'), main: $('#cv-main'), glass: $('#cv-glass') }
for (const k in cvs) G.ctx[k] = cvs[k].getContext('2d')
initSprites()

function computeArea() {
  const W = G.W, H = G.H
  const hud = $('#hud'), dock = $('#dock')
  const top = hud.hidden ? 8 : hud.getBoundingClientRect().bottom + 4
  const bot = dock.hidden ? 8 : H - dock.getBoundingClientRect().top + 4
  G.area = { x0: 6, y0: top, x1: W - 6, y1: Math.max(top + 120, H - bot) }
}
function resize() {
  const W = stage.clientWidth || window.innerWidth, H = stage.clientHeight || window.innerHeight
  if (W === G.W && H === G.H) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const keep = {}
  for (const k of ['decal', 'glass']) {
    const cv = cvs[k]
    if (!cv.width) continue
    const t = document.createElement('canvas'); t.width = cv.width; t.height = cv.height
    t.getContext('2d').drawImage(cv, 0, 0); keep[k] = t
  }
  for (const k in cvs) {
    const cv = cvs[k]
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr)
    G.ctx[k].setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  for (const k in keep) { const c = G.ctx[k]; c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.drawImage(keep[k], 0, 0); c.restore() }
  G.W = W; G.H = H; G.dpr = dpr; G.U = Math.min(W, H) / 100
  computeArea()
  drawBg(G.settings.bg)
}
window.addEventListener('resize', resize)
resize()

// ── 무기 칸 ──
const dock = $('#dock')
for (const w of WEAPONS) {
  const b = document.createElement('button')
  b.className = 'wpn'; b.dataset.id = w.id; b.type = 'button'
  b.setAttribute('aria-label', w.name)
  const cv = document.createElement('canvas'), s = 46, d = 2
  cv.width = cv.height = s * d; cv.style.width = cv.style.height = s + 'px'
  const c = cv.getContext('2d'); c.scale(d, d); c.save(); w.icon(c, s); c.restore()
  b.append(cv)
  const l = document.createElement('span'); l.textContent = w.name; b.append(l)
  b.addEventListener('click', () => selectWeapon(w.id, true))
  dock.append(b)
}
function selectWeapon(id, announce) {
  if (G.weapon !== id) { stopHolds(); holdPid = null }
  G.weapon = id
  for (const b of $$('.wpn')) b.classList.toggle('on', b.dataset.id === id)
  if (announce) { sfx.click(); toast(`<b>${byId[id].name}</b> ${byId[id].hint}`) }
}
selectWeapon('palm')

let toastT = 0
function toast(html, ms = 2200) {
  const t = $('#toast'); t.innerHTML = html; t.hidden = false
  t.classList.remove('out'); clearTimeout(toastT)
  toastT = setTimeout(() => { t.classList.add('out'); toastT = setTimeout(() => (t.hidden = true), 300) }, ms)
}

// ── 입력 ──
let holdPid = null
const lastTap = {}
stage.addEventListener('pointerdown', (e) => {
  audioInit()
  if (G.state !== 'play') return
  e.preventDefault()
  const x = e.clientX, y = e.clientY
  G.pointer.x = x; G.pointer.y = y; G.pointer.has = true
  const w = byId[G.weapon]
  if (w.kind === 'tap') {
    if (G.t - (lastTap[w.id] ?? -9) < w.cd) return
    lastTap[w.id] = G.t
    G.fxs.push(w.make(x, y, e.pointerId))
  } else if (holdPid == null) {
    holdPid = e.pointerId; w.obj.down(x, y)
    save.stats.weapons[w.id] = (save.stats.weapons[w.id] || 0) + 1
  }
  try { stage.setPointerCapture(e.pointerId) } catch { /* 무시 */ }
})
stage.addEventListener('pointermove', (e) => {
  G.pointer.x = e.clientX; G.pointer.y = e.clientY; G.pointer.has = true
  if (e.pointerId === holdPid && G.state === 'play') byId[G.weapon].obj?.move(e.clientX, e.clientY)
})
const endPointer = (e) => {
  if (e.pointerId === holdPid) { byId[G.weapon].obj?.up(); holdPid = null }
  for (const f of G.fxs) if (f.pid === e.pointerId && f.release) f.release()
  if (e.pointerType !== 'mouse') G.pointer.has = false
}
stage.addEventListener('pointerup', endPointer)
stage.addEventListener('pointercancel', endPointer)
stage.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') G.pointer.has = false })
stage.addEventListener('contextmenu', (e) => e.preventDefault())
document.addEventListener('keydown', (e) => {
  if (G.state === 'play') {
    const i = Number(e.key) - 1
    if (i >= 0 && i < WEAPONS.length) selectWeapon(WEAPONS[i].id, true)
    if (e.key === 'Escape' || e.key === 'p') pause()
  } else if (G.state === 'paused' && (e.key === 'Escape' || e.key === 'p')) resume()
})

// ── 타격 판정 ──
G.strike = (h) => {
  const killed = [], hit = []
  let air = 0
  const list = h.only ? [h.only] : G.bugs
  for (const b of list) {
    if (b.state !== 'alive') continue
    if (!h.only && !b.inShape(h)) continue
    if (!h.air && b.z > 0.3) { air++; continue }
    hit.push(b)
    let dmg = h.dmg * (h.airBonus && b.spec.flyer ? h.airBonus : 1), hh = h
    // 상: 몸통 한가운데를 정확히 맞혀야 죽는다. 빗맞으면 힘이 1/4만 들어가 다치기만 한다
    if (diff().precise && !h.only && b.coreDist(h) > (h.w ? 0 : b.coreR())) { dmg *= 0.25; hh = { ...h, graze: true } }
    if (b.damage(dmg, h.kind || 'squish', Math.atan2(b.y - h.y, b.x - h.x), hh)) killed.push(b)
  }
  if (!h.only && G.state === 'play') {
    G.swings++; if (hit.length) G.hits++
    save.stats.weapons[h.wpn] = (save.stats.weapons[h.wpn] || 0) + 1
  }
  if (h.mesh) for (const b of killed) FX.meshPrint(b.x, b.y, h.mesh, R(-0.3, 0.3), b.goo())
  if (h.kind !== 'zap') {
    const rad = (h.r || Math.max(h.w, h.h) / 2) * 3 + 90
    for (const b of G.bugs) if (b.state === 'alive' && !hit.includes(b) && Math.hypot(b.x - h.x, b.y - h.y) < rad) b.scare(h.x, h.y)
  }
  if (killed.length >= 2) {
    const words = { 2: '더블!', 3: '트리플!', 4: '쿼드라!' }
    FX.pop(words[killed.length] || `${killed.length}마리 싹쓸이!`, h.x, h.y - 90, '#ff7a3d', 1.1, 0.9)
    G.score += killed.length * 20
  }
  return { killed, hit, air }
}
G.warn = (x, y, r) => {
  for (const b of G.bugs) if (b.state === 'alive' && Math.hypot(b.x - x, b.y - y) < r + b.pad + 40) b.warn(x, y)
}
G.onKill = (b, kind, h) => {
  // 처치 소리
  if (kind === 'squish') {
    if (b.style === 1) sfx.boing(b.x)
    else if (b.type === 'mosquito' || b.type === 'ant') sfx.pop(b.x)
    else { sfx.squish(b.x); if (b.type !== 'fly') sfx.crunch(b.x, 5, 0.45) }
    if (b.type === 'mosquito' && b.fed && b.style > 1) FX.pop('내 피…!', b.x, b.y + 34, '#ff6b6b', 0.6, 0.9)
  }
  if (G.state !== 'play') return
  G.kills++
  G.killsBy[b.type] = (G.killsBy[b.type] || 0) + 1
  G.combo = G.t - G.lastKill < 1.4 ? G.combo + 1 : 1
  G.lastKill = G.t
  G.bestCombo = Math.max(G.bestCombo, G.combo)
  const pts = Math.round(b.spec.score * (1 + Math.min(3, (G.combo - 1) * 0.25)) * diff().score)
  G.score += pts
  FX.pop('+' + pts, b.x + 30, b.y - 14, '#ffe14d', 0.5, 0.7)
  if (G.combo >= 3) FX.pop(`${G.combo} 콤보!`, G.W / 2, G.area.y0 + 50, '#ff9a3d', 0.75, 0.8)
  save.stats.kills[b.type] = (save.stats.kills[b.type] || 0) + 1
  save.stats.total = (save.stats.total || 0) + 1
  hud()
}
G.onEscape = (b) => {
  if (G.state !== 'play' || G.mode !== 'challenge') return
  G.missed++
  FX.pop(`${SPECS[b.type].name} 도망갔다!`, clamp(b.x, 80, G.W - 80), clamp(b.y, G.area.y0 + 40, G.area.y1 - 40), '#ff6b5b', 0.6, 0.9)
  hud()
}

/** 불과 살충제 안개에 닿은 벌레 */
function hazards(dt) {
  if (!G.fire.length && !G.mist.length && !G.grounds.length) return
  for (const b of G.bugs) {
    if (b.state !== 'alive') continue
    let heat = 0, tox = 0
    for (const p of G.fire) {
      if (p.age < 0.05) continue
      const dx = p.x - b.x, dy = p.y - b.y, r = p.r * 0.7 + b.pad * 0.6
      if (dx * dx + dy * dy < r * r && ++heat > 6) break
    }
    for (const g of G.grounds) if (Math.hypot(g.x - b.x, g.y - b.y) < g.r + b.pad * 0.5) heat += 3
    for (const m of G.mist) {
      const dx = m.x - b.x, dy = m.y - b.y, r = m.r + b.pad * 0.5
      if (dx * dx + dy * dy < r * r) { tox += 1 - m.age / m.life; if (tox > 8) break }
    }
    const k = diff().haz
    if (heat) b.burn += (dt * Math.min(heat, 6) * 0.35 * k) / b.spec.resist
    if (tox) b.poison += (dt * Math.min(tox, 8) * 0.16 * k) / b.spec.resist
  }
}

// ── 모드 ──
const WEIGHTS = { roach: 3, fly: 2, mosquito: 2, spider: 1.4, ant: 1, centipede: 0.6 }
function pickType(w = WEIGHTS) {
  let s = 0; for (const k in w) s += w[k]
  let r = Math.random() * s
  for (const k in w) { r -= w[k]; if (r <= 0) return k }
  return 'roach'
}
const alive = () => G.bugs.filter((b) => b.state === 'alive').length
let spawnT = 0, timeLeft = 0, queue = [], clearing = false, clearT = 0, stageIdx = 0

const MODES = {
  free: {
    title: '자유 모드',
    start() { for (let i = 0; i < 6; i++) setTimeout(() => G.state === 'play' && G.mode === 'free' && spawnOne(pickType()), i * 350) },
    tick(dt) {
      if (!G.settings.auto) return
      spawnT -= dt
      if (spawnT <= 0 && alive() < 8) { spawnT = R(0.8, 1.8); spawnOne(pickType()) }
    },
    main: () => `${G.kills}마리 처치`,
  },
  challenge: {
    title: '60초 도전',
    start() { timeLeft = 60; spawnT = 0.3; for (const t of ['roach', 'fly', 'roach']) spawnOne(t, { life: R(7, 12) }) },
    tick(dt) {
      timeLeft -= dt
      const e = 60 - timeLeft
      spawnT -= dt
      if (spawnT <= 0 && alive() < 24) {
        spawnT = lerp(1.5, 0.5, e / 60)
        const w = { ...WEIGHTS, centipede: e > 20 ? 0.8 : 0, ant: e > 10 ? 1 : 0 }
        spawnOne(pickType(w), { life: R(7, 12), speedMul: 1 + e / 120 })
      }
      if (Math.ceil(timeLeft) !== Math.ceil(timeLeft + dt)) {
        hud()
        if (timeLeft <= 5.5 && timeLeft > 0) sfx.click()
      }
      if (timeLeft <= 0) finishChallenge()
    },
    main: () => `${Math.max(0, Math.ceil(timeLeft))}초`,
  },
  course: {
    title: '공포 극복',
    start(i) {
      stageIdx = i; clearing = false; clearT = 0; queue = []
      let d = 0.4
      for (const [type, n] of COURSE[i].spawn) {
        if (type === 'ant') { queue.push({ type, n, at: d }); d += 0.6 }
        else for (let k = 0; k < n; k++) { queue.push({ type, n: 1, at: d }); d += 0.55 }
      }
      spawnT = 0
    },
    tick(dt) {
      spawnT += dt
      while (queue.length && queue[0].at <= spawnT) { const q = queue.shift(); spawn(q.type, q.n, { style: COURSE[stageIdx].style, dangleChance: 0.6 }) }
      // 마지막 벌레가 죽고 1초쯤 뒤에 완료(일시정지 중에는 시간이 멈춘다)
      if (!queue.length && !clearing && G.bugs.every((b) => b.state !== 'alive')) {
        clearT += dt
        if (clearT > 1.1) { clearing = true; stageClear() }
      } else clearT = 0
    },
    main: () => `${stageIdx + 1}단계 · 남은 벌레 ${alive() + queue.reduce((s, q) => s + q.n, 0)}`,
  },
}
function spawnOne(type, opts = {}) {
  if (type === 'ant') return spawn('ant', Math.round(R(6, 10)), opts)
  return spawn(type, 1, opts)
}

function hud() {
  $('#h-mode').textContent = `${G.mode === 'course' ? COURSE[stageIdx].title : MODES[G.mode].title} · 난이도 ${diff().name}`
  $('#h-main').textContent = MODES[G.mode].main()
  $('#h-score').textContent = G.score.toLocaleString('ko-KR')
}

// ── 화면 전환 ──
function show(id) {
  for (const s of $$('.screen')) s.hidden = s.id !== id
}
function setPlayUI(on) {
  $('#hud').hidden = !on
  $('#dock').hidden = !on
  $('#tools').hidden = !(on && G.mode === 'free')
  computeArea()
}
function resetField(wipe) {
  G.bugs = []; G.parts = []; G.fire = []; G.mist = []; G.fxs = []; G.pops = []; G.grounds = []; G.arcs = []
  stopHolds(); holdPid = null
  if (wipe) {
    G.ctx.decal.clearRect(0, 0, G.W, G.H)
    G.ctx.glass.clearRect(0, 0, G.W, G.H)
  }
}
function startGame(mode, si = 0) {
  audioInit()
  resetField(true)
  G.mode = mode
  G.style = mode === 'course' ? COURSE[si].style : G.settings.style
  Object.assign(G, { score: 0, combo: 0, lastKill: -9, bestCombo: 0, kills: 0, swings: 0, hits: 0, missed: 0, killsBy: {} })
  show(null)
  stage.classList.remove('blur')
  setPlayUI(true)
  drawBg(G.settings.bg)
  G.state = 'play'
  MODES[mode].start(si)
  hud()
  toast(mode === 'free' ? '아래에서 무기를 골라 벌레를 눌러요. 숫자키 1~9로도 바꿀 수 있어요.' : mode === 'challenge' ? '60초 동안 최대한 많이! 오래 두면 도망가요.' : COURSE[si].tip, 2600)
}
function toMenu() {
  G.state = 'menu'
  stopLoops()
  resetField(true)
  stage.classList.remove('blur')
  setPlayUI(false)
  G.style = G.settings.style
  drawBg(G.settings.bg)
  renderMenu()
  show('s-menu')
  persist()
}
function pause() {
  if (G.state !== 'play') return
  G.state = 'paused'
  stopHolds(); holdPid = null; stopLoops()
  stage.classList.add('blur')
  show('s-pause')
}
function resume() {
  if (G.state !== 'paused') return
  stage.classList.remove('blur')
  show(null)
  G.state = 'play'
}
function finishChallenge() {
  G.state = 'result'
  stopHolds(); stopLoops()
  const dv = G.settings.diff, prev = save.bestBy[dv] || 0
  const best = G.score > prev
  if (best) save.bestBy[dv] = G.score
  save.best = Math.max(save.best, G.score)
  save.stats.rounds = (save.stats.rounds || 0) + 1
  persist()
  const grade = G.score >= 2600 ? 'S' : G.score >= 1700 ? 'A' : G.score >= 950 ? 'B' : 'C'
  const relief = clamp(Math.round(35 + G.kills * 1.6 + G.bestCombo * 2.5 - G.missed * 1.5), 5, 100)
  const acc = G.swings ? Math.round((G.hits / G.swings) * 100) : 0
  $('#r-grade').textContent = grade
  $('#r-score').textContent = G.score.toLocaleString('ko-KR')
  $('#r-best').textContent = best ? '새 최고 기록!' : `최고 기록 ${prev.toLocaleString('ko-KR')}점`
  $('#r-best').classList.toggle('new', best)
  $('#r-stats').innerHTML = [
    ['잡은 벌레', `${G.kills}마리`], ['최대 콤보', `${G.bestCombo}`], ['명중률', `${acc}%`], ['도망간 벌레', `${G.missed}마리`],
  ].map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')
  $('#r-relief').style.setProperty('--v', relief + '%')
  $('#r-relief-v').textContent = relief + '%'
  sfx.fanfare()
  setTimeout(() => show('s-result'), 500)
}
function stageClear() {
  if (G.state !== 'play' || G.mode !== 'course') return
  G.state = 'result'
  stopHolds(); stopLoops()
  save.course = Math.max(save.course, stageIdx + 1)
  persist()
  sfx.fanfare()
  const last = stageIdx === COURSE.length - 1
  $('#c-step').textContent = `${stageIdx + 1}단계 완료`
  $('#c-title').textContent = last ? '공포 극복 코스를 끝냈어요!' : '해냈어요!'
  $('#c-msg').textContent = last
    ? '귀여운 개미에서 시작해 진짜 같은 바퀴벌레 떼까지 잡았어요. 이제 벌레는 당신을 무서워할 거예요.'
    : `${G.kills}마리를 잡았어요. 다음은 「${COURSE[stageIdx + 1].title}」. 조금 더 진짜 같아져요. 숨 한 번 크게 쉬고 가요.`
  $('#c-next').hidden = last
  show('s-clear')
}
function openIntro(i) {
  stageIdx = i
  const s = COURSE[i]
  $('#i-step').textContent = `${i + 1}단계 / ${COURSE.length}`
  $('#i-title').textContent = s.title
  $('#i-tip').textContent = s.tip
  $('#i-look').textContent = ['', '귀여움', '만화', '리얼'][s.style]
  const box = $('#i-bugs'); box.innerHTML = ''
  for (const [type, n] of s.spawn) box.append(thumbChip(type, s.style, `${SPECS[type].name} ${n}`))
  show('s-intro')
}

// ── 그림 썸네일 ──
function thumb(type, style, size = 56) {
  const cv = document.createElement('canvas'), d = 2
  cv.width = cv.height = size * d; cv.style.width = cv.style.height = size + 'px'
  const c = cv.getContext('2d'); c.scale(d, d)
  const b = { type, style }
  drawThumb(c, b.type, b.style, size)
  return cv
}
function thumbChip(type, style, label) {
  const el = document.createElement('div'); el.className = 'chip'
  el.append(thumb(type, style, 44))
  const s = document.createElement('span'); s.textContent = label; el.append(s)
  return el
}

// ── 메뉴 ──
function renderMenu() {
  $('#m-best').textContent = `${(save.bestBy[G.settings.diff] || 0).toLocaleString('ko-KR')}점(${diff().name})`
  for (const b of $$('#seg-diff button')) b.setAttribute('aria-pressed', String(Number(b.dataset.v) === G.settings.diff))
  $('#diff-desc').textContent = DIFF_DESC[G.settings.diff]
  $('#m-course').textContent = `${Math.min(save.course, COURSE.length)}/${COURSE.length}`
  for (const b of $$('#seg-style button')) b.setAttribute('aria-pressed', String(Number(b.dataset.v) === G.settings.style))
  for (const b of $$('#seg-bg button')) b.setAttribute('aria-pressed', String(b.dataset.v === G.settings.bg))
  $('#style-desc').textContent = STYLE_DESC[G.settings.style]
  $('#b-sound').setAttribute('aria-pressed', String(G.settings.sound))
  $('#b-sound').textContent = G.settings.sound ? '소리 켬' : '소리 끔'
  $('#b-vibe').setAttribute('aria-pressed', String(G.settings.vibe))
  $('#b-vibe').textContent = G.settings.vibe ? '진동 켬' : '진동 끔'
  const st = G.settings.style
  for (const [sel, type] of [['#t-free', 'roach'], ['#t-chal', 'fly'], ['#t-course', 'spider']]) { const el = $(sel); el.innerHTML = ''; el.append(thumb(type, st, 52)) }
  for (const b of $$('#seg-style button')) { const t = b.querySelector('.st'); t.innerHTML = ''; t.append(thumb('roach', Number(b.dataset.v), 34)) }
}
$$('[data-mode]').forEach((b) => b.addEventListener('click', () => {
  audioInit(); sfx.click()
  if (b.dataset.mode === 'course') { renderCourse(); show('s-course') } else startGame(b.dataset.mode)
}))
$$('#seg-diff button').forEach((b) => b.addEventListener('click', () => {
  G.settings.diff = Number(b.dataset.v)
  persist(); renderMenu(); audioInit(); sfx.click()
}))
$$('#seg-style button').forEach((b) => b.addEventListener('click', () => {
  G.settings.style = Number(b.dataset.v); G.style = G.settings.style
  for (const bug of G.bugs) bug.style = G.style
  persist(); renderMenu(); audioInit(); sfx.click()
}))
$$('#seg-bg button').forEach((b) => b.addEventListener('click', () => {
  G.settings.bg = b.dataset.v; persist(); drawBg(G.settings.bg); renderMenu(); audioInit(); sfx.click()
}))
$('#b-sound').addEventListener('click', () => { G.settings.sound = !G.settings.sound; audioInit(); setSound(G.settings.sound); persist(); renderMenu(); sfx.click() })
$('#b-vibe').addEventListener('click', () => { G.settings.vibe = !G.settings.vibe; persist(); renderMenu(); sfx.click() })
$('#b-records').addEventListener('click', () => { renderRecords(); show('s-records'); sfx.click() })
$$('[data-back]').forEach((b) => b.addEventListener('click', () => { sfx.click(); show('s-menu') }))

function renderCourse() {
  const list = $('#course-list'); list.innerHTML = ''
  COURSE.forEach((s, i) => {
    const locked = i > save.course
    const b = document.createElement('button')
    b.className = 'stage'; b.type = 'button'; b.disabled = locked
    b.innerHTML = `<span class="no">${i + 1}</span><span class="tt"><b>${s.title}</b><small>${['', '귀여움', '만화', '리얼'][s.style]} · ${s.spawn.map(([t, n]) => SPECS[t].name + ' ' + n).join(', ')}</small></span><span class="st">${i < save.course ? '완료' : locked ? '잠김' : '도전'}</span>`
    b.prepend(thumb(s.spawn[0][0], s.style, 40))
    b.addEventListener('click', () => { sfx.click(); openIntro(i) })
    list.append(b)
  })
}
function renderRecords() {
  const s = save.stats, box = $('#rec-list'); box.innerHTML = ''
  for (const t of TYPES) {
    const row = document.createElement('div'); row.className = 'rec'
    row.append(thumb(t, G.settings.style, 40))
    row.insertAdjacentHTML('beforeend', `<span>${SPECS[t].name}</span><b>${(s.kills[t] || 0).toLocaleString('ko-KR')}</b>`)
    box.append(row)
  }
  $('#rec-total').textContent = (s.total || 0).toLocaleString('ko-KR')
  const fav = Object.entries(s.weapons || {}).filter(([k]) => byId[k]).sort((a, b) => b[1] - a[1])[0]
  $('#rec-fav').textContent = fav ? byId[fav[0]].name : '아직 없음'
  $('#rec-best').textContent = [1, 2, 3].map((d) => `${DIFF[d].name} ${(save.bestBy[d] || 0).toLocaleString('ko-KR')}`).join(' · ')
  $('#rec-course').textContent = `${Math.min(save.course, COURSE.length)}/${COURSE.length}단계`
}

// 일시정지 · 결과 · 코스 버튼
$('#b-pause').addEventListener('click', () => { sfx.click(); pause() })
$('#p-resume').addEventListener('click', () => { sfx.click(); resume() })
$('#p-restart').addEventListener('click', () => { sfx.click(); startGame(G.mode, stageIdx) })
$('#p-menu').addEventListener('click', () => { sfx.click(); toMenu() })
$('#r-again').addEventListener('click', () => startGame('challenge'))
$('#r-menu').addEventListener('click', toMenu)
$('#i-start').addEventListener('click', () => startGame('course', stageIdx))
$('#i-back').addEventListener('click', () => { renderCourse(); show('s-course') })
$('#c-next').addEventListener('click', () => openIntro(stageIdx + 1))
$('#c-again').addEventListener('click', () => startGame('course', stageIdx))
$('#c-menu').addEventListener('click', toMenu)

// 자유 모드 도구
const fade = (cv, ctx) => {
  cv.classList.add('wipe')
  setTimeout(() => { ctx.clearRect(0, 0, G.W, G.H); cv.classList.remove('wipe') }, 450)
}
$('#b-clean').addEventListener('click', () => { sfx.swish(null, 0.3); fade(cvs.decal, G.ctx.decal); toast('바닥을 싹 닦았어요.', 1200) })
$('#b-glass').addEventListener('click', () => { sfx.click(); fade(cvs.glass, G.ctx.glass); toast('화면 유리를 새로 갈았어요.', 1200) })
$('#b-summon').addEventListener('click', () => {
  sfx.click()
  const sheet = $('#summon')
  if (!sheet.hidden) { sheet.hidden = true; return }
  const box = $('#sum-list'); box.innerHTML = ''
  for (const t of TYPES) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'sum'
    b.append(thumb(t, G.style, 44))
    b.insertAdjacentHTML('beforeend', `<span>${SPECS[t].name}</span><small>${t === 'ant' ? '+줄 하나' : '+1'}</small>`)
    b.addEventListener('click', () => { spawnOne(t); sfx.click() })
    box.append(b)
  }
  $('#sum-auto').checked = G.settings.auto
  sheet.hidden = false
})
$('#sum-swarm').addEventListener('click', () => {
  for (let i = 0; i < 12; i++) setTimeout(() => G.state === 'play' && spawn('roach', 1), i * 90)
  toast('바퀴벌레 떼가 몰려와요!', 1400); sfx.whistle()
  $('#summon').hidden = true
})
$('#sum-auto').addEventListener('change', (e) => { G.settings.auto = e.target.checked; persist() })
$('#sum-close').addEventListener('click', () => { $('#summon').hidden = true })

document.addEventListener('visibilitychange', () => { if (document.hidden) pause() })

// ── 앱 설치(PWA) ──
let installEvt = null
window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); installEvt = e; $('#b-install').hidden = false })
$('#b-install').addEventListener('click', async () => {
  if (installEvt) { installEvt.prompt(); try { await installEvt.userChoice } catch { /* 무시 */ } installEvt = null; $('#b-install').hidden = true }
})
const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.navigator.standalone
if (ios) $('#ios-hint').hidden = false
if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
  navigator.serviceWorker.register('./sw.js').catch(() => { /* 미리보기 등에서는 안 될 수 있다 */ })
}

// ── 메뉴 뒤에서 기어 다니는 벌레(구경용) ──
function attract(dt) {
  spawnT -= dt
  if (spawnT <= 0 && alive() < 5) { spawnT = R(1, 2.5); spawnOne(pick(['roach', 'roach', 'fly', 'spider', 'mosquito', 'ant', 'centipede'])) }
}

// ── 매 프레임 ──
function update(dt) {
  if (G.state === 'play') MODES[G.mode].tick(dt)
  else attract(dt)
  for (const h of holds) h.update(dt)
  G.fxs = G.fxs.filter((f) => f.update(dt))
  hazards(dt)
  for (const b of G.bugs) b.update(dt)
  G.bugs = G.bugs.filter((b) => b.state === 'alive' || b.state === 'dying')
  FX.update(dt)
  G.flash = Math.max(0, G.flash - dt * 2.5)
  G.shake = Math.min(30, G.shake) * Math.exp(-dt * 12)
  // 윙~ 소리: 날고 있는 모기·파리 수만큼
  if (G.state === 'play' || G.state === 'menu') {
    let m = 0, f = 0, mx = 0, fx = 0
    for (const b of G.bugs) if (b.state === 'alive' && b.z > 0.2) { if (b.type === 'mosquito') { m++; mx += b.x } else if (b.type === 'fly') { f++; fx += b.x } }
    const k = G.state === 'menu' ? 0.35 : 1
    loop('mosq', Math.min(1, m * 0.45) * k, m ? mx / m : null)
    loop('fly', Math.min(1, f * 0.4) * k, f ? fx / f : null)
  }
}
function bugOpts(b) {
  if (b.state === 'dying') {
    if (b.dk === 'poison') return { belly: true, tw: b.tw }
    return { char: b.charred }
  }
  if (b.mode === 'hop') return { wings: true }
  return {}
}
let shaking = false
function render() {
  const c = G.ctx.main
  c.clearRect(0, 0, G.W, G.H)
  c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 1
  for (const b of G.bugs) if (b.mode === 'dangle' && b.state === 'alive') { c.beginPath(); c.moveTo(b.x, -10); c.lineTo(b.x, b.y - b.len * 0.15); c.stroke() }
  for (const b of G.bugs) drawShadow(c, b, SPR.shadow)
  for (const b of G.bugs) if (b.z <= 0.05) drawBug(c, b, bugOpts(b))
  for (const b of G.bugs) if (b.z > 0.05) drawBug(c, b, bugOpts(b))
  FX.drawNormal(c)
  FX.drawAdditive(c)
  for (const f of G.fxs) f.draw(c)
  for (const h of holds) h.draw(c)
  FX.drawPops(c)
  if (G.flash > 0.01) { c.fillStyle = `rgba(255,255,255,${G.flash})`; c.fillRect(0, 0, G.W, G.H) }
  if (G.shake > 0.4) { stage.style.transform = `translate(${R(-1, 1) * G.shake}px,${R(-1, 1) * G.shake}px)`; shaking = true }
  else if (shaking) { stage.style.transform = ''; shaking = false }
}
let last = performance.now()
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000)
  last = now
  resize()
  if (G.state === 'play' || G.state === 'menu') { G.t += dt; update(dt) }
  render()
  requestAnimationFrame(frame)
}
toMenu()
requestAnimationFrame(frame)

// 디버그·테스트용(콘솔에서 상태 확인)
window.__bugsmash = { G, startGame, toMenu, spawn, selectWeapon, endSoon: () => { timeLeft = 0.2 } }
