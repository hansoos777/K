import { BRAND } from '../brand'
import { useEffect, useState } from 'react'
import { DEITIES, type DeityId } from '../data/deities'
import { dayDiff, upcoming } from '../data/festivals'
import { localDeity, localFestival, useT } from '../i18n'
import { DeityEmblem, DeityFigure } from '../components/DeityEmblem'
import { Overlay } from '../components/Overlay'
import { MantraPlayer, Note } from '../components/Shared'
import { SongList } from '../components/Songs'
import { FestivalCalendar } from './Festivals'
import { Hall } from './Hall'
import { autoSong, stopSong } from '../lib/songPlayer'

// 요일별로 전통적으로 많이 연결되는 신. 일요일은 공통 공간이라 임의로 배정.
const WEEK: DeityId[] = ['krishna', 'shiva', 'durga', 'ganesha', 'vishnu', 'lakshmi', 'hanuman']

function Temple({ id, onBack, onCeremony, onHall }: { id: DeityId; onBack: () => void; onCeremony: (id: DeityId) => void; onHall: () => void }) {
  const t = useT()
  const d = localDeity(t, id)
  const [seg, setSeg] = useState<'story' | 'mantra' | 'songs' | 'how'>('story')
  const segs: ['story' | 'mantra' | 'songs' | 'how', string][] = [['story', t.storyOne], ['mantra', t.mantraHeading], ['songs', t.songsHeading], ['how', t.worshipHeading]]
  return (
    <Overlay title={t.templeName(d.name)} onClose={onBack}>
      <div className="detail-top">
        <DeityEmblem id={id} size={150} />
        <p className="dev-name" lang="sa">{d.devanagari}</p>
      </div>
      <div className="segs">
        {segs.map(([k, label]) => (
          <button key={k} className={seg === k ? 'on' : ''} onClick={() => setSeg(k)}>{label}</button>
        ))}
      </div>
      <div className="seg-body">
        {seg === 'story' && <p>{d.story}</p>}
        {seg === 'mantra' && <MantraPlayer id={id} />}
        {seg === 'songs' && <SongList id={id} />}
        {seg === 'how' && (
          <>
            <p>{d.beginner}</p>
            <Note />
          </>
        )}
      </div>
      <div className="foot">
        <button className="btn wide" onClick={onHall}>{t.enterHall}</button>
        <button className="btn ghost wide" onClick={() => onCeremony(id)}>{t.beginHere}</button>
      </div>
    </Overlay>
  )
}

export function Mandir({ onCeremony }: { onCeremony: (id: DeityId) => void }) {
  const t = useT()
  const [temple, setTemple] = useState<DeityId | null>(null)
  const [hall, setHall] = useState<DeityId | null>(null)
  const [calendar, setCalendar] = useState(false)
  const active = temple ?? hall

  // 신을 고르면 그 신의 곡이 나오고, 사원 안으로 들어가도 이어짐
  useEffect(() => {
    if (!active) return
    autoSong(active)
    return stopSong
  }, [active])

  const todayDeity = localDeity(t, WEEK[new Date().getDay()])
  const next = upcoming()[0]
  const days = next ? dayDiff(next.date) : 0

  if (hall) return <Hall deity={hall} onExit={() => setHall(null)} />
  return (
    <div className="screen">
      <header className="head">
        <p className="brand">{BRAND}</p>
        <h1>{t.mandirTitle}</h1>
      </header>

      <section className="feature" onClick={() => setHall(todayDeity.id)}>
        <DeityFigure id={todayDeity.id} />
        <div className="feature-text">
          <p className="eyebrow">{t.ceremonyHeading}</p>
          <h2>{t.ceremonyName(todayDeity.name)}</h2>
          <p className="muted">{t.ceremonyOpen}</p>
          <span className="btn small">{t.enterHall}</span>
        </div>
      </section>

      {next && (
        <button className="row festival-row" onClick={() => setCalendar(true)}>
          <span><strong>{localFestival(t, next).name}</strong><small>{days === 0 ? t.today : days === 1 ? t.tomorrow : t.inDays(days)}</small></span>
          <em>{t.calendarTitle} ›</em>
        </button>
      )}

      <p className="eyebrow">{t.templesHeading}</p>
      <div className="temple-rail">
        {DEITIES.map((base) => localDeity(t, base.id)).map((d) => (
          <button key={d.id} onClick={() => setTemple(d.id)}>
            <DeityEmblem id={d.id} size={84} />
            <strong>{d.name}</strong>
          </button>
        ))}
      </div>

      {temple && <Temple id={temple} onBack={() => setTemple(null)} onCeremony={onCeremony} onHall={() => { setHall(temple); setTemple(null) }} />}
      {calendar && <FestivalCalendar onClose={() => setCalendar(false)} onPuja={onCeremony} />}
    </div>
  )
}
