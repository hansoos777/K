import { useState } from 'react'
import { THEMES } from '../data/themes'
import { useT } from '../i18n'
import { updateShrine, useShrine } from '../lib/store'
import { softChime } from '../lib/sound'
import { Overlay } from './Overlay'

// 내 신당 위쪽의 꾸미기 버튼. 고르면 방이 그 분위기로 다시 그려짐.
export function ThemePicker() {
  const t = useT()
  const s = useShrine()!
  const [open, setOpen] = useState(false)
  const now = s.theme ?? 'temple'

  return (
    <>
      <button className="hall-gear" onClick={() => setOpen(true)} aria-label={t.themeTitle}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" aria-hidden="true"><path d="M12 3c2.5 3 2.5 6 0 9-2.5-3-2.5-6 0-9zM4 9c3.8.4 6.2 2 8 5-3.8.4-6.5-1-8-5zM20 9c-3.8.4-6.2 2-8 5 3.8.4 6.5-1 8-5zM5 19h14" /></svg>
      </button>
      {open && (
        <Overlay title={t.themeTitle} onClose={() => setOpen(false)}>
          <p className="muted">{t.themeBody}</p>
          <div className="themes">
            {THEMES.map((x) => (
              <button
                key={x.id}
                className={now === x.id ? 'on' : ''}
                aria-pressed={now === x.id}
                onClick={() => {
                  softChime()
                  updateShrine({ theme: x.id })
                }}
              >
                <i style={{ background: `linear-gradient(160deg, ${x.wall[0]}, ${x.wall[1]})` }} />
                <span><strong>{t.themes[x.id].name}</strong><small>{t.themes[x.id].line}</small></span>
              </button>
            ))}
          </div>
        </Overlay>
      )}
    </>
  )
}
