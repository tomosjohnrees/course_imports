import { create } from 'zustand'

type Theme = 'light' | 'dark' | 'system'

interface UIStore {
  theme: Theme
  isLoading: boolean
  loadingMessage: string | null
  error: string | null
  setTheme: (theme: Theme) => void
  setLoading: (loading: boolean, message?: string) => void
  setError: (error: string | null) => void
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'system',
  isLoading: false,
  loadingMessage: null,
  error: null,

  setTheme: (theme) =>
    set({ theme }),

  setLoading: (loading, message?) =>
    set({
      isLoading: loading,
      loadingMessage: loading ? (message ?? null) : null,
    }),

  setError: (error) =>
    set({ error }),
}))
