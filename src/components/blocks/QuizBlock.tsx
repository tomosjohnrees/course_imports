import { memo } from 'react'
import type { QuizBlock as QuizBlockType } from '@/types/course.types'

// Full implementation in issue #0023
export default memo(function QuizBlock({ question }: QuizBlockType) {
  return (
    <div
      style={{
        padding: 'var(--space-4)',
        borderRadius: '6px',
        border: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        color: 'var(--color-text-primary)',
      }}
    >
      <strong>Quiz:</strong> {question}
    </div>
  )
})
