import { WORLDS } from '../core/registry'
import { go, href } from '../core/router'
import { useStore } from '../core/store'
import { useT } from '../i18n'

/** ③ 가상 공간: 교회·성당·힌두교 사원·불교 사찰을 한 화면에서 고르고 바로 입장 */
export default function Spaces({ id }: { id?: string }) {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const interests = useStore((s) => s.interests)
  const order = [...WORLDS].sort((a, b) => Number(interests.includes(b.id)) - Number(interests.includes(a.id)))
  const cur = WORLDS.find((w) => w.id === id) ?? order[0]
  const name = (p: { ko: string; en: string }) => (lang === 'en' ? p.en : p.ko)
  return (
    <div className="screen">
      <div className="screen-head">
        <h1>{t.sp.title}</h1>
        <p className="hint">{t.sp.sub}</p>
      </div>
      <div className="tabs" role="tablist">
        {order.map((w) => (
          <button key={w.id} role="tab" aria-selected={w.id === cur.id} className={w.id === cur.id ? 'on' : ''} style={{ ['--b' as string]: w.colors[1] }} onClick={() => go(`spaces/${w.id}`)}>
            {t.sp.cat[w.id]}
          </button>
        ))}
      </div>
      <ul className="space-list">
        {cur.places.map((p, i) => (
          <li key={p.id} className={`space-item ${i === 0 ? 'big' : ''} ${p.soon ? 'soon' : ''}`}>
            {p.soon ? (
              <div className="space-item-body">
                <strong>{name(p)}</strong>
                <span className="hint">{t.soon}</span>
              </div>
            ) : (
              <>
                <a className="space-thumb" href={href(`w/${cur.id}/${p.id}`)} aria-label={`${name(p)} · ${t.sp.enter}`}>
                  <img src={`/photos/${cur.id}_${p.id}.webp`} alt="" loading="lazy" width="480" height="300" />
                </a>
                <div className="space-item-body">
                  <small className="k">{t.worlds[cur.id].name} · {t.sp.cat[cur.id]}</small>
                  <strong>{name(p)}</strong>
                  {p.desc && <span>{lang === 'en' ? p.desc.en : p.desc.ko}</span>}
                  <div className="row">
                    <a className="btn btn-primary" href={href(`w/${cur.id}/${p.id}`)}>{t.sp.enter}</a>
                    <a className="btn" href={href(`w/${cur.id}/${p.id}/tour`)}>{t.sp.enterTour}</a>
                  </div>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
