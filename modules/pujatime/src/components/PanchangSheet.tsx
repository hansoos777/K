import { useMemo, useState } from 'react'
import { LOCALE, useLang, useT, type Lang } from '../i18n'
import type { Dict } from '../i18n/en'
import { DELHI, panchang, upcomingDays, type Observance, type Place } from '../lib/panchang'
import { today, updateShrine, useShrine } from '../lib/store'
import { Overlay } from './Overlay'
import { Note } from './Shared'

export function tithiName(t: Dict, n: number) {
  if (n === 30) return t.amavasya
  return t.tithis[(n - 1) % 15]
}

export const pakshaName = (t: Dict, n: number) => (n <= 15 ? t.shuklaPaksha : t.krishnaPaksha)

// 달 모양: 오른쪽부터 차고, 보름 뒤에는 오른쪽부터 기움
function Moon({ tithi }: { tithi: number }) {
  const phase = ((tithi - 0.5) / 30) * Math.PI * 2
  const rx = Math.abs(Math.cos(phase)) * 45
  const waxing = tithi <= 15
  const gibbous = Math.cos(phase) < 0
  const edge = waxing ? 1 : 0
  const inner = waxing === gibbous ? 1 : 0
  return (
    <svg className="moon" viewBox="0 0 100 100" width="104" height="104" aria-hidden="true">
      <circle cx="50" cy="50" r="45" fill="#4a1d0c" />
      <path d={`M50 5A45 45 0 0 ${edge} 50 95A${rx} 45 0 0 ${inner} 50 5z`} fill="#ffe08a" />
      <circle cx="50" cy="50" r="45" fill="none" stroke="#d4930f" strokeWidth="2" />
    </svg>
  )
}

function shortDate(date: string, lang: Lang) {
  return new Date(`${date}T12:00:00`).toLocaleDateString(LOCALE[lang], { month: 'short', day: 'numeric', weekday: 'short' })
}

export function PanchangSheet({ onClose }: { onClose: () => void }) {
  const t = useT()
  const lang = useLang()
  const s = useShrine()!
  const [failed, setFailed] = useState(false)
  const place: Place = s.place ?? DELHI
  const date = today()
  const day = useMemo(() => panchang(date, place), [date, place])
  const next = useMemo(() => upcomingDays(date, place).slice(0, 4), [date, place])
  const clock = (d: Date) =>
    d.toLocaleTimeString(LOCALE[lang], { hour: 'numeric', minute: '2-digit', ...(s.place ? {} : { timeZone: 'Asia/Kolkata' }) })
  const names = (list: Observance[]) => list.map((o) => t.observances[o].name).join(' · ')

  const locate = () => {
    setFailed(false)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => updateShrine({ place: { lat: Math.round(coords.latitude * 100) / 100, lon: Math.round(coords.longitude * 100) / 100 } }),
      () => setFailed(true),
      { timeout: 10000 },
    )
  }

  return (
    <Overlay title={t.panchang} onClose={onClose}>
      <div className="pan-top">
        <Moon tithi={day.tithi} />
        <div>
          <p className="eyebrow">{pakshaName(t, day.tithi)}</p>
          <h2>{tithiName(t, day.tithi)}</h2>
          <p className="muted">{t.sunrise} {clock(day.sunrise)} · {t.sunset} {clock(day.sunset)}</p>
        </div>
      </div>

      {day.observances.map((o) => (
        <div className="panel" key={o}>
          <strong>{t.observances[o].name}</strong>
          <p>{t.observances[o].body}</p>
        </div>
      ))}

      <p className="eyebrow">{t.upcomingObs}</p>
      <div className="list">
        {next.map((d) => (
          <div className="row slim" key={d.date}>
            <span><strong>{names(d.observances)}</strong></span>
            <em>{shortDate(d.date, lang)}</em>
          </div>
        ))}
      </div>

      <div className="pan-place">
        <span>{s.place ? t.placeMine : t.placeDelhi}</span>
        <button className="link" onClick={s.place ? () => updateShrine({ place: undefined }) : locate}>{s.place ? t.useDelhi : t.useMyPlace}</button>
      </div>
      {failed && <p className="note">{t.placeFail}</p>}
      <Note>{t.panchangNote}</Note>
    </Overlay>
  )
}
