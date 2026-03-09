import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import CheckpointBlock from '../CheckpointBlock'
import { useCourseStore } from '@/store/course.store'

beforeEach(() => {
  useCourseStore.setState({
    course: null,
    activeTopic: 'topic-1',
    progress: {},
    checkpointCompletions: {},
  })
})

describe('CheckpointBlock', () => {
  const defaultProps = {
    type: 'checkpoint' as const,
    blockIndex: 0,
  }

  it('renders a button with default label "Mark as complete"', () => {
    render(<CheckpointBlock {...defaultProps} />)
    expect(
      screen.getByRole('button', { name: 'Mark as complete' }),
    ).toBeInTheDocument()
  })

  it('renders a button with custom label text', () => {
    render(<CheckpointBlock {...defaultProps} label="I understand closures" />)
    expect(
      screen.getByRole('button', { name: 'I understand closures' }),
    ).toBeInTheDocument()
  })

  it('transitions to completed state when clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(<CheckpointBlock {...defaultProps} />)

    await user.click(screen.getByRole('button'))

    expect(screen.getByRole('button')).toBeDisabled()
    expect(container.querySelector('.checkpoint-block--completed')).toBeInTheDocument()
  })

  it('cannot be un-completed once clicked', async () => {
    const user = userEvent.setup()
    render(<CheckpointBlock {...defaultProps} />)

    const button = screen.getByRole('button')
    await user.click(button)
    await user.click(button)

    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-pressed', 'true')
  })

  it('records checkpoint completion in the course store', async () => {
    const user = userEvent.setup()
    render(<CheckpointBlock {...defaultProps} />)

    await user.click(screen.getByRole('button'))

    const { checkpointCompletions } = useCourseStore.getState()
    expect(checkpointCompletions['topic-1:0']).toBe(true)
  })

  it('renders in completed state when pre-completed from store', () => {
    useCourseStore.setState({
      checkpointCompletions: {
        'topic-1:0': true,
      },
    })

    const { container } = render(<CheckpointBlock {...defaultProps} />)

    expect(screen.getByRole('button')).toBeDisabled()
    expect(container.querySelector('.checkpoint-block--completed')).toBeInTheDocument()
  })

  it('shows a checkmark icon when completed', async () => {
    const user = userEvent.setup()
    const { container } = render(<CheckpointBlock {...defaultProps} />)

    expect(container.querySelector('.checkpoint-block-icon')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button'))

    expect(container.querySelector('.checkpoint-block-icon')).toBeInTheDocument()
  })

  it('sets aria-pressed to reflect completion state', () => {
    render(<CheckpointBlock {...defaultProps} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })
})
