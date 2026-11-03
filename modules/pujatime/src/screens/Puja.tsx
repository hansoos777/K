import { useEffect, useState } from 'react'
import type { DeityId } from '../data/deities'
import { useT } from '../i18n'
import { track } from '../lib/stats'
import { markPuja, useShrine } from '../lib/store'
import { ringBell, softChime, softStrike } from '../lib/sound'
import { useBack } from '../lib/back'
import { Flower } from '../components/ShrineScene'
import { flowersFor, type FlowerKind } from '../data/flowers'
import { ShrineStage } from '../components/ShrineStage'
import { Note, Petals } from '../components/Shared'
import { SongPick } from '../components/Songs'
import { autoSong, stopSong } from '../lib/songPlayer'

// 정해진 순서 없이 종·램프·꽃을 원하는 만큼 쓰고, 끝내고 싶을 때 마침
export function Puja({ deityId, onExit }: { deityId: DeityId; onExit: () => void }) {
  useBack(onExit)
  const s = useShrine()!
  const t = useT()
  const [swing, setSwing] = useState(0)
  const [lit, setLit] = useState(false)
  const [lampUsed, setLampUsed] = useState(false)
  const [flowers, setFlowers] = useState<FlowerKind[]>([])
  const [arti, setArti] = useState(false)
  const [angle, setAngle] = useState(Math.PI / 2)
  const [done, setDone] = useState(false)

  useEffect(() => {
    autoSong(deityId)
    return stopSong
  }, [deityId])

  useEffect(() => {
    if (!arti) return
    const timer = setInterval(() => setAngle((a) => a + 0.035), 30)
    return () => clearInterval(timer)
  }, [arti])

  const ring = () => {
    ringBell()
    setSwing((n) => n + 1)
  }

  const toggleLamp = () => {
    if (!lit) softStrike()
    setLit(!lit)
    setLampUsed(true)
  }

  const offer = (kind: FlowerKind) => {
    softChime()
    setFlowers((f) => [...f, kind])
  }

  const finish = () => {
    markPuja()
    track('puja')
    softChime()
    setArti(false)
    setDone(true)
  }

  const started = swing > 0 || lampUsed || flowers.length > 0 || arti
  const hint = done ? null : swing === 0 ? 'bell' : lampUsed ? null : 'lamp'

  return (
    <div className="puja">
      {!done && <button className="exit-btn leave" onClick={onExit} aria-label={t.leavePuja}>‹ {t.leave}</button>}
      <div className="scene-wrap">
        <ShrineStage
          deity={deityId}
          others={s.mainDeity === deityId ? s.otherDeities : []}
          lit={lit || done}
          hideLamp={arti}
          flowers={flowers}
          bellSwing={swing}
          hint={hint}
          onBell={ring}
          onLamp={toggleLamp}
          artiAngle={arti ? angle : null}
        />
      </div>

      {done ? (
        <div className="puja-text">
          <Petals />
          <h1>{t.peaceDay}</h1>
          <p className="muted">{t.lampStays}</p>
          <Note />
          <button className="btn wide" onClick={onExit}>{t.returnShrine}</button>
        </div>
      ) : (
        <div className="puja-text">
          <p className={`muted puja-guide ${started ? 'gone' : ''}`}>{t.pujaGuide}</p>
          <div className="flowers">
            {flowersFor(deityId).map((kind) => (
              <button key={kind} onClick={() => offer(kind)} aria-label={t.flowers[kind]}>
                <svg viewBox="-18 -18 36 36" width="40" height="40" aria-hidden="true"><Flower kind={kind} x={0} y={0} /></svg>
                <span>{t.flowers[kind]}</span>
              </button>
            ))}
          </div>
          <SongPick id={deityId} />
          <button className="link" onClick={() => setArti(!arti)}>{arti ? t.artiStop : t.artiStart}</button>
          <button className="btn wide" onClick={finish}>{t.pujaFinish}</button>
        </div>
      )}
    </div>
  )
}
