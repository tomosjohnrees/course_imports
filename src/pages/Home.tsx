import { useState } from 'react'
import { useCourse, isValidGitHubUrl } from '@/hooks/useCourse'
import { useUIStore } from '@/store/ui.store'

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

const errorContainerStyle: React.CSSProperties = {
  marginTop: '16px',
  padding: '12px 16px',
  background: '#FEF2F2',
  border: '1px solid #FECACA',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
}

const errorTextStyle: React.CSSProperties = {
  flex: 1,
  fontSize: '14px',
  color: '#991B1B',
  margin: 0,
}

const dismissButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#991B1B',
  cursor: 'default',
  fontSize: '16px',
  padding: '0 4px',
  lineHeight: 1,
}

const validationStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#991B1B',
  margin: '6px 0 0',
}

export default function Home() {
  const { loadLocalCourse, loadGitHubCourse } = useCourse()
  const isLoading = useUIStore((s) => s.isLoading)
  const loadingMessage = useUIStore((s) => s.loadingMessage)
  const error = useUIStore((s) => s.error)
  const setError = useUIStore((s) => s.setError)
  const [githubUrl, setGithubUrl] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

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
            {loadingMessage ?? 'Loading…'}
          </p>
        )}

        {error && !isLoading && (
          <div style={errorContainerStyle} role="alert">
            <p style={errorTextStyle}>{error}</p>
            <button
              type="button"
              style={dismissButtonStyle}
              onClick={() => setError(null)}
              aria-label="Dismiss error"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
