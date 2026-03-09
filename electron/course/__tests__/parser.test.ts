// @vitest-environment node
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtemp, rm, mkdir, writeFile } from 'fs/promises'
import { join } from 'path'
import { tmpdir } from 'os'
import { parseCourse } from '../parser'

let tempDir: string

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), 'course-parser-'))
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

describe('parseCourse', () => {
  it('parses a valid course with all metadata fields', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    await createTopic(tempDir, '01-intro', [
      { type: 'callout', style: 'info', body: 'Welcome!' },
    ])

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.course.id).toBe('test-course')
    expect(result.course.title).toBe('Test Course')
    expect(result.course.description).toBe('A test course')
    expect(result.course.version).toBe('1.0.0')
    expect(result.course.author).toBe('Test Author')
    expect(result.course.tags).toEqual(['test'])
    expect(result.course.source).toEqual({ type: 'local', path: tempDir })
  })

  it('sets topic.id from folder name and derives title', async () => {
    await createCourseJson(tempDir, ['01-introduction', '02-core-concepts'])
    await createTopic(tempDir, '01-introduction', [])
    await createTopic(tempDir, '02-core-concepts', [])

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.course.topics[0].id).toBe('01-introduction')
    expect(result.course.topics[0].title).toBe('Introduction')
    expect(result.course.topics[1].id).toBe('02-core-concepts')
    expect(result.course.topics[1].title).toBe('Core Concepts')
  })

  it('resolves text blocks with src by reading the markdown file', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    const topicDir = await createTopic(tempDir, '01-intro', [
      { type: 'text', src: 'intro.md' },
    ])
    await writeFile(join(topicDir, 'intro.md'), '# Hello World')

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    const block = result.course.topics[0].blocks[0]
    expect(block).toEqual({ type: 'text', content: '# Hello World' })
  })

  it('resolves code blocks with src by reading the source file', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    const topicDir = await createTopic(tempDir, '01-intro', [
      { type: 'code', language: 'python', src: 'hello.py', label: 'hello.py' },
    ])
    await writeFile(join(topicDir, 'hello.py'), 'print("hello")')

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    const block = result.course.topics[0].blocks[0]
    expect(block).toEqual({
      type: 'code',
      language: 'python',
      content: 'print("hello")',
      label: 'hello.py',
    })
  })

  it('resolves image blocks by encoding to base64 data URI', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    const topicDir = await createTopic(tempDir, '01-intro', [
      { type: 'image', src: 'diagram.png', alt: 'A diagram', caption: 'Figure 1' },
    ])
    const imageData = Buffer.from([0x89, 0x50, 0x4e, 0x47]) // PNG magic bytes
    await writeFile(join(topicDir, 'diagram.png'), imageData)

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    const block = result.course.topics[0].blocks[0]
    expect(block.type).toBe('image')
    if (block.type !== 'image') return
    expect(block.src).toMatch(/^data:image\/png;base64,/)
    expect(block.alt).toBe('A diagram')
    expect(block.caption).toBe('Figure 1')
  })

  it('passes through callout blocks directly', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    await createTopic(tempDir, '01-intro', [
      { type: 'callout', style: 'warning', body: 'Be careful!' },
    ])

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.course.topics[0].blocks[0]).toEqual({
      type: 'callout',
      style: 'warning',
      body: 'Be careful!',
    })
  })

  it('passes through multiple-choice quiz blocks with inferred variant', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    await createTopic(tempDir, '01-intro', [
      {
        type: 'quiz',
        question: 'What is 1+1?',
        options: ['1', '2', '3'],
        answer: 1,
        explanation: 'Basic math',
      },
    ])

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.course.topics[0].blocks[0]).toEqual({
      type: 'quiz',
      variant: 'multiple-choice',
      question: 'What is 1+1?',
      options: ['1', '2', '3'],
      answer: 1,
      explanation: 'Basic math',
    })
  })

  it('passes through free-text quiz blocks', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    await createTopic(tempDir, '01-intro', [
      {
        type: 'quiz',
        question: 'Explain recursion',
        sampleAnswer: 'A function that calls itself',
      },
    ])

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.course.topics[0].blocks[0]).toEqual({
      type: 'quiz',
      variant: 'free-text',
      question: 'Explain recursion',
      sampleAnswer: 'A function that calls itself',
    })
  })

  it('produces an error block when a src file does not exist', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    await createTopic(tempDir, '01-intro', [{ type: 'text', src: 'missing.md' }])

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    const block = result.course.topics[0].blocks[0]
    expect(block.type).toBe('error')
    if (block.type !== 'error') return
    expect(block.message).toMatch(/not found/)
    expect(block.filePath).toBe('missing.md')
  })

  it('returns an error when content.json contains malformed JSON', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    const topicDir = join(tempDir, 'topics', '01-intro')
    await mkdir(topicDir, { recursive: true })
    await writeFile(join(topicDir, 'content.json'), 'not valid json')

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error).toMatch(/malformed JSON/)
  })

  it('produces an error block for src paths containing path traversal', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    await createTopic(tempDir, '01-intro', [{ type: 'text', src: '../../etc/passwd' }])

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    const block = result.course.topics[0].blocks[0]
    expect(block.type).toBe('error')
    if (block.type !== 'error') return
    expect(block.message).toMatch(/path traversal/)
  })

  it('produces an error block for absolute src paths', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    await createTopic(tempDir, '01-intro', [{ type: 'text', src: '/etc/passwd' }])

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    const block = result.course.topics[0].blocks[0]
    expect(block.type).toBe('error')
    if (block.type !== 'error') return
    expect(block.message).toMatch(/absolute path/)
  })

  it('produces an error block for image files exceeding the size limit', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    const topicDir = await createTopic(tempDir, '01-intro', [
      { type: 'image', src: 'huge.png', alt: 'Huge image' },
    ])
    // Create a file larger than 10 MB
    const largeBuffer = Buffer.alloc(11 * 1024 * 1024)
    await writeFile(join(topicDir, 'huge.png'), largeBuffer)

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    const block = result.course.topics[0].blocks[0]
    expect(block.type).toBe('error')
    if (block.type !== 'error') return
    expect(block.message).toMatch(/exceeds maximum size/)
    expect(block.filePath).toBe('huge.png')
  })

  it('preserves topic ordering from topicOrder array', async () => {
    await createCourseJson(tempDir, ['02-second', '01-first'])
    await createTopic(tempDir, '02-second', [])
    await createTopic(tempDir, '01-first', [])

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.course.topics[0].id).toBe('02-second')
    expect(result.course.topics[1].id).toBe('01-first')
  })

  it('handles text blocks with inline content (no src)', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    await createTopic(tempDir, '01-intro', [
      { type: 'text', content: 'Inline text content' },
    ])

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.course.topics[0].blocks[0]).toEqual({
      type: 'text',
      content: 'Inline text content',
    })
  })

  it('produces an error block for unknown block types', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    await createTopic(tempDir, '01-intro', [
      { type: 'video', url: 'test.mp4' },
    ])

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    const block = result.course.topics[0].blocks[0]
    expect(block.type).toBe('error')
    if (block.type !== 'error') return
    expect(block.message).toMatch(/Unknown block type "video"/)
  })

  it('other blocks still parse when one block has a missing src', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    await createTopic(tempDir, '01-intro', [
      { type: 'text', content: 'Valid block' },
      { type: 'text', src: 'missing.md' },
      { type: 'callout', style: 'info', body: 'Also valid' },
    ])

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    const blocks = result.course.topics[0].blocks
    expect(blocks).toHaveLength(3)
    expect(blocks[0]).toEqual({ type: 'text', content: 'Valid block' })
    expect(blocks[1].type).toBe('error')
    expect(blocks[2]).toEqual({ type: 'callout', style: 'info', body: 'Also valid' })
  })

  it('handles code blocks with inline content (no src)', async () => {
    await createCourseJson(tempDir, ['01-intro'])
    await createTopic(tempDir, '01-intro', [
      { type: 'code', language: 'js', content: 'console.log("hi")' },
    ])

    const result = await parseCourse(tempDir)

    expect(result.success).toBe(true)
    if (!result.success) return
    expect(result.course.topics[0].blocks[0]).toEqual({
      type: 'code',
      language: 'js',
      content: 'console.log("hi")',
    })
  })
})
