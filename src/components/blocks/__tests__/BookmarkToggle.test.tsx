import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import BookmarkToggle from '../BookmarkToggle'
import { useCourseStore } from '@/store/course.store'

beforeEach(() => {
  useCourseStore.setState({
    course: null,
    activeTopic: 'topic-1',
    bookmarks: [],
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

describe('BookmarkToggle', () => {
  it('renders nothing when no active topic', () => {
    useCourseStore.setState({ activeTopic: null })
    const { container } = render(<BookmarkToggle blockIndex={0} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders an "Add bookmark" button when block is not bookmarked', () => {
    render(<BookmarkToggle blockIndex={0} />)
    const btn = screen.getByRole('button', { name: 'Add bookmark' })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })

  it('renders a "Remove bookmark" button when block is bookmarked', () => {
    useCourseStore.setState({
      bookmarks: [
        { topicId: 'topic-1', blockIndex: 0, createdAt: Date.now() },
      ],
    })
    render(<BookmarkToggle blockIndex={0} />)
    const btn = screen.getByRole('button', { name: 'Remove bookmark' })
    expect(btn).toBeInTheDocument()
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    expect(btn).toHaveAttribute('data-active', '')
  })

  it('adds a bookmark when clicking an unbookmarked toggle', async () => {
    const user = userEvent.setup()
    render(<BookmarkToggle blockIndex={2} />)

    await user.click(screen.getByRole('button', { name: 'Add bookmark' }))

    const { bookmarks } = useCourseStore.getState()
    expect(bookmarks).toHaveLength(1)
    expect(bookmarks[0].topicId).toBe('topic-1')
    expect(bookmarks[0].blockIndex).toBe(2)
  })

  it('removes a bookmark when clicking a bookmarked toggle', async () => {
    useCourseStore.setState({
      bookmarks: [
        { topicId: 'topic-1', blockIndex: 0, createdAt: Date.now() },
      ],
    })
    const user = userEvent.setup()
    render(<BookmarkToggle blockIndex={0} />)

    await user.click(screen.getByRole('button', { name: 'Remove bookmark' }))

    const { bookmarks } = useCourseStore.getState()
    expect(bookmarks).toHaveLength(0)
  })

  it('does not show active state for a different block index', () => {
    useCourseStore.setState({
      bookmarks: [
        { topicId: 'topic-1', blockIndex: 5, createdAt: Date.now() },
      ],
    })
    render(<BookmarkToggle blockIndex={0} />)
    const btn = screen.getByRole('button', { name: 'Add bookmark' })
    expect(btn).not.toHaveAttribute('data-active')
  })
})
