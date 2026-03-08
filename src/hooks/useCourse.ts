import { useNavigate } from 'react-router-dom'
import { useCourseStore } from '@/store/course.store'
import { useUIStore } from '@/store/ui.store'

const GITHUB_URL_PATTERN = /^https?:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/

export function isValidGitHubUrl(url: string): boolean {
  return GITHUB_URL_PATTERN.test(url.replace(/\.git\/?$/, ''))
}

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

  async function loadGitHubCourse(url: string) {
    setError(null)
    setLoading(true, 'Fetching course from GitHub…')

    try {
      const sanitisedUrl = url.trim()
      const result = await window.api.course.loadFromGitHub(sanitisedUrl)

      if (result.success) {
        setCourse(result.course)
        navigate('/course')
      } else {
        setError(result.error)
      }
    } catch {
      setError('An unexpected error occurred while fetching the course.')
    } finally {
      setLoading(false)
    }
  }

  return { loadLocalCourse, loadGitHubCourse }
}
