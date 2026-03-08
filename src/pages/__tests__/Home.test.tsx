import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from '../Home'

describe('Home', () => {
  it('renders without errors', () => {
    render(<Home />)
    expect(screen.getByText('Course Imports')).toBeInTheDocument()
  })

  it('displays the GitHub URL input field', () => {
    render(<Home />)
    expect(screen.getByLabelText('Load from GitHub')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('https://github.com/owner/repo')).toBeInTheDocument()
  })

  it('displays the Load course button', () => {
    render(<Home />)
    expect(screen.getByRole('button', { name: 'Load course' })).toBeInTheDocument()
  })

  it('displays the Open local folder button', () => {
    render(<Home />)
    expect(screen.getByRole('button', { name: 'Open local folder' })).toBeInTheDocument()
  })

  it('has an inert GitHub URL input', () => {
    render(<Home />)
    const input = screen.getByLabelText('Load from GitHub')
    expect(input).toHaveAttribute('readOnly')
  })
})
