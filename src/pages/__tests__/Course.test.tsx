import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach } from 'vitest'
import { useCourseStore } from '@/store/course.store'
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
})
