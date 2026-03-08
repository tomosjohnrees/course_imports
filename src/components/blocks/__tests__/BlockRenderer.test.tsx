import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import BlockRenderer from '../BlockRenderer'
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
        variant: 'multiple-choice',
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
      { type: 'image', src: 'test.png', alt: 'Test image' },
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
        variant: 'free-text',
        question: 'Explain this',
      },
      { type: 'callout', style: 'tip', body: 'Pro tip here' },
      { type: 'image', src: 'photo.jpg', alt: 'A photo' },
    ]
    render(<BlockRenderer blocks={blocks} />)

    expect(screen.getByText('Intro text')).toBeInTheDocument()
    expect(screen.getByText('let x = 1')).toBeInTheDocument()
    expect(screen.getByText(/Explain this/)).toBeInTheDocument()
    expect(screen.getByText('Pro tip here')).toBeInTheDocument()
    expect(screen.getByAltText('A photo')).toBeInTheDocument()
  })
})
