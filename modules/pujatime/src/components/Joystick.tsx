import { useEffect, useRef, useState, type PointerEvent } from 'react'

const RADIUS = 42
const KEYS: Record<string, [number, number]> = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
  KeyW: [0, -1],
  KeyS: [0, 1],
  KeyA: [-1, 0],
  KeyD: [1, 0],
}

// 화면 왼쪽 아래의 가상 조이스틱. x는 오른쪽, y는 아래쪽이 양수이고 범위는 -1~1.
// PC에서는 방향키와 WASD로도 움직임.
export function Joystick({ onMove }: { onMove: (x: number, y: number) => void }) {
  const base = useRef<HTMLDivElement>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const held = new Set<string>()
    const apply = () => {
      let x = 0
      let y = 0
      held.forEach((code) => {
        x += KEYS[code][0]
        y += KEYS[code][1]
      })
      const len = Math.hypot(x, y) || 1
      setKnob({ x: (x / len) * RADIUS, y: (y / len) * RADIUS })
      onMove(x / len, y / len)
    }
    const down = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement
      if (typing || !KEYS[e.code]) return
      e.preventDefault()
      held.add(e.code)
      apply()
    }
    const up = (e: KeyboardEvent) => {
      if (held.delete(e.code)) apply()
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [onMove])

  const update = (e: PointerEvent) => {
    const r = base.current!.getBoundingClientRect()
    let x = e.clientX - (r.left + r.width / 2)
    let y = e.clientY - (r.top + r.height / 2)
    const len = Math.hypot(x, y)
    if (len > RADIUS) {
      x = (x / len) * RADIUS
      y = (y / len) * RADIUS
    }
    setKnob({ x, y })
    onMove(x / RADIUS, y / RADIUS)
  }

  const stop = () => {
    setKnob({ x: 0, y: 0 })
    onMove(0, 0)
  }

  return (
    <div
      ref={base}
      className="joy"
      role="presentation"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId)
        update(e)
      }}
      onPointerMove={(e) => {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) update(e)
      }}
      onPointerUp={stop}
      onPointerCancel={stop}
    >
      <i style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
    </div>
  )
}
