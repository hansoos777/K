import { BRAND } from './brand'
import { useEffect } from 'react'
import { useRoute } from './core/router'
import { effectiveQuality, useStore } from './core/store'
import { useT } from './i18n'
import Home from './ui/Home'
import ReligionPage from './ui/ReligionPage'
import Settings from './ui/Settings'
import WorldShell from './ui/WorldShell'
import { Header } from './ui/Header'

export default function App() {
  const route = useRoute()
  const t = useT()
  const lang = useStore((s) => s.lang)
  const reduceMotion = useStore((s) => s.reduceMotion)
  const largeText = useStore((s) => s.largeText)
  const quality = useStore((s) => effectiveQuality(s))

  useEffect(() => {
    const el = document.documentElement
    el.lang = lang
    el.dataset.motion = reduceMotion ? 'reduce' : 'full'
    el.dataset.quality = quality
    el.dataset.text = largeText ? 'large' : 'normal'
  }, [lang, reduceMotion, quality, largeText])

  const [page, id, place, mode] = route
  useEffect(() => {
    document.title = page === 'w' && id ? `${t.worlds[id as keyof typeof t.worlds]?.name ?? ''} · ${BRAND.name}` : `${BRAND.name} ${t.brandLocal}`
  }, [page, id, t])

  if (page === 'w' && id) return <WorldShell id={id} place={place} tour={mode === 'tour'} />
  return (
    <>
      <Header />
      <main className={page === 'r' ? 'page rel-page' : 'page'}>{page === 'settings' ? <Settings /> : page === 'r' && id ? <ReligionPage id={id} /> : <Home />}</main>
    </>
  )
}
