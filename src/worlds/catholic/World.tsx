import { useMemo, useState } from 'react'
import { bell } from '../../core/audio'
import type { WorldProps } from '../../core/registry'
import { update, useStore } from '../../core/store'
import { useLocal } from '../../i18n'
import { Btn, Intro, Note, Panel, Scene, SoundButton, WorldFrame } from '../../ui/kit'
import { mysteryOf, seasonOf, upcoming } from './calendar'
import { Confessional, Gothic, Grotto, Parish } from './scenes'
import S from './strings'

type T = (typeof S)['ko']

function CandleRack({ t, lit, setLit }: { t: T; lit: number; setLit: (n: number) => void }) {
  const total = useStore((s) => s.candles)
  return (
    <Panel title={t.candleTitle}>
      <div className="candles" role="group" aria-label={t.candleTitle}>
        {Array.from({ length: 24 }, (_, i) => (
          <button
            key={i}
            className={`candle ${i < lit ? 'lit' : ''}`}
            aria-pressed={i < lit}
            aria-label={`${i + 1}`}
            disabled={i !== lit}
            onClick={() => {
              setLit(lit + 1)
              update((s) => ({ candles: s.candles + 1 }))
            }}
          >
            <span className="wick" />
          </button>
        ))}
      </div>
      <Note>{t.candleNote}</Note>
      <p className="hint">{t.candleCount(total)}</p>
    </Panel>
  )
}

/** 묵주기도 한 바퀴의 순서를 만든다 */
function rosarySteps(t: T, kind: keyof T['mysteries']) {
  const m = t.mysteries[kind]
  const steps: { label: string; decade?: number; bead?: number; mystery?: string }[] = [
    { label: t.beads.cross },
    { label: t.beads.our },
    ...[1, 2, 3].map((n) => ({ label: `${t.beads.intro3} ${n}/3` })),
    { label: t.beads.glory },
  ]
  m.list.forEach((title, d) => {
    steps.push({ label: `${t.beads.decade(d + 1)} · ${title}`, decade: d, mystery: title })
    steps.push({ label: t.beads.our, decade: d, mystery: title })
    for (let b = 0; b < 10; b++) steps.push({ label: `${t.beads.hail} ${b + 1}/10`, decade: d, bead: b, mystery: title })
    steps.push({ label: t.beads.glory, decade: d, bead: 10, mystery: title })
  })
  steps.push({ label: t.beads.end })
  return steps
}

function Rosary({ t }: { t: T }) {
  const [kind, setKind] = useState(mysteryOf())
  const [i, setI] = useState(0)
  const steps = useMemo(() => rosarySteps(t, kind), [t, kind])
  const s = steps[i]
  return (
    <Panel title={t.rosaryTitle}>
      <div className="seg wrap" role="radiogroup" aria-label={t.todayMystery}>
        {(Object.keys(t.mysteries) as (keyof T['mysteries'])[]).map((k) => (
          <button key={k} role="radio" aria-checked={k === kind} onClick={() => { setKind(k); setI(0) }}>
            {t.mysteries[k].name}{k === mysteryOf() ? ' ★' : ''}
          </button>
        ))}
      </div>
      <div className="rosary">
        <p className="rosary-step" aria-live="polite">{s.label}</p>
        {s.decade != null && (
          <div className="beads" aria-hidden="true">
            {Array.from({ length: 10 }, (_, b) => <span key={b} className={`bead ${s.bead != null && b <= s.bead ? 'on' : ''}`} />)}
          </div>
        )}
        <progress max={steps.length - 1} value={i} />
        <div className="row">
          <Btn onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>{t.prev}</Btn>
          {i < steps.length - 1 ? <Btn onClick={() => setI(i + 1)}>{t.next}</Btn> : <Btn onClick={() => setI(0)}>{t.restart}</Btn>}
        </div>
      </div>
      <Note>{t.rosaryNote}</Note>
    </Panel>
  )
}

function Calendar({ t }: { t: T }) {
  const lang = useStore((s) => s.lang)
  const now = seasonOf()
  const list = upcoming()
  return (
    <Panel title={t.calTitle}>
      <p className="season">
        <span className={`swatch c-${now.color}`} aria-hidden="true" />
        {t.seasonNow} <strong>{t.seasons[now.season]}</strong> · {t.colorLabel} {t.colors[now.color]}
      </p>
      <h3>{t.upcoming}</h3>
      <ul className="feasts">
        {list.map((f) => (
          <li key={f.key + f.date.getTime()}>
            <time>{f.date.toLocaleDateString(lang === 'en' ? 'en' : 'ko', { month: 'long', day: 'numeric', weekday: 'short' })}</time>
            {t.feasts[f.key]}
          </li>
        ))}
      </ul>
      <Note>{t.calNote}</Note>
    </Panel>
  )
}

function Way({ t }: { t: T }) {
  const [i, setI] = useState(0)
  return (
    <Panel title={t.wayTitle}>
      <div className="way">
        <p className="rosary-step" aria-live="polite"><small>{t.station(i + 1)}</small><br />{t.stations[i]}</p>
        <div className="beads" aria-hidden="true">
          {t.stations.map((_, n) => <span key={n} className={`bead sq ${n <= i ? 'on' : ''}`} />)}
        </div>
        <div className="row">
          <Btn onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>{t.prev}</Btn>
          {i < 13 ? <Btn onClick={() => setI(i + 1)}>{t.next}</Btn> : <Btn onClick={() => setI(0)}>{t.restart}</Btn>}
        </div>
      </div>
      <Note>{t.wayNote}</Note>
    </Panel>
  )
}

function DefList({ items }: { items: [string, string][] }) {
  return (
    <dl className="deflist">
      {items.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}
    </dl>
  )
}

export default function CatholicWorld({ place }: WorldProps) {
  const t = useLocal(S)
  const [lit, setLit] = useState(0)
  return (
    <WorldFrame id="catholic" place={place}>
      {(p) => (
        <>
          {p === 'parish' && (
            <>
              <Scene label={t.scene.parish}><Parish /></Scene>
              <Intro>{t.intro.parish}</Intro>
              <div className="row"><Btn onClick={() => bell('church')}>{t.bell}</Btn></div>
              <Panel title={t.partsTitle}><DefList items={t.parts} /></Panel>
              <Panel title={t.massTitle}><DefList items={t.mass} /></Panel>
              <Calendar t={t} />
            </>
          )}
          {p === 'gothic' && (
            <>
              <Scene label={t.scene.gothic}><Gothic /></Scene>
              <Intro>{t.intro.gothic}</Intro>
              <SoundButton kind="cathedral-organ" label={t.organ} />
              <Way t={t} />
              <Panel title={t.gothicTitle}><DefList items={t.gothic} /></Panel>
            </>
          )}
          {p === 'grotto' && (
            <>
              <Scene label={t.scene.grotto}><Grotto lit={lit} /></Scene>
              <Intro>{t.intro.grotto}</Intro>
              <CandleRack t={t} lit={lit} setLit={setLit} />
              <Rosary t={t} />
            </>
          )}
          {p === 'confessional' && (
            <>
              <Scene label={t.scene.confessional}><Confessional /></Scene>
              <Intro>{t.intro.confessional}</Intro>
              <Panel title={t.confTitle}><DefList items={t.confSteps} /></Panel>
              <Note>{t.confPrivacy}</Note>
            </>
          )}
        </>
      )}
    </WorldFrame>
  )
}
