import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import type { Course, ValidationResult } from '../src/types/course.types'
import { registerIpcHandlers } from './ipc'
import { getStoredTheme } from './store'
import { IpcChannel } from './ipc/channels'

export type { Course, ValidationResult }

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  })

  win.once('ready-to-show', () => win.show())

  // In dev mode, load from the dev server; in production, load the built file
  if (process.env['ELECTRON_RENDERER_URL']) {
    win.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    win.loadFile(join(__dirname, '../renderer/index.html'))
  }

  win.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(process.env['ELECTRON_RENDERER_URL'] ?? 'file://')) {
      event.preventDefault()
    }
  })

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://')) {
      shell.openExternal(url)
    }
    return { action: 'deny' }
  })
}

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
}

// Synchronous IPC handler for initial theme — called from preload before first render
ipcMain.on(IpcChannel.store.getInitialTheme, (event) => {
  event.returnValue = getStoredTheme()
})

app.whenReady().then(() => {
  registerIpcHandlers()
  createWindow()

  app.on('second-instance', () => {
    const win = BrowserWindow.getAllWindows()[0]
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
