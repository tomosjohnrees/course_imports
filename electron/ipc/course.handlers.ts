import { BrowserWindow, dialog, ipcMain } from 'electron'
import { IpcChannel } from './channels'
import { loadCourse } from '../course/loader'
import type { ParseResult } from '../course/parser'

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

  ipcMain.handle(IpcChannel.course.loadFromFolder, async (_event, folderPath: string): Promise<ParseResult> => {
    if (!folderPath || typeof folderPath !== 'string') {
      return { success: false, error: 'A valid folder path is required' }
    }

    try {
      return await loadCourse(folderPath)
    } catch {
      return { success: false, error: 'An unexpected error occurred while loading the course' }
    }
  })

  ipcMain.handle(IpcChannel.course.loadFromGitHub, async (_event, _repoUrl: string) => {
    return { success: false, error: 'Not implemented' }
  })
}
