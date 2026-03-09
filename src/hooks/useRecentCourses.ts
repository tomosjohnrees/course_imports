import { useState, useEffect, useCallback } from 'react'
import type { RecentCourse } from '@/types/course.types'

interface UseRecentCoursesResult {
  recentCourses: RecentCourse[]
  removeRecentCourse: (courseId: string, clearProgress: boolean) => Promise<boolean>
  hasProgress: (courseId: string) => Promise<boolean>
}

export function useRecentCourses(): UseRecentCoursesResult {
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])

  useEffect(() => {
    window.api.store.getRecentCourses().then(setRecentCourses).catch(() => {})
  }, [])

  const removeRecentCourse = useCallback(async (courseId: string, clearProgress: boolean) => {
    const removed = await window.api.store.removeRecentCourse(courseId, clearProgress)
    if (removed) {
      setRecentCourses((prev) => prev.filter((c) => c.id !== courseId))
    }
    return removed
  }, [])

  const hasProgress = useCallback(async (courseId: string): Promise<boolean> => {
    const progress = await window.api.store.getProgress(courseId)
    return progress !== null && Object.keys(progress).length > 0
  }, [])

  return { recentCourses, removeRecentCourse, hasProgress }
}
