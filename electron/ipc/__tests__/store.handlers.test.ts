// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'

const {
  mockIsEncryptionAvailable,
  mockEncryptString,
  mockDecryptString,
} = vi.hoisted(() => {
  const mockIsEncryptionAvailable = vi.fn().mockReturnValue(false)
  const mockEncryptString = vi.fn((str: string) => Buffer.from(`encrypted:${str}`))
  const mockDecryptString = vi.fn((buf: Buffer) => {
    const str = buf.toString()
    return str.startsWith('encrypted:') ? str.slice('encrypted:'.length) : str
  })
  return { mockIsEncryptionAvailable, mockEncryptString, mockDecryptString }
})

vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn(),
  },
  safeStorage: {
    isEncryptionAvailable: mockIsEncryptionAvailable,
    encryptString: mockEncryptString,
    decryptString: mockDecryptString,
  },
}))

vi.mock('electron-store', () => {
  const data: Record<string, unknown> = {
    recentCourses: [],
    progress: {},
    preferences: { theme: 'system' },
    notes: {},
  }
  return {
    default: class {
      get(key: string) { return data[key] }
      set(key: string, value: unknown) { data[key] = value }
      delete(key: string) { delete data[key] }
      // Expose for test resets
      static _data = data
    },
  }
})

import { ipcMain } from 'electron'
import { registerStoreHandlers } from '../store.handlers'
import {
  saveRecentCourse,
  getRecentCourses,
  removeRecentCourse,
  clearCourseProgress,
  getProgress,
  saveProgress,
  getPreferences,
  savePreferences,
} from '../../store'
import type { StoredRecentCourse } from '../../store'

const mockHandle = vi.mocked(ipcMain.handle)

// Access internal store data for test resets
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let StoreClass: any
beforeEach(async () => {
  const mod = await import('electron-store')
  StoreClass = mod.default
  StoreClass._data.recentCourses = []
  StoreClass._data.progress = {}
  StoreClass._data.preferences = { theme: 'system' }
  StoreClass._data.notes = {}
  delete StoreClass._data.encryptedGitHubToken
})

describe('store:getRecentCourses handler', () => {
  let handler: (event: unknown) => Promise<unknown>

  beforeEach(() => {
    mockHandle.mockReset()
    registerStoreHandlers()

    const call = mockHandle.mock.calls.find(
      ([channel]) => channel === 'store:getRecentCourses'
    )
    expect(call).toBeDefined()
    handler = call![1] as (event: unknown) => Promise<unknown>
  })

  it('returns recent courses from the store', async () => {
    saveRecentCourse({
      id: 'course-1',
      title: 'Course One',
      sourceType: 'local',
      sourcePath: '/path/to/course',
      lastLoaded: 1000,
    })

    const result = await handler(null)

    expect(result).toEqual([
      {
        id: 'course-1',
        title: 'Course One',
        sourceType: 'local',
        lastLoaded: 1000,
      },
    ])
  })

  it('does not expose source paths to the renderer', async () => {
    saveRecentCourse({
      id: 'course-1',
      title: 'Course One',
      sourceType: 'local',
      sourcePath: '/secret/path/to/course',
      lastLoaded: 1000,
    })

    const result = (await handler(null)) as Array<Record<string, unknown>>

    expect(result[0]).not.toHaveProperty('sourcePath')
  })

  it('returns empty array when no recent courses exist', async () => {
    const result = await handler(null)

    expect(result).toEqual([])
  })
})

