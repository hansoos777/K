import { useEffect, useState } from 'react'
import { WORLDS } from '../core/registry'
import { go, href } from '../core/router'
import { useStore } from '../core/store'
import type { CompareTopic } from '../learn/compare'
import { useT } from '../i18n'
import { COVER, photo } from './Home'
import { Icon } from './icons'
import { EXT, img, Photo } from './Photo'
import ReligionDetail, { type RelTab } from './ReligionDetail'

/** 종교 간 비교 학습 (#/explore/compare) */
function Compare() {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const [topics, setTopics] = useState<CompareTopic[]>([])
  const [cur, setCur] = useState(0)
  useEffect(() => {
    let alive = true
    import('../learn/compare').then((m) => alive && setTopics(lang === 'en' ? m.default.en : m.default.ko))
    return () => { alive = false }
  }, [lang])
  const tp = topics[cur]
  return (
    <div className="screen">
      <a className="back-link" href={href('explore')}><Icon name="back" size={18} />{t.ex.title}</a>
      <div className="screen-head">
        <h1>{t.cmp.title}</h1>
        <p className="hint">{t.cmp.sub}</p>
      </div>
      <div className="chips scroll" role="tablist">
        {topics.map((x, i) => <button key={x.id} role="tab" aria-selected={i === cur} className={`chip ${i === cur ? 'on' : ''}`} onClick={() => setCur(i)}>{x.title}</button>)}
      </div>
      {tp && (
        <>
          <ul className="compare">
            {WORLDS.map((w) => (
              <li key={w.id}>
                <a href={href(`explore/${w.id}/learn`)}>{t.worlds[w.id].name}</a>
                <p>{tp.items[w.id as keyof CompareTopic['items']]}</p>
              </li>
            ))}
          </ul>
          {tp.note && <p className="hint">{tp.note}</p>}
        </>
      )}
      <p className="disclaimer">{t.cmp.note}</p>
    </div>
  )
}

/**
 * ② 종교 탐색
 * - #/explore              네 종교를 사진과 함께 한눈에 + 종교 간 비교
 * - #/explore/<id>[/<tab>] 종교 상세
 * - #/explore/compare      비교 학습
 */
export default function Explore({ id, tab }: { id?: string; tab?: string }) {
  const t = useT()
  if (id === 'compare') return <Compare />
  const cur = WORLDS.find((w) => w.id === id)
  if (!cur) {
    return (
      <div className="screen">
        <div className="screen-head">
          <h1>{t.h.exTitle}</h1>
          <p className="hint">{t.h.exSub}</p>
        </div>
        <ul className="faith-grid">
          {WORLDS.map((w) => (
            <li key={w.id}>
              <a className="card" href={href(`explore/${w.id}`)}>
                <span className="fg-img"><Photo src={img(EXT[w.id])} fallback={photo(w.id, COVER[w.id])} w={800} h={560} /></span>
                <span className="card-body">
                  <strong>{t.worlds[w.id].name}</strong>
                  <span className="fg-sub">{t.h.short[w.id]}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
        <a className="compare-link" href={href('explore/compare')}>
          <span><strong>{t.cmp.title}</strong><span>{t.cmp.sub}</span></span>
          <Icon name="chev" size={18} />
        </a>
      </div>
    )
  }
  return (
    <div className="screen screen-rel">
      <div className="faith-switch" role="tablist">
        <button role="tab" aria-selected={false} onClick={() => go('explore')} aria-label={t.r.allFaiths}><Icon name="back" size={18} /></button>
        {WORLDS.map((w) => (
          <button key={w.id} role="tab" aria-selected={w.id === cur.id} className={w.id === cur.id ? 'on' : ''} onClick={() => go(`explore/${w.id}`)}>
            {t.worlds[w.id].name}
          </button>
        ))}
      </div>
      <ReligionDetail key={cur.id} id={cur.id} tab={tab as RelTab | undefined} />
    </div>
  )
}
