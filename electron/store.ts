import Store from 'electron-store'
import { safeStorage } from 'electron'
import type { Preferences } from '../src/types/course.types'

interface StoreSchema {
  preferences: Preferences
  encryptedGitHubToken?: string
}

const store = new Store<StoreSchema>({
  schema: {
    preferences: {
      type: 'object',
      properties: {
        theme: {
          type: 'string',
          enum: ['light', 'dark', 'system'],
        },
        githubToken: {
          type: 'string',
        },
      },
      required: ['theme'],
      additionalProperties: false,
    },
    encryptedGitHubToken: {
      type: 'string',
    },
  },
  defaults: {
    preferences: {
      theme: 'system',
    },
  },
})

export function getStoredGitHubToken(): string | undefined {
  if (!safeStorage.isEncryptionAvailable()) {
    return undefined
  }

  const encrypted = store.get('encryptedGitHubToken')
  if (!encrypted) {
    return undefined
  }

  try {
    return safeStorage.decryptString(Buffer.from(encrypted, 'base64'))
  } catch {
    return undefined
  }
}

export function setStoredGitHubToken(token: string): void {
  if (!safeStorage.isEncryptionAvailable()) {
    throw new Error('Encryption is not available on this system')
  }
  const encrypted = safeStorage.encryptString(token)
  store.set('encryptedGitHubToken', encrypted.toString('base64'))
}

export function clearStoredGitHubToken(): void {
  store.delete('encryptedGitHubToken')
}

export default store
