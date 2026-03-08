import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useUIStore } from '@/store/ui.store'
import { useCourseStore } from '@/store/course.store'
import Home from '../Home'
import type { Course } from '@/types/course.types'

const mockCourse: Course = {
  id: 'test-course',
  title: 'Test Course',
  description: 'A test course',
  version: '1.0.0',
  author: 'Test',
  tags: [],
  topics: [],
  source: { type: 'local', path: '/test' },
}

function renderWithRouter() {
  const router = createMemoryRouter(
    [
      { path: '/', element: <Home /> },
      { path: '/course', element: <div>Course Page</div> },
    ],
    { initialEntries: ['/'] },
  )
  render(<RouterProvider router={router} />)
  return router
}

beforeEach(() => {
  window.api = {
    course: {
      selectFolder: vi.fn(),
      loadFromFolder: vi.fn(),
      loadFromGitHub: vi.fn(),
    },
    store: {
      getRecentCourses: vi.fn(),
      saveRecentCourse: vi.fn(),
      getProgress: vi.fn(),
      saveProgress: vi.fn(),
      getPreferences: vi.fn(),
      savePreferences: vi.fn(),
    },
  }
})

afterEach(() => {
  useUIStore.getState().setError(null)
  useUIStore.getState().setLoading(false)
  useCourseStore.getState().clearCourse()
})

describe('Home', () => {
  it('renders without errors', () => {
    renderWithRouter()
    expect(screen.getByText('Course Imports')).toBeInTheDocument()
  })

  it('displays the GitHub URL input field', () => {
    renderWithRouter()
    expect(screen.getByLabelText('Load from GitHub')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('https://github.com/owner/repo')).toBeInTheDocument()
  })

  it('displays the Load course button', () => {
    renderWithRouter()
    expect(screen.getByRole('button', { name: 'Load course' })).toBeInTheDocument()
  })

  it('displays the Open local folder button', () => {
    renderWithRouter()
    expect(screen.getByRole('button', { name: 'Open local folder' })).toBeInTheDocument()
  })

  it('has an inert GitHub URL input', () => {
    renderWithRouter()
    const input = screen.getByLabelText('Load from GitHub')
    expect(input).toHaveAttribute('readOnly')
  })

  it('calls selectFolder when Open local folder is clicked', async () => {
    vi.mocked(window.api.course.selectFolder).mockResolvedValue(null)
    renderWithRouter()

    fireEvent.click(screen.getByRole('button', { name: 'Open local folder' }))

    await waitFor(() => {
      expect(window.api.course.selectFolder).toHaveBeenCalled()
    })
  })

  it('does nothing when folder picker is cancelled', async () => {
    vi.mocked(window.api.course.selectFolder).mockResolvedValue(null)
    renderWithRouter()

    fireEvent.click(screen.getByRole('button', { name: 'Open local folder' }))

    await waitFor(() => {
      expect(window.api.course.selectFolder).toHaveBeenCalled()
    })

    expect(window.api.course.loadFromFolder).not.toHaveBeenCalled()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('shows loading state when a folder is selected', async () => {
    vi.mocked(window.api.course.selectFolder).mockResolvedValue('/test/folder')
    vi.mocked(window.api.course.loadFromFolder).mockImplementation(
      () => new Promise(() => {}), // never resolves — stays in loading state
    )
    renderWithRouter()

    fireEvent.click(screen.getByRole('button', { name: 'Open local folder' }))

    await waitFor(() => {
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
    expect(screen.getByText('Loading course…')).toBeInTheDocument()
  })

  it('navigates to /course on successful load', async () => {
    vi.mocked(window.api.course.selectFolder).mockResolvedValue('/test/folder')
    vi.mocked(window.api.course.loadFromFolder).mockResolvedValue({
      success: true,
      course: mockCourse,
    })
    const router = renderWithRouter()

    fireEvent.click(screen.getByRole('button', { name: 'Open local folder' }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/course')
    })
    expect(useCourseStore.getState().course).toEqual(mockCourse)
  })

  it('displays error message on failed load', async () => {
    vi.mocked(window.api.course.selectFolder).mockResolvedValue('/test/folder')
    vi.mocked(window.api.course.loadFromFolder).mockResolvedValue({
      success: false,
      error: 'Missing course.json',
    })
    renderWithRouter()

    fireEvent.click(screen.getByRole('button', { name: 'Open local folder' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(screen.getByText('Missing course.json')).toBeInTheDocument()
  })

  it('allows dismissing the error message', async () => {
    vi.mocked(window.api.course.selectFolder).mockResolvedValue('/test/folder')
    vi.mocked(window.api.course.loadFromFolder).mockResolvedValue({
      success: false,
      error: 'Invalid course',
    })
    renderWithRouter()

    fireEvent.click(screen.getByRole('button', { name: 'Open local folder' }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss error' }))

    await waitFor(() => {
      expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    })
  })
})
