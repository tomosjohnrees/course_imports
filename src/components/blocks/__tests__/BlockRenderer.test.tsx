import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import BlockRenderer, { BlockErrorBoundary } from '../BlockRenderer'
import type { Block } from '@/types/course.types'

describe('BlockRenderer', () => {
  it('renders nothing for an empty blocks array', () => {
    const { container } = render(<BlockRenderer blocks={[]} />)
    expect(container.innerHTML).toBe('')
  })

  it('renders blocks in the correct order', () => {
    const blocks: Block[] = [
      { type: 'text', content: 'First block' },
      { type: 'text', content: 'Second block' },
      { type: 'text', content: 'Third block' },
    ]
    render(<BlockRenderer blocks={blocks} />)

    const rendered = screen.getAllByText(/block$/i)
    expect(rendered).toHaveLength(3)
    expect(rendered[0]).toHaveTextContent('First block')
    expect(rendered[1]).toHaveTextContent('Second block')
    expect(rendered[2]).toHaveTextContent('Third block')
  })

  it('delegates text blocks to the TextBlock component', () => {
    const blocks: Block[] = [{ type: 'text', content: 'Hello world' }]
    render(<BlockRenderer blocks={blocks} />)
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('delegates code blocks to the CodeBlock component', () => {
    const blocks: Block[] = [
      { type: 'code', language: 'javascript', content: 'const x = 1' },
    ]
    render(<BlockRenderer blocks={blocks} />)
    const code = screen.getByText('const x = 1')
    expect(code.closest('pre')).toBeInTheDocument()
  })

  it('delegates quiz blocks to the QuizBlock component', () => {
    const blocks: Block[] = [
      {
        type: 'quiz',
        question: 'What is 2+2?',
        options: ['3', '4', '5'],
        answer: 1,
      },
    ]
    render(<BlockRenderer blocks={blocks} />)
    expect(screen.getByText(/What is 2\+2\?/)).toBeInTheDocument()
  })

  it('delegates callout blocks to the CalloutBlock component', () => {
    const blocks: Block[] = [
      { type: 'callout', style: 'info', body: 'Important note' },
    ]
    render(<BlockRenderer blocks={blocks} />)
    expect(screen.getByText('Important note')).toBeInTheDocument()
    expect(screen.getByRole('note')).toBeInTheDocument()
  })

  it('delegates image blocks to the ImageBlock component', () => {
    const blocks: Block[] = [
      { type: 'image', src: 'https://example.com/test.png', alt: 'Test image' },
    ]
    render(<BlockRenderer blocks={blocks} />)
    expect(screen.getByAltText('Test image')).toBeInTheDocument()
  })

  it('renders UnknownBlock for unrecognised block types', () => {
    const blocks = [{ type: 'video', url: 'test.mp4' }] as unknown as Block[]
    render(<BlockRenderer blocks={blocks} />)
    expect(screen.getByRole('note')).toHaveTextContent(
      'Unsupported block type: video',
    )
  })

  it('renders other blocks even when an unknown block is present', () => {
    const blocks = [
      { type: 'text', content: 'Valid block' },
      { type: 'unknown-type' },
      { type: 'text', content: 'Another valid block' },
    ] as unknown as Block[]
    render(<BlockRenderer blocks={blocks} />)

    expect(screen.getByText('Valid block')).toBeInTheDocument()
    expect(screen.getByText('Another valid block')).toBeInTheDocument()
    expect(screen.getByRole('note')).toHaveTextContent('Unsupported block type')
  })

  it('renders all block types together in order', () => {
    const blocks: Block[] = [
      { type: 'text', content: 'Intro text' },
      { type: 'code', language: 'js', content: 'let x = 1' },
      {
        type: 'quiz',
        question: 'Explain this',
        options: ['Option A', 'Option B'],
        answer: 0,
      },
      { type: 'callout', style: 'tip', body: 'Pro tip here' },
      { type: 'image', src: 'https://example.com/photo.jpg', alt: 'A photo' },
    ]
    render(<BlockRenderer blocks={blocks} />)

    expect(screen.getByText('Intro text')).toBeInTheDocument()
    expect(screen.getByText('let x = 1')).toBeInTheDocument()
    expect(screen.getByText(/Explain this/)).toBeInTheDocument()
    expect(screen.getByText('Pro tip here')).toBeInTheDocument()
    expect(screen.getByAltText('A photo')).toBeInTheDocument()
  })

  it('renders an error block with a missing src file path', () => {
    const blocks: Block[] = [
      { type: 'error', message: 'Referenced file not found', filePath: 'notes.md' },
    ]
    render(<BlockRenderer blocks={blocks} />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('Referenced file not found')
    expect(alert).toHaveTextContent('notes.md')
  })

  it('renders an error block for a quiz with missing options', () => {
    const blocks = [
      {
        type: 'quiz',
        question: 'What is 2+2?',
        // options intentionally omitted
        answer: 1,
      },
    ] as unknown as Block[]
    render(<BlockRenderer blocks={blocks} />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('missing options')
  })

  it('renders an error block for a text block with missing content', () => {
    const blocks = [
      { type: 'text' },
    ] as unknown as Block[]
    render(<BlockRenderer blocks={blocks} />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('missing content')
  })

  it('renders sibling blocks normally when one block is an error', () => {
    const blocks: Block[] = [
      { type: 'text', content: 'Before error' },
      { type: 'error', message: 'Something broke' },
      { type: 'text', content: 'After error' },
    ]
    render(<BlockRenderer blocks={blocks} />)

    expect(screen.getByText('Before error')).toBeInTheDocument()
    expect(screen.getByText('After error')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent('Something broke')
  })

  it('catches a thrown render error via the error boundary', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    function ThrowingChild(): React.ReactElement {
      throw new Error('render crash')
    }

    render(
      <BlockErrorBoundary>
        <ThrowingChild />
      </BlockErrorBoundary>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'This block failed to render.',
    )

    spy.mockRestore()
  })

  it('error boundary isolates crash so sibling blocks still render', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    function ThrowingChild(): React.ReactElement {
      throw new Error('crash')
    }

    render(
      <div>
        <BlockErrorBoundary>
          <p>Safe sibling before</p>
        </BlockErrorBoundary>
        <BlockErrorBoundary>
          <ThrowingChild />
        </BlockErrorBoundary>
        <BlockErrorBoundary>
          <p>Safe sibling after</p>
        </BlockErrorBoundary>
      </div>,
    )

    expect(screen.getByText('Safe sibling before')).toBeInTheDocument()
    expect(screen.getByText('Safe sibling after')).toBeInTheDocument()
    expect(screen.getByRole('alert')).toHaveTextContent(
      'This block failed to render.',
    )

    spy.mockRestore()
  })

  it('does not show raw error messages or stack traces in error boundary', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // The error boundary shows a generic message, not the raw error
    const blocks: Block[] = [
      { type: 'error', message: 'Referenced file not found', filePath: 'data.json' },
    ]
    render(<BlockRenderer blocks={blocks} />)

    const alert = screen.getByRole('alert')
    // Should show the user-friendly message, not a stack trace
    expect(alert).toHaveTextContent('Referenced file not found')
    expect(alert.textContent).not.toMatch(/Error:|at |\.js:/)

    spy.mockRestore()
  })

  it('error block only shows relative file paths, not absolute paths', () => {
    const blocks: Block[] = [
      { type: 'error', message: 'Referenced file not found', filePath: 'assets/image.png' },
    ]
    render(<BlockRenderer blocks={blocks} />)

    const alert = screen.getByRole('alert')
    expect(alert).toHaveTextContent('assets/image.png')
    // Relative path should not start with /
    expect(alert.textContent).not.toMatch(/\/Users\/|\/home\/|C:\\/)
  })
})
