import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, Sun, Moon, Monitor, HelpCircle } from 'lucide-react'
import { useUIStore } from '@/store/ui.store'
import { useCourseStore } from '@/store/course.store'
import './SettingsPanel.css'

type Theme = 'light' | 'dark' | 'system'

const THEME_OPTIONS: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
]

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
}

export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const theme = useUIStore((s) => s.theme)
  const setTheme = useUIStore((s) => s.setTheme)

  const [githubToken, setGithubToken] = useState('')
  const [tokenLoaded, setTokenLoaded] = useState(false)
  const [tokenVisible, setTokenVisible] = useState(false)
  const [confirmingClear, setConfirmingClear] = useState(false)
  const [tokenHelpOpen, setTokenHelpOpen] = useState(false)

  // Load preferences when panel opens
  useEffect(() => {
    if (!open) return
    let ignore = false
    setConfirmingClear(false)
    setTokenVisible(false)
    window.api.store.getPreferences().then((prefs) => {
      if (ignore) return
      setGithubToken(prefs.githubToken ?? '')
      setTokenLoaded(true)
    })
    return () => {
      ignore = true
    }
  }, [open])

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    window.api.store.savePreferences({ theme: newTheme, githubToken: undefined })
  }

  const handleTokenSave = () => {
    window.api.store.savePreferences({ theme, githubToken })
  }

  const handleClearProgress = async () => {
    await window.api.store.clearAllProgress()
    // Reset in-session progress
    const courseStore = useCourseStore.getState()
    if (courseStore.course) {
      courseStore.hydrateProgress({})
    }
    setConfirmingClear(false)
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div className="settings-backdrop" onClick={onClose} />

      {/* Panel */}
      <div className="settings-panel" role="dialog" aria-label="Settings">
        {/* Header */}
        <div className="settings-header">
          <h2 className="settings-title">Settings</h2>
          <button
            className="settings-close-btn"
            onClick={onClose}
            aria-label="Close settings"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="settings-body">
          {/* Theme */}
          <section className="settings-section">
            <h3 className="settings-section-title">Theme</h3>
            <div className="settings-theme-group">
              {THEME_OPTIONS.map(({ value, label, Icon }) => (
                <button
                  key={value}
                  className="settings-theme-btn"
                  data-active={theme === value ? '' : undefined}
                  onClick={() => handleThemeChange(value)}
                  aria-pressed={theme === value}
                >
                  <Icon size={16} strokeWidth={1.5} />
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* GitHub Token */}
          <section className="settings-section">
            <h3 className="settings-section-title">
              GitHub Token
              <span className="settings-optional-badge">Optional</span>
            </h3>
            <p className="settings-section-desc">
              Only needed if you want to load courses from private GitHub
              repositories or avoid rate limits. You can safely skip this for
              public courses.
            </p>
            <button
              className="settings-help-toggle"
              onClick={() => setTokenHelpOpen((v) => !v)}
              aria-expanded={tokenHelpOpen}
              aria-controls="token-help"
              type="button"
            >
              <HelpCircle size={14} strokeWidth={1.5} />
              {tokenHelpOpen ? 'Hide help' : "What's this?"}
            </button>
            {tokenHelpOpen && (
              <div
                id="token-help"
                className="settings-help-text"
                role="region"
                aria-label="GitHub token help"
              >
                <p>
                  A personal access token is a password-like code from GitHub
                  that lets this app read repositories on your behalf.
                </p>
                <p>
                  If you need one, create a token with <strong>read-only</strong>{' '}
                  access (the <code>public_repo</code> scope is enough for most
                  cases).{' '}
                  <a
                    href="https://github.com/settings/tokens/new"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Create a token on GitHub
                  </a>
                </p>
              </div>
            )}
            <div className="settings-token-row">
              <div className="settings-token-input-wrap">
                <input
                  type={tokenVisible ? 'text' : 'password'}
                  className="settings-input"
                  value={tokenLoaded ? githubToken : ''}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_..."
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  className="settings-token-toggle"
                  onClick={() => setTokenVisible((v) => !v)}
                  aria-label={tokenVisible ? 'Hide token' : 'Show token'}
                  type="button"
                >
                  {tokenVisible ? (
                    <EyeOff size={16} strokeWidth={1.5} />
                  ) : (
                    <Eye size={16} strokeWidth={1.5} />
                  )}
                </button>
              </div>
              <button
                className="settings-btn-secondary"
                onClick={handleTokenSave}
              >
                Save
              </button>
            </div>
          </section>

          {/* Clear Progress */}
          <section className="settings-section">
            <h3 className="settings-section-title">Progress</h3>
            <p className="settings-section-desc">
              Clear all course progress across every course. This cannot be undone.
            </p>
            {!confirmingClear ? (
              <button
                className="settings-btn-destructive"
                onClick={() => setConfirmingClear(true)}
              >
                Clear all progress
              </button>
            ) : (
              <div className="settings-confirm-row">
                <span className="settings-confirm-text">Are you sure?</span>
                <button
                  className="settings-btn-destructive"
                  onClick={handleClearProgress}
                >
                  Yes, clear everything
                </button>
                <button
                  className="settings-btn-secondary"
                  onClick={() => setConfirmingClear(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
