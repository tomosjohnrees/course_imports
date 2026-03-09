// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('electron', () => ({
  ipcMain: {
    handle: vi.fn(),
  },
  safeStorage: {
    isEncryptionAvailable: vi.fn().mockReturnValue(false),
    encryptString: vi.fn(),
    decryptString: vi.fn(),
  },
}))

vi.mock('electron-store', () => {
  const data: Record<string, unknown> = {
    recentCourses: [],
    progress: {},
    preferences: { theme: 'system' },
    notes: {},
    bookmarks: {},
  }
  return {
    default: class {
      get(key: string) { return data[key] }
      set(key: string, value: unknown) {
        if (key.includes('.')) {
          const [root, sub] = key.split('.')
          const obj = data[root] as Record<string, unknown>
          obj[sub] = value
        } else {
          data[key] = value
        }
      }
      delete(key: string) { delete data[key] }
      static _data = data
    },
  }
})

import { ipcMain } from 'electron'
import { registerBookmarkHandlers } from '../bookmarks.handlers'
import { addBookmark, removeBookmark, getAllBookmarks } from '../../store'

const mockHandle = vi.mocked(ipcMain.handle)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let StoreClass: any
beforeEach(async () => {
  const mod = await import('electron-store')
  StoreClass = mod.default
  StoreClass._data.bookmarks = {}
})

describe('bookmarks:add handler', () => {
  let handler: (event: unknown, courseId: unknown, topicId: unknown, blockIndex: unknown, label: unknown) => Promise<unknown>

  beforeEach(() => {
    mockHandle.mockReset()
    registerBookmarkHandlers()

    const call = mockHandle.mock.calls.find(
      ([channel]) => channel === 'bookmarks:add',
    )
    expect(call).toBeDefined()
    handler = call![1] as typeof handler
  })

  it('adds a bookmark for a course/topic/block', async () => {
    await handler(null, 'course-1', 'topic-1', 0, undefined)

    const bookmarks = getAllBookmarks('course-1')
    expect(bookmarks).toHaveLength(1)
    expect(bookmarks[0].topicId).toBe('topic-1')
    expect(bookmarks[0].blockIndex).toBe(0)
    expect(bookmarks[0].createdAt).toBeGreaterThan(0)
  })

  it('stores label when provided', async () => {
    await handler(null, 'course-1', 'topic-1', 0, 'Important code')

    const bookmarks = getAllBookmarks('course-1')
    expect(bookmarks[0].label).toBe('Important code')
  })

  it('adding a duplicate is a no-op', async () => {
    await handler(null, 'course-1', 'topic-1', 0, undefined)
    await handler(null, 'course-1', 'topic-1', 0, undefined)

    const bookmarks = getAllBookmarks('course-1')
    expect(bookmarks).toHaveLength(1)
  })

  it('does not add when courseId is empty', async () => {
    await handler(null, '', 'topic-1', 0, undefined)

    expect(getAllBookmarks('')).toHaveLength(0)
  })

  it('does not add when courseId is not a string', async () => {
    await handler(null, 123, 'topic-1', 0, undefined)

    expect(getAllBookmarks('123')).toHaveLength(0)
  })

  it('does not add when topicId is empty', async () => {
    await handler(null, 'course-1', '', 0, undefined)

    expect(getAllBookmarks('course-1')).toHaveLength(0)
  })

  it('does not add when topicId is not a string', async () => {
    await handler(null, 'course-1', null, 0, undefined)

    expect(getAllBookmarks('course-1')).toHaveLength(0)
  })

  it('does not add when blockIndex is not a number', async () => {
    await handler(null, 'course-1', 'topic-1', 'zero', undefined)

    expect(getAllBookmarks('course-1')).toHaveLength(0)
  })

  it('does not add when blockIndex is negative', async () => {
    await handler(null, 'course-1', 'topic-1', -1, undefined)

    expect(getAllBookmarks('course-1')).toHaveLength(0)
  })

  it('does not add when blockIndex is not an integer', async () => {
    await handler(null, 'course-1', 'topic-1', 1.5, undefined)

    expect(getAllBookmarks('course-1')).toHaveLength(0)
  })

  it('ignores non-string label values', async () => {
    await handler(null, 'course-1', 'topic-1', 0, 42)

    const bookmarks = getAllBookmarks('course-1')
    expect(bookmarks).toHaveLength(1)
    expect(bookmarks[0].label).toBeUndefined()
  })
})

