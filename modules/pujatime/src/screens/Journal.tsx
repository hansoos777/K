import { BRAND } from '../brand'
import { useState } from 'react'
import { addEntry, removeEntry, today, useShrine, type JournalKind } from '../lib/store'
import { LOCALE, useLang, useT } from '../i18n'
import { Overlay } from '../components/Overlay'

const KINDS: JournalKind[] = ['prayer', 'gratitude', 'reflection', 'moment']

export function Journal({ onBack }: { onBack: () => void }) {
  const s = useShrine()!
  const t = useT()
  const locale = LOCALE[useLang()]
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })
  const [selected, setSelected] = useState(today())
  const [kind, setKind] = useState<JournalKind>('gratitude')
  const [text, setText] = useState('')
  const [writing, setWriting] = useState(false)

  const year = month.getFullYear()
  const m = month.getMonth()
  const blanks = month.getDay()
  const days = new Date(year, m + 1, 0).getDate()
  const has = new Set(s.journal.map((e) => e.date))
  const entries = s.journal.filter((e) => e.date === selected)
  const isFuture = selected > today()
  const label = new Date(`${selected}T12:00:00`).toLocaleDateString(locale, { month: 'long', day: 'numeric' })

  return (
    <div className="screen">
      <header className="head">
        <p className="brand">{BRAND}</p>
        <h1>{t.journalTitle}</h1>
        <button className="exit-btn head-back" onClick={onBack}>{t.back}</button>
      </header>

      <section className="panel">
        <div className="cal-head">
          <button className="icon" onClick={() => setMonth(new Date(year, m - 1, 1))} aria-label={t.prevMonth}>‹</button>
          <strong>{month.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</strong>
          <button className="icon" onClick={() => setMonth(new Date(year, m + 1, 1))} aria-label={t.nextMonth}>›</button>
        </div>
        <div className="cal-grid">
          {t.days.map((d, i) => <span key={i} className="dow">{d}</span>)}
          {Array.from({ length: blanks }, (_, i) => <span key={`b${i}`} />)}
          {Array.from({ length: days }, (_, i) => {
            const iso = today(new Date(year, m, i + 1))
            return (
              <button key={iso} className={`${iso === selected ? 'sel' : ''} ${has.has(iso) ? 'has' : ''}`} onClick={() => setSelected(iso)} aria-label={iso}>
                {i + 1}
              </button>
            )
          })}
        </div>
      </section>

      <button className="row" onClick={() => setWriting(true)} disabled={isFuture && !entries.length}>
        <span><strong>{label}</strong><small>{entries.length ? t.entryCount(entries.length) : t.nothing}</small></span>
        <em>{isFuture ? '' : t.writeEntry} ›</em>
      </button>
      <p className="note">{t.journalSub}</p>

      {writing && (
        <Overlay title={label} onClose={() => setWriting(false)}>
          {!isFuture && (
            <>
              <div className="chips">
                {KINDS.map((k) => (
                  <button key={k} className={`chip ${kind === k ? 'on' : ''}`} aria-pressed={kind === k} onClick={() => setKind(k)}>{t.kinds[k]}</button>
                ))}
              </div>
              <textarea className="field" rows={4} value={text} placeholder={t.prompts[kind]} aria-label={t.entryAria} onChange={(e) => setText(e.target.value)} />
              <button
                className="btn wide"
                disabled={!text.trim()}
                onClick={() => {
                  addEntry(kind, text, selected)
                  setText('')
                }}
              >
                {t.save}
              </button>
            </>
          )}
          <div className="list entries">
            {entries.map((e) => (
              <article key={e.id} className="entry">
                <div>
                  <small>{t.kinds[e.kind]}</small>
                  <p>{e.text}</p>
                </div>
                <button className="icon" onClick={() => removeEntry(e.id)} aria-label={t.deleteEntry}>×</button>
              </article>
            ))}
          </div>
        </Overlay>
      )}
    </div>
  )
}
