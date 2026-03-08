import { describe, it, expect, beforeEach } from 'vitest'
import { useUIStore } from '../ui.store'

beforeEach(() => {
  useUIStore.setState({
    theme: 'system',
    isLoading: false,
    loadingMessage: null,
    error: null,
  })
})

describe('ui.store', () => {
  describe('setTheme', () => {
    it('updates the theme', () => {
      useUIStore.getState().setTheme('dark')
      expect(useUIStore.getState().theme).toBe('dark')
    })

    it('accepts all valid theme values', () => {
      for (const theme of ['light', 'dark', 'system'] as const) {
        useUIStore.getState().setTheme(theme)
        expect(useUIStore.getState().theme).toBe(theme)
      }
    })
  })

  describe('setLoading', () => {
    it('sets isLoading and loadingMessage', () => {
      useUIStore.getState().setLoading(true, 'Loading course...')

      const state = useUIStore.getState()
      expect(state.isLoading).toBe(true)
      expect(state.loadingMessage).toBe('Loading course...')
    })

    it('clears isLoading and loadingMessage when set to false', () => {
      useUIStore.setState({ isLoading: true, loadingMessage: 'Loading...' })

      useUIStore.getState().setLoading(false)

      const state = useUIStore.getState()
      expect(state.isLoading).toBe(false)
      expect(state.loadingMessage).toBeNull()
    })

    it('sets isLoading true with null message when no message provided', () => {
      useUIStore.getState().setLoading(true)

      const state = useUIStore.getState()
      expect(state.isLoading).toBe(true)
      expect(state.loadingMessage).toBeNull()
    })
  })

  describe('setError', () => {
    it('sets an error message', () => {
      useUIStore.getState().setError('Something went wrong')
      expect(useUIStore.getState().error).toBe('Something went wrong')
    })

    it('clears the error when set to null', () => {
      useUIStore.setState({ error: 'Previous error' })

      useUIStore.getState().setError(null)
      expect(useUIStore.getState().error).toBeNull()
    })
  })
})
