/// <reference types="vite/client" />

import type {
  CourseBookmarks,
  Course,
  CourseNotes,
  CourseProgress,
  Preferences,
  RecentCourse,
  TopicNote,
  ValidationResult
} from './types/course.types'

interface FetchProgressEvent {
  topicIndex: number
  topicCount: number
}

interface WindowApi {
  initialTheme: string
  course: {
    loadFromFolder: (folderPath: string) => Promise<{ success: true; course: Course } | { success: false; error: string }>
    loadFromGitHub: (repoUrl: string) => Promise<{ success: true; course: Course } | { success: false; error: string }>
    selectFolder: () => Promise<string | null>
    loadRecentCourse: (courseId: string) => Promise<{ success: true; course: Course } | { success: false; error: string }>
    onFetchProgress: (callback: (progress: FetchProgressEvent) => void) => () => void
  }
  store: {
    getRecentCourses: () => Promise<RecentCourse[]>
    saveRecentCourse: (course: RecentCourse) => Promise<void>
    getProgress: (courseId: string) => Promise<CourseProgress | null>
    saveProgress: (courseId: string, data: CourseProgress) => Promise<void>
    getPreferences: () => Promise<Preferences>
    savePreferences: (prefs: Preferences) => Promise<void>
    clearAllProgress: () => Promise<void>
    removeRecentCourse: (courseId: string, clearProgress: boolean) => Promise<boolean>
  }
  notes: {
    save: (courseId: string, topicId: string, text: string) => Promise<void>
    get: (courseId: string, topicId: string) => Promise<TopicNote | null>
    getAll: (courseId: string) => Promise<CourseNotes | null>
  }
  bookmarks: {
    add: (courseId: string, topicId: string, blockIndex: number, label?: string) => Promise<void>
    remove: (courseId: string, topicId: string, blockIndex: number) => Promise<void>
    getAll: (courseId: string) => Promise<CourseBookmarks>
  }
}

declare global {
  interface Window {
    api: WindowApi
  }
}

export {}
