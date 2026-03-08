import { useNavigate } from 'react-router-dom'
import { useCourseStore } from '@/store/course.store'
import { useUIStore } from '@/store/ui.store'

export function useCourse() {
  const navigate = useNavigate()
  const setCourse = useCourseStore((s) => s.setCourse)
  const setLoading = useUIStore((s) => s.setLoading)
  const setError = useUIStore((s) => s.setError)

  async function loadLocalCourse() {
    setError(null)

    const folderPath = await window.api.course.selectFolder()
    if (!folderPath) return

    setLoading(true, 'Loading course…')

    try {
      const result = await window.api.course.loadFromFolder(folderPath)

      if (result.success) {
        setCourse(result.course)
        navigate('/course')
      } else {
        setError(result.error)
      }
    } catch {
      setError('An unexpected error occurred while loading the course.')
    } finally {
      setLoading(false)
    }
  }

  return { loadLocalCourse }
}
