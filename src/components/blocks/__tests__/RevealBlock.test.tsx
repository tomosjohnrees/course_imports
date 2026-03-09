import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import RevealBlock from '../RevealBlock'

describe('RevealBlock', () => {
  it('renders collapsed by default', () => {
    render(<RevealBlock type="reveal" body="Hidden content" label="Show hint" />)
    const button = screen.getByRole('button', { name: /show hint/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })

  it('expands when the header is clicked', async () => {
    const user = userEvent.setup()
    render(<RevealBlock type="reveal" body="Hidden content" label="Show hint" />)
    const button = screen.getByRole('button', { name: /show hint/i })

    await user.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('Hidden content')).toBeInTheDocument()
  })

  it('collapses when clicked again', async () => {
    const user = userEvent.setup()
    render(<RevealBlock type="reveal" body="Hidden content" label="Show hint" />)
    const button = screen.getByRole('button', { name: /show hint/i })

    await user.click(button)
    expect(screen.getByText('Hidden content')).toBeInTheDocument()

    await user.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByText('Hidden content')).not.toBeInTheDocument()
  })

  it('renders markdown body content', async () => {
    const user = userEvent.setup()
    render(
      <RevealBlock type="reveal" body="This is **bold** text" label="Show" />,
    )

    await user.click(screen.getByRole('button', { name: /show/i }))

    const strong = document.querySelector('.reveal-body strong')
    expect(strong).toBeInTheDocument()
    expect(strong).toHaveTextContent('bold')
  })

  it('uses default label when none is provided', () => {
    render(<RevealBlock type="reveal" body="Some content" />)
    expect(screen.getByRole('button', { name: /reveal/i })).toBeInTheDocument()
  })

  it('does not render raw HTML in the body', async () => {
    const user = userEvent.setup()
    render(
      <RevealBlock
        type="reveal"
        body='<script>alert("xss")</script>'
        label="Show"
      />,
    )

    await user.click(screen.getByRole('button', { name: /show/i }))

    expect(document.querySelector('.reveal-body script')).toBeNull()
  })

  it('renders links with safe attributes', async () => {
    const user = userEvent.setup()
    render(
      <RevealBlock
        type="reveal"
        body="Visit [example](https://example.com)"
        label="Show"
      />,
    )

    await user.click(screen.getByRole('button', { name: /show/i }))

    const link = screen.getByRole('link', { name: 'example' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows a chevron icon that rotates when expanded', async () => {
    const user = userEvent.setup()
    render(<RevealBlock type="reveal" body="Content" label="Show" />)

    const container = document.querySelector('.reveal')
    expect(container).not.toHaveClass('reveal--expanded')

    await user.click(screen.getByRole('button', { name: /show/i }))
    expect(container).toHaveClass('reveal--expanded')
  })
})
