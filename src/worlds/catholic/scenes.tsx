import { Rays } from '../../ui/kit'

/** 십자고상: 단순화한 형태로 정중하게 */
export function Crucifix({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-2.5" y="0" width="5" height="44" fill="#5b3a22" />
      <rect x="-14" y="9" width="28" height="4.5" fill="#5b3a22" />
      <circle cx="0" cy="8" r="2.2" fill="#e8d7b8" />
      <path d="M-12 11 L0 12 L12 11 M0 10.5 V28 M0 28 L-1 38 M0 28 L1 38" stroke="#e8d7b8" strokeWidth="2" strokeLinecap="round" fill="none" />
    </g>
  )
}

/** 성모상: 흰 옷과 푸른 망토 */
export function Mary({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 C-7 0 -8 8 -8 12 L-11 46 H11 L8 12 C8 8 7 0 0 0Z" fill="#3b67b0" />
      <path d="M0 4 C-4 4 -5 9 -5 12 L-6 46 H6 L5 12 C5 9 4 4 0 4Z" fill="#f2efe6" />
      <circle cx="0" cy="6" r="3.2" fill="#f0e2cc" />
      <path d="M-2 22 L0 18 L2 22Z" fill="#e8d7b8" />
      <ellipse cx="0" cy="-1.5" rx="6" ry="1.4" fill="none" stroke="#f3cf63" strokeWidth=".9" />
    </g>
  )
}

function Candles({ x, y, n, lit }: { x: number; y: number; n: number; lit: number }) {
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <rect x={x + i * 7} y={y} width="3.4" height="9" fill="#f3ead6" />
          {i < lit && <path className="flame" d={`M${x + i * 7 + 1.7} ${y - 6} q2.5 3.5 0 6 q-2.5 -2.5 0 -6Z`} fill="#ffcf5a" />}
        </g>
      ))}
    </g>
  )
}

export function Parish() {
  return (
    <>
      <defs>
        <linearGradient id="pa-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2b1d2d" /><stop offset="1" stopColor="#4a3524" /></linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#pa-w)" />
      <path d="M100 150 V60 Q160 10 220 60 V150Z" fill="#3a2630" />
      <path d="M110 150 V64 Q160 22 210 64 V150Z" fill="#43302a" />
      <Crucifix x={160} y={34} s={1.15} />
      {/* 감실과 감실등 */}
      <rect x="150" y="96" width="20" height="18" rx="2" fill="#c9a24a" />
      <path d="M160 96 V114" stroke="#8a6a24" strokeWidth=".8" />
      <circle cx="182" cy="98" r="3" fill="#d4262e" className="glow" />
      <circle cx="182" cy="98" r="8" fill="#ff3b3b" opacity=".15" className="halo" />
      {/* 제대 */}
      <rect x="120" y="124" width="80" height="18" fill="#efe6d4" />
      <rect x="120" y="120" width="80" height="5" fill="#fffaf0" />
      <rect x="120" y="124" width="80" height="3" fill="#4e8c4a" />
      <Candles x={124} y={110} n={2} lit={2} />
      <Candles x={186} y={110} n={2} lit={2} />
      {/* 성모상 (왼쪽 감실 옆) */}
      <Mary x={62} y={84} s={1.05} />
      <rect x="50" y="132" width="24" height="6" fill="#6b4a2c" />
      {/* 독서대 */}
      <path d="M236 106 h20 l-4 34 h-12Z" fill="#6b4a2c" />
      <rect x="232" y="102" width="28" height="5" fill="#8a6238" transform="rotate(-6 246 104)" />
      {/* 벽의 14처 */}
      {[18, 32, 288, 302].map((x) => <rect key={x} x={x} y="60" width="8" height="10" fill="#7a5d3a" />)}
      <rect y="150" width="320" height="30" fill="#2a1d16" />
      {Array.from({ length: 4 }, (_, i) => <rect key={i} x={40 - i * 10} y={156 + i * 6} width={240 + i * 20} height="3" fill="#4a3020" />)}
    </>
  )
}

