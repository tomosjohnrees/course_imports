import { contextBridge, ipcRenderer } from 'electron'
import type { Preferences, RecentCourse } from '../src/types/course.types'
import { IpcChannel } from './ipc/channels'

// Load initial theme synchronously before first render to prevent flash
const initialTheme = ipcRenderer.sendSync(IpcChannel.store.getInitialTheme) as string

contextBridge.exposeInMainWorld('api', {
  initialTheme,
  course: {
    loadFromFolder: (folderPath: string) => ipcRenderer.invoke(IpcChannel.course.loadFromFolder, folderPath),
    loadFromGitHub: (repoUrl: string) => ipcRenderer.invoke(IpcChannel.course.loadFromGitHub, repoUrl),
    selectFolder: () => ipcRenderer.invoke(IpcChannel.course.selectFolder),
    loadRecentCourse: (courseId: string) => ipcRenderer.invoke(IpcChannel.course.loadRecentCourse, courseId),
    onFetchProgress: (callback: (progress: { topicIndex: number; topicCount: number }) => void) => {
      const handler = (_event: Electron.IpcRendererEvent, progress: { topicIndex: number; topicCount: number }) => {
        callback(progress)
      }
      ipcRenderer.on(IpcChannel.course.fetchProgress, handler)
      return () => { ipcRenderer.removeListener(IpcChannel.course.fetchProgress, handler) }
    }
  },
  store: {
    getRecentCourses: () => ipcRenderer.invoke(IpcChannel.store.getRecentCourses),
    saveRecentCourse: (course: RecentCourse) =>
      ipcRenderer.invoke(IpcChannel.store.saveRecentCourse, course),
    getProgress: (courseId: string) => ipcRenderer.invoke(IpcChannel.store.getProgress, courseId),
    saveProgress: (courseId: string, data: unknown) =>
      ipcRenderer.invoke(IpcChannel.store.saveProgress, courseId, data),
    getPreferences: () => ipcRenderer.invoke(IpcChannel.store.getPreferences),
    savePreferences: (prefs: Preferences) =>
      ipcRenderer.invoke(IpcChannel.store.savePreferences, prefs),
    clearAllProgress: () => ipcRenderer.invoke(IpcChannel.store.clearAllProgress),
    removeRecentCourse: (courseId: string, clearProgress: boolean) =>
      ipcRenderer.invoke(IpcChannel.store.removeRecentCourse, courseId, clearProgress)
  },
  notes: {
    save: (courseId: string, topicId: string, text: string) =>
      ipcRenderer.invoke(IpcChannel.notes.save, courseId, topicId, text),
    get: (courseId: string, topicId: string) =>
      ipcRenderer.invoke(IpcChannel.notes.get, courseId, topicId),
    getAll: (courseId: string) =>
      ipcRenderer.invoke(IpcChannel.notes.getAll, courseId)
  },
  bookmarks: {
    add: (courseId: string, topicId: string, blockIndex: number, label?: string) =>
      ipcRenderer.invoke(IpcChannel.bookmarks.add, courseId, topicId, blockIndex, label),
    remove: (courseId: string, topicId: string, blockIndex: number) =>
      ipcRenderer.invoke(IpcChannel.bookmarks.remove, courseId, topicId, blockIndex),
    getAll: (courseId: string) =>
      ipcRenderer.invoke(IpcChannel.bookmarks.getAll, courseId)
  }
})
