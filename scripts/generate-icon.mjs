import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const source = join(root, 'DCicon.png')
const buildDir = join(root, 'build')

const sizes = [16, 24, 32, 48, 64, 128, 256]

await mkdir(buildDir, { recursive: true })

const pngBuffers = await Promise.all(
  sizes.map(async (size) => {
    const buffer = await sharp(source)
      .resize(size, size, { fit: 'cover' })
      .png()
      .toBuffer()
    await writeFile(join(buildDir, `icon-${size}.png`), buffer)
    return buffer
  }),
)

const appIcon = await sharp(source).resize(512, 512, { fit: 'cover' }).png().toBuffer()
await writeFile(join(buildDir, 'icon.png'), appIcon)

const ico = await pngToIco(pngBuffers)
await writeFile(join(buildDir, 'icon.ico'), ico)

console.log('Generated build/icon.ico and build/icon.png')
