# PujaTime 프로젝트 개요 (AI 검토용)

이 문서는 다른 AI나 개발자가 코드를 읽기 전에 프로젝트를 이해하고 검토할 수 있도록 정리한 개발 문서입니다.
기준일은 2026-11-02입니다. 비밀번호, API 키, 서명 키, 운영자 개인 메일 주소는 의도적으로 넣지 않았습니다.

## 1. 목적

PujaTime은 힌두교 신자가 휴대폰에서 매일 기도하는 **개인 디지털 신당** 앱입니다.

- **대상:** 전 세계 힌두교 신자, 특히 해외에 살아 가까운 사원이 없는 사람
- **핵심 경험:** 내 신을 모시고, 3D 신당에서 푸자를 하고, 염주·만트라·기록으로 습관을 이어 감
- **장기 차별점:** 다른 사람들과 함께 앉는 3D 공용 사원
- **개발 순서:** 1차는 혼자 써도 완성되는 개인 신당, 2차는 서버가 필요한 실시간 공용 사원

### 제품 원칙

- 게임화, 순위, 아르티 점수, 푸자 중 광고, 유료 아이템을 넣지 않습니다.
- AI가 신의 말처럼 답하는 기능을 넣지 않습니다.
- 사용자 수가 없을 때 가짜 숫자를 보여 주지 않습니다. 공용 사원의 사람들은 "미리보기 인원"으로 표시합니다.
- 점성술을 다루지 않습니다.
- 합성 음성으로 만트라를 낭송하지 않습니다.
- 운영 비용은 무료 범위에서 유지합니다. 유료 구독이나 결제를 쓰지 않습니다.

## 2. 주요 기능과 구현 상태

| 기능 | 상태 | 설명 | 주요 파일 |
|---|---|---|---|
| 온보딩 | 완료 | 이름, 모실 신, 캐릭터 선택. 목록에 없는 신은 이름과 사진으로 직접 추가 | `src/screens/Onboarding.tsx`, `src/components/CustomDeityForm.tsx` |
| 홈 | 완료 | 신상 카드, 오늘의 판창 한 줄, 염주·고요히·만트라 버튼 | `src/screens/Home.tsx` |
| 내 신당 3D 방 | 완료 | 전체 화면, 조이스틱·바닥 터치 이동, 드래그로 둘러보기, 종 치기 | `src/screens/MyShrine.tsx`, `src/three/shrine.ts` |
| 푸자 | 완료 | 시간 선택 후 단계별 의식(종, 램프, 꽃, 기도문, 만트라, 고요, 아르티, 마무리). 고요는 긴 푸자에만 포함 | `src/screens/Puja.tsx` |
| 공용 사원 3D 홀 | 미리보기 | 혼자 동작. 주변 사람은 데모이고 실시간 접속은 없음 | `src/screens/Hall.tsx`, `src/three/hall.ts` |
| 판창(힌두 달력) | 완료 | 티티, 일출·일몰, 에카다시·프라도시·상카슈티 등을 기기에서 계산 | `src/lib/panchang.ts`, `src/components/PanchangSheet.tsx` |
| 축제 일정 | 부분 완료 | 데이터가 2027 디왈리까지만 있어 매년 추가 필요 | `src/data/festivals.ts`, `src/screens/Festivals.tsx` |
| 기도·배우기 | 완료 | 신 소개, 만트라, 기도문 듣기 | `src/screens/Pray.tsx`, `src/data/deities.ts`, `src/data/library.ts` |
| 염주(자파) | 완료 | 108알 세기, 앱에서는 네이티브 진동 | `src/screens/Japa.tsx` |
| 고요히(다르샨) | 완료 | 시간을 정해 신상 앞에 머무는 화면 | `src/screens/Darshan.tsx` |
| 기록 | 완료 | 기기 안에만 저장하는 일기 | `src/screens/Journal.tsx` |
| 설정 | 완료 | 언어, 소리, 프로필, 신, 의견 보내기, 앱 정보 | `src/screens/Profile.tsx` |
| 소리 설정 | 완료 | 내 신당·공용 사원 상단 버튼. 음악 선택, 음악·효과음 크기 | `src/components/SoundSettings.tsx` |
| 기기 뒤로가기 | 완료 | 브라우저 기록으로 열린 화면을 닫음 | `src/lib/back.ts` |
| 기기 알림 | 앱 전용 | 매일 기도 알림, 단식일 아침 알림을 기기에 예약 | `src/lib/reminders.ts` |
| 의견 보내기 | 완료 | D1에 저장하고 `/admin`에서 확인. 메일 전달 없음 | `functions/api/feedback.ts` |
| 관리자 통계 | 완료 | `/admin`, 비밀번호 보호 | `public/admin.html`, `functions/api/admin/stats.ts` |
| 링크 미리보기 | 완료 | Open Graph 태그와 1200×630 이미지 | `index.html`, `scripts/og-image.mjs` |
| 회원가입·로그인 | 없음 | 나중에 추가 예정. 추가 시 앱 안 계정 삭제 기능 필요 | 없음 |
| 실시간 공용 사원 | 없음 | 2차 범위. 서버 설계가 필요 | `DEMO_CROWD`가 교체 지점 |

