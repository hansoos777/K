export interface PlaceMeta {
  id: string
  ko: string
  en: string
  /** 준비 중인 공간은 목록에만 보이고 들어갈 수 없다 (구현 안 한 것을 된 것처럼 보이지 않기) */
  soon?: boolean
  /** 가상 공간 화면의 한 줄 설명 */
  desc?: { ko: string; en: string }
}
