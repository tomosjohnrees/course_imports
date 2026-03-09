import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { applyThemeToDOM } from '@/lib/theme'

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

const initialTheme = (window.api?.initialTheme ?? 'system') as Theme

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      theme: initialTheme,
      isLoading: false,
      loadingMessage: null,
      error: null,

      setTheme: (theme) => {
        applyThemeToDOM(theme)
        set({ theme }, false, 'setTheme')
      },

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
