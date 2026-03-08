export const IpcChannel = {
  course: {
    selectFolder: 'course:selectFolder',
    loadFromFolder: 'course:loadFromFolder',
    loadFromGitHub: 'course:loadFromGitHub',
    loadRecentCourse: 'course:loadRecentCourse'
  },
  store: {
    getRecentCourses: 'store:getRecentCourses',
    saveRecentCourse: 'store:saveRecentCourse',
    getProgress: 'store:getProgress',
    saveProgress: 'store:saveProgress',
    getPreferences: 'store:getPreferences',
    savePreferences: 'store:savePreferences'
  }
} as const
