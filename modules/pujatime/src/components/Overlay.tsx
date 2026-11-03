import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useT } from '../i18n'
import { useBack } from '../lib/back'

// 전체 화면 상세 페이지. 페이지 애니메이션의 영향을 받지 않도록 body에 직접 그림.
export function Overlay({ title, onClose, children }: { title?: string; onClose: () => void; children: ReactNode }) {
  const t = useT()
  useBack(onClose)
  return createPortal(
    <div className="over">
      <header className="over-head">
        <button className="exit-btn" onClick={onClose}>‹ {t.close}</button>
        {title && <h2>{title}</h2>}
      </header>
      <div className="over-body">{children}</div>
    </div>,
    document.body,
  )
}
