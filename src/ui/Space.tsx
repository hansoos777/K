import { useEffect, useRef, useState, type ReactNode } from 'react'
import { stopAll } from '../core/audio'
import { worldById, type WorldId } from '../core/registry'
import { go, href } from '../core/router'
import { effectiveQuality, getState, recordVisit, toggleFavorite, update, useStore } from '../core/store'
import type { Builder, Stage } from '../engine/stage'
import { useT } from '../i18n'
import { Icon, type IconName } from './icons'
import { Joystick } from './Joystick'

/**
 * 몰입형 공간 화면: 전체 화면 3D 위에 유리 질감의 조작부를 띄운다.
 * 모바일: 왼쪽 아래 조이스틱 + 바닥 탭 이동, 오른쪽 인사·예절 동작, 아래 종교 활동 버튼.
 * PC: WASD·방향키 이동, 마우스 드래그 시점, 휠 확대.
 */
export type SceneApi = Record<string, () => void>
export type StageLike = Pick<Stage, 'setPose' | 'walkTo'>

export interface Action {
  id: string
  label: string
  icon: IconName
  /** 누르면 바로 실행. 문자열을 돌려주면 잠깐 안내로 보여 줌 */
  run?: (api: SceneApi, stage: StageLike) => string | void
  /** 누르면 아래에서 올라오는 안내·체험 창 */
  panel?: ReactNode
}

/** 인사·예절 동작 (종교마다 이름과 동작이 다름) */
export interface Gesture { id: string; label: string; pose: 'pray' | 'bow' | 'sit' | 'sweep'; note?: string }

/** 가까이 가면 뜨는 안내 */
export interface SpotInfo { label: string; text?: string; action?: string }

export interface TourStep {
  title: string
  text: string
  /** 이 안내 지점까지 걸어가면 다음 단계로 */
  spot?: string
  /** 이 활동 버튼을 누르면 다음 단계로 */
  action?: string
}

export interface PlaceScene {
  build: Builder
  intro: string
  actions: Action[]
  gestures?: Gesture[]
  spots?: Record<string, SpotInfo>
  tour?: TourStep[]
}

