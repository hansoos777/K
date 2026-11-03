import { BRAND } from '../brand'
import { useState } from 'react'
import type { DeityId } from '../data/deities'
import { upcoming, dayDiff } from '../data/festivals'
import { WEEKDAY_DEITY } from '../data/library'
import { localDeity, localFestival, useT } from '../i18n'
import type { Dict } from '../i18n/en'
import { today, useShrine } from '../lib/store'
import { DELHI, panchang } from '../lib/panchang'
import { PanchangSheet, tithiName } from '../components/PanchangSheet'
import { DeityFigure } from '../components/DeityEmblem'
import { FestivalCalendar } from './Festivals'
import { MyShrine } from './MyShrine'

const MALA = Array.from({ length: 12 }, (_, i) => {
  const a = (i / 12) * Math.PI * 2
  return <circle key={i} cx={12 + Math.cos(a) * 8} cy={11 + Math.sin(a) * 8} r="1.5" />
})

function greeting(t: Dict) {
  const h = new Date().getHours()
  if (h < 12) return t.greetMorning
  if (h < 18) return t.greetAfternoon
  return t.greetEvening
}

// 홈은 스크롤 없이 한 화면. 신당 문을 누르면 3D 방이 전체 화면으로 열림.
export function Home({ onPuja, onDarshan, onJapa, onPray, onJournal, onCeremony, onProfile }: {
  onPuja: () => void
  onDarshan: () => void
  onJapa: () => void
  onPray: () => void
  onJournal: () => void
  onCeremony: (id: DeityId) => void
  onProfile: () => void
}) {
  const s = useShrine()!
  const t = useT()
  const [open, setOpen] = useState(false)
  const [sheet, setSheet] = useState(false)
  const [festival, setFestival] = useState(false)
  const next = upcoming()[0]
  const festiveLit = next ? s.festivalLamps.includes(next.id) : false
  const dayDeity = WEEKDAY_DEITY[new Date().getDay()]
  const days = next ? dayDiff(next.date) : 99

  const day = panchang(today(), s.place ?? DELHI)
  const moonDay = day.observances.length ? t.observances[day.observances[0]].name : tithiName(t, day.tithi)
  const event = days <= 14
    ? `${localFestival(t, next).name} · ${days === 0 ? t.today : days === 1 ? t.tomorrow : t.inDays(days)}`
    : dayDeity
      ? t.deityDay(localDeity(t, dayDeity).name)
      : ''
  const line = event ? `${moonDay} · ${event}` : moonDay

  // 연속 기록처럼 끊기면 벌받는 느낌이 들지 않게, 숫자 없이 지난 7일만 조용히 보여 줌
  const done = s.pujaDays ?? (s.lastPuja ? [s.lastPuja] : [])
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - 6 + i)
    return { key: today(d), label: t.days[d.getDay()], lit: done.includes(today(d)) }
  })
  const litToday = s.lastPuja === today()

  return (
    <div className="home">
      <header className="head row-head">
        <div>
          <p className="brand">{BRAND}</p>
          <h1>{s.name ? t.greetName(greeting(t), s.name) : greeting(t)}</h1>
        </div>
        <button className="icon" onClick={onProfile} aria-label={t.profileAria}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="3.2" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1" /></svg>
        </button>
      </header>

      <div className="toran" aria-hidden="true" />

      <div className="home-stage">
        <button className="door" onClick={() => setOpen(true)}>
          <DeityFigure id={s.mainDeity} />
          <span className="btn small">{t.enterShrine}</span>
        </button>
        <button className="today-pill" onClick={() => setSheet(true)} aria-label={t.panchang}>{line}</button>
      </div>

      <div className="home-foot">
        {next && days <= 14 && (
          <button className="row festival-row" onClick={() => setFestival(true)}>
            <span><strong>{localFestival(t, next).name}</strong><small>{days === 0 ? t.today : days === 1 ? t.tomorrow : t.inDays(days)}</small></span>
            <em>{t.festivalPrepare} ›</em>
          </button>
        )}
        <div className="rhythm">
          <p>{litToday ? t.rhythmDone : t.rhythmWaiting}</p>
          <ol aria-hidden="true">
            {week.map((d) => <li key={d.key} className={d.lit ? 'lit' : ''}><i />{d.label}</li>)}
          </ol>
        </div>
        <div className="quick">
          <button onClick={onJapa}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">{MALA}<circle cx="12" cy="20.5" r="2" /></svg>
            {t.quickJapa}
          </button>
          <button onClick={onDarshan}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true"><path d="M12 5c3 3 3 9 0 13-3-4-3-10 0-13zM6 9c4 1 6 5 6 9-4-1-7-5-6-9zM18 9c-4 1-6 5-6 9 4-1 7-5 6-9z" /></svg>
            {t.quickStill}
          </button>
          <button onClick={onPray}>
            <b lang="sa">ॐ</b>
            {t.tabs.pray}
          </button>
          <button onClick={onJournal}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M6 3h13v18H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM9 8h7M9 12h7" /></svg>
            {t.tabs.journal}
          </button>
        </div>
      </div>
      {open && <MyShrine festivalLamps={festiveLit} onPuja={onPuja} onClose={() => setOpen(false)} />}
      {sheet && <PanchangSheet onClose={() => setSheet(false)} />}
      {festival && <FestivalCalendar start={next} onClose={() => setFestival(false)} onPuja={onCeremony} />}
    </div>
  )
}
