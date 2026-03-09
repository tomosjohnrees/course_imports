import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Sidebar from '../Sidebar'
import { useCourseStore } from '@/store/course.store'
import { flushProgress } from '@/hooks/useProgressPersistence'

vi.mock('@/hooks/useProgressPersistence', async () => {
  const actual = await vi.importActual('@/hooks/useProgressPersistence')
  return { ...actual, flushProgress: vi.fn() }
})

const mockSaveIndicatorVisible = { value: false }
vi.mock('@/hooks/useSaveIndicator', () => ({
  useSaveIndicator: () => mockSaveIndicatorVisible.value,
}))

import type { Course } from '@/types/course.types'

const mockCourse: Course = {
  id: 'test-course',
  title: 'Test Course',
  description: 'A test course',
  version: '1.0.0',
  author: 'Test',
  tags: [],
  topics: [
    { id: 'topic-1', title: 'Introduction', blocks: [] },
    { id: 'topic-2', title: 'Getting Started', blocks: [] },
    { id: 'topic-3', title: 'Advanced Topics', blocks: [] },
  ],
  source: { type: 'local', path: '/test' },
}

function renderSidebar(initialRoute = '/course') {
  const router = createMemoryRouter(
    [
      { path: '/', element: <div data-testid="home-page">Home</div> },
      {
        path: '/course',
        element: <Sidebar onOpenSettings={() => {}} />,
      },
    ],
    { initialEntries: [initialRoute] },
  )
  render(<RouterProvider router={router} />)
  return router
}

beforeEach(() => {
  mockSaveIndicatorVisible.value = false
  useCourseStore.setState({
    course: null,
    activeTopic: null,
    progress: {},
    notes: {},
  })
  window.api = {
    initialTheme: 'system',
    course: {
      selectFolder: vi.fn(),
      loadFromFolder: vi.fn(),
      loadFromGitHub: vi.fn(),
      loadRecentCourse: vi.fn(),
      onFetchProgress: vi.fn().mockReturnValue(vi.fn()),
    },
    store: {
      getRecentCourses: vi.fn().mockResolvedValue([]),
      saveRecentCourse: vi.fn(),
      getProgress: vi.fn(),
      saveProgress: vi.fn(),
      getPreferences: vi.fn().mockResolvedValue({ theme: 'system' }),
      savePreferences: vi.fn(),
      clearAllProgress: vi.fn(),
      removeRecentCourse: vi.fn().mockResolvedValue(true),
    },
    notes: {
      save: vi.fn(),
      get: vi.fn(),
      getAll: vi.fn().mockResolvedValue(null),
    },
    bookmarks: {
      add: vi.fn(),
      remove: vi.fn(),
      getAll: vi.fn().mockResolvedValue([]),
    },
  }
})