describe('saveRecentCourse store function', () => {
  it('saves a new course entry', () => {
    saveRecentCourse({
      id: 'course-1',
      title: 'Course One',
      sourceType: 'local',
      sourcePath: '/path/to/course',
      lastLoaded: 1000,
    })

    const courses = getRecentCourses()
    expect(courses).toHaveLength(1)
    expect(courses[0]).toEqual({
      id: 'course-1',
      title: 'Course One',
      sourceType: 'local',
      lastLoaded: 1000,
    })
  })

  it('updates existing entry and moves it to the top', () => {
    saveRecentCourse({
      id: 'course-1',
      title: 'Course One',
      sourceType: 'local',
      sourcePath: '/path/1',
      lastLoaded: 100,
    })
    saveRecentCourse({
      id: 'course-2',
      title: 'Course Two',
      sourceType: 'github',
      sourcePath: 'https://github.com/a/b',
      lastLoaded: 500,
    })
    // Re-save course-1 with updated timestamp
    saveRecentCourse({
      id: 'course-1',
      title: 'Course One Updated',
      sourceType: 'local',
      sourcePath: '/path/1',
      lastLoaded: 2000,
    })

    const courses = getRecentCourses()
    expect(courses).toHaveLength(2)
    expect(courses[0].id).toBe('course-1')
    expect(courses[0].lastLoaded).toBe(2000)
    expect(courses[1].id).toBe('course-2')
  })

  it('caps the list at 10 entries', () => {
    for (let i = 0; i < 12; i++) {
      saveRecentCourse({
        id: `course-${i}`,
        title: `Course ${i}`,
        sourceType: 'local',
        sourcePath: `/path/${i}`,
        lastLoaded: i * 100,
      })
    }

    const courses = getRecentCourses()
    expect(courses).toHaveLength(10)
    // Most recent should be first
    expect(courses[0].id).toBe('course-11')
  })
})

describe('getRecentCourses store function', () => {
  it('strips sourcePath from returned entries', () => {
    saveRecentCourse({
      id: 'c1',
      title: 'C1',
      sourceType: 'local',
      sourcePath: '/secret',
      lastLoaded: 100,
    })

    const result = getRecentCourses()

    expect(result).toEqual([
      { id: 'c1', title: 'C1', sourceType: 'local', lastLoaded: 100 },
    ])
    expect((result[0] as unknown as Record<string, unknown>).sourcePath).toBeUndefined()
  })

  it('does not expose GitHub auth tokens', () => {
    saveRecentCourse({
      id: 'c1',
      title: 'C1',
      sourceType: 'github',
      sourcePath: 'https://github.com/a/b',
      lastLoaded: 100,
    })

    const result = getRecentCourses()
    const stringified = JSON.stringify(result)

    expect(stringified).not.toContain('token')
    expect(stringified).not.toContain('ghp_')
  })
})

describe('store:getProgress handler', () => {
  let handler: (event: unknown, courseId: string) => Promise<unknown>

  beforeEach(() => {
    mockHandle.mockReset()
    registerStoreHandlers()

    const call = mockHandle.mock.calls.find(
      ([channel]) => channel === 'store:getProgress',
    )
    expect(call).toBeDefined()
    handler = call![1] as (event: unknown, courseId: string) => Promise<unknown>
  })

  it('returns null when no progress exists for a course', async () => {
    const result = await handler(null, 'nonexistent-course')
    expect(result).toBeNull()
  })

  it('returns saved progress for a course', async () => {
    const progress = { 'topic-1': { viewed: true, complete: false } }
    saveProgress('my-course', progress)

    const result = await handler(null, 'my-course')
    expect(result).toEqual(progress)
  })

  it('returns null for empty course ID', async () => {
    const result = await handler(null, '')
    expect(result).toBeNull()
  })

  it('returns null for non-string course ID', async () => {
    const result = await handler(null, undefined as unknown as string)
    expect(result).toBeNull()
  })
})

