import type { Gesture, SpotInfo, TourStep } from '../../ui/Space'
interface Pack { gestures: Gesture[]; spots: Record<string, SpotInfo>; tour: TourStep[] }
const ko: Pack = {
  gestures: [{ id: 'pray', label: '🙏 기도하기', pose: 'pray', note: '눈을 감고 두 손을 모아 기도합니다' }],
  spots: {
    entrance: { label: '예배당 입구', text: '예배 중에는 휴대전화를 무음으로 하고 조용히 들어갑니다.' },
    pews: { label: '장의자', text: '예배하는 사람들이 앉는 긴 의자입니다.' },
    pulpit: { label: '강단과 강대상', text: '말씀(설교)을 전하는 곳. 개신교 예배의 중심입니다.' },
    organ: { label: '성가대와 오르간', text: '찬송으로 예배를 돕습니다.', action: 'hymn' },
    stage: { label: '예배 무대', text: '찬양팀이 예배 음악을 이끄는 곳입니다.', action: 'pad' },
    table: { label: '기도 탁자', text: '성경과 촛불 앞에서 조용히 기도합니다.', action: 'silent' },
  },
  tour: [
    { title: '교회에 오신 것을 환영합니다', text: '개신교 교회는 말씀(설교)과 찬송, 기도를 중심으로 예배합니다.' },
    { title: '걷는 법', text: '왼쪽 아래 조이스틱이나 바닥을 눌러 걷고, 화면을 끌어 둘러보세요.' },
    { title: '자리로', text: '장의자 사이 통로를 따라 걸어가 보세요.', spot: 'pews' },
    { title: '강단', text: '앞의 강단 가까이 가 보세요. 이곳에서 설교가 전해집니다.', spot: 'pulpit' },
    { title: '찬송', text: '"찬송가"를 눌러 1551년부터 불러 온 옛 시편 찬송을 들어 보세요.', action: 'hymn' },
    { title: '기도', text: '오른쪽 "기도하기"를 눌러 잠시 기도해 보세요.', action: 'pray' },
    { title: '더 해 보기', text: '기도실에서는 침묵 기도와 기도 노트, 말씀 묵상을 할 수 있어요.' },
  ],
}
const en: Pack = {
  gestures: [{ id: 'pray', label: '🙏 Pray', pose: 'pray', note: 'Eyes closed, hands joined in prayer' }],
  spots: {
    entrance: { label: 'Entrance', text: 'Silence your phone and enter quietly during worship.' },
    pews: { label: 'Pews', text: 'Where the congregation sits.' },
    pulpit: { label: 'Pulpit', text: 'Where the sermon is preached — the heart of Protestant worship.' },
    organ: { label: 'Choir and organ', text: 'Hymns lead the worship.', action: 'hymn' },
    stage: { label: 'Worship stage', text: 'Where the band leads worship.', action: 'pad' },
    table: { label: 'Prayer table', text: 'Pray quietly before the Bible and candle.', action: 'silent' },
  },
  tour: [
    { title: 'Welcome to the church', text: 'Protestant worship centres on the Word, hymns and prayer.' },
    { title: 'How to walk', text: 'Use the joystick or tap the floor; drag to look around.' },
    { title: 'Take a seat', text: 'Walk down the aisle between the pews.', spot: 'pews' },
    { title: 'The pulpit', text: 'Approach the pulpit, where the sermon is given.', spot: 'pulpit' },
    { title: 'A hymn', text: 'Tap "Hymn" to hear OLD HUNDREDTH, sung since 1551.', action: 'hymn' },
    { title: 'Prayer', text: 'Tap "Pray" on the right for a moment of prayer.', action: 'pray' },
    { title: 'Go further', text: 'The prayer room offers silent prayer, notes and Scripture reflection.' },
  ],
}
export default { ko, en }
