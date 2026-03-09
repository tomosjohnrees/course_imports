import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import Sidebar from '@/components/layout/Sidebar'
import SettingsPanel from '@/components/layout/SettingsPanel'
import QuizBlock from '@/components/blocks/QuizBlock'
import { useCourseStore } from '@/store/course.store'
import { useUIStore } from '@/store/ui.store'

/**
 * Verify that all interactive element types have a :focus-visible CSS rule
 * by checking that the elements render with expected class names that
 * correspond to CSS rules with focus-visible selectors.
 *
 * Note: jsdom does not compute CSS, so we verify the class names and
 * element structure that our CSS targets.
 */

beforeEach(() => {
  useCourseStore.setState({
    course: {
      id: 'test',
      title: 'Test',
      description: '',
      version: '1',
      author: '',
      tags: [],
      topics: [{ id: 't1', title: 'T1', blocks: [] }],
      source: { type: 'local', path: '/' },
    },
    activeTopic: 't1',
    progress: {},
    quizAnswers: {},
  })
  useUIStore.setState({ theme: 'system' })
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
      getProgress: vi.fn().mockResolvedValue(null),
      saveProgress: vi.fn(),
      getPreferences: vi.fn().mockResolvedValue({ theme: 'system' }),
      savePreferences: vi.fn().mockResolvedValue(undefined),
      clearAllProgress: vi.fn().mockResolvedValue(undefined),
    },
  }
})

describe('Focus ring visibility', () => {
  it('sidebar topic buttons have the sidebar-topic-btn class for focus styling', () => {
    render(<Sidebar onOpenSettings={() => {}} />)

    const topicButton = screen.getByText('T1').closest('button')!
    expect(topicButton).toHaveClass('sidebar-topic-btn')
  })

  it('sidebar settings button has the sidebar-topic-btn class for focus styling', () => {
    render(<Sidebar onOpenSettings={() => {}} />)

    const settingsButton = screen.getByLabelText('Open settings')
    expect(settingsButton).toHaveClass('sidebar-topic-btn')
  })

  it('settings panel close button has the settings-close-btn class', async () => {
    render(<SettingsPanel open={true} onClose={() => {}} />)

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    const closeBtn = screen.getByLabelText('Close settings')
    expect(closeBtn).toHaveClass('settings-close-btn')
  })

  it('settings theme buttons have the settings-theme-btn class', async () => {
    render(<SettingsPanel open={true} onClose={() => {}} />)

    await waitFor(() => {
      expect(screen.getByText('Light')).toBeInTheDocument()
    })

    const lightBtn = screen.getByText('Light').closest('button')!
    expect(lightBtn).toHaveClass('settings-theme-btn')
  })

  it('quiz block option buttons have the quiz-block-option class', () => {
    render(
      <QuizBlock
        type="quiz"
        variant="multiple-choice"
        question="Q?"
        options={['A', 'B']}
        answer={0}
        blockIndex={0}
      />,
    )

    const options = screen.getAllByRole('radio')
    options.forEach((btn) => {
      expect(btn).toHaveClass('quiz-block-option')
    })
  })

  it('quiz block submit button has the quiz-block-submit class', () => {
    render(
      <QuizBlock
        type="quiz"
        variant="free-text"
        question="Q?"
        sampleAnswer="A"
        blockIndex={0}
      />,
    )

    const submitBtn = screen.getByRole('button', { name: 'Submit' })
    expect(submitBtn).toHaveClass('quiz-block-submit')
  })

  it('all interactive elements in sidebar are focusable', () => {
    render(<Sidebar onOpenSettings={() => {}} />)

    const buttons = screen.getAllByRole('button')
    // All buttons should be in the DOM and not disabled
    buttons.forEach((btn) => {
      expect(btn).not.toBeDisabled()
    })
  })
})
