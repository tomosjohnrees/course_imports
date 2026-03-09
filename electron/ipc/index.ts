import { registerBookmarkHandlers } from './bookmarks.handlers'
import { registerCourseHandlers } from './course.handlers'
import { registerGithubHandlers } from './github.handlers'
import { registerNotesHandlers } from './notes.handlers'
import { registerStoreHandlers } from './store.handlers'

export function registerIpcHandlers(): void {
  registerBookmarkHandlers()
  registerCourseHandlers()
  registerGithubHandlers()
  registerNotesHandlers()
  registerStoreHandlers()
}
