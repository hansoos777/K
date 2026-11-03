import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useT } from '../i18n'
import { today, useShrine } from '../lib/store'
import { ringBell } from '../lib/sound'
import { useBack } from '../lib/back'
import { ShrineStage } from '../components/ShrineStage'
import { SoundSettings } from '../components/SoundSettings'
import { ThemePicker } from '../components/ThemePicker'

// 내 신당 전체 화면. 공용 사원처럼 body로 빼서 화면을 다 덮음.
export function MyShrine({ festivalLamps, onPuja, onClose }: { festivalLamps: boolean; onPuja: () => void; onClose: () => void }) {
  useBack(onClose)
  const s = useShrine()!
  const t = useT()
  const [sit, setSit] = useState(0)
  const [bell, setBell] = useState(0)
  const lit = s.lastPuja === today()

  const onBell = () => {
    ringBell()
    setBell((n) => n + 1)
  }

  return createPortal(
    <div className="hall my-shrine">
      <ShrineStage key={s.theme ?? 'temple'} deity={s.mainDeity} others={s.otherDeities} lit={lit} festivalLamps={festivalLamps || s.theme === 'diwali'} room avatar={s.avatar ?? 0} sitRequest={sit} onSeated={onPuja} bellSwing={bell} onBell={onBell} />
      <header className="hall-top">
        <button className="exit-btn" onClick={onClose}>‹ {t.leave}</button>
        <strong>{t.tabs.shrine}</strong>
        <ThemePicker />
        <SoundSettings />
      </header>
      <div className="hall-actions solo">
        <button onClick={() => setSit((n) => n + 1)}>{lit ? t.returnPuja : t.beginPuja}</button>
      </div>
    </div>,
    document.body,
  )
}
