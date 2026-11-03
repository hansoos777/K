import { useMemo, type ReactNode } from 'react'
import type { DeityId } from '../data/deities'
import { EmblemArt, GoldDefs, useDeityImage } from './DeityEmblem'
import { FLOWER_LOOK, type FlowerKind } from '../data/flowers'


interface Props {
  deity: DeityId
  others?: DeityId[]
  lit: boolean
  flowers?: FlowerKind[]
  festivalLamps?: boolean
  hideLamp?: boolean
  bellSwing?: number
  hint?: 'bell' | 'lamp' | null
  onBell?: () => void
  onLamp?: () => void
  children?: ReactNode
}

// 씬 전체를 viewBox 400x540 SVG 하나로 그려서 화면 크기가 달라도 좌표가 유지되게 함.
const NICHE =
  'M84 412V196c0-14 12-20 22-20 0-22 16-32 30-32 4-20 22-30 36-30 8-14 18-22 28-30 10 8 20 16 28 30 14 0 32 10 36 30 14 0 30 10 30 32 10 0 22 6 22 20v216z'

function Marigold({ x, y, r, seed }: { x: number; y: number; r: number; seed: number }) {
  const hue = seed % 3 === 0 ? '#f6a81f' : seed % 3 === 1 ? '#ee8a17' : '#f9bc33'
  return (
    <g transform={`translate(${x} ${y}) rotate(${seed * 37})`}>
      <circle r={r} fill="#c9620c" />
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx={r * 0.5} rx={r * 0.55} ry={r * 0.36} fill={hue} transform={`rotate(${i * 45})`} />
      ))}
      <circle r={r * 0.32} fill="#ffd862" />
    </g>
  )
}

function Garland() {
  const pts = useMemo(() => {
    const out: { x: number; y: number; r: number; leaf: boolean }[] = []
    const swags = [
      [18, 44, 200, 90],
      [200, 90, 382, 44],
    ]
    swags.forEach(([x1, y1, x2, y2]) => {
      for (let i = 0; i <= 22; i++) {
        const t = i / 22
        const sag = Math.sin(t * Math.PI) * 28
        out.push({ x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t + sag, r: 7.4, leaf: i % 5 === 0 })
      }
    })
    return out
  }, [])
  return (
    <g>
      {pts
        .filter((p) => p.leaf)
        .map((p, i) => (
          <path key={i} d={`M${p.x} ${p.y + 3}c-7 10-7 18 0 28 7-10 7-18 0-28z`} fill={i % 2 ? '#4f7d34' : '#3f6b2c'} />
        ))}
      {pts.map((p, i) => (
        <Marigold key={i} x={p.x} y={p.y} r={p.r} seed={i} />
      ))}
      {[18, 382].map((x) => (
        <g key={x}>
          {[0, 1, 2, 3].map((n) => (
            <Marigold key={n} x={x} y={40 + n * -12} r={6.6} seed={n + 2} />
          ))}
        </g>
      ))}
    </g>
  )
}

export function Diya({ x, y, lit, scale = 1, onClick, hint }: { x: number; y: number; lit: boolean; scale?: number; onClick?: () => void; hint?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} onClick={onClick} className={onClick ? 'tap' : undefined}>
      {hint && <circle cx="0" cy="-8" r="34" className="pulse" />}
      <rect x="-40" y="-52" width="80" height="84" fill="transparent" />
      <ellipse cx="0" cy="17" rx="27" ry="4.4" fill="#5d3312" opacity=".3" />
      <path d="M-28-2C-26 15-11 18 0 18s26-3 28-20z" fill="url(#brass)" />
      <path d="M22-3c7-3 11-4 17-8-4 9-9 13-20 14z" fill="url(#brass)" />
      <ellipse cx="0" cy="-2" rx="28" ry="6.4" fill="#f4cd72" />
      <ellipse cx="0" cy="-1" rx="23" ry="4.2" fill="#8f5a18" />
      <path d="M12-2c8-1 14-3 21-8" stroke="#3d2010" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      {lit && (
        <g transform="translate(33 -12)">
          <circle r="48" fill="url(#halo)" className="glow" />
          <g className="flame">
            <path d="M0 3c-9-5-10-15-4-23 3-5 4-8 4-13 6 6 12 15 11 24-1 7-5 11-11 12z" fill="url(#flameOuter)" />
            <path d="M0 2c-4-3-5-8-2-12 2-3 2-5 2-8 3 3 6 8 5 13-1 4-2 6-5 7z" fill="#fff5c4" />
          </g>
        </g>
      )}
    </g>
  )
}

