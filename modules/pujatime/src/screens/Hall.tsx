import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { DeityId } from '../data/deities'
import { localDeity, useT } from '../i18n'
import { useShrine } from '../lib/store'
import { ringBell, softChime, softStrike } from '../lib/sound'
import { track } from '../lib/stats'
import { useBack } from '../lib/back'
import type { HallWorld } from '../three/hall'
import { Joystick } from '../components/Joystick'
import { Overlay } from '../components/Overlay'
import { SongList } from '../components/Songs'
import { SoundSettings } from '../components/SoundSettings'

export function Hall({ deity, onExit }: { deity: DeityId; onExit: () => void }) {
  useBack(onExit)
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => track('hall'), [])
  const world = useRef<HallWorld | null>(null)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const t = useT()
  const avatar = useShrine()?.avatar ?? 0
  const name = t.templeName(localDeity(t, deity).name)
  const [toast, setToast] = useState(t.hallHelp)
  const [songs, setSongs] = useState(false)

  useEffect(() => {
    let dead = false
    import('../three/hall')
      .then(({ HallWorld }) => {
        if (dead) return
        world.current = new HallWorld(canvas.current!, deity, t.you, avatar)
        setReady(true)
      })
      .catch(() => setFailed(true))
    return () => {
      dead = true
      world.current?.dispose()
      world.current = null
    }
  }, [deity, t.you, avatar])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(''), 5000)
    return () => clearTimeout(t)
  }, [toast])

  const act = (run: (w: HallWorld) => void, sound: () => void, line: string) => {
    if (!world.current) return
    run(world.current)
    sound()
    setToast(line)
  }

  // 페이지 애니메이션의 transform 안에서는 fixed가 화면 전체를 못 덮어서 body로 뺌
  return createPortal(
    <div className="hall">
      <canvas ref={canvas} aria-label={name} />
      <header className="hall-top">
        <button className="exit-btn" onClick={onExit} aria-label={t.leaveHall}>‹ {t.leave}</button>
        <strong>{name}</strong>
        <span className="hall-tag">{t.previewCrowd}</span>
        <SoundSettings />
      </header>
      {toast && <p className="hall-toast">{toast}</p>}
      {failed && <p className="hall-toast">{t.hallFail}</p>}
      {ready && <Joystick onMove={(x, y) => world.current?.setMove(x, y)} />}
      {ready && (
        <div className="hall-actions">
          <button onClick={() => act((w) => w.namaste(), softChime, t.namasteDone)}>{t.namaste}</button>
          <button onClick={() => act((w) => w.pranam(), ringBell, t.pranamDone)}>{t.pranam}</button>
          <button onClick={() => act((w) => w.lightLamp(), softStrike, t.lampDone)}>{t.hallLamp}</button>
          <button onClick={() => setSongs(true)}>{t.songsHeading}</button>
        </div>
      )}
      {songs && <Overlay title={t.songsHeading} onClose={() => setSongs(false)}><SongList id={deity} /></Overlay>}
    </div>,
    document.body,
  )
}
