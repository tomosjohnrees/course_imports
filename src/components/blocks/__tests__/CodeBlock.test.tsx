import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import CodeBlock from '../CodeBlock'

// Mock the highlighter module — shiki requires WASM which isn't available in jsdom
vi.mock('../highlighter', () => ({
  getHighlighter: vi.fn(),
  highlightCode: vi.fn(),
}))

import { getHighlighter, highlightCode } from '../highlighter'

const SAMPLE_SHIKI_HTML =
  '<pre class="shiki" style="--shiki-light:#24292e;--shiki-dark:#abb2bf;--shiki-light-bg:#fff;--shiki-dark-bg:#282c34"><code><span style="--shiki-light:#d73a49;--shiki-dark:#c678dd">const</span><span style="--shiki-light:#005cc5;--shiki-dark:#e5c07b"> x</span><span style="--shiki-light:#d73a49;--shiki-dark:#56b6c2"> =</span><span style="--shiki-light:#005cc5;--shiki-dark:#d19a66"> 1</span></code></pre>'

const mockHighlighter = {} as ReturnType<typeof getHighlighter> extends Promise<infer T>
  ? T
  : never

beforeEach(() => {
  vi.mocked(getHighlighter).mockResolvedValue(mockHighlighter)
  vi.mocked(highlightCode).mockReturnValue(SAMPLE_SHIKI_HTML)
})

describe('CodeBlock', () => {
  it('renders code with syntax highlighting', async () => {
    const { container } = render(
      <CodeBlock type="code" language="javascript" content="const x = 1" />,
    )

    await waitFor(() => {
      expect(container.querySelector('.code-block-content')).toBeInTheDocument()
    })

    expect(highlightCode).toHaveBeenCalledWith(mockHighlighter, 'const x = 1', 'javascript')
    expect(container.querySelector('.shiki')).toBeInTheDocument()
  })

  it('renders dual-theme CSS variables for light/dark switching', async () => {
    const { container } = render(
      <CodeBlock type="code" language="javascript" content="const x = 1" />,
    )

    await waitFor(() => {
      expect(container.querySelector('.code-block-content')).toBeInTheDocument()
    })

    const spans = container.querySelectorAll('.shiki span')
    expect(spans.length).toBeGreaterThan(0)

    // Shiki output contains both --shiki-light and --shiki-dark CSS variables
    const firstSpan = spans[0]
    const style = firstSpan.getAttribute('style') || ''
    expect(style).toContain('--shiki-light')
    expect(style).toContain('--shiki-dark')
  })

  it('copies code content to clipboard when copy button is clicked', async () => {
    const user = userEvent.setup()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
      configurable: true,
    })

    render(<CodeBlock type="code" language="javascript" content="const x = 1" />)

    const copyButton = screen.getByRole('button', { name: 'Copy code' })
    await user.click(copyButton)

    expect(writeText).toHaveBeenCalledWith('const x = 1')
  })

  it('shows checkmark feedback after copying', async () => {
    const user = userEvent.setup()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      writable: true,
      configurable: true,
    })

    render(<CodeBlock type="code" language="javascript" content="const x = 1" />)

    const copyButton = screen.getByRole('button', { name: 'Copy code' })
    await user.click(copyButton)

    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()
  })

  it('displays the label when provided', async () => {
    render(
      <CodeBlock type="code" language="javascript" content="const x = 1" label="index.js" />,
    )

    expect(screen.getByText('index.js')).toBeInTheDocument()
    expect(screen.getByText('index.js')).toHaveClass('code-block-label')
  })

  it('hides the label when not provided', () => {
    const { container } = render(
      <CodeBlock type="code" language="javascript" content="const x = 1" />,
    )

    expect(container.querySelector('.code-block-label')).not.toBeInTheDocument()
  })

  it('falls back gracefully for unknown languages', async () => {
    vi.mocked(highlightCode).mockImplementation((_h, code) => {
      // Simulates shiki rendering with lang 'text' for unknown languages
      return `<pre class="shiki"><code>${code}</code></pre>`
    })

    const { container } = render(
      <CodeBlock type="code" language="fakeLang" content="some plain text" />,
    )

    await waitFor(() => {
      expect(container.querySelector('.code-block-content')).toBeInTheDocument()
    })

    expect(highlightCode).toHaveBeenCalledWith(mockHighlighter, 'some plain text', 'fakeLang')
    expect(screen.getByText('some plain text')).toBeInTheDocument()
  })

  it('renders fallback plain text while highlighting loads', () => {
    // Make the highlighter never resolve during this test
    vi.mocked(getHighlighter).mockReturnValue(new Promise(() => {}))

    const { container } = render(
      <CodeBlock type="code" language="javascript" content="const x = 1" />,
    )

    expect(container.querySelector('.code-block-fallback')).toBeInTheDocument()
    expect(screen.getByText('const x = 1')).toBeInTheDocument()
  })

  it('renders fallback when highlighter fails to load', async () => {
    vi.mocked(getHighlighter).mockRejectedValue(new Error('WASM failed'))

    const { container } = render(
      <CodeBlock type="code" language="javascript" content="const x = 1" />,
    )

    // Wait for the rejection to be handled
    await waitFor(() => {
      expect(getHighlighter).toHaveBeenCalled()
    })

    expect(container.querySelector('.code-block-fallback')).toBeInTheDocument()
    expect(screen.getByText('const x = 1')).toBeInTheDocument()
  })
})