export function Gothic() {
  const colors = ['#b5213b', '#2a5db0', '#e3b341', '#2f8f5b', '#7a3c98']
  return (
    <>
      <defs>
        <linearGradient id="go-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#101522" /><stop offset="1" stopColor="#3a3226" /></linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#go-w)" />
      {/* 리브 볼트 */}
      {[60, 120, 200, 260].map((x) => <path key={x} d={`M${x} 180 V70 Q${x} 10 160 0`} stroke="#3a3a44" strokeWidth="5" fill="none" />)}
      {[0, 40, 280, 320].map((x) => <path key={x} d={`M${x} 180 V40`} stroke="#2a2a33" strokeWidth="10" />)}
      {/* 장미창 */}
      <g transform="translate(160 46)" className="glow">
        <circle r="30" fill="#1a1020" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M0 -6 L5 -27 Q0 -30 -5 -27Z" fill={colors[i % colors.length]} transform={`rotate(${i * 30})`} />
        ))}
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx="0" cy="-15" r="3" fill={colors[(i + 2) % colors.length]} transform={`rotate(${i * 30 + 15})`} />)}
        <circle r="6" fill="#e3b341" />
        <circle r="30" fill="none" stroke="#0c0810" strokeWidth="2" />
      </g>
      {/* 뾰족 아치 창 */}
      {[78, 222].map((x) => (
        <g key={x}>
          <path d={`M${x} 140 V72 Q${x} 50 ${x + 10} 44 Q${x + 20} 50 ${x + 20} 72 V140Z`} fill="#26406e" className="glow" />
          <path d={`M${x + 10} 46 V140 M${x} 92 H${x + 20}`} stroke="#0c0810" strokeWidth="1.2" />
        </g>
      ))}
      <Rays x={140} color="#e9c87a" n={2} />
      {/* 제단과 주교좌 */}
      <rect x="130" y="128" width="60" height="14" fill="#e8dfcc" />
      <Crucifix x={160} y={86} s={0.9} />
      <path d="M204 112 h12 v24 h-12Z M202 110 h16 v4 h-16Z" fill="#7a2232" />
      <rect y="150" width="320" height="30" fill="#1d1a16" />
      <path d="M150 180 L158 142 H162 L170 180Z" fill="#7a2232" opacity=".8" />
    </>
  )
}

export function Grotto({ lit }: { lit: number }) {
  return (
    <>
      <rect width="320" height="180" fill="#14202a" />
      <circle cx="270" cy="30" r="10" fill="#f4ecd0" opacity=".7" />
      <path d="M0 180 V100 Q40 60 70 70 Q90 20 160 16 Q230 20 250 70 Q280 60 320 100 V180Z" fill="#4b4a46" />
      <path d="M100 150 Q100 50 160 46 Q220 50 220 150Z" fill="#1d1c1b" />
      {[[30, 110], [60, 90], [250, 92], [286, 112], [90, 60], [228, 62]].map(([x, y]) => <ellipse key={`${x}${y}`} cx={x} cy={y} rx="16" ry="10" fill="#5c5a55" />)}
      <Mary x={160} y={62} s={1.3} />
      <rect x="146" y="122" width="28" height="6" fill="#77756e" />
      {/* 봉헌초 받침 */}
      <rect x="74" y="150" width="172" height="8" fill="#3a3632" />
      {Array.from({ length: 24 }, (_, i) => {
        const x = 80 + (i % 12) * 14
        const y = i < 12 ? 142 : 150
        return (
          <g key={i}>
            <rect x={x} y={y} width="4" height="6" fill="#d8402f" opacity=".85" />
            {i < lit && <path className="flame" d={`M${x + 2} ${y - 6} q2.6 3.6 0 6 q-2.6 -2.6 0 -6Z`} fill="#ffcf5a" />}
          </g>
        )
      })}
      {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={112 + i * 16} cy={136} r="3" fill={['#fff', '#f6c3d0', '#ffe27a'][i % 3]} />)}
    </>
  )
}

export function Confessional() {
  return (
    <>
      <rect width="320" height="180" fill="#2a1f19" />
      <rect x="80" y="30" width="160" height="130" fill="#5a3b22" />
      <path d="M80 30 L160 10 L240 30Z" fill="#4a3019" />
      {[80, 133, 186].map((x, i) => (
        <g key={x}>
          <rect x={x + 6} y="40" width="42" height="112" fill={i === 1 ? '#3a2614' : '#4a3019'} />
          <rect x={x + 12} y="48" width="30" height="40" fill="#2a1a0e" />
          {i !== 1 && <rect x={x + 12} y="48" width="30" height="40" fill="#6b1e2a" opacity=".6" />}
        </g>
      ))}
      <rect x="150" y="56" width="20" height="4" fill="#d8b56a" />
      <rect x="158" y="48" width="4" height="20" fill="#d8b56a" />
      <rect y="160" width="320" height="20" fill="#1d1510" />
    </>
  )
}
