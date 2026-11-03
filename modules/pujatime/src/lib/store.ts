import { useSyncExternalStore } from 'react'
import type { DeityId } from '../data/deities'
import type { ShrineTheme } from '../data/themes'
import type { Place } from './panchang'
import { clearPhoto } from './photo'

// 스프링이었다면 Repository + Session에 해당. 서버 없이 이 기기의 localStorage에만 저장.
// 기도 기록은 기본 비공개라 서버로 나갈 일이 없음. 익명 사용 통계만 lib/stats.ts에서 따로 보냄.

export type JournalKind = 'prayer' | 'gratitude' | 'reflection' | 'moment'

export interface JournalEntry {
  id: string
  date: string
  kind: JournalKind
  text: string
}

export interface Reminder {
  daily: boolean
  time: string // HH:mm
  observances: boolean
}

export type MusicTrack = 'tanpura' | 'off'

export interface AudioPrefs {
  track: MusicTrack
  music: number // 0~1
  sfx: number // 0~1
}

export interface Shrine {
  name: string
  mainDeity: DeityId
  otherDeities: DeityId[]
  familyDeity: string
  chosenDeity: string
  customName?: string
  avatar?: number
  lastPuja: string | null
  pujaDays?: string[]
  theme?: ShrineTheme
  festivalLamps: string[]
  sound: boolean
  place?: Place
  reminder?: Reminder
  audio?: AudioPrefs
  journal: JournalEntry[]
}

const KEY = 'pujatime-v1'

function load(): Shrine | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Shrine) : null
  } catch {
    return null
  }
}

let state: Shrine | null = load()
const listeners = new Set<() => void>()

function commit(next: Shrine | null) {
  state = next
  try {
    if (next) localStorage.setItem(KEY, JSON.stringify(next))
    else localStorage.removeItem(KEY)
  } catch {
    // 비공개 창 등에서는 저장이 막힐 수 있음. 메모리 상태로 계속 동작.
  }
  listeners.forEach((l) => l())
}

export const useShrine = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => state,
  )

export const createShrine = (name: string, mainDeity: DeityId, customName = '', avatar = 0) =>
  commit({
    avatar,
    customName: customName.trim(),
    name: name.trim(),
    mainDeity,
    otherDeities: [],
    familyDeity: '',
    chosenDeity: '',
    lastPuja: null,
    festivalLamps: [],
    sound: true,
    journal: [],
  })

export const updateShrine = (patch: Partial<Shrine>) => {
  if (state) commit({ ...state, ...patch })
}

export const eraseShrine = () => {
  clearPhoto()
  commit(null)
}

export const getShrine = () => state
export const getCustomName = () => state?.customName ?? ''

export function today(d = new Date()) {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function addEntry(kind: JournalKind, text: string, date = today()) {
  if (!state || !text.trim()) return
  const entry = { id: crypto.randomUUID(), date, kind, text: text.trim() }
  commit({ ...state, journal: [entry, ...state.journal] })
}

export function removeEntry(id: string) {
  if (state) commit({ ...state, journal: state.journal.filter((e) => e.id !== id) })
}

export const markPuja = () => {
  const day = today()
  const days = state?.pujaDays ?? []
  updateShrine({ lastPuja: day, pujaDays: days.includes(day) ? days : [...days, day].slice(-60) })
}
export const isSoundOn = () => state?.sound ?? true
export const audioPrefs = (): AudioPrefs => {
  const a = state?.audio ?? { track: 'tanpura', music: 0.3, sfx: 2 / 3 }
  // 예전에 고른 반수리는 탄푸라로 바뀜
  return { ...a, track: a.track === 'off' ? 'off' : 'tanpura' }
}
