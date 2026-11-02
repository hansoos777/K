import type { WorldId } from '../core/registry'

/** 홈 카드용 건물 실루엣. 월드 코드를 받지 않고도 그릴 수 있게 코어에 둔 작은 SVG */
export function CardArt({ id }: { id: WorldId }) {
  const common = { viewBox: '0 0 200 120', className: 'card-art', 'aria-hidden': true as const }
  switch (id) {
    case 'christian':
      return (
        <svg {...common}>
          <path d="M0 120 L0 104 Q100 92 200 104 L200 120Z" fill="rgba(0,0,0,.25)" />
          <rect x="70" y="58" width="70" height="50" fill="currentColor" opacity=".9" />
          <path d="M64 60 L105 34 L146 60Z" fill="currentColor" />
          <rect x="44" y="40" width="26" height="68" fill="currentColor" />
          <path d="M40 42 L57 14 L74 42Z" fill="currentColor" />
          <rect x="56" y="0" width="2.6" height="16" fill="#fff6dc" />
          <rect x="51.3" y="4.5" width="12" height="2.6" fill="#fff6dc" />
          <path d="M98 108 V86 a7 7 0 0 1 14 0 V108Z" fill="#fff1c8" opacity=".85" />
          <path d="M52 66 a5 5 0 0 1 10 0 V80 H52Z M80 70 a5 5 0 0 1 10 0 V84 H80Z M120 70 a5 5 0 0 1 10 0 V84 H120Z" fill="#ffd98a" opacity=".8" />
        </svg>
      )
    case 'catholic':
      return (
        <svg {...common}>
          <path d="M0 120 L0 106 L200 106 L200 120Z" fill="rgba(0,0,0,.25)" />
          <rect x="40" y="36" width="30" height="72" fill="currentColor" />
          <rect x="130" y="36" width="30" height="72" fill="currentColor" />
          <path d="M40 38 L55 6 L70 38Z M130 38 L145 6 L160 38Z" fill="currentColor" />
          <rect x="70" y="50" width="60" height="58" fill="currentColor" opacity=".92" />
          <path d="M70 52 L100 28 L130 52Z" fill="currentColor" />
          <circle cx="100" cy="66" r="12" fill="#2a1030" />
          {[0, 45, 90, 135].map((a) => (
            <rect key={a} x="99" y="55" width="2" height="22" fill="#e9b949" transform={`rotate(${a} 100 66)`} />
          ))}
          <circle cx="100" cy="66" r="4" fill="#c83c5a" />
          <path d="M92 108 V92 L100 82 L108 92 V108Z" fill="#ffe0a0" opacity=".85" />
          <path d="M50 60 L55 52 L60 60 V76 H50Z M140 60 L145 52 L150 60 V76 H140Z" fill="#7fb4e8" opacity=".7" />
        </svg>
      )
    case 'mandir':
      return (
        <svg {...common}>
          <path d="M0 120 L0 106 L200 106 L200 120Z" fill="rgba(0,0,0,.25)" />
          <rect x="50" y="84" width="100" height="24" fill="currentColor" />
          <path d="M78 86 C78 60 88 40 100 18 C112 40 122 60 122 86Z" fill="currentColor" />
          {[30, 44, 58, 72].map((y) => (
            <path key={y} d={`M${86 - (y - 18) / 8} ${y} H${114 + (y - 18) / 8}`} stroke="#ffcf7a" strokeWidth="1.4" opacity=".7" />
          ))}
          <path d="M56 86 C56 72 62 64 68 58 C74 64 80 72 80 86Z M120 86 C120 72 126 64 132 58 C138 64 144 72 144 86Z" fill="currentColor" />
          <circle cx="100" cy="14" r="4" fill="#ffcf7a" />
          <path d="M100 10 V2" stroke="#ffcf7a" strokeWidth="1.5" />
          <path d="M100 2 l10 3 -10 3Z" fill="#ff7a1a" />
          <path d="M92 108 V96 a8 8 0 0 1 16 0 V108Z" fill="#ffcf7a" opacity=".9" />
        </svg>
      )
    case 'temple':
      return (
        <svg {...common}>
          <path d="M0 70 L40 40 L70 60 L110 24 L150 56 L200 30 L200 120 L0 120Z" fill="rgba(0,0,0,.22)" />
          <path d="M28 62 Q100 50 172 62 Q160 56 150 46 L50 46 Q40 56 28 62Z" fill="currentColor" />
          <rect x="52" y="62" width="96" height="6" fill="#2f7a63" />
          <rect x="52" y="64" width="96" height="2" fill="#c8553d" />
          <rect x="58" y="68" width="84" height="38" fill="currentColor" opacity=".9" />
          {[66, 88, 110, 132].map((x) => (
            <rect key={x} x={x - 2} y="68" width="4" height="38" fill="#7a2c1f" />
          ))}
          <path d="M74 106 V76 H126 V106Z" fill="#ffd9a0" opacity=".55" />
          <path d="M44 40 Q100 30 156 40 L150 46 L50 46Z" fill="currentColor" opacity=".85" />
          <path d="M20 106 H180 V112 H20Z" fill="currentColor" opacity=".6" />
        </svg>
      )
  }
}
