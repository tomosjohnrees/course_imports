/**
 * Generates app icons for all platforms (PNG, ICO, ICNS).
 * Run with: node scripts/generate-icons.js
 *
 * Creates a 512x512 icon with a rounded blue background and a white
 * book/import motif for the "Course Imports" education app.
 */

const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const SIZE = 512
const ICON_BG_RADIUS = 90
const BG_COLOR_TOP = [37, 99, 235]    // #2563EB (blue-600)
const BG_COLOR_BOTTOM = [30, 64, 175] // #1E40AF (blue-800)

// --- Drawing helpers ---

function lerp(a, b, t) {
  return a + (b - a) * t
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v))
}

/** Signed distance to a rounded rectangle centered at (cx, cy) with half-sizes (hw, hh) */
function sdRoundedRect(px, py, cx, cy, hw, hh, r) {
  const dx = Math.abs(px - cx) - hw + r
  const dy = Math.abs(py - cy) - hh + r
  const outside = Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2) - r
  const inside = Math.min(Math.max(dx, dy), 0)
  return outside + inside
}

/** Signed distance to a circle */
function sdCircle(px, py, cx, cy, r) {
  return Math.sqrt((px - cx) ** 2 + (py - cy) ** 2) - r
}

/** Signed distance to a line segment from (ax, ay) to (bx, by) */
function sdSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay
  const t = clamp(((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy), 0, 1)
  const cx = ax + t * dx, cy = ay + t * dy
  return Math.sqrt((px - cx) ** 2 + (py - cy) ** 2)
}

/** Convert signed distance to alpha (anti-aliased edge) */
function sdAlpha(dist) {
  return clamp(0.5 - dist, 0, 1)
}

// --- Icon rendering ---

