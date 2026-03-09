import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
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

beforeEach(() => {
  useCourseStore.setState({
    course: null,
    activeTopic: null,
    progress: {},
  })
})

describe('Sidebar', () => {
  it('displays all topics in the correct order', () => {
    useCourseStore.setState({ course: mockCourse })
    render(<Sidebar />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
    expect(buttons[0]).toHaveTextContent('Introduction')
    expect(buttons[1]).toHaveTextContent('Getting Started')
    expect(buttons[2]).toHaveTextContent('Advanced Topics')
  })

  it('highlights the active topic', () => {
    useCourseStore.setState({
      course: mockCourse,
      activeTopic: 'topic-2',
    })
    render(<Sidebar />)

    const activeButton = screen.getByText('Getting Started').closest('button')!
    expect(activeButton.style.borderLeft).toBe(
      '3px solid var(--color-accent)',
    )
    expect(activeButton).toHaveAttribute('data-active', '')
  })

  it('updates active topic when a topic is clicked', async () => {
    useCourseStore.setState({ course: mockCourse })
    render(<Sidebar />)

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
    render(<Sidebar />)

    expect(screen.getByLabelText('Complete')).toBeInTheDocument()
  })

  it('displays the course title', () => {
    useCourseStore.setState({ course: mockCourse })
    render(<Sidebar />)

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
    render(<Sidebar />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '67')
    expect(screen.getByText('2 of 3 topics complete')).toBeInTheDocument()
  })

  it('shows 0% progress when no topics are complete', () => {
    useCourseStore.setState({ course: mockCourse })
    render(<Sidebar />)

    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toHaveAttribute('aria-valuenow', '0')
    expect(screen.getByText('0 of 3 topics complete')).toBeInTheDocument()
  })

  it('handles no course loaded gracefully', () => {
    render(<Sidebar />)

    expect(screen.queryAllByRole('button')).toHaveLength(0)
    expect(screen.getByText('0 of 0 topics complete')).toBeInTheDocument()
  })

  it('shows "In progress" indicator for viewed but incomplete topics', () => {
    useCourseStore.setState({
      course: mockCourse,
      progress: {
        'topic-2': { viewed: true, complete: false },
      },
    })
    render(<Sidebar />)

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
    render(<Sidebar />)

    expect(screen.getByLabelText('Complete')).toBeInTheDocument()
    expect(screen.getByLabelText('In progress')).toBeInTheDocument()
    // not-started topics have no icon
    const buttons = screen.getAllByRole('button')
    expect(buttons[2].querySelector('[aria-label]')).toBeNull()
  })

  it('updates indicators when progress state changes', () => {
    useCourseStore.setState({
      course: mockCourse,
      progress: {},
    })
    const { rerender } = render(<Sidebar />)

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
    rerender(<Sidebar />)

    expect(screen.getByLabelText('Complete')).toBeInTheDocument()
    expect(screen.getByLabelText('In progress')).toBeInTheDocument()
    expect(screen.getByText('1 of 3 topics complete')).toBeInTheDocument()
  })
})
