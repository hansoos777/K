import { BRAND } from '../brand'
import { track } from '../lib/stats'
import { useState } from 'react'
import { DEITIES, EXPLORE_REASONS, type DeityId } from '../data/deities'
import { LANGS, localDeity, setLang, useLang, useT } from '../i18n'
import { createShrine } from '../lib/store'
import { DeityEmblem } from '../components/DeityEmblem'
import { ShrineStage } from '../components/ShrineStage'
import { DeitySheet, Note } from '../components/Shared'
import { CustomDeityForm } from '../components/CustomDeityForm'
import { AvatarPicker } from '../components/AvatarPicker'

export function Onboarding() {
  const [step, setStep] = useState<'welcome' | 'deity' | 'explore' | 'custom' | 'name'>('welcome')
  const [open, setOpen] = useState<DeityId | null>(null)
  const [chosen, setChosen] = useState<DeityId | null>(null)
  const [suggested, setSuggested] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [customName, setCustomName] = useState('')
  const [avatar, setAvatar] = useState(0)
  const t = useT()
  const lang = useLang()

  const welcome = (id: DeityId) => {
    setChosen(id)
    setOpen(null)
    setStep('name')
  }

  if (step === 'welcome')
    return (
      <div className="onb welcome">
        <div className="scene-wrap"><ShrineStage deity="ganesha" lit /></div>
        <div className="onb-text">
          <p className="brand">{BRAND}</p>
          <h1>{t.welcomeTitle}</h1>
          <p>{t.welcomeBody}</p>
          <button className="btn wide" onClick={() => setStep('deity')}>{t.createShrine}</button>
          <div className="chips center-chips">
            {LANGS.map((l) => (
              <button key={l.id} className={`chip ${lang === l.id ? 'on' : ''}`} aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>{l.label}</button>
            ))}
          </div>
        </div>
      </div>
    )

  if (step === 'explore') {
    const reason = suggested === null ? null : { ...EXPLORE_REASONS[suggested], ...t.reasons[suggested] }
    return (
      <div className="onb pad">
        <button className="back" onClick={() => setStep('deity')}>{t.back}</button>
        <h1>{t.whatBrings}</h1>
        <div className="stack">
          {t.reasons.map((r, i) => (
            <button key={r.label} className={`option ${suggested === i ? 'on' : ''}`} onClick={() => setSuggested(i)}>{r.label}</button>
          ))}
        </div>
        {reason && (
          <div className="suggest">
            <p>{reason.line}</p>
            {reason.deity ? (
              <button className="btn wide" onClick={() => setOpen(reason.deity)}>{t.learnMore}</button>
            ) : (
              <button className="btn wide" onClick={() => setStep('deity')}>{t.seeAll}</button>
            )}
          </div>
        )}
        {open && <DeitySheet id={open} onClose={() => setOpen(null)} action={{ label: t.welcomeInto, run: () => welcome(open) }} />}
      </div>
    )
  }

  if (step === 'custom')
    return (
      <div className="onb pad">
        <button className="back" onClick={() => setStep('deity')}>{t.back}</button>
        <h1>{t.customTitle}</h1>
        <p className="muted">{t.customBody}</p>
        <CustomDeityForm name={customName} onName={setCustomName} />
        <button className="btn wide" onClick={() => welcome('custom')}>{t.customContinue}</button>
      </div>
    )

  if (step === 'name')
    return (
      <div className="onb pad">
        <button className="back" onClick={() => setStep(chosen === 'custom' ? 'custom' : 'deity')}>{t.back}</button>
        <h1>{t.chooseLook}</h1>
        <AvatarPicker value={avatar} onPick={setAvatar} />
        <h2>{t.callYou}</h2>
        <p className="muted">{t.callYouBody}</p>
        <input className="field" value={name} maxLength={30} placeholder={t.namePlaceholder} aria-label={t.namePlaceholder} onChange={(e) => setName(e.target.value)} />
        <button className="btn wide" onClick={() => { createShrine(name, chosen!, customName, avatar); track('onboard') }}>{t.enterShrine}</button>
      </div>
    )

  return (
    <div className="onb pad">
      <h1>{t.whoTitle}</h1>
      <p className="muted">{t.whoBody}</p>
      <div className="grid">
        {DEITIES.map((base) => localDeity(t, base.id)).map((d) => (
          <button key={d.id} className="deity-card" onClick={() => setOpen(d.id)}>
            <DeityEmblem id={d.id} size={84} />
            <strong>{d.name}</strong>
            <span>{d.tagline}</span>
          </button>
        ))}
        <button className="deity-card" onClick={() => setStep('custom')}>
          <DeityEmblem id="custom" size={84} />
          <strong>{t.customCard}</strong>
          <span>{t.customCardBody}</span>
        </button>
      </div>
      <button className="link" onClick={() => setStep('explore')}>{t.notSure}</button>
      <Note />
      {open && <DeitySheet id={open} onClose={() => setOpen(null)} action={{ label: t.welcomeInto, run: () => welcome(open) }} />}
    </div>
  )
}
