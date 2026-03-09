import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import SettingsPanel from '../SettingsPanel'
import { useUIStore } from '@/store/ui.store'
import { useCourseStore } from '@/store/course.store'

beforeEach(() => {
  useUIStore.setState({ theme: 'system' })
  useCourseStore.setState({
    course: null,
    activeTopic: null,
    progress: {},
    quizAnswers: {},
  })

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
      getProgress: vi.fn().mockResolvedValue(null),
      saveProgress: vi.fn(),
      getPreferences: vi.fn().mockResolvedValue({ theme: 'system' }),
      savePreferences: vi.fn().mockResolvedValue(undefined),
      clearAllProgress: vi.fn().mockResolvedValue(undefined),
    },
  }
})

describe('SettingsPanel', () => {
  it('renders nothing when closed', () => {
    render(<SettingsPanel open={false} onClose={() => {}} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the panel when open', async () => {
    render(<SettingsPanel open={true} onClose={() => {}} />)
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('calls onClose when the close button is clicked', async () => {
    const onClose = vi.fn()
    render(<SettingsPanel open={true} onClose={onClose} />)

    const user = userEvent.setup()
    await user.click(screen.getByLabelText('Close settings'))

    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when the backdrop is clicked', async () => {
    const onClose = vi.fn()
    const { container } = render(
      <SettingsPanel open={true} onClose={onClose} />,
    )

    const user = userEvent.setup()
    const backdrop = container.querySelector('.settings-backdrop')!
    await user.click(backdrop)

    expect(onClose).toHaveBeenCalledOnce()
  })

  // Theme toggle tests
  describe('theme toggle', () => {
    it('displays all three theme options', async () => {
      render(<SettingsPanel open={true} onClose={() => {}} />)

      await waitFor(() => {
        expect(screen.getByText('Light')).toBeInTheDocument()
      })
      expect(screen.getByText('Dark')).toBeInTheDocument()
      expect(screen.getByText('System')).toBeInTheDocument()
    })

    it('marks the current theme as active', async () => {
      useUIStore.setState({ theme: 'dark' })
      render(<SettingsPanel open={true} onClose={() => {}} />)

      await waitFor(() => {
        expect(screen.getByText('Dark').closest('button')).toHaveAttribute(
          'data-active',
          '',
        )
      })
      expect(
        screen.getByText('Light').closest('button'),
      ).not.toHaveAttribute('data-active')
    })

    it('switches theme and persists it', async () => {
      render(<SettingsPanel open={true} onClose={() => {}} />)
      const user = userEvent.setup()

      await user.click(screen.getByText('Dark'))

      expect(useUIStore.getState().theme).toBe('dark')
      expect(window.api.store.savePreferences).toHaveBeenCalledWith({
        theme: 'dark',
        githubToken: undefined,
      })
    })

    it('cycles through all three themes', async () => {
      render(<SettingsPanel open={true} onClose={() => {}} />)
      const user = userEvent.setup()

      await user.click(screen.getByText('Light'))
      expect(useUIStore.getState().theme).toBe('light')

      await user.click(screen.getByText('Dark'))
      expect(useUIStore.getState().theme).toBe('dark')

      await user.click(screen.getByText('System'))
      expect(useUIStore.getState().theme).toBe('system')
    })
  })

  // GitHub token tests
  describe('GitHub token input', () => {
    it('masks the token by default', async () => {
      window.api.store.getPreferences = vi
        .fn()
        .mockResolvedValue({ theme: 'system', githubToken: 'ghp_abc123' })

      render(<SettingsPanel open={true} onClose={() => {}} />)

      await waitFor(() => {
        const input = screen.getByPlaceholderText('ghp_...')
        expect(input).toHaveAttribute('type', 'password')
      })
    })

    it('reveals the token when show toggle is clicked', async () => {
      window.api.store.getPreferences = vi
        .fn()
        .mockResolvedValue({ theme: 'system', githubToken: 'ghp_abc123' })

      render(<SettingsPanel open={true} onClose={() => {}} />)
      const user = userEvent.setup()

      await waitFor(() => {
        expect(screen.getByPlaceholderText('ghp_...')).toBeInTheDocument()
      })

      await user.click(screen.getByLabelText('Show token'))

      const input = screen.getByPlaceholderText('ghp_...')
      expect(input).toHaveAttribute('type', 'text')
    })

    it('hides the token again when toggle is clicked twice', async () => {
      render(<SettingsPanel open={true} onClose={() => {}} />)
      const user = userEvent.setup()

      await waitFor(() => {
        expect(screen.getByPlaceholderText('ghp_...')).toBeInTheDocument()
      })

      await user.click(screen.getByLabelText('Show token'))
      expect(screen.getByPlaceholderText('ghp_...')).toHaveAttribute(
        'type',
        'text',
      )

      await user.click(screen.getByLabelText('Hide token'))
      expect(screen.getByPlaceholderText('ghp_...')).toHaveAttribute(
        'type',
        'password',
      )
    })

    it('saves the token when Save is clicked', async () => {
      render(<SettingsPanel open={true} onClose={() => {}} />)
      const user = userEvent.setup()

      await waitFor(() => {
        expect(screen.getByPlaceholderText('ghp_...')).toBeInTheDocument()
      })

      const input = screen.getByPlaceholderText('ghp_...')
      await user.clear(input)
      await user.type(input, 'ghp_newtoken')
      await user.click(screen.getByText('Save'))

      expect(window.api.store.savePreferences).toHaveBeenCalledWith({
        theme: 'system',
        githubToken: 'ghp_newtoken',
      })
    })
  })

  // Clear progress tests
  describe('clear all progress', () => {
    it('shows confirmation before clearing', async () => {
      render(<SettingsPanel open={true} onClose={() => {}} />)
      const user = userEvent.setup()

      await user.click(screen.getByText('Clear all progress'))

      expect(screen.getByText('Are you sure?')).toBeInTheDocument()
      expect(
        screen.getByText('Yes, clear everything'),
      ).toBeInTheDocument()
      expect(screen.getByText('Cancel')).toBeInTheDocument()
      // The IPC should NOT have been called yet
      expect(window.api.store.clearAllProgress).not.toHaveBeenCalled()
    })

    it('clears progress after confirming', async () => {
      useCourseStore.setState({
        course: {
          id: 'c1',
          title: 'C1',
          description: '',
          version: '1',
          author: '',
          tags: [],
          topics: [{ id: 't1', title: 'T1', blocks: [] }],
          source: { type: 'local', path: '/' },
        },
        progress: { t1: { viewed: true, complete: true } },
      })

      render(<SettingsPanel open={true} onClose={() => {}} />)
      const user = userEvent.setup()

      await user.click(screen.getByText('Clear all progress'))
      await user.click(screen.getByText('Yes, clear everything'))

      expect(window.api.store.clearAllProgress).toHaveBeenCalledOnce()
      // In-session progress should be reset
      await waitFor(() => {
        expect(useCourseStore.getState().progress).toEqual({})
      })
    })

    it('cancels confirmation without clearing', async () => {
      render(<SettingsPanel open={true} onClose={() => {}} />)
      const user = userEvent.setup()

      await user.click(screen.getByText('Clear all progress'))
      await user.click(screen.getByText('Cancel'))

      expect(window.api.store.clearAllProgress).not.toHaveBeenCalled()
      // Confirmation should be dismissed
      expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument()
    })
  })
})
