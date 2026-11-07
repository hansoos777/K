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
  settings: { sound: true, vibe: true, style: 2, bg: 'floor', auto: true, diff: 2 },
  score: 0, combo: 0, lastKill: -9, bestCombo: 0, kills: 0, swings: 0, hits: 0, missed: 0,
  killsBy: {},
  pointer: { x: -1, y: -1, has: false },
  weapon: 'palm',
  // main.js가 채우는 함수들
  strike: null, warn: null, onKill: null, onEscape: null,
}

/** 난이도 하·중·상
 * speed: 벌레 속도 · pad: 맞았다고 쳐 주는 여유 · dodge: 피하는 확률 · haz: 불·살충제 세기
 * life: 60초 도전에서 도망가기 전까지 버티는 시간 · score: 점수 배율
 * precise: 상은 몸통 한가운데를 맞혀야 죽는다(빗맞으면 다치기만 함) */
export const DIFF = {
  1: { name: '하', speed: 0.7, pad: 1.35, dodge: 0.4, haz: 1.35, life: 1.35, score: 0.8, precise: false },
  2: { name: '중', speed: 1, pad: 1, dodge: 1, haz: 1, life: 1, score: 1, precise: false },
  3: { name: '상', speed: 1.5, pad: 0.6, dodge: 1.7, haz: 0.6, life: 0.75, score: 1.5, precise: true },
}
export const diff = () => DIFF[G.settings.diff] || DIFF[2]
