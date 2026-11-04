/** 선 아이콘 모음 (외부 아이콘 폰트 없이 인라인 SVG) */
const P: Record<string, string> = {
  back: 'M15 5l-7 7 7 7',
  star: 'M12 3.5l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L3.4 9.8l6-.7z',
  info: 'M12 8h.01M11 12h1v5h1M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  candle: 'M12 3c1.6 2 1.6 3.6 0 5-1.6-1.4-1.6-3 0-5zM9.5 10h5v10h-5zM7 21h10',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0M12 3v2',
  beads: 'M12 3a2 2 0 1 0 .01 0M6.5 6a2 2 0 1 0 .01 0M17.5 6a2 2 0 1 0 .01 0M4.5 12a2 2 0 1 0 .01 0M19.5 12a2 2 0 1 0 .01 0M7 17.5a2 2 0 1 0 .01 0M17 17.5a2 2 0 1 0 .01 0M12 18v3',
  book: 'M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1zM12 6v14',
  music: 'M9 18V5l11-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  pray: 'M12 3c-1.5 3-3 6-3 10v6h6v-6c0-4-1.5-7-3-10zM12 3v16',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  path: 'M5 21c0-6 14-4 14-10 0-3-3-5-7-5M12 6l-2-2 2-2',
  lotus: 'M12 20c-4 0-8-2-9-6 3 0 6 1 9 4 3-3 6-4 9-4-1 4-5 6-9 6zM12 18c-2-3-2-7 0-11 2 4 2 8 0 11z',
  lantern: 'M9 4h6M12 2v2M7 8c0-2 2-4 5-4s5 2 5 4v6c0 2-2 4-5 4s-5-2-5-4zM10 18v3h4v-3',
  incense: 'M8 21h8M10 21V9M14 21V9M10 7c-1-2 1-3 0-5M14 7c1-2-1-3 0-5',
  breath: 'M12 4a8 8 0 1 0 .01 0M12 8a4 4 0 1 0 .01 0',
  wind: 'M3 9h12a3 3 0 1 0-3-3M3 15h16a3 3 0 1 1-3 3M3 12h9',
  note: 'M5 4h10l4 4v12H5zM14 4v5h5M8 13h8M8 17h5',
  door: 'M6 21V5a6 6 0 0 1 12 0v16M4 21h16M14 13h.01',
  diya: 'M4 14c2 4 14 4 16 0zM12 6c1.4 1.8 1.4 3.4 0 5-1.4-1.6-1.4-3.2 0-5z',
  sound: 'M4 10v4h4l5 4V6L8 10zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11',
  mute: 'M4 10v4h4l5 4V6L8 10zM17 9l5 6M22 9l-5 6',
  close: 'M6 6l12 12M18 6L6 18',
  cross: 'M12 3v18M7 8h10',
  gear: 'M12 9a3 3 0 1 0 .01 0M19 12l2-1-1-3-2 .3-1.5-1.5L17 4l-3-1-1 2h-2L10 3 7 4l.5 2.3L6 7.8 4 7.5 3 10.5 5 12l-2 1.5 1 3 2-.3 1.5 1.5L7 20l3 1 1-2h2l1 2 3-1-.5-2.3 1.5-1.5 2 .3 1-3z',
  search: 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4',
  chev: 'M9 5l7 7-7 7',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1-4 4-6 8-6s7 2 8 6',
  home: 'M4 11l8-7 8 7v9H4zM10 20v-5h4v5',
  arch: 'M5 21V10a7 7 0 0 1 14 0v11M9 21v-9a3 3 0 0 1 6 0v9M3 21h18',
  globe: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18',
  list: 'M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01',
  check: 'M5 12l5 5 9-10',
  compass: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z',
}
export type IconName = keyof typeof P

export function Icon({ name, size = 22 }: { name: IconName; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={P[name]} />
    </svg>
  )
}
