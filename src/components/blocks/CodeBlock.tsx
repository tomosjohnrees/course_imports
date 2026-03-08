import { memo } from 'react'
import type { CodeBlock as CodeBlockType } from '@/types/course.types'

// Full implementation in issue #0022
export default memo(function CodeBlock({ language, content, label }: CodeBlockType) {
  return (
    <div>
      {label && (
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            marginBottom: 'var(--space-1)',
          }}
        >
          {label}
        </div>
      )}
      <pre
        style={{
          margin: 0,
          padding: 'var(--space-4)',
          borderRadius: '6px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          lineHeight: 'var(--leading-base)',
          color: 'var(--color-text-primary)',
          overflow: 'auto',
        }}
      >
        <code data-language={language}>{content}</code>
      </pre>
    </div>
  )
})
