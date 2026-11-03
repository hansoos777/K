// 링크를 공유할 때 보이는 미리보기 그림(public/og.jpg, 1200×630)을 만듦. 프로젝트 폴더에서 `node scripts/og-image.mjs` 실행.
// 메신저마다 그림 양옆을 잘라 정사각형으로 보여 주기도 해서 신상과 글자를 가운데에 모음.
import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { inflateSync } from 'node:zlib'
import sharp from 'sharp'

const W = 1200
const H = 630

// sharp는 woff를 못 읽어서 안에 든 글꼴 표를 풀어 ttf로 바꿈
function woffToTtf(file) {
  const w = readFileSync(file)
  const n = w.readUInt16BE(12)
  const tables = Array.from({ length: n }, (_, i) => {
    const at = 44 + i * 20
    const offset = w.readUInt32BE(at + 4)
    const size = w.readUInt32BE(at + 8)
    const full = w.readUInt32BE(at + 12)
    const raw = w.subarray(offset, offset + size)
    return { tag: w.subarray(at, at + 4), sum: w.readUInt32BE(at + 16), data: size < full ? inflateSync(raw) : raw }
  })
  const log = Math.floor(Math.log2(n))
  const head = Buffer.alloc(12 + n * 16)
  w.copy(head, 0, 4, 8)
  head.writeUInt16BE(n, 4)
  head.writeUInt16BE(2 ** log * 16, 6)
  head.writeUInt16BE(log, 8)
  head.writeUInt16BE(n * 16 - 2 ** log * 16, 10)
  let at = head.length
  const body = []
  tables.forEach((t, i) => {
    const row = 12 + i * 16
    t.tag.copy(head, row)
    head.writeUInt32BE(t.sum, row + 4)
    head.writeUInt32BE(at, row + 8)
    head.writeUInt32BE(t.data.length, row + 12)
    const pad = Buffer.alloc((4 - (t.data.length % 4)) % 4)
    body.push(t.data, pad)
    at += t.data.length + pad.length
  })
  const out = join(mkdtempSync(join(tmpdir(), 'og-')), 'font.ttf')
  writeFileSync(out, Buffer.concat([head, ...body]))
  return out
}

const brand = woffToTtf('node_modules/@fontsource/yatra-one/files/yatra-one-latin-400-normal.woff')
const body = woffToTtf('node_modules/@fontsource/mukta/files/mukta-latin-500-normal.woff')

const text = (value, font, fontfile, dpi) =>
  sharp({ text: { text: value, font, fontfile, dpi, rgba: true } }).png().toBuffer()

const paint = async (png, color) => {
  const mask = await sharp(png).extractChannel('alpha').toBuffer()
  const { width, height } = await sharp(png).metadata()
  return sharp({ create: { width, height, channels: 3, background: color } }).joinChannel(mask).png().toBuffer()
}

const flowers = Array.from({ length: 26 }, (_, i) => {
  const x = 22 + i * 47.2
  return `<circle cx="${x}" cy="24" r="21" fill="#f59b12"/><circle cx="${x}" cy="24" r="10" fill="#ffd24a"/>`
}).join('')

const backdrop = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs><radialGradient id="g" cx="50%" cy="46%" r="72%"><stop offset="0" stop-color="#e0701f"/><stop offset=".42" stop-color="#8a2a10"/><stop offset="1" stop-color="#1c0a05"/></radialGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>${flowers}
</svg>`)

const murti = await sharp('public/deities/shiva-murti.png').trim().resize({ height: 420 }).png().toBuffer()
const murtiW = (await sharp(murti).metadata()).width
const title = await paint(await text('PujaTime', 'Yatra One', brand, 360), '#ffe6a3')
const titleM = await sharp(title).metadata()
const line = await paint(await text('Your personal shrine, wherever you are.', 'Mukta', body, 130), '#fff3d6')
const lineM = await sharp(line).metadata()

mkdirSync('public', { recursive: true })
await sharp(backdrop)
  .composite([
    { input: murti, left: Math.round((W - murtiW) / 2), top: 54 },
    { input: title, left: Math.round((W - titleM.width) / 2), top: 474 },
    { input: line, left: Math.round((W - lineM.width) / 2), top: 574 },
  ])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile('public/og.jpg')
console.log('og ok')