## 3. 기술 스택

- **프론트엔드:** React 19, TypeScript, Vite 8, `vite-plugin-pwa`. 라우터 없이 `src/App.tsx`의 상태로 화면을 전환합니다.
- **3D:** three.js. 점광원과 그림자를 쓰지 않고 glow 스프라이트와 재질 색으로 빛을 표현합니다. 금속은 매트캡입니다.
- **달력 계산:** `astronomy-engine`(MIT)을 기기에서 실행합니다.
- **서버:** Cloudflare Pages Functions
- **데이터베이스:** Cloudflare D1(`DB` 바인딩), 익명 통계와 의견만 저장합니다.
- **네이티브 앱:** Capacitor 8. `server.url`로 배포된 사이트를 띄우는 방식이고 TWA가 아닙니다.
- **네이티브 플러그인:** `@capacitor/app`, `@capacitor/haptics`, `@capacitor/local-notifications`
- **언어:** 한국어, 영어, 힌디어(`src/i18n`). 현재 기본값은 `ko`이며 출시 때 `en`으로 바꿔야 합니다.
- **테스트:** 자동화 테스트가 없습니다. `tsc --noEmit`, 빌드, 브라우저 수동 확인에 의존합니다.

## 4. 코드 구조

```text
pujatime/
├─ src/
│  ├─ App.tsx            화면 전환, 하단 탭, 배경 소리, 알림 동기화
│  ├─ main.tsx           시작점, 통계 시작
│  ├─ screens/           화면 단위 컴포넌트
│  ├─ components/        재사용 UI (Overlay, ShrineStage, Joystick, PanchangSheet 등)
│  ├─ three/             3D 장면
│  │  ├─ shrine.ts       내 신당. room=true면 걸어 다니는 방, false면 푸자·다르샨의 고정 시점
│  │  ├─ hall.ts         공용 사원 홀
│  │  ├─ devotee.ts      2등신 캐릭터
│  │  └─ kit.ts          렌더러, 텍스처, 불꽃 등 공용 도구
│  ├─ lib/               로직
│  │  ├─ store.ts        localStorage 상태 관리 (키 pujatime-v1)
│  │  ├─ panchang.ts     힌두 달력 계산
│  │  ├─ sound.ts        Web Audio 효과음과 탄푸라 합성음
│  │  ├─ ambient.ts      배경 음악과 기도문 재생
│  │  ├─ back.ts         기기 뒤로가기 처리
│  │  ├─ reminders.ts    네이티브 알림과 진동
│  │  ├─ stats.ts        익명 통계 전송
│  │  └─ photo.ts        사용자 신 사진 저장
│  ├─ data/              신, 축제, 기도문 정적 데이터
│  ├─ i18n/              번역 사전
│  └─ styles.css         전체 스타일과 디자인 토큰
├─ functions/            Cloudflare Pages Functions
│  ├─ _stats.ts          공용 타입과 상수
│  └─ api/               hit.ts, feedback.ts, admin/stats.ts
├─ migrations/           D1 스키마
├─ public/               정적 파일 (신상 이미지, 음원, /admin, /privacy, og.jpg)
├─ scripts/              아이콘·미리보기·신상 이미지 생성 도구
├─ android/, ios/        Capacitor 네이티브 프로젝트
├─ store/                스토어 아이콘과 업로드용 빌드 결과 (AAB·APK는 git 제외)
└─ capacitor.config.ts, vite.config.ts, wrangler.toml
```

