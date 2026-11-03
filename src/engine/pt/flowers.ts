// PujaTime src/data/flowers.ts 의 꽃 모양 값(decor.ts가 씀)
export const FLOWERS = ['marigold', 'lotus', 'jasmine', 'rose', 'hibiscus', 'parijat', 'kaner', 'champa'] as const
export type FlowerKind = (typeof FLOWERS)[number]
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
