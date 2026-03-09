import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { BlockBookmark, Course, CourseBookmarks, CourseNotes, CourseProgress, QuizAnswer, Topic } from '@/types/course.types'

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
  checkpointCompletions: Record<string, boolean>
  notes: CourseNotes
  bookmarks: CourseBookmarks
  setCourse: (course: Course, persisted?: { progress?: CourseProgress; notes?: CourseNotes; bookmarks?: CourseBookmarks }) => void
  hydrateProgress: (progress: CourseProgress) => void
  hydrateNotes: (notes: CourseNotes) => void
  addBookmark: (topicId: string, blockIndex: number, label?: string) => void
  removeBookmark: (topicId: string, blockIndex: number) => void
  setActiveTopic: (topicId: string) => void
  markTopicComplete: (topicId: string) => void
  recordQuizAnswer: (key: string, answer: QuizAnswer) => void
  recordCheckpointCompletion: (key: string) => void
  updateNote: (topicId: string, text: string) => void
  clearCourse: () => void
}

function isTopicFullyComplete(
  topic: Topic,
  topicId: string,
  quizAnswers: Record<string, QuizAnswer>,
  checkpointCompletions: Record<string, boolean>,
): boolean {
  return topic.blocks.every((block, i) => {
    if (block.type === 'quiz') return Boolean(quizAnswers[`${topicId}:${i}`])
    if (block.type === 'checkpoint') return Boolean(checkpointCompletions[`${topicId}:${i}`])
    return true
  })
}

const initialState = {
  course: null as Course | null,
  activeTopic: null as string | null,
  progress: {} as CourseProgress,
  quizAnswers: {} as Record<string, QuizAnswer>,
  checkpointCompletions: {} as Record<string, boolean>,
  notes: {} as CourseNotes,
  bookmarks: [] as CourseBookmarks,
}

export const useCourseStore = create<CourseStore>()(
  devtools(
    (set) => ({
      ...initialState,

      setCourse: (course, persisted) =>
        set(
          {
            course,
            activeTopic: null,
            progress: persisted?.progress ?? {},
            quizAnswers: {},
            checkpointCompletions: {},
            notes: persisted?.notes ?? {},
            bookmarks: persisted?.bookmarks ?? [],
          },
          false,
          'setCourse',
        ),

      hydrateProgress: (progress) =>
        set({ progress }, false, 'hydrateProgress'),

      hydrateNotes: (notes) =>
        set({ notes }, false, 'hydrateNotes'),

      addBookmark: (topicId, blockIndex, label) =>
        set(
          (state) => {
            const exists = state.bookmarks.some(
              (b) => b.topicId === topicId && b.blockIndex === blockIndex,
            )
            if (exists) return state
            const bookmark: BlockBookmark = {
              topicId,
              blockIndex,
              label,
              createdAt: Date.now(),
            }
            return { bookmarks: [...state.bookmarks, bookmark] }
          },
          false,
          'addBookmark',
        ),

      removeBookmark: (topicId, blockIndex) =>
        set(
          (state) => ({
            bookmarks: state.bookmarks.filter(
              (b) => !(b.topicId === topicId && b.blockIndex === blockIndex),
            ),
          }),
          false,
          'removeBookmark',
        ),

      setActiveTopic: (topicId) =>
        set(
          (state) => {
            const alreadyTracked = Boolean(state.progress[topicId])
            if (alreadyTracked) return { activeTopic: topicId }

            const topic = state.course?.topics.find((t) => t.id === topicId)
            const hasGatedBlocks =
              topic?.blocks.some((b) => b.type === 'quiz' || b.type === 'checkpoint') ?? false

            return {
              activeTopic: topicId,
              progress: {
                ...state.progress,
                [topicId]: {
                  viewed: true,
                  complete: !hasGatedBlocks,
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

            if (!isTopicFullyComplete(topic, topicId, newQuizAnswers, state.checkpointCompletions)) {
              return { quizAnswers: newQuizAnswers }
            }

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

      recordCheckpointCompletion: (key) =>
        set(
          (state) => {
            if (state.checkpointCompletions[key]) return state

            const newCheckpointCompletions = { ...state.checkpointCompletions, [key]: true }

            const separatorIndex = key.lastIndexOf(':')
            const topicId = key.substring(0, separatorIndex)
            const topic = state.course?.topics.find((t) => t.id === topicId)

            if (!topic) return { checkpointCompletions: newCheckpointCompletions }

            if (!isTopicFullyComplete(topic, topicId, state.quizAnswers, newCheckpointCompletions)) {
              return { checkpointCompletions: newCheckpointCompletions }
            }

            return {
              checkpointCompletions: newCheckpointCompletions,
              progress: {
                ...state.progress,
                [topicId]: { viewed: true, complete: true },
              },
            }
          },
          false,
          'recordCheckpointCompletion',
        ),

      updateNote: (topicId, text) =>
        set(
          (state) => ({
            notes: {
              ...state.notes,
              [topicId]: { text, lastModified: Date.now() },
            },
          }),
          false,
          'updateNote',
        ),

      clearCourse: () =>
        set({ ...initialState }, false, 'clearCourse'),
    }),
    { name: 'CourseStore' },
  ),
)
