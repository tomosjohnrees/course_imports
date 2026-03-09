import { render } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import Home from '@/pages/Home'
import TextBlock from '@/components/blocks/TextBlock'
import CodeBlock from '@/components/blocks/CodeBlock'
import CalloutBlock from '@/components/blocks/CalloutBlock'
import QuizBlock from '@/components/blocks/QuizBlock'
import EmptyState from '@/components/EmptyState'
import ErrorState from '@/components/ErrorState'
import { BookOpen } from 'lucide-react'

beforeEach(() => {
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

describe('Typography and spacing snapshot tests', () => {
  it('Home screen matches snapshot', () => {
    const router = createMemoryRouter(
      [{ path: '/', element: <Home /> }],
      { initialEntries: ['/'] },
    )
    const { container } = render(<RouterProvider router={router} />)
    expect(container).toMatchSnapshot()
  })

  it('TextBlock with markdown matches snapshot', () => {
    const { container } = render(
      <TextBlock
        type="text"
        content={'# Heading\n\nBody text paragraph.\n\n- List item\n\n`inline code`'}
      />,
    )
    expect(container).toMatchSnapshot()
  })

  it('CodeBlock matches snapshot', () => {
    const { container } = render(
      <CodeBlock type="code" content="const x = 1" language="javascript" />,
    )
    expect(container).toMatchSnapshot()
  })

  it('CalloutBlock info variant matches snapshot', () => {
    const { container } = render(
      <CalloutBlock type="callout" style="info" body="This is an **info** callout with `code`." />,
    )
    expect(container).toMatchSnapshot()
  })

  it('QuizBlock matches snapshot', () => {
    const { container } = render(
      <QuizBlock
        type="quiz"
        question="What is 2+2?"
        options={['3', '4', '5']}
        answer={1}
        blockIndex={0}
      />,
    )
    expect(container).toMatchSnapshot()
  })

  it('EmptyState matches snapshot', () => {
    const { container } = render(
      <EmptyState icon={BookOpen} heading="No topics" message="No topics found." />,
    )
    expect(container).toMatchSnapshot()
  })

  it('ErrorState matches snapshot', () => {
    const { container } = render(
      <ErrorState message="Something went wrong" onRetry={() => {}} onDismiss={() => {}} />,
    )
    expect(container).toMatchSnapshot()
  })
})