function renderIcon() {
  const pixels = Buffer.alloc(SIZE * SIZE * 4)

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const idx = (y * SIZE + x) * 4

      // Vertical gradient t
      const gt = y / (SIZE - 1)

      // Background rounded rect
      const bgDist = sdRoundedRect(x, y, SIZE / 2, SIZE / 2, SIZE / 2, SIZE / 2, ICON_BG_RADIUS)
      const bgAlpha = sdAlpha(bgDist)

      if (bgAlpha <= 0) {
        // Transparent outside
        pixels[idx] = 0
        pixels[idx + 1] = 0
        pixels[idx + 2] = 0
        pixels[idx + 3] = 0
        continue
      }

      // Background gradient color
      let r = lerp(BG_COLOR_TOP[0], BG_COLOR_BOTTOM[0], gt)
      let g = lerp(BG_COLOR_TOP[1], BG_COLOR_BOTTOM[1], gt)
      let b = lerp(BG_COLOR_TOP[2], BG_COLOR_BOTTOM[2], gt)

      // --- Draw foreground shapes (white) ---
      // Design: an open book with a downward import arrow

      const cx = SIZE / 2 // 256
      const cy = SIZE / 2 // 256

      // Book - two pages as rounded rectangles
      const pageW = 85
      const pageH = 120
      const pageGap = 8
      const bookY = cy - 15

      // Left page
      const leftPageDist = sdRoundedRect(x, y, cx - pageGap - pageW / 2, bookY, pageW / 2, pageH / 2, 12)
      const leftPageAlpha = sdAlpha(leftPageDist)

      // Right page
      const rightPageDist = sdRoundedRect(x, y, cx + pageGap + pageW / 2, bookY, pageW / 2, pageH / 2, 12)
      const rightPageAlpha = sdAlpha(rightPageDist)

      // Book spine (vertical line in center)
      const spineDist = sdSegment(x, y, cx, bookY - pageH / 2 + 8, cx, bookY + pageH / 2 - 8) - 3
      const spineAlpha = sdAlpha(spineDist)

      // Horizontal lines on pages (text lines visual)
      let linesAlpha = 0
      const lineStartLeft = cx - pageGap - pageW + 18
      const lineEndLeft = cx - pageGap - 12
      const lineStartRight = cx + pageGap + 12
      const lineEndRight = cx + pageGap + pageW - 18
      for (let li = 0; li < 5; li++) {
        const lineY = bookY - pageH / 2 + 30 + li * 20
        // Left page lines
        const ldist = sdSegment(x, y, lineStartLeft, lineY, lineEndLeft, lineY) - 1.5
        linesAlpha = Math.max(linesAlpha, sdAlpha(ldist) * 0.25)
        // Right page lines
        const rdist = sdSegment(x, y, lineStartRight, lineY, lineEndRight, lineY) - 1.5
        linesAlpha = Math.max(linesAlpha, sdAlpha(rdist) * 0.25)
      }

      // Import arrow below the book
      const arrowCy = bookY + pageH / 2 + 50
      const arrowShaftLen = 35
      const arrowHeadSize = 22

      // Arrow shaft (vertical line)
      const shaftDist = sdSegment(x, y, cx, arrowCy - arrowShaftLen, cx, arrowCy + 5) - 4.5
      const shaftAlpha = sdAlpha(shaftDist)

      // Arrow head (triangle) - use three line segments
      const ahTop = arrowCy + 2
      const ahBottom = arrowCy + arrowHeadSize + 2
      // Left edge of arrowhead
      const ahLeftDist = sdSegment(x, y, cx - arrowHeadSize, ahTop, cx, ahBottom) - 4
      // Right edge of arrowhead
      const ahRightDist = sdSegment(x, y, cx + arrowHeadSize, ahTop, cx, ahBottom) - 4
      // Fill the triangle: check if point is inside
      const ahInTriangle =
        y >= ahTop && y <= ahBottom &&
        x >= cx - arrowHeadSize * (1 - (y - ahTop) / (ahBottom - ahTop)) - 2 &&
        x <= cx + arrowHeadSize * (1 - (y - ahTop) / (ahBottom - ahTop)) + 2
      const arrowHeadAlpha = ahInTriangle ? 1 : Math.max(sdAlpha(ahLeftDist), sdAlpha(ahRightDist))

      // Tray/base line under arrow
      const trayY = arrowCy + arrowHeadSize + 14
      const trayW = 55
      const trayDist = sdSegment(x, y, cx - trayW, trayY, cx + trayW, trayY) - 3.5
      const trayAlpha = sdAlpha(trayDist)
      // Tray side walls
      const trayLeftDist = sdSegment(x, y, cx - trayW, trayY, cx - trayW, trayY - 14) - 3.5
      const trayRightDist = sdSegment(x, y, cx + trayW, trayY, cx + trayW, trayY - 14) - 3.5
      const trayWallAlpha = Math.max(sdAlpha(trayLeftDist), sdAlpha(trayRightDist))

      // Composite white foreground elements
      const whiteAlpha = clamp(
        Math.max(leftPageAlpha, rightPageAlpha, spineAlpha, shaftAlpha, arrowHeadAlpha, trayAlpha, trayWallAlpha),
        0, 1
      )

      // Blue tint for the text lines on the book pages (they're slightly transparent white)
      const lineBlend = linesAlpha * (leftPageAlpha > 0.5 || rightPageAlpha > 0.5 ? 1 : 0)

      // Blend: first white shapes over blue bg, then lines over that
      if (whiteAlpha > 0) {
        r = lerp(r, 255, whiteAlpha)
        g = lerp(g, 255, whiteAlpha)
        b = lerp(b, 255, whiteAlpha)
      }
      if (lineBlend > 0) {
        // Lines are dark blue on white pages
        const lineR = lerp(BG_COLOR_TOP[0], BG_COLOR_BOTTOM[0], gt)
        const lineG = lerp(BG_COLOR_TOP[1], BG_COLOR_BOTTOM[1], gt)
        const lineB = lerp(BG_COLOR_TOP[2], BG_COLOR_BOTTOM[2], gt)
        r = lerp(r, lineR, lineBlend)
        g = lerp(g, lineG, lineBlend)
        b = lerp(b, lineB, lineBlend)
      }

      pixels[idx] = Math.round(r)
      pixels[idx + 1] = Math.round(g)
      pixels[idx + 2] = Math.round(b)
      pixels[idx + 3] = Math.round(bgAlpha * 255)
    }
  }

  return pixels
}

