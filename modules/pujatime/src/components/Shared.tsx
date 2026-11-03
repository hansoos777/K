import { useEffect, useRef, useState } from 'react'
import type { DeityId } from '../data/deities'
import { localDeity, useT } from '../i18n'
import { DeityEmblem } from './DeityEmblem'
import { Overlay } from './Overlay'

export function Note({ children }: { children?: string }) {
  const t = useT()
  return <p className="note">{children ?? t.practices}</p>
}

export function Petals({ count = 16 }: { count?: number }) {
  return (
    <div className="petals" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <i
          key={i}
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i * 0.53) % 6}s`,
            animationDuration: `${7 + (i % 5)}s`,
            background: i % 3 ? '#f6a81f' : '#ec7f8e',
          }}
        />
      ))}
    </div>
  )
}

export function MantraPlayer({ id, repeats = 3 }: { id: DeityId; repeats?: number }) {
  const t = useT()
  const deity = localDeity(t, id)
  const { words } = deity.mantra
  const { meaning } = deity
  const [playing, setPlaying] = useState(false)
  const [slow, setSlow] = useState(false)
  const [loop, setLoop] = useState(false)
  const [active, setActive] = useState(-1)

  useEffect(() => {
    if (!playing) {
      setActive(-1)
      return
    }
    let i = 0
    const total = words.length * repeats
    setActive(0)
    const timer = setInterval(() => {
      i += 1
      if (i >= total && !loop) {
        setPlaying(false)
        return
      }
      setActive(i % words.length)
    }, slow ? 2600 : 1500)
    return () => clearInterval(timer)
  }, [playing, slow, loop, words.length, repeats])

  return (
    <div className="mantra">
      <p className="dev" lang="sa">
        {words.map((w, i) => (
          <span key={i} className={i === active ? 'lit' : ''}>{w.dev} </span>
        ))}
      </p>
      <p className="latin">
        {words.map((w, i) => (
          <span key={i} className={i === active ? 'lit' : ''}>{w.latin} </span>
        ))}
      </p>
      <p className="meaning">{meaning}</p>
      <div className="mantra-ctl">
        <button className="btn small" onClick={() => setPlaying((p) => !p)}>
          {playing ? t.pause : t.listen}
        </button>
        <button className={`chip ${slow ? 'on' : ''}`} aria-pressed={slow} onClick={() => setSlow((s) => !s)}>{t.slowly}</button>
        <button className={`chip ${loop ? 'on' : ''}`} aria-pressed={loop} onClick={() => setLoop((l) => !l)}>{t.repeat}</button>
      </div>
      <p className="note">{t.noVoice}</p>
    </div>
  )
}

export function DeitySheet({ id, onClose, action }: { id: DeityId; onClose: () => void; action?: { label: string; run: () => void } }) {
  const t = useT()
  const d = localDeity(t, id)
  const [seg, setSeg] = useState<'about' | 'symbols' | 'story'>('about')
  const segs: ['about' | 'symbols' | 'story', string][] = [['about', t.newHeading], ['symbols', t.symbolsHeading], ['story', t.storyOne]]
  return (
    <Overlay title={d.name} onClose={onClose}>
      <div className="detail-top">
        <DeityEmblem id={id} size={150} />
        <p className="dev-name" lang="sa">{d.devanagari}</p>
        <p className="eyebrow">{d.keywords.join(' · ')}</p>
      </div>
      <div className="segs">
        {segs.map(([k, label]) => (
          <button key={k} className={seg === k ? 'on' : ''} onClick={() => setSeg(k)}>{label}</button>
        ))}
      </div>
      <div className="seg-body">
        {seg === 'about' && (
          <>
            <p>{d.intro}</p>
            <p className="muted">{d.beginner}</p>
          </>
        )}
        {seg === 'symbols' && <ul>{d.symbols.map((x) => <li key={x}>{x}</li>)}</ul>}
        {seg === 'story' && <p>{d.story}</p>}
      </div>
      <Note>{t.telling}</Note>
      {action && <div className="foot"><button className="btn wide" onClick={action.run}>{action.label}</button></div>}
    </Overlay>
  )
}
