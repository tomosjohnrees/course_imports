import { ipcMain } from 'electron'
import { IpcChannel } from './channels'
import { saveNote, getNote, getAllNotes } from '../store'

export function registerNotesHandlers(): void {
  ipcMain.handle(
    IpcChannel.notes.save,
    async (_event, courseId: unknown, topicId: unknown, text: unknown) => {
      if (typeof courseId !== 'string' || courseId.length === 0) return
      if (typeof topicId !== 'string' || topicId.length === 0) return
      if (typeof text !== 'string') return
      saveNote(courseId, topicId, text)
    },
  )

  ipcMain.handle(
    IpcChannel.notes.get,
    async (_event, courseId: unknown, topicId: unknown) => {
      if (typeof courseId !== 'string' || courseId.length === 0) return null
      if (typeof topicId !== 'string' || topicId.length === 0) return null
      return getNote(courseId, topicId)
    },
  )

  ipcMain.handle(
    IpcChannel.notes.getAll,
    async (_event, courseId: unknown) => {
      if (typeof courseId !== 'string' || courseId.length === 0) return null
      return getAllNotes(courseId)
    },
  )
}
