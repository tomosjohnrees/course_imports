import { BrowserWindow, dialog, ipcMain } from 'electron'
import { IpcChannel } from './channels'
import { loadCourse } from '../course/loader'
import { fetchCourse, parseGitHubUrl } from '../course/github'
import type { GitHubFetchResult, GitHubRepo, FetchProgress } from '../course/github'
import type { ParseResult } from '../course/parser'
import { getStoredGitHubToken, saveRecentCourse, getStoredRecentCourse } from '../store'

function classifyGitHubError(message: string, repo: GitHubRepo): string {
  if (message.includes('rate limit')) {
    return 'GitHub API rate limit exceeded. Try again later or add a personal access token in Settings.'
  }
  if (message.includes('net::') || message.includes('ENOTFOUND') || message.includes('ECONNREFUSED')) {
    return 'Network error: unable to reach GitHub. Check your internet connection and try again.'
  }
  if (/Not found.*course\.json/.test(message)) {
    return `Repository not found or missing course.json: ${repo.owner}/${repo.repo}. Check the URL and ensure the repository contains a valid course.`
  }
  // Course structure validation errors are user-friendly — pass through to help users fix their course
  if (/missing a topicOrder|is not an array|unknown block type|could not be fetched/.test(message)) {
    return message
  }
  return `Failed to load course from ${repo.owner}/${repo.repo}. Please check the repository URL and try again.`
}

function sendProgress(progress: FetchProgress) {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send(IpcChannel.course.fetchProgress, progress)
  }
}

export function registerCourseHandlers(): void {
  ipcMain.handle(IpcChannel.course.selectFolder, async () => {
    const win = BrowserWindow.getFocusedWindow()
    if (!win) return null

    const result = await dialog.showOpenDialog(win, {
      properties: ['openDirectory']
    })

    if (result.canceled || result.filePaths.length === 0) {
      return null
    }

    return result.filePaths[0]
  })

  ipcMain.handle(IpcChannel.course.loadFromFolder, async (_event, folderPath: string): Promise<ParseResult> => {
    if (!folderPath || typeof folderPath !== 'string') {
      return { success: false, error: 'A valid folder path is required' }
    }

    try {
      const result = await loadCourse(folderPath)

      if (result.success) {
        saveRecentCourse({
          id: result.course.id,
          title: result.course.title,
          sourceType: 'local',
          sourcePath: folderPath,
          lastLoaded: Date.now(),
        })
      }

      return result
    } catch {
      return { success: false, error: 'An unexpected error occurred while loading the course' }
    }
  })

  ipcMain.handle(IpcChannel.course.loadFromGitHub, async (_event, repoUrl: string): Promise<GitHubFetchResult> => {
    if (!repoUrl || typeof repoUrl !== 'string') {
      return { success: false, error: 'A valid GitHub repository URL is required' }
    }

    let repo
    try {
      repo = parseGitHubUrl(repoUrl)
    } catch {
      return { success: false, error: `Invalid GitHub URL: "${repoUrl}". Expected format: https://github.com/owner/repo` }
    }

    const token = getStoredGitHubToken()

    let result: GitHubFetchResult
    try {
      result = await fetchCourse(repo, { token: token || undefined, onProgress: sendProgress })
    } catch (err) {
      const message = (err as Error).message || 'An unexpected error occurred'
      return { success: false, error: classifyGitHubError(message, repo) }
    }

    if (!result.success) {
      return { success: false, error: classifyGitHubError(result.error, repo) }
    }

    saveRecentCourse({
      id: result.course.id,
      title: result.course.title,
      sourceType: 'github',
      sourcePath: repoUrl,
      lastLoaded: Date.now(),
    })

    return result
  })

  ipcMain.handle(IpcChannel.course.loadRecentCourse, async (_event, courseId: string): Promise<ParseResult | GitHubFetchResult> => {
    if (!courseId || typeof courseId !== 'string') {
      return { success: false, error: 'A valid course identifier is required' }
    }

    const entry = getStoredRecentCourse(courseId)
    if (!entry) {
      return { success: false, error: 'Course not found in recent courses' }
    }

    if (entry.sourceType === 'local') {
      try {
        const result = await loadCourse(entry.sourcePath)

        if (result.success) {
          saveRecentCourse({ ...entry, lastLoaded: Date.now() })
        }

        return result
      } catch {
        return { success: false, error: 'An unexpected error occurred while loading the course' }
      }
    }

    // GitHub source
    let repo
    try {
      repo = parseGitHubUrl(entry.sourcePath)
    } catch {
      return { success: false, error: 'The stored GitHub URL is no longer valid' }
    }

    const token = getStoredGitHubToken()

    let result: GitHubFetchResult
    try {
      result = await fetchCourse(repo, { token: token || undefined, onProgress: sendProgress })
    } catch (err) {
      const message = (err as Error).message || 'An unexpected error occurred'
      return { success: false, error: classifyGitHubError(message, repo) }
    }

    if (!result.success) {
      return { success: false, error: classifyGitHubError(result.error, repo) }
    }

    saveRecentCourse({ ...entry, lastLoaded: Date.now() })

    return result
  })
}