function Flower({ kind, x, y, s = 1 }: { kind: FlowerKind; x: number; y: number; s?: number }) {
  const t = `translate(${x} ${y}) scale(${s})`
  if (kind === 'marigold') return <g transform={t}><Marigold x={0} y={0} r={11} seed={2} /></g>
  const petals = FLOWER_LOOK[kind]
  return (
    <g transform={t}>
      {Array.from({ length: petals.n }, (_, i) => (
        <ellipse key={i} cx={6.5 * petals.len} rx={7.5 * petals.len} ry={4.2 * petals.wid} fill={petals.fill} stroke="rgba(120,40,30,.2)" strokeWidth=".5" transform={`rotate(${(i * 360) / petals.n})`} />
      ))}
      <circle r="3.4" fill={petals.core} />
    </g>
  )
}

export { Flower }

function Bell({ swing, onClick, hint }: { swing: number; onClick?: () => void; hint?: boolean }) {
  return (
    <g transform="translate(346 88)" onClick={onClick} className={onClick ? 'tap' : undefined}>
      <rect x="-30" y="-14" width="60" height="150" fill="transparent" />
      <g key={swing} className={swing ? 'bell swinging' : 'bell'}>
        <path d="M0-14V34" stroke="#8a5a1d" strokeWidth="2.2" strokeDasharray="5 2" />
        <circle cy="38" r="5" fill="url(#brass)" />
        <path d="M0 40c-13 0-17 12-18 25-1 11-5 17-10 22h56c-5-5-9-11-10-22-1-13-5-25-18-25z" fill="url(#brass)" />
        <path d="M-9 50c-4 7-5 18-5 26" stroke="#ffe7a3" strokeWidth="2.4" fill="none" opacity=".7" strokeLinecap="round" />
        <path d="M-28 87h56" stroke="#6f3f12" strokeWidth="2.5" />
        <circle cy="92" r="5" fill="#8a5a1d" />
      </g>
      {hint && <circle cy="68" r="44" className="pulse" />}
    </g>
  )
}

function Incense() {
  return (
    <g transform="translate(314 400)">
      <path d="M0 0L-9-62" stroke="#6d3a1d" strokeWidth="2" strokeLinecap="round" />
      <circle cx="-9" cy="-62" r="1.8" fill="#f2632b" className="ember" />
      <path d="M-12 6h24l-3 9h-18z" fill="url(#brass)" />
      <g filter="url(#blur)" fill="none" stroke="#fff" strokeLinecap="round">
        <path className="smoke s1" d="M-9-64c-9-14 9-22 0-38s9-24 0-40" strokeWidth="2.6" />
        <path className="smoke s2" d="M-9-64c9-14-9-24 0-40s-9-24 0-42" strokeWidth="2" />
      </g>
    </g>
  )
}

