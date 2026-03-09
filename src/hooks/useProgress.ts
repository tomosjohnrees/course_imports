import { useCourseStore } from '@/store/course.store'

export type TopicStatus = 'not-started' | 'viewed' | 'complete'

export function useTopicStatus(topicId: string): TopicStatus {
  return useCourseStore((s) => {
    const entry = s.progress[topicId]
    if (!entry) return 'not-started'
    return entry.complete ? 'complete' : 'viewed'
  })
}

export function useCompletionPercent(): number {
  return useCourseStore((s) => {
    const topics = s.course?.topics ?? []
    if (topics.length === 0) return 0
    const completed = topics.filter((t) => s.progress[t.id]?.complete).length
    return (completed / topics.length) * 100
  })
}
