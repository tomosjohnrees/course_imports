import { useEffect, useRef } from 'react'
import { useCourseStore } from '@/store/course.store'
import type { CourseBookmarks } from '@/types/course.types'

export function useBookmarksPersistence(): void {
  const prevRef = useRef<CourseBookmarks | null>(null)

  useEffect(() => {
    const unsubscribe = useCourseStore.subscribe(
      (state, prevState) => {
        if (state.bookmarks === prevState.bookmarks) return
        const courseId = state.course?.id
        if (!courseId) return

        const prev = prevRef.current ?? prevState.bookmarks
        const curr = state.bookmarks
        prevRef.current = curr

        // Find added bookmarks
        for (const b of curr) {
          const wasPresent = prev.some(
            (p) => p.topicId === b.topicId && p.blockIndex === b.blockIndex,
          )
          if (!wasPresent) {
            Promise.resolve(
              window.api.bookmarks.add(courseId, b.topicId, b.blockIndex, b.label),
            ).catch((err: unknown) => {
              console.error('Failed to persist bookmark add:', err)
            })
          }
        }

        // Find removed bookmarks
        for (const b of prev) {
          const stillPresent = curr.some(
            (c) => c.topicId === b.topicId && c.blockIndex === b.blockIndex,
          )
          if (!stillPresent) {
            Promise.resolve(
              window.api.bookmarks.remove(courseId, b.topicId, b.blockIndex),
            ).catch((err: unknown) => {
              console.error('Failed to persist bookmark remove:', err)
            })
          }
        }
      },
    )

    return unsubscribe
  }, [])
}
