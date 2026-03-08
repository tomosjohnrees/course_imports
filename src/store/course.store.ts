import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Course, CourseProgress } from '@/types/course.types'

interface CourseStore {
  course: Course | null
  activeTopic: string | null
  progress: CourseProgress
  setCourse: (course: Course) => void
  setActiveTopic: (topicId: string) => void
  markTopicComplete: (topicId: string) => void
  clearCourse: () => void
}

const initialState = {
  course: null as Course | null,
  activeTopic: null as string | null,
  progress: {} as CourseProgress,
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

      clearCourse: () =>
        set({ ...initialState }, false, 'clearCourse'),
    }),
    { name: 'CourseStore' },
  ),
)
