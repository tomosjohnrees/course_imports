import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

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

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      theme: 'system',
      isLoading: false,
      loadingMessage: null,
      error: null,

      setTheme: (theme) =>
        set({ theme }, false, 'setTheme'),

      setLoading: (loading, message?) =>
        set(
          {
            isLoading: loading,
            loadingMessage: loading ? (message ?? null) : null,
          },
          false,
          'setLoading',
        ),

      setError: (error) =>
        set({ error }, false, 'setError'),
    }),
    { name: 'UIStore' },
  ),
)
