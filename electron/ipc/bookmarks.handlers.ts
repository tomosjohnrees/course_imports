import { ipcMain } from 'electron'
import { IpcChannel } from './channels'
import { addBookmark, removeBookmark, getAllBookmarks } from '../store'

export function registerBookmarkHandlers(): void {
  ipcMain.handle(
    IpcChannel.bookmarks.add,
    async (_event, courseId: unknown, topicId: unknown, blockIndex: unknown, label: unknown) => {
      if (typeof courseId !== 'string' || courseId.length === 0) return
      if (typeof topicId !== 'string' || topicId.length === 0) return
      if (typeof blockIndex !== 'number' || !Number.isInteger(blockIndex) || blockIndex < 0) return
      const sanitisedLabel = typeof label === 'string' ? label : undefined
      addBookmark(courseId, topicId, blockIndex, sanitisedLabel)
    },
  )

  ipcMain.handle(
    IpcChannel.bookmarks.remove,
    async (_event, courseId: unknown, topicId: unknown, blockIndex: unknown) => {
      if (typeof courseId !== 'string' || courseId.length === 0) return
      if (typeof topicId !== 'string' || topicId.length === 0) return
      if (typeof blockIndex !== 'number' || !Number.isInteger(blockIndex) || blockIndex < 0) return
      removeBookmark(courseId, topicId, blockIndex)
    },
  )

  ipcMain.handle(
    IpcChannel.bookmarks.getAll,
    async (_event, courseId: unknown) => {
      if (typeof courseId !== 'string' || courseId.length === 0) return []
      return getAllBookmarks(courseId)
    },
  )
}
