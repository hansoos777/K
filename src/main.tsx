import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './ui/styles.css'

// 토스 앱 안(앱인토스, `vite build --mode toss`): 토스 상단 바가 뒤로가기·제목을 맡으므로
// 우리 헤더와 뒤로가기 버튼을 숨긴다(검수: 중복 버튼 금지)
export const IN_TOSS = import.meta.env.MODE === 'toss'
if (IN_TOSS) document.documentElement.dataset.toss = '1'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// 배포본에서만 서비스 워커 등록 (개발 중 캐시 혼란 방지)
if (import.meta.env.PROD && !IN_TOSS && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* 등록 실패해도 앱은 정상 동작 */
    })
  })
}
