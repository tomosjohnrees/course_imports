/// <reference types="vite/client" />

import type {
  Course,
  CourseProgress,
  Preferences,
  RecentCourse,
  ValidationResult
} from './types/course.types'

interface WindowApi {
  course: {
    loadFromFolder: (folderPath: string) => Promise<{ success: true; course: Course } | { success: false; error: string }>
    loadFromGitHub: (repoUrl: string) => Promise<{ success: true; course: Course } | { success: false; error: string }>
    selectFolder: () => Promise<string | null>
    loadRecentCourse: (courseId: string) => Promise<{ success: true; course: Course } | { success: false; error: string }>
  }
  store: {
    getRecentCourses: () => Promise<RecentCourse[]>
    saveRecentCourse: (course: RecentCourse) => Promise<void>
    getProgress: (courseId: string) => Promise<CourseProgress | null>
    saveProgress: (courseId: string, data: CourseProgress) => Promise<void>
    getPreferences: () => Promise<Preferences>
    savePreferences: (prefs: Preferences) => Promise<void>
  }
}

declare global {
  interface Window {
    api: WindowApi
  }
}

export {}
