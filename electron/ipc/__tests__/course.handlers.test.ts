// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock electron
vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn(),
  },
  BrowserWindow: {
    getFocusedWindow: vi.fn(),
    getAllWindows: vi.fn().mockReturnValue([]),
  },
  dialog: {
    showOpenDialog: vi.fn(),
  },
  net: {
    fetch: vi.fn(),
    isOnline: vi.fn().mockReturnValue(true),
  },
}))

// Mock the store module
vi.mock('../../store', () => ({
  getStoredGitHubToken: vi.fn(),
  saveRecentCourse: vi.fn(),
  getStoredRecentCourse: vi.fn(),
  default: {},
}))

import { ipcMain } from 'electron'
import { getStoredGitHubToken, getStoredRecentCourse } from '../../store'
import { registerCourseHandlers } from '../course.handlers'
import { net } from 'electron'

const mockHandle = vi.mocked(ipcMain.handle)
const mockGetToken = vi.mocked(getStoredGitHubToken)
const mockFetch = vi.mocked(net.fetch)
const mockIsOnline = vi.mocked(net.isOnline)

function base64Encode(str: string): string {
  return Buffer.from(str).toString('base64')
}

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

const COURSE_META = {
  id: 'test-course',
  title: 'Test Course',
  description: 'A test course',
  version: '1.0.0',
  author: 'Test Author',
  tags: ['test'],
}

describe('course:loadFromGitHub handler', () => {
  let handler: (event: unknown, repoUrl: string) => Promise<unknown>

  beforeEach(() => {
    mockHandle.mockReset()
    mockFetch.mockReset()
    mockGetToken.mockReset()
    mockGetToken.mockReturnValue(undefined)
    mockIsOnline.mockReturnValue(true)

    registerCourseHandlers()

    // Find the loadFromGitHub handler
    const call = mockHandle.mock.calls.find(
      ([channel]) => channel === 'course:loadFromGitHub'
    )
    expect(call).toBeDefined()
    handler = call![1] as (event: unknown, repoUrl: string) => Promise<unknown>
  })

  it('returns success for a valid mock course', async () => {
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
        content: base64Encode(
          JSON.stringify([{ type: 'text', content: 'Hello world' }])
        ),
      })
    )

    const result = await handler(null, 'https://github.com/acme/course')

    expect(result).toEqual({
      success: true,
      course: expect.objectContaining({
        id: 'test-course',
        title: 'Test Course',
        source: { type: 'github', path: 'https://github.com/acme/course' },
        topics: [
          expect.objectContaining({
            id: '01-intro',
            blocks: [{ type: 'text', content: 'Hello world' }],
          }),
        ],
      }),
    })
  })

  it('returns error for invalid URL', async () => {
    const result = await handler(null, 'not-a-url')

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining('Invalid GitHub URL'),
    })
  })

  it('returns error for empty URL', async () => {
    const result = await handler(null, '')

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining('valid GitHub repository URL'),
    })
  })

  it('returns error when repo is not found (404)', async () => {
    mockFetch.mockResolvedValueOnce(errorResponse(404))

    const result = await handler(null, 'https://github.com/acme/nonexistent')

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining('course.json'),
    })
  })

  it('returns error on rate limiting (403)', async () => {
    mockFetch.mockResolvedValueOnce(
      errorResponse(403, 'API rate limit exceeded')
    )

    const result = await handler(null, 'https://github.com/acme/course')

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining('rate limit'),
    })
  })

  it('returns error on network failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('net::ERR_INTERNET_DISCONNECTED'))

    const result = await handler(null, 'https://github.com/acme/course')

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining('network connection was lost'),
    })
  })

  it('returns descriptive error when course.json is not found', async () => {
    mockFetch.mockResolvedValueOnce(errorResponse(404))

    const result = await handler(null, 'https://github.com/acme/course')

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining('acme/course'),
    })
  })

  it('returns error for invalid course structure', async () => {
    // course.json without topicOrder
    mockFetch.mockResolvedValueOnce(
      jsonResponse({
        content: base64Encode(JSON.stringify({ ...COURSE_META })),
      })
    )

    const result = await handler(null, 'https://github.com/acme/course')

    expect(result).toEqual({
      success: false,
      error: expect.stringContaining('topicOrder'),
    })
  })

  it('includes stored auth token in requests when present', async () => {
    mockGetToken.mockReturnValue('ghp_stored_token')

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
        content: base64Encode(
          JSON.stringify([{ type: 'text', content: 'Hello' }])
        ),
      })
    )

    await handler(null, 'https://github.com/acme/course')

    // Every fetch call should include the Authorization header
    for (const call of mockFetch.mock.calls) {
      const opts = call[1] as { headers: Record<string, string> }
      expect(opts.headers.Authorization).toBe('Bearer ghp_stored_token')
    }
  })

  it('does not include auth header when no token is stored', async () => {
    mockGetToken.mockReturnValue(undefined)

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
        content: base64Encode(
          JSON.stringify([{ type: 'text', content: 'Hello' }])
        ),
      })
    )

    await handler(null, 'https://github.com/acme/course')

    for (const call of mockFetch.mock.calls) {
      const opts = call[1] as { headers: Record<string, string> }
      expect(opts.headers.Authorization).toBeUndefined()
    }
  })

  it('does not leak auth token in error messages', async () => {
    mockGetToken.mockReturnValue('ghp_secret_token_12345')
    mockFetch.mockRejectedValueOnce(new Error('net::ERR_CONNECTION_REFUSED'))

    const result = (await handler(null, 'https://github.com/acme/course')) as {
      success: false
      error: string
    }

    expect(result.success).toBe(false)
    expect(result.error).not.toContain('ghp_secret_token_12345')
  })

  it('returns offline error when network is unavailable', async () => {
    mockIsOnline.mockReturnValue(false)

    const result = await handler(null, 'https://github.com/acme/course')

    expect(result).toEqual({
      success: false,
      error: "You're offline. Check your internet connection and try again.",
    })
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('returns mid-fetch network error when connection drops during fetch', async () => {
    mockIsOnline.mockReturnValue(true)
    mockFetch.mockRejectedValueOnce(new Error('net::ERR_INTERNET_DISCONNECTED'))

    const result = (await handler(null, 'https://github.com/acme/course')) as {
      success: false
      error: string
    }

    expect(result.success).toBe(false)
    expect(result.error).toContain('network connection was lost')
  })
})

