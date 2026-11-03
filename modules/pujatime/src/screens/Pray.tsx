import { BRAND } from '../brand'
import { useState } from 'react'
import { DEITIES, type DeityId } from '../data/deities'
import { LIBRARY } from '../data/library'
import { localDeity, useT } from '../i18n'
import { toggleVoice } from '../lib/ambient'
import { DeityEmblem } from '../components/DeityEmblem'
import { Overlay } from '../components/Overlay'
import { DeitySheet } from '../components/Shared'

type Seg = 'mantra' | 'practice' | 'deities'

function Prayers() {
  const t = useT()
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const p = LIBRARY[i]
  const x = t.library[p.id as keyof typeof t.library]
  const go = (d: number) => {
    setI((i + d + LIBRARY.length) % LIBRARY.length)
  }
  return (
    <div className="pager">
      <article className="prayer-card">
        <p className="eyebrow">{x.source}</p>
        <h2>{x.title}</h2>
        <p className="dev" lang="sa">{p.dev}</p>
        <p className="latin">{p.latin}</p>
        <div className="rule" />
        <p className="meaning">{x.meaning}</p>
        {p.audio && (
          <button className="btn small" onClick={() => setPlaying(toggleVoice(p.audio!, () => setPlaying(false)))}>
            {playing ? t.pause : t.listen}
          </button>
        )}
      </article>
      <div className="pager-nav">
        <button onClick={() => go(-1)} aria-label={t.prevMonth}>‹</button>
        <span>{i + 1} / {LIBRARY.length}</span>
        <button onClick={() => go(1)} aria-label={t.nextMonth}>›</button>
      </div>
    </div>
  )
}

export function Pray({ onBack, onJapa, onDarshan }: { onBack: () => void; onJapa: () => void; onDarshan: () => void }) {
  const t = useT()
  const [seg, setSeg] = useState<Seg>('mantra')
  const [open, setOpen] = useState<DeityId | null>(null)
  const [basic, setBasic] = useState<number | null>(null)
  const segs: [Seg, string][] = [['mantra', t.segMantra], ['practice', t.segPractice], ['deities', t.segDeities]]

  return (
    <div className="screen">
      <header className="head">
        <p className="brand">{BRAND}</p>
        <h1>{t.tabs.pray}</h1>
        <button className="exit-btn head-back" onClick={onBack}>{t.back}</button>
      </header>
      <div className="segs" role="tablist">
        {segs.map(([id, label]) => (
          <button key={id} role="tab" aria-selected={seg === id} className={seg === id ? 'on' : ''} onClick={() => setSeg(id)}>{label}</button>
        ))}
      </div>

      {seg === 'mantra' && <Prayers />}

      {seg === 'practice' && (
        <div className="list">
          <button className="row" onClick={onJapa}><span><strong>{t.japa}</strong><small>{t.japaTap}</small></span><i>›</i></button>
          <button className="row" onClick={onDarshan}><span><strong>{t.quietMoment}</strong><small>{t.darshanBody}</small></span><i>›</i></button>
          <p className="eyebrow gap">{t.basicsHeading}</p>
          {t.basics.map((b, i) => (
            <button key={b.t} className="row slim" onClick={() => setBasic(i)}><span><strong>{b.t}</strong></span><i>›</i></button>
          ))}
        </div>
      )}

      {seg === 'deities' && (
        <div className="deity-grid">
          {DEITIES.map((base) => localDeity(t, base.id)).map((d) => (
            <button key={d.id} onClick={() => setOpen(d.id)}>
              <DeityEmblem id={d.id} size={72} />
              <strong>{d.name}</strong>
            </button>
          ))}
        </div>
      )}

      {open && <DeitySheet id={open} onClose={() => setOpen(null)} />}
      {basic !== null && (
        <Overlay title={t.basics[basic].t} onClose={() => setBasic(null)}>
          <p className="lead">{t.basics[basic].b}</p>
        </Overlay>
      )}
    </div>
  )
}
