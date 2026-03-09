import { memo } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { ErrorBlock as ErrorBlockType } from '@/types/course.types'

type ErrorBlockProps = Omit<ErrorBlockType, 'type'>

export default memo(function ErrorBlock({ message, filePath }: ErrorBlockProps) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--space-3)',
        padding: 'var(--space-4)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--color-warning)',
        background: 'var(--color-warning-subtle)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-warning)',
      }}
    >
      <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div>
        <span>{message}</span>
        {filePath && (
          <>
            {': '}
            <code style={{ fontFamily: 'var(--font-mono)' }}>{filePath}</code>
          </>
        )}
      </div>
    </div>
  )
})
