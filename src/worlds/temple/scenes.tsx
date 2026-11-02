const LANTERN = ['#e8473c', '#f2a33a', '#f6d24a', '#5bbf6a', '#4d8fe0', '#e86aa8', '#ffffff']

export function Sansa({ lit }: { lit: number }) {
  return (
    <>
      <defs>
        <linearGradient id="sa-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c9d6cf" /><stop offset="1" stopColor="#efe6d2" /></linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#sa-sky)" />
      <path d="M0 90 Q60 30 120 70 Q170 20 220 60 Q270 30 320 70 V180 H0Z" fill="#9fb3a6" />
      <path d="M0 110 Q50 70 110 96 Q170 60 230 92 Q280 70 320 96 V180 H0Z" fill="#6d8a78" />
      <path d="M0 130 Q80 100 160 118 Q240 100 320 124 V180 H0Z" fill="#3f5e4e" />
      {/* 대웅전 */}
      <g transform="translate(160 92)">
        <path d="M-70 8 Q0 -6 70 8 Q60 2 52 -10 L-52 -10 Q-60 2 -70 8Z" fill="#3a3a3a" />
        <path d="M-60 -10 Q0 -20 60 -10 L54 -16 L-54 -16Z" fill="#2c2c2c" />
        <rect x="-50" y="8" width="100" height="5" fill="#2f7a63" />
        <rect x="-50" y="10" width="100" height="1.6" fill="#c8553d" />
        <rect x="-50" y="12.5" width="100" height="1.2" fill="#3a6fb0" />
        <rect x="-44" y="13" width="88" height="26" fill="#d9c7a0" />
        {[-40, -20, 0, 20, 40].map((x) => <rect key={x} x={x - 1.6} y="13" width="3.2" height="26" fill="#8c2f22" />)}
        {[-30, -10, 10, 30].map((x) => <rect key={x} x={x - 8} y="16" width="16" height="20" fill="#b8854a" opacity=".55" />)}
        <rect x="-56" y="39" width="112" height="6" fill="#8a8170" />
      </g>
      {/* 범종각 */}
      <g transform="translate(262 114)">
        <path d="M-22 0 Q0 -8 22 0 L16 -8 H-16Z" fill="#333" />
        <rect x="-18" y="0" width="3" height="22" fill="#8c2f22" /><rect x="15" y="0" width="3" height="22" fill="#8c2f22" />
        <path d="M-6 4 h12 v10 q0 4 -6 4 q-6 0 -6 -4Z" fill="#6b5a3a" />
      </g>
      {/* 일주문 */}
      <g transform="translate(64 128)">
        <path d="M-30 0 Q0 -8 30 0 L24 -8 H-24Z" fill="#333" />
        <rect x="-26" y="0" width="52" height="4" fill="#2f7a63" />
        <rect x="-20" y="4" width="4" height="34" fill="#8c2f22" /><rect x="16" y="4" width="4" height="34" fill="#8c2f22" />
      </g>
      {/* 연등 줄 */}
      <path d="M0 40 Q160 70 320 40" stroke="#5a4a3a" strokeWidth=".8" fill="none" />
      {Array.from({ length: 15 }, (_, i) => {
        const x = 12 + i * 21
        const y = 40 + 30 * (1 - Math.pow((x - 160) / 160, 2)) * 0.95
        const on = i < lit
        return (
          <g key={i} className={on ? 'glow' : ''}>
            <ellipse cx={x} cy={y + 7} rx="6" ry="7" fill={on ? LANTERN[i % LANTERN.length] : '#cfc6b4'} opacity={on ? 1 : 0.8} />
            {on && <ellipse cx={x} cy={y + 7} rx="10" ry="11" fill={LANTERN[i % LANTERN.length]} opacity=".2" className="halo" />}
            <rect x={x - 3} y={y} width="6" height="1.6" fill="#7a5a2a" />
            <path d={`M${x - 2} ${y + 14} v4 M${x} ${y + 14} v5 M${x + 2} ${y + 14} v4`} stroke={on ? LANTERN[i % LANTERN.length] : '#bbb'} strokeWidth=".7" />
          </g>
        )
      })}
      <path d="M64 166 Q120 150 160 140" stroke="#cbbf9e" strokeWidth="6" fill="none" opacity=".6" />
    </>
  )
}

export function MeditationHall({ active }: { active: boolean }) {
  return (
    <>
      <rect width="320" height="180" fill="#1b1a17" />
      <rect y="132" width="320" height="48" fill="#3b2f22" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 40} y="132" width="1" height="48" fill="#2a2118" />)}
      {/* 창호 */}
      <rect x="200" y="26" width="84" height="86" fill="#e8dcc0" opacity=".16" />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={200 + i * 21} y="26" width="1.4" height="86" fill="#5a4630" />)}
      {[0, 1, 2, 3].map((i) => <rect key={i} x="200" y={26 + i * 21.5} width="84" height="1.4" fill="#5a4630" />)}
      <circle cx="250" cy="56" r="11" fill="#f4ecd0" opacity=".55" />
      {/* 방석 */}
      <ellipse cx="120" cy="150" rx="40" ry="9" fill="#7a2c22" />
      <ellipse cx="120" cy="146" rx="34" ry="7" fill="#943a2d" />
      {/* 호흡 원 */}
      <g className={active ? 'breathing' : ''} style={{ transformOrigin: '120px 80px', transformBox: 'view-box' }}>
        <circle cx="120" cy="80" r="30" fill="none" stroke="#e8dcc0" strokeWidth="1.2" opacity=".55" />
        <circle cx="120" cy="80" r="12" fill="#e8dcc0" opacity=".12" />
      </g>
    </>
  )
}

export function Incense({ burning }: { burning: boolean }) {
  return (
    <svg viewBox="0 0 80 100" width="90" height="112" aria-hidden="true" className="incense">
      <path d="M20 86 h40 l-4 10 h-32Z" fill="#8a7a5a" />
      <rect x="18" y="82" width="44" height="5" fill="#a8956a" />
      {[30, 40, 50].map((x) => (
        <g key={x}>
          <rect x={x - 0.8} y="40" width="1.6" height="44" fill="#7a3a24" />
          {burning && <circle cx={x} cy="40" r="1.4" fill="#ff7a3a" className="glow" />}
          {burning && <path className="smoke" d={`M${x} 38 q-5 -8 0 -14 q5 -6 0 -14`} stroke="#ddd" strokeWidth="1" fill="none" opacity=".5" />}
        </g>
      ))}
    </svg>
  )
}
