import { Check } from 'lucide-react'
import { useCourseStore } from '@/store/course.store'

export default function Sidebar() {
  const course = useCourseStore((s) => s.course)
  const activeTopic = useCourseStore((s) => s.activeTopic)
  const progress = useCourseStore((s) => s.progress)
  const setActiveTopic = useCourseStore((s) => s.setActiveTopic)

  const topics = course?.topics ?? []
  const completedCount = topics.filter(
    (t) => progress[t.id]?.complete,
  ).length
  const progressPercent =
    topics.length > 0 ? (completedCount / topics.length) * 100 : 0

  return (
    <nav
      style={{
        width: '240px',
        flexShrink: 0,
        borderRight: '1px solid var(--color-border)',
        background: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Course header */}
      <div style={{ padding: 'var(--space-4)' }}>
        <h2
          style={{
            margin: 0,
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-sans)',
            lineHeight: 'var(--leading-sm)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {course?.title ?? 'Course'}
        </h2>

        {/* Progress bar */}
        <div
          style={{
            marginTop: 'var(--space-2)',
            height: '4px',
            background: 'var(--color-border)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
          role="progressbar"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${completedCount} of ${topics.length} topics complete`}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'var(--color-accent)',
              borderRadius: '2px',
            }}
          />
        </div>

        <p
          style={{
            margin: 0,
            marginTop: 'var(--space-1)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-sans)',
          }}
        >
          {completedCount} of {topics.length} topics complete
        </p>
      </div>

      {/* Topic list */}
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          overflow: 'auto',
          flex: 1,
        }}
      >
        {topics.map((topic) => {
          const isActive = topic.id === activeTopic
          const isComplete = progress[topic.id]?.complete

          return (
            <li key={topic.id}>
              <button
                onClick={() => setActiveTopic(topic.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  width: '100%',
                  height: '36px',
                  padding: '0 var(--space-4)',
                  border: 'none',
                  borderLeft: isActive
                    ? '3px solid var(--color-accent)'
                    : '3px solid transparent',
                  background: isActive
                    ? 'var(--color-accent-subtle)'
                    : 'transparent',
                  color: isActive
                    ? 'var(--color-accent)'
                    : 'var(--color-text-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 500,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'background 100ms',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'var(--color-bg)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                <span
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {topic.title}
                </span>
                {isComplete && (
                  <Check
                    size={16}
                    strokeWidth={1.5}
                    color="var(--color-success)"
                    aria-label="Complete"
                  />
                )}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
