import { useState } from 'react'
import { DEITIES, type DeityId } from '../data/deities'
import { askNotify, isApp } from '../lib/reminders'
import { useBack } from '../lib/back'
import { eraseShrine, updateShrine, useShrine, type Reminder } from '../lib/store'
import { getLang, LANGS, localDeity, setLang, useLang, useT } from '../i18n'
import { DeityEmblem } from '../components/DeityEmblem'
import { Note } from '../components/Shared'
import { Overlay } from '../components/Overlay'
import { CustomDeityForm } from '../components/CustomDeityForm'
import { AvatarPicker } from '../components/AvatarPicker'

type Page = 'me' | 'deities' | 'reminders' | 'feedback' | 'about'

const OPERATOR = 'chilbokpapa'

const REMINDER_OFF: Reminder = { daily: false, time: '07:00', observances: false }

function Reminders() {
  const t = useT()
  const s = useShrine()!
  const [denied, setDenied] = useState(false)
  const r = s.reminder ?? REMINDER_OFF

  const turnOn = async (patch: Partial<Reminder>) => {
    const ok = await askNotify().catch(() => false)
    setDenied(!ok)
    if (ok) updateShrine({ reminder: { ...r, ...patch } })
  }

  return (
    <>
      <label className="switch">
        <span>{t.reminderDaily}</span>
        <input type="checkbox" checked={r.daily} onChange={(e) => (e.target.checked ? turnOn({ daily: true }) : updateShrine({ reminder: { ...r, daily: false } }))} />
      </label>
      {r.daily && (
        <label className="lbl">{t.reminderTime}
          <input className="field" type="time" value={r.time} onChange={(e) => e.target.value && updateShrine({ reminder: { ...r, time: e.target.value } })} />
        </label>
      )}
      <label className="switch">
        <span>{t.reminderObservances}</span>
        <input type="checkbox" checked={r.observances} onChange={(e) => (e.target.checked ? turnOn({ observances: true }) : updateShrine({ reminder: { ...r, observances: false } }))} />
      </label>
      {denied && <p className="note">{t.reminderDenied}</p>}
      <Note>{t.reminderNote}</Note>
    </>
  )
}

function Feedback() {
  const t = useT()
  const [text, setText] = useState('')
  const [contact, setContact] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'failed' | 'limited'>('idle')

  const send = async () => {
    setState('sending')
    try {
      const res = await fetch('/api/feedback', { method: 'POST', body: JSON.stringify({ text: text.trim(), contact: contact.trim(), lang: getLang() }) })
      if (res.status === 429) setState('limited')
      else setState(res.ok ? 'sent' : 'failed')
    } catch {
      setState('failed')
    }
  }

  if (state === 'sent') return <p className="lead center">{t.feedbackSent}</p>
  return (
    <>
      <p className="muted">{t.feedbackIntro(OPERATOR)}</p>
      <textarea className="field" rows={7} maxLength={1000} value={text} aria-label={t.feedbackLabel} placeholder={t.feedbackLabel} onChange={(e) => setText(e.target.value)} />
      <input className="field" maxLength={100} value={contact} aria-label={t.feedbackContact} placeholder={t.feedbackContact} onChange={(e) => setContact(e.target.value)} />
      <Note>{t.feedbackNote}</Note>
      {state === 'failed' && <p className="note">{t.feedbackFail}</p>}
      {state === 'limited' && <p className="note">{t.feedbackLimit}</p>}
      <button className="btn wide" disabled={text.trim().length < 2 || state === 'sending'} onClick={send}>{t.feedbackSend}</button>
    </>
  )
}

