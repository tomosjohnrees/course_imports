import { useCourseStore } from '@/store/course.store'
import BlockRenderer from '@/components/blocks/BlockRenderer'

export default function Course() {
  const course = useCourseStore((s) => s.course)
  const activeTopic = useCourseStore((s) => s.activeTopic)

  const topic = course?.topics.find((t) => t.id === activeTopic)

  if (!topic) return null

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