## 5. 데이터 흐름

### 기기에만 저장되는 데이터

이름, 모시는 신, 캐릭터, 일기, 사용자 사진, 위치(판창용), 알림 설정, 소리 설정은 `localStorage`에 저장합니다.
계정이 없어서 기기를 바꾸거나 앱 데이터를 지우면 함께 사라집니다.

### 서버에 저장되는 데이터

| 테이블 | 내용 |
|---|---|
| `devices` | 앱이 만든 무작위 기기 번호, 첫 방문일, 마지막 접속, 국가, 언어, 모시는 신 |
| `visits` | 날짜별 방문 기기 |
| `counters` | 날짜별 이벤트 횟수 |
| `feedback` | 의견 내용, 선택 입력한 답장 주소, 언어, 도배 방지용 IP 해시 |
| `admin_fails` | 관리자 비밀번호 오입력 차단 정보(IP 해시) |

이름, 기도 내용, 일기, 사진, IP 원문은 저장하지 않습니다. `feedback.mailed` 컬럼은 메일 기능을 뺀 뒤 쓰지 않습니다.

### API

| 경로 | 방식 | 역할 |
|---|---|---|
| `/api/hit` | POST | 익명 통계 기록. `src/lib/stats.ts`가 sendBeacon으로 보냄 |
| `/api/feedback` | POST | 의견 저장. IP 해시 기준 시간당 5건 제한, 1,000자 제한 |
| `/api/admin/stats` | GET | 통계와 의견 조회. 비밀번호 필요, 5회 틀리면 15분 차단 |

관리자 비밀번호는 Pages 시크릿 `ADMIN_KEY`에 있고, SHA-256 비교로 확인합니다.

## 6. 판창 계산 방식

- 해와 달의 황경 차이(`MoonPhase`)로 티티를 구합니다.
- 그날의 티티는 지역 일출 시점 값으로 정합니다. 기본 위치는 델리이고 사용자가 내 위치를 쓸 수 있습니다.
- 프라도시는 일몰 후 45분, 상카슈티는 달뜰 때의 티티로 판단합니다.
- 에카다시가 일출 두 번에 걸치고 첫날 아루노다야(일출 96분 전)가 전날 티티이면 다음 날로 넘깁니다.
- 달 이름(마사)과 낙샤트라는 지역 차이와 점성술 인접성 때문에 제외했습니다.
- 2026년 Drik Panchang 델리 Smarta 기준으로 에카다시 24/24, 상카슈티 13/13, 프라도시 표본 5/5가 일치했습니다.
- 전통과 지역에 따라 하루 차이가 날 수 있어 화면에 안내합니다.

## 7. 빌드와 배포

```bash
npm install
npm run dev
npm run build
```

- 사이트 배포: Cloudflare Pages 프로젝트 `pujatime`에 `dist`를 업로드합니다. 주소는 https://pujatime.pages.dev 입니다.
- 앱 구조: 앱이 배포 사이트를 띄우므로 화면·기능 변경은 웹 배포만으로 앱에 반영됩니다.
- 앱 재빌드가 필요한 경우: 아이콘, 권한, 네이티브 플러그인을 바꿀 때
- 앱 패키지 ID: `com.chilbokpapa.pujatime`, 현재 버전 1.0.0(versionCode 1)
- 안드로이드: 서명된 AAB와 테스트 APK를 만들었고 스토어에는 아직 올리지 않았습니다.
- iOS: 프로젝트만 있고, 맥이 없어서 빌드한 적이 없습니다.

