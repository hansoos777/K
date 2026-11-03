import { useState } from 'react'
import { WORLDS, resolvePlace } from '../core/registry'
import { href } from '../core/router'
import { update, useStore } from '../core/store'
import { useT } from '../i18n'

const MBTI = ['ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP', 'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ']

/** 질문 답(0=앞 보기, 1=뒤 보기)마다 점수를 받는 공간. 종교를 권하는 것이 아니라 체험 공간을 추천 */
const WEIGHTS: [string[], string[]][] = [
  [['christian/prayer', 'temple/meditation', 'catholic/grotto'], ['christian/modern', 'catholic/gothic', 'temple/daeung', 'mandir/mandir']],
  [['temple/meditation', 'christian/prayer', 'temple/daeung'], ['christian/traditional', 'christian/modern', 'mandir/mandir', 'catholic/gothic']],
  [['temple/meditation', 'christian/prayer', 'catholic/parish', 'temple/courtyard'], ['catholic/gothic', 'temple/daeung', 'mandir/mandir', 'christian/traditional']],
  [['catholic/parish', 'temple/courtyard', 'mandir/mandir', 'catholic/gothic'], ['catholic/grotto', 'temple/daeung', 'mandir/shrine', 'christian/prayer']],
]

export function recommend(answers: number[], mbti: string, interests: string[]) {
  const score = new Map<string, number>()
  const add = (k: string, n: number) => score.set(k, (score.get(k) ?? 0) + n)
  answers.forEach((a, q) => WEIGHTS[q][a].forEach((k) => add(k, 2)))
  // MBTI는 내향(I)·외향(E)만 가볍게 반영
  if (mbti) WEIGHTS[0][mbti[0] === 'I' ? 0 : 1].forEach((k) => add(k, 1))
  for (const k of score.keys()) if (interests.includes(k.split('/')[0])) add(k, 1)
  const sorted = [...score.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k)
  // 서로 다른 종교 공간이 먼저 오도록
  const out: string[] = []
  for (const k of sorted) if (!out.some((o) => o.split('/')[0] === k.split('/')[0])) out.push(k)
  for (const k of sorted) if (!out.includes(k)) out.push(k)
  return out.slice(0, 3)
}

export default function Finder() {
  const t = useT()
  const lang = useStore((s) => s.lang)
  const mbti = useStore((s) => s.mbti)
  const interests = useStore((s) => s.interests)
  const finder = useStore((s) => s.finder)
  const [answers, setAnswers] = useState<number[]>(finder?.answers ?? [])
  const [editing, setEditing] = useState(!finder)
  const done = answers.length === t.fd.qs.length && answers.every((a) => a === 0 || a === 1)

  const run = () => {
    const result = recommend(answers, mbti, interests)
    update(() => ({ finder: { answers, result, at: Date.now() } }))
    setEditing(false)
  }

  return (
    <div className="finder">
      <p className="hint">{t.fd.intro}</p>
      <label className="field">
        <span>{t.fd.mbti}</span>
        <select value={mbti} onChange={(e) => update(() => ({ mbti: e.target.value }))}>
          <option value="">{t.fd.mbtiNone}</option>
          {MBTI.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </label>
      {editing ? (
        <>
          {t.fd.qs.map(([q, a, b], i) => (
            <div key={q} className="fq">
              <p>{i + 1}. {q}</p>
              <div className="seg">
                {[a, b].map((label, v) => (
                  <button key={label} role="radio" aria-checked={answers[i] === v} onClick={() => { const n = [...answers]; n[i] = v; setAnswers(n) }}>{label}</button>
                ))}
              </div>
            </div>
          ))}
          <div className="row"><button className="btn btn-primary" disabled={!done} onClick={run}>{t.fd.run}</button></div>
        </>
      ) : finder && (
        <>
          <h3>{t.fd.result}</h3>
          <ul className="place-row">
            {finder.result.map(resolvePlace).filter(Boolean).map((x) => (
              <li key={x!.world.id + x!.place.id}>
                <a className="place-card" href={href(`w/${x!.world.id}/${x!.place.id}`)} style={{ ['--c' as string]: WORLDS.find((w) => w.id === x!.world.id)!.colors[1] }}>
                  <img src={`/thumbs/${x!.world.id}_${x!.place.id}.webp`} alt="" loading="lazy" width="320" height="200" />
                  <span className="place-card-text"><small>{t.worlds[x!.world.id].name}</small><strong>{lang === 'en' ? x!.place.en : x!.place.ko}</strong></span>
                </a>
              </li>
            ))}
          </ul>
          <div className="row"><button className="btn" onClick={() => setEditing(true)}>{t.fd.again}</button></div>
        </>
      )}
      <p className="note">{t.fd.note}</p>
    </div>
  )
}
