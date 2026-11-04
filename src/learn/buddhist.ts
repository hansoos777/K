import type { LearnPack } from './types'

// 강의 본문: 사용자 제공 「실제 학습 본문 초안」(p1~p4) + 보강 강의. discover는 LEVEL 1 발견하기(질문형 짧은 글). 게시 전 전문가 검수 필요.
const pack: LearnPack = {
  "ko": {
    "title": "불교",
    "sub": "깨달음의 길 · 불법승 삼보",
    "intro": "불교는 기원전 5세기 무렵 인도에서 싯다르타 고타마가 깨달음을 얻어 붓다(깨달은 이)가 된 뒤 전한 가르침에서 시작했습니다. 남방의 상좌부, 동아시아의 대승, 티베트의 금강승으로 퍼졌고, 한국에는 4세기 고구려 때(372년) 전해져 1,600년 넘게 이어지고 있습니다.",
    "start": {
      "title": "처음 법당에 가 보기",
      "text": "대웅전에 들어가 합장하고, 향을 올리고, 삼배를 드리며 법당 예절을 배우는 안내입니다.",
      "place": "daeung"
    },
    "lessons": [
      {
        "id": "p1",
        "title": "붓다의 생애와 불교의 시작",
        "goal": "불교의 역사적 배경과 붓다의 출가·깨달음 전승을 이해한다.",
        "body": [
          "불교는 대체로 기원전 5세기 무렵 고대 인도 북부에서 활동한 붓다의 가르침을 중심으로 형성되었다. 전승에 따르면 붓다의 본명은 싯다르타 고타마이며, 그는 늙음·병듦·죽음과 삶의 불안정성을 성찰했다.",
          "전통적인 생애 이야기에서 싯다르타는 왕족의 안락한 삶을 떠나 출가했고 여러 수행을 경험했다. 극단적인 고행만으로는 해탈에 이르기 어렵다고 보고 쾌락과 고행의 양극단을 피하는 중도의 길을 깨달았다고 전해진다.",
          "붓다는 보리수 아래에서 깨달음을 얻은 뒤 사르나트에서 첫 설법을 했다고 전승된다. 이 설법은 사성제와 팔정도의 가르침으로 요약되며 초기 제자들과 승가 공동체가 형성되는 계기가 되었다. 생애 자료는 경전 전승과 후대 전기 문헌에 담겨 있으므로 종교적 전승과 현대 역사 연구를 구분해 읽어야 한다."
        ],
        "termDefs": [
          {
            "term": "붓다",
            "def": "깨달은 이."
          },
          {
            "term": "출가",
            "def": "세속적 삶을 떠나 수행자의 길에 들어서는 것."
          },
          {
            "term": "중도",
            "def": "쾌락과 극단적 고행을 피하는 길."
          },
          {
            "term": "승가",
            "def": "불교 수행자 공동체."
          }
        ],
        "summary": "불교의 시작은 고통의 원인을 이해하고 해탈의 길을 찾으려는 붓다의 가르침과 연결된다.",
        "think": "내 삶에서 지나친 욕망이나 지나친 억압처럼 양극단으로 치우치는 상황은?",
        "thinkGuide": "예를 들어 일을 지나치게 몰아붙이거나 반대로 모든 것을 내려놓아 버리는 상황, 소비와 절제 사이에서 흔들리는 상황을 떠올려 볼 수 있습니다. 중도는 중간값이 아니라 그때 괴로움을 줄이는 알맞은 길을 찾는 태도로 설명됩니다.",
        "level": "intro",
        "unit": "역사",
        "place": "daeung",
        "minutes": 3
      },
      {
        "id": "p2",
        "title": "사성제: 고통을 이해하는 네 가지 진리",
        "goal": "사성제 네 항목과 문제 해결 구조를 이해한다.",
        "body": [
          "사성제는 고성제·집성제·멸성제·도성제다. 삶의 괴로움과 불만족, 그 원인, 괴로움의 소멸 가능성, 소멸에 이르는 길을 설명한다. 의학에 비유하면 증상을 확인하고 원인을 찾은 뒤 회복 가능성을 이해하고 치료법을 실천하는 구조와 비슷하다.",
          "고성제는 삶에 괴로움과 불만족이 존재한다는 진리다. 고는 통증이나 슬픔만이 아니라 좋아하는 것이 변하고 원하는 것을 얻지 못하는 경험처럼 조건에 의존한 모든 것이 안정적 만족을 주지 못한다는 점까지 포함한다.",
          "집성제는 괴로움의 원인을 살핀다. 갈애, 즉 계속 붙잡고 소유하려는 갈망이 중요한 원인으로 설명된다. 무지와 집착도 괴로움을 지속시키는 조건이다. 멸성제는 원인과 조건이 사라질 때 괴로움이 소멸할 수 있다는 가르침이며 이를 열반과 연결해 설명한다.",
          "도성제는 괴로움의 소멸로 나아가는 실천의 길이다. 대표적으로 팔정도가 제시된다. 바른 이해와 의도, 말과 행동, 생계, 노력, 알아차림, 집중을 기르는 길이다. 사성제는 삶을 비관하라는 말이 아니라 괴로움을 정직하게 살피고 변화의 가능성을 실천하라는 가르침이다."
        ],
        "termDefs": [
          {
            "term": "고(苦)",
            "def": "불만족과 괴로움, 조건 지어진 삶의 불안정성."
          },
          {
            "term": "갈애",
            "def": "강하게 갈망하고 붙잡으려는 마음."
          },
          {
            "term": "열반",
            "def": "탐욕·성냄·어리석음의 불길이 꺼진 해탈의 상태."
          },
          {
            "term": "팔정도",
            "def": "괴로움의 소멸로 나아가는 여덟 가지 실천."
          }
        ],
        "summary": "사성제는 고통을 인정하는 데서 끝나지 않고 원인과 소멸의 길을 제시한다.",
        "think": "내가 바꿀 수 없는 상황을 억지로 붙잡을 때 괴로움이 커지는 경험이 있었는가?",
        "thinkGuide": "사성제의 구조로 보면, 바꿀 수 없는 것을 붙잡으려는 갈애가 괴로움을 키우는 조건입니다. 상황 자체보다 붙잡는 마음을 알아차릴 때 괴로움이 줄어들 수 있다는 것이 가르침의 요지입니다.",
        "level": "intro",
        "unit": "교리",
        "minutes": 3
      },
      {
        "id": "p3",
        "title": "팔정도와 일상 속 수행",
        "goal": "팔정도를 지혜·윤리·마음 수련의 구조로 이해한다.",
        "body": [
          "팔정도는 바른 견해, 바른 생각 또는 의도, 바른 말, 바른 행동, 바른 생계, 바른 노력, 바른 알아차림, 바른 집중이다. 바르다는 말은 단순히 사회 규칙에 맞는다는 뜻이 아니라 괴로움의 원인을 줄이고 지혜와 해탈에 도움이 되는 방향을 뜻한다.",
          "바른 견해와 의도는 지혜의 영역이다. 사성제와 연기 등 가르침을 이해하고 해치려는 마음 대신 자비와 놓아줌을 기르는 것이다. 바른 말·행동·생계는 윤리의 영역이다. 거짓말과 험담, 해로운 행동을 줄이고 타인을 해치지 않는 방식으로 살아가려는 실천이다.",
          "바른 노력·알아차림·집중은 마음 수련의 영역이다. 해로운 마음 상태를 줄이고 유익한 마음을 기르며 몸과 감정, 생각에서 일어나는 일을 관찰한다. 팔정도는 한 단계씩 끝내는 사다리라기보다 서로 돕는 요소들의 체계다. 일상에서는 말하기 전에 사실인지, 필요한지, 상대를 해치지 않는지 살펴보는 것부터 시작할 수 있다."
        ],
        "termDefs": [
          {
            "term": "정견",
            "def": "바른 견해."
          },
          {
            "term": "정어",
            "def": "바른 말."
          },
          {
            "term": "정업",
            "def": "바른 행동."
          },
          {
            "term": "정념",
            "def": "몸과 마음의 움직임을 분명히 알아차림."
          },
          {
            "term": "정정",
            "def": "마음을 안정시키는 바른 집중."
          }
        ],
        "summary": "팔정도는 지혜·윤리·마음 수련을 함께 포함하는 실천 체계다.",
        "think": "오늘 내가 한 말과 행동 중 타인에게 불필요한 상처를 준 것은 없었는지 돌아보자.",
        "thinkGuide": "팔정도의 바른 말(정어)에 해당합니다. 사실인지, 필요한지, 상대를 해치지 않는지를 말하기 전에 살펴보는 것부터 시작할 수 있습니다. 스스로를 탓하기보다 다음에 어떻게 할지를 정하는 것이 수행의 방향입니다.",
        "level": "basic",
        "unit": "수행",
        "place": "meditation",
        "minutes": 3
      },
      {
        "id": "p4",
        "title": "경전과 수행 전통",
        "goal": "불교 경전의 다양성과 수행 전통의 차이를 이해한다.",
        "body": [
          "불교 경전은 붓다의 가르침과 초기 공동체의 기억, 후대의 철학적·수행적 발전을 담은 방대한 문헌군이다. 언어와 전승 계통에 따라 팔리어 경전, 한역 경전, 티베트어 경전 등 여러 갈래가 형성되었다. 모든 불교 전통이 동일한 경전 목록을 권위 있게 받아들이는 것은 아니다.",
          "반야심경은 공의 지혜를 간결하게 표현한 대승불교 문헌이다. 금강경은 집착을 내려놓는 지혜를 강조하며, 법화경은 다양한 가르침과 방편, 모든 존재의 깨달음 가능성을 강조하는 전통에서 중요하게 읽힌다. 법구경은 짧은 게송을 통해 윤리와 마음의 훈련을 전한다.",
          "수행 방식도 다양하다. 선 전통에서는 좌선과 화두 참구 등을 중시할 수 있고, 정토 전통에서는 아미타불을 염하는 수행이 중요하다. 상좌부 전통에서는 계율과 위빠사나 등 통찰 명상을 강조하는 경우가 있다. 티베트 불교에는 만트라와 시각화 등 독특한 수행 체계가 발달했다. 어느 한 수행법이 모든 사람에게 똑같이 적합하다고 단정하지 않는다."
        ],
        "termDefs": [
          {
            "term": "팔리 삼장",
            "def": "상좌부 전통에서 중요하게 전승된 경전 모음."
          },
          {
            "term": "반야심경",
            "def": "반야 지혜와 공 사상을 압축한 대승 경전."
          },
          {
            "term": "위빠사나",
            "def": "경험과 마음의 작용을 통찰하는 명상 전통."
          },
          {
            "term": "선",
            "def": "수행과 마음의 통찰을 강조하는 불교 전통."
          }
        ],
        "summary": "불교의 경전과 수행법은 전통별로 다양하므로 배경과 맥락을 함께 소개해야 한다.",
        "think": "수행법을 접할 때 그 수행이 어느 전통에서 어떤 목적과 지도 아래 이루어지는지 확인해야 하는 이유는?",
        "thinkGuide": "같은 '명상'이라도 전통마다 목적과 방법, 지도 방식이 다릅니다. 상좌부의 위빠사나, 한국 선의 간화선, 정토의 염불, 티베트의 시각화는 서로 다른 배경에서 나왔습니다. 맥락 없이 섞으면 뜻을 오해하거나 몸과 마음에 무리가 갈 수 있어, 전통과 지도자를 확인하는 것이 좋습니다.",
        "level": "basic",
        "unit": "경전",
        "minutes": 3
      },
      {
        "id": "sambo",
        "title": "삼보와 한국 불교",
        "body": [
          "부처(불), 가르침(법), 수행 공동체(승)를 삼보라 하며 불자는 삼보에 귀의합니다.",
          "한국 불교는 대승불교로, 조계종·태고종·천태종 등 여러 종단이 있고 참선(간화선)과 염불, 경전 공부를 함께 합니다."
        ],
        "level": "basic",
        "unit": "사원과 수행",
        "minutes": 3
      },
      {
        "id": "layout",
        "title": "절의 구조",
        "body": [
          "일주문 → 천왕문(사천왕) → 불이문을 지나면 탑과 대웅전이 있는 마당에 이릅니다.",
          "범종각에는 범종·법고·목어·운판, 네 가지 법구(사물)가 있어 아침저녁 예불 때 칩니다.",
          "대웅전은 석가모니 부처님을 모신 중심 법당이며, 처마 아래 단청은 나무를 보호하고 장엄합니다."
        ],
        "level": "basic",
        "unit": "사원과 수행",
        "minutes": 3
      },
      {
        "id": "practice",
        "title": "명상과 예불",
        "body": [
          "명상은 숨과 몸, 마음을 있는 그대로 알아차리는 수행입니다. 한국 선방에서는 죽비 소리로 시작과 끝을 알립니다.",
          "새벽과 저녁 예불, 108배, 연등 공양이 대표적인 신행입니다."
        ],
        "level": "basic",
        "unit": "사원과 수행",
        "minutes": 3
      }
    ],
    "etiquette": [
      "스님이나 다른 불자를 만나면 두 손을 모아 합장하고 허리를 굽혀 반배합니다.",
      "법당에는 가운데 문(어간문)을 피해 옆문으로 드나들고, 부처님 정면을 가로지르지 않습니다.",
      "법당 안에서는 모자를 벗고 조용히 합니다.",
      "불상과 불구는 만지지 않고, 사진은 허락된 곳에서만 찍습니다.",
      "탑은 시계 방향으로 돕니다(탑돌이)."
    ],
    "practice": [
      {
        "label": "연등 켜기",
        "place": "courtyard",
        "text": "마당의 연등에 불을 밝힙니다."
      },
      {
        "label": "범종 치기",
        "place": "courtyard",
        "text": "범종각에서 범종을 칩니다."
      },
      {
        "label": "향 피우기 · 삼배",
        "place": "daeung",
        "text": "대웅전 불단에 향을 올리고 삼배를 드립니다."
      },
      {
        "label": "호흡 명상",
        "place": "meditation",
        "text": "명상실 방석에 앉아 숨을 따라갑니다."
      }
    ],
    "activities": [
      {
        "name": "예불",
        "text": "새벽과 저녁, 부처님께 예를 올리는 의식입니다.",
        "meaning": "불·법·승 삼보에 귀의하는 마음을 다지는 기본 의식입니다. 사찰에서는 사물(범종·법고·목어·운판)을 친 뒤 예불을 시작합니다.",
        "steps": [
          "법당에 들어가 합장 반배합니다.",
          "향과 초를 올립니다.",
          "예불문을 함께 외우며 절합니다.",
          "마치면 합장 반배하고 옆문으로 나옵니다."
        ],
        "img": "daeung",
        "place": "daeung"
      },
      {
        "name": "참선",
        "text": "앉아서 마음을 고요히 하고 본래 마음을 살핍니다.",
        "meaning": "한국 불교의 선 수행은 화두를 드는 간화선이 중심입니다. 처음에는 호흡을 지켜보는 것부터 시작할 수 있습니다.",
        "steps": [
          "방석에 반가부좌로 앉고 허리를 폅니다.",
          "눈은 반쯤 뜨고 시선을 앞 바닥에 둡니다.",
          "죽비 소리에 시작해 호흡을 따라갑니다.",
          "생각이 일어나면 알아차리고 다시 호흡으로 돌아옵니다.",
          "죽비 소리에 마칩니다."
        ],
        "img": "meditation",
        "place": "meditation"
      },
      {
        "name": "염불",
        "text": "부처님이나 보살의 이름을 부르며 마음을 모읍니다.",
        "meaning": "“나무아미타불”, “관세음보살”처럼 이름을 부르는 수행으로, 목탁에 맞추어 함께 하기도 합니다.",
        "steps": [
          "합장하고 바르게 앉거나 섭니다.",
          "목탁 소리에 맞추어 일정한 속도로 부릅니다.",
          "소리와 뜻에 마음을 둡니다."
        ],
        "img": "daeung",
        "place": "daeung"
      },
      {
        "name": "108배",
        "text": "108번 절하며 몸과 마음을 낮춥니다.",
        "meaning": "108은 사람이 지닌 여러 번뇌를 상징합니다. 한 번 절할 때마다 하나씩 내려놓는다는 뜻을 담습니다.",
        "steps": [
          "합장하고 선 자세에서 무릎을 꿇습니다.",
          "두 팔꿈치와 이마를 바닥에 대고 손바닥을 위로 올립니다(오체투지).",
          "천천히 일어나 다시 합장합니다.",
          "처음에는 횟수보다 바른 자세에 마음을 둡니다."
        ],
        "img": "daeung",
        "place": "daeung"
      },
      {
        "name": "사경",
        "text": "경전을 한 글자씩 정성껏 옮겨 씁니다.",
        "meaning": "글자를 쓰는 동안 마음을 모으고 가르침을 새기는 수행입니다. 반야심경 같은 짧은 경전을 많이 씁니다.",
        "steps": [
          "손을 씻고 바르게 앉습니다.",
          "사경지에 한 글자씩 천천히 씁니다.",
          "다 쓰면 합장하고 공덕을 나누는 마음(회향)을 냅니다."
        ],
        "img": "meditation"
      }
    ],
    "figures": [
      {
        "name": "석가모니 부처",
        "text": "기원전 5세기 무렵 깨달음을 얻은 싯다르타 고타마입니다. 대웅전의 중심에 모십니다."
      },
      {
        "name": "관세음보살",
        "text": "중생의 고통을 자비로 살피는 보살입니다. 한국 불교에서 가장 널리 모시는 보살 가운데 하나입니다."
      },
      {
        "name": "연꽃",
        "text": "진흙 속에서 깨끗하게 피어나 깨달음과 청정함을 상징합니다. 부처님오신날 연등의 모양이기도 합니다."
      },
      {
        "name": "법륜",
        "text": "가르침이 수레바퀴처럼 굴러 퍼진다는 뜻으로, 여덟 바퀴살은 팔정도를 나타냅니다."
      }
    ],
    "scriptures": [
      {
        "name": "팔리 삼장",
        "text": "경(가르침)·율(계율)·논(해설)의 세 바구니. 상좌부 불교의 경전입니다."
      },
      {
        "name": "반야심경",
        "text": "260자 남짓의 짧은 경전으로 공(空) 사상을 담고 있으며, 한국 사찰 예불에서 매일 독송합니다."
      },
      {
        "name": "금강경",
        "text": "조계종의 소의경전으로, 집착 없는 마음을 가르칩니다."
      },
      {
        "name": "법화경 · 화엄경",
        "text": "대승불교의 대표 경전입니다. 누구나 부처가 될 수 있다는 가르침과 모든 것이 서로 이어져 있다는 세계관을 담았습니다."
      }
    ],
    "symbols": [
      {
        "name": "불상과 보살상",
        "text": "부처님(깨달은 이)과 보살(깨달음을 구하며 중생을 돕는 이)을 모십니다."
      },
      {
        "name": "탑",
        "text": "부처님의 사리를 모신 곳에서 비롯되었으며, 시계 방향으로 돕니다."
      },
      {
        "name": "범종·법고·목어·운판",
        "text": "사물이라 하며 땅·네발짐승·물고기·날짐승의 중생을 깨운다는 뜻이 있습니다."
      },
      {
        "name": "단청",
        "text": "목조 건물을 보호하고 장엄하는 오방색 무늬입니다."
      },
      {
        "name": "卍 (만자)",
        "text": "길상(좋은 일)을 뜻하는 오래된 불교 표식으로, 사찰 지도 기호로도 씁니다."
      }
    ],
    "culture": [
      {
        "name": "사찰 음식",
        "text": "오신채(파·마늘 등)와 육식을 피하고 제철 재료로 만듭니다."
      },
      {
        "name": "발우공양",
        "text": "스님들이 네 그릇에 음식을 남김없이 덜어 먹는 수행 식사법입니다."
      },
      {
        "name": "템플스테이",
        "text": "일반인이 절에 머물며 예불, 참선, 발우공양을 경험하는 프로그램입니다."
      }
    ],
    "glossary": [
      {
        "term": "연기",
        "original": "緣起 · pratītyasamutpāda",
        "def": "모든 것은 원인과 조건이 모여 생기고 사라진다는 가르침입니다."
      },
      {
        "term": "무상",
        "original": "無常 · anicca",
        "def": "변하지 않는 것은 없다는 뜻입니다."
      },
      {
        "term": "무아",
        "original": "無我 · anattā",
        "def": "고정된 “나”라는 실체는 없다는 뜻입니다."
      },
      {
        "term": "열반",
        "original": "涅槃 · nirvāṇa",
        "def": "탐욕·성냄·어리석음의 불이 꺼진 평화로운 상태입니다."
      },
      {
        "term": "사성제",
        "original": "四聖諦",
        "def": "고·집·멸·도, 괴로움과 그 원인, 소멸, 그 길에 관한 네 가지 진리입니다."
      },
      {
        "term": "팔정도",
        "original": "八正道",
        "def": "괴로움을 없애는 여덟 가지 바른길입니다."
      },
      {
        "term": "보살",
        "original": "菩薩 · bodhisattva",
        "def": "깨달음을 구하면서 다른 이들을 돕는 이. 대승불교의 이상입니다."
      }
    ],
    "faq": [
      {
        "q": "불자가 아니어도 절에 들어가도 되나요?",
        "a": "누구나 들어갈 수 있습니다. 법당에 들어가면 합장 반배를 하고, 가운데 문은 피해 옆문으로 드나들면 됩니다. 절은 하지 않아도 괜찮습니다."
      },
      {
        "q": "절을 할 때 무엇을 비는 건가요?",
        "a": "신에게 소원을 비는 것이라기보다 부처님께 예를 올리고 스스로를 낮추는 수행입니다. 마음속 다짐(발원)을 함께 하기도 합니다."
      },
      {
        "q": "불교는 신을 믿나요?",
        "a": "불교는 창조주 신을 믿는 종교가 아니며, 부처님은 깨달음을 얻은 스승입니다. 다만 지역과 종파에 따라 여러 보살과 신중을 모시기도 합니다."
      }
    ],
    "quiz": [
      {
        "q": "사성제가 아닌 것은?",
        "options": [
          "윤회",
          "고",
          "멸"
        ],
        "answer": 0,
        "explain": "사성제는 고·집·멸·도입니다.",
        "lesson": "p2"
      },
      {
        "q": "불교는 4세기 고구려 때 한국에 전해졌다.",
        "options": [
          "O",
          "X"
        ],
        "answer": 0,
        "explain": "372년 고구려 소수림왕 때 전해졌습니다.",
        "lesson": "sambo"
      },
      {
        "q": "법당에는 가운데 문(어간문)으로 드나드는 것이 예절이다.",
        "options": [
          "O",
          "X"
        ],
        "answer": 1,
        "explain": "가운데 문은 피하고 옆문으로 드나듭니다.",
        "lesson": "layout"
      },
      {
        "q": "범종각의 사물에 들어가지 않는 것은?",
        "options": [
          "목탁",
          "법고",
          "목어"
        ],
        "answer": 0,
        "explain": "사물은 범종·법고·목어·운판입니다.",
        "lesson": "layout"
      },
      {
        "q": "석가모니가 깨달음을 얻은 곳은?",
        "options": [
          "보드가야",
          "룸비니",
          "쿠시나가라"
        ],
        "answer": 0,
        "explain": "룸비니는 탄생지, 쿠시나가라는 열반지입니다.",
        "lesson": "p1"
      }
    ],
    "status": "checking",
    "festivals": [
      {
        "name": "부처님오신날",
        "when": "음력 4월 8일",
        "text": "연등을 밝혀 붓다의 탄생을 기념합니다."
      },
      {
        "name": "출가재일",
        "when": "음력 2월 8일",
        "text": "붓다가 출가한 날."
      },
      {
        "name": "열반재일",
        "when": "음력 2월 15일",
        "text": "붓다가 열반에 든 날."
      },
      {
        "name": "성도재일",
        "when": "음력 12월 8일",
        "text": "붓다가 깨달음을 얻은 날."
      },
      {
        "name": "우란분절(백중)",
        "when": "음력 7월 15일",
        "text": "돌아가신 부모와 조상을 위해 기도합니다."
      }
    ],
    "festivalNote": "한국 불교 명절은 음력을 따르므로 양력 날짜가 해마다 바뀝니다. 상좌부 불교권에서는 붓다의 탄생·깨달음·열반을 함께 기리는 웨삭(베삭)을 지냅니다.",
    "sources": [
      "대한불교조계종 신행 안내",
      "한국민족문화대백과사전 \"불교\"",
      "Encyclopaedia Britannica, \"Buddhism\""
    ],
    "discover": [
      {
        "q": "사찰에는 왜 탑이 있을까요?",
        "a": "탑은 부처님의 사리를 모신 데서 시작되었어요. 그래서 사람들은 탑을 시계 방향으로 돌며 예를 올려요(탑돌이).",
        "lesson": "layout",
        "place": "courtyard"
      },
      {
        "q": "부처는 어떤 삶을 살았을까요?",
        "a": "전승에 따르면 왕자로 태어난 싯다르타는 늙음과 병, 죽음을 보고 출가했어요. 보리수 아래에서 깨달음을 얻은 뒤 평생 가르침을 전했어요.",
        "lesson": "p1",
        "place": "daeung"
      },
      {
        "q": "연꽃은 왜 불교를 상징할까요?",
        "a": "진흙 속에서 자라도 물들지 않고 깨끗하게 피어나기 때문이에요. 번뇌 속에서도 깨달음에 이를 수 있다는 뜻을 담고 있어요.",
        "lesson": "p3",
        "place": "courtyard"
      },
      {
        "q": "명상은 어떤 의미일까요?",
        "a": "숨과 몸, 마음에서 일어나는 일을 있는 그대로 알아차리는 수행이에요. 한국 선방에서는 죽비 소리로 시작과 끝을 알려요.",
        "lesson": "practice",
        "place": "meditation"
      }
    ]
  },
  "en": {
    "title": "Buddhism",
    "sub": "The path of awakening · the Three Jewels",
    "intro": "Buddhism began with the teaching of Siddhartha Gautama, who became the Buddha (the awakened one) in India around the 5th century BCE. It spread as Theravada in the south, Mahayana in East Asia and Vajrayana in Tibet, and reached Korea in 372 CE, continuing for over 1,600 years.",
    "start": {
      "title": "Your first Buddha hall",
      "text": "Enter the main hall, join palms, offer incense and make three bows.",
      "place": "daeung"
    },
    "lessons": [
      {
        "id": "life",
        "title": "Life of the Buddha",
        "body": [
          "Born in Lumbini, Prince Siddhartha left home after seeing old age, sickness and death, and awakened under the Bodhi tree at Bodh Gaya.",
          "He first taught at Sarnath and passed into parinirvana at Kushinagar."
        ]
      },
      {
        "id": "teach",
        "title": "Core teachings",
        "body": [
          "The Four Noble Truths: suffering, its cause, its cessation, and the path.",
          "The Noble Eightfold Path: right view, intention, speech, action, livelihood, effort, mindfulness and concentration.",
          "Impermanence, non-self and the Middle Way between extremes."
        ]
      },
      {
        "id": "sambo",
        "title": "The Three Jewels and Korean Buddhism",
        "body": [
          "Buddhists take refuge in the Buddha, the Dharma (teaching) and the Sangha (community).",
          "Korean Buddhism is Mahayana, with orders such as Jogye, Taego and Cheontae, combining Seon meditation, chanting and study."
        ]
      },
      {
        "id": "layout",
        "title": "Temple layout",
        "body": [
          "Iljumun → Cheonwangmun (Four Heavenly Kings) → Bulimun lead to the courtyard with the pagoda and main hall.",
          "The bell pavilion holds the four instruments: bell, drum, wooden fish and cloud gong, struck at dawn and evening services.",
          "The main hall enshrines Shakyamuni Buddha; the painted dancheong protects and adorns the wood."
        ]
      },
      {
        "id": "practice",
        "title": "Meditation and services",
        "body": [
          "Meditation is knowing breath, body and mind as they are. In Korean halls, the jukbi clapper marks the start and end.",
          "Dawn and evening services, 108 prostrations and lantern offerings are common practices."
        ]
      }
    ],
    "etiquette": [
      "Greet monks and others with joined palms and a half bow.",
      "Use the side doors of a hall, not the central door, and do not cross directly in front of the Buddha.",
      "Remove hats and keep quiet inside halls.",
      "Do not touch statues or ritual objects; photograph only where allowed.",
      "Walk around a pagoda clockwise."
    ],
    "practice": [
      {
        "label": "Light a lantern",
        "place": "courtyard",
        "text": "Light lotus lanterns in the courtyard."
      },
      {
        "label": "Strike the bell",
        "place": "courtyard",
        "text": "Strike the great bell in its pavilion."
      },
      {
        "label": "Incense · three bows",
        "place": "daeung",
        "text": "Offer incense and three bows in the main hall."
      },
      {
        "label": "Breathing meditation",
        "place": "meditation",
        "text": "Sit on a cushion and follow your breath."
      }
    ],
    "activities": [
      {
        "name": "Yebul (service)",
        "text": "Paying respect to the Buddha at dawn and evening.",
        "meaning": "The basic rite of taking refuge in the Buddha, Dharma and Sangha. Temples sound the four instruments (bell, drum, wooden fish, cloud gong) before it begins.",
        "steps": [
          "Enter the hall and make a half bow with joined palms.",
          "Offer incense and a candle.",
          "Chant the service text together and bow.",
          "Half bow again and leave by a side door."
        ],
        "img": "daeung",
        "place": "daeung"
      },
      {
        "name": "Seon meditation",
        "text": "Sitting still to look into the mind.",
        "meaning": "Korean Seon centres on investigating a hwadu. Beginners can start by watching the breath.",
        "steps": [
          "Sit half-lotus on a cushion with a straight back.",
          "Keep eyes half open, gaze on the floor ahead.",
          "Begin at the clapper and follow the breath.",
          "Notice thoughts and return to the breath.",
          "End at the clapper."
        ],
        "img": "meditation",
        "place": "meditation"
      },
      {
        "name": "Yeombul (chanting)",
        "text": "Calling the name of a Buddha or bodhisattva.",
        "meaning": "Chanting names such as “Namu Amitabul” or “Gwanseeum Bosal”, often to the rhythm of the moktak.",
        "steps": [
          "Join palms and sit or stand upright.",
          "Chant at a steady pace with the moktak.",
          "Rest your mind on the sound and meaning."
        ],
        "img": "daeung",
        "place": "daeung"
      },
      {
        "name": "108 prostrations",
        "text": "Bowing 108 times to humble body and mind.",
        "meaning": "The number stands for the many afflictions of the mind; each bow lets one go.",
        "steps": [
          "From standing with joined palms, kneel.",
          "Touch elbows and forehead to the floor, palms turned up.",
          "Rise slowly and join palms again.",
          "At first, care for good form over the count."
        ],
        "img": "daeung",
        "place": "daeung"
      },
      {
        "name": "Sagyeong (sutra copying)",
        "text": "Copying a sutra carefully, one character at a time.",
        "meaning": "Writing gathers the mind and engraves the teaching; short texts like the Heart Sutra are common.",
        "steps": [
          "Wash your hands and sit upright.",
          "Write slowly, character by character.",
          "Finish with joined palms, dedicating the merit to others."
        ],
        "img": "meditation"
      }
    ],
    "figures": [
      {
        "name": "Shakyamuni Buddha",
        "text": "Siddhartha Gautama, who awakened around the 5th century BCE; enshrined at the centre of the main hall."
      },
      {
        "name": "Avalokiteshvara (Gwanseeum)",
        "text": "The bodhisattva of compassion who hears the cries of the world; among the most revered in Korea."
      },
      {
        "name": "The lotus",
        "text": "Blooming clean from mud, a sign of awakening and purity; the shape of Buddha’s Birthday lanterns."
      },
      {
        "name": "The Dharma wheel",
        "text": "The teaching set rolling; its eight spokes are the Eightfold Path."
      }
    ],
    "scriptures": [
      {
        "name": "The Pali Canon",
        "text": "The “three baskets” of discourses, monastic rules and analysis; the scripture of Theravada."
      },
      {
        "name": "The Heart Sutra",
        "text": "A short text of about 260 characters on emptiness, chanted daily in Korean temples."
      },
      {
        "name": "The Diamond Sutra",
        "text": "The core scripture of the Jogye Order, teaching a mind free of attachment."
      },
      {
        "name": "Lotus and Avatamsaka Sutras",
        "text": "Major Mahayana texts: all beings can become Buddhas, and all things interpenetrate."
      }
    ],
    "symbols": [
      {
        "name": "Buddha and bodhisattva images",
        "text": "Buddhas (awakened ones) and bodhisattvas (those who help others towards awakening)."
      },
      {
        "name": "The pagoda",
        "text": "Rooted in relic mounds of the Buddha; walked around clockwise."
      },
      {
        "name": "Bell, drum, wooden fish, cloud gong",
        "text": "The four instruments, said to wake beings of earth, land, water and sky."
      },
      {
        "name": "Dancheong",
        "text": "Five-colour patterns that protect and adorn wooden halls."
      },
      {
        "name": "卍 (manja)",
        "text": "An ancient Buddhist sign of good fortune, also used on Korean maps for temples."
      }
    ],
    "culture": [
      {
        "name": "Temple food",
        "text": "No meat and none of the five pungent plants such as garlic and green onion; seasonal ingredients."
      },
      {
        "name": "Baru gongyang",
        "text": "A formal monastic meal eaten from four bowls without leaving anything."
      },
      {
        "name": "Templestay",
        "text": "Programmes where visitors stay at a temple for services, meditation and meals."
      }
    ],
    "glossary": [
      {
        "term": "Dependent origination",
        "original": "緣起 · pratītyasamutpāda",
        "def": "Everything arises and ceases through causes and conditions."
      },
      {
        "term": "Impermanence",
        "original": "無常 · anicca",
        "def": "Nothing stays unchanged."
      },
      {
        "term": "Non-self",
        "original": "無我 · anattā",
        "def": "There is no fixed, unchanging self."
      },
      {
        "term": "Nirvana",
        "original": "涅槃 · nirvāṇa",
        "def": "Peace when the fires of greed, anger and delusion go out."
      },
      {
        "term": "Four Noble Truths",
        "original": "四聖諦",
        "def": "Suffering, its cause, its cessation and the path."
      },
      {
        "term": "Eightfold Path",
        "original": "八正道",
        "def": "Eight right ways that end suffering."
      },
      {
        "term": "Bodhisattva",
        "original": "菩薩",
        "def": "One who seeks awakening while helping others; the Mahayana ideal."
      }
    ],
    "faq": [
      {
        "q": "Can non-Buddhists enter a temple?",
        "a": "Yes. In a hall, make a half bow with joined palms and use the side doors rather than the central one. You do not have to bow fully."
      },
      {
        "q": "What do people ask for when they bow?",
        "a": "Bowing is less about asking a god for wishes than paying respect to the Buddha and humbling oneself; people may add a personal vow."
      },
      {
        "q": "Do Buddhists believe in God?",
        "a": "Buddhism does not teach a creator god; the Buddha is an awakened teacher. Some traditions honour many bodhisattvas and guardian deities."
      }
    ],
    "quiz": [
      {
        "q": "Which is not one of the Four Noble Truths?",
        "options": [
          "Rebirth",
          "Suffering",
          "Cessation"
        ],
        "answer": 0,
        "explain": "They are suffering, its cause, its cessation and the path.",
        "lesson": "teach"
      },
      {
        "q": "Buddhism reached Korea in the 4th century, in Goguryeo.",
        "options": [
          "True",
          "False"
        ],
        "answer": 0,
        "explain": "It arrived in 372 under King Sosurim.",
        "lesson": "sambo"
      },
      {
        "q": "It is polite to use the central door of a Buddha hall.",
        "options": [
          "True",
          "False"
        ],
        "answer": 1,
        "explain": "Use the side doors; the central door is avoided.",
        "lesson": "layout"
      },
      {
        "q": "Which is not one of the four temple instruments?",
        "options": [
          "Moktak",
          "Drum",
          "Wooden fish"
        ],
        "answer": 0,
        "explain": "The four are the bell, drum, wooden fish and cloud gong.",
        "lesson": "layout"
      },
      {
        "q": "Where did the Buddha awaken?",
        "options": [
          "Bodh Gaya",
          "Lumbini",
          "Kushinagar"
        ],
        "answer": 0,
        "explain": "Lumbini is his birthplace and Kushinagar where he passed away.",
        "lesson": "life"
      }
    ],
    "status": "checking",
    "festivals": [
      {
        "name": "Buddha's Birthday",
        "when": "8th day, 4th lunar month",
        "text": "Lanterns celebrate the Buddha's birth."
      },
      {
        "name": "Renunciation Day",
        "when": "8th day, 2nd lunar month",
        "text": "The day he left home."
      },
      {
        "name": "Nirvana Day",
        "when": "15th day, 2nd lunar month",
        "text": "His parinirvana."
      },
      {
        "name": "Enlightenment Day",
        "when": "8th day, 12th lunar month",
        "text": "His awakening."
      },
      {
        "name": "Ullambana (Baekjung)",
        "when": "15th day, 7th lunar month",
        "text": "Prayers for departed parents and ancestors."
      }
    ],
    "festivalNote": "Korean Buddhist holidays follow the lunar calendar. Theravada countries celebrate Vesak, honouring birth, awakening and parinirvana together.",
    "sources": [
      "Jogye Order of Korean Buddhism",
      "Encyclopedia of Korean Culture, \"Buddhism\"",
      "Encyclopaedia Britannica, \"Buddhism\""
    ],
    "discover": [
      {
        "q": "Why do temples have pagodas?",
        "a": "Pagodas began as places holding the Buddha’s relics, so people walk around them clockwise in respect.",
        "lesson": "layout",
        "place": "courtyard"
      },
      {
        "q": "What kind of life did the Buddha live?",
        "a": "Tradition says Prince Siddhartha left home after seeing old age, sickness and death, awakened under the Bodhi tree and taught for the rest of his life.",
        "lesson": "life",
        "place": "daeung"
      },
      {
        "q": "Why is the lotus a Buddhist symbol?",
        "a": "It grows in mud yet blooms clean, a sign that awakening is possible amid the mind’s troubles.",
        "lesson": "teach",
        "place": "courtyard"
      },
      {
        "q": "What does meditation mean?",
        "a": "Knowing breath, body and mind as they are. In Korean halls a bamboo clapper marks the start and end.",
        "lesson": "practice",
        "place": "meditation"
      }
    ]
  }
}

export default pack
