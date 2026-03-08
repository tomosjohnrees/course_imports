import { BrowserWindow, dialog, ipcMain } from 'electron'
import { IpcChannel } from './channels'
import { loadCourse } from '../course/loader'
import { fetchCourse, parseGitHubUrl } from '../course/github'
import type { GitHubFetchResult, GitHubRepo } from '../course/github'
import type { ParseResult } from '../course/parser'
import { getStoredGitHubToken } from '../store'

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
  return message
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
      return await loadCourse(folderPath)
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
      result = await fetchCourse(repo, token ? { token } : undefined)
    } catch (err) {
      const message = (err as Error).message || 'An unexpected error occurred'
      return { success: false, error: classifyGitHubError(message, repo) }
    }

    if (!result.success) {
      return { success: false, error: classifyGitHubError(result.error, repo) }
    }

    return result
  })
}
