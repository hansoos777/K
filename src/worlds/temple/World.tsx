import { useEffect, useState } from 'react'
import { bell, jukbi, moktak } from '../../core/audio'
import type { WorldProps } from '../../core/registry'
import { update, useStore } from '../../core/store'
import { useLocal } from '../../i18n'
import { mmss, useCountdown } from '../../ui/hooks'
import { Btn, Intro, Note, Panel, Scene, SoundButton, WorldFrame } from '../../ui/kit'
import { Incense, MeditationHall, Sansa } from './scenes'
import S from './strings'

type T = (typeof S)['ko']

function DefList({ items }: { items: [string, string][] }) {
  return (
    <dl className="deflist">
      {items.map(([a, b]) => <div key={a}><dt>{a}</dt><dd>{b}</dd></div>)}
    </dl>
  )
}

function BellPanel({ t }: { t: T }) {
  const [n, setN] = useState(0)
  const [cool, setCool] = useState(false)
  return (
    <Panel title={t.bellTitle}>
      <div className="row">
        <Btn
          disabled={cool}
          onClick={() => {
            bell('beomjong')
            setN(n + 1)
            // 범종은 울림이 길어 연타를 막는다 (소리 노드 과다 생성 방지)
            setCool(true)
            setTimeout(() => setCool(false), 2500)
          }}
        >
          {t.strike}
        </Btn>
        {n > 0 && <span className="count">{t.strikes(n)}</span>}
      </div>
      <Note>{t.bellNote}</Note>
    </Panel>
  )
}

function IncensePanel({ t }: { t: T }) {
  const [burning, setBurning] = useState(false)
  useEffect(() => {
    if (!burning) return
    const id = setTimeout(() => setBurning(false), 3 * 60 * 1000)
    return () => clearTimeout(id)
  }, [burning])
  return (
    <Panel title={t.incenseTitle}>
      <div className="row">
        <Incense burning={burning} />
        <Btn onClick={() => setBurning(true)} disabled={burning}>{burning ? t.burning : t.light}</Btn>
      </div>
      <Note>{t.incenseNote}</Note>
    </Panel>
  )
}

function Breath({ t, onActive }: { t: T; onActive: (b: boolean) => void }) {
  const cd = useCountdown(() => jukbi(1))
  useEffect(() => onActive(cd.running), [cd.running, onActive])
  const elapsed = cd.total - cd.left
  const inhale = elapsed % 10 < 4 // 4초 들숨 · 6초 날숨
  return (
    <Panel title={t.breathTitle}>
      {cd.running ? (
        <div className="timer">
          <span className="timer-phase" aria-live="polite">{inhale ? t.inhale : t.exhale}</span>
          <span className="timer-big">{mmss(cd.left)}</span>
          <Btn onClick={() => { cd.stop(); jukbi(1) }}>{t.end}</Btn>
        </div>
      ) : (
        <div className="row">
          {[3, 5, 10].map((m) => (
            <Btn key={m} onClick={() => { jukbi(3); cd.start(m * 60) }}>{m}{t.min}</Btn>
          ))}
        </div>
      )}
      <Note>{t.breathNote}</Note>
    </Panel>
  )
}

export default function TempleWorld({ place }: WorldProps) {
  const t = useLocal(S)
  const [lit, setLit] = useState(0)
  const total = useStore((s) => s.lanterns)
  const [breathing, setBreathing] = useState(false)
  return (
    <WorldFrame id="temple" place={place}>
      {(p) => (
        <>
          {p === 'sansa' && (
            <>
              <Scene label={t.scene.sansa}><Sansa lit={lit} /></Scene>
              <Intro>{t.intro.sansa}</Intro>
              <SoundButton kind="wind" label={t.wind} />
              <Panel title={t.lanternTitle}>
                <div className="row">
                  <Btn
                    disabled={lit >= 15}
                    onClick={() => {
                      setLit(lit + 1)
                      update((s) => ({ lanterns: s.lanterns + 1 }))
                    }}
                  >
                    {t.lanternTitle} ({lit}/15)
                  </Btn>
                </div>
                <Note>{t.lanternNote}</Note>
                <p className="hint">{t.lanternCount(total)}</p>
              </Panel>
              <BellPanel t={t} />
              <Panel title={t.moktakTitle}>
                <div className="row"><Btn onClick={moktak}>{t.hit}</Btn></div>
                <Note>{t.moktakNote}</Note>
              </Panel>
              <IncensePanel t={t} />
              <Panel title={t.pathTitle}><DefList items={t.path} /><Note>{t.pathNote}</Note></Panel>
              <Note>{t.others}</Note>
            </>
          )}
          {p === 'meditation' && (
            <>
              <Scene label={t.scene.meditation}><MeditationHall active={breathing} /></Scene>
              <Intro>{t.intro.meditation}</Intro>
              <Breath t={t} onActive={setBreathing} />
              <Panel title={t.stayTitle}><Note>{t.stayNote}</Note></Panel>
            </>
          )}
        </>
      )}
    </WorldFrame>
  )
}
