import { Rays } from '../../ui/kit'

const GLASS = ['#c0392b', '#2e6fb7', '#e2b13c', '#2f8f5b', '#7d3c98', '#e67e22']

/** 뾰족 아치 창 안을 색유리 조각으로 채움 */
function Lancet({ x, y, w, h, seed, id }: { x: number; y: number; w: number; h: number; seed: number; id: string }) {
  const d = `M${x} ${y + h} V${y + w * 0.6} Q${x} ${y} ${x + w / 2} ${y} Q${x + w} ${y} ${x + w} ${y + w * 0.6} V${y + h}Z`
  const cells = []
  for (let r = 0; r < Math.ceil(h / 7); r++)
    for (let c = 0; c < 3; c++) cells.push(<rect key={`${r}-${c}`} x={x + (c * w) / 3} y={y + r * 7} width={w / 3} height={7} fill={GLASS[(r * 3 + c + seed) % GLASS.length]} />)
  return (
    <g>
      <clipPath id={id}><path d={d} /></clipPath>
      <g clipPath={`url(#${id})`} className="glow">{cells}</g>
      <path d={d} fill="none" stroke="#1a1410" strokeWidth="1.6" />
      <path d={`M${x + w / 3} ${y + 4} V${y + h} M${x + (2 * w) / 3} ${y + 4} V${y + h}`} stroke="#1a1410" strokeWidth=".6" />
    </g>
  )
}

function Pews({ color = '#5a3a22' }: { color?: string }) {
  return (
    <g>
      {Array.from({ length: 6 }, (_, i) => {
        const y = 118 + i * 11
        const s = 1 + i * 0.22
        return (
          <g key={i}>
            <rect x={160 - 18 - 58 * s} y={y} width={58 * s} height={6 + i} rx="1" fill={color} />
            <rect x={160 + 18} y={y} width={58 * s} height={6 + i} rx="1" fill={color} />
            <rect x={160 - 18 - 58 * s} y={y - 3} width={58 * s} height="3" fill="#3d2615" />
            <rect x={160 + 18} y={y - 3} width={58 * s} height="3" fill="#3d2615" />
          </g>
        )
      })}
    </g>
  )
}

export function Traditional() {
  return (
    <>
      <defs>
        <linearGradient id="tr-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d2333" /><stop offset="1" stopColor="#3b3326" />
        </linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#tr-wall)" />
      {/* 기둥과 천장 아치 */}
      <path d="M0 0 H320 V30 Q160 -10 0 30Z" fill="#141824" />
      {[40, 100, 220, 280].map((x) => <rect key={x} x={x - 4} y="20" width="8" height="110" fill="#2a2a30" />)}
      <Lancet x={14} y={34} w={20} h={58} seed={0} id="tr-l1" />
      <Lancet x={62} y={40} w={18} h={52} seed={2} id="tr-l2" />
      <Lancet x={240} y={40} w={18} h={52} seed={4} id="tr-l3" />
      <Lancet x={286} y={34} w={20} h={58} seed={1} id="tr-l4" />
      <Rays x={20} color="#ffd98a" />
      <Rays x={236} color="#9fc4ff" />
      {/* 강단 */}
      <path d="M118 120 V58 Q160 22 202 58 V120Z" fill="#2c2418" />
      <rect x="157" y="40" width="6" height="44" fill="#d8b56a" />
      <rect x="146" y="52" width="28" height="6" fill="#d8b56a" />
      <rect x="110" y="104" width="100" height="16" fill="#4a3220" />
      <path d="M176 92 h22 l-3 24 h-16Z" fill="#6b4a2c" />
      <rect x="174" y="88" width="26" height="5" fill="#8a6238" />
      {/* 오르간 파이프 */}
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={125 + i * 3} y={70 - Math.abs(4 - i) * -2} width="2" height={30 - Math.abs(4 - i) * 3} fill="#b8a27a" opacity=".7" />)}
      <Pews />
    </>
  )
}

