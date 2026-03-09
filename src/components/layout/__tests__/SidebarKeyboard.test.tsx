import { render, screen } from '@testing-library/react'
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
    course: mockCourse,
    activeTopic: 'topic-1',
    progress: {},
  })
})

describe('Sidebar keyboard navigation', () => {
  it('moves focus to the next topic on ArrowDown', async () => {
    render(<Sidebar onOpenSettings={() => {}} />)
    const user = userEvent.setup()

    const firstButton = screen.getByText('Introduction').closest('button')!
    firstButton.focus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByText('Getting Started').closest('button')).toHaveFocus()
  })

  it('moves focus to the previous topic on ArrowUp', async () => {
    render(<Sidebar onOpenSettings={() => {}} />)
    const user = userEvent.setup()

    const secondButton = screen.getByText('Getting Started').closest('button')!
    secondButton.focus()

    await user.keyboard('{ArrowUp}')
    expect(screen.getByText('Introduction').closest('button')).toHaveFocus()
  })

  it('wraps from last topic to first on ArrowDown', async () => {
    render(<Sidebar onOpenSettings={() => {}} />)
    const user = userEvent.setup()

    const lastButton = screen.getByText('Advanced Topics').closest('button')!
    lastButton.focus()

    await user.keyboard('{ArrowDown}')
    expect(screen.getByText('Introduction').closest('button')).toHaveFocus()
  })

  it('wraps from first topic to last on ArrowUp', async () => {
    render(<Sidebar onOpenSettings={() => {}} />)
    const user = userEvent.setup()

    const firstButton = screen.getByText('Introduction').closest('button')!
    firstButton.focus()

    await user.keyboard('{ArrowUp}')
    expect(screen.getByText('Advanced Topics').closest('button')).toHaveFocus()
  })

  it('navigates to topic on Enter key press', async () => {
    render(<Sidebar onOpenSettings={() => {}} />)
    const user = userEvent.setup()

    const secondButton = screen.getByText('Getting Started').closest('button')!
    secondButton.focus()

    await user.keyboard('{Enter}')
    expect(useCourseStore.getState().activeTopic).toBe('topic-2')
  })

  it('sets tabIndex 0 only on the active topic button', () => {
    useCourseStore.setState({ activeTopic: 'topic-2' })
    render(<Sidebar onOpenSettings={() => {}} />)

    const buttons = screen.getAllByRole('button')
    // topic-1 = tabIndex -1, topic-2 = tabIndex 0, topic-3 = tabIndex -1, settings = no tabIndex set
    expect(buttons[0]).toHaveAttribute('tabindex', '-1')
    expect(buttons[1]).toHaveAttribute('tabindex', '0')
    expect(buttons[2]).toHaveAttribute('tabindex', '-1')
  })

  it('makes the first topic tabbable when no topic is active', () => {
    useCourseStore.setState({ activeTopic: null })
    render(<Sidebar onOpenSettings={() => {}} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons[0]).toHaveAttribute('tabindex', '0')
    expect(buttons[1]).toHaveAttribute('tabindex', '-1')
    expect(buttons[2]).toHaveAttribute('tabindex', '-1')
  })

  it('navigates through all three topics sequentially', async () => {
    render(<Sidebar onOpenSettings={() => {}} />)
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
