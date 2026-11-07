import { BRAND } from '../brand'
import type { ComponentType } from 'react'
import type { PlaceMeta } from './place'
import { places as christian } from '../worlds/christian/meta'
import { places as catholic } from '../worlds/catholic/meta'
import { places as mandir } from '../worlds/mandir/meta'
import { places as temple } from '../worlds/temple/meta'
import { places as plaza } from '../worlds/plaza/meta'

/**
 * 공간(월드) 등록부. 새 종교·문화 공간은 여기에 한 줄 추가하고
 * src/worlds/<id>/ 폴더를 만들면 된다. 코어는 월드 내부를 모른다.
 * load()는 동적 import라 사용자가 그 공간에 들어갈 때만 코드가 내려온다.
 */
export type WorldId = 'christian' | 'catholic' | 'mandir' | 'temple'
/** 3D로 들어갈 수 있는 모든 공간 = 네 종교 + 광장 */
export type SpaceId = WorldId | 'plaza'

export interface WorldProps {
  /** #/w/<id>/<place> 의 place */
  place?: string
  /** #/w/<id>/<place>/tour 로 들어오면 안내(튜토리얼)를 바로 시작 */
  tour?: boolean
}

export interface WorldDef<I extends string = WorldId> {
  id: I
  brand: string
  status: 'open' | 'preview' | 'bridge'
  /** 카드 색: 각 전통의 대표 색감 */
  colors: [string, string]
  places: PlaceMeta[]
  load: () => Promise<{ default: ComponentType<WorldProps> }>
  /** 종교 메인 화면 내용 (배우기·예절·축제) */
  learn: () => Promise<{ default: import('../learn/types').LearnPack }>
}

export const WORLDS: WorldDef[] = [
  { id: 'christian', brand: `${BRAND.en} CHRISTIAN`, status: 'open', places: christian, colors: ['#2b3a55', '#c9a45c'], load: () => import('../worlds/christian/World'), learn: () => import('../learn/christian') },
  { id: 'catholic', brand: `${BRAND.en} CATHOLIC`, status: 'open', places: catholic, colors: ['#3a1f3d', '#d9b35b'], load: () => import('../worlds/catholic/World'), learn: () => import('../learn/catholic') },
  { id: 'temple', brand: `${BRAND.en} TEMPLE`, status: 'open', places: temple, colors: ['#1f3b33', '#c8553d'], load: () => import('../worlds/temple/World'), learn: () => import('../learn/buddhist') },
  { id: 'mandir', brand: `${BRAND.en} MANDIR`, status: 'bridge', places: mandir, colors: ['#7a2412', '#f2a33a'], load: () => import('../worlds/mandir/World'), learn: () => import('../learn/hindu') },
]

/** 광장: 네 공간을 잇는 공통 월드. 종교가 아니라서 WORLDS(탐험·알아보기 목록)에는 넣지 않는다 */
export const PLAZA: WorldDef<'plaza'> = { id: 'plaza', brand: `${BRAND.en} PLAZA`, status: 'open', places: plaza, colors: ['#7A6652', '#E8DFCF'], load: () => import('../worlds/plaza/World'), learn: () => Promise.reject(new Error('plaza has no learn pack')) }

export const worldById = (id: string) => WORLDS.find((w) => w.id === id)
/** 광장까지 포함해서 찾기 (3D 화면을 여는 곳에서만 씀) */
export const spaceById = (id: string): WorldDef<SpaceId> | undefined => worldById(id) ?? (id === 'plaza' ? PLAZA : undefined)

/** "catholic/gothic" → { world, place } */
export function resolvePlace(key: string) {
  const [wid, pid] = key.split('/')
  const world = worldById(wid)
  const place = world?.places.find((p) => p.id === pid)
  return world && place ? { world, place } : null
}

/** 홈 화면 추천(사람이 고른 정적 목록 — 가짜 인기 숫자는 쓰지 않음) */
export const RECOMMENDED = ['catholic/gothic', 'temple/courtyard', 'christian/traditional']
export const NEW_PLACES = ['temple/meditation', 'catholic/grotto', 'christian/prayer']
