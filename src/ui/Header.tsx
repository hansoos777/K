import { href } from '../core/router'
import { update, useStore } from '../core/store'
import { useT } from '../i18n'
import { Icon, type IconName } from './icons'
import { LogoMark } from './Logo'

/** 메인 메뉴 5개(경험 먼저): 홈 · 탐험(3D 공간) · 알아보기(종교 이야기) · 나의 공간 · 마이페이지. 모바일은 아래쪽, PC는 위쪽 가운데 */
export const MENU: { id: 'home' | 'explore' | 'spaces' | 'mine' | 'me'; path: string; icon: IconName }[] = [
  { id: 'home', path: '', icon: 'home' },
  { id: 'spaces', path: 'spaces', icon: 'door' },
  { id: 'explore', path: 'explore', icon: 'book' },
  { id: 'mine', path: 'mine', icon: 'lotus' },
  { id: 'me', path: 'me', icon: 'user' },
]

export function Header({ active, title }: { active: string; title?: string }) {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const nickname = useStore((s) => s.nickname)
  return (
    <header className="topbar">
      <a className="logo-link" href={href('')} aria-label={t.nav.home}>
        <LogoMark size={34} />
        <span className={`wordmark ${lang === 'ko' ? 'ko' : ''}`}>{t.brand}{lang === 'ko' && <small>RUBELIEVE</small>}</span>
      </a>
      {title && <span className="page-title" aria-current="page">{title}</span>}
      <nav className="topnav" aria-label="menu">
        {MENU.map((m) => (
          <a key={m.id} href={href(m.path)} className={active === m.id ? 'on' : ''} aria-current={active === m.id ? 'page' : undefined}>{t.nav[m.id]}</a>
        ))}
      </nav>
      <div className="top-right">
        <span className="lang" role="group" aria-label={t.s.language}>
          <button className={lang === 'ko' ? 'on' : ''} onClick={() => update(() => ({ lang: 'ko' }))}>한국어</button>
          <span aria-hidden="true">/</span>
          <button className={lang === 'en' ? 'on' : ''} onClick={() => update(() => ({ lang: 'en' }))}>English</button>
        </span>
        <a className={`profile-ic ${active === 'me' ? 'on' : ''}`} href={href('me')} aria-label={nickname || t.h.profile}><Icon name="user" size={20} /></a>
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
