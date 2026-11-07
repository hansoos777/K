// 게임 전체가 함께 쓰는 상태 하나. 모듈끼리 서로 import하지 않고 여기로 주고받는다.
export const G = {
  W: 0, H: 0, dpr: 1, U: 4,          // U = 화면 짧은 변의 1%
  area: { x0: 0, y0: 0, x1: 0, y1: 0 }, // 벌레가 돌아다니는 칸(위 HUD·아래 무기칸 제외)
  t: 0,
  ctx: {},                            // bg, decal, main, glass 캔버스 컨텍스트
  bugs: [], parts: [], fire: [], mist: [], fxs: [], pops: [], grounds: [], arcs: [],
  shake: 0, flash: 0,
  state: 'menu',                      // menu | play | paused | result | intro
  mode: 'free',                       // free | challenge | course
  style: 2,                           // 1 귀여움 · 2 만화 · 3 리얼
  settings: { sound: true, vibe: true, style: 2, bg: 'floor', auto: true },
  score: 0, combo: 0, lastKill: -9, bestCombo: 0, kills: 0, swings: 0, hits: 0, missed: 0,
  killsBy: {},
  pointer: { x: -1, y: -1, has: false },
  weapon: 'palm',
  // main.js가 채우는 함수들
  strike: null, warn: null, onKill: null, onEscape: null,
}
