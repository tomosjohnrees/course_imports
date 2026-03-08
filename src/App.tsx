import { lazy, Suspense } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'

const Home = lazy(() => import('@/pages/Home'))
const Course = lazy(() => import('@/pages/Course'))
const NotFound = lazy(() => import('@/pages/NotFound'))

const router = createMemoryRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/course', element: <Course /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

function App(): React.JSX.Element {
  return (
    <Suspense>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
