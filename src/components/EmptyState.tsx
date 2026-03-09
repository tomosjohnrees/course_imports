import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  heading: string
  message: string
  style?: React.CSSProperties
  headingLevel?: 2 | 3
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 'var(--space-10) var(--space-8)',
  gap: 'var(--space-3)',
  color: 'var(--color-text-muted)',
  fontFamily: 'var(--font-sans)',
  textAlign: 'center',
}

const headingStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 'var(--text-base)',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
}

const messageStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 'var(--text-sm)',
  lineHeight: 'var(--leading-sm)',
}

export default function EmptyState({ icon: Icon, heading, message, style, headingLevel = 2 }: EmptyStateProps) {
  const Heading = `h${headingLevel}` as const
  return (
    <div style={{ ...containerStyle, ...style }}>
      <Icon size={32} strokeWidth={1.5} aria-hidden="true" />
      <Heading style={headingStyle}>{heading}</Heading>
      <p style={messageStyle}>{message}</p>
    </div>
  )
}
