import type { DeityId } from './deities'

// 푸자에 흔히 올리는 꽃. 2D 그림과 3D가 같은 색과 모양 값을 씀
export const FLOWERS = ['marigold', 'lotus', 'jasmine', 'rose', 'hibiscus', 'parijat', 'kaner', 'champa'] as const
export type FlowerKind = (typeof FLOWERS)[number]

// n: 꽃잎 수, len·wid: 꽃잎 길이와 폭(1이 기본)
export const FLOWER_LOOK: Record<FlowerKind, { n: number; fill: string; core: string; len: number; wid: number }> = {
  marigold: { n: 12, fill: '#f6a81f', core: '#ffd862', len: 1, wid: 1 },
  lotus: { n: 9, fill: '#f79bb0', core: '#ffd862', len: 1.1, wid: 0.85 },
  jasmine: { n: 5, fill: '#fffaf0', core: '#efd27a', len: 0.9, wid: 1 },
  rose: { n: 8, fill: '#cc2f44', core: '#8d1427', len: 0.9, wid: 1.2 },
  hibiscus: { n: 5, fill: '#e0242f', core: '#ffc93c', len: 1.25, wid: 1.45 },
  parijat: { n: 7, fill: '#fff8ec', core: '#f0822a', len: 0.9, wid: 0.7 },
  kaner: { n: 5, fill: '#f2779f', core: '#ffe2a8', len: 1, wid: 1.2 },
  champa: { n: 6, fill: '#f8dc8a', core: '#ef9f22', len: 1.15, wid: 0.65 },
}

// 참파는 시바에게 올리지 않는다는 전승이 있어 시바 푸자에서는 뺌
export const flowersFor = (deity: DeityId) => FLOWERS.filter((k) => !(k === 'champa' && deity === 'shiva'))
