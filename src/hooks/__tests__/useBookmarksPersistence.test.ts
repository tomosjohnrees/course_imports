import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCourseStore } from '@/store/course.store'
import type { Course } from '@/types/course.types'

const mockAdd = vi.fn()
const mockRemove = vi.fn()

vi.stubGlobal('window', {
  api: {
    bookmarks: {
      add: mockAdd,
      remove: mockRemove,
    },
  },
})

// Import after stubbing window
const { useBookmarksPersistence, flushBookmarks } = await import('../useBookmarksPersistence')

let cleanupFn: (() => void) | undefined
vi.mock('react', () => ({
  useEffect: (fn: () => (() => void) | void) => {
    cleanupFn = fn() as (() => void) | undefined
  },
  useRef: (initial: unknown) => ({ current: initial }),
}))

const makeCourse = (id: string): Course => ({
  id,
  title: `Course ${id}`,
  description: '',
  version: '1.0.0',
  author: '',
  tags: [],
  topics: [
    { id: 'topic-1', title: 'T1', blocks: [] },
    { id: 'topic-2', title: 'T2', blocks: [] },
  ],
  source: { type: 'local', path: '/tmp' },
})

const courseA = makeCourse('course-a')
const courseB = makeCourse('course-b')

beforeEach(() => {
  mockAdd.mockClear()
  mockRemove.mockClear()
  cleanupFn = undefined
  useCourseStore.setState({
    course: null,
    activeTopic: null,
    progress: {},
    quizAnswers: {},
    checkpointCompletions: {},
    notes: {},
    bookmarks: [],
  })
})

afterEach(() => {
  if (cleanupFn) cleanupFn()
})

describe('useBookmarksPersistence', () => {
  it('persists a newly added bookmark', () => {
    useBookmarksPersistence()

    useCourseStore.getState().setCourse(courseA)
    useCourseStore.getState().addBookmark('topic-1', 2, 'my label')

    expect(mockAdd).toHaveBeenCalledOnce()
    expect(mockAdd).toHaveBeenCalledWith('course-a', 'topic-1', 2, 'my label')
    expect(mockRemove).not.toHaveBeenCalled()
  })

  it('persists a removed bookmark', () => {
    useBookmarksPersistence()

    useCourseStore.getState().setCourse(courseA)
    useCourseStore.getState().addBookmark('topic-1', 0)
    mockAdd.mockClear()

    useCourseStore.getState().removeBookmark('topic-1', 0)

    expect(mockRemove).toHaveBeenCalledOnce()
    expect(mockRemove).toHaveBeenCalledWith('course-a', 'topic-1', 0)
    expect(mockAdd).not.toHaveBeenCalled()
  })

  it('does not persist when bookmarks reference is unchanged', () => {
    useBookmarksPersistence()

    useCourseStore.getState().setCourse(courseA)
    mockAdd.mockClear()

    // Adding a duplicate does not change state
    useCourseStore.getState().addBookmark('topic-1', 0)
    mockAdd.mockClear()
    useCourseStore.getState().addBookmark('topic-1', 0)

    expect(mockAdd).not.toHaveBeenCalled()
    expect(mockRemove).not.toHaveBeenCalled()
  })

  it('does not persist when there is no course', () => {
    useBookmarksPersistence()

    // Directly set bookmarks with no course loaded
    useCourseStore.setState({ bookmarks: [{ topicId: 'topic-1', blockIndex: 0, createdAt: 1 }] })

    expect(mockAdd).not.toHaveBeenCalled()
    expect(mockRemove).not.toHaveBeenCalled()
  })

  it('does not delete bookmarks when setCourse reloads a course with persisted data', () => {
    useBookmarksPersistence()

    // Load course A and add a bookmark
    useCourseStore.getState().setCourse(courseA)
    useCourseStore.getState().addBookmark('topic-1', 3)
    mockAdd.mockClear()

    // Simulate reloading the same course with persisted bookmarks (atomic)
    const courseA2 = makeCourse('course-a')
    useCourseStore.getState().setCourse(courseA2, {
      bookmarks: [{ topicId: 'topic-1', blockIndex: 3, createdAt: 100 }],
    })

    // The hook must NOT delete or re-add bookmarks during a course load
    expect(mockRemove).not.toHaveBeenCalled()
    expect(mockAdd).not.toHaveBeenCalled()
  })

  it('does not delete bookmarks when switching to a different course', () => {
    useBookmarksPersistence()

    // Load course A and add bookmarks
    useCourseStore.getState().setCourse(courseA)
    useCourseStore.getState().addBookmark('topic-1', 0)
    useCourseStore.getState().addBookmark('topic-2', 1)
    mockAdd.mockClear()

    // Switch to course B with its own persisted bookmarks
    useCourseStore.getState().setCourse(courseB, {
      bookmarks: [{ topicId: 'topic-1', blockIndex: 5, createdAt: 200 }],
    })

    expect(mockRemove).not.toHaveBeenCalled()
    expect(mockAdd).not.toHaveBeenCalled()
  })

  it('persists correctly after course load then user action', () => {
    useBookmarksPersistence()

    // Load course with persisted bookmarks (atomic)
    useCourseStore.getState().setCourse(courseA, {
      bookmarks: [{ topicId: 'topic-1', blockIndex: 0, createdAt: 100 }],
    })
    mockAdd.mockClear()

    // User adds a new bookmark
    useCourseStore.getState().addBookmark('topic-2', 3, 'new one')

    expect(mockAdd).toHaveBeenCalledOnce()
    expect(mockAdd).toHaveBeenCalledWith('course-a', 'topic-2', 3, 'new one')
    expect(mockRemove).not.toHaveBeenCalled()
  })

  it('persists removal after course load then user action', () => {
    useBookmarksPersistence()

    // Load course with persisted bookmarks (atomic)
    useCourseStore.getState().setCourse(courseA, {
      bookmarks: [
        { topicId: 'topic-1', blockIndex: 0, createdAt: 100 },
        { topicId: 'topic-2', blockIndex: 5, createdAt: 200 },
      ],
    })
    mockAdd.mockClear()

    // User removes a bookmark
    useCourseStore.getState().removeBookmark('topic-1', 0)

    expect(mockRemove).toHaveBeenCalledOnce()
    expect(mockRemove).toHaveBeenCalledWith('course-a', 'topic-1', 0)
    expect(mockAdd).not.toHaveBeenCalled()
  })

  it('unsubscribes on cleanup', () => {
    useBookmarksPersistence()

    useCourseStore.getState().setCourse(courseA)
    mockAdd.mockClear()

    // Trigger cleanup
    if (cleanupFn) cleanupFn()
    cleanupFn = undefined

    // Further changes should not trigger persistence
    useCourseStore.getState().addBookmark('topic-1', 0)

    expect(mockAdd).not.toHaveBeenCalled()
    expect(mockRemove).not.toHaveBeenCalled()
  })

  it('flushBookmarks waits for pending writes to finish', async () => {
    let resolveAdd: (() => void) | undefined
    mockAdd.mockReturnValueOnce(new Promise<void>((resolve) => {
      resolveAdd = resolve
    }))

    useBookmarksPersistence()
    useCourseStore.getState().setCourse(courseA)
    useCourseStore.getState().addBookmark('topic-1', 0)

    let flushed = false
    const flushPromise = flushBookmarks().then(() => {
      flushed = true
    })

    await Promise.resolve()
    expect(flushed).toBe(false)

    resolveAdd?.()
    await flushPromise

    expect(flushed).toBe(true)
  })
})
