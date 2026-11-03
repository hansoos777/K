import type { WorldProps } from '../../core/registry'
import { getState } from '../../core/store'
import { useLocal, useT } from '../../i18n'
import { Note } from '../../ui/kit'
import { Space, type PlaceScene } from '../../ui/Space'
import S, { PUJATIME_URL } from './strings'
import TOUR from './tour'
import { buildMandir } from './three'

/**
 * 힌두교 모듈. 지금은 만디르 3D 공간 + PujaTime 연결.
 * 매일 푸자·나의 신전·신상은 PujaTime에 있고, 나중에 이 폴더로 통합한다.
 */
function PujaTimeLink({ t }: { t: (typeof S)['ko'] }) {
  return (
    <>
      <p className="intro">{t.intro.pujatime}</p>
      <p><a className="btn btn-primary" href={PUJATIME_URL} target="_blank" rel="noopener">{t.open} ↗</a></p>
      <Note>{t.openNote}</Note>
      <h3>{t.hasTitle}</h3>
      <ul>{t.has.map((h) => <li key={h}>{h}</li>)}</ul>
    </>
  )
}

export default function MandirWorld({ place, tour }: WorldProps) {
  const t = useLocal(S)
  const g = useLocal(TOUR)
  const c = useT()
  const parts = <><dl className="deflist">{t.parts.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl><Note>{t.partsNote}</Note></>
  const scene = (p: string): PlaceScene => ({
    build: buildMandir,
    intro: p === 'pujatime' ? t.intro.pujatime : t.intro.mandir,
    actions: [
      { id: 'bell', label: t.ring, icon: 'bell', run: (api) => { api.bell?.(); return getState().sound ? t.ringNote : c.soundOff } },
      { id: 'diya', label: t.diya, icon: 'diya', run: (api) => { api.diya?.(); return t.diyaNote } },
      { id: 'aarti', label: g.aarti, icon: 'diya', run: (api) => { api.aarti?.(); return g.aartiDone } },
      { id: 'pujatime', label: 'PujaTime', icon: 'lotus', panel: <PujaTimeLink t={t} /> },
      { id: 'parts', label: t.partsTitle, icon: 'info', panel: parts },
    ],
    gestures: g.gestures,
    spots: g.spots,
    tour: p === 'mandir' ? g.tour : undefined,
  })
  return <Space id="mandir" place={place} scene={scene} tourMode={tour} />
}
