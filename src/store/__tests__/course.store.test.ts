import { describe, it, expect, beforeEach } from 'vitest'
import { useCourseStore } from '../course.store'
import type { Course } from '@/types/course.types'

const mockCourse: Course = {
  id: 'test-course',
  title: 'Test Course',
  description: 'A test course',
  version: '1.0.0',
  author: 'Test Author',
  tags: ['test'],
  topics: [
    { id: 'topic-1', title: 'Topic 1', blocks: [] },
    { id: 'topic-2', title: 'Topic 2', blocks: [] },
  ],
  source: { type: 'local', path: '/tmp/test' },
}

const courseWithQuizzes: Course = {
  ...mockCourse,
  id: 'quiz-course',
  topics: [
    {
      id: 'topic-no-quiz',
      title: 'No Quiz',
      blocks: [{ type: 'text', content: 'Hello' }],
    },
    {
      id: 'topic-with-quiz',
      title: 'With Quiz',
      blocks: [
        { type: 'text', content: 'Intro' },
        {
          type: 'quiz',
          variant: 'multiple-choice',
          question: 'Q1?',
          options: ['A', 'B'],
          answer: 0,
        },
        {
          type: 'quiz',
          variant: 'free-text',
          question: 'Q2?',
          sampleAnswer: 'yes',
        },
      ],
    },
    {
      id: 'topic-single-quiz',
      title: 'Single Quiz',
      blocks: [
        {
          type: 'quiz',
          variant: 'multiple-choice',
          question: 'Q?',
          options: ['X', 'Y'],
          answer: 1,
        },
      ],
    },
  ],
}

beforeEach(() => {
  useCourseStore.setState({
    course: null,
    activeTopic: null,
    progress: {},
  })
})

