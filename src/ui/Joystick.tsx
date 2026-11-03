import { useRef, useState } from 'react'

/** 모바일 가상 조이스틱 (왼쪽 아래). 값은 -1..1, 위로 밀면 y = -1 */
export function Joystick({ onMove }: { onMove: (x: number, y: number) => void }) {
  const base = useRef<HTMLDivElement>(null)
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const id = useRef<number | null>(null)
  const R = 46
  const move = (e: React.PointerEvent) => {
    if (id.current !== e.pointerId || !base.current) return
    const r = base.current.getBoundingClientRect()
    let x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2)
    const d = Math.hypot(x, y)
    if (d > R) { x = (x / d) * R; y = (y / d) * R }
    setKnob({ x, y })
    onMove(x / R, y / R)
  }
  const end = (e: React.PointerEvent) => {
    if (id.current !== e.pointerId) return
    id.current = null
    setKnob({ x: 0, y: 0 })
    onMove(0, 0)
  }
  return (
    <div
      ref={base}
      className="joystick"
      onPointerDown={(e) => { id.current = e.pointerId; (e.target as HTMLElement).setPointerCapture(e.pointerId); move(e) }}
      onPointerMove={move}
      onPointerUp={end}
      onPointerCancel={end}
      role="application"
      aria-label="move"
    >
      <div className="joy-knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
    </div>
  )
}
