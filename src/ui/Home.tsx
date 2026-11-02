import { href } from '../core/router'
import { NEW_PLACES, RECOMMENDED, WORLDS, resolvePlace } from '../core/registry'
import { useStore } from '../core/store'
import { useT } from '../i18n'
import { CardArt } from './CardArt'

function PlaceChips({ keys }: { keys: string[] }) {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const items = keys.map(resolvePlace).filter((x) => x && !x.place.soon)
  if (!items.length) return null
  return (
    <ul className="chips">
      {items.map((x) => (
        <li key={x!.world.id + x!.place.id}>
          <a className="chip" href={href(`w/${x!.world.id}/${x!.place.id}`)} style={{ ['--c' as string]: x!.world.colors[1] }}>
            <small>{t.worlds[x!.world.id].name}</small>
            {lang === 'en' ? x!.place.en : x!.place.ko}
          </a>
        </li>
      ))}
    </ul>
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
        <p className="eyebrow">{t.brandLocal}</p>
        <h1>{t.tagline}</h1>
        <p className="lede">{nickname ? `${nickname} · ` : ''}{t.heroSub}</p>
      </section>

      <section aria-labelledby="worlds-h">
        <h2 id="worlds-h" className="sec-title">{t.worldsTitle}</h2>
        <div className="world-grid">
          {WORLDS.map((w) => (
            <a
              key={w.id}
              className="world-card"
              href={href(`w/${w.id}`)}
              style={{ ['--a' as string]: w.colors[0], ['--b' as string]: w.colors[1] }}
            >
              <CardArt id={w.id} />
              <div className="world-card-text">
                <span className="world-brand">{w.brand}</span>
                <strong>{t.worlds[w.id].name}</strong>
                <span className="world-place">{t.worlds[w.id].place}</span>
                <span className="world-blurb">{t.worlds[w.id].blurb}</span>
              </div>
              <span className={`badge badge-${w.status}`}>{t.status[w.status]}</span>
            </a>
          ))}
        </div>
      </section>

      {favorites.length > 0 && (
        <section>
          <h2 className="sec-title">{t.favorites}</h2>
          <PlaceChips keys={favorites} />
        </section>
      )}
      {visits.length > 0 && (
        <section>
          <h2 className="sec-title">{t.recent}</h2>
          <PlaceChips keys={visits.slice(0, 6).map((v) => v.id)} />
        </section>
      )}
      <section>
        <h2 className="sec-title">{t.recommended}</h2>
        <PlaceChips keys={RECOMMENDED} />
      </section>
      <section>
        <h2 className="sec-title">{t.newPlaces}</h2>
        <PlaceChips keys={NEW_PLACES} />
      </section>
      <section>
        <h2 className="sec-title">{t.notices}</h2>
        <ul className="notices">
          {t.noticeList.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </section>
      <p className="disclaimer">{t.disclaimer}</p>
    </>
  )
}
