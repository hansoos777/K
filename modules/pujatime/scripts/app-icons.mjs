// public/icon.svg로 안드로이드·iOS 앱 아이콘을 만듦. 프로젝트 폴더에서 `node scripts/app-icons.mjs` 실행.
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

const svg = 'public/icon.svg'
const png = (size, file) => sharp(svg, { density: 300 }).resize(size, size).flatten({ background: '#fbe6b4' }).png().toFile(file)

const android = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 }
for (const [name, size] of Object.entries(android)) {
  const dir = `android/app/src/main/res/mipmap-${name}`
  await png(size, `${dir}/ic_launcher.png`)
  await png(size, `${dir}/ic_launcher_round.png`)
  // 적응형 아이콘은 가장자리가 잘려서 전경을 작게 넣음
  const full = Math.round(size * (108 / 48))
  const inner = Math.round(full * 0.62)
  const icon = await sharp(svg, { density: 300 }).resize(inner, inner).png().toBuffer()
  await sharp({ create: { width: full, height: full, channels: 4, background: '#fbe6b4' } })
    .composite([{ input: icon, gravity: 'center' }])
    .png()
    .toFile(`${dir}/ic_launcher_foreground.png`)
}

await png(1024, 'ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png')

mkdirSync('store', { recursive: true })
await png(512, 'store/icon-512.png')
console.log('icons ok')
