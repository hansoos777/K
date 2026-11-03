import { useEffect, useState } from 'react'
import { playAmbient, stopAmbient } from './lib/ambient'
import { stopSong } from './lib/songPlayer'
import type { DeityId } from './data/deities'
import { useShrine } from './lib/store'
import { syncReminders } from './lib/reminders'
import { useBack } from './lib/back'
import { useT } from './i18n'
import { Onboarding } from './screens/Onboarding'
import { Home } from './screens/Home'
import { Puja } from './screens/Puja'
import { Darshan } from './screens/Darshan'
import { Japa } from './screens/Japa'
import { Mandir } from './screens/Mandir'
import { Pray } from './screens/Pray'
import { Journal } from './screens/Journal'
import { Profile } from './screens/Profile'
import { Upcoming } from './screens/Upcoming'

type Tab = 'home' | 'mandir' | 'soon' | 'pray' | 'journal'

// 내 신당(매일) / 사원(함께, 특별한 날) / 오픈 예정. 기도와 기록은 내 신당 안의 화면.
const TABS: { id: Tab; key: 'shrine' | 'mandir' | 'soon'; icon: string }[] = [
  { id: 'home', key: 'shrine', icon: 'M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9zM4 19h16' },
  { id: 'mandir', key: 'mandir', icon: 'M12 2v3M8 21V11l4-6 4 6v10M4 21v-6l4-3M20 21v-6l-4-3M3 21h18M10.5 21v-5h3v5' },
  { id: 'soon', key: 'soon', icon: 'M12 3l2.7 5.8 6.3.7-4.7 4.3 1.3 6.2-5.6-3.2L6.4 20l1.3-6.2L3 9.5l6.3-.7z' },
]

// 스프링이었다면 DispatcherServlet이 URL로 나누는 일을, 여기서는 화면 상태 하나로 처리.
export function App() {
  const shrine = useShrine()
  const t = useT()
  // ORUVIA에서 ?tab=mandir 로 열면 사원 탭부터 보여 줌
  const [tab, setTab] = useState<Tab>(() => (new URLSearchParams(location.search).get('tab') === 'mandir' ? 'mandir' : 'home'))
  const [puja, setPuja] = useState<DeityId | null>(null)
  const [darshan, setDarshan] = useState(false)
  const [profile, setProfile] = useState(false)
  const [japa, setJapa] = useState(false)
  const soundOn = shrine?.sound ?? false
  const track = shrine?.audio?.track

  // 다른 탭에서 폰의 뒤로가기를 누르면 앱이 꺼지지 않고 내 신당으로 돌아옴
  useBack(() => setTab('home'), tab !== 'home')

  // 앱을 열 때와 알림 설정이 바뀔 때 기기 알림을 다시 예약
  useEffect(() => {
    if (shrine) void syncReminders(shrine, t).catch(() => {})
  }, [shrine?.reminder, shrine?.place, t])

  // 첫 터치 때 배경 소리를 시작하고, 앱을 내리거나 소리를 끄면 멈춤
  useEffect(() => {
    if (!soundOn) {
      stopAmbient()
      return
    }
    const start = () => {
      if (!document.hidden) playAmbient()
    }
    const onVisible = () => {
      if (document.hidden) {
        stopSong()
        stopAmbient()
      } else playAmbient()
    }
    window.addEventListener('pointerdown', start, { once: true })
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('pointerdown', start)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [soundOn, track])

  if (!shrine) return <div className="app"><Onboarding /></div>
  const section = tab === 'pray' || tab === 'journal' ? 'home' : tab
  if (puja) return <div className="app"><Puja deityId={puja} onExit={() => { setPuja(null); setTab('home') }} /></div>
  if (japa) return <div className="app"><Japa onExit={() => setJapa(false)} /></div>
  if (darshan) return <div className="app"><Darshan onExit={() => setDarshan(false)} /></div>
  if (profile) return <div className="app"><Profile onExit={() => setProfile(false)} /></div>

  return (
    <div className="app">
      <main className="page" key={tab}>
        {tab === 'home' && (
          <Home
            onPuja={() => setPuja(shrine.mainDeity)}
            onDarshan={() => setDarshan(true)}
            onJapa={() => setJapa(true)}
            onPray={() => setTab('pray')}
            onJournal={() => setTab('journal')}
            onCeremony={setPuja}
            onProfile={() => setProfile(true)}
          />
        )}
        {tab === 'mandir' && <Mandir onCeremony={setPuja} />}
        {tab === 'pray' && <Pray onBack={() => setTab('home')} onJapa={() => setJapa(true)} onDarshan={() => setDarshan(true)} />}
        {tab === 'journal' && <Journal onBack={() => setTab('home')} />}
        {tab === 'soon' && <Upcoming />}
      </main>
      <nav className="tabs" aria-label="Main">
        {TABS.map((tb) => (
          <button key={tb.id} className={section === tb.id ? 'on' : ''} onClick={() => setTab(tb.id)} aria-current={section === tb.id ? 'page' : undefined}>
            <svg viewBox="0 0 24 24" width="23" height="23" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d={tb.icon} />
            </svg>
            <span>{t.tabs[tb.key]}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
