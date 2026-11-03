/**
 * 서비스 이름은 곧 바뀔 예정. 화면·페이지 제목·앱 이름(manifest)·종교 공간 라벨은 모두 이 값을 쓴다.
 * 이름을 바꿀 때는 이 파일만 고치면 된다.
 * 따로 고쳐야 하는 것: 배포 주소(Cloudflare Pages 프로젝트 이름, deploy.ps1의 oruvia), 저장소 이름.
 * 바꾸지 말 것: 기기 저장 키(core/store.ts의 KEY) — 바꾸면 사용자 기록이 사라진다.
 */
export const BRAND = {
  /** 로고·라벨에 쓰는 대문자 이름 */
  name: 'ORUVIA',
  /** 한국어 표기 */
  ko: '오루비아',
  /** 영어 문장 속 표기 */
  en: 'Oruvia',
  tagline: 'One World. Many Sacred Places.',
}