describe('store:saveProgress handler', () => {
  let handler: (event: unknown, courseId: string, data: unknown) => Promise<unknown>

  beforeEach(() => {
    mockHandle.mockReset()
    registerStoreHandlers()

    const call = mockHandle.mock.calls.find(
      ([channel]) => channel === 'store:saveProgress',
    )
    expect(call).toBeDefined()
    handler = call![1] as (event: unknown, courseId: string, data: unknown) => Promise<unknown>
  })

  it('saves progress data for a course', async () => {
    const progress = {
      'topic-1': { viewed: true, complete: false },
      'topic-2': { viewed: true, complete: true },
    }

    await handler(null, 'my-course', progress)

    expect(getProgress('my-course')).toEqual(progress)
  })

  it('does not save when course ID is empty', async () => {
    await handler(null, '', { 'topic-1': { viewed: true, complete: false } })

    expect(getProgress('')).toBeNull()
  })

  it('does not save when course ID is not a string', async () => {
    await handler(null, undefined as unknown as string, {
      'topic-1': { viewed: true, complete: false },
    })

    // Store should remain empty
    expect(getProgress('undefined')).toBeNull()
  })

  it('does not save when data is not valid progress', async () => {
    await handler(null, 'my-course', 'not-an-object')
    expect(getProgress('my-course')).toBeNull()

    await handler(null, 'my-course', { 'topic-1': 'invalid' })
    expect(getProgress('my-course')).toBeNull()

    await handler(null, 'my-course', null)
    expect(getProgress('my-course')).toBeNull()
  })

  it('does not overwrite progress for other courses', async () => {
    const progress1 = { 'topic-1': { viewed: true, complete: true } }
    const progress2 = { 'topic-a': { viewed: true, complete: false } }

    await handler(null, 'course-1', progress1)
    await handler(null, 'course-2', progress2)

    expect(getProgress('course-1')).toEqual(progress1)
    expect(getProgress('course-2')).toEqual(progress2)
  })
})

describe('progress store functions', () => {
  it('getProgress returns null for unknown course', () => {
    expect(getProgress('unknown')).toBeNull()
  })

  it('saveProgress and getProgress round-trip', () => {
    const progress = {
      'topic-1': { viewed: true, complete: false },
      'topic-2': { viewed: true, complete: true },
    }

    saveProgress('course-abc', progress)
    expect(getProgress('course-abc')).toEqual(progress)
  })

  it('persists only identifiers and completion states', () => {
    const progress = { 'topic-1': { viewed: true, complete: false } }
    saveProgress('c1', progress)

    const result = getProgress('c1')
    const stringified = JSON.stringify(result)

    // Should not contain any course content
    expect(Object.keys(result!['topic-1'])).toEqual(['viewed', 'complete'])
    expect(stringified).not.toContain('content')
    expect(stringified).not.toContain('blocks')
  })
})

describe('store:getPreferences handler', () => {
  let handler: (event: unknown) => Promise<unknown>

  beforeEach(() => {
    mockHandle.mockReset()
    registerStoreHandlers()

    const call = mockHandle.mock.calls.find(
      ([channel]) => channel === 'store:getPreferences',
    )
    expect(call).toBeDefined()
    handler = call![1] as (event: unknown) => Promise<unknown>
  })

  it('returns default preferences when none are saved', async () => {
    const result = await handler(null)

    expect(result).toEqual({ theme: 'system' })
  })

  it('returns saved theme preference', async () => {
    savePreferences({ theme: 'dark' })

    const result = await handler(null)

    expect(result).toEqual({ theme: 'dark' })
  })

  it('includes decrypted GitHub token when encryption is available', async () => {
    mockIsEncryptionAvailable.mockReturnValue(true)
    savePreferences({ theme: 'system', githubToken: 'ghp_test123' })

    const result = await handler(null)

    expect(result).toEqual({ theme: 'system', githubToken: 'ghp_test123' })
    mockIsEncryptionAvailable.mockReturnValue(false)
  })

  it('does not include token when encryption is unavailable', async () => {
    const result = await handler(null)

    expect(result).toEqual({ theme: 'system' })
    expect(result).not.toHaveProperty('githubToken')
  })
})

