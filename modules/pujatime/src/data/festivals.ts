import type { DeityId } from './deities'

// 날짜는 음력 기반이라 매년 직접 갱신해야 함. 지역별로 하루 차이 날 수 있음.
export interface Festival {
  id: string
  name: string
  date: string
  deity: DeityId | null
  meaning: string
  regional: string
  lamps?: boolean
}

export const FESTIVALS: Festival[] = [
  {
    id: 'diwali-2026',
    name: 'Diwali',
    date: '2026-11-08',
    deity: 'lakshmi',
    meaning: 'The festival of lights celebrates light over darkness. Many homes light rows of lamps and welcome Lakshmi.',
    regional: 'In North India it often recalls Rama’s return to Ayodhya. In South India, Krishna’s victory over Narakasura.',
    lamps: true,
  },
  {
    id: 'shivaratri-2027',
    name: 'Maha Shivaratri',
    date: '2027-03-06',
    deity: 'shiva',
    meaning: 'The great night of Shiva, often kept with fasting, chanting, and staying awake in quiet devotion.',
    regional: 'Customs differ widely. Some keep vigil at temples, others mark the night simply at home.',
  },
  {
    id: 'holi-2027',
    name: 'Holi',
    date: '2027-03-22',
    deity: 'krishna',
    meaning: 'The festival of colours welcomes spring and remembers the playful love of Radha and Krishna.',
    regional: 'Bonfires of Holika Dahan come the night before. Vrindavan and Mathura hold their own days of celebration.',
  },
  {
    id: 'ramanavami-2027',
    name: 'Rama Navami',
    date: '2027-04-15',
    deity: 'rama',
    meaning: 'The birth of Rama, kept with reading the Ramayana, song, and temple processions.',
    regional: 'Ayodhya holds the largest celebrations, and many homes mark the day with fasting and kirtan.',
  },
  {
    id: 'janmashtami-2027',
    name: 'Janmashtami',
    date: '2027-08-25',
    deity: 'krishna',
    meaning: 'The birth of Krishna, marked at midnight with song, fasting, and rocking a small cradle.',
    regional: 'In Maharashtra, teams form human pyramids for Dahi Handi. Some traditions observe it a day apart.',
  },
  {
    id: 'ganesh-2027',
    name: 'Ganesh Chaturthi',
    date: '2027-09-04',
    deity: 'ganesha',
    meaning: 'The birth of Ganesha, welcomed home for up to ten days, then farewelled at the water.',
    regional: 'It is especially beloved in Maharashtra, Goa, Karnataka, and Tamil Nadu, and many families keep it at home.',
  },
  {
    id: 'navratri-2027',
    name: 'Navratri',
    date: '2027-10-01',
    deity: 'durga',
    meaning: 'Nine nights honouring the Goddess in her many forms, ending with Vijayadashami.',
    regional: 'Garba in Gujarat, Durga Puja in Bengal, and Golu displays in Tamil Nadu are all ways of keeping these nights.',
  },
  {
    id: 'diwali-2027',
    name: 'Diwali',
    date: '2027-10-29',
    deity: 'lakshmi',
    meaning: 'The festival of lights celebrates light over darkness. Many homes light rows of lamps and welcome Lakshmi.',
    regional: 'In North India it often recalls Rama’s return to Ayodhya. In South India, Krishna’s victory over Narakasura.',
    lamps: true,
  },
]

export const REFLECTIONS = [
  'A small moment of gratitude can change the whole day.',
  'You do not need many words. A quiet heart is enough.',
  'Begin again, as gently as the morning does.',
  'What you tend each day quietly grows.',
  'Let this breath be the only thing you need to do.',
  'Even a small lamp changes a dark room.',
  'Be kind to the person you are today.',
]

export function dayDiff(iso: string, from = new Date()) {
  const [y, m, d] = iso.split('-').map(Number)
  const a = new Date(y, m - 1, d).getTime()
  const b = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime()
  return Math.round((a - b) / 86400000)
}

export const upcoming = (from = new Date()) => FESTIVALS.filter((f) => dayDiff(f.date, from) >= 0)

export function whenLabel(days: number) {
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  return `In ${days} days`
}
