import { useState, useEffect, useCallback } from 'react'
import type { RecentCourse } from '@/types/course.types'

interface UseRecentCoursesResult {
  recentCourses: RecentCourse[]
  removeRecentCourse: (courseId: string, clearProgress: boolean) => Promise<boolean>
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

  return { recentCourses, removeRecentCourse }
}
