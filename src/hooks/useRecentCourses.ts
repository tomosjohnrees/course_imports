import { useState, useEffect } from 'react'
import type { RecentCourse } from '@/types/course.types'

export function useRecentCourses(): RecentCourse[] {
  const [recentCourses, setRecentCourses] = useState<RecentCourse[]>([])

  useEffect(() => {
    window.api.store.getRecentCourses().then(setRecentCourses).catch(() => {})
  }, [])

  return recentCourses
}
