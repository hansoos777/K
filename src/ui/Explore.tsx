import { WORLDS } from '../core/registry'
import { go } from '../core/router'
import { useStore } from '../core/store'
import { useT } from '../i18n'
import ReligionDetail from './ReligionDetail'

/** ② 종교 탐색: 한 화면에서 네 종교를 탭으로 고르고, 고른 종교의 상세를 바로 아래에 보여 줌 */
export default function Explore({ id }: { id?: string }) {
  const t = useT()
  const interests = useStore((s) => s.interests)
  // 관심 종교를 먼저
  const order = [...WORLDS].sort((a, b) => Number(interests.includes(b.id)) - Number(interests.includes(a.id)))
  const cur = WORLDS.find((w) => w.id === id) ?? order[0]
  return (
    <div className="screen">
      <div className="screen-head">
        <h1>{t.ex.title}</h1>
        <p className="hint">{t.ex.sub}</p>
      </div>
      <div className="tabs" role="tablist">
        {order.map((w) => (
          <button key={w.id} role="tab" aria-selected={w.id === cur.id} className={w.id === cur.id ? 'on' : ''} style={{ ['--b' as string]: w.colors[1] }} onClick={() => go(`explore/${w.id}`)}>
            {t.worlds[w.id].name}
          </button>
        ))}
      </div>
      <ReligionDetail key={cur.id} id={cur.id} />
    </div>
  )
}
