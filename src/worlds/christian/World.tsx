import { useState } from 'react'
import { bell } from '../../core/audio'
import type { WorldProps } from '../../core/registry'
import { update, useStore } from '../../core/store'
import { useLocal } from '../../i18n'
import { mmss, useCountdown } from '../../ui/hooks'
import { Btn, Intro, Note, Panel, Scene, SoundButton, WorldFrame } from '../../ui/kit'
import { Modern, PrayerRoom, Traditional } from './scenes'
import S from './strings'

type T = (typeof S)['ko']

function Meditate({ t }: { t: T }) {
  const [i, setI] = useState(0)
  const v = t.verses[i]
  return (
    <Panel title={t.meditateTitle}>
      <div className="seg wrap" role="tablist">
        {t.verses.map((x, n) => (
          <button key={x.ref} role="tab" aria-selected={n === i} onClick={() => setI(n)}>{x.theme}</button>
        ))}
      </div>
      <article className="card-quiet">
        <h3>{v.ref}</h3>
        <ol>{v.q.map((q) => <li key={q}>{q}</li>)}</ol>
      </article>
      <Note>{t.meditateNote}</Note>
    </Panel>
  )
}

function Silent({ t }: { t: T }) {
  const cd = useCountdown(() => bell('church'))
  return (
    <Panel title={t.silentTitle}>
      {cd.running ? (
        <div className="timer">
          <span className="timer-big" aria-live="polite">{mmss(cd.left)}</span>
          <Btn onClick={cd.stop}>{t.stopTimer}</Btn>
        </div>
      ) : (
        <div className="row">
          {[1, 3, 5].map((m) => (
            <Btn key={m} onClick={() => { bell('church'); cd.start(m * 60) }}>{m}{t.min}</Btn>
          ))}
        </div>
      )}
      <Note>{t.silentNote}</Note>
    </Panel>
  )
}

function Notes({ t }: { t: T }) {
  const prayers = useStore((s) => s.prayers)
  const [text, setText] = useState('')
  const lang = useStore((s) => s.lang)
  const save = () => {
    const v = text.trim()
    if (!v) return
    update((s) => ({ prayers: [{ id: crypto.randomUUID(), text: v.slice(0, 2000), at: Date.now() }, ...s.prayers].slice(0, 200) }))
    setText('')
  }
  return (
    <Panel title={t.notesTitle}>
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
    </Panel>
  )
}

export default function ChristianWorld({ place }: WorldProps) {
  const t = useLocal(S)
  return (
    <WorldFrame id="christian" place={place}>
      {(p) => (
        <>
          {p === 'traditional' && (
            <>
              <Scene label={t.scene.traditional}><Traditional /></Scene>
              <Intro>{t.intro.traditional}</Intro>
              <div className="row">
                <SoundButton kind="hymn-organ" label={t.hymn} />
                <Btn onClick={() => bell('church')}>{t.bell}</Btn>
              </div>
              <Panel title={t.orderTitle}>
                <ol className="steps">{t.order.map((o) => <li key={o}>{o}</li>)}</ol>
              </Panel>
              <Meditate t={t} />
            </>
          )}
          {p === 'modern' && (
            <>
              <Scene label={t.scene.modern}><Modern /></Scene>
              <Intro>{t.intro.modern}</Intro>
              <SoundButton kind="worship-pad" label={t.worshipPad} />
              <Panel title={t.modernTitle}>
                <ul>{t.modernList.map((o) => <li key={o}>{o}</li>)}</ul>
              </Panel>
              <Panel title={t.diffTitle}>
                <table className="compare">
                  <thead><tr>{t.diffHead.map((h) => <th key={h}>{h}</th>)}</tr></thead>
                  <tbody>{t.diff.map(([a, b, c]) => <tr key={a}><th>{a}</th><td>{b}</td><td>{c}</td></tr>)}</tbody>
                </table>
              </Panel>
              <Panel title={t.together}><Note>{t.togetherNote}</Note></Panel>
            </>
          )}
          {p === 'prayer' && (
            <>
              <Scene label={t.scene.prayer}><PrayerRoom /></Scene>
              <Intro>{t.intro.prayer}</Intro>
              <Silent t={t} />
              <Notes t={t} />
              <Meditate t={t} />
            </>
          )}
        </>
      )}
    </WorldFrame>
  )
}