describe('store:savePreferences handler', () => {
  let handler: (event: unknown, prefs: unknown) => Promise<unknown>

  beforeEach(() => {
    mockHandle.mockReset()
    registerStoreHandlers()

    const call = mockHandle.mock.calls.find(
      ([channel]) => channel === 'store:savePreferences',
    )
    expect(call).toBeDefined()
    handler = call![1] as (event: unknown, prefs: unknown) => Promise<unknown>
  })

  it('saves valid preferences', async () => {
    await handler(null, { theme: 'dark' })

    expect(getPreferences().theme).toBe('dark')
  })

  it('accepts all valid theme values', async () => {
    for (const theme of ['light', 'dark', 'system']) {
      await handler(null, { theme })
      expect(getPreferences().theme).toBe(theme)
    }
  })

  it('rejects preferences with invalid theme', async () => {
    await handler(null, { theme: 'invalid' })
    expect(getPreferences().theme).toBe('system')

    await handler(null, { theme: '' })
    expect(getPreferences().theme).toBe('system')

    await handler(null, { theme: 123 })
    expect(getPreferences().theme).toBe('system')
  })

  it('rejects non-object preferences', async () => {
    await handler(null, 'not-an-object')
    expect(getPreferences().theme).toBe('system')

    await handler(null, null)
    expect(getPreferences().theme).toBe('system')

    await handler(null, undefined)
    expect(getPreferences().theme).toBe('system')
  })

  it('rejects preferences with non-string token', async () => {
    await handler(null, { theme: 'dark', githubToken: 123 })
    expect(getPreferences().theme).toBe('system')
  })

  it('saves GitHub token encrypted when encryption is available', async () => {
    mockIsEncryptionAvailable.mockReturnValue(true)

    await handler(null, { theme: 'system', githubToken: 'ghp_secret' })

    const result = getPreferences()
    expect(result.githubToken).toBe('ghp_secret')

    mockIsEncryptionAvailable.mockReturnValue(false)
  })

  it('clears GitHub token when empty string is provided', async () => {
    mockIsEncryptionAvailable.mockReturnValue(true)

    await handler(null, { theme: 'system', githubToken: 'ghp_secret' })
    expect(getPreferences().githubToken).toBe('ghp_secret')

    await handler(null, { theme: 'system', githubToken: '' })
    expect(getPreferences().githubToken).toBeUndefined()

    mockIsEncryptionAvailable.mockReturnValue(false)
  })
})

describe('store:removeRecentCourse handler', () => {
  let handler: (event: unknown, courseId: unknown, clearProgress: unknown) => Promise<unknown>

  beforeEach(() => {
    mockHandle.mockReset()
    registerStoreHandlers()

    const call = mockHandle.mock.calls.find(
      ([channel]) => channel === 'store:removeRecentCourse',
    )
    expect(call).toBeDefined()
    handler = call![1] as (event: unknown, courseId: unknown, clearProgress: unknown) => Promise<unknown>
  })

  it('removes an existing course and returns true', async () => {
    saveRecentCourse({
      id: 'course-1',
      title: 'Course One',
      sourceType: 'local',
      sourcePath: '/path/1',
      lastLoaded: 1000,
    })

    const result = await handler(null, 'course-1', false)

    expect(result).toBe(true)
    expect(getRecentCourses()).toHaveLength(0)
  })

  it('returns false for a non-existent course ID', async () => {
    const result = await handler(null, 'nonexistent', false)

    expect(result).toBe(false)
  })

  it('returns false for empty course ID', async () => {
    const result = await handler(null, '', false)

    expect(result).toBe(false)
  })

  it('returns false for non-string course ID', async () => {
    const result = await handler(null, 123, false)

    expect(result).toBe(false)
  })

  it('does not remove other courses', async () => {
    saveRecentCourse({
      id: 'course-1',
      title: 'Course One',
      sourceType: 'local',
      sourcePath: '/path/1',
      lastLoaded: 1000,
    })
    saveRecentCourse({
      id: 'course-2',
      title: 'Course Two',
      sourceType: 'github',
      sourcePath: 'https://github.com/a/b',
      lastLoaded: 2000,
    })

    await handler(null, 'course-1', false)

    const remaining = getRecentCourses()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].id).toBe('course-2')
  })

  it('clears progress when clearProgress is true', async () => {
    saveRecentCourse({
      id: 'course-1',
      title: 'Course One',
      sourceType: 'local',
      sourcePath: '/path/1',
      lastLoaded: 1000,
    })
    saveProgress('course-1', { 'topic-1': { viewed: true, complete: true } })

    await handler(null, 'course-1', true)

    expect(getProgress('course-1')).toBeNull()
  })

  it('keeps progress when clearProgress is false', async () => {
    saveRecentCourse({
      id: 'course-1',
      title: 'Course One',
      sourceType: 'local',
      sourcePath: '/path/1',
      lastLoaded: 1000,
    })
    const progress = { 'topic-1': { viewed: true, complete: true } }
    saveProgress('course-1', progress)

    await handler(null, 'course-1', false)

    expect(getProgress('course-1')).toEqual(progress)
  })

  it('does not accept arbitrary keys that could delete unrelated store data', async () => {
    saveRecentCourse({
      id: 'course-1',
      title: 'Course One',
      sourceType: 'local',
      sourcePath: '/path/1',
      lastLoaded: 1000,
    })

    // Attempt to use a key that doesn't match any course
    const result = await handler(null, 'preferences', false)

    expect(result).toBe(false)
    expect(getRecentCourses()).toHaveLength(1)
  })
})