export function Space({ id, place, scene, tourMode }: { id: WorldId; place?: string; scene: (placeId: string) => PlaceScene; tourMode?: boolean }) {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const favorites = useStore((s) => s.favorites)
  const sound = useStore((s) => s.sound)
  const def = worldById(id)!
  const open = def.places.filter((p) => !p.soon)
  const current = open.find((p) => p.id === place) ?? open[0]
  const key = `${id}/${current.id}`
  const fav = favorites.includes(key)
  const sc = scene(current.id)
  const host = useRef<HTMLDivElement>(null)
  const api = useRef<SceneApi>({})
  const stageRef = useRef<Stage | null>(null)
  const [sheet, setSheet] = useState<string | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'nogl'>('loading')
  const [hint, setHint] = useState(true)
  const [toast, setToast] = useState<string | null>(null)
  const [spot, setSpot] = useState<string | null>(null)
  const [step, setStep] = useState<number | null>(null)
  const [sweeping, setSweeping] = useState(false)
  const [seat, setSeat] = useState<'near' | 'seated' | null>(null)
  // 발견형 안내: 안내 지점을 3곳 이상 둘러본 뒤 한 번만 "이야기가 궁금하신가요?"
  const seenSpots = useRef(new Set<string>())
  const [ask, setAsk] = useState(false)
  const [end, setEnd] = useState(false)
  const enteredAt = useRef(Date.now())
  const [seatPray, setSeatPray] = useState(false)
  const say = useRef((m: string) => setToast(m))
  const coarse = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches
  const name = (p: { ko: string; en: string }) => (lang === 'en' ? p.en : p.ko)
  const tour = sc.tour ?? []

  useEffect(() => {
    if (!toast) return
    const h = setTimeout(() => setToast(null), 2800)
    return () => clearTimeout(h)
  }, [toast])

  useEffect(() => {
    if (place && place !== current.id) go(`w/${id}/${current.id}`)
  }, [place, current.id, id])

  useEffect(() => {
    recordVisit(key)
    setSheet(null)
    setHint(true)
    setSpot(null)
    setSweeping(false)
    setState('loading')
    let alive = true
    const raf = requestAnimationFrame(async () => {
      try {
        const { Stage } = await import('../engine/stage')
        if (!alive || !host.current) return
        const high = effectiveQuality(getState()) === 'high'
        const s = new Stage(host.current, (ctx) => {
          const layout = sc.build(ctx)
          api.current = (layout as { api?: SceneApi }).api ?? {}
          return layout
        }, { high, onTap: () => setHint(false), onSay: (m) => say.current(m), onSpot: (sid) => setSpot(sid), onSeat: (s) => { setSeat(s); if (s !== 'seated') setSeatPray(false) } })
        stageRef.current = s
        if (location.search.includes('debug')) (window as unknown as { __stage: unknown }).__stage = s
        setState('ready')
        // 처음 오는 사람에게는 튜토리얼을 권함(강제 아님), 주소에 /tour가 있으면 바로 시작
        if (tour.length && (tourMode || !getState().tutorials.includes(key))) setStep(tourMode ? 0 : -1)
        if (tourMode) history.replaceState(null, '', location.pathname + location.search + `#/w/${id}/${current.id}`)
      } catch (e) {
        console.warn('3D unavailable', e)
        if (alive) setState('nogl')
      }
    })
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      stageRef.current?.dispose()
      stageRef.current = null
      stopAll()
      setStep(null)
    }
    // 장소가 바뀔 때만 다시 짓는다
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  // 튜토리얼: 가야 할 곳에 빛 기둥, 도착하면 다음 단계
  const cur = step != null && step >= 0 ? tour[step] : null
  useEffect(() => {
    stageRef.current?.showBeacon(cur?.spot ?? null)
  }, [cur])
  useEffect(() => {
    if (cur?.spot && spot === cur.spot) next()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spot])

  const next = () => {
    setStep((n) => {
      if (n == null) return n
      if (n + 1 >= tour.length) {
        update((s) => ({ tutorials: s.tutorials.includes(key) ? s.tutorials : [...s.tutorials, key] }))
        say.current(t.tourDone)
        return null
      }
      return n + 1
    })
  }
  const skip = () => {
    update((s) => ({ tutorials: s.tutorials.includes(key) ? s.tutorials : [...s.tutorials, key] }))
    setStep(null)
    stageRef.current?.showBeacon(null)
  }

  const runAction = (a: Action) => {
    if (a.run) {
      const m = a.run(api.current, stageRef.current ?? { setPose: () => {}, walkTo: () => {} })
      if (m) setToast(m)
      setHint(false)
    }
    if (a.panel) setSheet(sheet === a.id ? null : a.id)
    if (cur?.action === a.id) next()
  }

  useEffect(() => {
    if (!spot) return
    seenSpots.current.add(spot)
    const done = getState().tutorials.includes(`story:${key}`)
    if (!done && seenSpots.current.size >= 3 && step == null) {
      setAsk(true)
      update((s) => ({ tutorials: [...s.tutorials, `story:${key}`] }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spot])
  useEffect(() => { enteredAt.current = Date.now(); seenSpots.current = new Set() }, [key])
  const otherPlace = open.find((p) => p.id !== current.id)

  const active = sc.actions.find((a) => a.id === sheet)
  const infoOpen = sheet === 'info'
  const spotInfo = spot ? sc.spots?.[spot] : undefined
  const spotAction = spotInfo?.action ? sc.actions.find((a) => a.id === spotInfo.action) : undefined

  return (
    <div className={`space w-${id}`}>
      <div className="stage-host" ref={host} />
      {state === 'loading' && (
        <div className="space-loading" role="status">
          <div className="spinner" />
          <p>{lang === 'en' ? def.brand : t.worlds[id].name}</p>
          <p className="hint">{t.building}</p>
        </div>
      )}
      {state === 'nogl' && <div className="space-loading"><p>{t.noGL}</p></div>}

      <header className="hud-top">
        <a className="glass-btn" href={href(`spaces/${id}`)} aria-label={t.back} onClick={(e) => {
          // 30초 넘게 둘러봤으면 나가기 전에 다음 할 일을 제안
          if (!end && Date.now() - enteredAt.current > 30000 && step == null) { e.preventDefault(); setEnd(true) }
        }}><Icon name="back" /></a>
        <div className="hud-title glass">
          <span className="world-brand">{lang === 'en' ? def.brand : t.worlds[id].name}</span>
          <strong aria-current="location">{name(current)}</strong>
        </div>
        <button className="glass-btn" onClick={() => update((s) => ({ sound: !s.sound }))} aria-label={t.s.sound} aria-pressed={sound}>
          <Icon name={sound ? 'sound' : 'mute'} />
        </button>
        <button className={`glass-btn fav ${fav ? 'on' : ''}`} onClick={() => toggleFavorite(key)} aria-pressed={fav} aria-label={fav ? t.favRemove : t.favAdd}>
          <Icon name="star" />
        </button>
      </header>

      <nav className="hud-places" aria-label={t.worlds[id].place}>
        {def.places.map((p) =>
          p.soon ? (
            <span key={p.id} className="pill soon" aria-disabled="true">{name(p)} · {t.soon}</span>
          ) : (
            <a key={p.id} className={`pill ${p.id === current.id ? 'on' : ''}`} href={href(`w/${id}/${p.id}`)} aria-current={p.id === current.id ? 'page' : undefined}>{name(p)}</a>
          ),
        )}
        <span className="pill people" title={t.peopleNote}><Icon name="pray" size={14} /> {t.peopleSolo}</span>
      </nav>

      {/* 튜토리얼 카드 */}
      {step === -1 && state === 'ready' && (
        <div className="tour glass">
          <p className="tour-k">{t.tourOffer}</p>
          <div className="row">
            <button className="btn btn-primary" onClick={() => setStep(0)}>{t.tourStart}</button>
            <button className="btn" onClick={skip}>{t.tourSkip}</button>
          </div>
        </div>
      )}
      {cur && (
        <div className="tour glass" role="dialog" aria-label={t.tour}>
          <p className="tour-k">{t.tour} {step! + 1}/{tour.length}</p>
          <h3>{cur.title}</h3>
          <p>{cur.text}</p>
          <div className="row">
            {!cur.spot && !cur.action && <button className="btn btn-primary" onClick={next}>{step! + 1 >= tour.length ? t.tourFinish : t.tourNext}</button>}
            {(cur.spot || cur.action) && <span className="hint">{cur.spot ? t.tourGo : t.tourDo}</span>}
            {(cur.spot || cur.action) && <button className="btn" onClick={next}>{t.tourNext}</button>}
            <button className="btn link-btn" onClick={skip}>{t.tourSkip}</button>
          </div>
        </div>
      )}

      {/* 가까이 가면 뜨는 안내 */}
      {spotInfo && !cur && (
        <div className="spot glass" role="status">
          <strong>{spotInfo.label}</strong>
          {spotInfo.text && <p>{spotInfo.text}</p>}
          <div className="row">
            {spotAction && <button className="btn btn-primary" onClick={() => runAction(spotAction)}>{spotAction.label}</button>}
            <a className="btn" href={href(`explore/${id}/learn`)}>{t.sx.storyYes}</a>
          </div>
        </div>
      )}

      {/* 충분히 둘러본 뒤 한 번만: 이야기가 궁금하신가요? */}
      {ask && !end && (
        <div className="ask glass" role="dialog">
          <p>{t.sx.storyAsk}</p>
          <div className="row">
            <a className="btn btn-primary" href={href(`explore/${id}/learn`)}>{t.sx.storyYes}</a>
            <button className="btn" onClick={() => setAsk(false)}>{t.sx.storyNo}</button>
          </div>
        </div>
      )}

      {/* 체험을 마치고 나갈 때: 다음 행동 제안 */}
      {end && (
        <div className="end-card glass" role="dialog" aria-label={t.sx.endTitle(name(current))}>
          <h3>{t.sx.endTitle(name(current))}</h3>
          <a className="end-opt" href={href(`explore/${id}/learn`)}>{t.sx.endStory}<Icon name="chev" size={16} /></a>
          <a className="end-opt" href={href(`explore/${id}/activities`)}>{t.sx.endActs}<Icon name="chev" size={16} /></a>
          {otherPlace && <a className="end-opt" href={href(`w/${id}/${otherPlace.id}`)} onClick={() => setEnd(false)}>{t.sx.endOther(name(otherPlace))}<Icon name="chev" size={16} /></a>}
          <a className="end-opt" href={href('spaces')}>{t.sx.endWorld}<Icon name="chev" size={16} /></a>
          <a className="btn" href={href(`spaces/${id}`)}>{t.sx.endLeave}</a>
        </div>
      )}

      {hint && state === 'ready' && !toast && step == null && !spotInfo && <p className="hud-hint glass">{coarse ? t.moveHintTouch : t.moveHint}</p>}
      {toast && <p className="hud-hint glass toast" role="status">{toast}</p>}

      {coarse && state === 'ready' && <Joystick onMove={(x, y) => { stageRef.current?.setStick(x, y); if (x || y) setHint(false) }} />}

      {state === 'ready' && seat && (
        <button className={`seat-btn glass ${seat === 'seated' ? 'on' : ''}`} onClick={() => {
          const st = stageRef.current
          if (!st) return
          if (seat === 'seated') { st.standUp(); setSeat('near') } else if (st.sitHere()) setToast(t.sitNote)
        }}>{seat === 'seated' ? t.standUp : t.sitHere}</button>
      )}
      {sc.gestures && state === 'ready' && (
        <div className="gestures" role="toolbar" aria-label={t.gestures}>
          {sc.gestures.map((g) => (
            <button key={g.id} className={`gesture glass ${(g.pose === 'sweep' && sweeping) || (g.pose === 'pray' && seatPray) ? 'on' : ''}`} onClick={() => {
              const st = stageRef.current
              if (!st) return
              if (g.pose === 'sweep') {
                st.setSweep(!st.sweeping)
                setSweeping(st.sweeping)
                if (st.sweeping && g.note) setToast(g.note)
                return
              }
              if (g.pose === 'sit') {
                if (!st.sitNearest()) setToast(t.noSeat)
                else if (g.note) setToast(g.note)
                return
              }
              st.setPose(g.pose)
              if (g.pose === 'pray' && st.seated) setSeatPray((v) => !v)
              if (g.note) setToast(st.seated && g.pose === 'pray' ? t.sitPrayNote : g.note)
              if (cur?.action === g.id) next()
            }}>{g.label}</button>
          ))}
        </div>
      )}

      <div className="hud-dock" role="toolbar">
        <button className={`dock-btn ${infoOpen ? 'on' : ''}`} onClick={() => setSheet(infoOpen ? null : 'info')}>
          <span className="dock-ic"><Icon name="info" /></span>
          <span>{t.guide}</span>
        </button>
        {sc.actions.map((a) => (
          <button key={a.id} className={`dock-btn ${sheet === a.id ? 'on' : ''}`} onClick={() => runAction(a)}>
            <span className="dock-ic"><Icon name={a.icon} /></span>
            <span>{a.label}</span>
          </button>
        ))}
      </div>

      {(active?.panel || infoOpen) && (
        <section className="sheet glass" aria-label={infoOpen ? t.guide : active!.label}>
          <div className="sheet-head">
            <h2>{infoOpen ? name(current) : active!.label}</h2>
            <button className="glass-btn small" onClick={() => setSheet(null)} aria-label={t.close}><Icon name="close" size={18} /></button>
          </div>
          <div className="sheet-body">
            {infoOpen ? (
              <>
                <p className="intro">{sc.intro}</p>
                {tour.length > 0 && <p><button className="btn" onClick={() => { setSheet(null); setStep(0) }}>{t.tourRestart}</button></p>}
                <p className="note">{coarse ? t.moveHintTouch : t.moveHint}</p>
                <p className="note">{t.disclaimer}</p>
              </>
            ) : active!.panel}
          </div>
        </section>
      )}
    </div>
  )
}
