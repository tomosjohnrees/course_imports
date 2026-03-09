import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import NotesPanel from '../NotesPanel'
import { useCourseStore } from '@/store/course.store'

beforeEach(() => {
  useCourseStore.setState({
    course: null,
    activeTopic: 'topic-1',
    progress: {},
    notes: {},
  })
})

describe('NotesPanel', () => {
  it('renders nothing when no active topic', () => {
    useCourseStore.setState({ activeTopic: null })
    const { container } = render(<NotesPanel />)
    expect(container.innerHTML).toBe('')
  })

  it('renders a collapsed notes panel with header', () => {
    render(<NotesPanel />)

    const button = screen.getByRole('button', { name: /notes/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
  })

  it('shows textarea when expanded', async () => {
    const user = userEvent.setup()
    render(<NotesPanel />)

    await user.click(screen.getByRole('button', { name: /notes/i }))

    expect(screen.getByRole('textbox', { name: 'Topic notes' })).toBeInTheDocument()
  })

  it('displays existing note content when expanded', async () => {
    useCourseStore.setState({
      notes: { 'topic-1': { text: 'My saved note', lastModified: Date.now() } },
    })
    const user = userEvent.setup()
    render(<NotesPanel />)

    await user.click(screen.getByRole('button', { name: /notes/i }))

    expect(screen.getByRole('textbox')).toHaveValue('My saved note')
  })

  it('updates store when user types', async () => {
    const user = userEvent.setup()
    render(<NotesPanel />)

    await user.click(screen.getByRole('button', { name: /notes/i }))
    await user.type(screen.getByRole('textbox'), 'Hello')

    const { notes } = useCourseStore.getState()
    expect(notes['topic-1']?.text).toBe('Hello')
  })

  it('loads correct note when switching topics', async () => {
    useCourseStore.setState({
      notes: {
        'topic-1': { text: 'Note for topic 1', lastModified: Date.now() },
        'topic-2': { text: 'Note for topic 2', lastModified: Date.now() },
      },
    })
    const user = userEvent.setup()
    const { rerender } = render(<NotesPanel />)

    await user.click(screen.getByRole('button', { name: /notes/i }))
    expect(screen.getByRole('textbox')).toHaveValue('Note for topic 1')

    act(() => {
      useCourseStore.setState({ activeTopic: 'topic-2' })
    })
    rerender(<NotesPanel />)

    expect(screen.getByRole('textbox')).toHaveValue('Note for topic 2')
  })

  it('shows empty textarea with placeholder when no note exists', async () => {
    const user = userEvent.setup()
    render(<NotesPanel />)

    await user.click(screen.getByRole('button', { name: /notes/i }))

    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('')
    expect(textarea).toHaveAttribute('placeholder', 'Write your notes for this topic...')
  })

  it('shows "saved" indicator when collapsed and note has content', () => {
    useCourseStore.setState({
      notes: { 'topic-1': { text: 'Some note', lastModified: Date.now() } },
    })
    render(<NotesPanel />)

    expect(screen.getByText('saved')).toBeInTheDocument()
  })

  it('does not show "saved" indicator when note is empty', () => {
    render(<NotesPanel />)
    expect(screen.queryByText('saved')).not.toBeInTheDocument()
  })

  it('hides "saved" indicator when expanded', async () => {
    useCourseStore.setState({
      notes: { 'topic-1': { text: 'Some note', lastModified: Date.now() } },
    })
    const user = userEvent.setup()
    render(<NotesPanel />)

    expect(screen.getByText('saved')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /notes/i }))

    expect(screen.queryByText('saved')).not.toBeInTheDocument()
  })
})
