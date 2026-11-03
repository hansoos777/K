import { Capacitor } from '@capacitor/core'
import { Haptics, ImpactStyle } from '@capacitor/haptics'
import { LocalNotifications, type LocalNotificationSchema } from '@capacitor/local-notifications'
import type { Dict } from '../i18n/en'
import { DELHI, upcomingDays } from './panchang'
import { today, type Shrine } from './store'

// 앱에서만 쓰는 네이티브 기능. 알림은 서버 없이 기기에 예약하므로 비용이 들지 않음.
// 스프링이었다면 @Scheduled에 해당하지만, 여기서는 기기 OS가 대신 시간을 맞춰 줌.

export const isApp = () => Capacitor.isNativePlatform()

const DAILY_ID = 1
const FIRST_DAY_ID = 100
const MAX_DAYS = 20 // iOS는 예약 알림이 64개까지라 여유 있게 제한
const OBSERVANCE_HOUR = 6

export async function askNotify() {
  const { display } = await LocalNotifications.requestPermissions()
  return display === 'granted'
}

/** 설정이 바뀌거나 앱을 열 때 다시 예약. 단식일은 30일치만 예약되므로 열 때마다 채움 */
export async function syncReminders(s: Shrine, t: Dict) {
  if (!isApp()) return
  const { notifications } = await LocalNotifications.getPending()
  if (notifications.length) await LocalNotifications.cancel({ notifications: notifications.map(({ id }) => ({ id })) })

  const list: LocalNotificationSchema[] = []
  const r = s.reminder
  if (r?.daily) {
    const [hour, minute] = r.time.split(':').map(Number)
    list.push({ id: DAILY_ID, title: t.reminderTitle, body: t.reminderBody, schedule: { on: { hour, minute }, allowWhileIdle: true } })
  }
  if (r?.observances) {
    upcomingDays(today(), s.place ?? DELHI, 30).slice(0, MAX_DAYS).forEach((d, i) => {
      const at = new Date(`${d.date}T${String(OBSERVANCE_HOUR).padStart(2, '0')}:00:00`)
      const first = t.observances[d.observances[0]]
      list.push({ id: FIRST_DAY_ID + i, title: t.observanceToday(first.name), body: first.body, schedule: { at, allowWhileIdle: true } })
    })
  }
  if (list.length) await LocalNotifications.schedule({ notifications: list })
}

/** 염주 한 알. 아이폰은 웹 진동을 지원하지 않아 앱에서는 네이티브로 처리 */
export function beadTap() {
  if (isApp()) void Haptics.impact({ style: ImpactStyle.Light })
  else navigator.vibrate?.(12)
}
