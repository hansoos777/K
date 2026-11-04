import { useState } from 'react'
import { href } from '../core/router'
import { toggleIn, useStore } from '../core/store'
import type { Lesson } from '../learn/types'
import { useT } from '../i18n'
import { Icon } from './icons'

/** 생각해 보기: 답은 화면에만 있고 저장하지 않는다. 해설은 눌러서 본다 */
function Think({ q, guide }: { q: string; guide?: string }) {
  const t = useT()
  const [show, setShow] = useState(false)
  const [text, setText] = useState('')
  return (
    <div className="think">
      <b>{t.r.think}</b>
      <p>{q}</p>
      <textarea rows={2} value={text} onChange={(e) => setText(e.target.value)} placeholder={t.r.thinkPh} maxLength={1000} />
      {guide && (show ? <p className="think-guide"><small>{t.r.thinkGuide}</small>{guide}</p> : <button className="text-link" onClick={() => setShow(true)}>{t.r.thinkShow}</button>)}
    </div>
  )
}

/**
 * 학습 과정: 수준 거르기 · 진도 · 강의(학습 목표 → 본문 → 핵심 용어 → 핵심 정리 → 생각해 보기 → 다음 강의).
 * scope는 진도 저장 키 앞부분(종교 id 또는 'common'). world가 있으면 관련 3D 공간으로 이어 준다.
 */
export default function Course({ scope, world, lessons, open, setOpen }: { scope: string; world?: string; lessons: Lesson[]; open: string; setOpen: (id: string) => void }) {
  const t = useT()
  const learned = useStore((s) => s.learned)
  const saved = useStore((s) => s.savedLessons)
  const [lv, setLv] = useState<string>('all')
  const key = (l: Lesson) => `${scope}/${l.id}`
  const done = lessons.filter((l) => learned.includes(key(l))).length
  // 순서대로 들어야 하는 코스가 아니라 묶음: 이해하기(입문·기초) · 깊이 알아보기(심화) · 체험
  const group = (l: Lesson) => (l.level === 'advanced' ? 'deep' : l.level === 'experience' ? 'experience' : 'understand')
  const levels = (['understand', 'deep', 'experience'] as const).filter((k) => lessons.some((l) => group(l) === k))
  const shown = lessons.filter((l) => lv === 'all' || group(l) === lv)
  const go = (id: string) => {
    setOpen(id)
    setTimeout(() => document.getElementById(`lesson-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50)
  }
  return (
    <>
      <div className="sec-head">
        <h2>{t.r.course}</h2>
        <span className="progress-label">{t.r.progress(done, lessons.length)}</span>
      </div>
      <div className="progress" aria-hidden="true"><span style={{ width: `${(done / Math.max(1, lessons.length)) * 100}%` }} /></div>
      {levels.length > 1 && (
        <div className="chips level-filter" role="tablist">
          {['all', ...levels].map((k) => (
            <button key={k} role="tab" aria-selected={lv === k} className={`chip ${lv === k ? 'on' : ''}`} onClick={() => setLv(k)}>{k === 'all' ? t.r.levelAll : t.r.groups[k]}</button>
          ))}
        </div>
      )}
      <div className="lessons">
        {shown.map((l, i) => {
          const k = key(l)
          const isDone = learned.includes(k)
          const isOpen = open === l.id
          const next = shown[i + 1]
          return (
            <article key={l.id} id={`lesson-${l.id}`} className={`lesson ${isOpen ? 'open' : ''}`}>
              <button className="lesson-h" onClick={() => setOpen(isOpen ? '' : l.id)} aria-expanded={isOpen}>
                <span className="num">{isDone ? <Icon name="check" size={16} /> : String(i + 1).padStart(2, '0')}</span>
                <span className="lesson-t">{l.title}<small>{[t.r.level[l.level ?? 'intro'], l.unit, l.minutes && t.r.minutes(l.minutes)].filter(Boolean).join(' · ')}</small></span>
                <span className="chev">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="lesson-b">
                  {l.goal && <p className="lesson-goal"><b>{t.r.goal}</b>{l.goal}</p>}
                  {l.body.map((b) => <p key={b}>{b}</p>)}
                  {l.termDefs && l.termDefs.length > 0 && (
                    <dl className="lesson-defs"><b>{t.r.keyTerms}</b>{l.termDefs.map((d) => <div key={d.term}><dt>{d.term}</dt><dd>{d.def}</dd></div>)}</dl>
                  )}
                  {l.terms && l.terms.length > 0 && !l.termDefs && <p className="lesson-terms"><b>{t.r.keyTerms}</b>{l.terms.join(' · ')}</p>}
                  {(l.summary || (l.points && l.points.length > 0)) && (
                    <div className="lesson-points"><b>{t.r.points}</b>{l.summary ? <p>{l.summary}</p> : <ul>{l.points!.map((x) => <li key={x}>{x}</li>)}</ul>}</div>
                  )}
                  {l.think && <Think q={l.think} guide={l.thinkGuide} />}
                  <div className="row">
                    <button className={`button ${isDone ? '' : 'primary'}`} onClick={() => toggleIn('learned', k)}>{isDone ? t.r.unlearn : t.r.markLearned}</button>
                    <button className="button" onClick={() => toggleIn('savedLessons', k)}>{saved.includes(k) ? t.r.unsave : t.r.save}</button>
                    {world && l.place && <a className="text-link" href={href(`w/${world}/${l.place}`)}>{t.r.see3d} →</a>}
                    {next && <button className="text-link" onClick={() => go(next.id)}>{t.r.nextLesson}: {next.title}</button>}
                  </div>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </>
  )
}
