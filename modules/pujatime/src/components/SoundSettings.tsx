import { useState } from 'react'
import { useT } from '../i18n'
import { playAmbient } from '../lib/ambient'
import { softChime } from '../lib/sound'
import { audioPrefs, updateShrine, useShrine, type AudioPrefs, type MusicTrack } from '../lib/store'
import { Overlay } from './Overlay'

// 내 신당과 공용 사원 화면 위쪽의 소리 설정 버튼
export function SoundSettings() {
  const t = useT()
  const s = useShrine()!
  const [open, setOpen] = useState(false)
  const a = audioPrefs()

  const change = (patch: Partial<AudioPrefs>) => {
    updateShrine({ audio: { ...a, ...patch } })
    if (s.sound) playAmbient()
  }

  const tracks: [MusicTrack, string][] = [['tanpura', t.musicTanpura], ['off', t.musicOff]]

  return (
    <>
      <button className="hall-gear" onClick={() => setOpen(true)} aria-label={t.soundSettings}>
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 9.5v5h3.5L12 18.5v-13L7.5 9.5H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></svg>
      </button>
      {open && (
        <Overlay title={t.soundSettings} onClose={() => setOpen(false)}>
          <label className="switch">
            <span>{t.sound}</span>
            <input type="checkbox" checked={s.sound} onChange={(e) => updateShrine({ sound: e.target.checked })} />
          </label>
          <p className="lbl">{t.music}</p>
          <div className="segs">
            {tracks.map(([id, label]) => (
              <button key={id} className={a.track === id ? 'on' : ''} onClick={() => change({ track: id })}>{label}</button>
            ))}
          </div>
          <label className="lbl">{t.musicVolume}
            <input className="range" type="range" min="0" max="1" step="0.05" value={a.music} onChange={(e) => change({ music: Number(e.target.value) })} />
          </label>
          <label className="lbl">{t.sfxVolume}
            <input className="range" type="range" min="0" max="1" step="0.05" value={a.sfx} onChange={(e) => change({ sfx: Number(e.target.value) })} onPointerUp={softChime} />
          </label>
        </Overlay>
      )}
    </>
  )
}
