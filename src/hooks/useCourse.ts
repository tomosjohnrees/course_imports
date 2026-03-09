import { useNavigate } from 'react-router-dom'
import { useCourseStore, pickInitialTopic } from '@/store/course.store'
import { useUIStore } from '@/store/ui.store'
import { flushBookmarks } from '@/hooks/useBookmarksPersistence'
import { flushNotes } from '@/hooks/useNotesPersistence'
import { withResolvedCourseId } from '@/lib/courseId'

const GITHUB_URL_PATTERN = /^https?:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/

export function isValidGitHubUrl(url: string): boolean {
  return GITHUB_URL_PATTERN.test(url.replace(/\.git\/?$/, ''))
}

export function useCourse() {
  const navigate = useNavigate()
  const setCourse = useCourseStore((s) => s.setCourse)
  const setActiveTopic = useCourseStore((s) => s.setActiveTopic)
  const setLoading = useUIStore((s) => s.setLoading)
  const setError = useUIStore((s) => s.setError)
  const setRetryAction = useUIStore((s) => s.setRetryAction)

  async function loadPersistedData(courseId: string) {
    const [progress, notes, bookmarks] = await Promise.all([
      window.api.store.getProgress(courseId),
      window.api.notes.getAll(courseId),
      window.api.bookmarks.getAll(courseId),
    ])
    return {
      progress: progress ?? undefined,
      notes: notes ?? undefined,
      bookmarks: bookmarks.length > 0 ? bookmarks : undefined,
    }
  }

  function selectInitialTopic() {
    const { course: loaded, progress } = useCourseStore.getState()
    if (!loaded) return
    const topicId = pickInitialTopic(loaded.topics, progress)
    if (topicId) setActiveTopic(topicId)
  }

  async function loadLocalCourse(retryPath?: string) {
    setError(null)
    setRetryAction(null)

    const folderPath = retryPath ?? await window.api.course.selectFolder()
    if (!folderPath) return

    await flushNotes()
    await flushBookmarks()
    setLoading(true, 'Loading course…')

    try {
      const result = await window.api.course.loadFromFolder(folderPath)

      if (result.success) {
        const course = withResolvedCourseId(result.course)
        const persisted = await loadPersistedData(course.id)
        setCourse(course, persisted)
        selectInitialTopic()
        navigate('/course')
      } else {
        setRetryAction({ type: 'local', folderPath })
        setError(result.error)
      }
    } catch {
      setRetryAction({ type: 'local', folderPath })
      setError('An unexpected error occurred while loading the course.')
    } finally {
      setLoading(false)
    }
  }

  async function loadGitHubCourse(url: string) {
    setError(null)
    setRetryAction(null)
    await flushNotes()
    await flushBookmarks()
    setLoading(true, 'Fetching course from GitHub…')

    const onProgress = (progress: { topicIndex: number; topicCount: number }) => {
      setLoading(true, `Loading topic ${progress.topicIndex} of ${progress.topicCount}`)
    }

    const offProgress = window.api.course.onFetchProgress(onProgress)

    try {
      const sanitisedUrl = url.trim()
      const result = await window.api.course.loadFromGitHub(sanitisedUrl)

      if (result.success) {
        const course = withResolvedCourseId(result.course)
        const persisted = await loadPersistedData(course.id)
        setCourse(course, persisted)
        selectInitialTopic()
        navigate('/course')
      } else {
        setRetryAction({ type: 'github', url: sanitisedUrl })
        setError(result.error)
      }
    } catch {
      setRetryAction({ type: 'github', url: url.trim() })
      setError('An unexpected error occurred while fetching the course.')
    } finally {
      offProgress()
      setLoading(false)
    }
  }

  async function loadRecentCourse(courseId: string) {
    setError(null)
    setRetryAction(null)
    await flushNotes()
    await flushBookmarks()
    setLoading(true, 'Loading course…')

    const onProgress = (progress: { topicIndex: number; topicCount: number }) => {
      setLoading(true, `Loading topic ${progress.topicIndex} of ${progress.topicCount}`)
    }

    const offProgress = window.api.course.onFetchProgress(onProgress)

    try {
      const result = await window.api.course.loadRecentCourse(courseId)

      if (result.success) {
        const course = withResolvedCourseId(result.course)
        const persisted = await loadPersistedData(course.id)
        setCourse(course, persisted)
        selectInitialTopic()
        navigate('/course')
      } else {
        setRetryAction({ type: 'recent', courseId })
        setError(result.error)
      }
    } catch {
      setRetryAction({ type: 'recent', courseId })
      setError('An unexpected error occurred while loading the course.')
    } finally {
      offProgress()
      setLoading(false)
    }
  }

  return { loadLocalCourse, loadGitHubCourse, loadRecentCourse }
}
