import Store from 'electron-store'
import type { Preferences } from '../src/types/course.types'

interface StoreSchema {
  preferences: Preferences
}

const store = new Store<StoreSchema>({
  defaults: {
    preferences: {
      theme: 'system',
    },
  },
})

export function getStoredGitHubToken(): string | undefined {
  return store.get('preferences')?.githubToken
}

export default store