describe('course:loadRecentCourse offline handling', () => {
  const mockGetRecentCourse = vi.mocked(getStoredRecentCourse)
  let handler: (event: unknown, courseId: string) => Promise<unknown>

  beforeEach(() => {
    mockHandle.mockReset()
    mockFetch.mockReset()
    mockGetToken.mockReset()
    mockGetToken.mockReturnValue(undefined)
    mockIsOnline.mockReturnValue(true)
    mockGetRecentCourse.mockReset()

    registerCourseHandlers()

    const call = mockHandle.mock.calls.find(
      ([channel]) => channel === 'course:loadRecentCourse'
    )
    expect(call).toBeDefined()
    handler = call![1] as (event: unknown, courseId: string) => Promise<unknown>
  })

  it('returns offline error for a GitHub recent course when offline', async () => {
    mockGetRecentCourse.mockReturnValue({
      id: 'gh-course',
      title: 'GitHub Course',
      sourceType: 'github',
      sourcePath: 'https://github.com/acme/course',
      lastLoaded: Date.now(),
    })
    mockIsOnline.mockReturnValue(false)

    const result = await handler(null, 'gh-course')

    expect(result).toEqual({
      success: false,
      error: "You're offline. Check your internet connection and try again.",
    })
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('does not return offline error for a local recent course when offline', async () => {
    mockGetRecentCourse.mockReturnValue({
      id: 'local-course',
      title: 'Local Course',
      sourceType: 'local',
      sourcePath: '/path/to/course',
      lastLoaded: Date.now(),
    })
    mockIsOnline.mockReturnValue(false)

    const result = (await handler(null, 'local-course')) as { success: boolean; error?: string }

    // Should attempt to load (will fail due to missing mock for loadCourse, but not with offline error)
    expect(result.success).toBe(false)
    expect(result.error).not.toContain("You're offline")
  })
})
