import { readFile, access } from 'fs/promises'
import { resolve, relative, isAbsolute } from 'path'
import type { ValidationResult } from '../../src/types/course.types'

export async function validateCourse(folderPath: string): Promise<ValidationResult> {
  const errors: string[] = []
  const root = resolve(folderPath)

  // Check course.json exists and is valid JSON
  const courseJsonPath = resolve(root, 'course.json')
  let courseData: Record<string, unknown> | null = null
  try {
    const raw = await readFile(courseJsonPath, 'utf-8')
    try {
      courseData = JSON.parse(raw) as Record<string, unknown>
    } catch {
      errors.push('course.json is not valid JSON')
    }
  } catch {
    errors.push('course.json does not exist')
  }

  // Check topics/ folder exists
  const topicsDir = resolve(root, 'topics')
  let topicsExist = false
  try {
    await access(topicsDir)
    topicsExist = true
  } catch {
    errors.push('topics/ folder does not exist')
  }

  // Validate each topic listed in topicOrder
  if (courseData && Array.isArray(courseData.topicOrder) && topicsExist) {
    for (const topicSlug of courseData.topicOrder) {
      if (typeof topicSlug !== 'string') continue

      // Security: prevent path traversal
      const topicPath = resolve(topicsDir, topicSlug)
      const rel = relative(topicsDir, topicPath)
      if (rel.startsWith('..') || isAbsolute(rel)) {
        errors.push(`Topic "${topicSlug}" attempts path traversal outside the course directory`)
        continue
      }

      // Check topic folder exists
      try {
        await access(topicPath)
      } catch {
        errors.push(`Topic folder "topics/${topicSlug}" does not exist`)
        continue
      }

      // Check content.json exists and is valid
      const contentPath = resolve(topicPath, 'content.json')
      let raw: string
      try {
        raw = await readFile(contentPath, 'utf-8')
      } catch {
        errors.push(`topics/${topicSlug}/content.json does not exist`)
        continue
      }

      let contentData: unknown
      try {
        contentData = JSON.parse(raw)
      } catch {
        errors.push(`topics/${topicSlug}/content.json is not valid JSON`)
        continue
      }

      if (!Array.isArray(contentData)) {
        errors.push(`topics/${topicSlug}/content.json is not an array`)
        continue
      }

      for (let i = 0; i < contentData.length; i++) {
        const block = contentData[i]
        if (!block || typeof block !== 'object' || !('type' in block)) {
          errors.push(
            `topics/${topicSlug}/content.json: block at index ${i} is missing a "type" field`
          )
        }
      }
    }
  }

  return { valid: errors.length === 0, errors }
}
