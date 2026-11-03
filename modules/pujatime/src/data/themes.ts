// 내 신당 컬렉션. 아이템이 아니라 문화와 분위기로 고르게 함.
export type ShrineTheme = 'temple' | 'peacock' | 'lotus' | 'moon' | 'diwali'

export interface ThemeLook {
  id: ShrineTheme
  wall: [string, string]
  bg: string
  pillar: number
}

export const THEMES: ThemeLook[] = [
  { id: 'temple', wall: ['#a3261a', '#7c1610'], bg: '#3a0e08', pillar: 0xa8291c },
  { id: 'peacock', wall: ['#0f6a63', '#0a4744'], bg: '#06282a', pillar: 0x0f5f58 },
  { id: 'lotus', wall: ['#b8386a', '#8c1f4e'], bg: '#3d0d24', pillar: 0xa32a5e },
  { id: 'moon', wall: ['#27357a', '#18224f'], bg: '#0b1030', pillar: 0x2a3880 },
  { id: 'diwali', wall: ['#6a1b7a', '#4a1058'], bg: '#22082c', pillar: 0x7a1f86 },
]

export const themeLook = (id?: ShrineTheme) => THEMES.find((x) => x.id === id) ?? THEMES[0]
