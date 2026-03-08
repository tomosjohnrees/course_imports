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
