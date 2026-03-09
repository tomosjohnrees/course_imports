import { useState } from 'react'
import { Inbox } from 'lucide-react'
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
  padding: '64px 24px',
  fontFamily: '"Geist", system-ui, sans-serif',
}

const headingStyle: React.CSSProperties = {
  fontSize: '30px',
  fontWeight: 700,
  lineHeight: 1.2,
  margin: 0,
  color: '#1A1916',
}

const subtitleStyle: React.CSSProperties = {
  fontSize: '15px',
  lineHeight: 1.6,
  color: '#6B6860',
  margin: '8px 0 40px',
}

const sectionStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: '420px',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: '#6B6860',
  marginBottom: '8px',
}

const inputRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  background: '#F9F8F6',
  border: '1px solid #E8E6E1',
  borderRadius: '6px',
  padding: '8px 12px',
  fontSize: '15px',
  color: '#1A1916',
  fontFamily: '"Geist", system-ui, sans-serif',
  outline: 'none',
}

const primaryButtonStyle: React.CSSProperties = {
  background: '#2563EB',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '6px',
  padding: '8px 16px',
  fontSize: '15px',
  fontWeight: 500,
  cursor: 'default',
  fontFamily: '"Geist", system-ui, sans-serif',
  whiteSpace: 'nowrap',
}

const dividerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  margin: '32px 0',
  color: '#A8A49D',
  fontSize: '13px',
}

const dividerLineStyle: React.CSSProperties = {
  flex: 1,
  height: '1px',
  background: '#E8E6E1',
}

const secondaryButtonStyle: React.CSSProperties = {
  width: '100%',
  background: 'transparent',
  border: '1px solid #E8E6E1',
  borderRadius: '6px',
  padding: '8px 16px',
  fontSize: '15px',
  fontWeight: 500,
  color: '#1A1916',
  cursor: 'default',
  fontFamily: '"Geist", system-ui, sans-serif',
}

const loadingStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#6B6860',
  marginTop: '16px',
  textAlign: 'center',
}

const recentEmptyStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '24px 16px',
  color: '#A8A49D',
  textAlign: 'center',
}

const recentEmptyHeadingStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '14px',
  fontWeight: 600,
  color: '#6B6860',
}

const recentEmptyMessageStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '13px',
  lineHeight: 1.5,
  color: '#A8A49D',
}

const validationStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#991B1B',
  margin: '6px 0 0',
}

const recentSectionStyle: React.CSSProperties = {
  marginTop: '40px',
  width: '100%',
  maxWidth: '420px',
}

const recentHeadingStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: 500,
  color: '#6B6860',
  margin: '0 0 12px',
}

const recentListStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
}

const recentItemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 12px',
  background: '#F9F8F6',
  border: '1px solid #E8E6E1',
  borderRadius: '6px',
  cursor: 'default',
  fontFamily: '"Geist", system-ui, sans-serif',
  width: '100%',
}

const recentTitleStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#1A1916',
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
  fontSize: '12px',
  color: '#A8A49D',
  margin: 0,
  textAlign: 'right' as const,
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
  const [githubUrl, setGithubUrl] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const recentCourses = useRecentCourses()

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
          onClick={loadLocalCourse}
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
            onRetry={() => setError(null)}
            onDismiss={() => setError(null)}
          />
        )}
      </div>

      <div style={recentSectionStyle}>
        <h2 style={recentHeadingStyle}>Recent courses</h2>
        {recentCourses.length > 0 ? (
          <ul style={recentListStyle}>
            {recentCourses.map((course) => (
              <li key={course.id}>
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
    </div>
  )
}
