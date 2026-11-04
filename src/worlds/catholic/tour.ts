import type { Gesture, SpotInfo, TourStep } from '../../ui/Space'
interface Pack { gestures: Gesture[]; spots: Record<string, SpotInfo>; tour: TourStep[] }
const ko: Pack = {
  gestures: [
    { id: 'pray', label: '기도하기', pose: 'pray', note: '두 손을 모아 기도합니다' },
  ],
  spots: {
    font: { label: '성수대', text: '성당에 들어서며 성수를 찍어 십자성호를 긋습니다.' },
    nave: { label: '신자석', text: '신자들이 미사에 참례하는 자리입니다.' },
    altar: { label: '제대', text: '미사의 중심. 그 위에 십자고상이 걸려 있습니다.' },
    votive: { label: '봉헌초', text: '초를 밝히며 마음속 지향을 봉헌합니다.', action: 'candle' },
    station: { label: '십자가의 길', text: '벽을 따라 걸린 14처에서 예수의 수난을 묵상합니다.', action: 'way' },
    rack: { label: '봉헌초', text: '초를 밝혀 보세요.', action: 'candle' },
    tabernacle: { label: '감실과 감실등', text: '성체를 모신 감실. 붉은 감실등이 늘 켜져 있습니다.' },
    heart: { label: '예수 성심상', text: '사랑으로 불타는 예수님의 마음(성심)을 표현한 상입니다. 제대 중심의 십자고상과 달리 성당 측면에 모십니다.' },
    mary: { label: '성모 제대', text: '예수님의 어머니 마리아께 전구를 청하며 기도하는 곳입니다.', action: 'candle' },
  },
  tour: [
    { title: '대성당에 오신 것을 환영합니다', text: '이곳은 교구장 주교의 의자가 있는 주교좌 성당을 본떴습니다. 높은 천장과 스테인드글라스가 하느님께 향하는 마음을 표현합니다.' },
    { title: '걷는 법', text: '왼쪽 아래 조이스틱이나 바닥을 눌러 걷고, 화면을 끌어 둘러보세요.' },
    { title: '성수대', text: '입구 쪽 빛 기둥까지 걸어가 보세요. 신자는 여기서 성수로 십자성호를 긋습니다.', spot: 'font' },
    { title: '가운데 통로로', text: '장의자 사이 통로를 따라 앞으로 걸어가 보세요.', spot: 'nave' },
    { title: '제대와 감실', text: '앞쪽 제대 가까이 가 보세요. 오른쪽 "기도하기"로 잠시 기도할 수 있어요.', action: 'pray' },
    { title: '촛불 봉헌', text: '"촛불 봉헌"을 누르면 측랑의 봉헌초로 가서 초를 밝힙니다.', action: 'candle' },
    { title: '십자가의 길', text: '"십자가의 길"을 눌러 14처를 하나씩 묵상해 보세요.', action: 'way' },
    { title: '더 해 보기', text: '성모 동산에서는 묵주기도를, 본당에서는 미사의 흐름과 전례력을 볼 수 있어요.' },
  ],
}
const en: Pack = {
  gestures: [
    { id: 'pray', label: 'Pray', pose: 'pray', note: 'Hands joined in prayer' },
  ],
  spots: {
    font: { label: 'Holy water font', text: 'On entering, the faithful make the sign of the cross with holy water.' },
    nave: { label: 'The nave', text: 'Where the faithful take part in Mass.' },
    altar: { label: 'The altar', text: 'The centre of the Mass, beneath the crucifix.' },
    votive: { label: 'Votive candles', text: 'Light a candle and offer your intention.', action: 'candle' },
    station: { label: 'Stations of the Cross', text: 'Reflect on the Passion at 14 stations.', action: 'way' },
    rack: { label: 'Votive candles', text: 'Light a candle.', action: 'candle' },
    tabernacle: { label: 'Tabernacle and lamp', text: 'Holds the Blessed Sacrament; the red lamp is always lit.' },
    heart: { label: 'Sacred Heart of Jesus', text: 'The heart of Jesus burning with love. Kept at the side, while the crucifix stands at the altar.' },
    mary: { label: 'Marian altar', text: 'Where people ask Mary\'s intercession in prayer.', action: 'candle' },
  },
  tour: [
    { title: 'Welcome to the cathedral', text: 'Modelled on a bishop\'s cathedral: high vaults and stained glass lift the heart to God.' },
    { title: 'How to walk', text: 'Use the joystick or tap the floor; drag to look around.' },
    { title: 'Holy water', text: 'Walk to the light by the entrance, where the faithful bless themselves.', spot: 'font' },
    { title: 'Down the aisle', text: 'Walk forward along the centre aisle.', spot: 'nave' },
    { title: 'Altar and tabernacle', text: 'Approach the altar. Tap "Pray" on the right for a moment of prayer.', action: 'pray' },
    { title: 'Light a candle', text: 'Tap "Light a candle" to walk to the votive stand.', action: 'candle' },
    { title: 'Stations of the Cross', text: 'Tap "Stations of the Cross" and reflect on each.', action: 'way' },
    { title: 'Go further', text: 'Pray the Rosary at the grotto, or see the Mass and calendar in the parish.' },
  ],
}
export default { ko, en }
