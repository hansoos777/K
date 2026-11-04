import { useRef, useState, type RefObject } from 'react'
import { bell, toggleMusic } from '../../core/audio'
import type { WorldProps } from '../../core/registry'
import { getState, update, useStore } from '../../core/store'
import { useLocal, useT } from '../../i18n'
import { mmss, useCountdown } from '../../ui/hooks'
import { Btn, Note } from '../../ui/kit'
import { Space, type PlaceScene, type SceneApi } from '../../ui/Space'
import S from './strings'
import TOUR from './tour'
import { buildModern, buildPrayer } from './three'
import { buildChurch } from './church'

type T = (typeof S)['ko']

function Meditate({ t }: { t: T }) {
  const [i, setI] = useState(0)
  const v = t.verses[i]
  return (
    <>
      <div className="seg wrap" role="tablist">
        {t.verses.map((x, n) => <button key={x.ref} role="tab" aria-selected={n === i} onClick={() => setI(n)}>{x.theme}</button>)}
      </div>
      <article className="card-quiet">
        <h3>{v.ref}</h3>
        <ol>{v.q.map((q) => <li key={q}>{q}</li>)}</ol>
      </article>
      <Note>{t.meditateNote}</Note>
    </>
  )
}

function Silent({ t, api }: { t: T; api: RefObject<SceneApi | null> }) {
  const cd = useCountdown(() => { bell('church'); api.current?.stand?.() })
  return (
    <>
      {cd.running ? (
        <div className="timer">
          <span className="timer-big" aria-live="polite">{mmss(cd.left)}</span>
          <Btn onClick={() => { cd.stop(); api.current?.stand?.() }}>{t.stopTimer}</Btn>
        </div>
      ) : (
        <div className="row">
          {[1, 3, 5].map((m) => <Btn key={m} onClick={() => { bell('church'); api.current?.kneel?.(); cd.start(m * 60) }}>{m}{t.min}</Btn>)}
        </div>
      )}
      <Note>{t.silentNote}</Note>
    </>
  )
}

function Notes({ t }: { t: T }) {
  const prayers = useStore((s) => s.prayers)
  const lang = useStore((s) => s.lang)
  const [text, setText] = useState('')
  const save = () => {
    const v = text.trim()
    if (!v) return
    update((s) => ({ prayers: [{ id: crypto.randomUUID(), text: v.slice(0, 2000), at: Date.now() }, ...s.prayers].slice(0, 200) }))
    setText('')
  }
  return (
    <>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t.notesPlaceholder} rows={3} maxLength={2000} />
      <div className="row"><Btn onClick={save} disabled={!text.trim()}>{t.save}</Btn></div>
      <Note>{t.notesNote}</Note>
      {prayers.length === 0 ? <p className="hint">{t.empty}</p> : (
        <ul className="notes">
          {prayers.map((p) => (
            <li key={p.id}>
              <time>{new Date(p.at).toLocaleDateString(lang === 'en' ? 'en' : 'ko')}</time>
              <p>{p.text}</p>
              <button className="link" onClick={() => update((s) => ({ prayers: s.prayers.filter((x) => x.id !== p.id) }))}>{t.del}</button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

export default function ChristianWorld({ place, tour }: WorldProps) {
  const t = useLocal(S)
  const g = useLocal(TOUR)
  const c = useT()
  const apiRef = useRef<SceneApi | null>(null)
  const music = (k: 'hymn-organ' | 'worship-piano', label: string) => () => (toggleMusic(k) ? label : getState().sound ? undefined : c.soundOff)
  const scene = (p: string): PlaceScene => {
    if (p === 'modern')
      return {
        build: buildModern,
        intro: t.intro.modern,
        actions: [
          { id: 'pad', label: t.worshipPad, icon: 'music', run: music('worship-piano', t.worshipPad) },
          { id: 'modern', label: t.modernTitle, icon: 'info', panel: <ul>{t.modernList.map((o) => <li key={o}>{o}</li>)}</ul> },
          {
            id: 'diff', label: t.diffTitle, icon: 'book', panel: (
              <table className="compare">
                <thead><tr>{t.diffHead.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                <tbody>{t.diff.map(([a, b, d]) => <tr key={a}><th>{a}</th><td>{b}</td><td>{d}</td></tr>)}</tbody>
              </table>
            ),
          },
          { id: 'together', label: t.together, icon: 'calendar', panel: <Note>{t.togetherNote}</Note> },
        ],
        gestures: g.gestures,
        spots: g.spots,
      }
    if (p === 'prayer')
      return {
        build: (ctx) => {
          const b = buildPrayer(ctx)
          apiRef.current = b.api
          return b
        },
        intro: t.intro.prayer,
        actions: [
          { id: 'silent', label: t.silentTitle, icon: 'pray', panel: <Silent t={t} api={apiRef} /> },
          { id: 'notes', label: t.notesTitle, icon: 'note', panel: <Notes t={t} /> },
          { id: 'word', label: t.meditateTitle, icon: 'book', panel: <Meditate t={t} /> },
        ],
        gestures: g.gestures,
        spots: g.spots,
      }
    return {
      build: buildChurch,
      intro: t.intro.traditional,
      actions: [
        { id: 'hymn', label: t.hymn.split(' · ')[0], icon: 'music', run: music('hymn-organ', t.hymn) },
        { id: 'bell', label: t.bell, icon: 'bell', run: () => { bell('church'); return getState().sound ? undefined : c.soundOff } },
        { id: 'order', label: t.orderTitle.split(' (')[0], icon: 'note', panel: <><ol className="steps">{t.order.map((o) => <li key={o}>{o}</li>)}</ol><Note>{t.orderTitle}</Note></> },
        { id: 'word', label: t.meditateTitle, icon: 'book', panel: <Meditate t={t} /> },
      ],
      gestures: g.gestures,
      spots: g.spots,
      tour: g.tour,
    }
  }
  return <Space id="christian" place={place} scene={scene} tourMode={tour} />
}
