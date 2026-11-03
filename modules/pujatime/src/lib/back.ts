import { useEffect, useRef } from 'react'

// 폰의 뒤로가기 버튼으로 열린 화면을 닫음. 스프링 서버의 페이지 이동이 없는 앱이라 주소가 그대로여서,
// 화면을 열 때 브라우저 기록을 한 칸 쌓아 두고 뒤로가기가 그 칸을 지우면 맨 위 화면을 닫음.
const stack: (() => void)[] = []
let skip = 0

window.addEventListener('popstate', () => {
  if (skip) {
    skip--
    return
  }
  stack.pop()?.()
})

export function useBack(onBack: () => void, active = true) {
  const latest = useRef(onBack)
  latest.current = onBack

  useEffect(() => {
    if (!active) return
    const close = () => latest.current()
    stack.push(close)
    history.pushState(null, '')
    return () => {
      // 화면 안의 버튼으로 닫았을 때는 쌓아 둔 칸을 직접 지움
      const i = stack.indexOf(close)
      if (i < 0) return
      stack.splice(i, 1)
      skip++
      history.back()
    }
  }, [active])
}
