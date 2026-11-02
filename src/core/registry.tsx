import type { ComponentType } from 'react'
import type { PlaceMeta } from './place'
import { places as christian } from '../worlds/christian/meta'
import { places as catholic } from '../worlds/catholic/meta'
import { places as mandir } from '../worlds/mandir/meta'
import { places as temple } from '../worlds/temple/meta'

/**
 * 공간(월드) 등록부. 새 종교·문화 공간은 여기에 한 줄 추가하고
 * src/worlds/<id>/ 폴더를 만들면 된다. 코어는 월드 내부를 모른다.
 * load()는 동적 import라 사용자가 그 공간에 들어갈 때만 코드가 내려온다.
 */
export type WorldId = 'christian' | 'catholic' | 'mandir' | 'temple'

export interface WorldProps {
  /** #/w/<id>/<place> 의 place */
  place?: string
}

export interface WorldDef {
  id: WorldId
  brand: string
  status: 'open' | 'preview' | 'bridge'
  /** 카드 색: 각 전통의 대표 색감 */
  colors: [string, string]
  places: PlaceMeta[]
  load: () => Promise<{ default: ComponentType<WorldProps> }>
}

export const WORLDS: WorldDef[] = [
  { id: 'christian', brand: 'ORUVIA CHRISTIAN', status: 'open', places: christian, colors: ['#2b3a55', '#c9a45c'], load: () => import('../worlds/christian/World') },
  { id: 'catholic', brand: 'ORUVIA CATHOLIC', status: 'open', places: catholic, colors: ['#3a1f3d', '#d9b35b'], load: () => import('../worlds/catholic/World') },
  { id: 'mandir', brand: 'ORUVIA MANDIR', status: 'bridge', places: mandir, colors: ['#7a2412', '#f2a33a'], load: () => import('../worlds/mandir/World') },
  { id: 'temple', brand: 'ORUVIA TEMPLE', status: 'open', places: temple, colors: ['#1f3b33', '#c8553d'], load: () => import('../worlds/temple/World') },
]

export const worldById = (id: string) => WORLDS.find((w) => w.id === id)

/** "catholic/gothic" → { world, place } */
export function resolvePlace(key: string) {
  const [wid, pid] = key.split('/')
  const world = worldById(wid)
  const place = world?.places.find((p) => p.id === pid)
  return world && place ? { world, place } : null
}

/** 홈 화면 추천(사람이 고른 정적 목록 — 가짜 인기 숫자는 쓰지 않음) */
export const RECOMMENDED = ['catholic/gothic', 'temple/sansa', 'christian/traditional']
export const NEW_PLACES = ['temple/meditation', 'catholic/grotto', 'christian/prayer']