describe('bookmarks:remove handler', () => {
  let handler: (event: unknown, courseId: unknown, topicId: unknown, blockIndex: unknown) => Promise<unknown>

  beforeEach(() => {
    mockHandle.mockReset()
    registerBookmarkHandlers()

    const call = mockHandle.mock.calls.find(
      ([channel]) => channel === 'bookmarks:remove',
    )
    expect(call).toBeDefined()
    handler = call![1] as typeof handler
  })

  it('removes an existing bookmark', async () => {
    addBookmark('course-1', 'topic-1', 0)
    expect(getAllBookmarks('course-1')).toHaveLength(1)

    await handler(null, 'course-1', 'topic-1', 0)

    expect(getAllBookmarks('course-1')).toHaveLength(0)
  })

  it('does nothing when bookmark does not exist', async () => {
    await handler(null, 'course-1', 'topic-1', 0)

    expect(getAllBookmarks('course-1')).toHaveLength(0)
  })

  it('does not remove when courseId is empty', async () => {
    addBookmark('course-1', 'topic-1', 0)

    await handler(null, '', 'topic-1', 0)

    expect(getAllBookmarks('course-1')).toHaveLength(1)
  })

  it('does not remove when blockIndex is not a number', async () => {
    addBookmark('course-1', 'topic-1', 0)

    await handler(null, 'course-1', 'topic-1', 'zero')

    expect(getAllBookmarks('course-1')).toHaveLength(1)
  })
})

describe('bookmarks:getAll handler', () => {
  let handler: (event: unknown, courseId: unknown) => Promise<unknown>

  beforeEach(() => {
    mockHandle.mockReset()
    registerBookmarkHandlers()

    const call = mockHandle.mock.calls.find(
      ([channel]) => channel === 'bookmarks:getAll',
    )
    expect(call).toBeDefined()
    handler = call![1] as typeof handler
  })

  it('returns empty array when no bookmarks exist for a course', async () => {
    const result = await handler(null, 'course-1')

    expect(result).toEqual([])
  })

  it('returns all bookmarks for a course', async () => {
    addBookmark('course-1', 'topic-1', 0)
    addBookmark('course-1', 'topic-1', 2)
    addBookmark('course-1', 'topic-2', 1)

    const result = await handler(null, 'course-1')

    expect(result).toHaveLength(3)
  })

  it('does not return bookmarks from other courses', async () => {
    addBookmark('course-1', 'topic-1', 0)
    addBookmark('course-2', 'topic-1', 0)

    const result = await handler(null, 'course-1')

    expect(result).toHaveLength(1)
  })

  it('returns empty array for empty courseId', async () => {
    const result = await handler(null, '')

    expect(result).toEqual([])
  })

  it('returns empty array for non-string courseId', async () => {
    const result = await handler(null, null)

    expect(result).toEqual([])
  })
})

describe('bookmarks store functions', () => {
  it('getAllBookmarks returns empty array for unknown course', () => {
    expect(getAllBookmarks('unknown')).toEqual([])
  })

  it('addBookmark and getAllBookmarks round-trip', () => {
    addBookmark('c1', 't1', 0)

    const bookmarks = getAllBookmarks('c1')
    expect(bookmarks).toHaveLength(1)
    expect(bookmarks[0].topicId).toBe('t1')
    expect(bookmarks[0].blockIndex).toBe(0)
    expect(typeof bookmarks[0].createdAt).toBe('number')
  })

  it('bookmarks are scoped by course ID', () => {
    addBookmark('c1', 't1', 0)
    addBookmark('c2', 't1', 0)

    expect(getAllBookmarks('c1')).toHaveLength(1)
    expect(getAllBookmarks('c2')).toHaveLength(1)
  })

  it('duplicate add is a no-op', () => {
    addBookmark('c1', 't1', 0)
    addBookmark('c1', 't1', 0)

    expect(getAllBookmarks('c1')).toHaveLength(1)
  })

  it('removeBookmark removes only the specified bookmark', () => {
    addBookmark('c1', 't1', 0)
    addBookmark('c1', 't1', 1)

    removeBookmark('c1', 't1', 0)

    const bookmarks = getAllBookmarks('c1')
    expect(bookmarks).toHaveLength(1)
    expect(bookmarks[0].blockIndex).toBe(1)
  })

  it('label is stored as plain text', () => {
    addBookmark('c1', 't1', 0, 'Just <b>text</b>')

    const bookmarks = getAllBookmarks('c1')
    expect(bookmarks[0].label).toBe('Just <b>text</b>')
  })
})
