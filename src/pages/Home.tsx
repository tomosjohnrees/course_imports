import { useState } from 'react'
import { Inbox, X } from 'lucide-react'
import { useCourse, isValidGitHubUrl } from '@/hooks/useCourse'
import { useRecentCourses } from '@/hooks/useRecentCourses'
import { useUIStore } from '@/store/ui.store'
import ErrorState from '@/components/ErrorState'

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: 'var(--space-16) var(--space-6)',
  fontFamily: 'var(--font-sans)',
}

const headingStyle: React.CSSProperties = {
  fontSize: 'var(--text-2xl)',
  fontWeight: 700,
  lineHeight: 'var(--leading-2xl)',
  margin: 0,
  color: 'var(--color-text-primary)',
}

const subtitleStyle: React.CSSProperties = {
  fontSize: 'var(--text-base)',
  lineHeight: 'var(--leading-base)',
  color: 'var(--color-text-secondary)',
  margin: 'var(--space-2) 0 var(--space-10)',
}

const sectionStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '420px',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  color: 'var(--color-text-secondary)',
  marginBottom: 'var(--space-2)',
}

const inputRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-2)',
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  background: 'var(--color-bg)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-2) var(--space-3)',
  fontSize: 'var(--text-base)',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
}

const primaryButtonStyle: React.CSSProperties = {
  background: 'var(--color-accent)',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-2) var(--space-4)',
  fontSize: 'var(--text-base)',
  fontWeight: 500,
  cursor: 'default',
  fontFamily: 'var(--font-sans)',
  whiteSpace: 'nowrap',
}

const dividerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-4)',
  margin: 'var(--space-8) 0',
  color: 'var(--color-text-muted)',
  fontSize: 'var(--text-sm)',
}

const dividerLineStyle: React.CSSProperties = {
  flex: 1,
  height: '1px',
  background: 'var(--color-border)',
}

const secondaryButtonStyle: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-2) var(--space-4)',
  fontSize: 'var(--text-base)',
  fontWeight: 500,
  color: 'var(--color-text-primary)',
  cursor: 'default',
  fontFamily: 'var(--font-sans)',
}

const loadingStyle: React.CSSProperties = {
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-secondary)',
  marginTop: 'var(--space-4)',
  textAlign: 'center',
}

const recentEmptyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 'var(--space-2)',
  padding: 'var(--space-6) var(--space-4)',
  color: 'var(--color-text-muted)',
  textAlign: 'center',
}

const recentEmptyHeadingStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 'var(--text-sm)',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
}

const recentEmptyMessageStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 'var(--text-sm)',
  lineHeight: 'var(--leading-sm)',
  color: 'var(--color-text-muted)',
}

const validationStyle: React.CSSProperties = {
  fontSize: 'var(--text-sm)',
  color: 'var(--color-destructive)',
  margin: 'var(--space-2) 0 0',
}

const recentSectionStyle: React.CSSProperties = {
  marginTop: 'var(--space-10)',
  width: '100%',
  maxWidth: '420px',
}

const recentHeadingStyle: React.CSSProperties = {
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  color: 'var(--color-text-secondary)',
  margin: '0 0 var(--space-3)',
}

const recentListStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-1)',
}

const recentItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 'var(--space-3)',
  background: 'var(--color-bg)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  cursor: 'default',
  fontFamily: 'var(--font-sans)',
  width: '100%',
}

const recentTitleStyle: React.CSSProperties = {
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  color: 'var(--color-text-primary)',
  margin: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}

const recentTitleWrapperStyle: React.CSSProperties = {
  overflow: 'hidden',
  minWidth: 0,
  flex: 1,
}

const recentMetaWrapperStyle: React.CSSProperties = {
  flexShrink: 0,
}

const recentMetaStyle: React.CSSProperties = {
  fontSize: 'var(--text-xs)',
  color: 'var(--color-text-muted)',
  margin: 0,
  textAlign: 'right' as const,
}

const removeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: 'var(--space-1)',
  cursor: 'default',
  color: 'var(--color-text-muted)',
  borderRadius: 'var(--radius-sm)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  marginLeft: 'var(--space-2)',
}

const confirmOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
}

const confirmDialogStyle: React.CSSProperties = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-6)',
  maxWidth: '360px',
  width: '100%',
  fontFamily: 'var(--font-sans)',
}

const confirmHeadingStyle: React.CSSProperties = {
  fontSize: 'var(--text-base)',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
  margin: '0 0 var(--space-2)',
}

const confirmMessageStyle: React.CSSProperties = {
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-secondary)',
  margin: '0 0 var(--space-4)',
  lineHeight: 'var(--leading-sm)',
}

const confirmActionsStyle: React.CSSProperties = {
  display: 'flex',
  gap: 'var(--space-2)',
  justifyContent: 'flex-end',
}

const confirmCancelStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-2) var(--space-4)',
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  color: 'var(--color-text-primary)',
  cursor: 'default',
  fontFamily: 'var(--font-sans)',
}

const confirmRemoveStyle: React.CSSProperties = {
  background: 'var(--color-destructive)',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-2) var(--space-4)',
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  color: '#FFFFFF',
  cursor: 'default',
  fontFamily: 'var(--font-sans)',
}

const confirmKeepStyle: React.CSSProperties = {
  background: 'var(--color-accent)',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  padding: 'var(--space-2) var(--space-4)',
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  color: '#FFFFFF',
  cursor: 'default',
  fontFamily: 'var(--font-sans)',
}

function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString()
}

