import { useState } from 'react'
import { dayDiff, upcoming, type Festival } from '../data/festivals'
import type { DeityId } from '../data/deities'
import { LOCALE, localFestival, useLang, useT } from '../i18n'
import { updateShrine, useShrine } from '../lib/store'
import { softStrike } from '../lib/sound'
import { DeityEmblem } from '../components/DeityEmblem'
import { Overlay } from '../components/Overlay'

const fmt = (iso: string, locale: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString(locale, { month: 'long', day: 'numeric' })

// 축제 일정. 사원 화면에서 여는 전체 화면 페이지.
export function FestivalCalendar({ start, onClose, onPuja }: { start?: Festival; onClose: () => void; onPuja: (id: DeityId) => void }) {
  const s = useShrine()!
  const t = useT()
  const locale = LOCALE[useLang()]
  const [open, setOpen] = useState<Festival | null>(start ?? null)
  const when = (d: number) => (d === 0 ? t.today : d === 1 ? t.tomorrow : t.inDays(d))

  if (open) {
    const x = localFestival(t, open)
    const lit = s.festivalLamps.includes(open.id)
    return (
      <Overlay title={x.name} onClose={() => (start ? onClose() : setOpen(null))}>
        <div className="detail-top">
          {open.deity && <DeityEmblem id={open.deity} size={120} />}
          <p className="eyebrow">{fmt(open.date, locale)} · {when(dayDiff(open.date))}</p>
        </div>
        <p className="lead">{x.meaning}</p>
        <div className="rule" />
        <p className="muted">{x.regional}</p>
        <div className="foot">
          {open.lamps && !lit && (
            <button
              className="btn wide"
              onClick={() => {
                softStrike()
                updateShrine({ festivalLamps: [...s.festivalLamps, open.id] })
              }}
            >
              {t.lightFor(x.name)}
            </button>
          )}
          {open.lamps && lit && <p className="done">{t.lampsFor(x.name)}</p>}
          {open.deity && <button className="btn ghost wide" onClick={() => onPuja(open.deity!)}>{t.pujaForDay}</button>}
          {open.id.startsWith('diwali') && (s.theme === 'diwali'
            ? <p className="done">{t.diwaliThemeOn}</p>
            : <button className="btn ghost wide" onClick={() => updateShrine({ theme: 'diwali' })}>{t.diwaliThemeUse}</button>)}
        </div>
      </Overlay>
    )
  }

  return (
    <Overlay title={t.calendarTitle} onClose={onClose}>
      <div className="list">
        {upcoming().map((f) => (
          <button key={f.id} className="row slim" onClick={() => setOpen(f)}>
            {f.deity && <DeityEmblem id={f.deity} size={40} />}
            <span><strong>{localFestival(t, f).name}</strong><small>{fmt(f.date, locale)}</small></span>
            <em>{when(dayDiff(f.date))}</em>
          </button>
        ))}
      </div>
      <p className="note">{t.datesNote}</p>
    </Overlay>
  )
}
