import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { applyThemeToDOM } from '@/lib/theme'

type Theme = 'light' | 'dark' | 'system'

export type RetryAction =
  | { type: 'github'; url: string }
  | { type: 'recent'; courseId: string }
  | { type: 'local'; folderPath: string }

interface UIStore {
  theme: Theme
  isLoading: boolean
  loadingMessage: string | null
  error: string | null
  retryAction: RetryAction | null
  setTheme: (theme: Theme) => void
  setLoading: (loading: boolean, message?: string) => void
  setError: (error: string | null) => void
  setRetryAction: (action: RetryAction | null) => void
}

const initialTheme = (window.api?.initialTheme ?? 'system') as Theme

export const useUIStore = create<UIStore>()(
  devtools(
    (set) => ({
      theme: initialTheme,
      isLoading: false,
      loadingMessage: null,
      error: null,
      retryAction: null,

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

      setRetryAction: (retryAction) =>
        set({ retryAction }, false, 'setRetryAction'),
    }),
    { name: 'UIStore' },
  ),
)
