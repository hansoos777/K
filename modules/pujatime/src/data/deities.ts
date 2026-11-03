// 신 데이터. 스프링이었다면 DB 대신 쓰는 정적 마스터 데이터(시드)에 해당.
// 만트라·상징·이야기는 위키백과 등 공개 자료로 교차 확인함. 지역·전통마다 다를 수 있음.

export type DeityId = 'ganesha' | 'shiva' | 'krishna' | 'lakshmi' | 'vishnu' | 'durga' | 'hanuman' | 'rama' | 'saraswati' | 'kali' | 'parvati' | 'murugan' | 'custom'

export interface Deity {
  id: DeityId
  name: string
  devanagari: string
  tagline: string
  keywords: string[]
  intro: string
  symbols: string[]
  story: string
  beginner: string
  mantra: {
    words: { dev: string; latin: string }[]
    meaning: string
  }
}

export const DEITIES: Deity[] = [
  {
    id: 'ganesha',
    name: 'Ganesha',
    devanagari: 'गणेश',
    tagline: 'New beginnings and overcoming obstacles',
    keywords: ['New beginnings', 'Wisdom', 'Overcoming obstacles'],
    intro: 'Ganesha, with the head of an elephant, is widely honoured at the start of journeys, studies, and new work.',
    symbols: ['Goad and noose: guiding the mind and freeing it from attachment', 'Broken tusk: sacrifice, and writing the Mahabharata', 'Modak sweet: the reward of devotion', 'Small mouse: mastery of restless desire'],
    story:
      'In one well-known telling, Parvati shaped a son to guard her door. When Shiva, not knowing him, struck him down, Parvati’s grief moved Shiva to restore the boy with the head of an elephant and to honour him first among the gods.',
    beginner: 'Many families greet Ganesha before anything else. A simple pause and a flower is a gentle place to start.',
    mantra: {
      words: [
        { dev: 'ॐ', latin: 'Om' },
        { dev: 'गं', latin: 'Gam' },
        { dev: 'गणपतये', latin: 'Ganapataye' },
        { dev: 'नमः', latin: 'Namah' },
      ],
      meaning: 'Salutations to Ganapati, lord of the divine hosts.',
    },
  },
  {
    id: 'shiva',
    name: 'Shiva',
    devanagari: 'शिव',
    tagline: 'Transformation, meditation, and inner strength',
    keywords: ['Transformation', 'Meditation', 'Inner strength'],
    intro: 'Shiva is both the still meditator on Mount Kailash and the cosmic dancer whose rhythm ends and renews the world.',
    symbols: ['Trident: creation, preservation, and dissolution', 'Crescent moon and the river Ganga: carried in his matted hair', 'Serpent Vasuki: worn around his neck', 'Damaru drum: the rhythm of his cosmic dance'],
    story:
      'When the ocean of milk was churned, a deadly poison rose and threatened all beings. Shiva drank it, and Parvati held it in his throat, which turned blue. Devotees remember this as compassion that takes on what others cannot bear.',
    beginner: 'Sitting quietly with the breath is a natural way to begin with Shiva. Silence is welcome here.',
    mantra: {
      words: [
        { dev: 'ॐ', latin: 'Om' },
        { dev: 'नमः', latin: 'Namah' },
        { dev: 'शिवाय', latin: 'Shivaya' },
      ],
      meaning: 'Salutations to Shiva, the auspicious one.',
    },
  },
  {
    id: 'krishna',
    name: 'Krishna',
    devanagari: 'कृष्ण',
    tagline: 'Love, devotion, and the wisdom of life',
    keywords: ['Love', 'Devotion', 'Wisdom'],
    intro: 'Krishna is the playful child of Vrindavan, the flute player beloved by all, and the counsellor of the Bhagavad Gita.',
    symbols: ['Flute: the call of the divine to the heart', 'Peacock feather: beauty and joy', 'Butter: the sweetness of pure devotion'],
    story:
      'On the battlefield of Kurukshetra, the warrior Arjuna laid down his bow in despair. Krishna, serving as his charioteer, spoke the teachings now known as the Bhagavad Gita, on duty, devotion, and acting without clinging to the result.',
    beginner: 'Reading one verse of the Gita, or simply remembering someone with love, are both ways people draw near.',
    mantra: {
      words: [
        { dev: 'ॐ', latin: 'Om' },
        { dev: 'नमो', latin: 'Namo' },
        { dev: 'भगवते', latin: 'Bhagavate' },
        { dev: 'वासुदेवाय', latin: 'Vasudevaya' },
      ],
      meaning: 'Salutations to the divine Vasudeva, Krishna.',
    },
  },
  {
    id: 'lakshmi',
    name: 'Lakshmi',
    devanagari: 'लक्ष्मी',
    tagline: 'Abundance and gratitude',
    keywords: ['Prosperity', 'Gratitude', 'Abundance'],
    intro: 'Lakshmi is honoured for wellbeing of every kind: not only wealth, but health, harmony, and a home full of light.',
    symbols: ['Four arms: dharma, artha, kama, and moksha', 'Lotus: purity rising from muddy water', 'Falling coins: wealth, material and spiritual'],
    story:
      'Lakshmi rose from the churning of the cosmic ocean, seated on a lotus, and chose Vishnu as her consort. At Diwali many homes clean their doors and light rows of lamps to welcome her.',
    beginner: 'Naming one thing you are thankful for today is a simple offering to begin with.',
    mantra: {
      words: [
        { dev: 'ॐ', latin: 'Om' },
        { dev: 'श्रीं', latin: 'Shreem' },
        { dev: 'महालक्ष्म्यै', latin: 'Mahalakshmyai' },
        { dev: 'नमः', latin: 'Namah' },
      ],
      meaning: 'Salutations to the great Lakshmi.',
    },
  },
  {
    id: 'vishnu',
    name: 'Vishnu',
    devanagari: 'विष्णु',
    tagline: 'Protection and balance',
    keywords: ['Protection', 'Balance', 'Preservation'],
    intro: 'Vishnu is the preserver who sustains the order of the world, and who, in many traditions, descends in forms such as Rama and Krishna.',
    symbols: ['Conch: the sacred sound', 'Discus: the mind that cuts through ignorance', 'Lotus: unfolding of life'],
    story:
      'Vishnu is often shown resting on the coils of the great serpent upon the cosmic ocean. Whenever balance in the world is lost, it is said, he comes in a new form to restore it.',
    beginner: 'When life feels unsteady, a moment of quiet trust is a good way to meet Vishnu.',
    mantra: {
      words: [
        { dev: 'ॐ', latin: 'Om' },
        { dev: 'नमो', latin: 'Namo' },
        { dev: 'नारायणाय', latin: 'Narayanaya' },
      ],
      meaning: 'Salutations to Narayana, the refuge of all beings.',
    },
  },
  {
    id: 'durga',
    name: 'Durga',
    devanagari: 'दुर्गा',
    tagline: 'Courage and protection',
    keywords: ['Courage', 'Protection', 'Strength'],
    intro: 'Durga rides a lion or tiger and holds a weapon in each of her many arms, her face calm even in battle.',
    symbols: ['Lion or tiger: fearless strength', 'Many arms: the combined powers of the gods', 'Calm face: serenity amid struggle'],
    story:
      'The buffalo demon Mahishasura seized the heavens, protected by a boon that only a woman could slay him. The combined energies of the gods took form as Durga, who overcame him in battle, a victory remembered during Navratri and Durga Puja.',
    beginner: 'When you need courage, you are welcome to simply sit here and ask for it.',
    mantra: {
      words: [
        { dev: 'ॐ', latin: 'Om' },
        { dev: 'दुं', latin: 'Dum' },
        { dev: 'दुर्गायै', latin: 'Durgayai' },
        { dev: 'नमः', latin: 'Namah' },
      ],
      meaning: 'Salutations to Durga.',
    },
  },
  {
    id: 'hanuman',
    name: 'Hanuman',
    devanagari: 'हनुमान',
    tagline: 'Devotion, strength, and courage',
    keywords: ['Devotion', 'Strength', 'Courage'],
    intro: 'Hanuman, the mighty monkey god, is loved as the most devoted servant of Rama and a protector in difficult times.',
    symbols: ['Mace: strength and righteous power', 'Mountain in hand: bringing the healing herbs to Lakshmana', 'Open chest: Rama and Sita held in his heart'],
    story: 'When Lakshmana lay wounded in the war with Ravana, Hanuman flew to the Himalayas for a healing herb. Unsure which plant it was, he carried back the whole mountain. Devotees remember him as strength given entirely to love.',
    beginner: 'Many people remember Hanuman on Tuesdays and Saturdays. Calling his name when you feel afraid is a simple way to begin.',
    mantra: {
      words: [
        { dev: 'ॐ', latin: 'Om' },
        { dev: 'हं', latin: 'Ham' },
        { dev: 'हनुमते', latin: 'Hanumate' },
        { dev: 'नमः', latin: 'Namah' },
      ],
      meaning: 'Salutations to Hanuman.',
    },
  },
  {
    id: 'rama',
    name: 'Rama',
    devanagari: 'राम',
    tagline: 'Righteousness and duty',
    keywords: ['Righteousness', 'Duty', 'Honour'],
    intro: 'Rama, prince of Ayodhya and hero of the Ramayana, is honoured as an avatar of Vishnu and a model of a life lived by dharma.',
    symbols: ['Bow and arrow: readiness to protect what is right', 'Sita, Lakshmana, and Hanuman: love and loyalty around him', 'Royal crown: the just ruler'],
    story: 'Rama accepted fourteen years of exile to keep his father\'s word. When the demon king Ravana took Sita to Lanka, Rama crossed the sea with Hanuman and an army of allies and defeated him. Diwali in many regions recalls his return to Ayodhya.',
    beginner: 'Quietly repeating the name of Rama is one of the simplest and most loved practices.',
    mantra: {
      words: [
        { dev: 'श्री', latin: 'Shri' },
        { dev: 'राम', latin: 'Ram' },
        { dev: 'जय', latin: 'Jai' },
        { dev: 'राम', latin: 'Ram' },
        { dev: 'जय', latin: 'Jai' },
        { dev: 'जय', latin: 'Jai' },
        { dev: 'राम', latin: 'Ram' },
      ],
      meaning: 'Victory to Lord Rama, victory, victory.',
    },
  },
  {
    id: 'saraswati',
    name: 'Saraswati',
    devanagari: 'सरस्वती',
    tagline: 'Knowledge, music, and the arts',
    keywords: ['Knowledge', 'Music', 'Wisdom'],
    intro: 'Saraswati, dressed in white and seated on a lotus, is honoured by students, musicians, and artists.',
    symbols: ['Veena: music and the arts', 'Book: knowledge', 'White swan: telling truth from illusion'],
    story: 'Saraswati is remembered as the goddess of speech and learning. On Vasant Panchami, many students place their books and instruments before her and ask for a clear mind.',
    beginner: 'Before studying or creating, pause for a moment and ask for a clear mind.',
    mantra: {
      words: [
        { dev: 'ॐ', latin: 'Om' },
        { dev: 'ऐं', latin: 'Aim' },
        { dev: 'सरस्वत्यै', latin: 'Saraswatyai' },
        { dev: 'नमः', latin: 'Namah' },
      ],
      meaning: 'Salutations to Saraswati.',
    },
  },
  {
    id: 'kali',
    name: 'Kali',
    devanagari: 'काली',
    tagline: 'Fierce protection and liberation',
    keywords: ['Protection', 'Liberation', 'Fearlessness'],
    intro: 'Kali is the fierce form of the Goddess, loved by many devotees as a mother who destroys fear and ego.',
    symbols: ['Dark skin: the boundless night beyond form', 'Sword: cutting through ego', 'Fierce face: a mother\'s protective love'],
    story: 'In the battle against the demon Raktabija, every drop of his blood that fell became a new demon. Kali arose and drank the blood before it touched the ground, so he could be defeated.',
    beginner: 'Her fierce image can feel surprising. Many devotees simply call her Ma, Mother.',
    mantra: {
      words: [
        { dev: 'ॐ', latin: 'Om' },
        { dev: 'क्रीं', latin: 'Kreem' },
        { dev: 'कालिकायै', latin: 'Kalikayai' },
        { dev: 'नमः', latin: 'Namah' },
      ],
      meaning: 'Salutations to Kali.',
    },
  },
  {
    id: 'parvati',
    name: 'Parvati',
    devanagari: 'पार्वती',
    tagline: 'Devotion, family, and gentle strength',
    keywords: ['Devotion', 'Family', 'Gentle strength'],
    intro: 'Parvati, daughter of the mountains, is the consort of Shiva and the mother of Ganesha and Murugan.',
    symbols: ['Lotus: purity and grace', 'Raised hand: blessing and protection', 'Lion: the strength within her gentleness'],
    story: 'Parvati set her heart on Shiva, who sat lost in meditation. Through long and steadfast austerities she won him, and the mountain daughter and the great ascetic became the divine couple honoured in countless homes.',
    beginner: 'Many people turn to Parvati with prayers for family and marriage. A quiet thought for someone you love is a good start.',
    mantra: {
      words: [
        { dev: 'ॐ', latin: 'Om' },
        { dev: 'पार्वत्यै', latin: 'Parvatyai' },
        { dev: 'नमः', latin: 'Namah' },
      ],
      meaning: 'Salutations to Parvati.',
    },
  },
  {
    id: 'murugan',
    name: 'Murugan',
    devanagari: 'मुरुगन',
    tagline: 'Courage, youth, and victory',
    keywords: ['Courage', 'Wisdom', 'Victory'],
    intro: 'Murugan, also called Kartikeya and Skanda, is the son of Shiva and Parvati, and is especially loved in Tamil tradition.',
    symbols: ['Vel spear: wisdom that pierces ignorance', 'Peacock: pride brought under control', 'Youthful form: energy that never fades'],
    story: 'Born to lead the army of the gods, Murugan received the Vel from his mother Parvati and defeated the demon Surapadman. Thaipusam and Skanda Shashti remember him with devotion across South India and beyond.',
    beginner: 'In Tamil homes a simple call of "Vel Vel" is a loved way to remember him.',
    mantra: {
      words: [
        { dev: 'ॐ', latin: 'Om' },
        { dev: 'शरवणभवाय', latin: 'Saravanabhavaya' },
        { dev: 'नमः', latin: 'Namah' },
      ],
      meaning: 'Salutations to Murugan, born in the forest of reeds.',
    },
  },
]

