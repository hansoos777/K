import { useEffect, useState } from 'react'
import { worldById } from '../core/registry'
import { go, href } from '../core/router'
import { update, useStore } from '../core/store'
import type { Learn } from '../learn/types'
import { useT } from '../i18n'
import { COVER, photo } from './Home'
import { Icon } from './icons'

export type RelTab = 'activities' | 'spaces' | 'learn' | 'etiquette'
const TABS: RelTab[] = ['activities', 'spaces', 'learn', 'etiquette']

/**
 * 종교 상세: 대표 이미지 · 종교명 · 한 줄 소개 · 소개 글, 그 아래 안쪽 탭 4개
 * (신앙 활동 · 3D 공간 둘러보기 · 배우기 · 예절과 주의).
 * "처음이에요 / 이미 믿고 있어요"는 그대로 두고, 고른 값에 따라 들어가기 버튼 순서를 바꾼다.
 */
export default function ReligionDetail({ id, tab }: { id: string; tab?: RelTab }) {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const mode = useStore((s) => s.modes[id] ?? 'learn')
  const def = worldById(id)
  const [L, setL] = useState<Learn | null>(null)
  const [openLesson, setOpenLesson] = useState(0)
  const cur: RelTab = tab && TABS.includes(tab) ? tab : 'activities'

  useEffect(() => {
    if (!def) return
    let alive = true
    def.learn().then((m) => alive && setL(lang === 'en' ? m.default.en : m.default.ko))
    return () => { alive = false }
  }, [def, lang])

  if (!def) return null
  const setMode = (m: 'learn' | 'practice') => update((s) => ({ modes: { ...s.modes, [id]: m } }))
  const placeName = (pid: string) => {
    const p = def.places.find((x) => x.id === pid)
    return p ? (lang === 'en' ? p.en : p.ko) : pid
  }
  const tabLabel: Record<RelTab, string> = { activities: t.r.practice, spaces: t.r.explore, learn: t.r.learn, etiquette: t.r.etiquette }

  if (!L) return <div className="rel-loading"><div className="spinner" /></div>

  const activities = (
    <section className="rel-sec">
      <ul className="acts">
        {L.activities.map((a) => (
          <li key={a.name} className="act">
            <div className="act-img"><img src={photo(id, a.img)} alt="" loading="lazy" width="640" height="420" /></div>
            <div className="act-body">
              <h3>{a.name}</h3>
              <p className="act-text">{a.text}</p>
              <h4>{t.r.meaning}</h4>
              <p>{a.meaning}</p>
              <h4>{t.r.how}</h4>
              <ol className="act-steps">{a.steps.map((s) => <li key={s}>{s}</li>)}</ol>
              {a.place ? (
                <a className="button" href={href(`w/${id}/${a.place}`)}>{t.r.tryIt} · {placeName(a.place)} →</a>
              ) : (
                <p className="hint">{t.r.learnOnly}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  )

  const spaces = (
    <section className="rel-sec">
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
                <img src={photo(id, p.id)} alt="" loading="lazy" width="640" height="400" />
                <span>
                  <strong>{lang === 'en' ? p.en : p.ko}</strong>
                  {p.desc && <em>{lang === 'en' ? p.desc.en : p.desc.ko}</em>}
                  <small>{t.r.enter3d} →</small>
                </span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  )

  const learn = (
    <>
      <section className="rel-sec">
        <h2>{t.r.history}</h2>
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
      <section className="rel-sec">
        <h2>{t.r.figures}</h2>
        <dl className="figures">
          {L.figures.map((f) => (
            <div key={f.name}><dt>{f.name}</dt><dd>{f.text}</dd></div>
          ))}
        </dl>
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
    </>
  )

  const etiquette = (
    <section className="rel-sec">
      <ul className="etiquette">{L.etiquette.map((e) => <li key={e}>{e}</li>)}</ul>
    </section>
  )

  return (
    <div className="rel" id={`rel-${id}`}>
      <section className="rel-hero">
        <img src={photo(id, COVER[id] ?? def.places[0].id)} alt="" className="rel-hero-img" />
        <div className="rel-hero-shade" />
        <div className="rel-hero-in">
          <h1>{L.title}</h1>
          <p className="rel-sub">{L.sub}</p>
        </div>
      </section>

      <div className="rel-body">
        <p className="rel-intro">{L.intro}</p>
        <div className="rel-start">
          <div className="seg mode" role="radiogroup" aria-label={t.r.modeLabel}>
            <button role="radio" aria-checked={mode === 'learn'} onClick={() => setMode('learn')}>{t.r.modeLearn}</button>
            <button role="radio" aria-checked={mode === 'practice'} onClick={() => setMode('practice')}>{t.r.modePractice}</button>
          </div>
          <div className="row">
            <a className="button primary" href={href(mode === 'learn' ? `w/${id}/${L.start.place}/tour` : `w/${id}/${L.start.place}`)}>{mode === 'learn' ? t.r.startTour : t.r.enterNow}</a>
            <a className="button" href={href(mode === 'learn' ? `w/${id}/${L.start.place}` : `w/${id}/${L.start.place}/tour`)}>{mode === 'learn' ? t.r.enterNow : t.r.startTour}</a>
          </div>
          {mode === 'learn' && <p className="hint">{t.r.startK} · {L.start.title}. {L.start.text}</p>}
        </div>

        <nav className="rel-tabs" role="tablist">
          {TABS.map((k) => (
            <button key={k} role="tab" aria-selected={cur === k} className={cur === k ? 'on' : ''} onClick={() => go(`explore/${id}/${k}`)}>{tabLabel[k]}</button>
          ))}
        </nav>

        {cur === 'activities' ? activities : cur === 'spaces' ? spaces : cur === 'learn' ? learn : etiquette}

        <p className="sources">{t.r.sources}: {L.sources.join(' · ')}. {t.r.review}</p>
        <p className="disclaimer">{t.disclaimer}</p>
      </div>
    </div>
  )
}
