import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import SettingsPanel from './SettingsPanel'
import { useProgressPersistence } from '@/hooks/useProgressPersistence'

export default function AppShell() {
  const location = useLocation()
  const showSidebar = location.pathname !== '/'
  const [settingsOpen, setSettingsOpen] = useState(false)

  useProgressPersistence()

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {showSidebar && (
        <Sidebar onOpenSettings={() => setSettingsOpen(true)} />
      )}
      <main id="main-content" tabIndex={-1} style={{ flex: 1, overflow: 'auto', outline: 'none' }}>
        <Outlet />
      </main>
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  )
}
