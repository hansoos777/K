import { BRAND } from '../brand'
import { useT } from '../i18n'

// 앞으로 열릴 공간 안내. 사용자가 늘면 실제 기능으로 바꿈.
export function Upcoming() {
  const t = useT()
  return (
    <div className="screen">
      <header className="head">
        <p className="brand">{BRAND}</p>
        <h1>{t.soonTitle}</h1>
      </header>
      <section className="promise">
        <h2>{t.soonLead}</h2>
        <p>{t.soonBody}</p>
      </section>
      <div className="list">
        {t.soonItems.map((x) => (
          <div key={x.t} className="row">
            <span><strong>{x.t}</strong><small>{x.b}</small></span>
            <em>{t.soonTag}</em>
          </div>
        ))}
      </div>
    </div>
  )
}
