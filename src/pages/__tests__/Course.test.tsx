import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useCourseStore, pickInitialTopic } from '@/store/course.store'
import Course from '../Course'
import type { Course as CourseType } from '@/types/course.types'

const baseCourse: CourseType = {
  id: 'test-course',
  title: 'Test Course',
  description: 'A test course',
  version: '1.0.0',
  author: 'Test',
  tags: [],
  topics: [],
  source: { type: 'local', path: '/test' },
}

beforeEach(() => {
  useCourseStore.setState({
    course: null,
    activeTopic: null,
    progress: {},
    quizAnswers: {},
  })
})

describe('Course', () => {
  it('shows empty state when course has zero topics', () => {
    useCourseStore.setState({ course: baseCourse })
    render(<Course />)

    expect(screen.getByText('No topics available')).toBeInTheDocument()
    expect(
      screen.getByText('This course does not contain any topics.'),
    ).toBeInTheDocument()
  })

  it('shows empty state when active topic has no blocks', () => {
    const courseWithEmptyTopic: CourseType = {
      ...baseCourse,
      topics: [{ id: 'empty-topic', title: 'Empty', blocks: [] }],
    }
    useCourseStore.setState({
      course: courseWithEmptyTopic,
      activeTopic: 'empty-topic',
    })
    render(<Course />)

    expect(screen.getByText('No content')).toBeInTheDocument()
    expect(
      screen.getByText('This topic does not have any content yet.'),
    ).toBeInTheDocument()
  })

  it('renders blocks when topic has content', () => {
    const courseWithContent: CourseType = {
      ...baseCourse,
      topics: [
        {
          id: 'topic-1',
          title: 'Topic 1',
          blocks: [{ type: 'text', content: 'Hello world' }],
        },
      ],
    }
    useCourseStore.setState({
      course: courseWithContent,
      activeTopic: 'topic-1',
    })
    render(<Course />)

    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })

  it('renders nothing when no topic is selected and topics exist', () => {
    const courseWithTopics: CourseType = {
      ...baseCourse,
      topics: [
        {
          id: 'topic-1',
          title: 'Topic 1',
          blocks: [{ type: 'text', content: 'Content' }],
        },
      ],
    }
    useCourseStore.setState({ course: courseWithTopics, activeTopic: null })
    const { container } = render(<Course />)

    expect(container.innerHTML).toBe('')
  })

  it('does not expose internal paths or stack traces in empty states', () => {
    useCourseStore.setState({ course: baseCourse })
    const { container } = render(<Course />)

    const text = container.textContent ?? ''
    expect(text).not.toMatch(/\/Users\//)
    expect(text).not.toMatch(/\/home\//)
    expect(text).not.toMatch(/Error:/)
    expect(text).not.toMatch(/at\s+\w+\s+\(/)
  })

  describe('auto-selection', () => {
    const courseWithContent: CourseType = {
      ...baseCourse,
      topics: [
        {
          id: 'topic-1',
          title: 'Topic 1',
          blocks: [{ type: 'text', content: 'First topic content' }],
        },
        {
          id: 'topic-2',
          title: 'Topic 2',
          blocks: [{ type: 'text', content: 'Second topic content' }],
        },
        {
          id: 'topic-3',
          title: 'Topic 3',
          blocks: [{ type: 'text', content: 'Third topic content' }],
        },
      ],
    }

    it('renders content immediately when setCourse + auto-select first topic (no progress)', () => {
      useCourseStore.getState().setCourse(courseWithContent)
      // Simulate what useCourse hook does after hydration
      const { course, progress } = useCourseStore.getState()
      const topicId = pickInitialTopic(course!.topics, progress)
      if (topicId) useCourseStore.getState().setActiveTopic(topicId)

      render(<Course />)

      expect(screen.getByText('First topic content')).toBeInTheDocument()
    })

    it('resumes at first incomplete topic when loading with saved progress', () => {
      useCourseStore.getState().setCourse(courseWithContent)
      useCourseStore.getState().hydrateProgress({
        'topic-1': { viewed: true, complete: true },
        'topic-2': { viewed: true, complete: false },
      })
      const { course, progress } = useCourseStore.getState()
      const topicId = pickInitialTopic(course!.topics, progress)
      if (topicId) useCourseStore.getState().setActiveTopic(topicId)

      render(<Course />)

      expect(useCourseStore.getState().activeTopic).toBe('topic-2')
      expect(screen.getByText('Second topic content')).toBeInTheDocument()
    })

    it('selects first topic when all topics are complete', () => {
      useCourseStore.getState().setCourse(courseWithContent)
      useCourseStore.getState().hydrateProgress({
        'topic-1': { viewed: true, complete: true },
        'topic-2': { viewed: true, complete: true },
        'topic-3': { viewed: true, complete: true },
      })
      const { course, progress } = useCourseStore.getState()
      const topicId = pickInitialTopic(course!.topics, progress)
      if (topicId) useCourseStore.getState().setActiveTopic(topicId)

      render(<Course />)

      expect(useCourseStore.getState().activeTopic).toBe('topic-1')
      expect(screen.getByText('First topic content')).toBeInTheDocument()
    })

    it('still renders empty state when course has no topics', () => {
      useCourseStore.getState().setCourse(baseCourse)
      const { course, progress } = useCourseStore.getState()
      const topicId = pickInitialTopic(course!.topics, progress)
      expect(topicId).toBeNull()

      render(<Course />)

      expect(screen.getByText('No topics available')).toBeInTheDocument()
    })
  })
})
