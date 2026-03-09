import Store from 'electron-store'
import { safeStorage } from 'electron'
import type { CourseProgress, Preferences, RecentCourse } from '../src/types/course.types'

export interface StoredRecentCourse {
  id: string
  title: string
  sourceType: 'local' | 'github'
  sourcePath: string
  lastLoaded: number
}

interface StoredPreferences {
  theme: Preferences['theme']
}

interface StoreSchema {
  preferences: StoredPreferences
  encryptedGitHubToken?: string
  recentCourses: StoredRecentCourse[]
  progress: Record<string, CourseProgress>
}

const MAX_RECENT_COURSES = 10

const store = new Store<StoreSchema>({
  schema: {
    preferences: {
      type: 'object',
      properties: {
        theme: {
          type: 'string',
          enum: ['light', 'dark', 'system'],
        },
      },
      required: ['theme'],
      additionalProperties: false,
    },
    encryptedGitHubToken: {
      type: 'string',
    },
    recentCourses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          sourceType: { type: 'string', enum: ['local', 'github'] },
          sourcePath: { type: 'string' },
          lastLoaded: { type: 'number' },
        },
        required: ['id', 'title', 'sourceType', 'sourcePath', 'lastLoaded'],
        additionalProperties: false,
      },
      default: [],
    },
    progress: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            viewed: { type: 'boolean' },
            complete: { type: 'boolean' },
          },
          required: ['viewed', 'complete'],
          additionalProperties: false,
        },
      },
      default: {},
    },
  },
  defaults: {
    preferences: {
      theme: 'system',
    },
    recentCourses: [],
    progress: {},
  },
})

export function getStoredGitHubToken(): string | undefined {
  if (!safeStorage.isEncryptionAvailable()) {
    return undefined
  }

  const encrypted = store.get('encryptedGitHubToken')
  if (!encrypted) {
    return undefined
  }

  try {
    return safeStorage.decryptString(Buffer.from(encrypted, 'base64'))
  } catch {
    return undefined
  }
}

export function setStoredGitHubToken(token: string): void {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Encryption is not available on this system')
  }
  const encrypted = safeStorage.encryptString(token)
  store.set('encryptedGitHubToken', encrypted.toString('base64'))
}

export function clearStoredGitHubToken(): void {
  store.delete('encryptedGitHubToken')
}

export function saveRecentCourse(entry: StoredRecentCourse): void {
  const courses = store.get('recentCourses')
  const filtered = courses.filter((c) => c.id !== entry.id)
  const updated = [entry, ...filtered].slice(0, MAX_RECENT_COURSES)
  store.set('recentCourses', updated)
}

export function getRecentCourses(): RecentCourse[] {
  const courses = store.get('recentCourses')
  return courses.map(({ id, title, sourceType, lastLoaded }) => ({
    id,
    title,
    sourceType,
    lastLoaded,
  }))
}

export function getStoredRecentCourse(id: string): StoredRecentCourse | undefined {
  const courses = store.get('recentCourses')
  return courses.find((c) => c.id === id)
}

export function removeRecentCourse(id: string): boolean {
  const courses = store.get('recentCourses')
  const filtered = courses.filter((c) => c.id !== id)
  if (filtered.length === courses.length) return false
  store.set('recentCourses', filtered)
  return true
}

export function clearCourseProgress(courseId: string): void {
  const allProgress = store.get('progress')
  const { [courseId]: _, ...rest } = allProgress
  store.set('progress', rest)
}

export function getProgress(courseId: string): CourseProgress | null {
  const allProgress = store.get('progress')
  return allProgress[courseId] ?? null
}

export function saveProgress(courseId: string, data: CourseProgress): void {
  const allProgress = store.get('progress')
  store.set('progress', { ...allProgress, [courseId]: data })
}

export function clearAllProgress(): void {
  store.set('progress', {})
}

const VALID_THEMES = ['light', 'dark', 'system'] as const

export function getPreferences(): Preferences {
  const prefs = store.get('preferences')
  const token = getStoredGitHubToken()
  return {
    theme: prefs.theme,
    ...(token ? { githubToken: token } : {}),
  }
}

export function isValidPreferences(data: unknown): data is Preferences {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return false
  const obj = data as Record<string, unknown>
  if (!VALID_THEMES.includes(obj.theme as (typeof VALID_THEMES)[number])) return false
  if (obj.githubToken !== undefined && typeof obj.githubToken !== 'string') return false
  return true
}

export function savePreferences(prefs: Preferences): void {
  store.set('preferences', { theme: prefs.theme })

  if (prefs.githubToken !== undefined) {
    if (prefs.githubToken === '') {
      clearStoredGitHubToken()
    } else {
      setStoredGitHubToken(prefs.githubToken)
    }
  }
}

export function getStoredTheme(): string {
  return store.get('preferences').theme
}

export default store
