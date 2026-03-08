// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { parseGitHubUrl, fetchFile, fetchDirectory, fetchCourse } from '../github'

// Mock electron's net module
vi.mock('electron', () => ({
  net: {
    fetch: vi.fn(),
  },
}))

import { net } from 'electron'
const mockFetch = vi.mocked(net.fetch)

function jsonResponse(data: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response
}

function errorResponse(status: number, body = ''): Response {
  return {
    ok: false,
    status,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(body),
  } as Response
}

function base64Encode(str: string): string {
  return Buffer.from(str).toString('base64')
}

describe('parseGitHubUrl', () => {
  it('parses https://github.com/owner/repo', () => {
    expect(parseGitHubUrl('https://github.com/acme/course')).toEqual({
      owner: 'acme',
      repo: 'course',
    })
  })

  it('parses github.com/owner/repo without protocol', () => {
    expect(parseGitHubUrl('github.com/acme/course')).toEqual({
      owner: 'acme',
      repo: 'course',
    })
  })

  it('parses URL with trailing slash', () => {
    expect(parseGitHubUrl('https://github.com/acme/course/')).toEqual({
      owner: 'acme',
      repo: 'course',
    })
  })

  it('parses URL with multiple trailing slashes', () => {
    expect(parseGitHubUrl('https://github.com/acme/course///')).toEqual({
      owner: 'acme',
      repo: 'course',
    })
  })

  it('parses URL with .git suffix', () => {
    expect(parseGitHubUrl('https://github.com/acme/course.git')).toEqual({
      owner: 'acme',
      repo: 'course',
    })
  })

  it('parses http:// URLs', () => {
    expect(parseGitHubUrl('http://github.com/acme/course')).toEqual({
      owner: 'acme',
      repo: 'course',
    })
  })

  it('handles owner/repo names with dots, hyphens, and underscores', () => {
    expect(parseGitHubUrl('https://github.com/my-org/my_course.v2')).toEqual({
      owner: 'my-org',
      repo: 'my_course.v2',
    })
  })

  it('trims whitespace', () => {
    expect(parseGitHubUrl('  https://github.com/acme/course  ')).toEqual({
      owner: 'acme',
      repo: 'course',
    })
  })

  it('throws for empty string', () => {
    expect(() => parseGitHubUrl('')).toThrow('Invalid GitHub URL')
  })

  it('throws for a non-GitHub URL', () => {
    expect(() => parseGitHubUrl('https://gitlab.com/acme/course')).toThrow(
      'Invalid GitHub URL'
    )
  })

  it('throws for a GitHub URL without repo', () => {
    expect(() => parseGitHubUrl('https://github.com/acme')).toThrow(
      'Invalid GitHub URL'
    )
  })

  it('throws for a GitHub URL with extra path segments', () => {
    expect(() =>
      parseGitHubUrl('https://github.com/acme/course/tree/main')
    ).toThrow('Invalid GitHub URL')
  })
})

describe('fetchFile', () => {
  const repo = { owner: 'acme', repo: 'course' }

  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('fetches and decodes a base64-encoded file', async () => {
    const content = '# Hello World'
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ content: base64Encode(content), encoding: 'base64' })
    )

    const result = await fetchFile(repo, 'README.md')

    expect(result).toBe('# Hello World')
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/repos/acme/course/contents/README.md',
      expect.objectContaining({
        headers: expect.objectContaining({
          Accept: 'application/vnd.github.v3+json',
        }),
      })
    )
  })

  it('includes Authorization header when token is provided', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ content: base64Encode('content'), encoding: 'base64' })
    )

    await fetchFile(repo, 'file.txt', { token: 'ghp_secret123' })

    expect(mockFetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer ghp_secret123',
        }),
      })
    )
  })

  it('throws on 404 response', async () => {
    mockFetch.mockResolvedValueOnce(errorResponse(404))

    await expect(fetchFile(repo, 'missing.md')).rejects.toThrow('Not found')
  })

  it('throws on rate limit (403)', async () => {
    mockFetch.mockResolvedValueOnce(
      errorResponse(403, 'API rate limit exceeded')
    )

    await expect(fetchFile(repo, 'file.md')).rejects.toThrow('rate limit')
  })

  it('throws on generic 403', async () => {
    mockFetch.mockResolvedValueOnce(errorResponse(403, 'Forbidden'))

    await expect(fetchFile(repo, 'file.md')).rejects.toThrow('forbidden')
  })

  it('throws on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('net::ERR_INTERNET_DISCONNECTED'))

    await expect(fetchFile(repo, 'file.md')).rejects.toThrow(
      'ERR_INTERNET_DISCONNECTED'
    )
  })
})

