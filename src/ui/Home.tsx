import { BRAND } from '../brand'
import { WORLDS } from '../core/registry'
import { href } from '../core/router'
import { useStore } from '../core/store'
import { useT } from '../i18n'

/** 사이트 사진: 실제 3D 공간을 사람 없이 찍은 이미지 (public/photos) */
export const photo = (world: string, place: string) => `/photos/${world}_${place}.webp`
/** 종교마다 대표로 보여 줄 공간 */
export const COVER: Record<string, string> = { christian: 'traditional', catholic: 'gothic', mandir: 'mandir', temple: 'daeung' }
/** 종교 탐색 카드는 가상 공간 카드와 다른 사진으로 */
const FAITH: Record<string, string> = { christian: 'prayer', catholic: 'parish', mandir: 'shrine', temple: 'courtyard' }

export default function Home() {
  const t = useT()
  const nickname = useStore((s) => s.nickname)
  return (
    <div className="home">
      {/* B. 메인 비주얼: 글은 위, 사진은 아래 (겹치지 않게) */}
      <section className="h-hero">
        <div className="h-hero-text">
          <h1>{t.h.heroTitle[0]}<br />{t.h.heroTitle[1]}</h1>
          <p className="lead">{nickname && <>{nickname} · </>}{t.h.heroSub[0]}<br />{t.h.heroSub[1]}</p>
          <div className="actions">
            <a className="button primary" href={href('explore')}>{t.h.btnLearn}</a>
            <a className="button" href={href('spaces')}>{t.h.btnSpaces}</a>
          </div>
        </div>
        <figure className="h-hero-img">
          <img src={photo('catholic', 'parish')} alt="" width="1200" height="800" fetchPriority="high" />
        </figure>
      </section>

      {/* C. 종교 탐색 */}
      <section className="h-sec">
        <header className="h-sec-head">
          <h2>{t.h.exTitle}</h2>
          <p>{t.h.exSub}</p>
        </header>
        <div className="grid4">
          {WORLDS.map((w) => (
            <a key={w.id} className="tile" href={href(`explore/${w.id}`)}>
              <span className="tile-img"><img src={photo(w.id, FAITH[w.id])} alt="" loading="lazy" width="600" height="400" /></span>
              <strong>{t.worlds[w.id].name}</strong>
              <span>{t.h.short[w.id]}</span>
            </a>
          ))}
        </div>
      </section>

      {/* D. 가상 공간 */}
      <section className="h-sec">
        <header className="h-sec-head">
          <h2>{t.h.spTitle}</h2>
          <p>{t.h.spSub}</p>
        </header>
        <div className="grid4">
          {WORLDS.map((w) => (
            <div key={w.id} className="tile">
              <a className="tile-img" href={href(`spaces/${w.id}`)}><img src={photo(w.id, COVER[w.id])} alt="" loading="lazy" width="600" height="400" /></a>
              <strong>{t.sp.cat[w.id]}</strong>
              <a className="text-link" href={href(`w/${w.id}/${w.places[0].id}`)}>{t.sp.enter} →</a>
            </div>
          ))}
        </div>
      </section>

      {/* E. 나의 믿음 찾기 */}
      <section className="h-sec h-band">
        <div>
          <h2>{t.h.fdTitle}</h2>
          <p>{t.h.fdSub}</p>
        </div>
        <a className="button primary" href={href('me#finder')}>{t.h.fdBtn}</a>
      </section>

      {/* F. 나만의 조용한 시간 */}
      <section className="h-sec">
        <header className="h-sec-head">
          <h2>{t.h.quietTitle}</h2>
          <p>{t.h.quietSub}</p>
        </header>
        <ul className="quiet">
          {t.h.quiet.map(([name, sub, to]) => (
            <li key={name}>
              <a href={href(to)}>
                <strong>{name}</strong>
                <span>{sub}</span>
                <span className="arrow" aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="foot">
        <p className="foot-brand">{BRAND.name} — {t.h.slogan}</p>
        <p className="disclaimer">{t.disclaimer}</p>
      </footer>
    </div>
  )
}
