/** 종교별 메인 화면 내용. 문구는 여기(언어별)에만 두고 화면 코드에는 넣지 않는다. */
export interface Lesson { title: string; body: string[] }
export interface PracticeLink { label: string; place: string; text: string }
/** 신앙 활동: 종교마다 실제 전통에 있는 것만 (서로 섞지 않음) */
export interface Activity {
  name: string
  text: string
  /** 종교적 의미 */
  meaning: string
  /** 실제 진행 방법 */
  steps: string[]
  /** 대표 이미지로 쓸 그 종교의 공간 (public/photos/<world>_<img>.webp) */
  img: string
  /** 가상으로 해 볼 수 있는 공간이 있으면 */
  place?: string
}
/** 주요 인물 및 상징 */
export interface Figure { name: string; text: string }
export interface Festival { name: string; when: string; text: string }
export interface Learn {
  title: string
  sub: string
  intro: string
  /** 처음 시작하기: 3D 안내를 받을 장소 */
  start: { title: string; text: string; place: string }
  lessons: Lesson[]
  etiquette: string[]
  practice: PracticeLink[]
  activities: Activity[]
  figures: Figure[]
  festivals: Festival[]
  festivalNote: string
  sources: string[]
}
export interface LearnPack { ko: Learn; en: Learn }
