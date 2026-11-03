import { useEffect, useMemo, useState } from 'react'
import { localDeity, useT } from '../i18n'
import { softChime, ringBell } from '../lib/sound'
import { beadTap } from '../lib/reminders'
import { track } from '../lib/stats'
import { useBack } from '../lib/back'
import { useShrine } from '../lib/store'

const BEADS = 108

// 자파 말라: 만트라를 외울 때 구슬을 한 알씩 넘기는 수행. 점수나 기록 없이 세기만 함.
export function Japa({ onExit }: { onExit: () => void }) {
  useBack(onExit)
  const s = useShrine()!
  const t = useT()
  const deity = localDeity(t, s.mainDeity)
  const [count, setCount] = useState(0)

  useEffect(() => track('japa'), [])

  const beads = useMemo(
    () =>
      Array.from({ length: BEADS }, (_, i) => {
        const a = (i / BEADS) * Math.PI * 2 - Math.PI / 2
        return { x: 160 + Math.cos(a) * 138, y: 160 + Math.sin(a) * 138 }
      }),
    [],
  )

  const tap = () => {
    if (count >= BEADS) return
    const next = count + 1
    setCount(next)
    beadTap()
    if (next === BEADS) ringBell()
    else if (next % 27 === 0) softChime()
  }

  return (
    <div className="japa" onClick={tap}>
      <button className="back" onClick={(e) => { e.stopPropagation(); onExit() }}>{t.back}</button>
      <h1>{t.japa}</h1>
      <svg viewBox="0 0 320 320" aria-hidden="true">
        <circle cx="160" cy="160" r="138" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
        {beads.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y} r="5.6" fill={i < count ? 'var(--accent)' : 'var(--bead)'} stroke={i < count ? '#ffd27a' : 'none'} />
        ))}
        <circle cx="160" cy="22" r="9.5" fill="#f59e0b" />
        <text x="160" y="176" textAnchor="middle" fontSize="60" fill="var(--ink)" fontFamily="var(--serif)">{count}</text>
        <text x="160" y="204" textAnchor="middle" fontSize="15" fill="var(--muted)">/ {BEADS}</text>
      </svg>
      <p className="dev" lang="sa">{deity.mantra.words.map((w) => w.dev).join(' ')}</p>
      <p className="latin">{deity.mantra.words.map((w) => w.latin).join(' ')}</p>
      <p className="muted" aria-live="polite">{count >= BEADS ? t.japaDone : t.japaTap}</p>
      {count >= BEADS && (
        <button className="btn" onClick={(e) => { e.stopPropagation(); setCount(0) }}>{t.japaAgain}</button>
      )}
    </div>
  )
}