export default function Home() {
  const { loadLocalCourse, loadGitHubCourse, loadRecentCourse } = useCourse()
  const isLoading = useUIStore((s) => s.isLoading)
  const loadingMessage = useUIStore((s) => s.loadingMessage)
  const error = useUIStore((s) => s.error)
  const setError = useUIStore((s) => s.setError)
  const retryAction = useUIStore((s) => s.retryAction)
  const [githubUrl, setGithubUrl] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const { recentCourses, removeRecentCourse } = useRecentCourses()
  const [confirmRemove, setConfirmRemove] = useState<{ id: string; title: string } | null>(null)
  const [hasProgress, setHasProgress] = useState(false)

  function handleRetry() {
    if (!retryAction) {
      setError(null)
      return
    }
    switch (retryAction.type) {
      case 'github':
        loadGitHubCourse(retryAction.url)
        break
      case 'recent':
        loadRecentCourse(retryAction.courseId)
        break
      case 'local':
        loadLocalCourse(retryAction.folderPath)
        break
    }
  }

  async function handleRemoveClick(course: { id: string; title: string }) {
    const progress = await window.api.store.getProgress(course.id)
    const courseHasProgress = progress !== null && Object.keys(progress).length > 0
    if (courseHasProgress) {
      setHasProgress(true)
      setConfirmRemove(course)
    } else {
      setHasProgress(false)
      setConfirmRemove(course)
    }
  }

  async function handleConfirmRemove(clearProgress: boolean) {
    if (!confirmRemove) return
    await removeRecentCourse(confirmRemove.id, clearProgress)
    setConfirmRemove(null)
    setHasProgress(false)
  }

  function handleLoadGitHub() {
    if (!githubUrl.trim()) {
      setValidationError('Please enter a GitHub repository URL.')
      return
    }
    if (!isValidGitHubUrl(githubUrl)) {
      setValidationError('Please enter a valid GitHub URL (e.g. https://github.com/owner/repo).')
      return
    }
    setValidationError(null)
    loadGitHubCourse(githubUrl)
  }

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Course Imports</h1>
      <p style={subtitleStyle}>Load a course to get started</p>

      <div style={sectionStyle}>
        <label htmlFor="github-url" style={labelStyle}>
          Load from GitHub
        </label>
        <div style={inputRowStyle}>
          <input
            id="github-url"
            type="text"
            placeholder="https://github.com/owner/repo"
            style={inputStyle}
            value={githubUrl}
            onChange={(e) => {
              setGithubUrl(e.target.value)
              if (validationError) setValidationError(null)
            }}
            disabled={isLoading}
          />
          <button
            type="button"
            style={primaryButtonStyle}
            onClick={handleLoadGitHub}
            disabled={isLoading}
          >
            Load course
          </button>
        </div>
        {validationError && (
          <p style={validationStyle} role="alert">
            {validationError}
          </p>
        )}

        <div style={dividerStyle}>
          <span style={dividerLineStyle} />
          <span>or</span>
          <span style={dividerLineStyle} />
        </div>

        <button
          type="button"
          style={secondaryButtonStyle}
          onClick={() => loadLocalCourse()}
          disabled={isLoading}
        >
          Open local folder
        </button>

        {isLoading && (
          <p style={loadingStyle} role="status">
            {loadingMessage ?? 'Loading\u2026'}
          </p>
        )}

        {error && !isLoading && (
          <ErrorState
            message={error}
            onRetry={handleRetry}
            onDismiss={() => setError(null)}
          />
        )}
      </div>

      <div style={recentSectionStyle}>
        <h2 style={recentHeadingStyle}>Recent courses</h2>
        {recentCourses.length > 0 ? (
          <ul style={recentListStyle}>
            {recentCourses.map((course) => (
              <li key={course.id} style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  type="button"
                  style={recentItemStyle}
                  onClick={() => loadRecentCourse(course.id)}
                  disabled={isLoading}
                  aria-label={`Load ${course.title}`}
                >
                  <div style={recentTitleWrapperStyle}>
                    <p title={course.title} style={recentTitleStyle}>{course.title}</p>
                  </div>
                  <div style={recentMetaWrapperStyle}>
                    <p style={recentMetaStyle}>
                      {course.sourceType === 'github' ? 'GitHub' : 'Local'}
                    </p>
                    <p style={recentMetaStyle}>
                      {formatRelativeTime(course.lastLoaded)}
                    </p>
                  </div>
                </button>
                <button
                  type="button"
                  style={removeButtonStyle}
                  onClick={() => handleRemoveClick(course)}
                  disabled={isLoading}
                  aria-label={`Remove ${course.title}`}
                >
                  <X size={16} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div style={recentEmptyStyle}>
            <Inbox size={32} strokeWidth={1.5} aria-hidden="true" />
            <h3 style={recentEmptyHeadingStyle}>No courses yet</h3>
            <p style={recentEmptyMessageStyle}>
              Load a course from GitHub or open a local folder to get started.
            </p>
          </div>
        )}
      </div>

      {confirmRemove && (
        <div style={confirmOverlayStyle} role="dialog" aria-label="Confirm removal">
          <div style={confirmDialogStyle}>
            <h2 style={confirmHeadingStyle}>Remove course</h2>
            {hasProgress ? (
              <>
                <p style={confirmMessageStyle}>
                  &ldquo;{confirmRemove.title}&rdquo; has saved progress. Would you like to keep the progress data or remove it too?
                </p>
                <div style={confirmActionsStyle}>
                  <button
                    type="button"
                    style={confirmCancelStyle}
                    onClick={() => setConfirmRemove(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    style={confirmRemoveStyle}
                    onClick={() => handleConfirmRemove(true)}
                  >
                    Remove with progress
                  </button>
                  <button
                    type="button"
                    style={confirmKeepStyle}
                    onClick={() => handleConfirmRemove(false)}
                  >
                    Keep progress
                  </button>
                </div>
              </>
            ) : (
              <>
                <p style={confirmMessageStyle}>
                  Remove &ldquo;{confirmRemove.title}&rdquo; from your recent courses?
                </p>
                <div style={confirmActionsStyle}>
                  <button
                    type="button"
                    style={confirmCancelStyle}
                    onClick={() => setConfirmRemove(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    style={confirmRemoveStyle}
                    onClick={() => handleConfirmRemove(false)}
                  >
                    Remove
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