describe('fetchDirectory', () => {
  const repo = { owner: 'acme', repo: 'course' }

  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('returns directory entries', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse([
        { name: 'content.json', type: 'file', path: 'topics/01-intro/content.json' },
        { name: 'intro.md', type: 'file', path: 'topics/01-intro/intro.md' },
      ])
    )

    const entries = await fetchDirectory(repo, 'topics/01-intro')

    expect(entries).toEqual([
      { name: 'content.json', type: 'file', path: 'topics/01-intro/content.json' },
      { name: 'intro.md', type: 'file', path: 'topics/01-intro/intro.md' },
    ])
  })

  it('throws when path points to a file instead of directory', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({ name: 'file.txt', type: 'file', content: 'abc' })
    )

    await expect(fetchDirectory(repo, 'file.txt')).rejects.toThrow(
      'Expected directory listing'
    )
  })
})

describe('fetchCourse', () => {
  const repo = { owner: 'acme', repo: 'course' }

  const COURSE_META = {
    id: 'test-course',
    title: 'Test Course',
    description: 'A test course',
    version: '1.0.0',
    author: 'Test Author',
    tags: ['test'],
  }

  beforeEach(() => {
    mockFetch.mockReset()
  })

  it('assembles a correct course structure from GitHub API responses', async () => {
    // 1. Fetch course.json
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode(
          JSON.stringify({ ...COURSE_META, topicOrder: ['01-intro', '02-basics'] })
        ),
      })
    )

    // 2. Fetch topics/01-intro/content.json
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode(
          JSON.stringify([
            { type: 'text', content: 'Welcome to the course' },
            { type: 'callout', style: 'info', body: 'This is important' },
          ])
        ),
      })
    )

    // 3. Fetch topics/02-basics/content.json
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode(
          JSON.stringify([
            { type: 'code', language: 'js', content: 'console.log("hi")' },
          ])
        ),
      })
    )

    const result = await fetchCourse(repo)

    expect(result.success).toBe(true)
    if (!result.success) return

    expect(result.course.id).toBe('test-course')
    expect(result.course.title).toBe('Test Course')
    expect(result.course.source).toEqual({
      type: 'github',
      path: 'https://github.com/acme/course',
    })

    expect(result.course.topics).toHaveLength(2)
    expect(result.course.topics[0].id).toBe('01-intro')
    expect(result.course.topics[0].title).toBe('Intro')
    expect(result.course.topics[0].blocks).toEqual([
      { type: 'text', content: 'Welcome to the course' },
      { type: 'callout', style: 'info', body: 'This is important' },
    ])

    expect(result.course.topics[1].id).toBe('02-basics')
    expect(result.course.topics[1].blocks).toEqual([
      { type: 'code', language: 'js', content: 'console.log("hi")' },
    ])
  })

  it('fetches src-referenced files for text and code blocks', async () => {
    // course.json
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode(
          JSON.stringify({ ...COURSE_META, topicOrder: ['01-intro'] })
        ),
      })
    )

    // content.json with src references
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode(
          JSON.stringify([
            { type: 'text', src: 'readme.md' },
            { type: 'code', language: 'python', src: 'example.py', label: 'Example' },
          ])
        ),
      })
    )

    // readme.md file fetch
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode('# Welcome'),
      })
    )

    // example.py file fetch
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode('print("hello")'),
      })
    )

    const result = await fetchCourse(repo)

    expect(result.success).toBe(true)
    if (!result.success) return

    expect(result.course.topics[0].blocks[0]).toEqual({
      type: 'text',
      content: '# Welcome',
    })
    expect(result.course.topics[0].blocks[1]).toEqual({
      type: 'code',
      language: 'python',
      content: 'print("hello")',
      label: 'Example',
    })
  })

  it('fetches image blocks and encodes as data URIs', async () => {
    // course.json
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode(
          JSON.stringify({ ...COURSE_META, topicOrder: ['01-intro'] })
        ),
      })
    )

    // content.json with image block
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode(
          JSON.stringify([
            { type: 'image', src: 'diagram.png', alt: 'A diagram', caption: 'Fig 1' },
          ])
        ),
      })
    )

    // image file fetch (raw binary via base64 in API response)
    const imageBytes = Buffer.from([0x89, 0x50, 0x4e, 0x47])
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: imageBytes.toString('base64'),
      })
    )

    const result = await fetchCourse(repo)

    expect(result.success).toBe(true)
    if (!result.success) return

    const block = result.course.topics[0].blocks[0]
    expect(block.type).toBe('image')
    if (block.type !== 'image') return
    expect(block.src).toMatch(/^data:image\/png;base64,/)
    expect(block.alt).toBe('A diagram')
    expect(block.caption).toBe('Fig 1')
  })

  it('returns error when course.json fetch fails', async () => {
    mockFetch.mockResolvedValueOnce(errorResponse(404))

    const result = await fetchCourse(repo)

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error).toMatch(/course\.json/)
  })

  it('returns error when course.json is missing topicOrder', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode(JSON.stringify({ ...COURSE_META })),
      })
    )

    const result = await fetchCourse(repo)

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error).toMatch(/topicOrder/)
  })

  it('returns error when a topic content.json cannot be fetched', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode(
          JSON.stringify({ ...COURSE_META, topicOrder: ['01-intro'] })
        ),
      })
    )

    mockFetch.mockResolvedValueOnce(errorResponse(404))

    const result = await fetchCourse(repo)

    expect(result.success).toBe(false)
    if (result.success) return
    expect(result.error).toMatch(/content\.json/)
  })

  it('passes auth token through to all API requests', async () => {
    // course.json
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode(
          JSON.stringify({ ...COURSE_META, topicOrder: ['01-intro'] })
        ),
      })
    )

    // content.json
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode(JSON.stringify([{ type: 'text', content: 'hi' }])),
      })
    )

    await fetchCourse(repo, { token: 'ghp_mytoken' })

    // Every call should include the Authorization header
    for (const call of mockFetch.mock.calls) {
      const opts = call[1] as { headers: Record<string, string> }
      expect(opts.headers.Authorization).toBe('Bearer ghp_mytoken')
    }
  })

  it('handles quiz blocks correctly in fetched courses', async () => {
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode(
          JSON.stringify({ ...COURSE_META, topicOrder: ['01-intro'] })
        ),
      })
    )

    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode(
          JSON.stringify([
            {
              type: 'quiz',
              question: 'What is 1+1?',
              options: ['1', '2', '3'],
              answer: 1,
              explanation: 'Math',
            },
            {
              type: 'quiz',
              question: 'Explain recursion',
              sampleAnswer: 'A function that calls itself',
            },
          ])
        ),
      })
    )

    const result = await fetchCourse(repo)

    expect(result.success).toBe(true)
    if (!result.success) return

    expect(result.course.topics[0].blocks[0]).toEqual({
      type: 'quiz',
      variant: 'multiple-choice',
      question: 'What is 1+1?',
      options: ['1', '2', '3'],
      answer: 1,
      explanation: 'Math',
    })

    expect(result.course.topics[0].blocks[1]).toEqual({
      type: 'quiz',
      variant: 'free-text',
      question: 'Explain recursion',
      sampleAnswer: 'A function that calls itself',
    })
  })
})
