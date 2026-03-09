import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Bookmark, BookOpen, Check, Circle, PenLine, Settings } from 'lucide-react'
import { useCourseStore } from '@/store/course.store'
import { flushProgress } from '@/hooks/useProgressPersistence'
import { flushBookmarks } from '@/hooks/useBookmarksPersistence'
import { flushNotes } from '@/hooks/useNotesPersistence'
import { useSaveIndicator } from '@/hooks/useSaveIndicator'
import type { TopicStatus } from '@/hooks/useProgress'
import EmptyState from '@/components/EmptyState'

interface SidebarProps {
  onOpenSettings: () => void
  onOpenBookmarks: () => void
}

export default function Sidebar({ onOpenSettings, onOpenBookmarks }: SidebarProps) {
  const navigate = useNavigate()
  const course = useCourseStore((s) => s.course)
  const activeTopic = useCourseStore((s) => s.activeTopic)
  const progress = useCourseStore((s) => s.progress)
  const notes = useCourseStore((s) => s.notes)
  const setActiveTopic = useCourseStore((s) => s.setActiveTopic)
  const saveIndicatorVisible = useSaveIndicator()

  const listRef = useRef<HTMLUListElement>(null)

  const handleNavigateHome = async () => {
    flushProgress()
    await flushNotes()
    await flushBookmarks()
    navigate('/')
  }

  const handleTopicKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return
    e.preventDefault()
    const list = listRef.current
    if (!list) return
    const buttons = Array.from(list.querySelectorAll<HTMLButtonElement>('button'))
    const currentIndex = buttons.findIndex((btn) => btn === document.activeElement)
    let nextIndex: number
    if (e.key === 'ArrowDown') {
      nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0
    } else {
      nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1
    }
    buttons[nextIndex]?.focus()
  }

  const topics = course?.topics ?? []
  const completedCount = topics.filter(
    (t) => progress[t.id]?.complete,
  ).length
  const progressPercent = !course
    ? 0
    : topics.length === 0
      ? 100
      : (completedCount / topics.length) * 100

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
      {/* Home navigation */}
      <div
        style={{
          padding: 'var(--space-2) var(--space-4)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <button
          className="sidebar-topic-btn"
          onClick={handleNavigateHome}
          aria-label="Back to courses"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            width: '100%',
            height: '32px',
            padding: '0 var(--space-2)',
            border: 'none',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            textAlign: 'left',
            cursor: 'pointer',
            borderRadius: 'var(--radius-sm)',
            transition: 'background 100ms',
          }}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          Back to courses
        </button>
      </div>

      {/* Course header */}
      <div style={{ padding: 'var(--space-4)' }}>
        <h2
          title={course?.title ?? 'Course'}
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

        <p
          aria-live="polite"
          style={{
            margin: 0,
            marginTop: 'var(--space-1)',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-success)',
            fontFamily: 'var(--font-sans)',
            opacity: saveIndicatorVisible ? 1 : 0,
            transition: 'opacity 300ms ease',
            height: 'var(--text-xs)',
            lineHeight: 'var(--text-xs)',
          }}
        >
          Progress saved
        </p>
      </div>

      {/* Topic list */}
      {course && topics.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          heading="No topics"
          message="This course has no topics yet."
          headingLevel={3}
          style={{ flex: 1, padding: 'var(--space-6)' }}
        />
      ) : (
        <ul
          ref={listRef}
          aria-label="Topics"
          onKeyDown={handleTopicKeyDown}
          style={{
            listStyle: 'none',
            margin: 0,
            padding: 0,
            overflow: 'auto',
            flex: 1,
          }}
        >
          {topics.map((topic, index) => {
            const isActive = topic.id === activeTopic
            const isTabbable = isActive || (!activeTopic && index === 0)
            const entry = progress[topic.id]
            const hasNotes = Boolean(notes[topic.id]?.text)
            const status: TopicStatus = entry
              ? entry.complete
                ? 'complete'
                : 'viewed'
              : 'not-started'

            return (
              <li key={topic.id}>
                <button
                  className="sidebar-topic-btn"
                  data-active={isActive ? '' : undefined}
                  onClick={() => setActiveTopic(topic.id)}
                  tabIndex={isTabbable ? 0 : -1}
                  aria-current={isActive ? 'true' : undefined}
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
                >
                  <span
                    title={topic.title}
                    style={{
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {topic.title}
                  </span>
                  {hasNotes && (
                    <PenLine
                      size={14}
                      strokeWidth={1.5}
                      color="var(--color-text-muted)"
                      aria-label="Has notes"
                    />
                  )}
                  {status === 'complete' && (
                    <Check
                      size={16}
                      strokeWidth={1.5}
                      color="var(--color-success)"
                      aria-label="Complete"
                    />
                  )}
                  {status === 'viewed' && (
                    <Circle
                      size={16}
                      strokeWidth={1.5}
                      color="var(--color-accent)"
                      aria-label="In progress"
                    />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {/* Bottom actions */}
      <div
        style={{
          padding: 'var(--space-3) var(--space-4)',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-1)',
        }}
      >
        <button
          className="sidebar-topic-btn"
          onClick={onOpenBookmarks}
          aria-label="Open bookmarks"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            width: '100%',
            height: '36px',
            padding: '0 var(--space-2)',
            border: 'none',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            textAlign: 'left',
            cursor: 'pointer',
            borderRadius: 'var(--radius-sm)',
            transition: 'background 100ms',
          }}
        >
          <Bookmark size={16} strokeWidth={1.5} />
          Bookmarks
        </button>
        <button
          className="sidebar-topic-btn"
          onClick={onOpenSettings}
          aria-label="Open settings"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            width: '100%',
            height: '36px',
            padding: '0 var(--space-2)',
            border: 'none',
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            textAlign: 'left',
            cursor: 'pointer',
            borderRadius: 'var(--radius-sm)',
            transition: 'background 100ms',
          }}
        >
          <Settings size={16} strokeWidth={1.5} />
          Settings
        </button>
      </div>
    </nav>
  )
}
