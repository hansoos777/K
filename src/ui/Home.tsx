import { useEffect, useState } from 'react'
import { WORLDS } from '../core/registry'
import { href } from '../core/router'
import { useStore } from '../core/store'
import type { Lesson } from '../learn/types'
import { useT } from '../i18n'
import { Icon, type IconName } from './icons'
import { EXT, img, Photo } from './Photo'

/** 사이트 사진: 실제 3D 공간을 사람 없이 찍은 이미지 (public/photos) */
export const photo = (world: string, place: string) => `/photos/${world}_${place}.webp`
/** 종교마다 대표로 보여 줄 공간 */
export const COVER: Record<string, string> = { christian: 'traditional', catholic: 'gothic', mandir: 'mandir', temple: 'daeung' }
/** 맨 위 "빛의 문" 네 개: 아래 종교 카드와 사진이 겹치지 않게 다른 공간으로 */
const PORTALS: [string, string, string][] = [['christian', 'modern', 'church'], ['catholic', 'parish', 'cathedral'], ['temple', 'courtyard', 'temple'], ['mandir', 'shrine', 'mandir']]
/** 추천 공간: 위 두 줄과 겹치지 않는 곳 */
const PICKS: [string, string][] = [['temple', 'meditation'], ['catholic', 'grotto'], ['christian', 'prayer']]
const QUIET_IC: [IconName, string][] = [['pray', 'lav'], ['breath', 'sky'], ['note', 'gold'], ['diya', 'peach']]

/** 오늘의 한 걸음: 공통 입문 과정에서 아직 안 읽은 강의 */
function Today() {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const learned = useStore((s) => s.learned)
  const [lessons, setLessons] = useState<Lesson[]>([])
  useEffect(() => {
    let alive = true
    import('../learn/common').then((m) => alive && setLessons(lang === 'en' && m.default.en.lessons.length ? m.default.en.lessons : m.default.ko.lessons))
    return () => { alive = false }
  }, [lang])
  if (!lessons.length) return null
  const done = lessons.filter((l) => learned.includes(`common/${l.id}`)).length
  const next = lessons.find((l) => !learned.includes(`common/${l.id}`))
  return (
    <a className="today4" href={href(next ? 'explore/intro' : 'explore')}>
      <span className="today4-ic"><Icon name="book" size={22} /></span>
      <span className="today4-t">
        <small>{t.h.todayK} · {t.r.commonTitle}</small>
        <strong>{next ? next.title : t.h.todayDone}</strong>
        <span className="bar4"><i style={{ width: `${(done / lessons.length) * 100}%` }} /></span>
      </span>
      <span className="btn4 primary sm">{t.h.todayGo}</span>
    </a>
  )
}

