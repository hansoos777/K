import { BRAND } from '../brand'
import { WORLDS } from '../core/registry'
import { href } from '../core/router'
import Finder from './Finder'
import { useEffect, useState } from 'react'
import { collect, type Metric } from '../core/perf'
import { effectiveQuality, exportData, resetAll, update, useStore, type Quality } from '../core/store'
import { LANGS, useT } from '../i18n'
import { Icon, type IconName } from './icons'

export default function Me() {
  const jump = (el: string) => (e: { preventDefault: () => void }) => { e.preventDefault(); document.getElementById(el)?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
  const t = useT()
  const s = useStore((x) => x)
  const q = effectiveQuality(s)
  const [metrics, setMetrics] = useState<Metric[]>([])
  useEffect(() => setMetrics(collect()), [])

  const download = () => {
    const url = URL.createObjectURL(new Blob([exportData()], { type: 'application/json' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `${BRAND.en.toLowerCase()}-data.json`
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const label = (m: Metric) => {
    if (m.key.startsWith('world:')) return `${t.s.metric.world} · ${t.worlds[m.key.slice(6) as keyof typeof t.worlds]?.name ?? m.key}`
    return t.s.metric[m.key as keyof typeof t.s.metric] ?? m.key
  }

  return (
    <div className="settings screen">
      <div className="screen-head"><h1>{t.me.title}</h1></div>

      <section className="me-head">
        <span className="avatar"><Icon name="user" size={30} /></span>
        <span><strong>{s.nickname || t.me.guest}</strong><small>{t.me.hello}</small></span>
        <a className="icon-btn" href="#profile" onClick={jump('profile')} aria-label={t.me.profile}><Icon name="gear" size={20} /></a>
      </section>

      <section className="me-card">
        <h2>{t.me.faithInfo}</h2>
        <dl>
          <div><dt>{t.me.interests}</dt><dd>{s.interests.length ? s.interests.map((i) => t.worlds[i as keyof typeof t.worlds]?.name).join(' · ') : t.me.none}</dd></div>
          <div><dt>MBTI</dt><dd>{s.mbti || t.me.none}</dd></div>
          <div><dt>{t.me.learnDone}</dt><dd>{s.learned.length}</dd></div>
        </dl>
        <a className="more" href="#finder" onClick={jump('finder')}>{t.me.more}<Icon name="chev" size={14} /></a>
      </section>

      <ul className="me-rows">
        {([
          ['star', t.mine.favorites, href('mine#favorites')],
          ['note', t.mine.logTitle, href('mine#log')],
          ['book', t.me.learning, '#learning'],
          ['globe', t.s.language, '#lang'],
          ['bell', t.me.notify, '#notify'],
          ['gear', t.me.account, '#account'],
        ] as [IconName, string, string][]).map(([ic, label, to]) => (
          <li key={label}>
            <a href={to} onClick={to.startsWith('#') && !to.startsWith('#/') ? jump(to.slice(1)) : undefined}>
              <Icon name={ic} size={20} /><span>{label}</span><Icon name="chev" size={16} />
            </a>
          </li>
        ))}
      </ul>

      <fieldset id="learning">
        <legend>{t.me.learning}</legend>
        <ul className="learn-rec">
          {WORLDS.map((w) => {
            const done = s.learned.filter((k) => k.startsWith(w.id + '/')).length
            const savedN = s.savedLessons.filter((k) => k.startsWith(w.id + '/')).length
            const qz = s.quizzes[w.id]
            return (
              <li key={w.id}>
                <a href={href(`explore/${w.id}/learn`)}>
                  <strong>{t.worlds[w.id].name}</strong>
                  <span className="hint">{t.me.learnLine(done, savedN, qz ? `${qz.best}/${qz.total}` : '—')}</span>
                  <Icon name="chev" size={16} />
                </a>
              </li>
            )
          })}
        </ul>
        <p className="hint">{t.me.learnNote}</p>
      </fieldset>

      <fieldset id="profile">
        <legend>{t.me.profile}</legend>
        <label className="field">
          <span>{t.s.nickname}</span>
          <input value={s.nickname} maxLength={24} onChange={(e) => update(() => ({ nickname: e.target.value }))} />
        </label>
        <p className="hint">{t.s.nicknameHint}</p>
      </fieldset>

      <fieldset id="finder">
        <legend>{t.me.finder}</legend>
        <Finder />
      </fieldset>

      <fieldset>
        <legend>{t.me.interests}</legend>
        <div className="seg wrap">
          {WORLDS.map((w) => (
            <button key={w.id} role="checkbox" aria-checked={s.interests.includes(w.id)} onClick={() => update((x) => ({ interests: x.interests.includes(w.id) ? x.interests.filter((i) => i !== w.id) : [...x.interests, w.id] }))}>
              {t.worlds[w.id].name}
            </button>
          ))}
        </div>
        <p className="hint">{t.me.interestsHint}</p>
      </fieldset>

      <fieldset id="lang">
        <legend>{t.s.language}</legend>
        <div className="seg" role="radiogroup">
          {LANGS.map((l) => (
            <button key={l.id} role="radio" aria-checked={s.lang === l.id} onClick={() => update(() => ({ lang: l.id }))}>
              {l.label}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset id="notify">
        <legend>{t.me.notify}</legend>
        <label className="toggle">
          <input type="checkbox" checked={s.notify.daily} onChange={(e) => update((x) => ({ notify: { ...x.notify, daily: e.target.checked } }))} />
          <span>{t.me.notifyDaily}</span>
        </label>
        <label className="toggle">
          <input type="checkbox" checked={s.notify.festival} onChange={(e) => update((x) => ({ notify: { ...x.notify, festival: e.target.checked } }))} />
          <span>{t.me.notifyFestival}</span>
        </label>
        <p className="hint">{t.me.notifyNote}</p>
      </fieldset>

      <fieldset>
        <legend>{t.s.sound}</legend>
        <label className="toggle">
          <input type="checkbox" checked={s.sound} onChange={(e) => update(() => ({ sound: e.target.checked }))} />
          <span>{t.s.soundOn}</span>
        </label>
        <label className="field">
          <span>{t.s.volume} · {Math.round(s.volume * 100)}</span>
          <input type="range" min={0} max={1} step={0.05} value={s.volume} disabled={!s.sound}
            onChange={(e) => update(() => ({ volume: Number(e.target.value) }))} />
        </label>
      </fieldset>

      <fieldset>
        <legend>{t.s.a11y}</legend>
        <label className="toggle">
          <input type="checkbox" checked={s.reduceMotion} onChange={(e) => update(() => ({ reduceMotion: e.target.checked }))} />
          <span>{t.s.reduceMotion}</span>
        </label>
        <label className="toggle">
          <input type="checkbox" checked={s.largeText} onChange={(e) => update(() => ({ largeText: e.target.checked }))} />
          <span>{t.s.largeText}</span>
        </label>
        <div className="field">
          <span>{t.s.quality} · {t.s.qNow}: {q === 'low' ? t.s.qLow : t.s.qHigh}</span>
          <div className="seg" role="radiogroup">
            {(['auto', 'low', 'high'] as Quality[]).map((v) => (
              <button key={v} role="radio" aria-checked={s.quality === v} onClick={() => update(() => ({ quality: v }))}>
                {v === 'auto' ? t.s.qAuto : v === 'low' ? t.s.qLow : t.s.qHigh}
              </button>
            ))}
          </div>
        </div>
      </fieldset>

      <fieldset id="account">
        <legend>{t.me.account}</legend>
        <p className="hint">{t.me.accountNote}</p>
        <p className="hint">{t.s.dataNote}</p>
        <div className="row">
          <button className="btn" onClick={download}>{t.s.export}</button>
          <button className="btn btn-danger" onClick={() => confirm(t.s.resetConfirm) && resetAll()}>{t.s.reset}</button>
        </div>
      </fieldset>

      <fieldset>
        <legend>{t.s.diag}</legend>
        <p className="hint">{t.s.diagNote}</p>
        <dl className="metrics">
          {metrics.map((m) => (
            <div key={m.key}>
              <dt>{label(m)}</dt>
              <dd>{m.unit === 'KB' ? m.value.toFixed(1) : Math.round(m.value)} {m.unit}</dd>
            </div>
          ))}
        </dl>
      </fieldset>
    </div>
  )
}
