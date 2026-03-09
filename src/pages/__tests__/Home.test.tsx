import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useUIStore } from '@/store/ui.store'
import { useCourseStore } from '@/store/course.store'
import Home from '../Home'
import type { Course, RecentCourse } from '@/types/course.types'

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
    initialTheme: 'system',
    course: {
      selectFolder: vi.fn(),
      loadFromFolder: vi.fn(),
      loadFromGitHub: vi.fn(),
      loadRecentCourse: vi.fn(),
      onFetchProgress: vi.fn().mockReturnValue(vi.fn()),
    },
    store: {
      getRecentCourses: vi.fn().mockResolvedValue([]),
      saveRecentCourse: vi.fn(),
      getProgress: vi.fn(),
      saveProgress: vi.fn(),
      getPreferences: vi.fn().mockResolvedValue({ theme: 'system' }),
      savePreferences: vi.fn(),
      clearAllProgress: vi.fn(),
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

  it('has an editable GitHub URL input', () => {
    renderWithRouter()
    const input = screen.getByLabelText('Load from GitHub')
    expect(input).not.toBeDisabled()
    fireEvent.change(input, { target: { value: 'https://github.com/owner/repo' } })
    expect(input).toHaveValue('https://github.com/owner/repo')
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

  describe('GitHub loading', () => {
    it('shows validation error for empty URL', async () => {
      renderWithRouter()

      fireEvent.click(screen.getByRole('button', { name: 'Load course' }))

      await waitFor(() => {
        expect(screen.getByText('Please enter a GitHub repository URL.')).toBeInTheDocument()
      })
      expect(window.api.course.loadFromGitHub).not.toHaveBeenCalled()
    })

    it('shows validation error for invalid URL format', async () => {
      renderWithRouter()

      fireEvent.change(screen.getByLabelText('Load from GitHub'), {
        target: { value: 'not-a-github-url' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Load course' }))

      await waitFor(() => {
        expect(
          screen.getByText(
            'Please enter a valid GitHub URL (e.g. https://github.com/owner/repo).',
          ),
        ).toBeInTheDocument()
      })
      expect(window.api.course.loadFromGitHub).not.toHaveBeenCalled()
    })

    it('clears validation error when user types', async () => {
      renderWithRouter()

      fireEvent.click(screen.getByRole('button', { name: 'Load course' }))

      await waitFor(() => {
        expect(screen.getByText('Please enter a GitHub repository URL.')).toBeInTheDocument()
      })

      fireEvent.change(screen.getByLabelText('Load from GitHub'), {
        target: { value: 'h' },
      })

      expect(screen.queryByText('Please enter a GitHub repository URL.')).not.toBeInTheDocument()
    })

    it('shows loading state during GitHub fetch', async () => {
      vi.mocked(window.api.course.loadFromGitHub).mockImplementation(
        () => new Promise(() => {}),
      )
      renderWithRouter()

      fireEvent.change(screen.getByLabelText('Load from GitHub'), {
        target: { value: 'https://github.com/owner/repo' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Load course' }))

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument()
      })
      expect(screen.getByText('Fetching course from GitHub…')).toBeInTheDocument()
    })

    it('navigates to /course on successful GitHub load', async () => {
      vi.mocked(window.api.course.loadFromGitHub).mockResolvedValue({
        success: true,
        course: { ...mockCourse, source: { type: 'github', path: 'https://github.com/owner/repo' } },
      })
      const router = renderWithRouter()

      fireEvent.change(screen.getByLabelText('Load from GitHub'), {
        target: { value: 'https://github.com/owner/repo' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Load course' }))

      await waitFor(() => {
        expect(router.state.location.pathname).toBe('/course')
      })
    })

    it('displays error message on failed GitHub load', async () => {
      vi.mocked(window.api.course.loadFromGitHub).mockResolvedValue({
        success: false,
        error: 'Repository not found.',
      })
      renderWithRouter()

      fireEvent.change(screen.getByLabelText('Load from GitHub'), {
        target: { value: 'https://github.com/owner/repo' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Load course' }))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
      expect(screen.getByText('Repository not found.')).toBeInTheDocument()
    })

    it('shows progress updates during GitHub fetch', async () => {
      let resolveLoad: (value: { success: true; course: Course }) => void
      vi.mocked(window.api.course.loadFromGitHub).mockImplementation(
        () => new Promise((resolve) => { resolveLoad = resolve })
      )

      // Capture the progress callback
      const cleanup = vi.fn()
      let progressCallback: (progress: { topicIndex: number; topicCount: number }) => void
      vi.mocked(window.api.course.onFetchProgress).mockImplementation((cb) => {
        progressCallback = cb
        return cleanup
      })

      renderWithRouter()

      fireEvent.change(screen.getByLabelText('Load from GitHub'), {
        target: { value: 'https://github.com/owner/repo' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Load course' }))

      await waitFor(() => {
        expect(screen.getByText('Fetching course from GitHub…')).toBeInTheDocument()
      })

      // Simulate progress event
      progressCallback!({ topicIndex: 2, topicCount: 5 })

      await waitFor(() => {
        expect(screen.getByText('Loading topic 2 of 5')).toBeInTheDocument()
      })

      // Resolve the load to clean up
      resolveLoad!({ success: true, course: { ...mockCourse, source: { type: 'github', path: 'https://github.com/owner/repo' } } })

      await waitFor(() => {
        expect(cleanup).toHaveBeenCalled()
      })
    })

    it('cleans up progress listener on fetch error', async () => {
      vi.mocked(window.api.course.loadFromGitHub).mockResolvedValue({
        success: false,
        error: 'Some error',
      })

      const cleanup = vi.fn()
      vi.mocked(window.api.course.onFetchProgress).mockReturnValue(cleanup)

      renderWithRouter()

      fireEvent.change(screen.getByLabelText('Load from GitHub'), {
        target: { value: 'https://github.com/owner/repo' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Load course' }))

      await waitFor(() => {
        expect(cleanup).toHaveBeenCalled()
      })
    })

    it('displays error for rate-limited response', async () => {
      vi.mocked(window.api.course.loadFromGitHub).mockResolvedValue({
        success: false,
        error: 'GitHub API rate limit exceeded. Try again later or add a personal access token.',
      })
      renderWithRouter()

      fireEvent.change(screen.getByLabelText('Load from GitHub'), {
        target: { value: 'https://github.com/owner/repo' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Load course' }))

      await waitFor(() => {
        expect(screen.getByText(/rate limit exceeded/)).toBeInTheDocument()
      })
    })

    it('displays offline error when user is offline', async () => {
      vi.mocked(window.api.course.loadFromGitHub).mockResolvedValue({
        success: false,
        error: "You're offline. Check your internet connection and try again.",
      })
      renderWithRouter()

      fireEvent.change(screen.getByLabelText('Load from GitHub'), {
        target: { value: 'https://github.com/owner/repo' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Load course' }))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
      expect(screen.getByText("You're offline. Check your internet connection and try again.")).toBeInTheDocument()
    })

    it('displays mid-fetch network error when connection drops', async () => {
      vi.mocked(window.api.course.loadFromGitHub).mockResolvedValue({
        success: false,
        error: 'The network connection was lost during the fetch. Check your connection and try again.',
      })
      renderWithRouter()

      fireEvent.change(screen.getByLabelText('Load from GitHub'), {
        target: { value: 'https://github.com/owner/repo' },
      })
      fireEvent.click(screen.getByRole('button', { name: 'Load course' }))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
      expect(screen.getByText(/network connection was lost/)).toBeInTheDocument()
    })
  })

  describe('Recent courses', () => {
    const mockRecentCourses: RecentCourse[] = [
      {
        id: 'course-1',
        title: 'Local Course',
        sourceType: 'local',
        lastLoaded: Date.now() - 60 * 1000,
      },
      {
        id: 'course-2',
        title: 'GitHub Course',
        sourceType: 'github',
        lastLoaded: Date.now() - 3600 * 1000,
      },
    ]

    it('displays recent courses on the home screen', async () => {
      vi.mocked(window.api.store.getRecentCourses).mockResolvedValue(mockRecentCourses)
      renderWithRouter()

      await waitFor(() => {
        expect(screen.getByText('Recent courses')).toBeInTheDocument()
      })
      expect(screen.getByText('Local Course')).toBeInTheDocument()
      expect(screen.getByText('GitHub Course')).toBeInTheDocument()
    })

    it('shows source type for each recent course', async () => {
      vi.mocked(window.api.store.getRecentCourses).mockResolvedValue(mockRecentCourses)
      renderWithRouter()

      await waitFor(() => {
        expect(screen.getByText('Local')).toBeInTheDocument()
      })
      expect(screen.getByText('GitHub')).toBeInTheDocument()
    })

    it('does not show recent courses section when list is empty', async () => {
      vi.mocked(window.api.store.getRecentCourses).mockResolvedValue([])
      renderWithRouter()

      // Wait for the effect to run
      await waitFor(() => {
        expect(window.api.store.getRecentCourses).toHaveBeenCalled()
      })
      expect(screen.queryByText('Recent courses')).not.toBeInTheDocument()
    })

    it('calls loadRecentCourse when a recent course is clicked', async () => {
      vi.mocked(window.api.store.getRecentCourses).mockResolvedValue(mockRecentCourses)
      vi.mocked(window.api.course.loadRecentCourse).mockImplementation(
        () => new Promise(() => {}),
      )
      renderWithRouter()

      await waitFor(() => {
        expect(screen.getByText('Local Course')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: 'Load Local Course' }))

      await waitFor(() => {
        expect(window.api.course.loadRecentCourse).toHaveBeenCalledWith('course-1')
      })
    })

    it('truncates long recent course titles and shows tooltip', async () => {
      const longTitle = 'B'.repeat(200)
      const longTitleCourses: RecentCourse[] = [
        {
          id: 'course-long',
          title: longTitle,
          sourceType: 'local',
          lastLoaded: Date.now(),
        },
      ]
      vi.mocked(window.api.store.getRecentCourses).mockResolvedValue(longTitleCourses)
      renderWithRouter()

      await waitFor(() => {
        expect(screen.getByText(longTitle)).toBeInTheDocument()
      })

      const titleEl = screen.getByText(longTitle)
      expect(titleEl).toHaveAttribute('title', longTitle)
      expect(titleEl.style.overflow).toBe('hidden')
      expect(titleEl.style.textOverflow).toBe('ellipsis')
    })

    it('displays offline error when clicking a GitHub recent course while offline', async () => {
      vi.mocked(window.api.store.getRecentCourses).mockResolvedValue(mockRecentCourses)
      vi.mocked(window.api.course.loadRecentCourse).mockResolvedValue({
        success: false,
        error: "You're offline. Check your internet connection and try again.",
      })
      renderWithRouter()

      await waitFor(() => {
        expect(screen.getByText('GitHub Course')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: 'Load GitHub Course' }))

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument()
      })
      expect(screen.getByText("You're offline. Check your internet connection and try again.")).toBeInTheDocument()
    })

    it('navigates to /course when a recent course loads successfully', async () => {
      vi.mocked(window.api.store.getRecentCourses).mockResolvedValue(mockRecentCourses)
      vi.mocked(window.api.course.loadRecentCourse).mockResolvedValue({
        success: true,
        course: mockCourse,
      })
      const router = renderWithRouter()

      await waitFor(() => {
        expect(screen.getByText('Local Course')).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: 'Load Local Course' }))

      await waitFor(() => {
        expect(router.state.location.pathname).toBe('/course')
      })
    })
  })
})