// 목록에 없는 신을 모실 때 쓰는 자리. 이름과 사진은 사용자가 정하고 만트라는 옴을 씀.
const CUSTOM: Deity = {
  id: 'custom',
  name: 'My deity',
  devanagari: 'ॐ',
  tagline: '',
  keywords: [],
  intro: '',
  symbols: [],
  story: '',
  beginner: '',
  mantra: { words: [{ dev: 'ॐ', latin: 'Om' }], meaning: 'Om, the sacred sound at the heart of many Hindu prayers.' },
}

export const deityById = (id: DeityId) => (id === 'custom' ? CUSTOM : DEITIES.find((d) => d.id === id)!)

// "I'm not sure" 질문. 추천은 강요하지 않고 제안만 함.
export const EXPLORE_REASONS: { label: string; deity: DeityId | null; line: string }[] = [
  { label: 'I am starting something new', deity: 'ganesha', line: 'You may enjoy learning about Ganesha, who is widely associated with new beginnings.' },
  { label: 'I need peace', deity: 'shiva', line: 'You may enjoy learning about Shiva, often pictured in deep, still meditation.' },
  { label: 'I seek courage', deity: 'durga', line: 'You may enjoy learning about Durga, who is honoured for courage and protection.' },
  { label: 'I want to express gratitude', deity: 'lakshmi', line: 'You may enjoy learning about Lakshmi, often remembered with thankfulness.' },
  { label: 'I want to learn more', deity: null, line: 'Take your time. Every card below opens a short introduction.' },
]
