/** 종교별 메인 화면 내용. 문구는 여기(언어별)에만 두고 화면 코드에는 넣지 않는다. */
/** 학습 수준: 입문 · 기초 · 심화 · 체험 */
export type Level = 'intro' | 'basic' | 'advanced' | 'experience'
/** 콘텐츠 상태: 작성 중 · 출처 확인 중 · 검토 완료 · 게시 완료 */
export type Status = 'draft' | 'checking' | 'reviewed' | 'published'
export interface Lesson { title: string; body: string[]; level?: Level; place?: string }
/** 확인 퀴즈 (객관식·O/X). answer는 options의 번호, lesson은 다시 공부할 강의 번호 */
export interface Quiz { q: string; options: string[]; answer: number; explain: string; lesson?: number }
/** 용어 사전 */
export interface Term { term: string; original?: string; def: string }
export interface Faq { q: string; a: string }
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
  /** 경전과 문헌 */
  scriptures: Figure[]
  /** 종교 건축과 상징 */
  symbols: Figure[]
  /** 문화와 생활 */
  culture: Figure[]
  glossary: Term[]
  faq: Faq[]
  quiz: Quiz[]
  status: Status
  festivals: Festival[]
  festivalNote: string
  sources: string[]
}
export interface LearnPack { ko: Learn; en: Learn }
