import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Course, CourseProgress, QuizAnswer, Topic } from '@/types/course.types'

/**
 * Returns the topic ID to auto-select when a course loads.
 * - No topics → null
 * - Has progress → first incomplete topic (or first topic if all complete)
 * - No progress → first topic
 */
export function pickInitialTopic(
  topics: Topic[],
  progress: CourseProgress,
): string | null {
  if (topics.length === 0) return null

  const hasProgress = Object.keys(progress).length > 0
  if (!hasProgress) return topics[0].id

  const firstIncomplete = topics.find((t) => !progress[t.id]?.complete)
  return firstIncomplete?.id ?? topics[0].id
}

interface CourseStore {
  course: Course | null
  activeTopic: string | null
  progress: CourseProgress
  quizAnswers: Record<string, QuizAnswer>
  setCourse: (course: Course) => void
  hydrateProgress: (progress: CourseProgress) => void
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

      hydrateProgress: (progress) =>
        set({ progress }, false, 'hydrateProgress'),

      setActiveTopic: (topicId) =>
        set(
          (state) => {
            const alreadyTracked = Boolean(state.progress[topicId])
            if (alreadyTracked) return { activeTopic: topicId }

            const topic = state.course?.topics.find((t) => t.id === topicId)
            const hasQuizBlocks =
              topic?.blocks.some((b) => b.type === 'quiz') ?? false

            return {
              activeTopic: topicId,
              progress: {
                ...state.progress,
                [topicId]: {
                  viewed: true,
                  complete: !hasQuizBlocks,
                },
              },
            }
          },
          false,
          'setActiveTopic',
        ),

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
          (state) => {
            const newQuizAnswers = { ...state.quizAnswers, [key]: answer }

            const separatorIndex = key.lastIndexOf(':')
            const topicId = key.substring(0, separatorIndex)
            const topic = state.course?.topics.find((t) => t.id === topicId)

            if (!topic) return { quizAnswers: newQuizAnswers }

            const allQuizzesAnswered = topic.blocks.every(
              (block, i) =>
                block.type !== 'quiz' || newQuizAnswers[`${topicId}:${i}`],
            )

            if (!allQuizzesAnswered) return { quizAnswers: newQuizAnswers }

            return {
              quizAnswers: newQuizAnswers,
              progress: {
                ...state.progress,
                [topicId]: { viewed: true, complete: true },
              },
            }
          },
          false,
          'recordQuizAnswer',
        ),

      clearCourse: () =>
        set({ ...initialState }, false, 'clearCourse'),
    }),
    { name: 'CourseStore' },
  ),
)
