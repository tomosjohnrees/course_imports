export const IpcChannel = {
  course: {
    selectFolder: 'course:selectFolder',
    loadFromFolder: 'course:loadFromFolder',
    loadFromGitHub: 'course:loadFromGitHub',
    loadRecentCourse: 'course:loadRecentCourse',
    fetchProgress: 'course:fetchProgress'
  },
  store: {
    getRecentCourses: 'store:getRecentCourses',
    saveRecentCourse: 'store:saveRecentCourse',
    getProgress: 'store:getProgress',
    saveProgress: 'store:saveProgress',
    getPreferences: 'store:getPreferences',
    savePreferences: 'store:savePreferences',
    getInitialTheme: 'store:getInitialTheme',
    clearAllProgress: 'store:clearAllProgress',
    removeRecentCourse: 'store:removeRecentCourse'
  },
  notes: {
    save: 'notes:save',
    get: 'notes:get',
    getAll: 'notes:getAll'
  }
} as const
