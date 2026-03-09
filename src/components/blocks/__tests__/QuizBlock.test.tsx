import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import QuizBlock from '../QuizBlock'
import { useCourseStore } from '@/store/course.store'

beforeEach(() => {
  useCourseStore.setState({
    course: null,
    activeTopic: 'topic-1',
    progress: {},
    quizAnswers: {},
  })
})

describe('QuizBlock', () => {
  const mcProps = {
    type: 'quiz' as const,
    question: 'What is 2+2?',
    options: ['3', '4', '5'],
    answer: 1,
    explanation: 'Two plus two equals four.',
    blockIndex: 0,
  }

  it('renders the question text', () => {
    render(<QuizBlock {...mcProps} />)
    expect(screen.getByText('What is 2+2?')).toBeInTheDocument()
  })

  it('renders all options as radio buttons in a radiogroup', () => {
    render(<QuizBlock {...mcProps} />)
    expect(screen.getByRole('radiogroup', { name: 'Answer options' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '3' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '4' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '5' })).toBeInTheDocument()
  })

  it('does not show explanation before answering', () => {
    render(<QuizBlock {...mcProps} />)
    expect(screen.queryByText('Two plus two equals four.')).not.toBeInTheDocument()
  })

  it('shows correct feedback when the right answer is selected', async () => {
    const user = userEvent.setup()
    render(<QuizBlock {...mcProps} />)

    await user.click(screen.getByRole('radio', { name: '4' }))

    expect(screen.getByRole('status')).toHaveTextContent('Correct!')
  })

  it('highlights the correct option green on correct answer', async () => {
    const user = userEvent.setup()
    const { container } = render(<QuizBlock {...mcProps} />)

    await user.click(screen.getByRole('radio', { name: '4' }))

    const correctOption = container.querySelector('.quiz-block-option--correct')
    expect(correctOption).toBeInTheDocument()
    expect(correctOption).toHaveTextContent('4')
  })

  it('shows incorrect feedback and highlights correct answer when wrong', async () => {
    const user = userEvent.setup()
    const { container } = render(<QuizBlock {...mcProps} />)

    await user.click(screen.getByRole('radio', { name: '3' }))

    expect(screen.getByRole('status')).toHaveTextContent('Incorrect')

    // The selected wrong option has incorrect styling
    const incorrectOption = container.querySelector('.quiz-block-option--incorrect')
    expect(incorrectOption).toBeInTheDocument()
    expect(incorrectOption).toHaveTextContent('3')

    // The correct option is highlighted
    const correctOption = container.querySelector('.quiz-block-option--correct')
    expect(correctOption).toBeInTheDocument()
    expect(correctOption).toHaveTextContent('4')
  })

  it('shows explanation text after answering', async () => {
    const user = userEvent.setup()
    render(<QuizBlock {...mcProps} />)

    await user.click(screen.getByRole('radio', { name: '4' }))

    expect(screen.getByText('Two plus two equals four.')).toBeInTheDocument()
  })

  it('locks the block after answering — options are disabled', async () => {
    const user = userEvent.setup()
    render(<QuizBlock {...mcProps} />)

    await user.click(screen.getByRole('radio', { name: '4' }))

    const radios = screen.getAllByRole('radio')
    radios.forEach((r) => expect(r).toBeDisabled())
  })

  it('records the answer in the course store', async () => {
    const user = userEvent.setup()
    render(<QuizBlock {...mcProps} />)

    await user.click(screen.getByRole('radio', { name: '4' }))

    const { quizAnswers } = useCourseStore.getState()
    expect(quizAnswers['topic-1:0']).toEqual({
      selectedOption: 1,
      correct: true,
    })
  })

  it('renders in locked state when pre-answered from store', () => {
    useCourseStore.setState({
      quizAnswers: {
        'topic-1:0': { selectedOption: 1, correct: true },
      },
    })

    const { container } = render(<QuizBlock {...mcProps} />)

    // All options are disabled
    const radios = screen.getAllByRole('radio')
    radios.forEach((r) => expect(r).toBeDisabled())

    // Feedback is shown
    expect(screen.getByRole('status')).toHaveTextContent('Correct!')

    // Explanation is shown
    expect(screen.getByText('Two plus two equals four.')).toBeInTheDocument()

    // Correct option is highlighted
    expect(container.querySelector('.quiz-block-option--correct')).toHaveTextContent('4')
  })

  it('marks selected option as aria-checked', async () => {
    const user = userEvent.setup()
    render(<QuizBlock {...mcProps} />)

    // Before selection, no option is checked
    const radios = screen.getAllByRole('radio')
    radios.forEach((r) => expect(r).toHaveAttribute('aria-checked', 'false'))

    await user.click(screen.getByRole('radio', { name: '4' }))

    expect(screen.getByRole('radio', { name: '4' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: '3' })).toHaveAttribute('aria-checked', 'false')
  })

  it('announces feedback via aria-live region after selection', async () => {
    const user = userEvent.setup()
    const { container } = render(<QuizBlock {...mcProps} />)

    const liveRegion = container.querySelector('[aria-live="polite"]')
    expect(liveRegion).toBeInTheDocument()
    expect(liveRegion).toHaveTextContent('')

    await user.click(screen.getByRole('radio', { name: '4' }))

    expect(liveRegion).toHaveTextContent('Correct!')
    expect(liveRegion).toHaveTextContent('Two plus two equals four.')
  })

  it('does not render correct answer index in DOM before answering', () => {
    const { container } = render(<QuizBlock {...mcProps} />)

    // No option should have correct/incorrect classes before answering
    expect(container.querySelector('.quiz-block-option--correct')).not.toBeInTheDocument()
    expect(container.querySelector('.quiz-block-option--incorrect')).not.toBeInTheDocument()

    // No data attributes revealing the answer
    const options = container.querySelectorAll('.quiz-block-option')
    options.forEach((opt) => {
      expect(opt.getAttribute('data-correct')).toBeNull()
    })
  })
})
