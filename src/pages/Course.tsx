import { BookOpen, FileText } from 'lucide-react'
import { useCourseStore } from '@/store/course.store'
import BlockRenderer from '@/components/blocks/BlockRenderer'

const emptyStateContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: 'var(--space-10) var(--space-8)',
  gap: 'var(--space-3)',
  color: 'var(--color-text-muted)',
  fontFamily: 'var(--font-sans)',
  textAlign: 'center',
}

const emptyStateHeadingStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 'var(--text-base)',
  fontWeight: 600,
  color: 'var(--color-text-secondary)',
}

const emptyStateMessageStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 'var(--text-sm)',
  lineHeight: 'var(--leading-sm)',
}

export default function Course() {
  const course = useCourseStore((s) => s.course)
  const activeTopic = useCourseStore((s) => s.activeTopic)

  const topic = course?.topics.find((t) => t.id === activeTopic)

  if (course && course.topics.length === 0) {
    return (
      <div style={emptyStateContainerStyle}>
        <BookOpen size={32} strokeWidth={1.5} />
        <h2 style={emptyStateHeadingStyle}>No topics available</h2>
        <p style={emptyStateMessageStyle}>
          This course does not contain any topics.
        </p>
      </div>
    )
  }

  if (!topic) return null

  if (topic.blocks.length === 0) {
    return (
      <div style={emptyStateContainerStyle}>
        <FileText size={32} strokeWidth={1.5} />
        <h2 style={emptyStateHeadingStyle}>No content</h2>
        <p style={emptyStateMessageStyle}>
          This topic does not have any content yet.
        </p>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: 'var(--space-10) var(--space-8)',
      }}
    >
      <BlockRenderer blocks={topic.blocks} />
    </div>
  )
}