describe('course.store', () => {
  describe('setCourse', () => {
    it('sets the active course', () => {
      useCourseStore.getState().setCourse(mockCourse)
      expect(useCourseStore.getState().course).toBe(mockCourse)
    })

    it('resets activeTopic when setting a new course', () => {
      useCourseStore.setState({ activeTopic: 'old-topic' })
      useCourseStore.getState().setCourse(mockCourse)
      expect(useCourseStore.getState().activeTopic).toBeNull()
    })

    it('resets progress when setting a new course', () => {
      useCourseStore.setState({
        progress: { 'old-topic': { viewed: true, complete: true } },
      })
      useCourseStore.getState().setCourse(mockCourse)
      expect(useCourseStore.getState().progress).toEqual({})
    })
  })

  describe('setActiveTopic', () => {
    it('updates the active topic', () => {
      useCourseStore.getState().setActiveTopic('topic-1')
      expect(useCourseStore.getState().activeTopic).toBe('topic-1')
    })

    it('marks a topic without quizzes as viewed and complete on first visit', () => {
      useCourseStore.getState().setCourse(courseWithQuizzes)
      useCourseStore.getState().setActiveTopic('topic-no-quiz')

      expect(useCourseStore.getState().progress['topic-no-quiz']).toEqual({
        viewed: true,
        complete: true,
      })
    })

    it('marks a topic with quizzes as viewed but not complete on first visit', () => {
      useCourseStore.getState().setCourse(courseWithQuizzes)
      useCourseStore.getState().setActiveTopic('topic-with-quiz')

      expect(useCourseStore.getState().progress['topic-with-quiz']).toEqual({
        viewed: true,
        complete: false,
      })
    })

    it('does not overwrite existing progress when revisiting a topic', () => {
      useCourseStore.getState().setCourse(courseWithQuizzes)
      useCourseStore.setState({
        progress: { 'topic-with-quiz': { viewed: true, complete: true } },
      })
      useCourseStore.getState().setActiveTopic('topic-with-quiz')

      expect(useCourseStore.getState().progress['topic-with-quiz']).toEqual({
        viewed: true,
        complete: true,
      })
    })
  })

  describe('markTopicComplete', () => {
    it('marks a topic as complete', () => {
      useCourseStore.getState().markTopicComplete('topic-1')
      expect(useCourseStore.getState().progress['topic-1']).toEqual({
        viewed: true,
        complete: true,
      })
    })

    it('preserves other topics when marking one complete', () => {
      useCourseStore.getState().markTopicComplete('topic-1')
      useCourseStore.getState().markTopicComplete('topic-2')

      const { progress } = useCourseStore.getState()
      expect(progress['topic-1']).toEqual({ viewed: true, complete: true })
      expect(progress['topic-2']).toEqual({ viewed: true, complete: true })
    })
  })

  describe('recordQuizAnswer — auto-completion', () => {
    it('does not mark topic complete when only some quizzes are answered', () => {
      useCourseStore.getState().setCourse(courseWithQuizzes)
      useCourseStore.getState().setActiveTopic('topic-with-quiz')

      useCourseStore.getState().recordQuizAnswer('topic-with-quiz:1', {
        selectedOption: 0,
        correct: true,
      })

      expect(useCourseStore.getState().progress['topic-with-quiz']).toEqual({
        viewed: true,
        complete: false,
      })
    })

    it('marks topic complete when all quizzes are answered', () => {
      useCourseStore.getState().setCourse(courseWithQuizzes)
      useCourseStore.getState().setActiveTopic('topic-with-quiz')

      useCourseStore.getState().recordQuizAnswer('topic-with-quiz:1', {
        selectedOption: 0,
        correct: true,
      })
      useCourseStore.getState().recordQuizAnswer('topic-with-quiz:2', {
        textAnswer: 'yes',
        correct: true,
      })

      expect(useCourseStore.getState().progress['topic-with-quiz']).toEqual({
        viewed: true,
        complete: true,
      })
    })

    it('marks single-quiz topic complete after answering its only quiz', () => {
      useCourseStore.getState().setCourse(courseWithQuizzes)
      useCourseStore.getState().setActiveTopic('topic-single-quiz')

      useCourseStore.getState().recordQuizAnswer('topic-single-quiz:0', {
        selectedOption: 1,
        correct: true,
      })

      expect(useCourseStore.getState().progress['topic-single-quiz']).toEqual({
        viewed: true,
        complete: true,
      })
    })
  })

  describe('completion percentage', () => {
    function getCompletionPercent(): number {
      const { course, progress } = useCourseStore.getState()
      const topics = course?.topics ?? []
      if (topics.length === 0) return 0
      const completed = topics.filter((t) => progress[t.id]?.complete).length
      return (completed / topics.length) * 100
    }

    it('returns 0 when no course is loaded', () => {
      expect(getCompletionPercent()).toBe(0)
    })

    it('returns 0 when no topics are complete', () => {
      useCourseStore.getState().setCourse(mockCourse)
      expect(getCompletionPercent()).toBe(0)
    })

    it('returns 100 when all topics are complete', () => {
      useCourseStore.getState().setCourse(mockCourse)
      useCourseStore.getState().markTopicComplete('topic-1')
      useCourseStore.getState().markTopicComplete('topic-2')
      expect(getCompletionPercent()).toBe(100)
    })

    it('returns correct percentage for mixed completion', () => {
      useCourseStore.getState().setCourse(courseWithQuizzes)
      // complete 1 of 3 topics
      useCourseStore.getState().setActiveTopic('topic-no-quiz')
      expect(Math.round(getCompletionPercent())).toBe(33)
    })
  })

  describe('progress scoping', () => {
    it('resets progress and quizAnswers when loading a different course', () => {
      useCourseStore.getState().setCourse(mockCourse)
      useCourseStore.getState().markTopicComplete('topic-1')
      useCourseStore.getState().recordQuizAnswer('topic-1:0', {
        selectedOption: 0,
        correct: true,
      })

      const otherCourse: Course = {
        ...mockCourse,
        id: 'other-course',
        topics: [{ id: 'other-topic', title: 'Other', blocks: [] }],
      }
      useCourseStore.getState().setCourse(otherCourse)

      const state = useCourseStore.getState()
      expect(state.progress).toEqual({})
      expect(state.quizAnswers).toEqual({})
    })
  })

  describe('clearCourse', () => {
    it('resets all course-related state', () => {
      useCourseStore.setState({
        course: mockCourse,
        activeTopic: 'topic-1',
        progress: { 'topic-1': { viewed: true, complete: true } },
      })

      useCourseStore.getState().clearCourse()

      const state = useCourseStore.getState()
      expect(state.course).toBeNull()
      expect(state.activeTopic).toBeNull()
      expect(state.progress).toEqual({})
    })
  })
})
