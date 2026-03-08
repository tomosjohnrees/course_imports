import { ipcMain } from 'electron'
import { IpcChannel } from './channels'

export function registerStoreHandlers(): void {
  ipcMain.handle(IpcChannel.store.getRecentCourses, async () => {
    return { success: false, error: 'Not implemented' }
  })

  ipcMain.handle(IpcChannel.store.saveRecentCourse, async (_event, _course: unknown) => {
    return { success: false, error: 'Not implemented' }
  })

  ipcMain.handle(IpcChannel.store.getProgress, async (_event, _courseId: string) => {
    return { success: false, error: 'Not implemented' }
  })

  ipcMain.handle(IpcChannel.store.saveProgress, async (_event, _courseId: string, _data: unknown) => {
    return { success: false, error: 'Not implemented' }
  })

  ipcMain.handle(IpcChannel.store.getPreferences, async () => {
    return { success: false, error: 'Not implemented' }
  })

  ipcMain.handle(IpcChannel.store.savePreferences, async (_event, _prefs: unknown) => {
    return { success: false, error: 'Not implemented' }
  })
}