export default function Home() {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const nickname = useStore((s) => s.nickname)
  const place = (w: string, p: string) => {
    const x = WORLDS.find((v) => v.id === w)?.places.find((v) => v.id === p)
    return x ? { name: lang === 'en' ? x.en : x.ko, desc: x.desc ? (lang === 'en' ? x.desc.en : x.desc.ko) : '' } : { name: p, desc: '' }
  }
  return (
    <div className="home4">
      {/* 1. 히어로: 네 종교의 3D 공간이 아치형 "빛의 문" 안에 */}
      <section className="hero4">
        <div className="hero4-stars" aria-hidden="true"><i style={{ left: '8%', top: '18%' }} /><i style={{ left: '46%', top: '12%' }} /><i style={{ left: '62%', top: '30%' }} /><i style={{ left: '88%', top: '16%' }} /><i style={{ left: '30%', top: '72%' }} /></div>
        <div className="hero4-in">
          <div className="hero4-copy">
            <span className="eyebrow4">{t.h.eyebrow}</span>
            <h1>{t.h.heroTitle[0]}<br />{t.h.heroTitle[1]}</h1>
            <p className="lead4">{nickname && <>{nickname} · </>}{t.h.heroSub[0]}{' '}<br />{t.h.heroSub[1]}</p>
            <div className="actions4">
              <a className="btn4 primary" href={href('explore')}>{t.h.btnLearn}<Icon name="chev" size={16} /></a>
              <a className="btn4" href={href('spaces')}>{t.h.btnSpaces}</a>
            </div>
          </div>
          <div className="portals4" aria-hidden="true">
            <div className="portals4-glow" />
            {PORTALS.map(([w, p], i) => (
              <a key={w} className={`portal4 p${i + 1}`} href={href(`w/${w}/${p}`)} tabIndex={-1}>
                <img src={photo(w, p)} alt="" width="320" height="480" />
                <span>{t.sp.cat[w as keyof typeof t.sp.cat]}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <Today />

      {/* 2. 네 종교 */}
      <section className="sec4">
        <header className="sec4-h">
          <div><h2>{t.h.exTitle}</h2><p>{t.h.exSub}</p></div>
          <a className="more4" href={href('explore')}>{t.h.all}<Icon name="chev" size={14} /></a>
        </header>
        <ul className="faiths4">
          {WORLDS.map((w) => (
            <li key={w.id}>
              <a className="faith4" href={href(`explore/${w.id}`)}>
                <span className="arch4"><Photo src={img(EXT[w.id])} fallback={photo(w.id, COVER[w.id])} w={600} h={690} /></span>
                <strong>{t.worlds[w.id].name}</strong>
                <span className="faith4-sub">{t.h.short[w.id]}</span>
                <span className="chips4"><span className="chip4">{t.h.chipLearn}</span><span className="chip4 sky">{t.h.chip3d(w.places.filter((p) => !p.soon).length)}</span></span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* 3. 나에게 맞는 공간 찾기 */}
      <section className="sec4 band4">
        <div>
          <h2>{t.h.fdTitle}</h2>
          <p>{t.h.fdSub}</p>
          <div className="band4-qs">{t.h.fdChips.map((c) => <span key={c}>{c}</span>)}</div>
        </div>
        <a className="btn4 primary" href={href('me#finder')}>{t.h.fdBtn}<Icon name="chev" size={16} /></a>
      </section>

      {/* 4. 직접 걸어 보는 공간 */}
      <section className="sec4">
        <header className="sec4-h">
          <div><h2>{t.h.spTitle}</h2><p>{t.h.spSub}</p></div>
          <a className="more4" href={href('spaces')}>{t.h.all}<Icon name="chev" size={14} /></a>
        </header>
        <ul className="spaces4">
          {PICKS.map(([w, p]) => {
            const x = place(w, p)
            return (
              <li key={w + p}>
                <a className="space4" href={href(`w/${w}/${p}`)}>
                  <span className="space4-img"><img src={photo(w, p)} alt="" loading="lazy" width="600" height="375" /><span className="chip4 on-img">{t.worlds[w as keyof typeof t.worlds].name} · {x.name}</span></span>
                  <span className="space4-b">
                    <span><strong>{x.name}</strong><small>{x.desc}</small></span>
                    <span className="go4"><Icon name="chev" size={18} /></span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </section>

      {/* 5. 나만의 조용한 시간 */}
      <section className="sec4">
        <header className="sec4-h"><div><h2>{t.h.quietTitle}</h2><p>{t.h.quietSub}</p></div></header>
        <ul className="quiet4">
          {t.h.quiet.map(([name, sub, to], i) => (
            <li key={name}>
              <a href={href(to)}>
                <span className={`ic4 ${QUIET_IC[i]?.[1] ?? 'lav'}`}><Icon name={QUIET_IC[i]?.[0] ?? 'compass'} size={22} /></span>
                <strong>{name}</strong>
                <small>{sub}</small>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <footer className="foot4">
        <b>{t.brand}{lang === 'ko' ? ' · RuBelieve' : ''}</b>
        <span>{t.disclaimer}</span>
      </footer>
    </div>
  )
}
