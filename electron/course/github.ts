import { net } from 'electron'
import { extname } from 'path'
import type {
  Course,
  Topic,
  Block,
  TextBlock,
  CodeBlock,
  ImageBlock,
  CalloutBlock,
  MultipleChoiceQuizBlock,
  FreeTextQuizBlock,
} from '../../src/types/course.types'

export type GitHubFetchResult =
  | { success: true; course: Course }
  | { success: false; error: string }

export interface GitHubRepo {
  owner: string
  repo: string
}

interface GitHubFileEntry {
  name: string
  type: 'file' | 'dir'
  path: string
}

export interface FetchProgress {
  topicIndex: number
  topicCount: number
}

interface FetchOptions {
  token?: string
  onProgress?: (progress: FetchProgress) => void
}

const GITHUB_API_BASE = 'https://api.github.com'

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

function encodeFilePath(filePath: string): string {
  return filePath.split('/').map(encodeURIComponent).join('/')
}

/**
 * Parse a GitHub repository URL into owner and repo.
 * Accepts: https://github.com/owner/repo, github.com/owner/repo,
 * with or without trailing slashes, and with optional .git suffix.
 */
export function parseGitHubUrl(url: string): GitHubRepo {
  const trimmed = url.trim().replace(/\/+$/, '').replace(/\.git$/, '')

  const match = trimmed.match(
    /^(?:https?:\/\/)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/
  )
  if (!match) {
    throw new Error(
      `Invalid GitHub URL: "${url}". Expected format: https://github.com/owner/repo`
    )
  }

  return { owner: match[1], repo: match[2] }
}

async function githubApiFetch(
  path: string,
  options?: FetchOptions
): Promise<Response> {
  const url = `${GITHUB_API_BASE}${path}`
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'course-imports-app',
  }

  if (options?.token) {
    headers['Authorization'] = `Bearer ${options.token}`
  }

  const response = await net.fetch(url, { headers })

  if (response.status === 403) {
    const body = await response.text()
    if (body.includes('rate limit')) {
      throw new Error('Too many requests — rate limit reached. Please wait and try again.')
    }
    throw new Error(`GitHub API access forbidden (403) for ${path}`)
  }

  if (response.status === 404) {
    throw new Error(`Not found on GitHub: ${path}`)
  }

  if (!response.ok) {
    throw new Error(`GitHub API error ${response.status} for ${path}`)
  }

  return response
}

/**
 * Fetch a single file from a GitHub repo and return its decoded text content.
 */
export async function fetchFile(
  repo: GitHubRepo,
  filePath: string,
  options?: FetchOptions
): Promise<string> {
  const apiPath = `/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}/contents/${encodeFilePath(filePath)}`
  const response = await githubApiFetch(apiPath, options)
  const data = (await response.json()) as { content?: string; encoding?: string }

  if (!data.content) {
    throw new Error(`No content returned for ${filePath}`)
  }

  return Buffer.from(data.content, 'base64').toString('utf-8')
}

/**
 * Fetch a file as a raw Buffer (for binary files like images).
 */
async function fetchFileBuffer(
  repo: GitHubRepo,
  filePath: string,
  options?: FetchOptions
): Promise<Buffer> {
  const apiPath = `/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}/contents/${encodeFilePath(filePath)}`
  const response = await githubApiFetch(apiPath, options)
  const data = (await response.json()) as { content?: string }

  if (!data.content) {
    throw new Error(`No content returned for ${filePath}`)
  }

  return Buffer.from(data.content, 'base64')
}

/**
 * Fetch the list of entries in a directory from a GitHub repo.
 */
export async function fetchDirectory(
  repo: GitHubRepo,
  dirPath: string,
  options?: FetchOptions
): Promise<GitHubFileEntry[]> {
  const apiPath = `/repos/${encodeURIComponent(repo.owner)}/${encodeURIComponent(repo.repo)}/contents/${encodeFilePath(dirPath)}`
  const response = await githubApiFetch(apiPath, options)
  const data = (await response.json()) as Array<{ name: string; type: string; path: string }>

  if (!Array.isArray(data)) {
    throw new Error(`Expected directory listing for ${dirPath}, got a file`)
  }

  return data.map((entry) => ({
    name: entry.name,
    type: entry.type as 'file' | 'dir',
    path: entry.path,
  }))
}

