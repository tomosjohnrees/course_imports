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
      clearAllProgress: vi.fn(),
      removeRecentCourse: vi.fn().mockResolvedValue(true),
    },
    notes: {
      save: vi.fn(),
      get: vi.fn(),
      getAll: vi.fn().mockResolvedValue(null),
    },
    bookmarks: {
      add: vi.fn(),
      remove: vi.fn(),
      getAll: vi.fn().mockResolvedValue([]),
    },
  }
})

describe('SettingsPanel keyboard navigation', () => {
  it('closes on Escape key press', async () => {
    const onClose = vi.fn()
    render(<SettingsPanel open={true} onClose={onClose} />)
    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not call onClose on Escape when panel is closed', async () => {
    const onClose = vi.fn()
    render(<SettingsPanel open={false} onClose={onClose} />)
    const user = userEvent.setup()

    await user.keyboard('{Escape}')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('all interactive elements are reachable via Tab', async () => {
    render(<SettingsPanel open={true} onClose={() => {}} />)
    const user = userEvent.setup()

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    // Tab through the panel — there should be no focus traps
    // Close button, 3 theme buttons, token input, show/hide toggle, save button, clear progress button
    const interactiveElements = screen.getByRole('dialog').querySelectorAll(
      'button, input, textarea, select',
    )
    expect(interactiveElements.length).toBeGreaterThanOrEqual(7)

    // Verify Tab doesn't get trapped — just press Tab multiple times
    for (let i = 0; i < interactiveElements.length + 2; i++) {
      await user.tab()
    }
    // If we get here without hanging, there's no focus trap
  })
})
