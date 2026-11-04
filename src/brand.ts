/**
 * 서비스 이름: 랜선신앙 (2026-11-04 확정). 화면·페이지 제목·앱 이름(manifest)·종교 공간 라벨은 모두 이 값을 쓴다.
 * 이름을 바꿀 때는 이 파일만 고치면 된다.
 * 따로 고쳐야 하는 것: 배포 주소(Cloudflare Pages 프로젝트 이름, deploy.ps1의 oruvia), 저장소 이름.
 * 바꾸지 말 것: 기기 저장 키(core/store.ts의 KEY) — 바꾸면 사용자 기록이 사라진다.
 */
export const BRAND = {
  /** 라벨용 이름(종교 공간 이름표 등) */
  name: '랜선신앙',
  /** 한국어 서비스명 */
  ko: '랜선신앙',
  /** 영어 화면에서도 같은 이름 (영어 이름은 따로 정하지 않음) */
  en: '랜선신앙',
  tagline: 'Walk through the world’s faiths, online.',
}
