import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import CalloutBlock from '../CalloutBlock'

describe('CalloutBlock', () => {
  it('renders body text', () => {
    render(<CalloutBlock type="callout" style="info" body="Important note" />)
    expect(screen.getByText('Important note')).toBeInTheDocument()
  })

  it('renders as an aside with role="note"', () => {
    render(<CalloutBlock type="callout" style="info" body="Test" />)
    expect(screen.getByRole('note')).toBeInTheDocument()
    expect(screen.getByRole('note').tagName).toBe('ASIDE')
  })

  // Variant colour schemes
  it('renders the info variant with the info colour scheme', () => {
    render(<CalloutBlock type="callout" style="info" body="Info text" />)
    const callout = screen.getByRole('note')
    expect(callout).toHaveClass('callout--info')
  })

  it('renders the warning variant with the warning colour scheme', () => {
    render(<CalloutBlock type="callout" style="warning" body="Warning text" />)
    const callout = screen.getByRole('note')
    expect(callout).toHaveClass('callout--warning')
  })

  it('renders the tip variant with the tip colour scheme', () => {
    render(<CalloutBlock type="callout" style="tip" body="Tip text" />)
    const callout = screen.getByRole('note')
    expect(callout).toHaveClass('callout--tip')
  })

  // Icons
  it('renders an icon for the info variant', () => {
    render(<CalloutBlock type="callout" style="info" body="Info" />)
    const icon = screen.getByRole('note').querySelector('.callout-icon')
    expect(icon).toBeInTheDocument()
  })

  it('renders an icon for the warning variant', () => {
    render(<CalloutBlock type="callout" style="warning" body="Warning" />)
    const icon = screen.getByRole('note').querySelector('.callout-icon')
    expect(icon).toBeInTheDocument()
  })

  it('renders an icon for the tip variant', () => {
    render(<CalloutBlock type="callout" style="tip" body="Tip" />)
    const icon = screen.getByRole('note').querySelector('.callout-icon')
    expect(icon).toBeInTheDocument()
  })

  // Fallback for unrecognised styles
  it('falls back to info style for unrecognised style values', () => {
    render(
      <CalloutBlock
        type="callout"
        style={'custom' as 'info'}
        body="Fallback test"
      />,
    )
    const callout = screen.getByRole('note')
    expect(callout).toHaveClass('callout--info')
    expect(screen.getByText('Fallback test')).toBeInTheDocument()
  })

  // Inline markdown rendering
  it('renders bold text in the body', () => {
    render(
      <CalloutBlock type="callout" style="info" body="This is **bold** text" />,
    )
    const strong = screen.getByRole('note').querySelector('strong')
    expect(strong).toBeInTheDocument()
    expect(strong).toHaveTextContent('bold')
  })

  it('renders italic text in the body', () => {
    render(
      <CalloutBlock
        type="callout"
        style="info"
        body="This is *italic* text"
      />,
    )
    const em = screen.getByRole('note').querySelector('em')
    expect(em).toBeInTheDocument()
    expect(em).toHaveTextContent('italic')
  })

  it('renders inline code in the body', () => {
    render(
      <CalloutBlock
        type="callout"
        style="info"
        body="Use `console.log()` here"
      />,
    )
    const code = screen.getByRole('note').querySelector('code')
    expect(code).toBeInTheDocument()
    expect(code).toHaveTextContent('console.log()')
  })

  it('renders links in the body with safe attributes', () => {
    render(
      <CalloutBlock
        type="callout"
        style="info"
        body="Visit [example](https://example.com)"
      />,
    )
    const link = screen.getByRole('link', { name: 'example' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  // Security — no raw HTML
  it('does not render raw HTML in the body', () => {
    render(
      <CalloutBlock
        type="callout"
        style="info"
        body='<script>alert("xss")</script>'
      />,
    )
    expect(screen.getByRole('note').querySelector('script')).toBeNull()
  })
})
