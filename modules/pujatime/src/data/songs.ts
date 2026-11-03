import type { DeityId } from './deities'

export type SongKind = 'aarti' | 'bhajan' | 'stotram' | 'mantra'

// audio는 사용 권리를 확인한 녹음만 넣음. 없으면 화면에 "음원 준비 중"으로 보임
export interface Song {
  title: string
  kind: SongKind
  audio?: string
}

export const SONG_KINDS: SongKind[] = ['aarti', 'bhajan', 'stotram', 'mantra']

// 초기 후보. 신마다 맨 앞 곡이 추천곡이고, 아르티가 있으면 아르티를 앞에 둠
const SONGS: Partial<Record<DeityId, Song[]>> = {
  ganesha: [
    { title: 'Jai Ganesh Jai Ganesh Deva', kind: 'aarti' },
    { title: 'Sukhkarta Dukhharta', kind: 'aarti' },
    { title: 'Vakratunda Mahakaya', kind: 'mantra' },
  ],
  shiva: [
    { title: 'Om Jai Shiv Omkara', kind: 'aarti' },
    { title: 'Shiv Tandav Stotram', kind: 'stotram' },
    { title: 'Om Namah Shivaya', kind: 'mantra' },
  ],
  krishna: [
    { title: 'Aarti Kunj Bihari Ki', kind: 'aarti' },
    { title: 'Achyutam Keshavam', kind: 'bhajan' },
    { title: 'Hare Krishna Maha Mantra', kind: 'mantra' },
  ],
  lakshmi: [
    { title: 'Om Jai Lakshmi Mata', kind: 'aarti' },
    { title: 'Bhagyada Lakshmi Baramma', kind: 'bhajan' },
    { title: 'Om Shreem Mahalakshmiyei Namaha', kind: 'mantra' },
  ],
  vishnu: [
    { title: 'Om Jai Jagdish Hare', kind: 'aarti' },
    { title: 'Vishnu Sahasranama', kind: 'stotram' },
    { title: 'Om Namo Bhagavate Vasudevaya', kind: 'mantra' },
  ],
  durga: [
    { title: 'Jai Ambe Gauri', kind: 'aarti' },
    { title: 'Durga Chalisa', kind: 'stotram' },
    { title: 'Om Dum Durgayei Namaha', kind: 'mantra' },
  ],
  hanuman: [
    { title: 'Aarti Kije Hanuman Lala Ki', kind: 'aarti' },
    { title: 'Hanuman Chalisa', kind: 'stotram' },
    { title: 'Om Hanumate Namah', kind: 'mantra' },
  ],
  rama: [
    { title: 'Shri Ramchandra Kripalu Bhajman', kind: 'bhajan' },
    { title: 'Shri Ram Jai Ram Jai Jai Ram', kind: 'bhajan' },
    { title: 'Om Shri Ramaya Namah', kind: 'mantra' },
  ],
  saraswati: [
    { title: 'Om Jai Saraswati Mata', kind: 'aarti' },
    { title: 'Ya Kundendu Tusharahara Dhavala', kind: 'stotram' },
    { title: 'Om Aim Saraswatyai Namah', kind: 'mantra' },
  ],
  kali: [
    { title: 'Mangal Ki Seva Sun Meri Deva', kind: 'aarti' },
    { title: 'Om Kreem Kalikayai Namah', kind: 'mantra' },
  ],
  parvati: [
    { title: 'Mata Parvati Aarti', kind: 'aarti' },
    { title: 'Uma Maheshwara Stotram', kind: 'stotram' },
    { title: 'Om Parvatyai Namah', kind: 'mantra' },
  ],
  murugan: [
    { title: 'Kanda Sashti Kavasam', kind: 'stotram' },
    { title: 'Thiruppugazh', kind: 'stotram' },
  ],
}

export const songsFor = (id: DeityId) => SONGS[id] ?? []
