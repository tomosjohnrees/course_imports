import { useEffect, useRef } from 'react'
import { useCourseStore } from '@/store/course.store'

const DEBOUNCE_MS = 500

const pendingWrites = new Set<Promise<unknown>>()

function trackNoteWrite(operation: Promise<unknown>, onError: (err: unknown) => void): void {
  const tracked = Promise.resolve(operation)
    .catch(onError)
    .finally(() => {
      pendingWrites.delete(tracked)
    })

  pendingWrites.add(tracked)
}

export async function flushNotes(): Promise<void> {
  const { course, notes } = useCourseStore.getState()
  if (!course?.id) return

  for (const [topicId, note] of Object.entries(notes)) {
    trackNoteWrite(
      window.api.notes.save(course.id, topicId, note.text),
      (err: unknown) => {
        console.error('Failed to flush note:', err)
      },
    )
  }

  while (pendingWrites.size > 0) {
    await Promise.allSettled([...pendingWrites])
  }
}

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
            trackNoteWrite(
              window.api.notes.save(courseId, topicId, note.text),
              (err: unknown) => {
                console.error('Failed to save note:', err)
              },
            )
          }
        }, DEBOUNCE_MS)
      },
    )

    return () => {
      unsubscribe()
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        void flushNotes()
        timerRef.current = null
      }
    }
  }, [])
}
