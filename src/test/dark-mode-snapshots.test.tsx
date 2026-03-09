import { render } from '@testing-library/react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import Home from '@/pages/Home'
import TextBlock from '@/components/blocks/TextBlock'
import CodeBlock from '@/components/blocks/CodeBlock'
import CalloutBlock from '@/components/blocks/CalloutBlock'
import QuizBlock from '@/components/blocks/QuizBlock'
import ImageBlock from '@/components/blocks/ImageBlock'
import EmptyState from '@/components/EmptyState'
import ErrorState from '@/components/ErrorState'
import { BookOpen } from 'lucide-react'

beforeEach(() => {
  document.documentElement.setAttribute('data-theme', 'dark')
  window.api = {
    initialTheme: 'dark',
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
      getPreferences: vi.fn().mockResolvedValue({ theme: 'dark' }),
      savePreferences: vi.fn(),
      clearAllProgress: vi.fn(),
    },
  }
})

afterEach(() => {
  document.documentElement.removeAttribute('data-theme')
})

describe('Dark mode snapshot tests', () => {
  it('Home screen matches dark mode snapshot', () => {
    const router = createMemoryRouter(
      [{ path: '/', element: <Home /> }],
      { initialEntries: ['/'] },
    )
    const { container } = render(<RouterProvider router={router} />)
    expect(container).toMatchSnapshot()
  })

  it('TextBlock with markdown matches dark mode snapshot', () => {
    const { container } = render(
      <TextBlock
        type="text"
        content={'# Heading\n\nBody text paragraph.\n\n- List item\n\n`inline code`'}
      />,
    )
    expect(container).toMatchSnapshot()
  })

  it('CodeBlock matches dark mode snapshot', () => {
    const { container } = render(
      <CodeBlock type="code" content="const x = 1" language="javascript" />,
    )
    expect(container).toMatchSnapshot()
  })

  it('CalloutBlock info variant matches dark mode snapshot', () => {
    const { container } = render(
      <CalloutBlock type="callout" style="info" body="This is an **info** callout with `code`." />,
    )
    expect(container).toMatchSnapshot()
  })

  it('CalloutBlock warning variant matches dark mode snapshot', () => {
    const { container } = render(
      <CalloutBlock type="callout" style="warning" body="This is a **warning** callout." />,
    )
    expect(container).toMatchSnapshot()
  })

  it('CalloutBlock tip variant matches dark mode snapshot', () => {
    const { container } = render(
      <CalloutBlock type="callout" style="tip" body="This is a **tip** callout." />,
    )
    expect(container).toMatchSnapshot()
  })

  it('QuizBlock multiple-choice matches dark mode snapshot', () => {
    const { container } = render(
      <QuizBlock
        type="quiz"
        variant="multiple-choice"
        question="What is 2+2?"
        options={['3', '4', '5']}
        answer={1}
        blockIndex={0}
      />,
    )
    expect(container).toMatchSnapshot()
  })

  it('QuizBlock free-text matches dark mode snapshot', () => {
    const { container } = render(
      <QuizBlock
        type="quiz"
        variant="free-text"
        question="Explain closures."
        blockIndex={1}
      />,
    )
    expect(container).toMatchSnapshot()
  })

  it('ImageBlock with fallback matches dark mode snapshot', () => {
    const { container } = render(
      <ImageBlock type="image" src="missing.png" alt="Test image" />,
    )
    expect(container).toMatchSnapshot()
  })

  it('EmptyState matches dark mode snapshot', () => {
    const { container } = render(
      <EmptyState icon={BookOpen} heading="No topics" message="No topics found." />,
    )
    expect(container).toMatchSnapshot()
  })

  it('ErrorState matches dark mode snapshot', () => {
    const { container } = render(
      <ErrorState message="Something went wrong" onRetry={() => {}} onDismiss={() => {}} />,
    )
    expect(container).toMatchSnapshot()
  })
})