function deriveTopicTitle(slug: string): string {
  const withoutPrefix = slug.replace(/^\d+-/, '')
  return withoutPrefix
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

async function resolveBlockFromGitHub(
  rawBlock: Record<string, unknown>,
  topicPath: string,
  repo: GitHubRepo,
  topicSlug: string,
  blockIndex: number,
  options?: FetchOptions
): Promise<Block> {
  const type = rawBlock.type as string

  switch (type) {
    case 'text': {
      if (rawBlock.src) {
        const src = rawBlock.src as string
        const filePath = `${topicPath}/${src}`
        try {
          const content = await fetchFile(repo, filePath, options)
          return { type: 'text', content } satisfies TextBlock
        } catch {
          throw new Error(
            `topics/${topicSlug} block ${blockIndex}: file "${src}" could not be fetched`
          )
        }
      }
      return { type: 'text', content: rawBlock.content as string } satisfies TextBlock
    }

    case 'code': {
      if (rawBlock.src) {
        const src = rawBlock.src as string
        const filePath = `${topicPath}/${src}`
        try {
          const content = await fetchFile(repo, filePath, options)
          const block: CodeBlock = {
            type: 'code',
            language: rawBlock.language as string,
            content,
          }
          if (rawBlock.label) block.label = rawBlock.label as string
          return block
        } catch {
          throw new Error(
            `topics/${topicSlug} block ${blockIndex}: file "${src}" could not be fetched`
          )
        }
      }
      const block: CodeBlock = {
        type: 'code',
        language: rawBlock.language as string,
        content: rawBlock.content as string,
      }
      if (rawBlock.label) block.label = rawBlock.label as string
      return block
    }

    case 'image': {
      const src = rawBlock.src as string
      const filePath = `${topicPath}/${src}`
      try {
        const buffer = await fetchFileBuffer(repo, filePath, options)
        const ext = extname(src).toLowerCase()
        const mimeType = MIME_TYPES[ext] || 'application/octet-stream'
        const dataUri = `data:${mimeType};base64,${buffer.toString('base64')}`

        const block: ImageBlock = {
          type: 'image',
          src: dataUri,
          alt: rawBlock.alt as string,
        }
        if (rawBlock.caption) block.caption = rawBlock.caption as string
        return block
      } catch {
        throw new Error(
          `topics/${topicSlug} block ${blockIndex}: file "${src}" could not be fetched`
        )
      }
    }

    case 'callout': {
      return {
        type: 'callout',
        style: rawBlock.style as CalloutBlock['style'],
        body: rawBlock.body as string,
      } satisfies CalloutBlock
    }

    case 'quiz': {
      if (rawBlock.options) {
        const block: MultipleChoiceQuizBlock = {
          type: 'quiz',
          variant: 'multiple-choice',
          question: rawBlock.question as string,
          options: rawBlock.options as string[],
          answer: rawBlock.answer as number,
        }
        if (rawBlock.explanation) block.explanation = rawBlock.explanation as string
        return block
      }
      const block: FreeTextQuizBlock = {
        type: 'quiz',
        variant: 'free-text',
        question: rawBlock.question as string,
      }
      if (rawBlock.sampleAnswer) block.sampleAnswer = rawBlock.sampleAnswer as string
      if (rawBlock.explanation) block.explanation = rawBlock.explanation as string
      return block
    }

    default:
      throw new Error(
        `topics/${topicSlug} block ${blockIndex}: unknown block type "${type}"`
      )
  }
}

/**
 * Fetch an entire course from a GitHub repository.
 * Fetches course.json, discovers topics, fetches each topic's content.json,
 * and fetches all src-referenced files with parallel fetching within each topic.
 */
export async function fetchCourse(
  repo: GitHubRepo,
  options?: FetchOptions
): Promise<GitHubFetchResult> {
  // Fetch and parse course.json
  let courseData: Record<string, unknown>
  try {
    const raw = await fetchFile(repo, 'course.json', options)
    courseData = JSON.parse(raw) as Record<string, unknown>
  } catch (err) {
    return {
      success: false,
      error: `Failed to fetch course.json: ${(err as Error).message}`,
    }
  }

  const topicOrder = courseData.topicOrder as string[]
  if (!Array.isArray(topicOrder)) {
    return {
      success: false,
      error: 'course.json is missing a topicOrder array',
    }
  }

  const topics: Topic[] = []
  const topicCount = topicOrder.length

  for (let i = 0; i < topicOrder.length; i++) {
    const slug = topicOrder[i]
    const topicPath = `topics/${slug}`
    const contentPath = `${topicPath}/content.json`

    options?.onProgress?.({ topicIndex: i + 1, topicCount })

    // Fetch content.json for this topic
    let contentData: unknown
    try {
      const raw = await fetchFile(repo, contentPath, options)
      contentData = JSON.parse(raw)
    } catch (err) {
      return {
        success: false,
        error: `Failed to fetch ${contentPath}: ${(err as Error).message}`,
      }
    }

    if (!Array.isArray(contentData)) {
      return {
        success: false,
        error: `${contentPath} is not an array`,
      }
    }

    // Resolve all blocks concurrently within this topic
    try {
      const blocks = await Promise.all(
        contentData.map((rawBlock, i) =>
          resolveBlockFromGitHub(
            rawBlock as Record<string, unknown>,
            topicPath,
            repo,
            slug,
            i,
            options
          )
        )
      )
      topics.push({
        id: slug,
        title: deriveTopicTitle(slug),
        blocks,
      })
    } catch (err) {
      return {
        success: false,
        error: (err as Error).message,
      }
    }
  }

  const course: Course = {
    id: courseData.id as string,
    title: courseData.title as string,
    description: courseData.description as string,
    version: courseData.version as string,
    author: courseData.author as string,
    tags: courseData.tags as string[],
    topics,
    source: { type: 'github', path: `https://github.com/${repo.owner}/${repo.repo}` },
  }

  return { success: true, course }
}
