import { useEffect, useMemo } from 'react'
import { X, Bookmark as BookmarkIcon } from 'lucide-react'
import { useCourseStore } from '@/store/course.store'
import EmptyState from '@/components/EmptyState'
import type { Block, BlockBookmark } from '@/types/course.types'
import './BookmarksPanel.css'

interface BookmarksPanelProps {
  open: boolean
  onClose: () => void
  onNavigate: (topicId: string, blockIndex: number) => void
}

function getBlockPreview(block: Block): string {
  switch (block.type) {
    case 'text':
      return block.content.split('\n')[0].replace(/^#+\s*/, '')
    case 'code':
      return block.label ?? block.language
    case 'quiz':
      return block.question
    case 'callout':
      return block.body.split('\n')[0]
    case 'reveal':
      return block.label ?? block.body.split('\n')[0]
    case 'image':
      return block.caption ?? block.alt
    case 'checkpoint':
      return block.label ?? 'Checkpoint'
    case 'error':
      return block.message
    default:
      return 'Block'
  }
}

interface GroupedBookmarks {
  topicId: string
  topicTitle: string
  entries: { bookmark: BlockBookmark; preview: string }[]
}

export default function BookmarksPanel({ open, onClose, onNavigate }: BookmarksPanelProps) {
  const course = useCourseStore((s) => s.course)
  const bookmarks = useCourseStore((s) => s.bookmarks)

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const grouped = useMemo((): GroupedBookmarks[] => {
    if (!course) return []

    const topicMap = new Map<string, GroupedBookmarks>()

    for (const bookmark of bookmarks) {
      const topic = course.topics.find((t) => t.id === bookmark.topicId)
      if (!topic) continue

      let group = topicMap.get(bookmark.topicId)
      if (!group) {
        group = { topicId: bookmark.topicId, topicTitle: topic.title, entries: [] }
        topicMap.set(bookmark.topicId, group)
      }

      const block = topic.blocks[bookmark.blockIndex]
      const preview = block ? getBlockPreview(block) : 'Block'
      group.entries.push({ bookmark, preview })
    }

    // Maintain topic order from course
    const result: GroupedBookmarks[] = []
    for (const topic of course.topics) {
      const group = topicMap.get(topic.id)
      if (group) result.push(group)
    }
    return result
  }, [course, bookmarks])

  if (!open) return null

  const handleEntryClick = (topicId: string, blockIndex: number) => {
    onNavigate(topicId, blockIndex)
    onClose()
  }

  return (
    <>
      <div className="bookmarks-backdrop" onClick={onClose} />
      <div className="bookmarks-panel" role="dialog" aria-label="Bookmarks">
        <div className="bookmarks-header">
          <h2 className="bookmarks-title">Bookmarks</h2>
          <button
            className="bookmarks-close-btn"
            onClick={onClose}
            aria-label="Close bookmarks"
          >
            <X size={16} strokeWidth={1.5} />
          </button>
        </div>

        <div className="bookmarks-body">
          {grouped.length === 0 ? (
            <EmptyState
              icon={BookmarkIcon}
              heading="No bookmarks"
              message="Click the bookmark icon on any block to save it here."
              headingLevel={3}
            />
          ) : (
            grouped.map((group) => (
              <div key={group.topicId} className="bookmarks-topic-group">
                <h3 className="bookmarks-topic-name">{group.topicTitle}</h3>
                {group.entries.map((entry) => (
                  <button
                    key={`${entry.bookmark.topicId}:${entry.bookmark.blockIndex}`}
                    className="bookmarks-entry"
                    onClick={() =>
                      handleEntryClick(
                        entry.bookmark.topicId,
                        entry.bookmark.blockIndex,
                      )
                    }
                  >
                    <BookmarkIcon
                      className="bookmarks-entry-icon"
                      size={14}
                      strokeWidth={1.5}
                      fill="currentColor"
                    />
                    <span className="bookmarks-entry-text">
                      {entry.preview}
                    </span>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}
