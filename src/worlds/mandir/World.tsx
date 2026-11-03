import { useEffect, useState } from 'react'
import { stopAll } from '../../core/audio'
import type { WorldProps } from '../../core/registry'
import { worldById } from '../../core/registry'
import { href } from '../../core/router'
import { recordVisit, update, useStore } from '../../core/store'
import { useLocal, useT } from '../../i18n'
import { Icon } from '../../ui/icons'
import TOUR from './tour'

/**
 * 힌두교 모듈 = PujaTime 그대로.
 * PujaTime을 /hindu/ 에 따로 빌드해 같은 사이트 안에서 연다(코드·디자인·3D를 바꾸지 않음).
 * 같은 주소(origin)라 PujaTime 기록(pujatime-v1)도 그대로 이어진다.
 */
export default function MandirWorld({ place, tour }: WorldProps) {
  const t = useT()
  const g = useLocal(TOUR)
  const lang = useStore((s) => s.lang)
  const done = useStore((s) => s.tutorials.includes('mandir/mandir'))
  const def = worldById('mandir')!
  const cur = def.places.find((p) => p.id === place) ?? def.places[0]
  const [step, setStep] = useState<number | null>(tour || !done ? -1 : null)
  const steps = g.tour.filter((s) => !s.spot) // PujaTime 화면 위에서는 글로만 안내

  useEffect(() => {
    recordVisit(`mandir/${cur.id}`)
    stopAll()
  }, [cur.id])

  const finish = () => {
    update((s) => ({ tutorials: s.tutorials.includes('mandir/mandir') ? s.tutorials : [...s.tutorials, 'mandir/mandir'] }))
    setStep(null)
  }
  const src = `/hindu/${cur.id === 'mandir' ? '?tab=mandir' : ''}`
  const s = step != null && step >= 0 ? steps[step] : null

  return (
    <div className="space embed w-mandir">
      <header className="embed-bar">
        <a className="glass-btn" href={href('r/mandir')} aria-label={t.back}><Icon name="back" /></a>
        <span className="world-brand">{def.brand}</span>
        {def.places.map((p) => (
          <a key={p.id} className={`pill ${p.id === cur.id ? 'on' : ''}`} href={href(`w/mandir/${p.id}`)} aria-current={p.id === cur.id ? 'page' : undefined}>{lang === 'en' ? p.en : p.ko}</a>
        ))}
      </header>
      <iframe key={cur.id} className="embed-frame" src={src} title={lang === 'en' ? cur.en : cur.ko} allow="autoplay" />
      {step === -1 && (
        <div className="tour glass embed-tour">
          <p className="tour-k">{t.tourOffer}</p>
          <div className="row">
            <button className="btn btn-primary" onClick={() => setStep(0)}>{t.tourStart}</button>
            <button className="btn" onClick={finish}>{t.tourSkip}</button>
          </div>
        </div>
      )}
      {s && (
        <div className="tour glass embed-tour" role="dialog">
          <p className="tour-k">{t.tour} {step! + 1}/{steps.length}</p>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
          <div className="row">
            <button className="btn btn-primary" onClick={() => (step! + 1 >= steps.length ? finish() : setStep(step! + 1))}>{step! + 1 >= steps.length ? t.tourFinish : t.tourNext}</button>
            <button className="btn link-btn" onClick={finish}>{t.tourSkip}</button>
          </div>
        </div>
      )}
    </div>
  )
}
