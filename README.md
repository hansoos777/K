# ORUVIA 오루비아

**One World. Many Sacred Places.** 세계의 여러 종교·문화 공간을 디지털로 방문하는 가상 공간 플랫폼입니다.

1단계 미리보기 버전입니다. 각 종교는 메인 화면(배우기·체험·신앙 활동·예절·축제)과 걸어 다닐 수 있는 3D 공간으로 이루어져 있습니다.

열린 3D 공간은 다음과 같습니다.

- 기독교: 전통 교회, 현대 교회, 기도실
- 천주교: 본당, 고딕 대성당, 성모 동산, 고해소 안내
- 힌두교: 만디르 (PujaTime과 연결)
- 불교: 대웅전, 사찰 마당, 명상실

기획·아키텍처·비용 계획은 [docs/PLAN.md](docs/PLAN.md)에 있습니다.

## 실행

```bash
npm install
npm run dev       # 개발 서버
npm run build     # 타입 검사 + 빌드 → dist/
npm run size      # 첫 화면·공간별 전송량(gzip) 보고
npm run preview   # 빌드 결과 미리보기
```

## 배포 (Cloudflare Pages)

```bash
npm run build
npx wrangler pages deploy dist --project-name oruvia --branch main
```

`public/_headers`에 캐시 정책과 보안 헤더가 있습니다.

## 새 공간 추가

1. `src/worlds/<id>/` 폴더를 만들고 그 안에 `meta.ts`(장소 목록), `World.tsx`, `strings.ts`(ko/en 문구)를 둡니다.
2. `src/core/registry.tsx`의 `WORLDS`에 한 줄을 추가합니다.

각 공간 코드는 사용자가 그 공간에 들어갈 때만 다운로드됩니다.

## 원칙

- 기록은 이 기기의 localStorage에만 저장되고, 서버로 보내지 않습니다.
- 고해소에는 입력 칸이 없으며, 고백 관련 내용은 묻지도 저장하지도 않습니다.
- 성경·기도문 번역본은 저작권 허가를 확인하기 전까지 본문을 싣지 않습니다.
- 소리는 Web Audio로 합성합니다. 그래서 음원 파일이 없습니다.
- 가짜 인기 숫자, 게임화, 광고는 넣지 않습니다.
