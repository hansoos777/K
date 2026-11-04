import { WORLDS } from '../core/registry'
import { href } from '../core/router'
import { useStore } from '../core/store'
import { useT } from '../i18n'
import { Icon } from './icons'
import { EXT, img, Photo } from './Photo'
import { SpaceRow } from './Spaces'

/** 사이트 사진: 실제 3D 공간을 사람 없이 찍은 이미지 (public/photos) */
export const photo = (world: string, place: string) => `/photos/${world}_${place}.webp`
/** 종교마다 대표로 보여 줄 공간 */
export const COVER: Record<string, string> = { christian: 'traditional', catholic: 'gothic', mandir: 'mandir', temple: 'daeung' }
/** 홈 추천 공간: 종교 대표 사진과 겹치지 않는 곳으로 */
const PICKS: [string, string][] = [['temple', 'courtyard'], ['catholic', 'grotto'], ['christian', 'modern'], ['mandir', 'shrine']]

export default function Home() {
  const t = useT()
  const nickname = useStore((s) => s.nickname)
  return (
    <div className="home">
      {/* 1. 큰 사진 + 메인 문구 (특정 종교를 앞세우지 않는 풍경) */}
      <section className="h-hero">
        <Photo src={img('home_hero')} fallback="/photos/hero_dawn.webp" className="h-hero-bg" w={2400} h={1100} eager />
        <div className="h-hero-text">
          <h1>{t.h.heroTitle[0]}<br />{t.h.heroTitle[1]}</h1>
          <p className="lead">{nickname && <>{nickname} · </>}{t.h.heroSub[0]}<br />{t.h.heroSub[1]}</p>
          <div className="actions">
            <a className="button primary" href={href('explore')}>{t.h.btnLearn}<Icon name="chev" size={16} /></a>
            <a className="button" href={href('spaces')}>{t.h.btnSpaces}<Icon name="chev" size={16} /></a>
          </div>
        </div>
      </section>

      {/* 2. 네 종교 */}
      <section className="h-sec">
        <header className="h-sec-head row-head">
          <div>
            <h2>{t.h.exTitle}</h2>
            <p>{t.h.exSub}</p>
          </div>
          <a className="more" href={href('explore')}>{t.h.all}<Icon name="chev" size={14} /></a>
        </header>
        <ul className="faith-row">
          {WORLDS.map((w) => (
            <li key={w.id}>
              <a className="card" href={href(`explore/${w.id}`)}>
                <span className="fg-img"><Photo src={img(EXT[w.id])} fallback={photo(w.id, COVER[w.id])} w={600} h={400} /></span>
                <span className="card-body">
                  <strong>{t.worlds[w.id].name}</strong>
                  <span className="fg-sub">{t.h.short[w.id]}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. 나의 믿음 찾기 */}
      <section className="h-sec h-band">
        <span className="band-ic" aria-hidden="true"><Icon name="compass" size={28} /></span>
        <div>
          <h2>{t.h.fdTitle}</h2>
          <p>{t.h.fdSub}</p>
        </div>
        <a className="button primary" href={href('me#finder')}>{t.h.fdBtn}<Icon name="chev" size={16} /></a>
      </section>

      {/* 4. 추천 가상 공간 */}
      <section className="h-sec">
        <header className="h-sec-head row-head">
          <div>
            <h2>{t.h.spTitle}</h2>
            <p>{t.h.spSub}</p>
          </div>
          <a className="more" href={href('spaces')}>{t.h.all}<Icon name="chev" size={14} /></a>
        </header>
        <ul className="space-rows two">
          {PICKS.map(([w, p]) => <SpaceRow key={w + p} world={w} place={p} />)}
        </ul>
      </section>

      {/* 5. 조용한 시간 */}
      <section className="h-sec">
        <header className="h-sec-head">
          <h2>{t.h.quietTitle}</h2>
          <p>{t.h.quietSub}</p>
        </header>
        <ul className="tiles quiet-tiles">
          {t.h.quiet.map(([name, sub, to], i) => (
            <li key={name}>
              <a href={href(to)}>
                <Icon name={(['pray', 'lotus', 'book', 'diya'] as const)[i] ?? 'compass'} size={26} />
                <strong>{name}</strong>
                <small>{sub}</small>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="foot">
        <p className="foot-brand">{t.brand} — {t.h.slogan}</p>
        <p className="disclaimer">{t.disclaimer}</p>
      </footer>
    </div>
  )
}