// --- PNG encoder ---

function encodePNG(pixels, width, height) {
  // Build raw scanline data (filter byte + RGBA pixels per row)
  const rawLen = height * (1 + width * 4)
  const raw = Buffer.alloc(rawLen)
  for (let y = 0; y < height; y++) {
    const rowOffset = y * (1 + width * 4)
    raw[rowOffset] = 0 // No filter
    pixels.copy(raw, rowOffset + 1, y * width * 4, (y + 1) * width * 4)
  }

  const compressed = zlib.deflateSync(raw, { level: 9 })

  const chunks = []

  // Signature
  chunks.push(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))

  function writeChunk(type, data) {
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length)
    const typeB = Buffer.from(type)
    const crcData = Buffer.concat([typeB, data])
    const crc = Buffer.alloc(4)
    crc.writeInt32BE(crc32(crcData))
    chunks.push(len, typeB, data, crc)
  }

  // IHDR
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8  // bit depth
  ihdr[9] = 6  // color type: RGBA
  ihdr[10] = 0 // compression
  ihdr[11] = 0 // filter
  ihdr[12] = 0 // interlace
  writeChunk('IHDR', ihdr)

  // IDAT
  writeChunk('IDAT', compressed)

  // IEND
  writeChunk('IEND', Buffer.alloc(0))

  return Buffer.concat(chunks)
}

// CRC32 table
const crcTable = new Int32Array(256)
for (let n = 0; n < 256; n++) {
  let c = n
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1)
  }
  crcTable[n] = c
}

function crc32(buf) {
  let crc = 0xFFFFFFFF
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8)
  }
  return crc ^ 0xFFFFFFFF
}

// --- ICO encoder ---

function encodeICO(pngData) {
  // ICO with a single embedded PNG
  const headerSize = 6
  const entrySize = 16
  const dataOffset = headerSize + entrySize

  const header = Buffer.alloc(headerSize)
  header.writeUInt16LE(0, 0)      // Reserved
  header.writeUInt16LE(1, 2)      // Type: ICO
  header.writeUInt16LE(1, 4)      // Number of images

  const entry = Buffer.alloc(entrySize)
  entry[0] = 0                     // Width (0 = 256+)
  entry[1] = 0                     // Height (0 = 256+)
  entry[2] = 0                     // Color palette
  entry[3] = 0                     // Reserved
  entry.writeUInt16LE(1, 4)       // Color planes
  entry.writeUInt16LE(32, 6)      // Bits per pixel
  entry.writeUInt32LE(pngData.length, 8)  // Data size
  entry.writeUInt32LE(dataOffset, 12)     // Data offset

  return Buffer.concat([header, entry, pngData])
}

// --- ICNS encoder ---

function encodeICNS(pngData512) {
  // ICNS format: magic + size + entries
  // ic09 = 512x512 PNG
  const type = Buffer.from('ic09')
  const entryLen = Buffer.alloc(4)
  entryLen.writeUInt32BE(8 + pngData512.length)

  const magic = Buffer.from('icns')
  const totalSize = Buffer.alloc(4)
  totalSize.writeUInt32BE(8 + 8 + pngData512.length)

  return Buffer.concat([magic, totalSize, type, entryLen, pngData512])
}

// --- Main ---

const buildDir = path.join(__dirname, '..', 'build')

console.log('Rendering 512x512 icon...')
const pixels = renderIcon()

console.log('Encoding PNG...')
const pngData = encodePNG(pixels, SIZE, SIZE)
fs.writeFileSync(path.join(buildDir, 'icon.png'), pngData)
console.log(`  icon.png: ${pngData.length} bytes`)

console.log('Encoding ICO...')
const icoData = encodeICO(pngData)
fs.writeFileSync(path.join(buildDir, 'icon.ico'), icoData)
console.log(`  icon.ico: ${icoData.length} bytes`)

console.log('Encoding ICNS...')
const icnsData = encodeICNS(pngData)
fs.writeFileSync(path.join(buildDir, 'icon.icns'), icnsData)
console.log(`  icon.icns: ${icnsData.length} bytes`)

console.log('Done! Icons saved to build/')
