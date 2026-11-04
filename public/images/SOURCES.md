# 사이트 사진 (public/images)

| 항목 | 내용 |
|---|---|
| 만드는 방법 | `node scripts/images/gen.mjs` (PC에서, HF_TOKEN 필요) |
| 모델 · 라이선스 | FLUX.1 schnell (Black Forest Labs), Apache 2.0 — 상업적 이용 가능 |
| 파일 이름 | `home_hero`, `spaces_hero`, `mine_hero`, `ext_<종교>`, `act_<종교>_<번호>` (`.webp`) |
| 종교 폴더 이름 | christian(개신교) · catholic(천주교) · temple(불교) · mandir(힌두교) |
| 크기 | 배너 1536×768, 카드 1216×832 |
| 느낌 | docs/design/reference.png 시안처럼: 따뜻한 해 질 녘 빛, 옅은 안개, 파스텔 하늘. 살짝 둥근 미니어처 같은 3D 렌더(조금 귀엽게), 단 장난감·캐릭터 느낌은 금지 |
| 대신 쓰는 사진 | 파일이 없으면 화면은 3D 공간 사진(public/photos)을 보여 줌 |

## 검수 (넣기 전에 반드시)

- 종교 상징이 맞는지: 개신교 사진에 십자고상·성상이 없는지, 천주교 십자고상과 일반 십자가를 구분했는지, 불교·힌두교 도상이 섞이지 않았는지
- 사람 얼굴이 정면으로 또렷하게 나오지 않는지, 글자가 엉터리로 찍히지 않았는지
- 틀린 것은 지우고 `node scripts/images/gen.mjs <id>` 로 다시 만든다

| 파일 | 상태 | 확인한 날 |
|---|---|---|
| (아직 없음) | | |
