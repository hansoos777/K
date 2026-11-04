import { useEffect } from 'react'
import { go, useRoute } from './core/router'
import { effectiveQuality, useStore } from './core/store'
import { useT } from './i18n'
import Explore from './ui/Explore'
import { Header, TabBar } from './ui/Header'
import Home from './ui/Home'
import Me from './ui/Me'
import Mine from './ui/Mine'
import Spaces from './ui/Spaces'
import WorldShell from './ui/WorldShell'

/**
 * 메인 메뉴 5개: 홈 · 종교 탐색 · 가상 공간 · 나의 공간 · 마이페이지 (2단계까지만).
 * 3D 공간(#/w/...)은 메뉴가 아니라 "입장하기"로 들어가는 전체 화면.
 */
export default function App() {
  const route = useRoute()
  const t = useT()
  const lang = useStore((s) => s.lang)
  const reduceMotion = useStore((s) => s.reduceMotion)
  const largeText = useStore((s) => s.largeText)
  const quality = useStore((s) => effectiveQuality(s))
  const [page = '', id, place, mode] = route

  useEffect(() => {
    const el = document.documentElement
    el.lang = lang
    el.dataset.motion = reduceMotion ? 'reduce' : 'full'
    el.dataset.quality = quality
    el.dataset.text = largeText ? 'large' : 'normal'
  }, [lang, reduceMotion, quality, largeText])

  // 예전 주소 → 새 메뉴
  useEffect(() => {
    if (page === 'r' && id) go(`explore/${id}`)
    if (page === 'settings') go('me')
  }, [page, id])

  const menu = page === 'explore' || page === 'spaces' || page === 'mine' || page === 'me' ? page : 'home'
  const title = menu === 'home' ? undefined : t.nav[menu]
  useEffect(() => {
    document.title = page === 'w' && id ? `${t.worlds[id as keyof typeof t.worlds]?.name ?? ''} · ${t.brand}` : title ? `${title} · ${t.brand}` : `${t.brand} · ${t.tagline}`
  }, [page, id, t, title])

  // #me#finder 처럼 화면 안 위치로 바로 이동
  useEffect(() => {
    const anchor = location.hash.split('#')[2]
    if (anchor) setTimeout(() => document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' }), 100)
  }, [route])

  if (page === 'w' && id) return <WorldShell id={id} place={place} tour={mode === 'tour'} />
  return (
    <>
      <Header active={menu} title={title} />
      <main className={`page page-${menu}`}>
        {menu === 'explore' ? <Explore id={id} tab={place} /> : menu === 'spaces' ? <Spaces id={id} /> : menu === 'mine' ? <Mine section={id} /> : menu === 'me' ? <Me /> : <Home />}
      </main>
      <TabBar active={menu} />
    </>
  )
}