export function Profile({ onExit }: { onExit: () => void }) {
  useBack(onExit)
  const s = useShrine()!
  const t = useT()
  const lang = useLang()
  const [page, setPage] = useState<Page | null>(null)
  const [confirming, setConfirming] = useState(false)

  const toggleOther = (id: DeityId) =>
    updateShrine({
      otherDeities: s.otherDeities.includes(id) ? s.otherDeities.filter((x) => x !== id) : [...s.otherDeities, id],
    })

  const setMain = (id: DeityId) => updateShrine({ mainDeity: id, otherDeities: s.otherDeities.filter((x) => x !== id) })

  const menu: [Page, string][] = [['me', t.menuMe], ['deities', t.menuDeities], ...(isApp() ? ([['reminders', t.menuReminders]] as [Page, string][]) : []), ['feedback', t.menuFeedback], ['about', t.menuAbout]]

  return (
    <div className="screen settings">
      <header className="head">
        <button className="back" onClick={onExit}>{t.backShrine}</button>
        <h1>{t.settings}</h1>
      </header>

      <h2 className="eyebrow">{t.language}</h2>
      <div className="chips">
        {LANGS.map((l) => (
          <button key={l.id} className={`chip ${lang === l.id ? 'on' : ''}`} aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>{l.label}</button>
        ))}
      </div>

      <label className="switch">
        <span>{t.sound}</span>
        <input type="checkbox" checked={s.sound} onChange={(e) => updateShrine({ sound: e.target.checked })} />
      </label>

      <div className="list">
        {menu.map(([id, label]) => (
          <button key={id} className="row" onClick={() => setPage(id)}><span><strong>{label}</strong></span><i>›</i></button>
        ))}
      </div>

      {page === 'me' && (
        <Overlay title={t.menuMe} onClose={() => setPage(null)}>
          <h2 className="eyebrow">{t.chooseLook}</h2>
          <AvatarPicker value={s.avatar ?? 0} onPick={(i) => updateShrine({ avatar: i })} />
          <label className="lbl">{t.yourName}
            <input className="field" value={s.name} maxLength={30} onChange={(e) => updateShrine({ name: e.target.value })} />
          </label>
        </Overlay>
      )}

      {page === 'deities' && (
        <Overlay title={t.menuDeities} onClose={() => setPage(null)}>
          <h2 className="eyebrow">{t.mainDeity}</h2>
          <div className="mini-grid">
            {DEITIES.map((base) => localDeity(t, base.id)).map((d) => (
              <button key={d.id} className={s.mainDeity === d.id ? 'on' : ''} aria-pressed={s.mainDeity === d.id} onClick={() => setMain(d.id)}>
                <DeityEmblem id={d.id} size={54} /><span>{d.name}</span>
              </button>
            ))}
            <button className={s.mainDeity === 'custom' ? 'on' : ''} aria-pressed={s.mainDeity === 'custom'} onClick={() => setMain('custom')}>
              <DeityEmblem id="custom" size={54} /><span>{s.customName || t.customCard}</span>
            </button>
          </div>

          {s.mainDeity === 'custom' && <CustomDeityForm name={s.customName ?? ''} onName={(v) => updateShrine({ customName: v })} />}

          <h2 className="eyebrow">{t.otherDeities}</h2>
          <div className="chips">
            {DEITIES.filter((d) => d.id !== s.mainDeity).map((base) => localDeity(t, base.id)).map((d) => (
              <button key={d.id} className={`chip ${s.otherDeities.includes(d.id) ? 'on' : ''}`} aria-pressed={s.otherDeities.includes(d.id)} onClick={() => toggleOther(d.id)}>{d.name}</button>
            ))}
          </div>

          <label className="lbl">{t.familyDeity}
            <input className="field" value={s.familyDeity} placeholder={t.optional} maxLength={40} onChange={(e) => updateShrine({ familyDeity: e.target.value })} />
          </label>
          <label className="lbl">{t.chosenDeity}
            <input className="field" value={s.chosenDeity} placeholder={t.optional} maxLength={40} onChange={(e) => updateShrine({ chosenDeity: e.target.value })} />
          </label>
        </Overlay>
      )}

      {page === 'reminders' && (
        <Overlay title={t.menuReminders} onClose={() => setPage(null)}>
          <Reminders />
        </Overlay>
      )}

      {page === 'feedback' && (
        <Overlay title={t.menuFeedback} onClose={() => setPage(null)}>
          <Feedback />
        </Overlay>
      )}

      {page === 'about' && (
        <Overlay title={t.menuAbout} onClose={() => setPage(null)}>
          <Note>{t.localNote}</Note>
          <Note>{t.statsNote}</Note>
          <Note>{t.soundCredit}</Note>
          <a className="link" href="/privacy" target="_blank" rel="noreferrer">{t.privacyPolicy}</a>
          {confirming ? (
            <div className="stack">
              <p>{t.deleteWarn}</p>
              <button className="btn danger wide" onClick={eraseShrine}>{t.deleteAll}</button>
              <button className="link" onClick={() => setConfirming(false)}>{t.keepShrine}</button>
            </div>
          ) : (
            <button className="link" onClick={() => setConfirming(true)}>{t.deleteShrine}</button>
          )}
        </Overlay>
      )}
    </div>
  )
}
