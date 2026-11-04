import { href } from '../core/router'
import { update, useStore } from '../core/store'
import { useT } from '../i18n'
import { Icon, type IconName } from './icons'

/** 메인 메뉴 5개 (모바일 아래쪽). PC 위쪽 가운데에는 앞의 4개, 마이페이지는 오른쪽 '프로필' */
export const MENU: { id: 'home' | 'explore' | 'spaces' | 'mine' | 'me'; path: string; icon: IconName }[] = [
  { id: 'home', path: '', icon: 'compass' },
  { id: 'explore', path: 'explore', icon: 'book' },
  { id: 'spaces', path: 'spaces', icon: 'door' },
  { id: 'mine', path: 'mine', icon: 'lotus' },
  { id: 'me', path: 'me', icon: 'gear' },
]

export function Header({ active, title }: { active: string; title?: string }) {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const nickname = useStore((s) => s.nickname)
  return (
    <header className="topbar">
      <a className="logo-link" href={href('')} aria-label={t.nav.home}>
        <span className={`wordmark ${lang === 'ko' ? 'ko' : ''}`}>{t.brand}</span>
      </a>
      {title && <span className="page-title" aria-current="page">{title}</span>}
      <nav className="topnav" aria-label="menu">
        {MENU.slice(0, 4).map((m) => (
          <a key={m.id} href={href(m.path)} className={active === m.id ? 'on' : ''} aria-current={active === m.id ? 'page' : undefined}>{t.nav[m.id]}</a>
        ))}
      </nav>
      <div className="top-right">
        <span className="lang" role="group" aria-label={t.s.language}>
          <button className={lang === 'ko' ? 'on' : ''} onClick={() => update(() => ({ lang: 'ko' }))}>한국어</button>
          <span aria-hidden="true">/</span>
          <button className={lang === 'en' ? 'on' : ''} onClick={() => update(() => ({ lang: 'en' }))}>English</button>
        </span>
        <a className={`profile ${active === 'me' ? 'on' : ''}`} href={href('me')}>{nickname || t.h.profile}</a>
      </div>
    </header>
  )
}

export function TabBar({ active }: { active: string }) {
  const t = useT()
  return (
    <nav className="tabbar" aria-label="menu">
      {MENU.map((m) => (
        <a key={m.id} href={href(m.path)} className={active === m.id ? 'on' : ''} aria-current={active === m.id ? 'page' : undefined}>
          <Icon name={m.icon} size={20} />
          <span>{t.nav[m.id]}</span>
        </a>
      ))}
    </nav>
  )
}
