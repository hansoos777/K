import { useEffect, useState } from 'react'
import { worldById } from '../core/registry'
import { go, href } from '../core/router'
import { update, useStore } from '../core/store'
import type { Figure, Learn, Quiz } from '../learn/types'
import { useT } from '../i18n'
import { COVER, photo } from './Home'
import Course from './Course'
import { Icon } from './icons'
import { EXT, img, Photo } from './Photo'

export type RelTab = 'activities' | 'learn' | 'terms' | 'etiquette' | 'spaces' | 'faq'
const TABS: RelTab[] = ['activities', 'learn', 'terms', 'etiquette', 'spaces', 'faq']

/** 이름 + 설명 목록 (인물 · 경전 · 상징 · 문화) */
function Defs({ items }: { items: Figure[] }) {
  return (
    <dl className="figures">
      {items.map((f) => <div key={f.name}><dt>{f.name}</dt><dd>{f.text}</dd></div>)}
    </dl>
  )
}

/** 확인 퀴즈: 한 문제씩, 고르면 정답·해설·다시 공부하기 */
function QuizBox({ id, items, lessonTitle, onStudy }: { id: string; items: Quiz[]; lessonTitle: (i: string) => string; onStudy: (i: string) => void }) {
  const t = useT()
  const [i, setI] = useState(0)
  const [pick, setPick] = useState<number | null>(null)
  const [right, setRight] = useState(0)
  const done = i >= items.length
  const q = items[i]
  const choose = (k: number) => {
    if (pick !== null) return
    setPick(k)
    if (k === q.answer) setRight((n) => n + 1)
  }
  const next = () => {
    const n = i + 1
    if (n >= items.length) {
      const score = right
      update((s) => {
        const prev = s.quizzes[id]
        return { quizzes: { ...s.quizzes, [id]: { last: score, best: Math.max(score, prev?.best ?? 0), total: items.length, at: Date.now() } } }
      })
    }
    setI(n)
    setPick(null)
  }
  if (done) {
    return (
      <div className="quiz">
        <p className="quiz-score">{t.r.quizDone(right, items.length)}</p>
        <button className="button" onClick={() => { setI(0); setRight(0); setPick(null) }}>{t.r.quizAgain}</button>
      </div>
    )
  }
  return (
    <div className="quiz">
      <p className="quiz-n">{i + 1} / {items.length}</p>
      <p className="quiz-q">{q.q}</p>
      <div className="quiz-opts">
        {q.options.map((o, k) => (
          <button key={o} className={pick === null ? '' : k === q.answer ? 'right' : k === pick ? 'wrong' : ''} onClick={() => choose(k)} disabled={pick !== null && k !== pick && k !== q.answer}>
            {o}
          </button>
        ))}
      </div>
      {pick !== null && (
        <div className="quiz-ex">
          <strong>{pick === q.answer ? t.r.quizRight : t.r.quizWrong}</strong>
          <p>{q.explain}</p>
          <div className="row">
            <button className="button primary" onClick={next}>{i + 1 < items.length ? t.r.quizNext : t.r.quizFinish}</button>
            {q.lesson !== undefined && <button className="text-link" onClick={() => onStudy(q.lesson!)}>{t.r.quizStudy}: {lessonTitle(q.lesson)}</button>}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * 종교 상세: 대표 이미지 위에 종교명 · 한 줄 소개, 아래 소개 글과 시작 버튼,
 * 그 아래 안쪽 탭 6개 (신앙 활동 · 배우기 · 용어 사전 · 예절과 주의 · 3D 공간 · 자주 묻는 질문).
 * 메뉴 단계를 늘리지 않도록 나머지 영역(경전·인물·상징·문화·축제)은 배우기 탭 안의 섹션으로 둔다.
 */
export default function ReligionDetail({ id, tab }: { id: string; tab?: RelTab }) {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const mode = useStore((s) => s.modes[id] ?? 'learn')
  const def = worldById(id)
  const [L, setL] = useState<Learn | null>(null)
  const [openLesson, setOpenLesson] = useState('')
  const [openAct, setOpenAct] = useState(-1)
  const [openFaq, setOpenFaq] = useState(0)
  const [termQ, setTermQ] = useState('')
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
  const tabLabel: Record<RelTab, string> = { activities: t.r.practice, learn: t.r.learn, terms: t.r.terms, etiquette: t.r.etiquette, spaces: t.r.explore, faq: t.r.faq }
  const cover = photo(id, COVER[id] ?? def.places[0].id)

  if (!L) return <div className="rel-loading"><div className="spinner" /></div>

  const study = (i: string) => {
    setOpenLesson(i)
    setTimeout(() => document.getElementById(`lesson-${i}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }

  const activities = (
    <section className="rel-sec">
      <h2>{t.r.practice}</h2>
      <ul className="acts">
        {L.activities.map((a, i) => (
          <li key={a.name} className={`act ${openAct === i ? 'open' : ''}`}>
            <button className="act-row" onClick={() => setOpenAct(openAct === i ? -1 : i)} aria-expanded={openAct === i}>
              <span className="act-thumb"><Photo src={img(`act_${id}_${i + 1}`)} fallback={photo(id, a.img)} w={176} h={128} /></span>
              <span className="act-head"><strong>{a.name}</strong><span>{a.text}</span></span>
              <span className="act-chev" aria-hidden="true"><Icon name="chev" size={18} /></span>
            </button>
            {openAct === i && (
              <div className="act-body">
                <h4>{t.r.meaning}</h4>
                <p>{a.meaning}</p>
                <h4>{t.r.how}</h4>
                <ol className="act-steps">{a.steps.map((s) => <li key={s}>{s}</li>)}</ol>
                {a.place ? (
                  <a className="button primary" href={href(`w/${id}/${a.place}`)}>{t.r.tryIt} · {placeName(a.place)}</a>
                ) : (
                  <p className="hint">{t.r.learnOnly}</p>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )

  const learn = (
    <>
      <p className="status-note"><span className="badge">{t.r.status[L.status]}</span>{t.r.statusNote}</p>
      <section className="rel-sec">
        {t.r.enMore && <p className="hint">{t.r.enMore}</p>}
        <Course scope={id} world={id} lessons={L.lessons} open={openLesson} setOpen={setOpenLesson} />
      </section>
      {L.quiz.length > 0 && (
        <section className="rel-sec">
          <h2>{t.r.quiz}</h2>
          <QuizBox id={id} items={L.quiz} lessonTitle={(i) => L.lessons.find((l) => l.id === i)?.title ?? ''} onStudy={study} />
        </section>
      )}
      <section className="rel-sec"><h2>{t.r.scriptures}</h2><Defs items={L.scriptures} /></section>
      <section className="rel-sec"><h2>{t.r.figures}</h2><Defs items={L.figures} /></section>
      <section className="rel-sec"><h2>{t.r.symbols}</h2><Defs items={L.symbols} /></section>
      <section className="rel-sec"><h2>{t.r.culture}</h2><Defs items={L.culture} /></section>
      <section className="rel-sec" id="festivals">
        <h2>{t.r.festivals}</h2>
        <ul className="fest">{L.festivals.map((f) => <li key={f.name}><time>{f.when}</time><strong>{f.name}</strong><span>{f.text}</span></li>)}</ul>
        <p className="hint">{L.festivalNote}</p>
      </section>
      <section className="rel-sec">
        <a className="compare-link" href={href('explore/compare')}>
          <span><strong>{t.cmp.title}</strong><span>{t.cmp.sub}</span></span>
          <Icon name="chev" size={18} />
        </a>
      </section>
      <section className="rel-sec">
        <h2>{t.r.community}</h2>
        <p className="hint">{t.r.communityNote}</p>
      </section>
    </>
  )

  const q = termQ.trim().toLowerCase()
  const terms = (
    <section className="rel-sec">
      <h2>{t.r.terms}</h2>
      <label className="search">
        <Icon name="search" size={18} />
        <input value={termQ} onChange={(e) => setTermQ(e.target.value)} placeholder={t.r.termSearch} aria-label={t.r.termSearch} />
      </label>
      <dl className="terms">
        {L.glossary.filter((x) => !q || `${x.term} ${x.original ?? ''} ${x.def}`.toLowerCase().includes(q)).map((x) => (
          <div key={x.term}>
            <dt>{x.term}{x.original && <small>{x.original}</small>}</dt>
            <dd>{x.def}</dd>
          </div>
        ))}
      </dl>
    </section>
  )

  const etiquette = (
    <section className="rel-sec">
      <h2>{t.r.etiquette}</h2>
      <ul className="etiquette">{L.etiquette.map((e) => <li key={e}>{e}</li>)}</ul>
    </section>
  )

  const spaces = (
    <section className="rel-sec">
      <h2>{t.r.explore}</h2>
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

  const faq = (
    <section className="rel-sec">
      <h2>{t.r.faq}</h2>
      <div className="lessons">
        {L.faq.map((f, i) => (
          <article key={f.q} className={`lesson ${openFaq === i ? 'open' : ''}`}>
            <button className="lesson-h" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>
              <span className="num">Q</span><span className="lesson-t">{f.q}</span><span className="chev">{openFaq === i ? '−' : '+'}</span>
            </button>
            {openFaq === i && <div className="lesson-b"><p>{f.a}</p></div>}
          </article>
        ))}
      </div>
    </section>
  )

  return (
    <div className="rel" id={`rel-${id}`}>
      <section className="rel-cover">
        <Photo src={img(EXT[id])} fallback={cover} className="rel-cover-img" w={1600} h={900} eager />
        <div className="rel-cover-in">
          <h1>{L.title}</h1>
          <p>{L.sub}</p>
        </div>
      </section>

      <nav className="rel-tabs" role="tablist">
        {TABS.map((k) => (
          <button key={k} role="tab" aria-selected={cur === k} className={cur === k ? 'on' : ''} onClick={() => go(`explore/${id}/${k}`)}>{tabLabel[k]}</button>
        ))}
      </nav>

      <div className="rel-body">
        {cur === 'activities' && (
          <>
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
          </>
        )}

        {cur === 'activities' ? activities : cur === 'learn' ? learn : cur === 'terms' ? terms : cur === 'etiquette' ? etiquette : cur === 'spaces' ? spaces : faq}

        <p className="sources">{t.r.sources}: {L.sources.join(' · ')}. {t.r.review}</p>
        <p className="disclaimer">{t.disclaimer}</p>
      </div>
    </div>
  )
}
