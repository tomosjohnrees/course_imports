import { memo } from 'react'
import type { CalloutBlock as CalloutBlockType } from '@/types/course.types'

// Full implementation in issue #0024
export default memo(function CalloutBlock({ style, body }: CalloutBlockType) {
  return (
    <aside
      role="note"
      style={{
        padding: 'var(--space-4)',
        borderRadius: '6px',
        borderLeft: `3px solid var(--color-${style === 'warning' ? 'warning' : style === 'tip' ? 'tip' : 'accent'})`,
        background: 'var(--color-surface)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        color: 'var(--color-text-primary)',
      }}
    >
      {body}
    </aside>
  )
})
