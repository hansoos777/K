import * as THREE from 'three'
import { CAST, makeDevotee } from './devotee'

let cache: string[] | null = null

// 캐릭터 고르기 화면에 쓸 작은 그림을 3D 모델에서 한 번만 구워서 재사용.
export function avatarThumbs() {
  if (cache) return cache
  const canvas = document.createElement('canvas')
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true })
  renderer.setSize(220, 260, false)
  const scene = new THREE.Scene()
  scene.add(new THREE.HemisphereLight(0xfff6e4, 0xe0b48a, 2.5))
  const sun = new THREE.DirectionalLight(0xfff0d8, 1.5)
  sun.position.set(-3, 6, 8)
  scene.add(sun)
  const camera = new THREE.PerspectiveCamera(16, 220 / 260, 1, 50)
  camera.position.set(0, 1.5, 9)
  camera.lookAt(0, 0.96, 0)

  cache = CAST.map((c) => {
    const d = makeDevotee({ ...c, ratio: 2, pose: 'stand' })
    d.rotation.y = 0.18
    scene.add(d)
    renderer.render(scene, camera)
    const url = canvas.toDataURL('image/png')
    scene.remove(d)
    return url
  })
  renderer.dispose()
  renderer.forceContextLoss()
  return cache
}
