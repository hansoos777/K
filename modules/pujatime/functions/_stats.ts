// 스프링이었다면 공통 유틸 클래스에 해당. Pages Functions가 함께 쓰는 설정.
export interface Env {
  DB: {
    prepare(sql: string): { bind(...v: unknown[]): any; all(): Promise<{ results: any[] }> }
    batch(list: unknown[]): Promise<unknown>
  }
  ADMIN_KEY?: string
}

// 관리자 화면 날짜는 한국 시간 기준
export const kstDay = (ms = Date.now()) => new Date(ms + 9 * 3600e3).toISOString().slice(0, 10)

export const EVENTS = ['open', 'ping', 'onboard', 'puja', 'hall', 'japa', 'darshan'] as const
