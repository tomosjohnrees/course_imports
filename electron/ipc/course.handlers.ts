import { BrowserWindow, dialog, ipcMain } from 'electron'
import { IpcChannel } from './channels'

export function registerCourseHandlers(): void {
  ipcMain.handle(IpcChannel.course.selectFolder, async () => {
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

  ipcMain.handle(IpcChannel.course.loadFromFolder, async (_event, _folderPath: string) => {
    return { success: false, error: 'Not implemented' }
  })

  ipcMain.handle(IpcChannel.course.loadFromGitHub, async (_event, _repoUrl: string) => {
    return { success: false, error: 'Not implemented' }
  })
}
