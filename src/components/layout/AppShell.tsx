import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useProgressPersistence } from '@/hooks/useProgressPersistence'

export default function AppShell() {
  const location = useLocation()
  const showSidebar = location.pathname !== '/'

  useProgressPersistence()

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {showSidebar && <Sidebar />}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
