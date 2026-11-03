// 내가 모시는 신의 사진. 서버로 보내지 않고 이 기기에만 저장함.
// localStorage 용량이 작아서 올리기 전에 줄여서 저장.
const KEY = 'pujatime-photo'
const MAX = 900

export function getPhoto() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

export function savePhoto(dataUrl: string) {
  try {
    localStorage.setItem(KEY, dataUrl)
    return true
  } catch {
    return false
  }
}

export function clearPhoto() {
  try {
    localStorage.removeItem(KEY)
  } catch {
    // 저장소가 막혀 있으면 지울 것도 없음
  }
}

export async function shrinkPhoto(file: File) {
  const bitmap = await createImageBitmap(file)
  const k = Math.min(1, MAX / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * k)
  canvas.height = Math.round(bitmap.height * k)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return canvas.toDataURL('image/jpeg', 0.82)
}
