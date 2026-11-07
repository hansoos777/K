import { useEffect } from 'react'
import type { WorldProps } from '../../core/registry'
import { go } from '../../core/router'
import { useT } from '../../i18n'
import { Space, type PlaceScene } from '../../ui/Space'
import type { IconName } from '../../ui/icons'
import { buildPlaza, gates, type GateId } from './three'

const ICON: Record<GateId, IconName> = { christian: 'cross', catholic: 'arch', temple: 'lantern', mandir: 'diya' }

/** 믿어보까 광장: 걸어서 네 종교 공간으로 들어가는 시작점 */
export default function PlazaWorld({ place }: WorldProps) {
  const t = useT()
  const p = t.plz
  // 광장에 오면 "어느 입구로 들어갔는지" 기록을 비움(새로 들어갈 때 다시 적음)
  useEffect(() => { try { sessionStorage.removeItem('plazaFrom') } catch { /* 무시 */ } }, [])
  const labels = p.gates as Record<GateId, string>
  const enter = (id: GateId) => {
    const gt = gates(labels).find((g) => g.id === id)!
    try { sessionStorage.setItem('plazaFrom', id) } catch { /* 저장 못 해도 이동은 함 */ }
    go(`w/${gt.to}`)
  }
  const scene = (): PlaceScene => ({
    build: (ctx) => buildPlaza(ctx, labels, p.subs as Record<GateId, string>),
    intro: p.intro,
    actions: (Object.keys(labels) as GateId[]).map((id) => ({ id: `enter-${id}`, label: labels[id], icon: ICON[id], run: () => enter(id) })),
    spots: {
      fountain: { label: p.fountain, text: p.fountainText },
      ...Object.fromEntries((Object.keys(labels) as GateId[]).map((id) => [`gate-${id}`, { label: `${p.subs[id]} · ${labels[id]}`, text: p.gateText(labels[id]), action: `enter-${id}` }])),
    },
  })
  return <Space id="plaza" place={place} scene={scene} />
}
