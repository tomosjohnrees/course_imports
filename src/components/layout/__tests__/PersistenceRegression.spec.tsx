import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import AppShell from '@/components/layout/AppShell'
import Home from '@/pages/Home'
import CoursePage from '@/pages/Course'
import { useCourseStore } from '@/store/course.store'
import type { Course as CourseData, CourseBookmarks, CourseNotes } from '@/types/course.types'

const courseWithEmptyId: CourseData = {
  id: '',
  title: 'No ID Course',
  description: 'Course intentionally missing an ID to reproduce persistence failures.',
  version: '1.0.0',
  author: 'Test',
  tags: [],
  topics: [
    {
      id: 'topic-1',
      title: 'Topic 1',
      blocks: [{ type: 'text', content: 'Hello world' }],
    },
  ],
  source: { type: 'local', path: '/tmp/no-id-course' },
}

function renderWithRouter() {
  const router = createMemoryRouter(
    [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/course', element: <CoursePage /> },
        ],
      },
    ],
    { initialEntries: ['/'] },
  )
  render(<RouterProvider router={router} />)
  return router
}

function createApiMocks() {
  const notesByCourse: Record<string, CourseNotes> = {}
  const bookmarksByCourse: Record<string, CourseBookmarks> = {}

  return {
    initialTheme: 'system' as const,
    course: {
      selectFolder: vi.fn().mockResolvedValue('/tmp/no-id-course'),
      loadFromFolder: vi.fn().mockResolvedValue({ success: true, course: courseWithEmptyId }),
      loadFromGitHub: vi.fn(),
      loadRecentCourse: vi.fn(),
      onFetchProgress: vi.fn().mockReturnValue(vi.fn()),
    },
    store: {
      getRecentCourses: vi.fn().mockResolvedValue([]),
      saveRecentCourse: vi.fn(),
      getProgress: vi.fn().mockResolvedValue(null),
      saveProgress: vi.fn(),
      getPreferences: vi.fn().mockResolvedValue({ theme: 'system' }),
      savePreferences: vi.fn(),
      clearAllProgress: vi.fn(),
      removeRecentCourse: vi.fn().mockResolvedValue(true),
    },
    notes: {
      save: vi.fn().mockImplementation(async (courseId: string, topicId: string, text: string) => {
        // Mirror the IPC handler contract: empty course IDs are rejected.
        if (typeof courseId !== 'string' || courseId.length === 0) return
        if (typeof topicId !== 'string' || topicId.length === 0) return
        if (typeof text !== 'string') return
        notesByCourse[courseId] = {
          ...(notesByCourse[courseId] ?? {}),
          [topicId]: { text, lastModified: Date.now() },
        }
      }),
      get: vi.fn(),
      getAll: vi.fn().mockImplementation(async (courseId: string) => {
        if (typeof courseId !== 'string' || courseId.length === 0) return null
        return notesByCourse[courseId] ?? null
      }),
    },
    bookmarks: {
      add: vi.fn().mockImplementation(async (courseId: string, topicId: string, blockIndex: number) => {
        // Mirror the IPC handler contract: empty course IDs are rejected.
        if (typeof courseId !== 'string' || courseId.length === 0) return
        if (typeof topicId !== 'string' || topicId.length === 0) return
        if (typeof blockIndex !== 'number' || !Number.isInteger(blockIndex) || blockIndex < 0) return
        const current = bookmarksByCourse[courseId] ?? []
        if (current.some((b) => b.topicId === topicId && b.blockIndex === blockIndex)) return
        bookmarksByCourse[courseId] = [
          ...current,
          { topicId, blockIndex, createdAt: Date.now() },
        ]
      }),
      remove: vi.fn().mockImplementation(async (courseId: string, topicId: string, blockIndex: number) => {
        if (typeof courseId !== 'string' || courseId.length === 0) return
        if (typeof topicId !== 'string' || topicId.length === 0) return
        if (typeof blockIndex !== 'number' || !Number.isInteger(blockIndex) || blockIndex < 0) return
        const current = bookmarksByCourse[courseId] ?? []
        bookmarksByCourse[courseId] = current.filter(
          (b) => !(b.topicId === topicId && b.blockIndex === blockIndex),
        )
      }),
      getAll: vi.fn().mockImplementation(async (courseId: string) => {
        if (typeof courseId !== 'string' || courseId.length === 0) return []
        return bookmarksByCourse[courseId] ?? []
      }),
    },
  }
}

async function openLocalCourse(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Open local folder' }))
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Back to courses' })).toBeInTheDocument()
  })
}

async function navigateBackToHome(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Back to courses' }))
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'Open local folder' })).toBeInTheDocument()
  })
}

beforeEach(() => {
  window.api = createApiMocks()
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
    configurable: true,
    value: vi.fn(),
    writable: true,
  })
  useCourseStore.getState().clearCourse()
})

afterEach(() => {
  useCourseStore.getState().clearCourse()
})

describe('Persistence regressions (no course ID)', () => {
  it('should keep bookmarks after leaving and reopening the same course', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    await openLocalCourse(user)

    await user.click(screen.getByRole('button', { name: 'Add bookmark' }))
    expect(screen.getByRole('button', { name: 'Remove bookmark' })).toBeInTheDocument()

    await navigateBackToHome(user)
    await openLocalCourse(user)

    expect(screen.getByRole('button', { name: 'Remove bookmark' })).toBeInTheDocument()
  })

  it('should keep notes after leaving and reopening the same course', async () => {
    const user = userEvent.setup()
    renderWithRouter()

    await openLocalCourse(user)

    await user.click(screen.getByRole('button', { name: /^Notes(?:Has notes)?$/ }))
    await user.type(screen.getByRole('textbox', { name: 'Topic notes' }), 'Persistent note')

    await navigateBackToHome(user)
    await openLocalCourse(user)

    await user.click(screen.getByRole('button', { name: /^Notes(?:Has notes)?$/ }))

    expect(screen.getByRole('textbox', { name: 'Topic notes' })).toHaveValue('Persistent note')
  })
})