describe('Sidebar', () => {
  it('displays all topics in the correct order', () => {
    useCourseStore.setState({ course: mockCourse })
    renderSidebar()

    const buttons = screen.getAllByRole('button')
    // 1 back button + 3 topic buttons + 1 settings button
    expect(buttons).toHaveLength(5)
    expect(buttons[1]).toHaveTextContent('Introduction')
    expect(buttons[2]).toHaveTextContent('Getting Started')
    expect(buttons[3]).toHaveTextContent('Advanced Topics')
  })

  it('highlights the active topic', () => {
    useCourseStore.setState({
      course: mockCourse,
      activeTopic: 'topic-2',
    })
    renderSidebar()

    const activeButton = screen.getByText('Getting Started').closest('button')!
    expect(activeButton.style.borderLeft).toBe(
      '3px solid var(--color-accent)',
    )
    expect(activeButton).toHaveAttribute('data-active', '')
  })

  it('sets aria-current on the active topic', () => {
    useCourseStore.setState({
      course: mockCourse,
      activeTopic: 'topic-2',
    })
    renderSidebar()

    const activeButton = screen.getByText('Getting Started').closest('button')!
    expect(activeButton).toHaveAttribute('aria-current', 'true')

    const inactiveButton = screen.getByText('Introduction').closest('button')!
    expect(inactiveButton).not.toHaveAttribute('aria-current')
  })

  it('updates active topic when a topic is clicked', async () => {
    useCourseStore.setState({ course: mockCourse })
    renderSidebar()

    const user = userEvent.setup()
    await user.click(screen.getByText('Advanced Topics'))

    expect(useCourseStore.getState().activeTopic).toBe('topic-3')
  })

  it('shows completion indicators for completed topics', () => {
    useCourseStore.setState({
      course: mockCourse,
      progress: {
        'topic-1': { viewed: true, complete: true },
      },
    })
    renderSidebar()

    expect(screen.getByLabelText('Complete')).toBeInTheDocument()
  })

  it('displays the course title', () => {
    useCourseStore.setState({ course: mockCourse })
    renderSidebar()

    expect(screen.getByText('Test Course')).toBeInTheDocument()
  })

  it('shows progress bar reflecting completion state', () => {
    useCourseStore.setState({
      course: mockCourse,
      progress: {
        'topic-1': { viewed: true, complete: true },
        'topic-3': { viewed: true, complete: true },
      },
    })
    renderSidebar()

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '67')
    expect(screen.getByText('2 of 3 topics complete')).toBeInTheDocument()
  })

  it('shows 0% progress when no topics are complete', () => {
    useCourseStore.setState({ course: mockCourse })
    renderSidebar()

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '0')
    expect(screen.getByText('0 of 3 topics complete')).toBeInTheDocument()
  })

  it('handles no course loaded gracefully', () => {
    renderSidebar()

    // Back button + settings button when no course loaded
    expect(screen.queryAllByRole('button')).toHaveLength(2)
    expect(screen.getByText('0 of 0 topics complete')).toBeInTheDocument()
  })

  it('shows empty state with icon, heading, and message when course has zero topics', () => {
    const emptyCourse: Course = {
      ...mockCourse,
      topics: [],
    }
    useCourseStore.setState({ course: emptyCourse })
    renderSidebar()

    expect(screen.getByText('No topics')).toBeInTheDocument()
    expect(
      screen.getByText('This course has no topics yet.'),
    ).toBeInTheDocument()
    expect(document.querySelector('svg')).toBeInTheDocument()
    // Empty state heading should be h3, not h2, to maintain heading hierarchy
    const emptyHeading = screen.getByRole('heading', { level: 3 })
    expect(emptyHeading).toHaveTextContent('No topics')
    // Progress bar should show 100% (nothing to complete)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '100')
  })

  it('shows "In progress" indicator for viewed but incomplete topics', () => {
    useCourseStore.setState({
      course: mockCourse,
      progress: {
        'topic-2': { viewed: true, complete: false },
      },
    })
    renderSidebar()

    expect(screen.getByLabelText('In progress')).toBeInTheDocument()
    expect(screen.queryByLabelText('Complete')).not.toBeInTheDocument()
  })

  it('shows all three states simultaneously', () => {
    useCourseStore.setState({
      course: mockCourse,
      progress: {
        'topic-1': { viewed: true, complete: true },
        'topic-2': { viewed: true, complete: false },
        // topic-3 has no progress entry → not started
      },
    })
    renderSidebar()

    expect(screen.getByLabelText('Complete')).toBeInTheDocument()
    expect(screen.getByLabelText('In progress')).toBeInTheDocument()
    // not-started topics have no icon (index 3 = third topic, after back button)
    const buttons = screen.getAllByRole('button')
    expect(buttons[3].querySelector('[aria-label]')).toBeNull()
  })

  it('truncates long topic titles and shows tooltip', () => {
    const longTitle = 'A'.repeat(200)
    const courseWithLongTitles: Course = {
      ...mockCourse,
      title: longTitle,
      topics: [
        { id: 'topic-long', title: longTitle, blocks: [] },
      ],
    }
    useCourseStore.setState({ course: courseWithLongTitles })
    renderSidebar()

    // Course title has tooltip
    const heading = screen.getByText(longTitle, { selector: 'h2' })
    expect(heading).toHaveAttribute('title', longTitle)
    expect(heading.style.overflow).toBe('hidden')
    expect(heading.style.textOverflow).toBe('ellipsis')

    // Topic title has tooltip
    const topicSpan = screen.getByText(longTitle, { selector: 'span' })
    expect(topicSpan).toHaveAttribute('title', longTitle)
    expect(topicSpan.style.overflow).toBe('hidden')
    expect(topicSpan.style.textOverflow).toBe('ellipsis')
  })

  it('updates indicators when progress state changes', () => {
    useCourseStore.setState({
      course: mockCourse,
      progress: {},
    })
    renderSidebar()

    expect(screen.queryByLabelText('Complete')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('In progress')).not.toBeInTheDocument()

    act(() => {
      useCourseStore.setState({
        progress: {
          'topic-1': { viewed: true, complete: true },
          'topic-2': { viewed: true, complete: false },
        },
      })
    })

    expect(screen.getByLabelText('Complete')).toBeInTheDocument()
    expect(screen.getByLabelText('In progress')).toBeInTheDocument()
    expect(screen.getByText('1 of 3 topics complete')).toBeInTheDocument()
  })

  it('renders a "Back to courses" button in the sidebar', () => {
    useCourseStore.setState({ course: mockCourse })
    renderSidebar()

    const backButton = screen.getByRole('button', { name: 'Back to courses' })
    expect(backButton).toBeInTheDocument()
    expect(backButton).toHaveTextContent('Back to courses')
  })

  it('navigates to home when "Back to courses" is clicked', async () => {
    useCourseStore.setState({ course: mockCourse })
    const router = renderSidebar()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Back to courses' }))

    expect(router.state.location.pathname).toBe('/')
  })

  it('persists progress before navigating home', async () => {
    useCourseStore.setState({
      course: mockCourse,
      progress: {
        'topic-1': { viewed: true, complete: true },
      },
    })
    renderSidebar()

    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: 'Back to courses' }))

    expect(flushProgress).toHaveBeenCalled()
  })

  it('shows "Progress saved" indicator when save completes', () => {
    mockSaveIndicatorVisible.value = true
    useCourseStore.setState({ course: mockCourse })
    renderSidebar()

    const indicator = screen.getByText('Progress saved')
    expect(indicator).toBeInTheDocument()
    expect(indicator.style.opacity).toBe('1')
  })

  it('hides "Progress saved" indicator when not visible', () => {
    mockSaveIndicatorVisible.value = false
    useCourseStore.setState({ course: mockCourse })
    renderSidebar()

    const indicator = screen.getByText('Progress saved')
    expect(indicator.style.opacity).toBe('0')
  })

  it('does not show save indicator on initial render (hydration)', () => {
    useCourseStore.setState({ course: mockCourse })
    renderSidebar()

    const indicator = screen.getByText('Progress saved')
    expect(indicator.style.opacity).toBe('0')
  })

  it('shows notes indicator for topics that have notes', () => {
    useCourseStore.setState({
      course: mockCourse,
      notes: {
        'topic-2': { text: 'Some notes here', lastModified: Date.now() },
      },
    })
    renderSidebar()

    const indicators = screen.getAllByLabelText('Has notes')
    expect(indicators).toHaveLength(1)
  })

  it('does not show notes indicator for topics without notes', () => {
    useCourseStore.setState({
      course: mockCourse,
      notes: {},
    })
    renderSidebar()

    expect(screen.queryByLabelText('Has notes')).not.toBeInTheDocument()
  })

  it('does not show notes indicator for topics with empty note text', () => {
    useCourseStore.setState({
      course: mockCourse,
      notes: {
        'topic-1': { text: '', lastModified: Date.now() },
      },
    })
    renderSidebar()

    expect(screen.queryByLabelText('Has notes')).not.toBeInTheDocument()
  })
})
