import { useEffect, useRef } from 'react'
import { useCourseStore } from '@/store/course.store'

const DEBOUNCE_MS = 800

export function useProgressPersistence(): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const unsubscribe = useCourseStore.subscribe(
      (state, prevState) => {
        if (state.progress === prevState.progress) return
        const courseId = state.course?.id
        if (!courseId) return

        const progressSnapshot = state.progress

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          timerRef.current = null
          window.api.store.saveProgress(courseId, progressSnapshot)
        }, DEBOUNCE_MS)
      },
    )

    return () => {
      unsubscribe()
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        // Flush pending save on unmount
        const { course, progress } = useCourseStore.getState()
        if (course?.id) {
          window.api.store.saveProgress(course.id, progress)
        }
        timerRef.current = null
      }
    }
  }, [])
}
