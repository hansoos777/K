import { worldById, WORLDS } from '../core/registry'
import { go, href } from '../core/router'
import { useStore } from '../core/store'
import { useT } from '../i18n'
import { Icon } from './icons'
import { img, Photo } from './Photo'

/** 공간 한 줄: 사진 · 이름 · 종교와 공간 종류 · 소개 · 입장하기 */
export function SpaceRow({ world, place }: { world: string; place: string }) {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const w = worldById(world)
  const p = w?.places.find((x) => x.id === place)
  if (!w || !p) return null
  const name = lang === 'en' ? p.en : p.ko
  if (p.soon) {
    return (
      <li className="space-row soon">
        <span className="sr-img soon-art"><Icon name="compass" size={26} /></span>
        <span className="sr-body"><strong>{name}</strong><small>{t.worlds[w.id].name} · {t.soon}</small></span>
      </li>
    )
  }
  return (
    <li className="space-row">
      <a className="sr-img" href={href(`w/${w.id}/${p.id}`)} aria-label={`${name} · ${t.sp.enter}`}>
        <img src={`/photos/${w.id}_${p.id}.webp`} alt="" loading="lazy" width="320" height="220" />
      </a>
      <span className="sr-body">
        <strong>{name}</strong>
        <small>{t.worlds[w.id].name} · {t.sp.cat[w.id]}</small>
        {p.desc && <span>{lang === 'en' ? p.desc.en : p.desc.ko}</span>}
        <a className="sr-tour" href={href(`w/${w.id}/${p.id}/tour`)}>{t.sp.enterTour}</a>
      </span>
      <a className="pill" href={href(`w/${w.id}/${p.id}`)}>{t.sp.enter}<Icon name="chev" size={14} /></a>
    </li>
  )
}

/** ③ 가상 공간: 큰 사진 아래 모든 공간을 한 줄씩. 종교 탭은 거르기 */
export default function Spaces({ id }: { id?: string }) {
  const t = useT()
  const interests = useStore((s) => s.interests)
  const order = [...WORLDS].sort((a, b) => Number(interests.includes(b.id)) - Number(interests.includes(a.id)))
  const cur = WORLDS.find((w) => w.id === id)
  const list = (cur ? [cur] : order).flatMap((w) => w.places.map((p) => [w.id, p.id] as const))
  // 열린 공간 먼저, 준비 중은 뒤로
  list.sort((a, b) => Number(!!worldById(a[0])?.places.find((p) => p.id === a[1])?.soon) - Number(!!worldById(b[0])?.places.find((p) => p.id === b[1])?.soon))
  return (
    <div className="screen screen-cover">
      <section className="cover">
        <Photo src={img('spaces_hero')} fallback="/photos/catholic_parish.webp" className="cover-img" w={1600} h={700} eager />
        <div className="cover-in">
          <h1>{t.h.spTitle}</h1>
          <p>{t.h.spSub}</p>
        </div>
      </section>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={!cur} className={!cur ? 'on' : ''} onClick={() => go('spaces')}>{t.r.allFaiths}</button>
        {order.map((w) => (
          <button key={w.id} role="tab" aria-selected={w.id === cur?.id} className={w.id === cur?.id ? 'on' : ''} onClick={() => go(`spaces/${w.id}`)}>
            {t.sp.cat[w.id]}
          </button>
        ))}
      </div>
      <ul className="space-rows">
        {list.map(([w, p]) => <SpaceRow key={w + p} world={w} place={p} />)}
      </ul>
    </div>
  )
}