export function ShrineScene({ deity, others = [], lit, flowers = [], festivalLamps, hideLamp, bellSwing = 0, hint, onBell, onLamp, children }: Props) {
  const src = useDeityImage(deity)
  const spots: [number, number][] = [[152, 396], [176, 404], [200, 398], [224, 405], [248, 396]]
  return (
    <svg className="scene" viewBox="0 0 400 500" role="img" aria-label="Your shrine">
      <GoldDefs />
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fdf0d2" />
          <stop offset="1" stopColor="#f3d3a0" />
        </linearGradient>
        <linearGradient id="teak" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b5692b" />
          <stop offset=".5" stopColor="#7e3f19" />
          <stop offset="1" stopColor="#a65d24" />
        </linearGradient>
        <radialGradient id="nicheIn" cx=".5" cy=".55" r=".7">
          <stop offset="0" stopColor="#b64a20" />
          <stop offset=".6" stopColor="#7c2312" />
          <stop offset="1" stopColor="#4d110a" />
        </radialGradient>
        <radialGradient id="nicheLit" cx=".5" cy=".82" r=".8">
          <stop offset="0" stopColor="#ffc35a" stopOpacity=".9" />
          <stop offset="1" stopColor="#ff8a2e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="brass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffdf8e" />
          <stop offset=".5" stopColor="#c98c2d" />
          <stop offset="1" stopColor="#7c4a14" />
        </linearGradient>
        <linearGradient id="marble" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="1" stopColor="#e4cdb0" />
        </linearGradient>
        <linearGradient id="cloth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c8331f" />
          <stop offset="1" stopColor="#8c1c13" />
        </linearGradient>
        <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff8dc" stopOpacity=".85" />
          <stop offset="1" stopColor="#fff8dc" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="halo">
          <stop offset="0" stopColor="#ffe9a0" stopOpacity=".95" />
          <stop offset=".35" stopColor="#ffbd55" stopOpacity=".45" />
          <stop offset="1" stopColor="#ff9a33" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="flameOuter" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e84f1a" />
          <stop offset=".45" stopColor="#ffa726" />
          <stop offset="1" stopColor="#ffe681" />
        </linearGradient>
        <filter id="blur" x="-200%" y="-30%" width="500%" height="160%"><feGaussianBlur stdDeviation="2.4" /></filter>
        <filter id="soft"><feGaussianBlur stdDeviation="14" /></filter>
        <clipPath id="nicheClip"><path d={NICHE} /></clipPath>
      </defs>

      <rect width="400" height="540" fill="url(#wall)" />
      <path className="sunbeam" d="M-20-20H170L420 420H230z" fill="url(#beam)" filter="url(#soft)" />

      {/* 벽 문양 */}
      <g opacity=".13" fill="none" stroke="#a5662b">
        {[60, 340].map((x) =>
          [150, 250, 350].map((y) => (
            <g key={`${x}${y}`} transform={`translate(${x} ${y})`}>
              {[0, 45, 90, 135].map((a) => (
                <ellipse key={a} rx="22" ry="8" transform={`rotate(${a})`} />
              ))}
            </g>
          )),
        )}
      </g>

      {/* 나무 감실 */}
      <path d={NICHE} fill="url(#teak)" transform="translate(200 268) scale(1.17 1.08) translate(-200 -268)" />
      <path d={NICHE} fill="none" stroke="url(#gold)" strokeWidth="2.4" transform="translate(200 268) scale(1.09 1.04) translate(-200 -268)" />
      <path d={NICHE} fill="url(#nicheIn)" />
      <path d={NICHE} fill="none" stroke="#3a0d07" strokeWidth="3" />
      <rect x="84" y="90" width="232" height="325" fill="url(#nicheLit)" clipPath="url(#nicheClip)" className={lit ? 'nicheglow on' : 'nicheglow'} />

      {/* 신 */}
      <g clipPath="url(#nicheClip)">
        {src ? (
          <image href={src} x="94" y="136" width="212" height="264" preserveAspectRatio="xMidYMid slice" />
        ) : (
          <g transform="translate(112 170) scale(.88)">
            <EmblemArt id={deity} />
          </g>
        )}
      </g>
      {others.slice(0, 2).map((id, i) => (
        <g key={id} transform={`translate(${i === 0 ? 96 : 262} 340) scale(.21)`}>
          <EmblemArt id={id} />
        </g>
      ))}

      {/* 제단 */}
      <path d="M46 414h308l14 20H32z" fill="url(#marble)" />
      <path d="M32 434h336v13H32z" fill="#d6b78e" />
      <path d="M100 414h200l6 20 10 66H84l10-66z" fill="url(#cloth)" />
      <path d="M94 434h212" stroke="#e9b84e" strokeWidth="2" />
      <path d="M88 480h224" stroke="#e9b84e" strokeWidth="3" strokeDasharray="4 5" />

      <Garland />
      <Bell swing={bellSwing} onClick={onBell} hint={hint === 'bell'} />
      <Incense />

      {flowers.slice(-5).flatMap((f, i) => spots.map(([x, y], k) => <Flower key={`${i}-${k}`} kind={f} x={x} y={y} />))}

      {festivalLamps &&
        [58, 94, 306, 342].map((x) => <Diya key={x} x={x} y={470} scale={0.62} lit />)}

      {!hideLamp && <Diya x={92} y={418} lit={lit} onClick={onLamp} hint={hint === 'lamp'} />}
      {children}
    </svg>
  )
}
