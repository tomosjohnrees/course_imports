import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import BookmarksPanel from '../BookmarksPanel'
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
    {
      id: 'topic-1',
      title: 'Introduction',
      blocks: [
        { type: 'text', content: '# Welcome\nThis is the intro.' },
        { type: 'code', language: 'javascript', content: 'const x = 1' },
      ],
    },
    {
      id: 'topic-2',
      title: 'Getting Started',
      blocks: [
        { type: 'quiz', question: 'What is 2+2?', options: ['3', '4'], answer: 1 },
        { type: 'callout', style: 'info', body: 'Remember this tip' },
        { type: 'image', src: 'https://example.com/img.png', alt: 'A diagram', caption: 'Fig 1' },
      ],
    },
  ],
  source: { type: 'local', path: '/test' },
}

const onClose = vi.fn()
const onNavigate = vi.fn()

beforeEach(() => {
  onClose.mockClear()
  onNavigate.mockClear()
  useCourseStore.setState({
    course: mockCourse,
    activeTopic: 'topic-1',
    bookmarks: [],
  })
})

describe('BookmarksPanel', () => {
  it('renders nothing when not open', () => {
    const { container } = render(
      <BookmarksPanel open={false} onClose={onClose} onNavigate={onNavigate} />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders empty state when there are no bookmarks', () => {
    render(
      <BookmarksPanel open={true} onClose={onClose} onNavigate={onNavigate} />,
    )
    expect(screen.getByText('No bookmarks')).toBeInTheDocument()
    expect(
      screen.getByText('Click the bookmark icon on any block to save it here.'),
    ).toBeInTheDocument()
  })

  it('lists bookmarks grouped by topic', () => {
    useCourseStore.setState({
      bookmarks: [
        { topicId: 'topic-1', blockIndex: 0, createdAt: 1 },
        { topicId: 'topic-2', blockIndex: 0, createdAt: 2 },
        { topicId: 'topic-1', blockIndex: 1, createdAt: 3 },
      ],
    })
    render(
      <BookmarksPanel open={true} onClose={onClose} onNavigate={onNavigate} />,
    )

    // Topic headings
    expect(screen.getByText('Introduction')).toBeInTheDocument()
    expect(screen.getByText('Getting Started')).toBeInTheDocument()

    // Block previews as plain text
    expect(screen.getByText('Welcome')).toBeInTheDocument()
    expect(screen.getByText('javascript')).toBeInTheDocument()
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument()
  })

  it('shows block previews for different block types', () => {
    useCourseStore.setState({
      bookmarks: [
        { topicId: 'topic-2', blockIndex: 0, createdAt: 1 },
        { topicId: 'topic-2', blockIndex: 1, createdAt: 2 },
        { topicId: 'topic-2', blockIndex: 2, createdAt: 3 },
      ],
    })
    render(
      <BookmarksPanel open={true} onClose={onClose} onNavigate={onNavigate} />,
    )

    expect(screen.getByText('What is 2+2?')).toBeInTheDocument()
    expect(screen.getByText('Remember this tip')).toBeInTheDocument()
    expect(screen.getByText('Fig 1')).toBeInTheDocument()
  })

  it('calls onNavigate and onClose when a bookmark entry is clicked', async () => {
    useCourseStore.setState({
      bookmarks: [
        { topicId: 'topic-1', blockIndex: 0, createdAt: 1 },
      ],
    })
    const user = userEvent.setup()
    render(
      <BookmarksPanel open={true} onClose={onClose} onNavigate={onNavigate} />,
    )

    await user.click(screen.getByText('Welcome'))

    expect(onNavigate).toHaveBeenCalledWith('topic-1', 0)
    expect(onClose).toHaveBeenCalled()
  })

  it('closes when backdrop is clicked', async () => {
    const user = userEvent.setup()
    render(
      <BookmarksPanel open={true} onClose={onClose} onNavigate={onNavigate} />,
    )

    await user.click(document.querySelector('.bookmarks-backdrop')!)

    expect(onClose).toHaveBeenCalled()
  })

  it('closes on Escape key', async () => {
    const user = userEvent.setup()
    render(
      <BookmarksPanel open={true} onClose={onClose} onNavigate={onNavigate} />,
    )

    await user.keyboard('{Escape}')

    expect(onClose).toHaveBeenCalled()
  })

  it('renders bookmark labels and preview text as plain text', () => {
    const courseWithHtml: Course = {
      ...mockCourse,
      topics: [
        {
          id: 'topic-1',
          title: 'Introduction',
          blocks: [
            { type: 'text', content: '<script>alert("xss")</script>' },
          ],
        },
      ],
    }
    useCourseStore.setState({
      course: courseWithHtml,
      bookmarks: [
        { topicId: 'topic-1', blockIndex: 0, createdAt: 1 },
      ],
    })
    render(
      <BookmarksPanel open={true} onClose={onClose} onNavigate={onNavigate} />,
    )

    // The text should be rendered as plain text, not as HTML
    const entry = screen.getByText('<script>alert("xss")</script>')
    expect(entry.tagName).toBe('SPAN')
    expect(entry.innerHTML).not.toContain('<script>')
  })

  it('has correct dialog role and label', () => {
    render(
      <BookmarksPanel open={true} onClose={onClose} onNavigate={onNavigate} />,
    )
    expect(screen.getByRole('dialog', { name: 'Bookmarks' })).toBeInTheDocument()
  })
})
