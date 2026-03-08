// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtemp, rm, mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { validateCourse } from '../validator'

let tempDir: string

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), 'course-validator-'))
})

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true })
})

async function createValidCourse(dir: string) {
  const courseJson = {
    id: 'test-course',
    title: 'Test Course',
    description: 'A test course',
    version: '1.0.0',
    author: 'Test Author',
    tags: ['test'],
    topicOrder: ['01-intro', '02-basics'],
  }
  await writeFile(join(dir, 'course.json'), JSON.stringify(courseJson))
  await mkdir(join(dir, 'topics', '01-intro'), { recursive: true })
  await mkdir(join(dir, 'topics', '02-basics'), { recursive: true })
  await writeFile(
    join(dir, 'topics', '01-intro', 'content.json'),
    JSON.stringify([{ type: 'text', src: 'intro.md' }])
  )
  await writeFile(
    join(dir, 'topics', '02-basics', 'content.json'),
    JSON.stringify([{ type: 'code', language: 'python', src: 'example.py' }])
  )
}

describe('validateCourse', () => {
  it('returns valid for a well-formed course', async () => {
    await createValidCourse(tempDir)
    const result = await validateCourse(tempDir)
    expect(result).toEqual({ valid: true, errors: [] })
  })

  it('returns an error if course.json does not exist', async () => {
    await mkdir(join(tempDir, 'topics'), { recursive: true })
    const result = await validateCourse(tempDir)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('course.json does not exist')
  })

  it('returns an error if course.json is not valid JSON', async () => {
    await writeFile(join(tempDir, 'course.json'), '{not valid json')
    await mkdir(join(tempDir, 'topics'), { recursive: true })
    const result = await validateCourse(tempDir)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('course.json is not valid JSON')
  })

  it('returns an error if topics/ folder does not exist', async () => {
    await writeFile(
      join(tempDir, 'course.json'),
      JSON.stringify({ topicOrder: [] })
    )
    const result = await validateCourse(tempDir)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('topics/ folder does not exist')
  })

  it('returns an error if a topic folder does not exist', async () => {
    await writeFile(
      join(tempDir, 'course.json'),
      JSON.stringify({ topicOrder: ['missing-topic'] })
    )
    await mkdir(join(tempDir, 'topics'), { recursive: true })
    const result = await validateCourse(tempDir)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('Topic folder "topics/missing-topic" does not exist')
  })

  it('returns an error if a topic folder is missing content.json', async () => {
    await writeFile(
      join(tempDir, 'course.json'),
      JSON.stringify({ topicOrder: ['01-intro'] })
    )
    await mkdir(join(tempDir, 'topics', '01-intro'), { recursive: true })
    const result = await validateCourse(tempDir)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('topics/01-intro/content.json does not exist')
  })

  it('returns an error if content.json is not valid JSON', async () => {
    await writeFile(
      join(tempDir, 'course.json'),
      JSON.stringify({ topicOrder: ['01-intro'] })
    )
    await mkdir(join(tempDir, 'topics', '01-intro'), { recursive: true })
    await writeFile(join(tempDir, 'topics', '01-intro', 'content.json'), 'not json')
    const result = await validateCourse(tempDir)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('topics/01-intro/content.json is not valid JSON')
  })

  it('returns an error if content.json is not an array', async () => {
    await writeFile(
      join(tempDir, 'course.json'),
      JSON.stringify({ topicOrder: ['01-intro'] })
    )
    await mkdir(join(tempDir, 'topics', '01-intro'), { recursive: true })
    await writeFile(
      join(tempDir, 'topics', '01-intro', 'content.json'),
      JSON.stringify({ type: 'text' })
    )
    const result = await validateCourse(tempDir)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain('topics/01-intro/content.json is not an array')
  })

  it('returns an error if a block is missing a type field', async () => {
    await writeFile(
      join(tempDir, 'course.json'),
      JSON.stringify({ topicOrder: ['01-intro'] })
    )
    await mkdir(join(tempDir, 'topics', '01-intro'), { recursive: true })
    await writeFile(
      join(tempDir, 'topics', '01-intro', 'content.json'),
      JSON.stringify([{ src: 'intro.md' }])
    )
    const result = await validateCourse(tempDir)
    expect(result.valid).toBe(false)
    expect(result.errors).toContain(
      'topics/01-intro/content.json: block at index 0 is missing a "type" field'
    )
  })

  it('collects multiple errors rather than stopping at the first', async () => {
    // No course.json, no topics/ folder
    const result = await validateCourse(tempDir)
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveLength(2)
    expect(result.errors).toContain('course.json does not exist')
    expect(result.errors).toContain('topics/ folder does not exist')
  })

  it('collects errors across multiple topics', async () => {
    await writeFile(
      join(tempDir, 'course.json'),
      JSON.stringify({ topicOrder: ['topic-a', 'topic-b'] })
    )
    await mkdir(join(tempDir, 'topics', 'topic-a'), { recursive: true })
    await mkdir(join(tempDir, 'topics', 'topic-b'), { recursive: true })
    // topic-a has invalid content.json, topic-b is missing content.json
    await writeFile(join(tempDir, 'topics', 'topic-a', 'content.json'), 'bad')
    const result = await validateCourse(tempDir)
    expect(result.valid).toBe(false)
    expect(result.errors).toHaveLength(2)
    expect(result.errors).toContain('topics/topic-a/content.json is not valid JSON')
    expect(result.errors).toContain('topics/topic-b/content.json does not exist')
  })

  it('rejects path traversal in topicOrder entries', async () => {
    await writeFile(
      join(tempDir, 'course.json'),
      JSON.stringify({ topicOrder: ['../../etc'] })
    )
    await mkdir(join(tempDir, 'topics'), { recursive: true })
    const result = await validateCourse(tempDir)
    expect(result.valid).toBe(false)
    expect(result.errors[0]).toMatch(/path traversal/)
  })
})
