import { href } from '../core/router'
import { NEW_PLACES, RECOMMENDED, WORLDS, resolvePlace } from '../core/registry'
import { useStore } from '../core/store'
import { useT } from '../i18n'
import { Icon } from './icons'

/** 공간 미리보기 이미지: 실제 3D 공간을 미리 찍어 둔 정적 파일(public/thumbs) */
const thumb = (world: string, place: string) => `/thumbs/${world}_${place}.webp`

function PlaceRow({ keys, title }: { keys: string[]; title: string }) {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const items = keys.map(resolvePlace).filter((x) => x && !x.place.soon)
  if (!items.length) return null
  return (
    <section className="row-sec">
      <h2 className="sec-title">{title}</h2>
      <ul className="place-row">
        {items.map((x) => (
          <li key={x!.world.id + x!.place.id}>
            <a className="place-card" href={href(`w/${x!.world.id}/${x!.place.id}`)} style={{ ['--c' as string]: x!.world.colors[1] }}>
              <img src={thumb(x!.world.id, x!.place.id)} alt="" loading="lazy" decoding="async" width="320" height="200" />
              <span className="place-card-text">
                <small>{t.worlds[x!.world.id].name}</small>
                <strong>{lang === 'en' ? x!.place.en : x!.place.ko}</strong>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function Home() {
  const t = useT()
  const visits = useStore((s) => s.visits)
  const favorites = useStore((s) => s.favorites)
  const nickname = useStore((s) => s.nickname)

  return (
    <>
      <section className="hero">
        <div className="hero-sky" aria-hidden="true">
          <span className="orb o1" /><span className="orb o2" /><span className="orb o3" /><span className="orb o4" />
          <span className="stars" />
        </div>
        <div className="hero-inner">
          <p className="eyebrow">{t.brandLocal}</p>
          <h1 className="wordmark-big">ORUVIA</h1>
          <p className="tagline">{t.tagline}</p>
          <p className="lede">{nickname ? `${nickname} · ` : ''}{t.heroSub}</p>
          <a className="cta" href="#worlds" onClick={(e) => { e.preventDefault(); document.getElementById('worlds')?.scrollIntoView({ behavior: 'smooth' }) }}>
            {t.worldsTitle} <Icon name="compass" size={18} />
          </a>
        </div>
      </section>

      <section id="worlds" aria-labelledby="worlds-h" className="worlds-sec">
        <h2 id="worlds-h" className="sec-title center">{t.worldsTitle}</h2>
        <div className="world-grid">
          {WORLDS.map((w) => (
            <a key={w.id} className="world-card" href={href(`r/${w.id}`)} style={{ ['--a' as string]: w.colors[0], ['--b' as string]: w.colors[1] }}>
              <img className="world-img" src={thumb(w.id, w.places[0].id)} alt="" loading="lazy" decoding="async" width="480" height="640" />
              <span className="world-shade" />
              <span className={`badge badge-${w.status}`}>{t.status[w.status]}</span>
              <span className="world-card-text">
                <span className="world-brand">{w.brand}</span>
                <strong>{t.worlds[w.id].name}</strong>
                <span className="world-place">{t.worlds[w.id].place}</span>
                <span className="world-blurb">{t.worlds[w.id].blurb}</span>
                <span className="enter">{t.enter} →</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {favorites.length > 0 && <PlaceRow keys={favorites} title={t.favorites} />}
      {visits.length > 0 && <PlaceRow keys={visits.slice(0, 8).map((v) => v.id)} title={t.recent} />}
      <PlaceRow keys={RECOMMENDED} title={t.recommended} />
      <PlaceRow keys={NEW_PLACES} title={t.newPlaces} />

      <section className="row-sec">
        <h2 className="sec-title">{t.notices}</h2>
        <ul className="notices">{t.noticeList.map((n) => <li key={n}>{n}</li>)}</ul>
      </section>
      <footer className="foot">
        <p className="foot-brand">ORUVIA · {t.tagline}</p>
        <p className="disclaimer">{t.disclaimer}</p>
      </footer>
    </>
  )
}
