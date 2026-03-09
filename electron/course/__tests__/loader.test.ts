// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtemp, rm, mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { loadCourse } from '../loader'

let tempDir: string

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), 'course-loader-'))
})

afterEach(async () => {
  await rm(tempDir, { recursive: true, force: true })
})

const COURSE_META = {
  id: 'test-course',
  title: 'Test Course',
  description: 'A test course',
  version: '1.0.0',
  author: 'Test Author',
  tags: ['test'],
}

async function createCourseJson(dir: string, topicOrder: string[]) {
  await writeFile(dir + '/course.json', JSON.stringify({ ...COURSE_META, topicOrder }))
}

async function createTopic(dir: string, slug: string, blocks: unknown[]) {
  const topicDir = join(dir, 'topics', slug)
  await mkdir(topicDir, { recursive: true })
  await writeFile(join(topicDir, 'content.json'), JSON.stringify(blocks))
  return topicDir
}

describe('loadCourse', () => {
  it('returns a fully resolved Course object for a valid folder', async () => {
    await createCourseJson(tempDir, ['01-intro', '02-basics'])
    await createTopic(tempDir, '01-intro', [
      { type: 'callout', style: 'info', body: 'Welcome!' },
    ])
    await createTopic(tempDir, '02-basics', [
      { type: 'text', content: 'Some text' },
    ])

    const result = await loadCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.course.id).toBe('test-course')
    expect(result.course.title).toBe('Test Course')
    expect(result.course.topics).toHaveLength(2)
    expect(result.course.topics[0].id).toBe('01-intro')
    expect(result.course.topics[1].id).toBe('02-basics')
    expect(result.course.source.type).toBe('local')
  })

  it('returns failure with descriptive error for an invalid folder', async () => {
    // Empty folder — no course.json, no topics/
    const result = await loadCourse(tempDir)

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error).toMatch(/course\.json/)
    expect(result.error).toMatch(/topics/)
  })

  it('orders topics according to topicOrder', async () => {
    await createCourseJson(tempDir, ['02-second', '01-first', '03-third'])
    await createTopic(tempDir, '02-second', [])
    await createTopic(tempDir, '01-first', [])
    await createTopic(tempDir, '03-third', [])

    const result = await loadCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.course.topics[0].id).toBe('02-second')
    expect(result.course.topics[1].id).toBe('01-first')
    expect(result.course.topics[2].id).toBe('03-third')
  })

  it('skips parsing when validation fails', async () => {
    // Create course.json but no topics/ folder
    await writeFile(
      join(tempDir, 'course.json'),
      JSON.stringify({ ...COURSE_META, topicOrder: ['01-intro'] })
    )

    const result = await loadCourse(tempDir)

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error).toMatch(/topics/)
  })

  it('returns validation errors as a user-readable string', async () => {
    // Missing both course.json and topics/
    const result = await loadCourse(tempDir)

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error).toContain('course.json does not exist')
    expect(result.error).toContain('topics/ folder does not exist')
  })

  it('produces error blocks for missing src files instead of failing', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    await createTopic(tempDir, '01-intro', [
      { type: 'text', src: 'nonexistent.md' },
    ])

    const result = await loadCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    const block = result.course.topics[0].blocks[0]
    expect(block.type).toBe('error')
    if (block.type !== 'error') return
    expect(block.filePath).toBe('nonexistent.md')
  })
})
