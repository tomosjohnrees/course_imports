import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Course, CourseProgress, QuizAnswer } from '@/types/course.types'

interface CourseStore {
  course: Course | null
  activeTopic: string | null
  progress: CourseProgress
  quizAnswers: Record<string, QuizAnswer>
  setCourse: (course: Course) => void
  setActiveTopic: (topicId: string) => void
  markTopicComplete: (topicId: string) => void
  recordQuizAnswer: (key: string, answer: QuizAnswer) => void
  clearCourse: () => void
}

const initialState = {
  course: null as Course | null,
  activeTopic: null as string | null,
  progress: {} as CourseProgress,
  quizAnswers: {} as Record<string, QuizAnswer>,
}

export const useCourseStore = create<CourseStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setCourse: (course) =>
        set(
          {
            course,
            activeTopic: null,
            progress: {},
            quizAnswers: {},
          },
          false,
          'setCourse',
        ),

      setActiveTopic: (topicId) =>
        set({ activeTopic: topicId }, false, 'setActiveTopic'),

      markTopicComplete: (topicId) =>
        set(
          (state) => ({
            progress: {
              ...state.progress,
              [topicId]: { viewed: true, complete: true },
            },
          }),
          false,
          'markTopicComplete',
        ),

      recordQuizAnswer: (key, answer) =>
        set(
          (state) => ({
            quizAnswers: {
              ...state.quizAnswers,
              [key]: answer,
            },
          }),
          false,
          'recordQuizAnswer',
        ),

      clearCourse: () =>
        set({ ...initialState }, false, 'clearCourse'),
    }),
    { name: 'CourseStore' },
  ),
)
