import { useEffect, useState } from 'react'
import { worldById, WORLDS } from '../core/registry'
import { go, href } from '../core/router'
import { useStore } from '../core/store'
import { useT } from '../i18n'
import type { Learn } from '../learn/types'
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
      <span className="sr-img">
        <img src={`/photos/${w.id}_${p.id}.webp`} alt="" loading="lazy" width="320" height="220" />
      </span>
      <span className="sr-body">
        <strong>{name}</strong>
        <small>{t.worlds[w.id].name} · {t.sp.cat[w.id]}</small>
        {p.desc && <span>{lang === 'en' ? p.desc.en : p.desc.ko}</span>}
        <small className="sr-min">{t.sx.minutes(MINUTES[`${w.id}/${p.id}`] ?? 5)}</small>
      </span>
      <a className="pill" href={href(`w/${w.id}/${p.id}`)}>{t.sp.enter}<Icon name="chev" size={14} /></a>
    </li>
  )
}

/** 실제 둘러볼 거리(안내 지점·할 수 있는 일) 기준의 대략적인 체험 시간(분) */
export const MINUTES: Record<string, number> = {
  'christian/traditional': 6, 'christian/modern': 5, 'christian/prayer': 3,
  'catholic/gothic': 8, 'catholic/parish': 6, 'catholic/grotto': 4, 'catholic/confessional': 3,
  'temple/daeung': 7, 'temple/courtyard': 6, 'temple/meditation': 5,
  'mandir/mandir': 10, 'mandir/shrine': 10,
}

/** 공간 소개(입장 전): 사진 · 이름 · 종교 · 짧은 소개 · 예상 시간 · 해 볼 수 있는 것 · 이 공간 이야기 · 입장 */
function SpaceDetail({ world, place }: { world: string; place: string }) {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const w = worldById(world)
  const p = w?.places.find((x) => x.id === place)
  const [L, setL] = useState<Learn | null>(null)
  useEffect(() => {
    if (!w) return
    let alive = true
    w.learn().then((m) => alive && setL(lang === 'en' ? m.default.en : m.default.ko))
    return () => { alive = false }
  }, [w, lang])
  if (!w || !p || p.soon) return <div className="screen"><p className="hint">{t.soon}</p></div>
  const name = lang === 'en' ? p.en : p.ko
  const acts = L ? [...L.activities.filter((a) => a.place === place).map((a) => a.name), ...L.practice.filter((x) => x.place === place).map((x) => x.label)] : []
  const uniq = [...new Set(acts)]
  const stories = L?.discover?.filter((d) => d.place === place) ?? []
  const others = w.places.filter((x) => x.id !== place && !x.soon)
  return (
    <div className="screen screen-cover">
      <a className="back-link" href={href(`spaces/${world}`)}><Icon name="back" size={18} />{t.nav.spaces}</a>
      <section className="sd-cover">
        <img src={`/photos/${world}_${place}.webp`} alt="" width="1200" height="800" />
      </section>
      <div className="sd-body">
        <span className="sd-k">{t.worlds[w.id].name} · {t.sp.cat[w.id]} · {t.sx.minutes(MINUTES[`${world}/${place}`] ?? 5)}</span>
        <h1>{name}</h1>
        {p.desc && <p className="sd-desc">{lang === 'en' ? p.desc.en : p.desc.ko}</p>}
        <div className="row sd-actions">
          <a className="btn5" href={href(`w/${world}/${place}`)}>{t.sx.enter} <span aria-hidden="true">→</span></a>
          <a className="button" href={href(`w/${world}/${place}/tour`)}>{t.sp.enterTour}</a>
        </div>
        {uniq.length > 0 && (
          <section className="sd-sec">
            <h2>{t.sx.canDo}</h2>
            <ul className="sd-chips">{uniq.map((x) => <li key={x}>{x}</li>)}</ul>
          </section>
        )}
        {stories.length > 0 && (
          <section className="sd-sec">
            <h2>{t.sx.stories}</h2>
            <ul className="disc">{stories.map((d) => <li key={d.q}><strong>{d.q}</strong><p>{d.a}</p><span className="disc-links"><a className="text-link" href={href(`explore/${world}/learn`)}>{t.r.readMore} →</a></span></li>)}</ul>
          </section>
        )}
        {others.length > 0 && (
          <section className="sd-sec">
            <h2>{t.sx.others(t.sp.cat[w.id])}</h2>
            <ul className="space-rows">{others.map((x) => <SpaceRow key={x.id} world={world} place={x.id} />)}</ul>
          </section>
        )}
      </div>
    </div>
  )
}

/** ③ 탐험: 큰 사진 아래 모든 공간을 한 줄씩. 종교 탭은 거르기. #/spaces/<종교>/<공간>은 입장 전 소개 */
export default function Spaces({ id, place }: { id?: string; place?: string }) {
  // 목록과 소개 화면은 훅 순서가 달라서 서로 다른 컴포넌트로 나눠 그린다(같은 컴포넌트에서 바뀌면 빈 화면이 됨)
  if (id && place) return <SpaceDetail key={`${id}/${place}`} world={id} place={place} />
  return <SpaceList id={id} />
}

function SpaceList({ id }: { id?: string }) {
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
