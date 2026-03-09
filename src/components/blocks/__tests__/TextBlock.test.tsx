import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import TextBlock from '../TextBlock'

describe('TextBlock', () => {
  it('renders headings at correct levels', () => {
    render(
      <TextBlock type="text" content={'# Heading 1\n\n## Heading 2\n\n### Heading 3'} />,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading 1')
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading 2')
    expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Heading 3')
  })

  it('renders unordered lists', () => {
    render(<TextBlock type="text" content={'- Apple\n- Banana\n- Cherry'} />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(3)
    expect(items[0]).toHaveTextContent('Apple')
  })

  it('renders ordered lists', () => {
    render(<TextBlock type="text" content={'1. First\n2. Second\n3. Third'} />)
    const list = screen.getByRole('list')
    expect(list.tagName).toBe('OL')
    expect(screen.getAllByRole('listitem')).toHaveLength(3)
  })

  it('renders tables with GFM support', () => {
    const markdown = '| Name | Age |\n| --- | --- |\n| Alice | 30 |\n| Bob | 25 |'
    render(<TextBlock type="text" content={markdown} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('25')).toBeInTheDocument()
  })

  it('renders fenced code blocks via CodeBlock component', () => {
    render(<TextBlock type="text" content={'```javascript\nconst x = 1\n```'} />)
    const code = screen.getByText('const x = 1')
    // CodeBlock renders content inside a <pre><code> structure
    expect(code.closest('pre')).toBeInTheDocument()
    expect(code).toHaveAttribute('data-language', 'javascript')
  })

  it('renders inline code with the inline-code class', () => {
    render(<TextBlock type="text" content={'Use `console.log` to debug'} />)
    const code = screen.getByText('console.log')
    expect(code.tagName).toBe('CODE')
    expect(code).toHaveClass('inline-code')
  })

  it('renders links with security attributes', () => {
    render(<TextBlock type="text" content={'[Example](https://example.com)'} />)
    const link = screen.getByRole('link', { name: 'Example' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('renders blockquotes', () => {
    render(<TextBlock type="text" content={'> This is a quote'} />)
    expect(screen.getByText('This is a quote')).toBeInTheDocument()
    expect(screen.getByText('This is a quote').closest('blockquote')).toBeInTheDocument()
  })

  it('renders bold and italic text', () => {
    const { container } = render(
      <TextBlock type="text" content={'**bold** and *italic*'} />,
    )
    expect(container.querySelector('strong')).toHaveTextContent('bold')
    expect(container.querySelector('em')).toHaveTextContent('italic')
  })

  it('applies the text-block class for styling', () => {
    const { container } = render(<TextBlock type="text" content="Hello" />)
    expect(container.firstElementChild).toHaveClass('text-block')
  })

  // Semantic heading hierarchy — no skipped levels
  describe('heading level normalisation', () => {
    it('collapses skipped heading levels to sequential order', () => {
      render(
        <TextBlock type="text" content={'## Second\n\n#### Fourth\n\n###### Sixth'} />,
      )
      // h2 → h1, h4 → h2, h6 → h3  (sequential, no gaps)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Second')
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Fourth')
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Sixth')
    })

    it('preserves already-sequential headings unchanged', () => {
      render(
        <TextBlock type="text" content={'# One\n\n## Two\n\n### Three'} />,
      )
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('One')
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Two')
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Three')
    })

    it('normalises h3 + h5 to h1 + h2', () => {
      render(
        <TextBlock type="text" content={'### Alpha\n\n##### Beta'} />,
      )
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Alpha')
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Beta')
    })
  })

  // Security — raw HTML stripped
  it('does not render raw HTML tags', () => {
    const { container } = render(
      <TextBlock type="text" content='<script>alert("xss")</script><div id="injected">bad</div>' />,
    )
    expect(container.querySelector('script')).toBeNull()
    expect(container.querySelector('#injected')).toBeNull()
  })
})
