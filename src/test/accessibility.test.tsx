import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, it, expect, beforeEach } from 'vitest'
import { axe } from 'vitest-axe'
import QuizBlock from '@/components/blocks/QuizBlock'
import CodeBlock from '@/components/blocks/CodeBlock'
import Sidebar from '@/components/layout/Sidebar'
import SettingsPanel from '@/components/layout/SettingsPanel'
import { useCourseStore } from '@/store/course.store'
import { vi } from 'vitest'
import type { Course } from '@/types/course.types'

vi.mock('@/components/blocks/highlighter', () => ({
  getHighlighter: vi.fn().mockResolvedValue({}),
  highlightCode: vi.fn().mockReturnValue('<pre class="shiki"><code>code</code></pre>'),
}))

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
  ],
  source: { type: 'local', path: '/test' },
}

beforeEach(() => {
  useCourseStore.setState({
    course: mockCourse,
    activeTopic: 'topic-1',
    progress: {},
    quizAnswers: {},
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
      getProgress: vi.fn().mockResolvedValue(null),
      saveProgress: vi.fn(),
      getPreferences: vi.fn().mockResolvedValue({ theme: 'system' }),
      savePreferences: vi.fn().mockResolvedValue(undefined),
      clearAllProgress: vi.fn().mockResolvedValue(undefined),
    },
  }
})

describe('Accessibility audit', () => {
  it('QuizBlock (multiple-choice) has no critical axe violations', async () => {
    const { container } = render(
      <QuizBlock
        type="quiz"
        variant="multiple-choice"
        question="What is 2+2?"
        options={['3', '4', '5']}
        answer={1}
        explanation="Four."
        blockIndex={0}
      />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('QuizBlock (free-text) has no critical axe violations', async () => {
    const { container } = render(
      <QuizBlock
        type="quiz"
        variant="free-text"
        question="What does HTML stand for?"
        sampleAnswer="HyperText Markup Language"
        explanation="HTML."
        blockIndex={1}
      />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('CodeBlock has no critical axe violations', async () => {
    const { container } = render(
      <CodeBlock type="code" language="javascript" content="const x = 1" />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('Sidebar has no critical axe violations', async () => {
    const router = createMemoryRouter(
      [{ path: '/course', element: <Sidebar onOpenSettings={() => {}} /> }],
      { initialEntries: ['/course'] },
    )
    const { container } = render(<RouterProvider router={router} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('SettingsPanel has no critical axe violations', async () => {
    const { container } = render(
      <SettingsPanel open={true} onClose={() => {}} />,
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
