import { useEffect, useState } from 'react'
import { useStore, type Lang } from '../core/store'
import ko, { type Dict } from './ko'

/**
 * 한국어는 기본 번들에 포함, 나머지 언어는 고를 때만 받는다(초기 용량 절약).
 * 새 언어 추가: 이 폴더에 ja.ts를 만들고 loaders에 한 줄 추가.
 */
const loaders: Record<Exclude<Lang, 'ko'>, () => Promise<{ default: Dict }>> = {
  en: () => import('./en'),
}
const cache: Partial<Record<Lang, Dict>> = { ko }

export const LANGS: { id: Lang; label: string }[] = [
  { id: 'ko', label: '한국어' },
  { id: 'en', label: 'English' },
]

export function useT(): Dict {
  const lang = useStore((s) => s.lang)
  const [, force] = useState(0)
  useEffect(() => {
    if (cache[lang] || lang === 'ko') return
    let alive = true
    loaders[lang]().then((m) => {
      cache[lang] = m.default
      if (alive) force((n) => n + 1)
    })
    return () => {
      alive = false
    }
  }, [lang])
  return cache[lang] ?? ko
}

/** 월드 모듈용: {ko, en} 문구 묶음에서 현재 언어 고르기 */
export function useLocal<T>(pack: { ko: T; en: T }): T {
  const lang = useStore((s) => s.lang)
  return lang === 'en' ? pack.en : pack.ko
}
