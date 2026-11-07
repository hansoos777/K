// 스테이지 모드 맵. 차례대로 깨야 다음 맵이 열린다.
// waves: 웨이브마다 [벌레 종류, 마리 수] (개미는 한 줄로 n마리)
// boss: 마지막에 나오는 보스. minion은 맞을 때 튀어나오는 졸개
// 보스는 3초 동안 안 맞으면 체력이 조금씩 다시 찬다(초당 최대 체력의 4%)
export const HEARTS = 5
export const MAPS = [
  {
    id: 'home', name: '거실 바닥', bg: 'floor',
    desc: '익숙한 우리 집 거실. 몸풀기로 시작해요.',
    tip: '도망가는 벌레가 생기면 하트가 줄어요. 하트 5개를 다 잃으면 실패!',
    waves: [[['roach', 3], ['ant', 8]], [['fly', 3], ['mosquito', 2], ['roach', 3]], [['roach', 6], ['spider', 2]]],
    boss: { type: 'roach', name: '왕바퀴', hp: 30, scale: 2.6, minion: 'roach', chance: 0.5, n: 1 },
  },
  {
    id: 'sewer', name: '하수구', bg: 'sewer',
    desc: '축축하고 냄새나는 하수구. 바퀴벌레가 떼로 살아요.',
    tip: '물길 위로도 벌레가 달려요. 바퀴벌레 떼에는 두꺼운 책이나 화염방사기!',
    waves: [[['roach', 6]], [['roach', 5], ['centipede', 1], ['fly', 3]], [['roach', 10], ['centipede', 2]]],
    boss: { type: 'centipede', name: '대왕 지네', hp: 42, scale: 1.7, minion: 'roach', chance: 0.6, n: 1 },
  },
  {
    id: 'ruin', name: '폐건물', bg: 'ruin',
    desc: '불 꺼진 폐건물. 손가락 근처만 밝아요. 천장에서 거미가 내려와요.',
    tip: '어두우니까 손가락으로 화면을 훑으며 비춰 보세요. 불은 어둠 속에서도 밝아요.',
    waves: [[['spider', 4], ['roach', 3]], [['mosquito', 4], ['spider', 3], ['centipede', 1]], [['spider', 6], ['roach', 6]]],
    boss: { type: 'spider', name: '엄마 거미', hp: 36, scale: 2.4, minion: 'spider', minionScale: 0.55, chance: 0.8, n: 2, dangle: true },
  },
  {
    id: 'jungle', name: '밀림', bg: 'jungle',
    desc: '모기와 개미의 천국. 낙엽 사이로 지네가 기어 다녀요.',
    tip: '모기는 사람 쪽으로 몰려와요. 전기채를 들고 기다리면 알아서 지져져요.',
    waves: [[['mosquito', 6], ['ant', 12]], [['ant', 15], ['spider', 3], ['centipede', 2]], [['mosquito', 8], ['fly', 4], ['centipede', 2]]],
    boss: { type: 'mosquito', name: '모기 여왕', hp: 28, scale: 3.2, minion: 'mosquito', chance: 0.7, n: 2 },
  },
  {
    id: 'nest', name: '벌레 소굴', bg: 'nest',
    desc: '모든 벌레가 태어나는 곳. 마지막 보스가 기다려요.',
    tip: '마지막 맵이에요. 바퀴 황제는 맞을 때마다 새끼를 낳아요. 망치로 끝내세요!',
    waves: [[['roach', 8], ['spider', 4]], [['centipede', 3], ['mosquito', 6], ['fly', 4]], [['roach', 14], ['spider', 4], ['centipede', 2]]],
    boss: { type: 'roach', name: '바퀴 황제', hp: 70, scale: 3.4, minion: 'roach', chance: 0.7, n: 2 },
  },
]
