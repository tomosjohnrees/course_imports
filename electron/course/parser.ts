import { readFile, stat } from 'fs/promises'
import { resolve, relative, isAbsolute, extname } from 'path'
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

export type ParseResult =
  | { success: true; course: Course }
  | { success: false; error: string }

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10 MB

const MIME_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
}

function deriveTopicTitle(slug: string): string {
  const withoutPrefix = slug.replace(/^\d+-/, '')
  return withoutPrefix
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function validateSrcPath(src: string, topicPath: string, courseRoot: string): string | null {
  if (isAbsolute(src)) {
    return `src path "${src}" is an absolute path`
  }
  if (src.includes('..')) {
    return `src path "${src}" contains path traversal`
  }
  const resolved = resolve(topicPath, src)
  const rel = relative(courseRoot, resolved)
  if (rel.startsWith('..') || isAbsolute(rel)) {
    return `src path "${src}" resolves outside the course folder`
  }
  return null
}

async function resolveBlock(
  rawBlock: Record<string, unknown>,
  topicPath: string,
  courseRoot: string,
  topicSlug: string,
  blockIndex: number
): Promise<Block> {
  const type = rawBlock.type as string

  switch (type) {
    case 'text': {
      if (rawBlock.src) {
        const src = rawBlock.src as string
        const error = validateSrcPath(src, topicPath, courseRoot)
        if (error) throw new Error(`topics/${topicSlug} block ${blockIndex}: ${error}`)
        const filePath = resolve(topicPath, src)
        try {
          const content = await readFile(filePath, 'utf-8')
          return { type: 'text', content } satisfies TextBlock
        } catch {
          throw new Error(
            `topics/${topicSlug} block ${blockIndex}: file "${src}" does not exist`
          )
        }
      }
      return { type: 'text', content: rawBlock.content as string } satisfies TextBlock
    }

    case 'code': {
      if (rawBlock.src) {
        const src = rawBlock.src as string
        const error = validateSrcPath(src, topicPath, courseRoot)
        if (error) throw new Error(`topics/${topicSlug} block ${blockIndex}: ${error}`)
        const filePath = resolve(topicPath, src)
        try {
          const content = await readFile(filePath, 'utf-8')
          const block: CodeBlock = {
            type: 'code',
            language: rawBlock.language as string,
            content,
          }
          if (rawBlock.label) block.label = rawBlock.label as string
          return block
        } catch {
          throw new Error(
            `topics/${topicSlug} block ${blockIndex}: file "${src}" does not exist`
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
      const error = validateSrcPath(src, topicPath, courseRoot)
      if (error) throw new Error(`topics/${topicSlug} block ${blockIndex}: ${error}`)
      const filePath = resolve(topicPath, src)

      let fileStat: Awaited<ReturnType<typeof stat>>
      try {
        fileStat = await stat(filePath)
      } catch {
        throw new Error(
          `topics/${topicSlug} block ${blockIndex}: file "${src}" does not exist`
        )
      }

      if (fileStat.size > MAX_IMAGE_SIZE) {
        throw new Error(
          `topics/${topicSlug} block ${blockIndex}: image "${src}" exceeds maximum size of 10 MB`
        )
      }

      const buffer = await readFile(filePath)
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

export async function parseCourse(folderPath: string): Promise<ParseResult> {
  const root = resolve(folderPath)

  // Read and parse course.json
  let courseData: Record<string, unknown>
  try {
    const raw = await readFile(resolve(root, 'course.json'), 'utf-8')
    courseData = JSON.parse(raw) as Record<string, unknown>
  } catch (err) {
    const message = (err as Error).message
    if (message.includes('ENOENT')) {
      return {
        success: false,
        error: 'course.json does not exist',
      }
    }
    return {
      success: false,
      error: 'course.json contains malformed JSON',
    }
  }

  const topicOrder = courseData.topicOrder as string[]
  const topics: Topic[] = []

  for (const slug of topicOrder) {
    const topicPath = resolve(root, 'topics', slug)
    const contentPath = resolve(topicPath, 'content.json')

    // Read content.json
    let contentData: unknown
    try {
      const raw = await readFile(contentPath, 'utf-8')
      contentData = JSON.parse(raw)
    } catch (err) {
      const message = (err as Error).message
      if (message.includes('ENOENT')) {
        return {
          success: false,
          error: `topics/${slug}/content.json does not exist`,
        }
      }
      return {
        success: false,
        error: `topics/${slug}/content.json contains malformed JSON`,
      }
    }

    if (!Array.isArray(contentData)) {
      return {
        success: false,
        error: `topics/${slug}/content.json is not an array`,
      }
    }

    // Resolve all blocks concurrently within this topic
    try {
      const blocks = await Promise.all(
        contentData.map((rawBlock, i) =>
          resolveBlock(rawBlock as Record<string, unknown>, topicPath, root, slug, i)
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
    source: { type: 'local', path: folderPath },
  }

  return { success: true, course }
}
