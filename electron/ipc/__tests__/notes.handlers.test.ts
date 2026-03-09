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
  }
  return {
    default: class {
      get(key: string) { return data[key] }
      set(key: string, value: unknown) { data[key] = value }
      delete(key: string) { delete data[key] }
      static _data = data
    },
  }
})

import { ipcMain } from 'electron'
import { registerNotesHandlers } from '../notes.handlers'
import { saveNote, getNote, getAllNotes } from '../../store'

const mockHandle = vi.mocked(ipcMain.handle)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let StoreClass: any
beforeEach(async () => {
  const mod = await import('electron-store')
  StoreClass = mod.default
  StoreClass._data.notes = {}
})

describe('notes:save handler', () => {
  let handler: (event: unknown, courseId: unknown, topicId: unknown, text: unknown) => Promise<unknown>

  beforeEach(() => {
    mockHandle.mockReset()
    registerNotesHandlers()

    const call = mockHandle.mock.calls.find(
      ([channel]) => channel === 'notes:save',
    )
    expect(call).toBeDefined()
    handler = call![1] as typeof handler
  })

  it('saves a new note for a course/topic', async () => {
    await handler(null, 'course-1', 'topic-1', 'My notes here')

    const note = getNote('course-1', 'topic-1')
    expect(note).not.toBeNull()
    expect(note!.text).toBe('My notes here')
    expect(note!.lastModified).toBeGreaterThan(0)
  })

  it('overwrites an existing note for the same course/topic', async () => {
    await handler(null, 'course-1', 'topic-1', 'First version')
    await handler(null, 'course-1', 'topic-1', 'Updated version')

    const note = getNote('course-1', 'topic-1')
    expect(note!.text).toBe('Updated version')
  })

  it('does not save when courseId is empty', async () => {
    await handler(null, '', 'topic-1', 'text')

    expect(getAllNotes('')).toBeNull()
  })

  it('does not save when courseId is not a string', async () => {
    await handler(null, 123, 'topic-1', 'text')

    expect(getNote('123', 'topic-1')).toBeNull()
  })

  it('does not save when topicId is empty', async () => {
    await handler(null, 'course-1', '', 'text')

    expect(getAllNotes('course-1')).toBeNull()
  })

  it('does not save when topicId is not a string', async () => {
    await handler(null, 'course-1', null, 'text')

    expect(getAllNotes('course-1')).toBeNull()
  })

  it('does not save when text is not a string', async () => {
    await handler(null, 'course-1', 'topic-1', 123)

    expect(getNote('course-1', 'topic-1')).toBeNull()
  })
})

describe('notes:get handler', () => {
  let handler: (event: unknown, courseId: unknown, topicId: unknown) => Promise<unknown>

  beforeEach(() => {
    mockHandle.mockReset()
    registerNotesHandlers()

    const call = mockHandle.mock.calls.find(
      ([channel]) => channel === 'notes:get',
    )
    expect(call).toBeDefined()
    handler = call![1] as typeof handler
  })

  it('returns null when no note exists', async () => {
    const result = await handler(null, 'course-1', 'topic-1')

    expect(result).toBeNull()
  })

  it('returns a saved note', async () => {
    saveNote('course-1', 'topic-1', 'Hello')

    const result = await handler(null, 'course-1', 'topic-1')

    expect(result).not.toBeNull()
    expect((result as { text: string }).text).toBe('Hello')
  })

  it('returns null for empty courseId', async () => {
    const result = await handler(null, '', 'topic-1')

    expect(result).toBeNull()
  })

  it('returns null for non-string courseId', async () => {
    const result = await handler(null, undefined, 'topic-1')

    expect(result).toBeNull()
  })

  it('returns null for empty topicId', async () => {
    const result = await handler(null, 'course-1', '')

    expect(result).toBeNull()
  })

  it('returns null for non-string topicId', async () => {
    const result = await handler(null, 'course-1', 42)

    expect(result).toBeNull()
  })
})

describe('notes:getAll handler', () => {
  let handler: (event: unknown, courseId: unknown) => Promise<unknown>

  beforeEach(() => {
    mockHandle.mockReset()
    registerNotesHandlers()

    const call = mockHandle.mock.calls.find(
      ([channel]) => channel === 'notes:getAll',
    )
    expect(call).toBeDefined()
    handler = call![1] as typeof handler
  })

  it('returns null when no notes exist for a course', async () => {
    const result = await handler(null, 'course-1')

    expect(result).toBeNull()
  })

  it('returns all notes for a course in a single call', async () => {
    saveNote('course-1', 'topic-1', 'Note 1')
    saveNote('course-1', 'topic-2', 'Note 2')

    const result = await handler(null, 'course-1')

    expect(result).not.toBeNull()
    const notes = result as Record<string, { text: string }>
    expect(notes['topic-1'].text).toBe('Note 1')
    expect(notes['topic-2'].text).toBe('Note 2')
  })

  it('does not return notes from other courses', async () => {
    saveNote('course-1', 'topic-1', 'Course 1 note')
    saveNote('course-2', 'topic-1', 'Course 2 note')

    const result = await handler(null, 'course-1')

    const notes = result as Record<string, { text: string }>
    expect(Object.keys(notes)).toHaveLength(1)
    expect(notes['topic-1'].text).toBe('Course 1 note')
  })

  it('returns null for empty courseId', async () => {
    const result = await handler(null, '')

    expect(result).toBeNull()
  })

  it('returns null for non-string courseId', async () => {
    const result = await handler(null, null)

    expect(result).toBeNull()
  })
})

describe('notes store functions', () => {
  it('getNote returns null for unknown course/topic', () => {
    expect(getNote('unknown', 'unknown')).toBeNull()
  })

  it('saveNote and getNote round-trip', () => {
    saveNote('c1', 't1', 'My note')

    const note = getNote('c1', 't1')
    expect(note).not.toBeNull()
    expect(note!.text).toBe('My note')
    expect(typeof note!.lastModified).toBe('number')
  })

  it('notes are scoped by course ID', () => {
    saveNote('c1', 't1', 'Course 1')
    saveNote('c2', 't1', 'Course 2')

    expect(getNote('c1', 't1')!.text).toBe('Course 1')
    expect(getNote('c2', 't1')!.text).toBe('Course 2')
  })

  it('note content is stored as plain text', () => {
    saveNote('c1', 't1', 'Just <b>text</b>')

    const note = getNote('c1', 't1')
    expect(note!.text).toBe('Just <b>text</b>')
    expect(Object.keys(note!)).toEqual(['text', 'lastModified'])
  })

  it('getAllNotes returns all topic notes for a course', () => {
    saveNote('c1', 't1', 'Note 1')
    saveNote('c1', 't2', 'Note 2')

    const all = getAllNotes('c1')
    expect(all).not.toBeNull()
    expect(Object.keys(all!)).toHaveLength(2)
  })

  it('getAllNotes returns null for unknown course', () => {
    expect(getAllNotes('unknown')).toBeNull()
  })
})
