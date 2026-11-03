import { BRAND } from '../brand'
import { href } from '../core/router'
import { useT } from '../i18n'
import { Logo } from './Logo'

export function Header() {
  const t = useT()
  return (
    <header className="topbar">
      <a className="logo-link" href={href('')} aria-label={t.home}>
        <Logo />
        <span className="wordmark">{BRAND.name}</span>
      </a>
      <a className="icon-btn" href={href('settings')} aria-label={t.settings} title={t.settings}>
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path fill="currentColor" d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm8.3 4.6-.1-2.2 2-1.6-2-3.4-2.4.9a8 8 0 0 0-1.9-1.1L15.5 3h-4l-.4 2.7a8 8 0 0 0-1.9 1.1l-2.4-.9-2 3.4 2 1.6a8 8 0 0 0 0 2.2l-2 1.6 2 3.4 2.4-.9c.6.5 1.2.8 1.9 1.1l.4 2.7h4l.4-2.7c.7-.3 1.3-.6 1.9-1.1l2.4.9 2-3.4-2-1.6Z" />
        </svg>
      </a>
    </header>
  )
}
