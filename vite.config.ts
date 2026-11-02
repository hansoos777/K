import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    // 공간(월드)별 코드는 React.lazy로 따로 쪼개져 필요할 때만 받음
    chunkSizeWarningLimit: 260, // 기본 번들 대부분은 React(PujaTime과 같은 스택 유지)
  },
})
