import { memo } from 'react'

interface UnknownBlockProps {
  type: string
}

export default memo(function UnknownBlock({ type }: UnknownBlockProps) {
  return (
    <div
      role="note"
      style={{
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-muted)',
      }}
    >
      Unsupported block type: <code style={{ fontFamily: 'var(--font-mono)' }}>{type}</code>
    </div>
  )
})
