import * as THREE from 'three'
import { makeDevotee, type DevoteeOpts } from './devotee'

const canvas = document.querySelector<HTMLCanvasElement>('#c')!
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
renderer.setSize(1200, 800, false)

const scene = new THREE.Scene()
scene.background = new THREE.Color('#fbe9c6')
scene.add(new THREE.HemisphereLight(0xfff6e4, 0xe0b48a, 2.5))
const sun = new THREE.DirectionalLight(0xfff0d8, 1.5)
sun.position.set(-3, 6, 8)
scene.add(sun)

const camera = new THREE.PerspectiveCamera(10, 1200 / 800, 1, 200)
camera.position.set(0, 5.2, 40)
camera.lookAt(0, 1.95, 0)

function put(o: DevoteeOpts, x: number, y: number, yaw: number, mat = false) {
  const g = new THREE.Group()
  g.position.set(x, y, 0)
  let lift = 0
  if (mat) {
    const rug = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.09, 1.75), new THREE.MeshLambertMaterial({ color: 0xc23b24 }))
    const edge = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.095, 1.55), new THREE.MeshLambertMaterial({ color: 0xe9b84e }))
    const top = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.1, 1.45), new THREE.MeshLambertMaterial({ color: 0xa8301d }))
    rug.position.y = edge.position.y = top.position.y = 0.045
    g.add(rug, edge, top)
    lift = 0.1
  }
  const d = makeDevotee(o)
  d.position.y = lift
  d.rotation.y = yaw
  g.add(d)
  scene.add(g)
}

const CAST: Omit<DevoteeOpts, 'ratio' | 'pose'>[] = [
  { outfit: 'sari', skin: 0xb97a4c, cloth: 0xc2185b },
  { outfit: 'kurta', skin: 0x9c5f37, cloth: 0x1f7a78 },
  { outfit: 'sari', skin: 0xa86a40, cloth: 0x5e35b1, elder: true },
  { outfit: 'kurta', skin: 0xb07848, cloth: 0xfaf3e3, trim: 0xd9892b, elder: true },
]

CAST.forEach((c, i) => {
  const x = (i - 1.5) * 2.05
  const yaw = (1.5 - i) * 0.1
  put({ ...c, ratio: 2, pose: 'stand' }, x, 2.1, yaw)
  put({ ...c, ratio: 2, pose: 'sit' }, x, 0, yaw, true)
})

renderer.render(scene, camera)
document.title = 'ready'
