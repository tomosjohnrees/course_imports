import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BookOpen, FileText } from 'lucide-react'
import EmptyState from '../EmptyState'

describe('EmptyState', () => {
  it('renders icon, heading, and message', () => {
    render(
      <EmptyState
        icon={BookOpen}
        heading="No topics available"
        message="This course does not contain any topics."
      />,
    )

    expect(screen.getByText('No topics available')).toBeInTheDocument()
    expect(screen.getByText('This course does not contain any topics.')).toBeInTheDocument()
    // Icon is rendered as SVG
    const svg = document.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('renders heading as h2', () => {
    render(
      <EmptyState
        icon={FileText}
        heading="No content"
        message="This topic does not have any content yet."
      />,
    )

    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('No content')
  })

  it('accepts different icons', () => {
    const { rerender } = render(
      <EmptyState icon={BookOpen} heading="Heading" message="Message" />,
    )
    expect(document.querySelector('svg')).toBeInTheDocument()

    rerender(
      <EmptyState icon={FileText} heading="Heading" message="Message" />,
    )
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('applies custom style overrides', () => {
    render(
      <EmptyState
        icon={BookOpen}
        heading="Test"
        message="Test message"
        style={{ flex: 1 }}
      />,
    )

    const container = screen.getByText('Test').closest('div')
    expect(container?.style.flex).toContain('1')
  })

  it('does not expose internal paths or technical details', () => {
    render(
      <EmptyState
        icon={BookOpen}
        heading="No topics available"
        message="This course does not contain any topics."
      />,
    )

    const text = document.body.textContent ?? ''
    expect(text).not.toMatch(/\/Users\//)
    expect(text).not.toMatch(/\/home\//)
    expect(text).not.toMatch(/Error:/)
    expect(text).not.toMatch(/at\s+\w+\s+\(/)
  })
})
