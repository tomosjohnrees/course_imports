import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCourseStore } from '@/store/course.store'
import type { Course } from '@/types/course.types'

const mockSaveProgress = vi.fn()

vi.stubGlobal('window', {
  api: {
    store: {
      saveProgress: mockSaveProgress,
    },
  },
})

// Import after stubbing window
const { useProgressPersistence } = await import('../useProgressPersistence')

// Minimal React hooks stub for non-component usage
let cleanupFn: (() => void) | undefined
vi.mock('react', () => ({
  useEffect: (fn: () => (() => void) | void) => {
    cleanupFn = fn() as (() => void) | undefined
  },
  useRef: (initial: unknown) => ({ current: initial }),
}))

const mockCourse: Course = {
  id: 'test-course',
  title: 'Test',
  description: '',
  version: '1.0.0',
  author: '',
  tags: [],
  topics: [
    { id: 'topic-1', title: 'T1', blocks: [] },
    { id: 'topic-2', title: 'T2', blocks: [] },
  ],
  source: { type: 'local', path: '/tmp' },
}

beforeEach(() => {
  vi.useFakeTimers()
  mockSaveProgress.mockClear()
  cleanupFn = undefined
  useCourseStore.setState({
    course: null,
    activeTopic: null,
    progress: {},
    quizAnswers: {},
  })
})

afterEach(() => {
  if (cleanupFn) cleanupFn()
  vi.useRealTimers()
})

describe('useProgressPersistence', () => {
  it('saves progress after debounce delay when progress changes', () => {
    useProgressPersistence()

    useCourseStore.getState().setCourse(mockCourse)
    useCourseStore.getState().setActiveTopic('topic-1')

    // Should not save immediately
    expect(mockSaveProgress).not.toHaveBeenCalled()

    // Advance past debounce
    vi.advanceTimersByTime(900)

    expect(mockSaveProgress).toHaveBeenCalledOnce()
    expect(mockSaveProgress).toHaveBeenCalledWith('test-course', {
      'topic-1': { viewed: true, complete: true },
    })
  })

  it('debounces multiple rapid progress changes into a single save', () => {
    useProgressPersistence()

    useCourseStore.getState().setCourse(mockCourse)
    useCourseStore.getState().setActiveTopic('topic-1')

    vi.advanceTimersByTime(200)
    useCourseStore.getState().setActiveTopic('topic-2')

    vi.advanceTimersByTime(200)

    // Should not have saved yet — debounce restarted
    expect(mockSaveProgress).not.toHaveBeenCalled()

    vi.advanceTimersByTime(700)

    // Now should have saved once with the latest progress
    expect(mockSaveProgress).toHaveBeenCalledOnce()
    expect(mockSaveProgress).toHaveBeenCalledWith('test-course', {
      'topic-1': { viewed: true, complete: true },
      'topic-2': { viewed: true, complete: true },
    })
  })

  it('does not save when progress reference does not change', () => {
    useProgressPersistence()

    useCourseStore.getState().setCourse(mockCourse)

    // setCourse resets progress to {} — that's one change
    // But only the initial setCourse triggers a subscriber call
    // Let's advance and check
    vi.advanceTimersByTime(900)

    // setCourse sets progress to {} and there's no course id at the time of prev state,
    // but the subscribe fires with the new state
    // Actually setCourse sets the course and progress simultaneously.
    // The subscriber compares progress references - {} !== {} so it fires.
    // But the courseId is now 'test-course', so it will save.
    // Let's just verify no extra saves happen without further changes.
    mockSaveProgress.mockClear()

    // Re-visit same topic (no progress change since already tracked)
    useCourseStore.getState().setActiveTopic('topic-1')
    useCourseStore.getState().setActiveTopic('topic-1')

    vi.advanceTimersByTime(900)

    // Second setActiveTopic('topic-1') doesn't change progress, so only one save
    expect(mockSaveProgress).toHaveBeenCalledOnce()
  })

  it('flushes pending save on cleanup', () => {
    useProgressPersistence()

    useCourseStore.getState().setCourse(mockCourse)
    useCourseStore.getState().setActiveTopic('topic-1')

    // Don't advance timers — save is still pending
    expect(mockSaveProgress).not.toHaveBeenCalled()

    // Trigger cleanup (simulates unmount)
    if (cleanupFn) cleanupFn()
    cleanupFn = undefined

    // Should have flushed
    expect(mockSaveProgress).toHaveBeenCalledOnce()
    expect(mockSaveProgress).toHaveBeenCalledWith('test-course', {
      'topic-1': { viewed: true, complete: true },
    })
  })
})
