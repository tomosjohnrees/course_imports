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
  it('hides the sidebar on the home route', () => {
    renderWithRouter('/')
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders the sidebar on non-home routes', () => {
    renderWithRouter('/course')
    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('renders the sidebar with Topics heading on course route', () => {
    renderWithRouter('/course')
    expect(screen.getByText('Topics')).toBeInTheDocument()
  })

  it('renders the Home page at /', () => {
    renderWithRouter('/')
    expect(screen.getByText('Course Imports')).toBeInTheDocument()
  })

  it('renders the Course page at /course', () => {
    renderWithRouter('/course')
    expect(screen.getByText('Course')).toBeInTheDocument()
  })
})
