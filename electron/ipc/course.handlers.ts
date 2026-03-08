import { BrowserWindow, dialog, ipcMain } from 'electron'

export function registerCourseHandlers(): void {
  ipcMain.handle('course:selectFolder', async () => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return null

    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    return result.filePaths[0]
  })

  ipcMain.handle('course:loadFromFolder', async (_event, _folderPath: string) => {
    return { success: false, error: 'Not implemented' }
  })

  ipcMain.handle('course:loadFromGitHub', async (_event, _repoUrl: string) => {
    return { success: false, error: 'Not implemented' }
  })
}
