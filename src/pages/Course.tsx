import { useEffect } from 'react'
import { BookOpen, FileText } from 'lucide-react'
import { useCourseStore } from '@/store/course.store'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import NotesPanel from '@/components/NotesPanel'
import EmptyState from '@/components/EmptyState'

export default function Course() {
  const course = useCourseStore((s) => s.course)
  const activeTopic = useCourseStore((s) => s.activeTopic)

  useEffect(() => {
    if (!activeTopic) return
    const main = document.getElementById('main-content')
    main?.focus()
    main?.scrollTo(0, 0)
  }, [activeTopic])

  const topic = course?.topics.find((t) => t.id === activeTopic)

  if (course && course.topics.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        heading="No topics available"
        message="This course does not contain any topics."
        style={{ height: '100%' }}
      />
    )
  }

  if (!topic) return null

  if (topic.blocks.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        heading="No content"
        message="This topic does not have any content yet."
        style={{ height: '100%' }}
      />
    )
  }

  return (
    <div
      style={{
        padding: 'var(--space-10) var(--space-8)',
      }}
    >
      <BlockRenderer blocks={topic.blocks} />
      <NotesPanel />
    </div>
  )
}
