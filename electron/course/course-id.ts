import { createHash } from 'crypto'

function hashSeed(seed: string): string {
  return createHash('sha256').update(seed).digest('hex').slice(0, 16)
}

/**
 * Normalises the course id from course metadata.
 * If missing/blank, generate a deterministic fallback ID based on course source.
 */
export function resolveCourseId(
  rawId: unknown,
  sourceType: 'local' | 'github',
  sourceKey: string,
): string {
  if (typeof rawId === 'string') {
    const trimmed = rawId.trim()
    if (trimmed.length > 0) return trimmed
  }

  return `auto-${sourceType}-${hashSeed(`${sourceType}:${sourceKey}`)}`
}
