import { memo } from 'react'
import type { TextBlock as TextBlockType } from '@/types/course.types'

// Full implementation in issue #0021
export default memo(function TextBlock({ content }: TextBlockType) {
  return (
    <div
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'var(--text-base)',
        lineHeight: 'var(--leading-base)',
        color: 'var(--color-text-primary)',
        whiteSpace: 'pre-wrap',
      }}
    >
      {content}
    </div>
  )
})
