import { useEffect, useState } from 'react'
import { bell, jukbi } from '../core/audio'
import { resolvePlace, WORLDS } from '../core/registry'
import { href } from '../core/router'
import { addMinutes, update, useStore } from '../core/store'
import type { Activity } from '../learn/types'
import { useLocal, useT } from '../i18n'
import CS from '../worlds/christian/strings'
import TS from '../worlds/temple/strings'
import { mmss, useCountdown } from './hooks'
import { Icon } from './icons'
import { img, Photo } from './Photo'
import { Btn, Note } from './kit'

function PlaceCards({ keys, empty }: { keys: string[]; empty: string }) {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const items = keys.map(resolvePlace).filter((x) => x && !x.place.soon)
  if (!items.length) return <p className="hint">{empty}</p>
  return (
    <ul className="place-row">
      {items.map((x) => (
        <li key={x!.world.id + x!.place.id}>
          <a className="place-card" href={href(`w/${x!.world.id}/${x!.place.id}`)} style={{ ['--c' as string]: x!.world.colors[1] }}>
            <img src={`/photos/${x!.world.id}_${x!.place.id}.webp`} alt="" loading="lazy" width="320" height="200" />
            <span className="place-card-text"><small>{t.worlds[x!.world.id].name}</small><strong>{lang === 'en' ? x!.place.en : x!.place.ko}</strong></span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/** 침묵 기도 + 기도 노트 (이 기기에만 저장) */
function Prayer() {
  const c = useLocal(CS)
  const lang = useStore((s) => s.lang)
  const prayers = useStore((s) => s.prayers)
  const [text, setText] = useState('')
  const cd = useCountdown(() => { bell('church'); addMinutes('pray', cd.total) })
  const save = () => {
    const v = text.trim()
    if (!v) return
    update((s) => ({ prayers: [{ id: crypto.randomUUID(), text: v.slice(0, 2000), at: Date.now() }, ...s.prayers].slice(0, 200) }))
    setText('')
  }
  return (
    <>
      <h3>{c.silentTitle}</h3>
      {cd.running ? (
        <div className="timer"><span className="timer-big">{mmss(cd.left)}</span><Btn onClick={cd.stop}>{c.stopTimer}</Btn></div>
      ) : (
        <div className="row">{[1, 3, 5].map((m) => <Btn key={m} onClick={() => { bell('church'); cd.start(m * 60) }}>{m}{c.min}</Btn>)}</div>
      )}
      <h3>{c.notesTitle}</h3>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={c.notesPlaceholder} rows={3} maxLength={2000} />
      <div className="row"><Btn onClick={save} disabled={!text.trim()}>{c.save}</Btn></div>
      <Note>{c.notesNote}</Note>
      {prayers.length > 0 && (
        <ul className="notes">
          {prayers.slice(0, 20).map((p) => (
            <li key={p.id}>
              <time>{new Date(p.at).toLocaleDateString(lang === 'en' ? 'en' : 'ko')}</time>
              <p>{p.text}</p>
              <button className="link" onClick={() => update((s) => ({ prayers: s.prayers.filter((x) => x.id !== p.id) }))}>{c.del}</button>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}

/** 호흡 명상 (4초 들숨 · 6초 날숨, 죽비로 시작과 끝) */
function Meditate() {
  const tm = useLocal(TS)
  const t = useT()
  const cd = useCountdown(() => { jukbi(1); addMinutes('meditate', cd.total) })
  const inhale = (cd.total - cd.left) % 10 < 4
  return (
    <>
      {cd.running ? (
        <div className="breath">
          <div className={`breath-orb ${inhale ? 'in' : 'out'}`} aria-hidden="true" />
          <span className="timer-phase" aria-live="polite">{inhale ? tm.inhale : tm.exhale}</span>
          <span className="timer-big">{mmss(cd.left)}</span>
          <Btn onClick={() => { cd.stop(); jukbi(1) }}>{tm.end}</Btn>
        </div>
      ) : (
        <div className="row">{[3, 5, 10].map((m) => <Btn key={m} onClick={() => { jukbi(3); cd.start(m * 60) }}>{m}{tm.min}</Btn>)}</div>
      )}
      <Note>{tm.breathNote}</Note>
      <p><a className="btn" href={href('w/temple/meditation')}>{t.mine.meditateHall}</a></p>
    </>
  )
}

/** 나의 활동 기록: 숫자만 (내용은 남기지 않음) */
function Log() {
  const t = useT()
  const s = useStore((x) => x)
  const items: [string, number, string][] = [
    [t.mine.log.visits, new Set(s.visits.map((v) => v.id)).size, t.mine.log.unitPlace],
    [t.mine.log.pray, s.minutes.pray, t.mine.log.unitMin],
    [t.mine.log.meditate, s.minutes.meditate, t.mine.log.unitMin],
    [t.mine.log.notes, s.prayers.length, t.mine.log.unitCount],
    [t.mine.log.candles, s.candles, t.mine.log.unitCount],
    [t.mine.log.lanterns, s.lanterns, t.mine.log.unitCount],
  ]
  return (
    <dl className="stats">
      {items.map(([k, v, u]) => <div key={k}><dt>{k}</dt><dd>{v}<small>{u}</small></dd></div>)}
    </dl>
  )
}

/** 종교별 신앙 활동 중 가상 공간에서 해 볼 수 있는 것 */
function ByFaith() {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const [acts, setActs] = useState<Record<string, Activity[]>>({})
  useEffect(() => {
    let alive = true
    Promise.all(WORLDS.map((w) => w.learn().then((m) => [w.id, (lang === 'en' ? m.default.en : m.default.ko).activities] as const))).then((r) => alive && setActs(Object.fromEntries(r)))
    return () => { alive = false }
  }, [lang])
  return (
    <ul className="byfaith">
      {WORLDS.map((w) => (
        <li key={w.id}>
          <a className="byfaith-name" href={href(`explore/${w.id}/activities`)}>{t.worlds[w.id].name}</a>
          <span className="chips">
            {(acts[w.id] ?? []).filter((a) => a.place).map((a) => <a key={a.name} className="chip" href={href(`w/${w.id}/${a.place}`)}>{a.name}</a>)}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** ④ 나의 공간: 개인 사원·기도·명상·즐겨찾기·최근 이용을 한 화면에서 */
export default function Mine({ section }: { section?: string }) {
  const t = useT()
  const favorites = useStore((s) => s.favorites)
  const visits = useStore((s) => s.visits)
  const lang = useStore((s) => s.lang)
  const [tab, setTab] = useState<'pray' | 'meditate'>(section === 'meditate' ? 'meditate' : 'pray')
  const scrollTo = (el: string) => document.getElementById(el)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  const open = (k: 'pray' | 'meditate') => { setTab(k); setTimeout(() => scrollTo('practice'), 30) }
  useEffect(() => { if (section === 'pray' || section === 'meditate') setTimeout(() => scrollTo('practice'), 150) }, [section])
  return (
    <div className="screen screen-cover">
      <section className="cover">
        <Photo src={img('mine_hero')} fallback="/photos/temple_meditation.webp" className="cover-img" w={1600} h={700} eager />
        <div className="cover-in">
          <h1>{t.mine.heroTitle}</h1>
          <p>{t.mine.heroSub}</p>
        </div>
      </section>

      <ul className="tiles">
        <li><button onClick={() => open('pray')}><Icon name="pray" size={26} /><strong>{t.mine.tPray}</strong><small>{t.mine.tPraySub}</small></button></li>
        <li><button onClick={() => open('meditate')}><Icon name="lotus" size={26} /><strong>{t.mine.tMed}</strong><small>{t.mine.tMedSub}</small></button></li>
        <li><a href={href('w/mandir/shrine')}><Icon name="diya" size={26} /><strong>{t.mine.tShrine}</strong><small>{t.mine.tShrineSub}</small></a></li>
        <li><button onClick={() => scrollTo('log')}><Icon name="note" size={26} /><strong>{t.mine.logTitle}</strong><small>{t.mine.tLogSub}</small></button></li>
      </ul>

      <section>
        <div className="sec-head"><h2 className="sec-title">{t.mine.recentAct}</h2></div>
        {visits.length ? (
          <ul className="recent">
            {visits.slice(0, 3).map((v) => {
              const x = resolvePlace(v.id)
              if (!x) return null
              return (
                <li key={v.id}>
                  <a href={href(`w/${x.world.id}/${x.place.id}`)}>
                    <img src={`/photos/${x.world.id}_${x.place.id}.webp`} alt="" loading="lazy" width="160" height="110" />
                    <span><strong>{lang === 'en' ? x.place.en : x.place.ko}</strong><small>{t.worlds[x.world.id].name} · {new Date(v.at).toLocaleDateString(lang === 'en' ? 'en' : 'ko')}</small></span>
                    <Icon name="chev" size={16} />
                  </a>
                </li>
              )
            })}
          </ul>
        ) : <p className="hint">{t.mine.emptyRecent}</p>}
      </section>

      <a className="shrine-card" href={href('w/mandir/shrine')}>
        <img src="/photos/mandir_shrine.webp" alt="" loading="lazy" width="320" height="400" />
        <span>
          <strong>{t.mine.shrine}</strong>
          <span>{t.mine.shrineSub}</span>
          <span className="btn btn-primary">{t.mine.shrineGo}</span>
        </span>
      </a>

      <section className="card-sec" id="practice">
        <div className="tabs small" role="tablist">
          <button role="tab" aria-selected={tab === 'pray'} className={tab === 'pray' ? 'on' : ''} onClick={() => setTab('pray')}>{t.mine.pray}</button>
          <button role="tab" aria-selected={tab === 'meditate'} className={tab === 'meditate' ? 'on' : ''} onClick={() => setTab('meditate')}>{t.mine.meditate}</button>
        </div>
        {tab === 'pray' ? <Prayer /> : <Meditate />}
      </section>

      <section id="favorites">
        <h2 className="sec-title">{t.mine.favorites}</h2>
        <PlaceCards keys={favorites} empty={t.mine.emptyFav} />
      </section>
      <section>
        <h2 className="sec-title">{t.mine.recent}</h2>
        <PlaceCards keys={visits.slice(0, 10).map((v) => v.id)} empty={t.mine.emptyRecent} />
      </section>
      <section id="log">
        <h2 className="sec-title">{t.mine.logTitle}</h2>
        <Log />
        <p className="hint">{t.mine.logNote}</p>
      </section>
      <section id="activities">
        <h2 className="sec-title">{t.mine.byFaith}</h2>
        <ByFaith />
      </section>
    </div>
  )
}
