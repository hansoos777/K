/** 종교별 메인 화면 내용. 문구는 여기(언어별)에만 두고 화면 코드에는 넣지 않는다. */
/** 학습 수준: 입문 · 기초 · 심화 · 체험 */
export type Level = 'intro' | 'basic' | 'advanced' | 'experience'
/** 콘텐츠 상태: 초안 · 사실 확인 중 · 종교 전문가 검토 · 게시 승인 · 게시 중지 */
export type Status = 'draft' | 'checking' | 'expert' | 'approved' | 'suspended'
/** 강의: 제목 · 난이도 · 예상 시간 · 학습 목표 · 본문 · 핵심 용어 · 핵심 정리 · 생각해 보기 · 관련 공간
 *  id는 진도·퀴즈 연결에 쓰므로 바꾸지 않는다 */
export interface Lesson {
  id: string
  title: string
  body: string[]
  level?: Level
  /** 묶음 이름 (예: 역사, 교리, 성경) */
  unit?: string
  /** 예상 시간(분) */
  minutes?: number
  goal?: string
  /** 핵심 용어와 뜻 */
  termDefs?: { term: string; def: string }[]
  terms?: string[]
  points?: string[]
  /** 핵심 정리 */
  summary?: string
  /** 생각해 보기 (답은 저장하지 않음) + 생각을 돕는 해설 */
  think?: string
  thinkGuide?: string
  place?: string
}
/** 확인 퀴즈 (객관식·O/X). answer는 options의 번호, lesson은 다시 공부할 강의 번호 */
export interface Quiz { q: string; options: string[]; answer: number; explain: string; lesson?: string }
/** 용어 사전 */
export interface Term { term: string; original?: string; def: string }
export interface Faq { q: string; a: string }
/** LEVEL 1 발견하기: 짧은 질문과 답. lesson은 더 읽을 강의 id, place는 해 볼 3D 공간 */
export interface Discover { q: string; a: string; lesson?: string; place?: string }
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
  discover: Discover[]
  quiz: Quiz[]
  status: Status
  festivals: Festival[]
  festivalNote: string
  sources: string[]
}
export interface LearnPack { ko: Learn; en: Learn }
