import { Component, Suspense, lazy, useEffect, useMemo, useState, type ComponentType, type ReactNode } from 'react'
import { suspendAudio } from '../core/audio'
import { markWorldReady, markWorldStart } from '../core/perf'
import { worldById, type WorldProps } from '../core/registry'
import { href } from '../core/router'
import { useT } from '../i18n'
import { Logo } from './Logo'

/** 월드별 lazy 컴포넌트를 한 번만 만든다 (다시 들어와도 다시 받지 않음, 브라우저 캐시 사용) */
const lazyCache: Record<string, ComponentType<WorldProps>> = {}

class Boundary extends Component<{ fallback: (retry: () => void) => ReactNode; children: ReactNode }, { err: boolean }> {
  state = { err: false }
  static getDerivedStateFromError() {
    return { err: true }
  }
  render() {
    return this.state.err ? this.props.fallback(() => this.setState({ err: false })) : this.props.children
  }
}

function Ready({ id, children }: { id: string; children: ReactNode }) {
  useEffect(() => markWorldReady(id), [id])
  return <>{children}</>
}

export default function WorldShell({ id, place }: { id: string; place?: string }) {
  const t = useT()
  const def = worldById(id)
  const [attempt, setAttempt] = useState(0)

  const World = useMemo(() => {
    if (!def) return null
    const key = id + ':' + attempt
    if (!lazyCache[key]) {
      markWorldStart(id)
      lazyCache[key] = lazy(def.load)
    }
    return lazyCache[key]
  }, [def, id, attempt])

  // 공간을 떠나면 소리를 멈추고 오디오 장치를 쉬게 한다
  useEffect(() => () => suspendAudio(), [id])

  if (!def || !World) {
    location.hash = '/'
    return null
  }

  return (
    <Boundary
      key={attempt}
      fallback={() => (
        <div className="world-loading">
          <p>{t.loadFailed}</p>
          <div className="row">
            {/* 실패한 동적 import는 브라우저가 기억해서 같은 페이지에선 다시 받지 못함 → 새로고침 */}
            <button className="btn" onClick={() => (navigator.onLine ? location.reload() : setAttempt((n) => n + 1))}>{t.retry}</button>
            <a className="btn" href={href('')}>{t.home}</a>
          </div>
        </div>
      )}
    >
      <Suspense
        fallback={
          <div className="world-loading" style={{ ['--a' as string]: def.colors[0], ['--b' as string]: def.colors[1] }} role="status">
            <div className="loader"><Logo size={44} /></div>
            <p>{def.brand}</p>
            <p className="hint">{t.loading}</p>
          </div>
        }
      >
        <Ready id={id}>
          <World place={place} />
        </Ready>
      </Suspense>
    </Boundary>
  )
}