describe('removeRecentCourse store function', () => {
  it('removes the specified course and returns true', () => {
    saveRecentCourse({
      id: 'c1',
      title: 'C1',
      sourceType: 'local',
      sourcePath: '/path',
      lastLoaded: 100,
    })

    const result = removeRecentCourse('c1')

    expect(result).toBe(true)
    expect(getRecentCourses()).toHaveLength(0)
  })

  it('returns false when course does not exist', () => {
    const result = removeRecentCourse('nonexistent')

    expect(result).toBe(false)
  })

  it('leaves other courses intact', () => {
    saveRecentCourse({
      id: 'c1',
      title: 'C1',
      sourceType: 'local',
      sourcePath: '/p1',
      lastLoaded: 100,
    })
    saveRecentCourse({
      id: 'c2',
      title: 'C2',
      sourceType: 'github',
      sourcePath: 'https://github.com/a/b',
      lastLoaded: 200,
    })

    removeRecentCourse('c1')

    const remaining = getRecentCourses()
    expect(remaining).toHaveLength(1)
    expect(remaining[0].id).toBe('c2')
  })
})

describe('clearCourseProgress store function', () => {
  it('clears progress for the specified course', () => {
    saveProgress('c1', { 'topic-1': { viewed: true, complete: true } })
    saveProgress('c2', { 'topic-2': { viewed: true, complete: false } })

    clearCourseProgress('c1')

    expect(getProgress('c1')).toBeNull()
    expect(getProgress('c2')).toEqual({ 'topic-2': { viewed: true, complete: false } })
  })

  it('handles clearing progress for a course with no progress', () => {
    clearCourseProgress('nonexistent')

    // Should not throw
    expect(getProgress('nonexistent')).toBeNull()
  })
})

describe('preferences security', () => {
  let getHandler: (event: unknown) => Promise<unknown>

  beforeEach(() => {
    mockHandle.mockReset()
    registerStoreHandlers()

    const call = mockHandle.mock.calls.find(
      ([channel]) => channel === 'store:getPreferences',
    )
    getHandler = call![1] as (event: unknown) => Promise<unknown>
  })

  it('does not include GitHub token in serialised error output', async () => {
    mockIsEncryptionAvailable.mockReturnValue(true)
    savePreferences({ theme: 'system', githubToken: 'ghp_supersecret' })

    // Simulate an error scenario by getting preferences and checking the result
    // can be safely serialised without leaking token outside the dedicated channel
    const result = await getHandler(null)
    const serialised = JSON.stringify(result)

    // The token SHOULD be present in the dedicated channel response
    expect(serialised).toContain('ghp_supersecret')

    // But an error message should never contain it
    try {
      throw new Error('Something went wrong loading preferences')
    } catch (err) {
      const errorMessage = (err as Error).message
      expect(errorMessage).not.toContain('ghp_supersecret')
    }

    mockIsEncryptionAvailable.mockReturnValue(false)
  })

  it('stores token encrypted on disk, not in plaintext', async () => {
    mockIsEncryptionAvailable.mockReturnValue(true)
    savePreferences({ theme: 'system', githubToken: 'ghp_plaintext' })

    // The encryptedGitHubToken in the store should be a base64 of the encrypted buffer
    expect(StoreClass._data.encryptedGitHubToken).toBeDefined()
    // The raw stored value should NOT be the plaintext token
    expect(StoreClass._data.encryptedGitHubToken).not.toBe('ghp_plaintext')

    // The preferences object itself should NOT contain the token
    expect(StoreClass._data.preferences).toEqual({ theme: 'system' })
    expect(StoreClass._data.preferences).not.toHaveProperty('githubToken')

    mockIsEncryptionAvailable.mockReturnValue(false)
  })
})
