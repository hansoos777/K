import { useEffect, useRef, type RefObject } from 'react'
import { jukbi, toggleMusic } from '../../core/audio'
import type { WorldProps } from '../../core/registry'
import { getState, useStore } from '../../core/store'
import { useLocal, useT } from '../../i18n'
import { mmss, useCountdown } from '../../ui/hooks'
import { Btn, Note } from '../../ui/kit'
import { Space, type PlaceScene, type SceneApi } from '../../ui/Space'
import S from './strings'
import TOUR from './tour'
import { buildMeditation, buildCourtyard, sweepMsg } from './three'
import { buildDaeung } from './daeung'

type T = (typeof S)['ko']

function DefList({ items }: { items: [string, string][] }) {
  return <dl className="deflist">{items.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl>
}

/** 호흡 명상: 시작하면 아바타가 방석으로 가서 앉고(합장), 숨 원이 커졌다 작아짐 */
function Breath({ t, api }: { t: T; api: RefObject<SceneApi | null> }) {
  const cd = useCountdown(() => {
    jukbi(1)
    api.current?.stand?.()
  })
  const elapsed = cd.total - cd.left
  const inhale = elapsed % 10 < 4
  return (
    <>
      {cd.running ? (
        <div className="breath">
          <div className={`breath-orb ${inhale ? 'in' : 'out'}`} aria-hidden="true" />
          <span className="timer-phase" aria-live="polite">{inhale ? t.inhale : t.exhale}</span>
          <span className="timer-big">{mmss(cd.left)}</span>
          <Btn onClick={() => { cd.stop(); jukbi(1); api.current?.stand?.() }}>{t.end}</Btn>
        </div>
      ) : (
        <div className="row">
          {[3, 5, 10].map((m) => (
            <Btn key={m} onClick={() => { jukbi(3); api.current?.sit?.(); cd.start(m * 60) }}>{m}{t.min}</Btn>
          ))}
        </div>
      )}
      <Note>{t.breathNote}</Note>
    </>
  )
}

export default function TempleWorld({ place, tour }: WorldProps) {
  const t = useLocal(S)
  const g = useLocal(TOUR)
  const c = useT()
  const lanterns = useStore((s) => s.lanterns)
  const apiRef = useRef<SceneApi | null>(null)
  useEffect(() => () => { apiRef.current = null }, [])
  const soundOff = () => (getState().sound ? undefined : c.soundOff)
  const scene = (p: string): PlaceScene => {
    if (p === 'daeung')
      return {
        build: buildDaeung,
        intro: t.intro.daeung,
        actions: [
          { id: 'bow', label: t.bow, icon: 'pray', run: (api) => { api.bow?.(); return t.bowNote } },
          { id: 'incense', label: t.light, icon: 'incense', run: (api) => { api.incense?.(); return t.incenseNote.split('.')[0] } },
          { id: 'moktak', label: t.hit, icon: 'pray', run: (api) => { api.moktak?.(); return soundOff() } },
          { id: 'lantern', label: t.lanternTitle, icon: 'lantern', run: (api) => { api.lantern?.(); return t.lanternCount(lanterns + 1) } },
          { id: 'path', label: t.pathTitle, icon: 'path', panel: <><DefList items={t.path} /><Note>{t.pathNote}</Note></> },
        ],
        gestures: g.gestures,
        spots: g.spots,
        tour: g.tourHall,
      }
    if (p === 'meditation')
      return {
        build: (ctx) => {
          const b = buildMeditation(ctx)
          apiRef.current = b.api
          return b
        },
        intro: t.intro.meditation,
        actions: [
          { id: 'breath', label: t.breathTitle, icon: 'breath', panel: <Breath t={t} api={apiRef} /> },
          { id: 'stay', label: t.stayTitle, icon: 'lotus', panel: <Note>{t.stayNote}</Note> },
        ],
        gestures: g.gestures,
        spots: g.spots,
      }
    return {
      build: (ctx) => {
        sweepMsg.half = t.sweepHalf
        sweepMsg.done = t.sweepDone
        return buildCourtyard(ctx)
      },
      intro: t.intro.courtyard,
      actions: [
        { id: 'lantern', label: t.lanternTitle, icon: 'lantern', run: (api) => { api.lantern?.(); return t.lanternCount(lanterns + 1) } },
        { id: 'bell', label: t.strike, icon: 'bell', run: (api) => { api.bell?.(); return soundOff() ?? t.bellNote.split('.')[0] } },
        { id: 'moktak', label: t.hit, icon: 'pray', run: (api) => { api.moktak?.(); return soundOff() } },
        { id: 'incense', label: t.light, icon: 'incense', run: (api) => { api.incense?.(); return t.incenseNote.split('.')[0] } },
        { id: 'wind', label: t.wind, icon: 'wind', run: () => (toggleMusic('wind') ? t.wind : soundOff()) },
        { id: 'path', label: t.pathTitle, icon: 'path', panel: <><DefList items={t.path} /><Note>{t.pathNote}</Note><Note>{t.others}</Note></> },
      ],
      gestures: [...g.gestures.filter((x) => x.pose !== 'sit'), { id: 'sweep', label: t.sweep, pose: 'sweep', note: t.sweepNote }],
      spots: g.spots,
      tour: g.tour,
    }
  }
  return <Space id="temple" place={place} scene={scene} tourMode={tour} />
}
