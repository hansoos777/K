import { useEffect, useState } from 'react'
import { worldById } from '../core/registry'
import { href } from '../core/router'
import { update, useStore } from '../core/store'
import type { Learn } from '../learn/types'
import { useT } from '../i18n'
import { Icon } from './icons'

/**
 * 종교별 메인 화면: 소개 → 처음 시작하기(3D 안내) → 배우기 → 3D 공간 → 신앙 활동 → 예절 → 축제 → 커뮤니티.
 * "처음이에요" / "이미 믿고 있어요"에 따라 순서를 바꾼다(신앙인은 설명 없이 바로 활동으로).
 */
export default function ReligionPage({ id }: { id: string }) {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const mode = useStore((s) => s.modes[id] ?? 'learn')
  const def = worldById(id)
  const [L, setL] = useState<Learn | null>(null)
  const [openLesson, setOpenLesson] = useState(0)

  useEffect(() => {
    if (!def) return
    let alive = true
    def.learn().then((m) => alive && setL(lang === 'en' ? m.default.en : m.default.ko))
    return () => { alive = false }
  }, [def, lang])

  if (!def) {
    location.hash = '/'
    return null
  }
  const setMode = (m: 'learn' | 'practice') => update((s) => ({ modes: { ...s.modes, [id]: m } }))
  const thumb = (p: string) => `/thumbs/${id}_${p}.webp`
  const placeName = (pid: string) => {
    const p = def.places.find((x) => x.id === pid)
    return p ? (lang === 'en' ? p.en : p.ko) : pid
  }

  if (!L) return <div className="rel-loading"><div className="spinner" /></div>

  const learn = (
    <section className="rel-sec" id="learn">
      <h2><span className="k">LEARN</span>{t.r.learn}</h2>
      <div className="lessons">
        {L.lessons.map((l, i) => (
          <article key={l.title} className={`lesson ${openLesson === i ? 'open' : ''}`}>
            <button className="lesson-h" onClick={() => setOpenLesson(openLesson === i ? -1 : i)} aria-expanded={openLesson === i}>
              <span className="num">{String(i + 1).padStart(2, '0')}</span>{l.title}<span className="chev">{openLesson === i ? '−' : '+'}</span>
            </button>
            {openLesson === i && <div className="lesson-b">{l.body.map((b) => <p key={b}>{b}</p>)}</div>}
          </article>
        ))}
      </div>
    </section>
  )
  const explore = (
    <section className="rel-sec" id="explore">
      <h2><span className="k">EXPERIENCE</span>{t.r.explore}</h2>
      <ul className="rel-places">
        {def.places.map((p) => (
          <li key={p.id}>
            {p.soon ? (
              <div className="rel-place soon">
                <div className="soon-art"><Icon name="compass" size={28} /></div>
                <span><strong>{lang === 'en' ? p.en : p.ko}</strong><small>{t.soon}</small></span>
              </div>
            ) : (
              <a className="rel-place" href={href(`w/${id}/${p.id}`)}>
                <img src={thumb(p.id)} alt="" loading="lazy" width="320" height="200" />
                <span><strong>{lang === 'en' ? p.en : p.ko}</strong><small>{t.r.enter3d} →</small></span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
  const practice = (
    <section className="rel-sec" id="practice">
      <h2><span className="k">PRACTICE</span>{t.r.practice}</h2>
      <div className="practice-grid">
        {L.practice.map((p) => (
          <a key={p.label} className="practice" href={href(`w/${id}/${p.place}`)}>
            <strong>{p.label}</strong>
            <span>{p.text}</span>
            <small>{placeName(p.place)} →</small>
          </a>
        ))}
      </div>
    </section>
  )

  return (
    <div className={`rel w-${id}`}>
      <section className="rel-hero">
        <img src={thumb(def.places[0].id)} alt="" className="rel-hero-img" />
        <div className="rel-hero-shade" />
        <div className="rel-hero-in">
          <span className="world-brand">{def.brand}</span>
          <h1>{L.title}</h1>
          <p className="rel-sub">{L.sub}</p>
          <div className="seg mode" role="radiogroup" aria-label={t.r.modeLabel}>
            <button role="radio" aria-checked={mode === 'learn'} onClick={() => setMode('learn')}>{t.r.modeLearn}</button>
            <button role="radio" aria-checked={mode === 'practice'} onClick={() => setMode('practice')}>{t.r.modePractice}</button>
          </div>
          <div className="row">
            {mode === 'learn' ? (
              <a className="cta" href={href(`w/${id}/${L.start.place}/tour`)}>{t.r.startTour} <Icon name="compass" size={18} /></a>
            ) : (
              <a className="cta" href={href(`w/${id}/${L.start.place}`)}>{t.r.enterNow} <Icon name="door" size={18} /></a>
            )}
            <a className="cta ghost" href={href(mode === 'learn' ? `w/${id}/${L.start.place}` : `w/${id}/${L.start.place}/tour`)}>{mode === 'learn' ? t.r.enterNow : t.r.startTour}</a>
          </div>
        </div>
      </section>

      <div className="rel-body">
        <p className="rel-intro">{L.intro}</p>
        <nav className="rel-nav">
          {(mode === 'learn' ? ['learn', 'explore', 'practice'] : ['practice', 'explore', 'learn']).map((k) => (
            <a key={k} href={`#${k}`} onClick={(e) => { e.preventDefault(); document.getElementById(k)?.scrollIntoView({ behavior: 'smooth' }) }}>{t.r[k as 'learn']}</a>
          ))}
          <a href="#etiquette" onClick={(e) => { e.preventDefault(); document.getElementById('etiquette')?.scrollIntoView({ behavior: 'smooth' }) }}>{t.r.etiquette}</a>
          <a href="#festivals" onClick={(e) => { e.preventDefault(); document.getElementById('festivals')?.scrollIntoView({ behavior: 'smooth' }) }}>{t.r.festivals}</a>
        </nav>

        {mode === 'learn' && (
          <a className="start-card" href={href(`w/${id}/${L.start.place}/tour`)}>
            <span className="k">{t.r.startK}</span>
            <strong>{L.start.title}</strong>
            <span>{L.start.text}</span>
          </a>
        )}

        {mode === 'learn' ? <>{learn}{explore}{practice}</> : <>{practice}{explore}{learn}</>}

        <section className="rel-sec" id="etiquette">
          <h2>{t.r.etiquette}</h2>
          <ul className="etiquette">{L.etiquette.map((e) => <li key={e}>{e}</li>)}</ul>
        </section>

        <section className="rel-sec" id="festivals">
          <h2>{t.r.festivals}</h2>
          <ul className="fest">{L.festivals.map((f) => <li key={f.name}><time>{f.when}</time><strong>{f.name}</strong><span>{f.text}</span></li>)}</ul>
          <p className="hint">{L.festivalNote}</p>
        </section>

        <section className="rel-sec">
          <h2>{t.r.community}</h2>
          <p className="hint">{t.r.communityNote}</p>
        </section>

        <p className="sources">{t.r.sources}: {L.sources.join(' · ')}. {t.r.review}</p>
        <p className="disclaimer">{t.disclaimer}</p>
      </div>
    </div>
  )
}
