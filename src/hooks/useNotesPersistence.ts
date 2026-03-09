import { useEffect, useRef } from 'react'
import { useCourseStore } from '@/store/course.store'

const DEBOUNCE_MS = 500

export function useNotesPersistence(): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const unsubscribe = useCourseStore.subscribe(
      (state, prevState) => {
        if (state.notes === prevState.notes) return
        const courseId = state.course?.id
        if (!courseId) return

        const notesSnapshot = state.notes

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          timerRef.current = null
          // Save each topic note individually via the IPC API
          for (const [topicId, note] of Object.entries(notesSnapshot)) {
            Promise.resolve(
              window.api.notes.save(courseId, topicId, note.text),
            ).catch((err: unknown) => {
              console.error('Failed to save note:', err)
            })
          }
        }, DEBOUNCE_MS)
      },
    )

    return () => {
      unsubscribe()
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        flushNotes()
        timerRef.current = null
      }
    }
  }, [])
}

function flushNotes(): void {
  const { course, notes } = useCourseStore.getState()
  if (!course?.id) return
  for (const [topicId, note] of Object.entries(notes)) {
    Promise.resolve(
      window.api.notes.save(course.id, topicId, note.text),
    ).catch((err: unknown) => {
      console.error('Failed to flush note on cleanup:', err)
    })
  }
}
