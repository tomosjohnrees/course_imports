import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import AppShell from '../AppShell'
import Home from '@/pages/Home'
import Course from '@/pages/Course'

function renderWithRouter(initialRoute: string) {
  const router = createMemoryRouter(
    [
      {
        element: <AppShell />,
        children: [
          { path: '/', element: <Home /> },
          { path: '/course', element: <Course /> },
        ],
      },
    ],
    { initialEntries: [initialRoute] },
  )
  return render(<RouterProvider router={router} />)
}

describe('AppShell', () => {
  it('renders the sidebar and main content area', () => {
    renderWithRouter('/')
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders the sidebar with Topics heading', () => {
    renderWithRouter('/')
    expect(screen.getByText('Topics')).toBeInTheDocument()
  })

  it('renders the Home page at /', () => {
    renderWithRouter('/')
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('renders the Course page at /course', () => {
    renderWithRouter('/course')
    expect(screen.getByText('Course')).toBeInTheDocument()
  })
})