## 8. 현재 한계와 위험

### 출시 전 필수

1. **콘텐츠 정확성:** 신 소개, 만트라, 축제 문구는 공개 자료로 교차 확인했지만 전문가 검토는 받지 않았습니다.
2. **신상 이미지:** 하누만, 라마, 사라스바티, 칼리의 이미지가 없습니다. 가네샤, 시바, 비슈누는 재생성이 필요합니다. 종교적으로 민감한 부분이라 신자의 확인이 필요합니다.
3. **음원:** 만트라 실제 녹음이 없습니다. 음악은 반수리와 합성 탄푸라뿐입니다.
4. **기본 언어:** `DEFAULT_LANG`을 `en`으로 바꿔야 합니다.
5. **실기기 검증:** 알림, 진동, 앱의 하드웨어 뒤로가기, 저사양 폰 성능을 실제 기기에서 확인하지 못했습니다.
6. **스토어:** 스크린샷과 소개 문구가 없습니다. 구글은 신규 개인 계정 기준 테스터 12명 14일 조건이 있습니다. 애플은 유료 계정과 맥이 필요하고, 웹뷰 앱이라 가이드라인 4.2 반려 위험이 있습니다.

### 기술 부채

- 커밋이 하나도 없습니다. 변경 이력과 복구 수단이 없어 가장 먼저 해결해야 합니다.
- 자동화 테스트가 없습니다. 판창 계산과 `store.ts`의 저장 형식 호환은 테스트 가치가 큽니다.
- `src/three/shrine.ts`가 1,080줄이고 고정 시점과 방 모드가 한 클래스에 섞여 있습니다.
- 사용자 데이터가 기기에만 있어 기기 변경 시 사라집니다.
- 공용 사원의 `DEMO_CROWD`는 데모이고 실시간 구조가 아직 없습니다.
- 앱이 웹 배포에 의존합니다. 서비스워커 캐시가 없는 첫 실행에는 인터넷이 필요하고, 앱에서의 오프라인 동작은 실제 기기로 확인하지 못했습니다.
- D1의 미사용 컬럼 `feedback.mailed`와 Pages 시크릿 `FEEDBACK_EMAIL`이 남아 있습니다.

## 9. 검토 시 봐 주면 좋은 점

1. `functions/api/`의 입력 검증, 요청 제한, 관리자 인증
2. `src/lib/back.ts`의 기록 처리와 화면 전환이 겹칠 때의 동작
3. `src/lib/panchang.ts`의 계산 규칙과 경계 조건
4. `src/three/`의 메모리 해제와 저사양 폰 성능
5. 힌두교 표현과 신상 표현의 문화적 적절성
6. 개인정보처리방침(`public/privacy.html`)과 실제 동작의 일치 여부
7. 회원가입과 실시간 공용 사원을 붙일 때의 구조

## 서비스 구조 (2026-11-02 전략 문서 반영)

- 하단 탭은 내 신당 / 사원 / 오픈 예정 세 개다. 기도(`Pray`)와 기록(`Journal`)은 내 신당 홈에서 들어가는 화면이다.
- 내 신당: 매일 오는 공간. 홈에 지난 7일 푸자 표시(`Shrine.pujaDays`, 연속 일수 숫자는 일부러 없음), 14일 안의 축제 띠, 신당 컬렉션(`src/data/themes.ts`, 지금은 전부 무료).
- 사원: 함께 찾는 공간. 오늘의 의식, 축제, 신별 사원.
- 오픈 예정: `src/screens/Upcoming.tsx`. 앞으로 열릴 공간을 소개만 한다. 유료 기능은 사용자가 늘면 추가하며, 화면에는 프리미엄 같은 돈을 떠올리게 하는 단어를 쓰지 않는다. 지금 결제는 없다.
- 가족 신당과 실시간 공동 램프는 서버 작업이 필요해 아직 없다.
- 서비스 이름은 `src/brand.ts`에 모았다. `index.html`, `public/privacy.html`, `public/og.jpg`, `capacitor.config.ts`는 따로 고쳐야 한다.
