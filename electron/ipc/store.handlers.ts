import { ipcMain } from 'electron'

export function registerStoreHandlers(): void {
  ipcMain.handle('store:getRecentCourses', async () => {
    return { success: false, error: 'Not implemented' }
  })

  ipcMain.handle('store:saveRecentCourse', async (_event, _course: unknown) => {
    return { success: false, error: 'Not implemented' }
  })

  ipcMain.handle('store:getProgress', async (_event, _courseId: string) => {
    return { success: false, error: 'Not implemented' }
  })

  ipcMain.handle('store:saveProgress', async (_event, _courseId: string, _data: unknown) => {
    return { success: false, error: 'Not implemented' }
  })

  ipcMain.handle('store:getPreferences', async () => {
    return { success: false, error: 'Not implemented' }
  })

  ipcMain.handle('store:savePreferences', async (_event, _prefs: unknown) => {
    return { success: false, error: 'Not implemented' }
  })
}
