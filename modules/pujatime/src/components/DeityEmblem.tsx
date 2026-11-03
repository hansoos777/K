import { useEffect, useState, type ReactNode } from 'react'
import type { DeityId } from '../data/deities'
import { getPhoto } from '../lib/photo'

// 코드로 그린 신상은 조잡해 보이고 결례일 수 있어, 놋쇠 부조 같은 상징 메달리온을 기본으로 씀.
// public/deities/<id>.jpg 를 넣으면 그 그림이 자동으로 우선 표시됨.

// 수직선은 폭이 0이라 기본 그라데이션이 안 칠해짐. 그래서 선은 userSpaceOnUse 그라데이션을 씀.
const line = { fill: 'none', stroke: 'url(#goldLine)', strokeLinecap: 'round', strokeLinejoin: 'round' } as const

const SYMBOLS: Record<DeityId, ReactNode> = {
  ganesha: (
    <g {...line} strokeWidth="4">
      <path d="M100 42c-5 6-6 11 0 17 6-6 5-11 0-17z" fill="url(#gold)" />
      <path d="M76 66c8-9 40-9 48 0" />
      <path d="M78 73c-22-15-42-3-41 19 1 19 16 31 34 25" />
      <path d="M122 73c22-15 42-3 41 19-1 19-16 31-34 25" />
      <path d="M78 73c-4 20-3 37 8 50 5 6 8 14 8 22 0 13 8 20 18 20s14-9 9-15" />
      <path d="M122 73c4 20 3 37-8 50-2 3-4 6-5 9" />
      <path d="M72 122c-2 9 0 15 5 21" strokeWidth="5" />
      <circle cx="90" cy="92" r="2.6" fill="url(#gold)" stroke="none" />
      <circle cx="110" cy="92" r="2.6" fill="url(#gold)" stroke="none" />
      <path d="M90 78h20M90 83h20" strokeWidth="2.5" />
      <circle cx="100" cy="74" r="2.4" fill="#d93a22" stroke="none" />
    </g>
  ),
  shiva: (
    <g {...line} strokeWidth="4.5">
      <path d="M100 34v132" />
      <path d="M100 34c-5 8-7 14-7 22 3-2 5-2 7 0 2-2 4-2 7 0 0-8-2-14-7-22z" fill="url(#gold)" />
      <path d="M66 42c-5 18 3 42 34 42s39-24 34-42" />
      <path d="M66 42c-4 5-5 9-4 15 2-3 5-5 8-5M134 42c4 5 5 9 4 15-2-3-5-5-8-5" />
      <path d="M80 106h40l-14 14 14 14H80l14-14z" fill="url(#gold)" stroke="#3c1407" strokeWidth="1.5" />
      <path d="M92 120c-8 6-16 8-24 4M108 120c8 6 16 8 24 4" strokeWidth="2.5" />
      <path d="M140 92a15 15 0 1 1-14-24 12 12 0 1 0 14 24z" fill="url(#gold)" stroke="none" />
    </g>
  ),
  krishna: (
    <g {...line} strokeWidth="3">
      <path d="M72 163c12-40 26-72 44-110" strokeWidth="4" />
      <path d="M116 53c24-6 42 8 38 33-3 22-26 40-52 40-14 0-27-5-32-12" fill="rgba(240,190,90,.14)" />
      <path d="M116 53c-20 8-33 25-36 49M132 62c-17 12-29 29-34 50M145 78c-10 13-23 26-36 34" strokeWidth="1.8" />
      <ellipse cx="118" cy="84" rx="17" ry="20" transform="rotate(26 118 84)" fill="#1f6c74" />
      <ellipse cx="116" cy="88" rx="9" ry="11" transform="rotate(26 116 88)" fill="#1a3a7d" stroke="none" />
      <path d="M38 152l124-34" strokeWidth="7" />
      <path d="M72 140l6-2M92 135l6-2M112 129l6-2" stroke="#3c1407" strokeWidth="3.5" />
    </g>
  ),
  lakshmi: (
    <g {...line} strokeWidth="3.5">
      <path d="M100 56c20 26 20 58 0 84-20-26-20-58 0-84z" fill="rgba(240,120,130,.28)" />
      <path d="M76 72c26 12 36 42 24 68-26-10-36-42-24-68z" fill="rgba(240,120,130,.2)" />
      <path d="M124 72c-26 12-36 42-24 68 26-10 36-42 24-68z" fill="rgba(240,120,130,.2)" />
      <path d="M50 96c30 2 46 22 50 44-30 2-50-18-50-44z" fill="rgba(240,120,130,.14)" />
      <path d="M150 96c-30 2-46 22-50 44 30 2 50-18 50-44z" fill="rgba(240,120,130,.14)" />
      <path d="M46 146c30 12 78 12 108 0" />
      <path d="M62 160c24 8 52 8 76 0" strokeWidth="2.5" />
    </g>
  ),
  vishnu: (
    <g {...line} strokeWidth="3.5">
      <circle cx="100" cy="100" r="58" />
      <circle cx="100" cy="100" r="46" strokeWidth="2" />
      <circle cx="100" cy="100" r="12" fill="url(#gold)" stroke="none" />
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d="M100 88V54" transform={`rotate(${i * 30} 100 100)`} strokeWidth="2.5" />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d="M100 42l-6-14h12z" transform={`rotate(${i * 22.5} 100 100)`} fill="url(#gold)" stroke="none" />
      ))}
    </g>
  ),
  durga: (
    <g {...line} strokeWidth="3.5">
      <path d="M100 32c6 8 8 13 6 22l-6 92-6-92c-2-9 0-14 6-22z" fill="url(#gold)" stroke="none" />
      <path d="M76 148c6-3 42-3 48 0" strokeWidth="5" />
      <path d="M100 150v18" strokeWidth="6" />
      <circle cx="100" cy="171" r="4" fill="url(#gold)" stroke="none" />
      <path d="M100 118c-14-24-34-33-58-32 2 26 22 42 50 44" fill="rgba(217,58,34,.26)" />
      <path d="M100 118c14-24 34-33 58-32-2 26-22 42-50 44" fill="rgba(217,58,34,.26)" />
      <path d="M62 62c-10 12-12 18-10 28M138 62c10 12 12 18 10 28" strokeWidth="2.5" />
    </g>
  ),
  custom: (
    <text x="100" y="134" textAnchor="middle" fontSize="104" fill="url(#gold)" fontFamily="'Noto Serif Devanagari', 'Nirmala UI', serif">ॐ</text>
  ),
  hanuman: (
    <g {...line} strokeWidth="4">
      <path d="M104 168V92" strokeWidth="7" />
      <path d="M104 40c24 0 36 16 36 34 0 16-16 26-36 26s-36-10-36-26c0-18 12-34 36-34z" fill="rgba(240,190,90,.16)" />
      <path d="M70 70h68M72 84h64M84 42v56M104 38v62M124 42v56" strokeWidth="2.2" />
      <path d="M104 30v10" strokeWidth="5" />
      <circle cx="104" cy="172" r="6" fill="url(#gold)" stroke="none" />
    </g>
  ),
  rama: (
    <g {...line} strokeWidth="4.5">
      <path d="M126 34c-34 26-34 106 0 132" />
      <path d="M126 34v132" strokeWidth="2" />
      <path d="M40 100h116" strokeWidth="3.5" />
      <path d="M156 100l-16-8v16z" fill="url(#gold)" stroke="none" />
      <path d="M40 100l-8-8M40 100l-8 8M50 100l-8-8M50 100l-8 8" strokeWidth="2.5" />
    </g>
  ),
  saraswati: (
    <g {...line} strokeWidth="4">
      <path d="M44 148L150 46" strokeWidth="6" />
      <circle cx="62" cy="130" r="26" fill="rgba(240,190,90,.16)" />
      <circle cx="148" cy="48" r="13" fill="rgba(240,190,90,.16)" />
      <path d="M40 142L142 40M48 150L154 54" strokeWidth="1.6" />
      <path d="M96 96l8 8M112 80l8 8M128 64l8 8" strokeWidth="3" />
      <path d="M150 46c8-8 12-12 12-20" strokeWidth="3.5" />
    </g>
  ),
  kali: (
    <g {...line} strokeWidth="4">
      <path d="M72 164C68 112 92 66 142 34c6 42-10 92-48 130z" fill="url(#gold)" stroke="none" />
      <path d="M60 170l42-8" strokeWidth="7" />
      <path d="M72 180l8-18" strokeWidth="6" />
      <path d="M144 134c10 0 16 6 16 14s-6 14-16 14-16-6-16-14 6-14 16-14z" fill="rgba(217,58,34,.5)" />
      <path d="M144 134v28M130 148h28" strokeWidth="2" />
    </g>
  ),
  parvati: (
    <g {...line} strokeWidth="4">
      <path d="M100 150c-22-20-22-62 0-96 22 34 22 76 0 96z" fill="rgba(240,190,90,.16)" />
      <path d="M100 150c-38-4-58-34-60-64 26 2 46 16 60 40M100 150c38-4 58-34 60-64-26 2-46 16-60 40" />
      <path d="M56 160h88" strokeWidth="5" />
    </g>
  ),
  murugan: (
    <g {...line} strokeWidth="4">
      <path d="M100 176V86" strokeWidth="6" />
      <path d="M100 26c20 22 26 42 0 66-26-24-20-44 0-66z" fill="url(#gold)" stroke="none" />
      <path d="M78 104h44" strokeWidth="5" />
      <circle cx="100" cy="176" r="6" fill="url(#gold)" stroke="none" />
    </g>
  ),
}

