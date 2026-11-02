import { useEffect, useRef, useState, type ReactNode } from 'react'
import { playMusic, playWind, stopAll, type Music } from '../core/audio'
import { worldById, type WorldId } from '../core/registry'
import { go, href } from '../core/router'
import { recordVisit, toggleFavorite, useStore } from '../core/store'
import { useT } from '../i18n'

/**
 * 모든 종교 공간이 같이 쓰는 틀: 상단 경로(현재 위치), 공간 이동 탭, 즐겨찾기.
 * 색·글꼴·장면은 각 월드가 정한다 (테마 클래스 .w-<id>).
 */
export function WorldFrame({ id, place, children }: { id: WorldId; place?: string; children: (placeId: string) => ReactNode }) {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const favorites = useStore((s) => s.favorites)
  const def = worldById(id)!
  const open = def.places.filter((p) => !p.soon)
  const current = open.find((p) => p.id === place) ?? open[0]
  const key = `${id}/${current.id}`
  const fav = favorites.includes(key)

  useEffect(() => {
    if (place && place !== current.id) go(`w/${id}/${current.id}`)
  }, [place, current.id, id])
  useEffect(() => {
    recordVisit(key)
    return () => stopAll() // 공간 안에서 장소를 옮기면 이전 장소의 소리는 끔
  }, [key])

  const name = (p: { ko: string; en: string }) => (lang === 'en' ? p.en : p.ko)

  return (
    <div className={`world w-${id}`}>
      <header className="world-bar">
        <a className="icon-btn" href={href('')} aria-label={t.home}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M15.4 5.4 14 4l-8 8 8 8 1.4-1.4L8.8 12z" /></svg>
        </a>
        <nav className="crumbs" aria-label={t.here}>
          <span className="world-brand">{def.brand}</span>
          <span>
            {t.worlds[id].name} › <strong aria-current="location">{name(current)}</strong>
          </span>
        </nav>
        <button className={`icon-btn fav ${fav ? 'on' : ''}`} onClick={() => toggleFavorite(key)} aria-pressed={fav} aria-label={fav ? t.favRemove : t.favAdd} title={fav ? t.favRemove : t.favAdd}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path fill="currentColor" d="M12 17.3 6.2 21l1.5-6.6L2.5 10l6.8-.6L12 3l2.7 6.4 6.8.6-5.2 4.4 1.5 6.6z" /></svg>
        </button>
      </header>
      <nav className="place-tabs" aria-label={t.worlds[id].place}>
        {def.places.map((p) =>
          p.soon ? (
            <span key={p.id} className="place-tab soon" aria-disabled="true">
              {name(p)} <small>{lang === 'en' ? 'soon' : '준비 중'}</small>
            </span>
          ) : (
            <a key={p.id} className={`place-tab ${p.id === current.id ? 'on' : ''}`} href={href(`w/${id}/${p.id}`)} aria-current={p.id === current.id ? 'page' : undefined}>
              {name(p)}
            </a>
          ),
        )}
      </nav>
      <div className="world-body">{children(current.id)}</div>
      <p className="disclaimer">{t.disclaimer}</p>
    </div>
  )
}

/** 장면 그림. 가로세로 비율을 고정해 레이아웃이 밀리지 않게 함 */
export function Scene({ children, label, ratio = '16 / 9' }: { children: ReactNode; label: string; ratio?: string }) {
  return (
    <figure className="scene" style={{ aspectRatio: ratio }}>
      <svg viewBox="0 0 320 180" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
        {children}
      </svg>
    </figure>
  )
}

export function Panel({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <section className="panel" id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

export function Intro({ children }: { children: ReactNode }) {
  return <p className="intro">{children}</p>
}

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

/** 장면 위 공통 빛줄기 (그래픽 절약 모드에선 CSS로 숨김) */
export function Rays({ x, color, n = 3 }: { x: number; color: string; n?: number }) {
  return (
    <g className="rays" opacity=".35">
      {Array.from({ length: n }, (_, i) => (
        <path key={i} d={`M${x + i * 18} 20 L${x + i * 18 + 10} 20 L${x + i * 18 + 70} 180 L${x + i * 18 + 20} 180Z`} fill={color} />
      ))}
    </g>
  )
}

/** 음악·환경음 켜고 끄기 버튼. 다 재생되면 저절로 꺼진 상태로 돌아감 */
export function SoundButton({ kind, label }: { kind: Music | 'wind'; label: string }) {
  const t = useT()
  const [on, setOn] = useState(false)
  const [off, setOff] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])
  const click = () => {
    window.clearTimeout(timer.current)
    if (on) {
      stopAll()
      setOn(false)
      return
    }
    if (kind === 'wind') {
      const ok = playWind()
      setOn(ok)
      setOff(!ok)
      return
    }
    const sec = playMusic(kind)
    setOn(sec > 0)
    setOff(sec === 0)
    if (sec > 0) timer.current = window.setTimeout(() => setOn(false), sec * 1000)
  }
  return (
    <div className="sound-btn">
      <Btn on={on} onClick={click}>
        <span aria-hidden="true">{on ? '■' : '▶'}</span> {label} · {on ? t.stop : t.play}
      </Btn>
      {off && <Note>{t.soundOff}</Note>}
    </div>
  )
}
