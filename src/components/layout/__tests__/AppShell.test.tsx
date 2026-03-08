import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AppShell from '../AppShell'
import Home from '@/pages/Home'
import Course from '@/pages/Course'

beforeEach(() => {
  window.api = {
    course: {
      selectFolder: vi.fn(),
      loadFromFolder: vi.fn(),
      loadFromGitHub: vi.fn(),
      loadRecentCourse: vi.fn(),
    },
    store: {
      getRecentCourses: vi.fn().mockResolvedValue([]),
      saveRecentCourse: vi.fn(),
      getProgress: vi.fn(),
      saveProgress: vi.fn(),
      getPreferences: vi.fn(),
      savePreferences: vi.fn(),
    },
  }
})

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
