import { ipcMain } from 'electron'
import { IpcChannel } from './channels'
import {
  getRecentCourses,
  getProgress,
  saveProgress,
} from '../store'
import type { CourseProgress } from '../../src/types/course.types'

function isValidCourseProgress(data: unknown): data is CourseProgress {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) return false
  for (const value of Object.values(data as Record<string, unknown>)) {
    if (typeof value !== 'object' || value === null) return false
    const entry = value as Record<string, unknown>
    if (typeof entry.viewed !== 'boolean' || typeof entry.complete !== 'boolean') return false
  }
  return true
}

export function registerStoreHandlers(): void {
  ipcMain.handle(IpcChannel.store.getRecentCourses, async () => {
    return getRecentCourses()
  })

  ipcMain.handle(IpcChannel.store.saveRecentCourse, async (_event, _course: unknown) => {
    // Saving is handled automatically by course handlers after successful loads.
    // This handler exists for API completeness.
    return
  })

  ipcMain.handle(IpcChannel.store.getProgress, async (_event, courseId: string) => {
    if (typeof courseId !== 'string' || courseId.length === 0) {
      return null
    }
    return getProgress(courseId)
  })

  ipcMain.handle(
    IpcChannel.store.saveProgress,
    async (_event, courseId: string, data: unknown) => {
      if (typeof courseId !== 'string' || courseId.length === 0) {
        return
      }
      if (!isValidCourseProgress(data)) {
        return
      }
      saveProgress(courseId, data)
    },
  )

  ipcMain.handle(IpcChannel.store.getPreferences, async () => {
    return { success: false, error: 'Not implemented' }
  })

  ipcMain.handle(IpcChannel.store.savePreferences, async (_event, _prefs: unknown) => {
    return { success: false, error: 'Not implemented' }
  })
}
