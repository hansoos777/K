import { useEffect, useRef, useState } from 'react'

/** 초 단위 카운트다운. 끝나면 onDone. 화면이 사라지면 타이머도 정리 */
export function useCountdown(onDone?: () => void) {
  const [left, setLeft] = useState(0)
  const [total, setTotal] = useState(0)
  const done = useRef(onDone)
  done.current = onDone
  useEffect(() => {
    if (left <= 0) return
    const id = window.setTimeout(() => {
      setLeft((n) => {
        if (n <= 1) done.current?.()
        return n - 1
      })
    }, 1000)
    return () => window.clearTimeout(id)
  }, [left])
  return {
    left,
    total,
    running: left > 0,
    start: (sec: number) => {
      setTotal(sec)
      setLeft(sec)
    },
    stop: () => setLeft(0),
  }
}

export const mmss = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
