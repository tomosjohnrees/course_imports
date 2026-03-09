import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * Automated WCAG AA contrast checks against all colour token pairs.
 *
 * Normal text: 4.5:1 minimum
 * Large text (headings, buttons): 3:1 minimum
 */

// ———— Contrast helpers ————

function hexToLinear(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const toLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  return [toLinear(r), toLinear(g), toLinear(b)]
}

function luminance(hex: string): number {
  const [r, g, b] = hexToLinear(hex)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(a: string, b: string): number {
  const l1 = luminance(a)
  const l2 = luminance(b)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// ———— Parse tokens from CSS ————

function extractTokens(css: string, startMarker: string): Record<string, string> {
  const idx = css.indexOf(startMarker)
  if (idx === -1) throw new Error(`Could not find "${startMarker}" in tokens.css`)
  // Find the opening brace after the marker
  const braceStart = css.indexOf('{', idx)
  // Find the matching closing brace (track nesting)
  let depth = 0
  let braceEnd = braceStart
  for (let i = braceStart; i < css.length; i++) {
    if (css[i] === '{') depth++
    else if (css[i] === '}') depth--
    if (depth === 0) { braceEnd = i; break }
  }
  const body = css.slice(braceStart + 1, braceEnd)
  const tokens: Record<string, string> = {}
  for (const line of body.split('\n')) {
    const m = line.match(/--([\w-]+)\s*:\s*(#[0-9A-Fa-f]{6})/)
    if (m) tokens[`--${m[1]}`] = m[2]
  }
  return tokens
}

const tokensCSS = readFileSync(resolve(__dirname, '../tokens.css'), 'utf-8')

const light = extractTokens(tokensCSS, ':root {')
const dark = extractTokens(tokensCSS, ':root[data-theme="dark"]')

// ———— Tests ————

function expectContrast(fg: string, bg: string, minimum: number, label: string) {
  const ratio = contrastRatio(fg, bg)
  expect(ratio, `${label}: ${fg} on ${bg} = ${ratio.toFixed(2)}:1, need ${minimum}:1`).toBeGreaterThanOrEqual(minimum)
}

describe('WCAG AA colour contrast — light mode', () => {
  const backgrounds = [
    ['--color-bg', light['--color-bg']],
    ['--color-surface', light['--color-surface']],
  ] as const

  it('primary text meets 4.5:1 on all backgrounds', () => {
    for (const [name, bg] of backgrounds) {
      expectContrast(light['--color-text-primary'], bg, 4.5, `text-primary on ${name}`)
    }
  })

  it('secondary text meets 4.5:1 on all backgrounds', () => {
    for (const [name, bg] of backgrounds) {
      expectContrast(light['--color-text-secondary'], bg, 4.5, `text-secondary on ${name}`)
    }
  })

  it('muted text meets 4.5:1 on all backgrounds', () => {
    for (const [name, bg] of backgrounds) {
      expectContrast(light['--color-text-muted'], bg, 4.5, `text-muted on ${name}`)
    }
  })

  it('accent (link) colour meets 4.5:1 on all backgrounds', () => {
    for (const [name, bg] of backgrounds) {
      expectContrast(light['--color-accent'], bg, 4.5, `accent on ${name}`)
    }
  })

  it('success text meets 4.5:1 on surface', () => {
    expectContrast(light['--color-success'], light['--color-surface'], 4.5, 'success on surface')
  })

  it('destructive text meets 4.5:1 on surface and destructive-subtle', () => {
    expectContrast(light['--color-destructive'], light['--color-surface'], 4.5, 'destructive on surface')
    expectContrast(light['--color-destructive'], light['--color-destructive-subtle'], 4.5, 'destructive on destructive-subtle')
  })

  it('headings (large text) meet 3:1 on bg', () => {
    expectContrast(light['--color-text-primary'], light['--color-bg'], 3, 'primary heading on bg')
    expectContrast(light['--color-text-secondary'], light['--color-bg'], 3, 'secondary heading (h6) on bg')
  })

  describe('callout text', () => {
    const calloutBgs = [
      ['info (accent-subtle)', light['--color-accent-subtle']],
      ['warning (warning-subtle)', light['--color-warning-subtle']],
      ['tip (tip-subtle)', light['--color-tip-subtle']],
    ] as const

    it('primary text meets 4.5:1 on all callout backgrounds', () => {
      for (const [name, bg] of calloutBgs) {
        expectContrast(light['--color-text-primary'], bg, 4.5, `text-primary on ${name}`)
      }
    })

    it('accent (link) colour meets 4.5:1 on all callout backgrounds', () => {
      for (const [name, bg] of calloutBgs) {
        expectContrast(light['--color-accent'], bg, 4.5, `accent on ${name}`)
      }
    })
  })
})

describe('WCAG AA colour contrast — dark mode', () => {
  const backgrounds = [
    ['--color-bg', dark['--color-bg']],
    ['--color-surface', dark['--color-surface']],
  ] as const

  it('primary text meets 4.5:1 on all backgrounds', () => {
    for (const [name, bg] of backgrounds) {
      expectContrast(dark['--color-text-primary'], bg, 4.5, `text-primary on ${name}`)
    }
  })

  it('secondary text meets 4.5:1 on all backgrounds', () => {
    for (const [name, bg] of backgrounds) {
      expectContrast(dark['--color-text-secondary'], bg, 4.5, `text-secondary on ${name}`)
    }
  })

  it('muted text meets 4.5:1 on all backgrounds', () => {
    for (const [name, bg] of backgrounds) {
      expectContrast(dark['--color-text-muted'], bg, 4.5, `text-muted on ${name}`)
    }
  })

  it('accent (link) colour meets 4.5:1 on all backgrounds', () => {
    for (const [name, bg] of backgrounds) {
      expectContrast(dark['--color-accent'], bg, 4.5, `accent on ${name}`)
    }
  })

  it('headings (large text) meet 3:1 on bg', () => {
    expectContrast(dark['--color-text-primary'], dark['--color-bg'], 3, 'primary heading on bg')
    expectContrast(dark['--color-text-secondary'], dark['--color-bg'], 3, 'secondary heading (h6) on bg')
  })

  describe('callout text', () => {
    const calloutBgs = [
      ['info (accent-subtle)', dark['--color-accent-subtle']],
      ['warning (warning-subtle)', dark['--color-warning-subtle']],
      ['tip (tip-subtle)', dark['--color-tip-subtle']],
    ] as const

    it('primary text meets 4.5:1 on all callout backgrounds', () => {
      for (const [name, bg] of calloutBgs) {
        expectContrast(dark['--color-text-primary'], bg, 4.5, `text-primary on ${name}`)
      }
    })

    // Dark mode callout links use accent-hover via CSS override
    it('accent-hover (callout link) colour meets 4.5:1 on all callout backgrounds', () => {
      for (const [name, bg] of calloutBgs) {
        expectContrast(dark['--color-accent-hover'], bg, 4.5, `accent-hover on ${name}`)
      }
    })
  })
})
