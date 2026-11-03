import { useEffect, useRef, useState } from 'react'
import type { DeityId } from '../data/deities'
import { useShrine } from '../lib/store'
import type { ShrineWorld } from '../three/shrine'
import { ShrineScene } from './ShrineScene'
import type { FlowerKind } from '../data/flowers'
import { Joystick } from './Joystick'

interface Props {
  deity: DeityId
  others?: DeityId[]
  lit: boolean
  flowers?: FlowerKind[]
  festivalLamps?: boolean
  hideLamp?: boolean
  bellSwing?: number
  hint?: 'bell' | 'lamp' | null
  artiAngle?: number | null
  room?: boolean
  avatar?: number
  sitRequest?: number
  onSeated?: () => void
  onBell?: () => void
  onLamp?: () => void
}

// 3D 신당의 React 껍데기. WebGL을 못 쓰는 기기나 로딩 중에는 SVG 신당이 대신 보임.
export function ShrineStage({ deity, others = [], lit, flowers = [], festivalLamps = false, hideLamp = false, bellSwing = 0, hint = null, artiAngle = null, room = false, avatar = 0, sitRequest = 0, onSeated, onBell, onLamp }: Props) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const theme = useShrine()?.theme
  const [world, setWorld] = useState<ShrineWorld | null>(null)

  useEffect(() => {
    let w: ShrineWorld | null = null
    let dead = false
    import('../three/shrine')
      .then(({ ShrineWorld }) => {
        if (dead) return
        w = new ShrineWorld(canvas.current!, room, avatar, theme)
        setWorld(w)
      })
      .catch(() => setWorld(null))
    return () => {
      dead = true
      w?.dispose()
    }
  }, [])

  useEffect(() => { world?.setCallbacks({ onBell, onLamp }) }, [world, onBell, onLamp])
  useEffect(() => { void world?.setDeity(deity, others) }, [world, deity, others.join()])
  useEffect(() => { world?.setLit(lit) }, [world, lit])
  useEffect(() => { world?.setHideLamp(hideLamp) }, [world, hideLamp])
  useEffect(() => { world?.setHint(hint) }, [world, hint])
  useEffect(() => { world?.setFestival(festivalLamps) }, [world, festivalLamps])
  useEffect(() => { world?.setFlowers(flowers) }, [world, flowers])
  useEffect(() => { if (bellSwing) world?.swingBell() }, [world, bellSwing])
  useEffect(() => { world?.setArti(artiAngle) }, [world, artiAngle])
  useEffect(() => {
    if (!sitRequest) return
    if (world) world.sitAtMat(() => onSeated?.())
    else onSeated?.()
  }, [sitRequest])

  return (
    <div className={room ? 'stage room' : 'stage'}>
      {!world && <ShrineScene deity={deity} others={others} lit={lit} flowers={flowers} hideLamp={hideLamp} onBell={onBell} onLamp={onLamp} hint={hint} festivalLamps={festivalLamps} />}
      <canvas ref={canvas} className={world ? 'on' : ''} aria-label="Your shrine" />
      {room && world && <Joystick onMove={(x, y) => world.setMove(x, y)} />}
    </div>
  )
}
