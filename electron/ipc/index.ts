import { registerCourseHandlers } from './course.handlers'
import { registerGithubHandlers } from './github.handlers'
import { registerStoreHandlers } from './store.handlers'

export function registerIpcHandlers(): void {
  registerCourseHandlers()
  registerGithubHandlers()
  registerStoreHandlers()
}
