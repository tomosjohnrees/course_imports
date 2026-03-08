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
  const data: Record<string, unknown> = { recentCourses: [] }
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
import { saveRecentCourse, getRecentCourses } from '../../store'
import type { StoredRecentCourse } from '../../store'

const mockHandle = vi.mocked(ipcMain.handle)

// Access internal store data for test resets
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let StoreClass: any
beforeEach(async () => {
  const mod = await import('electron-store')
  StoreClass = mod.default
  StoreClass._data.recentCourses = []
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
