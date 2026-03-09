import { memo } from 'react'
import { Bookmark } from 'lucide-react'
import { useCourseStore } from '@/store/course.store'
import './BookmarkToggle.css'

interface BookmarkToggleProps {
  blockIndex: number
}

export default memo(function BookmarkToggle({ blockIndex }: BookmarkToggleProps) {
  const activeTopic = useCourseStore((s) => s.activeTopic)
  const isBookmarked = useCourseStore(
    (s) =>
      s.activeTopic !== null &&
      s.bookmarks.some(
        (b) => b.topicId === s.activeTopic && b.blockIndex === blockIndex,
      ),
  )
  const addBookmark = useCourseStore((s) => s.addBookmark)
  const removeBookmark = useCourseStore((s) => s.removeBookmark)

  if (!activeTopic) return null

  const handleClick = () => {
    if (isBookmarked) {
      removeBookmark(activeTopic, blockIndex)
    } else {
      addBookmark(activeTopic, blockIndex)
    }
  }

  return (
    <button
      className="bookmark-toggle"
      data-active={isBookmarked ? '' : undefined}
      onClick={handleClick}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
      aria-pressed={isBookmarked}
      type="button"
    >
      <Bookmark
        size={16}
        strokeWidth={1.5}
        fill={isBookmarked ? 'currentColor' : 'none'}
      />
    </button>
  )
})
