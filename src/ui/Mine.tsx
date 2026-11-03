import { useState } from 'react'
import { bell, jukbi } from '../core/audio'
import { resolvePlace } from '../core/registry'
import { href } from '../core/router'
import { update, useStore } from '../core/store'
import { useLocal, useT } from '../i18n'
import CS from '../worlds/christian/strings'
import TS from '../worlds/temple/strings'
import { mmss, useCountdown } from './hooks'
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
            <img src={`/thumbs/${x!.world.id}_${x!.place.id}.webp`} alt="" loading="lazy" width="320" height="200" />
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
  const cd = useCountdown(() => bell('church'))
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
  const cd = useCountdown(() => jukbi(1))
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

/** ④ 나의 공간: 개인 사원·기도·명상·즐겨찾기·최근 이용을 한 화면에서 */
export default function Mine({ section }: { section?: string }) {
  const t = useT()
  const favorites = useStore((s) => s.favorites)
  const visits = useStore((s) => s.visits)
  const [tab, setTab] = useState<'pray' | 'meditate'>(section === 'meditate' ? 'meditate' : 'pray')
  return (
    <div className="screen">
      <div className="screen-head">
        <h1>{t.mine.title}</h1>
        <p className="hint">{t.mine.sub}</p>
      </div>

      <a className="shrine-card" href={href('w/mandir/shrine')}>
        <img src="/thumbs/mandir_shrine.webp" alt="" loading="lazy" width="320" height="400" />
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

      <section>
        <h2 className="sec-title">{t.mine.favorites}</h2>
        <PlaceCards keys={favorites} empty={t.mine.emptyFav} />
      </section>
      <section>
        <h2 className="sec-title">{t.mine.recent}</h2>
        <PlaceCards keys={visits.slice(0, 10).map((v) => v.id)} empty={t.mine.emptyRecent} />
      </section>
    </div>
  )
}
