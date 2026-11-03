import { useEffect, useState } from 'react'
import { today, useShrine } from '../lib/store'
import { ringBell } from '../lib/sound'
import { track } from '../lib/stats'
import { useT } from '../i18n'
import { ShrineStage } from '../components/ShrineStage'
import { useBack } from '../lib/back'

const TIMES = [30, 60, 180]

export function Darshan({ onExit }: { onExit: () => void }) {
  useBack(onExit)
  const s = useShrine()!
  const t = useT()
  useEffect(() => track('darshan'), [])
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [seconds, setSeconds] = useState(30)

  useEffect(() => {
    if (!running) return
    const t = setTimeout(() => {
      ringBell()
      setDone(true)
    }, seconds * 1000)
    return () => clearTimeout(t)
  }, [running, seconds])

  return (
    <div className={`darshan ${running && !done ? 'quiet' : ''}`}>
      <div className="scene-wrap">
        <ShrineStage deity={s.mainDeity} others={s.otherDeities} lit={s.lastPuja === today()} />
      </div>
      <div className="puja-text">
        {done ? (
          <>
            <h1>{t.stillness}</h1>
            <button className="btn wide" onClick={onExit}>{t.returnShrine}</button>
          </>
        ) : running ? (
          <button className="exit-btn" onClick={onExit}>‹ {t.leave}</button>
        ) : (
          <>
            <h1>{t.quietMoment}</h1>
            <p className="muted">{t.darshanBody}</p>
            <div className="chips center-chips">
              {TIMES.map((sec, i) => (
                <button key={sec} className="chip" onClick={() => { setSeconds(sec); setRunning(true) }}>{t.times[i]}</button>
              ))}
            </div>
            <button className="link" onClick={onExit}>{t.notNow}</button>
          </>
        )}
      </div>
    </div>
  )
}