export function GoldDefs() {
  return (
    <defs>
      <linearGradient id="gold" x1="0" y1="0" x2="0.5" y2="1">
        <stop offset="0" stopColor="#fff0b0" />
        <stop offset=".45" stopColor="#e9b84e" />
        <stop offset="1" stopColor="#a8691d" />
      </linearGradient>
      <linearGradient id="goldLine" gradientUnits="userSpaceOnUse" x1="60" y1="20" x2="140" y2="180">
        <stop offset="0" stopColor="#fff0b0" />
        <stop offset=".5" stopColor="#ecbf58" />
        <stop offset="1" stopColor="#c08a2c" />
      </linearGradient>
      <radialGradient id="plaque" cx=".5" cy=".42" r=".62">
        <stop offset="0" stopColor="#7b2413" />
        <stop offset=".7" stopColor="#4c1209" />
        <stop offset="1" stopColor="#2d0a05" />
      </radialGradient>
    </defs>
  )
}

export function EmblemArt({ id }: { id: DeityId }) {
  return (
    <>
      <circle cx="100" cy="100" r="96" fill="url(#gold)" />
      <circle cx="100" cy="100" r="90" fill="url(#plaque)" />
      {Array.from({ length: 24 }, (_, i) => (
        <path
          key={i}
          d="M100 8c5 4 6 9 0 14-6-5-5-10 0-14z"
          fill="url(#gold)"
          opacity=".85"
          transform={`rotate(${i * 15} 100 100)`}
        />
      ))}
      <circle cx="100" cy="100" r="74" fill="none" stroke="url(#gold)" strokeWidth="1" opacity=".55" />
      <g transform="translate(6 6) scale(.94)">{SYMBOLS[id]}</g>
    </>
  )
}

function useDeityImage(id: DeityId) {
  const [src, setSrc] = useState<string | null>(id === 'custom' ? getPhoto() : null)
  useEffect(() => {
    if (id === 'custom') return
    let alive = true
    const url = `/deities/${id}-murti.png`
    const img = new Image()
    img.onload = () => alive && setSrc(url)
    img.onerror = () => alive && setSrc(null)
    img.src = url
    return () => {
      alive = false
    }
  }, [id])
  return src
}

export function DeityEmblem({ id, size = 96 }: { id: DeityId; size?: number }) {
  const src = useDeityImage(id)
  if (src) return <img className="emblem-img" src={src} alt="" width={size} height={size} />
  return (
    <svg className="emblem" viewBox="0 0 200 200" width={size} height={size} aria-hidden="true">
      <GoldDefs />
      <EmblemArt id={id} />
    </svg>
  )
}

// 사원 화면의 큰 신상. 실사 이미지가 없는 신은 메달로 대신함
export function DeityFigure({ id }: { id: DeityId }) {
  const src = useDeityImage(id)
  if (src) return <img className="feature-figure" src={src} alt="" />
  return <DeityEmblem id={id} size={118} />
}

export { useDeityImage }
