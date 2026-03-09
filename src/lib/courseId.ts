import type { Course } from '@/types/course.types'

function fnv1a64(input: string): string {
  let hash = 0xcbf29ce484222325n
  const prime = 0x100000001b3n

  for (let i = 0; i < input.length; i++) {
    hash ^= BigInt(input.charCodeAt(i))
    hash = BigInt.asUintN(64, hash * prime)
  }

  return hash.toString(16).padStart(16, '0')
}

export function resolveCourseId(
  rawId: unknown,
  sourceType: 'local' | 'github',
  sourcePath: string,
): string {
  if (typeof rawId === 'string') {
    const trimmed = rawId.trim()
    if (trimmed.length > 0) return trimmed
  }

  const normalisedPath = sourceType === 'github'
    ? sourcePath.trim().toLowerCase()
    : sourcePath.trim()
  const seed = `${sourceType}:${normalisedPath || 'unknown-source'}`

  return `auto-${sourceType}-${fnv1a64(seed)}`
}

export function withResolvedCourseId(course: Course): Course {
  const resolvedId = resolveCourseId(course.id, course.source.type, course.source.path)
  if (resolvedId === course.id) return course
  return { ...course, id: resolvedId }
}
