import { useEffect, useRef } from 'react'
import { useCourseStore } from '@/store/course.store'
import type { CourseBookmarks } from '@/types/course.types'

const pendingWrites = new Set<Promise<unknown>>()

function trackBookmarkWrite(
  operation: Promise<unknown>,
  onError: (err: unknown) => void,
): void {
  const tracked = Promise.resolve(operation)
    .catch(onError)
    .finally(() => {
      pendingWrites.delete(tracked)
    })

  pendingWrites.add(tracked)
}

export async function flushBookmarks(): Promise<void> {
  while (pendingWrites.size > 0) {
    await Promise.allSettled([...pendingWrites])
  }
}

export function useBookmarksPersistence(): void {
  const prevRef = useRef<CourseBookmarks | null>(null)

  useEffect(() => {
    const unsubscribe = useCourseStore.subscribe(
      (state, prevState) => {
        if (state.bookmarks === prevState.bookmarks) return
        const courseId = state.course?.id
        if (!courseId) return

        // When the course changes, setCourse resets bookmarks to [].
        // Don't treat that reset as the user removing bookmarks.
        if (state.course !== prevState.course) {
          prevRef.current = state.bookmarks
          return
        }

        const prev = prevRef.current ?? prevState.bookmarks
        const curr = state.bookmarks
        prevRef.current = curr

        // Find added bookmarks
        for (const b of curr) {
          const wasPresent = prev.some(
            (p) => p.topicId === b.topicId && p.blockIndex === b.blockIndex,
          )
          if (!wasPresent) {
            trackBookmarkWrite(
              window.api.bookmarks.add(courseId, b.topicId, b.blockIndex, b.label),
              (err: unknown) => {
                console.error('Failed to persist bookmark add:', err)
              },
            )
          }
        }

        // Find removed bookmarks
        for (const b of prev) {
          const stillPresent = curr.some(
            (c) => c.topicId === b.topicId && c.blockIndex === b.blockIndex,
          )
          if (!stillPresent) {
            trackBookmarkWrite(
              window.api.bookmarks.remove(courseId, b.topicId, b.blockIndex),
              (err: unknown) => {
                console.error('Failed to persist bookmark remove:', err)
              },
            )
          }
        }
      },
    )

    return unsubscribe
  }, [])
}
