import { useState } from 'react'
import { bell } from '../../core/audio'
import type { WorldProps } from '../../core/registry'
import { useLocal } from '../../i18n'
import { Btn, Intro, Note, Panel, Scene, WorldFrame } from '../../ui/kit'
import S, { PUJATIME_URL } from './strings'

/**
 * 힌두교 모듈(브리지). 2단계에서 PujaTime 소스가 이 폴더로 들어온다.
 * 그 전까지는 PujaTime에 있는 기능을 다시 만들지 않고 연결만 한다.
 */
function MandirScene({ diyas }: { diyas: number }) {
  return (
    <>
      <defs>
        <linearGradient id="mn-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b1a12" /><stop offset="1" stopColor="#8a3b17" /></linearGradient>
      </defs>
      <rect width="320" height="180" fill="url(#mn-sky)" />
      {/* 시카라 */}
      <path d="M122 96 C122 60 140 30 160 8 C180 30 198 60 198 96Z" fill="#e0a25a" />
      {[24, 38, 52, 66, 80].map((y) => <path key={y} d={`M${150 - (y - 8) / 3.2} ${y} H${170 + (y - 8) / 3.2}`} stroke="#9a5a22" strokeWidth="1.4" />)}
      <circle cx="160" cy="7" r="4" fill="#f6d24a" />
      <path d="M160 3 V-6" stroke="#f6d24a" strokeWidth="1.4" />
      {/* 만다파 */}
      <rect x="70" y="96" width="180" height="60" fill="#c9823f" />
      <path d="M64 98 H256 L246 88 H74Z" fill="#a8622a" />
      {[86, 112, 208, 234].map((x) => <rect key={x} x={x - 4} y="100" width="8" height="56" fill="#e7b46c" />)}
      {/* 성소 문 */}
      <path d="M140 156 V118 Q160 100 180 118 V156Z" fill="#2a120a" />
      <path d="M146 156 V122 Q160 108 174 122 V156Z" fill="#ffcf7a" opacity=".25" className="halo" />
      {/* 금잔화 꽃줄 */}
      {[0, 1].map((r) => (
        <path key={r} d={`M74 ${102 + r * 4} Q160 ${126 + r * 4} 246 ${102 + r * 4}`} stroke={r ? '#f6d24a' : '#f28c1a'} strokeWidth="3.4" strokeDasharray="1 2.2" strokeLinecap="round" fill="none" />
      ))}
      {/* 종 */}
      <path d="M160 88 V96" stroke="#5a3a1a" strokeWidth="1" />
      <path d="M155 104 q0 -8 5 -8 q5 0 5 8 l2 2 h-14Z" fill="#d8b04a" />
      <rect y="156" width="320" height="24" fill="#5a2a12" />
      {/* 디야 */}
      {Array.from({ length: 9 }, (_, i) => {
        const x = 96 + i * 16
        return (
          <g key={i}>
            <path d={`M${x - 5} 164 q5 6 10 0Z`} fill="#b5652a" />
            {i < diyas && <path className="flame" d={`M${x} 156 q3 4 0 7 q-3 -3 0 -7Z`} fill="#ffcf5a" />}
          </g>
        )
      })}
    </>
  )
}

export default function MandirWorld({ place }: WorldProps) {
  const t = useLocal(S)
  const [diyas, setDiyas] = useState(0)
  return (
    <WorldFrame id="mandir" place={place}>
      {(p) => (
        <>
          {p === 'mandir' && (
            <>
              <Scene label={t.scene}><MandirScene diyas={diyas} /></Scene>
              <Intro>{t.intro.mandir}</Intro>
              <div className="row">
                <Btn onClick={() => bell('ghanta')}>{t.ring}</Btn>
                <Btn onClick={() => setDiyas((n) => Math.min(9, n + 1))} disabled={diyas >= 9}>{t.diya} ({diyas}/9)</Btn>
              </div>
              <Note>{t.ringNote} {t.diyaNote}</Note>
              <Panel title={t.partsTitle}>
                <dl className="deflist">{t.parts.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}</dl>
                <Note>{t.partsNote}</Note>
              </Panel>
            </>
          )}
          {p === 'pujatime' && (
            <>
              <Intro>{t.intro.pujatime}</Intro>
              <p><a className="btn btn-primary" href={PUJATIME_URL} target="_blank" rel="noopener">{t.open} ↗</a></p>
              <Note>{t.openNote}</Note>
              <Panel title={t.hasTitle}><ul>{t.has.map((h) => <li key={h}>{h}</li>)}</ul></Panel>
              <Panel title={t.planTitle}><ol className="steps">{t.plan.map((h) => <li key={h}>{h}</li>)}</ol></Panel>
            </>
          )}
        </>
      )}
    </WorldFrame>
  )
}
