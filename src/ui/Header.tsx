import { BRAND } from '../brand'
import { href } from '../core/router'
import { useT } from '../i18n'
import { Icon, type IconName } from './icons'
import { Logo } from './Logo'

/** 메인 메뉴 5개 (PC·모바일 같은 구조). 하위 메뉴는 만들지 않고 각 화면 안에서 탭·섹션으로 나눈다 */
export const MENU: { id: 'home' | 'explore' | 'spaces' | 'mine' | 'me'; path: string; icon: IconName }[] = [
  { id: 'home', path: '', icon: 'compass' },
  { id: 'explore', path: 'explore', icon: 'book' },
  { id: 'spaces', path: 'spaces', icon: 'door' },
  { id: 'mine', path: 'mine', icon: 'lotus' },
  { id: 'me', path: 'me', icon: 'gear' },
]

/** 위쪽 머리: 로고 + 현재 위치(화면 제목) + PC에서는 메뉴 */
export function Header({ active, title }: { active: string; title?: string }) {
  const t = useT()
  return (
    <header className="topbar">
      <a className="logo-link" href={href('')} aria-label={t.nav.home}>
        <Logo />
        <span className="wordmark">{BRAND.name}</span>
      </a>
      {title && <span className="page-title" aria-current="page">{title}</span>}
      <nav className="topnav" aria-label="menu">
        {MENU.map((m) => (
          <a key={m.id} href={href(m.path)} className={active === m.id ? 'on' : ''} aria-current={active === m.id ? 'page' : undefined}>{t.nav[m.id]}</a>
        ))}
      </nav>
    </header>
  )
}

/** 모바일 아래쪽 메뉴 */
export function TabBar({ active }: { active: string }) {
  const t = useT()
  return (
    <nav className="tabbar" aria-label="menu">
      {MENU.map((m) => (
        <a key={m.id} href={href(m.path)} className={active === m.id ? 'on' : ''} aria-current={active === m.id ? 'page' : undefined}>
          <Icon name={m.icon} size={22} />
          <span>{t.nav[m.id]}</span>
        </a>
      ))}
    </nav>
  )
}
