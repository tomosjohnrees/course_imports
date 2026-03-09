import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Sidebar from '../Sidebar'
import { useCourseStore } from '@/store/course.store'
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

function renderSidebar() {
  const router = createMemoryRouter(
    [{ path: '/course', element: <Sidebar onOpenSettings={() => {}} /> }],
    { initialEntries: ['/course'] },
  )
  return render(<RouterProvider router={router} />)
}

beforeEach(() => {
  useCourseStore.setState({
    course: mockCourse,
    activeTopic: 'topic-1',
    progress: {},
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
    },
  }
})

describe('Sidebar keyboard navigation', () => {
  it('moves focus to the next topic on ArrowDown', async () => {
    renderSidebar()
    const user = userEvent.setup()

    const firstButton = screen.getByText('Introduction').closest('button')!
    firstButton.focus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByText('Getting Started').closest('button')).toHaveFocus()
  })

  it('moves focus to the previous topic on ArrowUp', async () => {
    renderSidebar()
    const user = userEvent.setup()

    const secondButton = screen.getByText('Getting Started').closest('button')!
    secondButton.focus()

    await user.keyboard('{ArrowUp}')
    expect(screen.getByText('Introduction').closest('button')).toHaveFocus()
  })

  it('wraps from last topic to first on ArrowDown', async () => {
    renderSidebar()
    const user = userEvent.setup()

    const lastButton = screen.getByText('Advanced Topics').closest('button')!
    lastButton.focus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByText('Introduction').closest('button')).toHaveFocus()
  })

  it('wraps from first topic to last on ArrowUp', async () => {
    renderSidebar()
    const user = userEvent.setup()

    const firstButton = screen.getByText('Introduction').closest('button')!
    firstButton.focus()

    await user.keyboard('{ArrowUp}')
    expect(screen.getByText('Advanced Topics').closest('button')).toHaveFocus()
  })

  it('navigates to topic on Enter key press', async () => {
    renderSidebar()
    const user = userEvent.setup()

    const secondButton = screen.getByText('Getting Started').closest('button')!
    secondButton.focus()

    await user.keyboard('{Enter}')
    expect(useCourseStore.getState().activeTopic).toBe('topic-2')
  })

  it('sets tabIndex 0 only on the active topic button', () => {
    useCourseStore.setState({ activeTopic: 'topic-2' })
    renderSidebar()

    const buttons = screen.getAllByRole('button')
    // back button, topic-1 = tabIndex -1, topic-2 = tabIndex 0, topic-3 = tabIndex -1, settings
    expect(buttons[1]).toHaveAttribute('tabindex', '-1')
    expect(buttons[2]).toHaveAttribute('tabindex', '0')
    expect(buttons[3]).toHaveAttribute('tabindex', '-1')
  })

  it('makes the first topic tabbable when no topic is active', () => {
    useCourseStore.setState({ activeTopic: null })
    renderSidebar()

    const buttons = screen.getAllByRole('button')
    // back button, topic-1 = tabIndex 0 (first tabbable), topic-2, topic-3
    expect(buttons[1]).toHaveAttribute('tabindex', '0')
    expect(buttons[2]).toHaveAttribute('tabindex', '-1')
    expect(buttons[3]).toHaveAttribute('tabindex', '-1')
  })

  it('navigates through all three topics sequentially', async () => {
    renderSidebar()
    const user = userEvent.setup()

    const firstButton = screen.getByText('Introduction').closest('button')!
    firstButton.focus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByText('Getting Started').closest('button')).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByText('Advanced Topics').closest('button')).toHaveFocus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByText('Introduction').closest('button')).toHaveFocus()
  })
})
