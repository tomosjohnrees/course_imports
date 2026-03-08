import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
  course: {
    loadFromFolder: (folderPath: string) => ipcRenderer.invoke('course:loadFromFolder', folderPath),
    loadFromGitHub: (repoUrl: string) => ipcRenderer.invoke('course:loadFromGitHub', repoUrl),
    selectFolder: () => ipcRenderer.invoke('course:selectFolder')
  },
  store: {
    getRecentCourses: () => ipcRenderer.invoke('store:getRecentCourses'),
    saveRecentCourse: (course: { id: string; title: string; source: { type: string; path: string } }) =>
      ipcRenderer.invoke('store:saveRecentCourse', course),
    getProgress: (courseId: string) => ipcRenderer.invoke('store:getProgress', courseId),
    saveProgress: (courseId: string, data: unknown) =>
      ipcRenderer.invoke('store:saveProgress', courseId, data),
    getPreferences: () => ipcRenderer.invoke('store:getPreferences'),
    savePreferences: (prefs: { theme: string; githubToken?: string }) =>
      ipcRenderer.invoke('store:savePreferences', prefs)
  }
})
