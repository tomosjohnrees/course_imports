import { AlertTriangle } from 'lucide-react'

interface ErrorStateProps {
  message: string
  onRetry?: () => void
  onDismiss?: () => void
}

const containerStyle: React.CSSProperties = {
  marginTop: '16px',
  padding: '16px',
  background: 'var(--color-warning-subtle)',
  border: '1px solid var(--color-warning)',
  borderRadius: 'var(--radius-sm)',
  fontFamily: 'var(--font-sans)',
}

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}

const headingStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 'var(--text-sm)',
  fontWeight: 600,
  color: 'var(--color-text-primary)',
}

const messageStyle: React.CSSProperties = {
  margin: '8px 0 0',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-secondary)',
  lineHeight: 'var(--leading-sm)',
}

const actionsStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginTop: '12px',
}

const retryButtonStyle: React.CSSProperties = {
  background: 'none',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  padding: '4px 12px',
  fontSize: 'var(--text-sm)',
  fontWeight: 500,
  color: 'var(--color-text-primary)',
  cursor: 'default',
  fontFamily: 'var(--font-sans)',
}

const dismissButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  padding: '4px 8px',
  fontSize: 'var(--text-sm)',
  color: 'var(--color-text-muted)',
  cursor: 'default',
  fontFamily: 'var(--font-sans)',
}

export function sanitiseErrorMessage(message: string): string {
  let sanitised = message
  // Strip file system paths (Unix and Windows)
  sanitised = sanitised.replace(/(?:\/[\w.-]+){2,}/g, '[path]')
  sanitised = sanitised.replace(/[A-Z]:\\(?:[\w.-]+\\){1,}/g, '[path]')
  // Strip anything that looks like an API key or token (long hex/base64 strings)
  sanitised = sanitised.replace(/\b[A-Za-z0-9_-]{32,}\b/g, '[redacted]')
  // Strip stack traces (lines starting with "at ")
  sanitised = sanitised.replace(/\s+at\s+.+/g, '')
  return sanitised
}

export default function ErrorState({ message, onRetry, onDismiss }: ErrorStateProps) {
  const safeMessage = sanitiseErrorMessage(message)

  return (
    <div style={containerStyle} role="alert">
      <div style={headerStyle}>
        <AlertTriangle size={16} strokeWidth={1.5} color="var(--color-warning)" aria-hidden="true" />
        <h3 style={headingStyle}>Couldn't load course</h3>
      </div>
      <p style={messageStyle}>{safeMessage}</p>
      {(onRetry || onDismiss) && (
        <div style={actionsStyle}>
          {onRetry && (
            <button type="button" style={retryButtonStyle} onClick={onRetry}>
              Try again
            </button>
          )}
          {onDismiss && (
            <button type="button" style={dismissButtonStyle} onClick={onDismiss} aria-label="Dismiss error">
              Dismiss
            </button>
          )}
        </div>
      )}
    </div>
  )
}
