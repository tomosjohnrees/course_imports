import { resolve } from 'path'
import { validateCourse } from './validator'
import { parseCourse, type ParseResult } from './parser'

export async function loadCourse(folderPath: string): Promise<ParseResult> {
  const root = resolve(folderPath)

  const validation = await validateCourse(root)

  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors.join('\n'),
    }
  }

  return parseCourse(root)
}
