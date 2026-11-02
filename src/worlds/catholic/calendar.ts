/**
 * 가톨릭 전례력: 부활절 날짜를 계산(그레고리력 Computus)해 시기를 구한다.
 * 외부 API 없이 기기에서 계산. 한국 주교회의가 옮겨 지내는 축일은 단순화했다.
 */
export type Season = 'advent' | 'christmas' | 'lent' | 'triduum' | 'easter' | 'ordinary'
export type Color = 'purple' | 'white' | 'green' | 'red'

const day = 86400000
const d = (y: number, m: number, dd: number) => new Date(y, m - 1, dd)
const add = (x: Date, n: number) => new Date(x.getTime() + n * day)
const strip = (x: Date) => new Date(x.getFullYear(), x.getMonth(), x.getDate())

export function easter(y: number): Date {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100
  const dd = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - dd - g + 15) % 30
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const dayN = ((h + l - 7 * m + 114) % 31) + 1
  return d(y, month, dayN)
}

/** 대림 제1주일: 성탄 전 네 번째 주일 */
export function adventStart(y: number) {
  const xmas = d(y, 12, 25)
  const back = xmas.getDay() === 0 ? 7 : xmas.getDay()
  return add(xmas, -back - 21)
}

/** 주님 세례 축일: 1월 6일 다음 주일 (간단화) */
function baptism(y: number) {
  const jan6 = d(y, 1, 6)
  return add(jan6, 7 - jan6.getDay())
}

export function seasonOf(now = new Date()): { season: Season; color: Color } {
  const t = strip(now)
  const y = t.getFullYear()
  const e = easter(y)
  const ash = add(e, -46)
  const holyThu = add(e, -3)
  const pentecost = add(e, 49)
  if (t >= adventStart(y) && t < d(y, 12, 25)) return { season: 'advent', color: 'purple' }
  if (t >= d(y, 12, 25) || t <= baptism(y)) return { season: 'christmas', color: 'white' }
  if (t >= ash && t < holyThu) return { season: 'lent', color: 'purple' }
  if (t >= holyThu && t < e) return { season: 'triduum', color: t.getTime() === add(e, -2).getTime() ? 'red' : 'white' } // 성금요일만 홍색
  if (t >= e && t <= pentecost) return { season: 'easter', color: t.getTime() === pentecost.getTime() ? 'red' : 'white' }
  return { season: 'ordinary', color: 'green' }
}

export interface Feast { date: Date; key: string }

/** 올해와 내년의 주요 대축일 (가까운 순) */
export function upcoming(now = new Date(), n = 5): Feast[] {
  const t = strip(now)
  const list: Feast[] = []
  for (const y of [t.getFullYear(), t.getFullYear() + 1]) {
    const e = easter(y)
    list.push(
      { date: d(y, 1, 1), key: 'mary' },
      { date: add(e, -46), key: 'ash' },
      { date: d(y, 3, 19), key: 'joseph' },
      { date: e, key: 'easter' },
      { date: add(e, 49), key: 'pentecost' },
      { date: d(y, 6, 29), key: 'peterpaul' },
      { date: d(y, 8, 15), key: 'assumption' },
      { date: d(y, 9, 20), key: 'koreanMartyrs' },
      { date: d(y, 11, 1), key: 'allSaints' },
      { date: d(y, 11, 2), key: 'allSouls' },
      { date: adventStart(y), key: 'advent' },
      { date: d(y, 12, 8), key: 'immaculate' },
      { date: d(y, 12, 25), key: 'christmas' },
    )
  }
  return list.filter((f) => f.date >= t).sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, n)
}

/** 묵주기도 요일별 신비: 월·토 환희, 화·금 고통, 수·일 영광, 목 빛 */
export function mysteryOf(now = new Date()): 'joyful' | 'sorrowful' | 'glorious' | 'luminous' {
  return (['glorious', 'joyful', 'sorrowful', 'glorious', 'luminous', 'sorrowful', 'joyful'] as const)[now.getDay()]
}
