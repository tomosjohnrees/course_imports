import { contextBridge, ipcRenderer } from 'electron'
import type { Preferences, RecentCourse } from '../src/types/course.types'
import { IpcChannel } from './ipc/channels'

contextBridge.exposeInMainWorld('api', {
  course: {
    loadFromFolder: (folderPath: string) => ipcRenderer.invoke(IpcChannel.course.loadFromFolder, folderPath),
    loadFromGitHub: (repoUrl: string) => ipcRenderer.invoke(IpcChannel.course.loadFromGitHub, repoUrl),
    selectFolder: () => ipcRenderer.invoke(IpcChannel.course.selectFolder)
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
      ipcRenderer.invoke(IpcChannel.store.savePreferences, prefs)
  }
})
