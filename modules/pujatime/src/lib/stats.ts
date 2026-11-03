import { getLang } from '../i18n'
import { getShrine } from './store'

// 익명 사용 통계. 보내는 값은 무작위 기기 번호, 언어, 모시는 신, 사용 횟수, 머문 시간뿐.
// 이름, 기도, 일기, 사진은 절대 보내지 않음.
export type StatEvent = 'open' | 'onboard' | 'puja' | 'hall' | 'japa' | 'darshan'

const KEY = 'pujatime-device'
const PING_MS = 3 * 60e3
const MIN_SEC = 10

function deviceId() {
  try {
    let id = localStorage.getItem(KEY)
    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem(KEY, id)
    }
    return id
  } catch {
    return null // 저장이 막힌 기기는 집계하지 않음
  }
}

let shownAt = Date.now()

function send(e: StatEvent | 'ping', s = 0) {
  if (!import.meta.env.PROD) return
  const d = deviceId()
  if (d) navigator.sendBeacon('/api/hit', JSON.stringify({ d, e, s, l: getLang(), g: getShrine()?.mainDeity }))
}

export const track = (e: StatEvent) => send(e)

function ping() {
  const sec = (Date.now() - shownAt) / 1000
  if (sec < MIN_SEC) return // 화면이 빠르게 숨었다 나타나도 요청이 쏟아지지 않게 막음
  shownAt = Date.now()
  send('ping', sec)
}

export function startStats() {
  send('open')
  setInterval(() => {
    if (!document.hidden) ping()
  }, PING_MS)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) ping()
    else shownAt = Date.now()
  })
}
