import { WORLDS } from '../core/registry'
import { go, href } from '../core/router'
import { useT } from '../i18n'
import { COVER, photo } from './Home'
import ReligionDetail, { type RelTab } from './ReligionDetail'

/**
 * ② 종교 탐색
 * - #/explore          네 종교를 사진과 함께 한눈에
 * - #/explore/<id>     종교 상세 (안쪽 탭: 신앙 활동 · 3D 공간 · 배우기 · 예절과 주의)
 * - #/explore/<id>/<tab>
 */
export default function Explore({ id, tab }: { id?: string; tab?: string }) {
  const t = useT()
  const cur = WORLDS.find((w) => w.id === id)
  if (!cur) {
    return (
      <div className="screen">
        <div className="screen-head">
          <h1>{t.ex.title}</h1>
          <p className="hint">{t.ex.sub}</p>
        </div>
        <ul className="faith-grid">
          {WORLDS.map((w) => (
            <li key={w.id}>
              <a href={href(`explore/${w.id}`)}>
                <span className="fg-img"><img src={photo(w.id, COVER[w.id])} alt="" loading="lazy" width="800" height="560" /></span>
                <strong>{t.worlds[w.id].name}</strong>
                <span className="fg-sub">{t.h.short[w.id]}</span>
                <span className="text-link">{t.ex.more} →</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  return (
    <div className="screen">
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={false} onClick={() => go('explore')}>{t.r.allFaiths}</button>
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