export function Modern() {
  return (
    <>
      <rect width="320" height="180" fill="#0c0d14" />
      <g className="beams" opacity=".5">
        <path d="M60 0 L80 0 L140 120 L100 120Z" fill="#5a6cff" opacity=".35" />
        <path d="M240 0 L260 0 L220 120 L180 120Z" fill="#ff6aa2" opacity=".3" />
        <path d="M150 0 L170 0 L180 120 L140 120Z" fill="#fff2c4" opacity=".25" />
      </g>
      {/* 스크린 */}
      <rect x="92" y="18" width="136" height="62" rx="3" fill="#1b2340" />
      <rect x="94" y="20" width="132" height="58" fill="url(#md-scr)" />
      <defs>
        <linearGradient id="md-scr" x1="0" x2="1"><stop offset="0" stopColor="#273a7a" /><stop offset="1" stopColor="#7a3b6e" /></linearGradient>
      </defs>
      <rect x="158" y="30" width="4" height="36" fill="#fff" opacity=".85" />
      <rect x="146" y="40" width="28" height="4" fill="#fff" opacity=".85" />
      <rect x="20" y="30" width="56" height="34" rx="2" fill="#1b2340" opacity=".8" />
      <rect x="244" y="30" width="56" height="34" rx="2" fill="#1b2340" opacity=".8" />
      {/* 무대와 악기 */}
      <rect x="40" y="96" width="240" height="14" fill="#23242e" />
      <rect x="40" y="94" width="240" height="2" fill="#5a6cff" opacity=".8" />
      <circle cx="210" cy="88" r="7" fill="#3a3b48" /><circle cx="224" cy="86" r="5" fill="#4a4b58" /><circle cx="198" cy="84" r="4" fill="#c9b26a" />
      <rect x="92" y="84" width="34" height="5" fill="#ddd" /><rect x="92" y="89" width="2" height="7" fill="#777" /><rect x="124" y="89" width="2" height="7" fill="#777" />
      {[150, 168].map((x) => <g key={x}><rect x={x} y="74" width="1.4" height="22" fill="#888" /><circle cx={x + 0.7} cy="73" r="2" fill="#aaa" /></g>)}
      {/* 객석 */}
      {Array.from({ length: 5 }, (_, r) =>
        Array.from({ length: 12 + r * 2 }, (_, c) => {
          const n = 12 + r * 2
          const w = 260 + r * 30
          const x = 160 - w / 2 + (c * w) / n
          return <rect key={`${r}-${c}`} x={x} y={122 + r * 11} width={w / n - 3} height={7 + r} rx="2" fill="#262836" />
        }),
      )}
    </>
  )
}

export function PrayerRoom() {
  return (
    <>
      <rect width="320" height="180" fill="#2a1f17" />
      <rect y="140" width="320" height="40" fill="#3a2a1c" />
      {/* 창 */}
      <rect x="40" y="30" width="60" height="70" fill="#14203a" stroke="#4a3727" strokeWidth="4" />
      <path d="M70 30 V100 M40 65 H100" stroke="#4a3727" strokeWidth="3" />
      <circle cx="86" cy="46" r="6" fill="#f1e8c8" opacity=".8" />
      {/* 나무 십자가 */}
      <rect x="196" y="28" width="8" height="70" fill="#7b5532" />
      <rect x="180" y="44" width="40" height="8" fill="#7b5532" />
      {/* 탁자와 촛불 */}
      <rect x="170" y="112" width="60" height="6" fill="#6b4a2c" />
      <rect x="176" y="118" width="4" height="26" fill="#5a3d24" /><rect x="220" y="118" width="4" height="26" fill="#5a3d24" />
      <rect x="196" y="96" width="8" height="16" fill="#f3ead6" />
      <g className="flame"><path d="M200 84 q5 7 0 12 q-5 -5 0 -12Z" fill="#ffcf5a" /></g>
      <circle cx="200" cy="92" r="26" fill="#ffcf5a" opacity=".12" className="halo" />
      {/* 무릎틀 */}
      <rect x="168" y="150" width="64" height="8" rx="2" fill="#5a3d24" />
    </>
  )
}
