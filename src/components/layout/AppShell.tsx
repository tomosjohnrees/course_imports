import { useState, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import SettingsPanel from './SettingsPanel'
import BookmarksPanel from '@/components/BookmarksPanel'
import { useCourseStore } from '@/store/course.store'
import { useBookmarksPersistence } from '@/hooks/useBookmarksPersistence'
import { useNotesPersistence } from '@/hooks/useNotesPersistence'
import { useProgressPersistence } from '@/hooks/useProgressPersistence'

export default function AppShell() {
  const location = useLocation()
  const showSidebar = location.pathname !== '/'
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [bookmarksOpen, setBookmarksOpen] = useState(false)

  useProgressPersistence()
  useNotesPersistence()
  useBookmarksPersistence()

  const handleBookmarkNavigate = useCallback((topicId: string, blockIndex: number) => {
    const { activeTopic, setActiveTopic } = useCourseStore.getState()

    const scrollToBlock = () => {
      requestAnimationFrame(() => {
        const main = document.getElementById('main-content')
        const el = main?.querySelector(`[data-block-index="${blockIndex}"]`)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
    }

    if (activeTopic === topicId) {
      scrollToBlock()
    } else {
      setActiveTopic(topicId)
      // Wait for topic content to render before scrolling
      setTimeout(scrollToBlock, 50)
    }
  }, [])

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {showSidebar && (
        <Sidebar
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenBookmarks={() => setBookmarksOpen(true)}
        />
      )}
      <main id="main-content" tabIndex={-1} style={{ flex: 1, overflow: 'auto', outline: 'none' }}>
        <Outlet />
      </main>
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <BookmarksPanel
        open={bookmarksOpen}
        onClose={() => setBookmarksOpen(false)}
        onNavigate={handleBookmarkNavigate}
      />
    </div>
  )
}
