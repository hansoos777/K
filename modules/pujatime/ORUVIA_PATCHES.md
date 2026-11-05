# ORUVIA에 넣으면서 바꾼 곳 (PujaTime 원본과의 차이)

이 폴더는 PujaTime(github.com/hansoos777/pujatime) 소스를 그대로 복사한 것이다. 안드로이드·iOS·목업·신상 원본 스크립트, 서명 키, .env는 빼고 복사했다.
원본을 고친 뒤에는 `scripts/sync-pujatime.sh`로 다시 복사하고, 아래 두 곳을 다시 적용한다.

1. `vite.config.ts`: `VitePWA({ disable: process.env.ORUVIA_EMBED === '1', ... })`
   ORUVIA 안에서는 서비스 워커를 ORUVIA 것 하나만 쓴다.
2. `src/App.tsx`: 처음 탭을 주소의 `?tab=mandir`로 고를 수 있게 함
   ORUVIA의 "사원" 장소에서 바로 글로벌 만디르를 연다.

빌드: ORUVIA의 `npm run build`가 `scripts/build-hindu.mjs`를 실행해 `dist/hindu/`에 넣는다.
신상 그림(`/deities`)과 음원(`/audio`)은 PujaTime 코드가 주소 맨 앞(`/`)에서 찾으므로 `dist/`의 맨 위로 옮긴다.
3. `src/three/hall.ts`: 천장을 7→11(실제 21m→33m)로 높이고 기둥·높은 창·위쪽 벽·꽃줄·매단 등잔 높이를 맞춤 (교회·성당·대웅전처럼 웅장하게). 카메라도 시야 52°·거리 14·더 위를 보게

- 토스 앱 버전: `?toss=1`이면 `html[data-toss]`를 켜고 `.exit-btn`(나가기)을 숨김(App.tsx, styles.css) — 토스 상단 바 뒤로가기와 중복 방지
