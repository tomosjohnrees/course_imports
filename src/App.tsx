import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import AppShell from '@/components/layout/AppShell'
import Home from '@/pages/Home'
import Course from '@/pages/Course'

const router = createMemoryRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/course', element: <Course /> },
    ],
  },
])

function App(): React.JSX.Element {
  return <RouterProvider router={router} />
}

export default App
