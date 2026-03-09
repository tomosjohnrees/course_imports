import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import ErrorState, { sanitiseErrorMessage } from '../ErrorState'

describe('ErrorState', () => {
  it('renders icon, heading, and message', () => {
    render(<ErrorState message="Repository not found." />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText("Couldn't load course")).toBeInTheDocument()
    expect(screen.getByText('Repository not found.')).toBeInTheDocument()
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('renders heading as h3', () => {
    render(<ErrorState message="Some error" />)

    const heading = screen.getByRole('heading', { level: 3 })
    expect(heading).toHaveTextContent("Couldn't load course")
  })

  it('shows Try again button when onRetry is provided', () => {
    const onRetry = vi.fn()
    render(<ErrorState message="Error" onRetry={onRetry} />)

    const button = screen.getByRole('button', { name: 'Try again' })
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it('shows Dismiss button when onDismiss is provided', () => {
    const onDismiss = vi.fn()
    render(<ErrorState message="Error" onDismiss={onDismiss} />)

    const button = screen.getByRole('button', { name: 'Dismiss error' })
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('shows both recovery actions together', () => {
    render(
      <ErrorState message="Error" onRetry={() => {}} onDismiss={() => {}} />,
    )

    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Dismiss error' })).toBeInTheDocument()
  })

  it('shows no action buttons when neither onRetry nor onDismiss provided', () => {
    render(<ErrorState message="Error" />)

    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})

describe('sanitiseErrorMessage', () => {
  it('strips Unix file system paths', () => {
    expect(sanitiseErrorMessage('Failed to read /Users/tom/projects/course/file.json'))
      .not.toMatch(/\/Users\/tom/)
  })

  it('strips Windows file system paths', () => {
    expect(sanitiseErrorMessage('Failed to read C:\\Users\\tom\\projects\\file.json'))
      .not.toMatch(/C:\\Users\\tom/)
  })

  it('strips long token-like strings', () => {
    const token = 'ghp_' + 'a'.repeat(36)
    expect(sanitiseErrorMessage(`Auth failed with token ${token}`))
      .not.toContain(token)
  })

  it('strips stack traces', () => {
    const message = 'Error: Something failed\n    at Module._compile (internal/modules/cjs/loader.js:999:30)'
    const result = sanitiseErrorMessage(message)
    expect(result).not.toMatch(/at Module/)
    expect(result).not.toMatch(/loader\.js/)
  })

  it('preserves plain-language error messages', () => {
    const message = 'Check the URL and try again.'
    expect(sanitiseErrorMessage(message)).toBe(message)
  })

  it('preserves short user-friendly messages', () => {
    const message = "You're offline. Check your internet connection and try again."
    expect(sanitiseErrorMessage(message)).toBe(message)
  })
})
