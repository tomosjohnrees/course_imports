import { useEffect, useRef } from 'react'
import { useCourseStore } from '@/store/course.store'

const DEBOUNCE_MS = 800

const saveListeners = new Set<() => void>()

export function onProgressSaved(cb: () => void): () => void {
  saveListeners.add(cb)
  return () => { saveListeners.delete(cb) }
}

function notifySaved(): void {
  saveListeners.forEach((cb) => cb())
}

export function flushProgress(): void {
  const { course, progress } = useCourseStore.getState()
  if (course?.id) {
    Promise.resolve(
      window.api.store.saveProgress(course.id, progress),
    ).catch((err: unknown) => {
      console.error('Failed to flush progress on cleanup:', err)
    })
  }
}

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
          Promise.resolve(
            window.api.store.saveProgress(courseId, progressSnapshot),
          ).then(notifySaved, (err) => {
            console.error('Failed to save progress:', err)
          })
        }, DEBOUNCE_MS)
      },
    )

    return () => {
      unsubscribe()
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        flushProgress()
        timerRef.current = null
      }
    }
  }, [])
}
