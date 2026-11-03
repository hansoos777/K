import type { ReactNode } from 'react'

/** 공간 안 창(시트)에서 쓰는 작은 공통 부품 */
export function Note({ children }: { children: ReactNode }) {
  return <p className="note">{children}</p>
}

export function Btn({ children, onClick, on, disabled }: { children: ReactNode; onClick?: () => void; on?: boolean; disabled?: boolean }) {
  return (
    <button className={`btn ${on ? 'on' : ''}`} onClick={onClick} aria-pressed={on} disabled={disabled}>
      {children}
    </button>
  )
}
