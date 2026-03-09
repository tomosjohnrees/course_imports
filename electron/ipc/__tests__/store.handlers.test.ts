// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn(),
  },
  safeStorage: {
    isEncryptionAvailable: vi.fn().mockReturnValue(false),
  },
}))

vi.mock('electron-store', () => {
  const data: Record<string, unknown> = { recentCourses: [], progress: {} }
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
  getProgress,
  saveProgress,
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
