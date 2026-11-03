import { Body, MoonPhase, Observer, SearchRiseSet } from 'astronomy-engine'

// 힌두 달력 계산. 서버 없이 기기에서 천문 계산으로 구함.
// 티티는 달과 해의 황경 차이를 12도씩 나눈 음력 날짜이고, 그날 일출 때의 티티가 그날의 티티.
// 점성술(별자리 운세 등)은 다루지 않음.

export interface Place {
  lat: number
  lon: number
}

export type Observance = 'ekadashi' | 'pradosh' | 'sankashti' | 'purnima' | 'amavasya'

export interface PanchangDay {
  date: string
  tithi: number // 1~15 차는 달, 16~30 기우는 달
  sunrise: Date
  sunset: Date
  observances: Observance[]
}

export const DELHI: Place = { lat: 28.61, lon: 77.21 }

const HOUR = 3600e3
const PRADOSH_AFTER_SUNSET = 45 * 60e3
const ARUNODAYA = 96 * 60e3 // 해뜨기 전 새벽

export const tithiAt = (when: Date) => Math.floor(((MoonPhase(when) % 360) + 360) % 360 / 12) + 1

const key = (d: string, p: Place) => `${d}|${p.lat}|${p.lon}`
const cache = new Map<string, { sunrise: Date; sunset: Date; dawn: number; rise: number; dusk: number; moon: number }>()

// 그 지역의 자정부터 찾아야 날짜가 밀리지 않음. 기기 시간대가 아니라 경도로 지역 자정을 잡음
function sky(date: string, p: Place) {
  const hit = cache.get(key(date, p))
  if (hit) return hit
  const midnight = new Date(Date.parse(`${date}T00:00:00Z`) - (p.lon / 15) * HOUR)
  const obs = new Observer(p.lat, p.lon, 0)
  const sunrise = SearchRiseSet(Body.Sun, obs, 1, midnight, 2)?.date ?? new Date(midnight.getTime() + 6 * HOUR)
  const sunset = SearchRiseSet(Body.Sun, obs, -1, sunrise, 2)?.date ?? new Date(midnight.getTime() + 18 * HOUR)
  // 상카슈티는 저녁에 달이 뜰 때의 티티로 정함
  const moonrise = SearchRiseSet(Body.Moon, obs, 1, new Date(sunset.getTime() - 2 * HOUR), 2)?.date ?? sunset
  const out = {
    sunrise,
    sunset,
    dawn: tithiAt(new Date(sunrise.getTime() - ARUNODAYA)),
    rise: tithiAt(sunrise),
    dusk: tithiAt(new Date(sunset.getTime() + PRADOSH_AFTER_SUNSET)),
    moon: tithiAt(moonrise),
  }
  cache.set(key(date, p), out)
  return out
}

const shift = (date: string, days: number) => new Date(Date.parse(`${date}T00:00:00Z`) + days * 86400e3).toISOString().slice(0, 10)

// 티티는 해를 건너뛰거나 두 번 걸치기도 함. 두 번이면 첫날만, 건너뛰면 그 티티가 지나가는 날로 봄
function falls(tithi: number, prev: number, now: number, next: number) {
  if (now === tithi) return prev !== tithi
  const ahead = (tithi - now + 30) % 30
  return ahead > 0 && ahead < (next - now + 30) % 30
}

// 에카다시가 두 번의 일출에 걸치고 첫날 새벽이 아직 전날 티티라면 다음 날에 지킴
function ekadashi(date: string, p: Place, tithi: number) {
  const a = sky(shift(date, -1), p)
  const b = sky(date, p)
  const c = sky(shift(date, 1), p)
  if (b.rise === tithi && a.rise === tithi) return sky(shift(date, -2), p).rise !== tithi && a.dawn !== tithi
  if (b.rise === tithi && c.rise === tithi && b.dawn !== tithi) return false
  return falls(tithi, a.rise, b.rise, c.rise)
}

export function panchang(date: string, p: Place = DELHI): PanchangDay {
  const a = sky(shift(date, -1), p)
  const b = sky(date, p)
  const c = sky(shift(date, 1), p)
  const rise = (t: number) => falls(t, a.rise, b.rise, c.rise)
  const observances: Observance[] = []
  if (ekadashi(date, p, 11) || ekadashi(date, p, 26)) observances.push('ekadashi')
  if ((b.dusk === 13 && a.dusk !== 13) || (b.dusk === 28 && a.dusk !== 28)) observances.push('pradosh')
  if (b.moon === 19 && a.moon !== 19) observances.push('sankashti')
  if (rise(15)) observances.push('purnima')
  if (rise(30)) observances.push('amavasya')
  return { date, tithi: b.rise, sunrise: b.sunrise, sunset: b.sunset, observances }
}

/** 오늘 이후 다가오는 단식일·기념일 */
export function upcomingDays(date: string, p: Place = DELHI, days = 30) {
  return Array.from({ length: days }, (_, i) => panchang(shift(date, i + 1), p)).filter((d) => d.observances.length)
}
