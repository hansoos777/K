import type { DeityId } from './deities'

// 베다·전통 기도문 모음. 수천 년 전 경전이라 저작권이 없음. 뜻은 i18n 사전에서 언어별로 가져옴.
export interface Prayer {
  id: string
  deity: DeityId | null
  dev: string
  latin: string
  audio?: string
}

export const LIBRARY: Prayer[] = [
  {
    id: 'gayatri',
    deity: null,
    audio: '/audio/gayatri.mp3',
    dev: 'ॐ भूर्भुवः स्वः\nतत्सवितुर्वरेण्यं\nभर्गो देवस्य धीमहि\nधियो यो नः प्रचोदयात्',
    latin: 'Om bhur bhuvah svah\ntat savitur varenyam\nbhargo devasya dhimahi\ndhiyo yo nah prachodayat',
  },
  {
    id: 'vakratunda',
    deity: 'ganesha',
    dev: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा',
    latin: 'Vakratunda mahakaya suryakoti samaprabha\nnirvighnam kuru me deva sarvakaryeshu sarvada',
  },
  {
    id: 'mrityunjaya',
    deity: 'shiva',
    dev: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्\nउर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय माऽमृतात्',
    latin: 'Om tryambakam yajamahe sugandhim pushtivardhanam\nurvarukamiva bandhanan mrityor mukshiya mamritat',
  },
  {
    id: 'mahamantra',
    deity: 'krishna',
    dev: 'हरे कृष्ण हरे कृष्ण कृष्ण कृष्ण हरे हरे\nहरे राम हरे राम राम राम हरे हरे',
    latin: 'Hare Krishna Hare Krishna Krishna Krishna Hare Hare\nHare Rama Hare Rama Rama Rama Hare Hare',
  },
  {
    id: 'lakshmi',
    deity: 'lakshmi',
    dev: 'या देवी सर्वभूतेषु लक्ष्मीरूपेण संस्थिता\nनमस्तस्यै नमस्तस्यै नमस्तस्यै नमो नमः',
    latin: 'Ya devi sarvabhuteshu lakshmi rupena samsthita\nnamastasyai namastasyai namastasyai namo namah',
  },
  {
    id: 'mangalam',
    deity: 'vishnu',
    dev: 'मङ्गलं भगवान् विष्णुः मङ्गलं गरुडध्वजः\nमङ्गलं पुण्डरीकाक्षः मङ्गलाय तनो हरिः',
    latin: 'Mangalam bhagavan vishnuh mangalam garudadhvajah\nmangalam pundarikakshah mangalaya tano harih',
  },
  {
    id: 'sarvamangala',
    deity: 'durga',
    dev: 'सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते',
    latin: 'Sarva mangala mangalye shive sarvartha sadhike\nsharanye tryambake gauri narayani namostu te',
  },
  {
    id: 'shanti',
    deity: null,
    dev: 'सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः\nसर्वे भद्राणि पश्यन्तु मा कश्चिद्दुःखभाग्भवेत्\nॐ शान्तिः शान्तिः शान्तिः',
    latin: 'Sarve bhavantu sukhinah sarve santu niramayah\nsarve bhadrani pashyantu ma kashchid duhkha bhag bhavet\nOm shantih shantih shantih',
  },
]

// 요일별로 많이 찾는 신. 일요일은 수리야의 날이라 아직 표시하지 않음.
export const WEEKDAY_DEITY: (DeityId | null)[] = [null, 'shiva', 'durga', 'ganesha', 'vishnu', 'lakshmi', 'hanuman']
