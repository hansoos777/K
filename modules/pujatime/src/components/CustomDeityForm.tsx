import { useRef, useState, type ChangeEvent } from 'react'
import { useT } from '../i18n'
import { clearPhoto, getPhoto, savePhoto, shrinkPhoto } from '../lib/photo'

// 목록에 없는 신을 모시는 사람을 위한 입력. 이름과 사진 모두 이 기기에만 저장됨.
export function CustomDeityForm({ name, onName }: { name: string; onName: (v: string) => void }) {
  const t = useT()
  const input = useRef<HTMLInputElement>(null)
  const [photo, setPhoto] = useState(getPhoto)
  const [failed, setFailed] = useState(false)

  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setFailed(false)
    try {
      const url = await shrinkPhoto(file)
      if (!savePhoto(url)) throw new Error('storage')
      setPhoto(url)
    } catch {
      setFailed(true)
    }
  }

  return (
    <div className="stack">
      <label className="lbl">{t.customName}
        <input className="field" value={name} maxLength={40} placeholder={t.customNamePlaceholder} onChange={(e) => onName(e.target.value)} />
      </label>
      <input ref={input} type="file" accept="image/*" hidden onChange={pick} aria-label={t.customPhotoAdd} />
      {photo && <img className="custom-photo" src={photo} alt={name || t.customDeity} />}
      <button className="chip" onClick={() => input.current?.click()}>{photo ? t.customPhotoChange : t.customPhotoAdd}</button>
      {photo && (
        <button
          className="link"
          onClick={() => {
            clearPhoto()
            setPhoto(null)
          }}
        >
          {t.customPhotoRemove}
        </button>
      )}
      {failed && <p className="note">{t.customPhotoFail}</p>}
      <p className="note">{t.customNote}</p>
    </div>
  )
}
