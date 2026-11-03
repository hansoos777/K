import { useSyncExternalStore } from 'react'

/**
 * 1단계는 서버 없이 이 기기의 localStorage에만 저장한다 (PujaTime과 같은 방식).
 * 2단계에서 로그인이 붙으면 같은 모양의 데이터를 서버와 동기화한다.
 * 고해소 관련 내용, 기도 지향 같은 민감한 글은 이 저장소에도 넣지 않는다.
 */
export type Lang = 'ko' | 'en'
export type Quality = 'auto' | 'low' | 'high'

export interface Visit { id: string; at: number }
export interface PrayerNote { id: string; text: string; at: number }

export interface State {
  v: 1
  lang: Lang
  nickname: string
  sound: boolean
  volume: number // 0..1
  reduceMotion: boolean
  quality: Quality
  largeText: boolean
  favorites: string[] // "world/place"
  visits: Visit[] // 최근 20개
  prayers: PrayerNote[] // 기독교 기도 노트 (이 기기에만)
  candles: number // 봉헌한 촛불 수 (숫자만)
  lanterns: number // 켠 연등 수 (숫자만)
  tutorials: string[] // 마친 튜토리얼 (장소 키)
  /** 종교별 보기 방식: 배우러 왔는지, 신앙 활동하러 왔는지 */
  modes: Record<string, 'learn' | 'practice'>
}

const KEY = 'oruvia-v1'

const defaults: State = {
  v: 1,
  lang: 'ko',
  nickname: '',
  sound: true,
  volume: 0.7,
  reduceMotion: false,
  quality: 'auto',
  largeText: false,
  favorites: [],
  visits: [],
  prayers: [],
  candles: 0,
  lanterns: 0,
  tutorials: [],
  modes: {},
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...defaults, reduceMotion: prefersReducedMotion() }
    const parsed = JSON.parse(raw) as Partial<State>
    return { ...defaults, ...parsed, v: 1 }
  } catch {
    return { ...defaults }
  }
}

function prefersReducedMotion() {
  try {
    return matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

let state: State = load()
const subs = new Set<() => void>()

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    /* 저장 불가(사생활 보호 모드 등)여도 앱은 계속 동작 */
  }
}

export function getState() {
  return state
}

export function update(fn: (s: State) => Partial<State>) {
  state = { ...state, ...fn(state) }
  save()
  subs.forEach((f) => f())
}

export function subscribe(f: () => void) {
  subs.add(f)
  return () => subs.delete(f)
}

/** 선택자는 state 안의 값(원시값 또는 그대로의 참조)을 돌려줘야 함 */
export function useStore<T>(sel: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => sel(state), () => sel(defaults))
}

export function recordVisit(id: string) {
  update((s) => ({
    visits: [{ id, at: Date.now() }, ...s.visits.filter((v) => v.id !== id)].slice(0, 20),
  }))
}

export function toggleFavorite(id: string) {
  update((s) => ({
    favorites: s.favorites.includes(id) ? s.favorites.filter((f) => f !== id) : [id, ...s.favorites],
  }))
}

export function exportData() {
  return JSON.stringify(state, null, 2)
}

export function resetAll() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
  state = { ...defaults }
  subs.forEach((f) => f())
}

/** 저사양 기기 자동 판단: 코어 수·메모리·모션 설정 */
export function effectiveQuality(s: State): 'low' | 'high' {
  if (s.quality !== 'auto') return s.quality
  if (s.reduceMotion) return 'low'
  const nav = navigator as Navigator & { deviceMemory?: number }
  if ((nav.hardwareConcurrency ?? 8) <= 4) return 'low'
  if ((nav.deviceMemory ?? 8) <= 4) return 'low'
  return 'high'
}
