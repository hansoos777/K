import { useEffect, useState } from 'react'
import { resolvePlace, WORLDS } from '../core/registry'
import { go, href } from '../core/router'
import { useStore } from '../core/store'
import { useT } from '../i18n'
import { Icon } from './icons'

/** 사이트 사진: 실제 3D 공간을 사람 없이 찍은 이미지 (public/photos) */
export const photo = (world: string, place: string) => `/photos/${world}_${place}.webp`
/** 종교마다 대표로 보여 줄 공간 */
export const COVER: Record<string, string> = { christian: 'traditional', catholic: 'gothic', mandir: 'mandir', temple: 'daeung' }

/**
 * 5차 홈: 경험 먼저 (Experience First)
 * 1. 큰 3D 공간 사진 + 한 문장 + 버튼 하나 — 네 종교 공간이 돌아가며 나옴(한 종교가 대표처럼 보이지 않게)
 * 2. 어디를 둘러볼까요? (종교별 공간 카드)  3. 다시 둘러보기(방문 기록이 있을 때)
 * 4. 직접 경험해 보세요.  5. 이야기가 궁금해졌다면 (질문형 짧은 글)  6. 나에게 맞는 공간 찾기
 * 교육 과정 카드는 홈에 두지 않는다(알아보기 안에 그대로 있음).
 */
const HERO: [string, string][] = [['catholic', 'gothic'], ['temple', 'daeung'], ['mandir', 'mandir'], ['christian', 'traditional']]
/** "어디를 둘러볼까요?" 카드: 첫 화면 사진과 겹치지 않는 공간 */
const WHERE: Record<string, string> = { christian: 'modern', catholic: 'parish', temple: 'courtyard', mandir: 'shrine' }
const TINT: Record<string, string> = { christian: '#EEF1F6', catholic: '#F4ECE6', temple: '#EEF2EA', mandir: '#F7ECE2' }

export default function Home() {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const reduce = useStore((s) => s.reduceMotion)
  const visits = useStore((s) => s.visits)
  // 오늘 날짜로 시작 공간을 정하고, 6초마다 다음 공간으로
  const [cur, setCur] = useState(() => Math.floor(Date.now() / 86400000) % HERO.length)
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setCur((c) => (c + 1) % HERO.length), 6000)
    return () => clearInterval(id)
  }, [reduce])
  const pname = (w: string, p: string) => {
    const x = WORLDS.find((v) => v.id === w)?.places.find((v) => v.id === p)
    return x ? (lang === 'en' ? x.en : x.ko) : p
  }
  const recent = visits.map((v) => resolvePlace(v.id)).filter((x) => x && !x.place.soon).slice(0, 3)
  const [hw, hp] = HERO[cur]

  return (
    <div className="home5">
      {/* 1. 첫 화면 */}
      <section className="hero5">
        <a className="hero5-img" href={href(`w/${hw}/${hp}`)} aria-label={`${pname(hw, hp)} · ${t.x.enterThis}`}>
          {HERO.map(([w, p], i) => (
            <img key={w} src={photo(w, p)} alt="" className={i === cur ? 'on' : ''} width="1200" height="800" fetchPriority={i === cur ? 'high' : 'low'} />
          ))}
          <span className="hero5-tag">{t.worlds[hw as keyof typeof t.worlds].name} · {pname(hw, hp)}<Icon name="chev" size={14} /></span>
          <span className="hero5-dots" role="tablist">
            {HERO.map(([w], i) => (
              <button key={w} role="tab" aria-selected={i === cur} aria-label={t.worlds[w as keyof typeof t.worlds].name} className={i === cur ? 'on' : ''} onClick={(e) => { e.preventDefault(); setCur(i) }} />
            ))}
          </span>
        </a>
        <div className="hero5-panel">
          <h1>{t.x.heroTitle}</h1>
          <p>{t.x.heroSub}</p>
          <a className="btn5" href={href('spaces')}>{t.x.heroBtn} <span aria-hidden="true">→</span></a>
        </div>
      </section>

      {/* 2. 어디를 둘러볼까요? */}
      <section className="sec5">
        <h2>{t.x.whereTitle}</h2>
        <ul className="where5">
          {WORLDS.map((w) => (
            <li key={w.id}>
              <a href={href(`spaces/${w.id}`)}>
                <span className="where5-img"><img src={photo(w.id, WHERE[w.id])} alt="" loading="lazy" width="600" height="400" /></span>
                <strong>{t.worlds[w.id].name}</strong>
                <small>{t.x.where[w.id as keyof typeof t.x.where]}</small>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. 다시 둘러보기 */}
      {recent.length > 0 && (
        <section className="sec5">
          <h2>{t.x.againTitle}</h2>
          <ul className="again5">
            {recent.map((x) => (
              <li key={x!.world.id + x!.place.id}>
                <a href={href(`w/${x!.world.id}/${x!.place.id}`)}>
                  <img src={photo(x!.world.id, x!.place.id)} alt="" loading="lazy" width="160" height="110" />
                  <span><strong>{lang === 'en' ? x!.place.en : x!.place.ko}</strong><small>{t.worlds[x!.world.id].name}</small></span>
                  <Icon name="chev" size={16} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* 4. 직접 경험해 보세요. */}
      <section className="sec5">
        <h2>{t.x.tryTitle}</h2>
        <ul className="try5">
          {t.x.tries.map(([w, p, label]) => (
            <li key={label}>
              <a href={href(`w/${w}/${p}`)}>
                <img src={photo(w, p)} alt="" loading="lazy" width="600" height="400" />
                <span className="try5-t"><small>{t.worlds[w as keyof typeof t.worlds].name}</small><strong>{label}</strong></span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 5. 이야기가 궁금해졌다면 */}
      <section className="sec5">
        <h2>{t.x.storyTitle}</h2>
        <ul className="story5">
          {t.x.stories.map(([w, q, a, to]) => (
            <li key={q} style={{ background: TINT[w] }}>
              <a href={href(to)}>
                <small>{t.worlds[w as keyof typeof t.worlds].name}</small>
                <strong>{q}</strong>
                <span>{a}</span>
                <em>{t.x.storyMore} →</em>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 6. 나에게 맞는 공간 찾기 */}
      <section className="sec5 find5">
        <h2>{t.x.findTitle}</h2>
        <div className="find5-chips">
          {t.x.finds.map(([label, to]) => <button key={label} onClick={() => go(to)}>{label}</button>)}
        </div>
        <a className="find5-mbti" href={href('me#finder')}>{t.x.findMbti} →</a>
      </section>

      <footer className="foot5">
        <b>{t.brand}{lang === 'ko' ? ' · RuBelieve' : ''}</b>
        <span>{t.disclaimer}</span>
      </footer>
    </div>
  )
}
