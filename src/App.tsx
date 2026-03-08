import type { Course } from '@/types/course.types'

// Verify @/ alias resolves — this unused import will be replaced in issue #0004
void (undefined as Course | undefined)

function App(): React.JSX.Element {
  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Course Imports</h1>
      <p>Electron + React + TypeScript</p>
    </div>
  )
}

export default App
