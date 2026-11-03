/** 종교별 메인 화면 내용. 문구는 여기(언어별)에만 두고 화면 코드에는 넣지 않는다. */
export interface Lesson { title: string; body: string[] }
export interface PracticeLink { label: string; place: string; text: string }
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
  festivals: Festival[]
  festivalNote: string
  sources: string[]
}
export interface LearnPack { ko: Learn; en: Learn }
