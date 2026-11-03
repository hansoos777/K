import type { PlaceMeta } from '../../core/place'
/** 힌두교 공간은 PujaTime을 그대로 쓴다 (modules/pujatime → /hindu/) */
export const places: PlaceMeta[] = [
  { id: 'mandir', ko: '12신 사원', en: 'Temples of 12 deities', desc: { ko: '가네샤·시바·락슈미 등 12신의 사원. 합장·절·램프·찬가·푸자', en: 'Ganesha, Shiva, Lakshmi and more: greet, bow, light lamps, songs, puja' } },
  { id: 'shrine', ko: '나의 신전', en: 'My Shrine', desc: { ko: '나만의 신당을 꾸미고 매일 푸자를 드리는 곳', en: 'Your own shrine for daily puja' } },
]
