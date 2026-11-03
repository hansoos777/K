import { useMemo, useState } from 'react'
import { toggleMusic } from '../../core/audio'
import type { WorldProps } from '../../core/registry'
import { getState, useStore } from '../../core/store'
import { useT, useLocal } from '../../i18n'
import { Btn, Note } from '../../ui/kit'
import { Space, type PlaceScene } from '../../ui/Space'
import { mysteryOf, seasonOf, upcoming } from './calendar'
import S from './strings'
import TOUR from './tour'
import { buildConfessional, buildGrotto, buildParish } from './three'
import { buildCathedral } from './cathedral'

type T = (typeof S)['ko']

function rosarySteps(t: T, kind: keyof T['mysteries']) {
  const m = t.mysteries[kind]
  const steps: { label: string; decade?: number; bead?: number }[] = [
    { label: t.beads.cross },
    { label: t.beads.our },
    ...[1, 2, 3].map((n) => ({ label: `${t.beads.intro3} ${n}/3` })),
    { label: t.beads.glory },
  ]
  m.list.forEach((title, d) => {
    steps.push({ label: `${t.beads.decade(d + 1)} · ${title}`, decade: d })
    steps.push({ label: t.beads.our, decade: d })
    for (let b = 0; b < 10; b++) steps.push({ label: `${t.beads.hail} ${b + 1}/10`, decade: d, bead: b })
    steps.push({ label: t.beads.glory, decade: d, bead: 10 })
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
    <>
      <div className="seg wrap" role="radiogroup" aria-label={t.todayMystery}>
        {(Object.keys(t.mysteries) as (keyof T['mysteries'])[]).map((k) => (
          <button key={k} role="radio" aria-checked={k === kind} onClick={() => { setKind(k); setI(0) }}>
            {t.mysteries[k].name}{k === mysteryOf() ? ` · ${t.todayTag}` : ''}
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
    </>
  )
}

function Calendar({ t }: { t: T }) {
  const lang = useStore((s) => s.lang)
  const now = seasonOf()
  return (
    <>
      <p className="season">
        <span className={`swatch c-${now.color}`} aria-hidden="true" />
        {t.seasonNow} <strong>{t.seasons[now.season]}</strong> · {t.colorLabel} {t.colors[now.color]}
      </p>
      <h3>{t.upcoming}</h3>
      <ul className="feasts">
        {upcoming().map((f) => (
          <li key={f.key + f.date.getTime()}>
            <time>{f.date.toLocaleDateString(lang === 'en' ? 'en' : 'ko', { month: 'long', day: 'numeric', weekday: 'short' })}</time>
            {t.feasts[f.key]}
          </li>
        ))}
      </ul>
      <Note>{t.calNote}</Note>
    </>
  )
}

function Way({ t }: { t: T }) {
  const [i, setI] = useState(0)
  return (
    <div className="way">
      <p className="rosary-step" aria-live="polite"><small>{t.station(i + 1)}</small><br />{t.stations[i]}</p>
      <div className="beads" aria-hidden="true">
        {t.stations.map((_, n) => <span key={n} className={`bead sq ${n <= i ? 'on' : ''}`} />)}
      </div>
      <div className="row">
        <Btn onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>{t.prev}</Btn>
        {i < 13 ? <Btn onClick={() => setI(i + 1)}>{t.next}</Btn> : <Btn onClick={() => setI(0)}>{t.restart}</Btn>}
      </div>
      <Note>{t.wayNote}</Note>
    </div>
  )
}

function DefList({ items }: { items: [string, string][] }) {
  return <dl className="deflist">{items.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl>
}

export default function CatholicWorld({ place, tour }: WorldProps) {
  const t = useLocal(S)
  const g = useLocal(TOUR)
  const c = useT()
  const candleRun = (api: Record<string, () => void>) => {
    api.candle?.()
    return t.candleCount(getState().candles + 1) + ' · ' + t.candleNote.split('.')[0]
  }
  const organ = () => (toggleMusic('cathedral-organ') ? t.organ : getState().sound ? undefined : c.soundOff)
  const scene = (p: string): PlaceScene => {
    switch (p) {
      case 'gothic':
        return {
          build: buildCathedral,
          intro: t.intro.gothic,
          actions: [
            { id: 'candle', label: t.candleTitle, icon: 'candle', run: candleRun },
            { id: 'organ', label: t.organ, icon: 'music', run: organ },
            { id: 'way', label: t.wayTitle, icon: 'path', panel: <Way t={t} /> },
            { id: 'arch', label: t.gothicTitle, icon: 'door', panel: <DefList items={t.gothic} /> },
          ],
          gestures: g.gestures,
          spots: g.spots,
          tour: g.tour,
        }
      case 'grotto':
        return {
          build: buildGrotto,
          intro: t.intro.grotto,
          actions: [
            { id: 'candle', label: t.candleTitle, icon: 'candle', run: candleRun },
            { id: 'rosary', label: t.rosaryTitle, icon: 'beads', panel: <Rosary t={t} /> },
          ],
          gestures: g.gestures,
          spots: g.spots,
        }
      case 'confessional':
        return {
          build: buildConfessional,
          intro: t.intro.confessional,
          actions: [
            { id: 'steps', label: t.confTitle, icon: 'note', panel: <><DefList items={t.confSteps} /><Note>{t.confPrivacy}</Note></> },
          ],
        }
      default:
        return {
          build: buildParish,
          intro: t.intro.parish,
          actions: [
            { id: 'bell', label: t.bell, icon: 'bell', run: (api) => { api.bell?.() } },
            { id: 'parts', label: t.partsTitle, icon: 'info', panel: <DefList items={t.parts} /> },
            { id: 'mass', label: t.massTitle, icon: 'book', panel: <DefList items={t.mass} /> },
            { id: 'cal', label: t.calTitle, icon: 'calendar', panel: <Calendar t={t} /> },
          ],
          gestures: g.gestures,
          spots: g.spots,
        }
    }
  }
  return <Space id="catholic" place={place} scene={scene} tourMode={tour} />
}
