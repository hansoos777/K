import { useSyncExternalStore } from 'react'
import { deityById, type Deity, type DeityId } from '../data/deities'
import type { Festival } from '../data/festivals'
import { en, type Dict, type FestivalText } from './en'
import { hi } from './hi'
import { getCustomName } from '../lib/store'
import { ko } from './ko'

export type Lang = 'ko' | 'en' | 'hi'

// 개발 중 기본 언어. 출시할 때 'en'으로 바꿀 것.
export const DEFAULT_LANG: Lang = 'ko'

export const LANGS: { id: Lang; label: string }[] = [
  { id: 'ko', label: '한국어' },
  { id: 'en', label: 'English' },
  { id: 'hi', label: 'हिन्दी' },
]

const DICTS: Record<Lang, Dict> = { ko, en, hi }
const KEY = 'pujatime-lang'

function load(): Lang {
  try {
    const v = localStorage.getItem(KEY)
    return v === 'ko' || v === 'en' || v === 'hi' ? v : DEFAULT_LANG
  } catch {
    return DEFAULT_LANG
  }
}

let lang = load()
document.documentElement.lang = lang
const listeners = new Set<() => void>()

export function setLang(next: Lang) {
  lang = next
  document.documentElement.lang = next
  try {
    localStorage.setItem(KEY, next)
  } catch {
    // 저장이 막혀도 이번 실행에서는 그대로 동작
  }
  listeners.forEach((l) => l())
}

export const useLang = () =>
  useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => lang,
  )

export const getLang = () => lang

export const useT = () => DICTS[useLang()]

export const LOCALE: Record<Lang, string> = { ko: 'ko-KR', en: 'en', hi: 'hi-IN' }

/** 영어 원본 위에 현재 언어 번역을 덮어쓴 신 정보 */
export function localDeity(t: Dict, id: DeityId): Deity & { meaning: string } {
  const base = deityById(id)
  if (id === 'custom') return { ...base, name: getCustomName() || t.customDeity, meaning: t.customMeaning }
  const over = t.deities?.[id]
  return { ...base, ...over, meaning: over?.meaning ?? base.mantra.meaning }
}

export function localFestival(t: Dict, f: Festival): FestivalText {
  const key = f.id.split('-')[0]
  return t.festivalText?.[key] ?? { name: f.name, meaning: f.meaning, regional: f.regional }
}
