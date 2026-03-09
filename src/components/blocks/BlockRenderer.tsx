import { Component, memo, type ReactNode } from 'react'
import type { Block } from '@/types/course.types'
import TextBlock from './TextBlock'
import CodeBlock from './CodeBlock'
import QuizBlock from './QuizBlock'
import CalloutBlock from './CalloutBlock'
import ImageBlock from './ImageBlock'
import ErrorBlock from './ErrorBlock'
import UnknownBlock from './UnknownBlock'

export class BlockErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return <ErrorBlock message="This block failed to render." />
    }
    return this.props.children
  }
}

interface BlockRendererProps {
  blocks: Block[]
}

function validateBlock(block: Block): string | null {
  if (!block || typeof block !== 'object' || !block.type) {
    return 'Block is missing a type field.'
  }
  switch (block.type) {
    case 'text':
      if (typeof block.content !== 'string') return 'Text block is missing content.'
      break
    case 'code':
      if (typeof block.content !== 'string') return 'Code block is missing content.'
      break
    case 'quiz':
      if (typeof block.question !== 'string') return 'Quiz block is missing a question.'
      if (!Array.isArray(block.options)) return 'Quiz block is missing options.'
      break
    case 'callout':
      if (typeof block.body !== 'string') return 'Callout block is missing body text.'
      break
    case 'image':
      if (typeof block.src !== 'string') return 'Image block is missing a src attribute.'
      break
    case 'error':
      break
    default:
      break
  }
  return null
}

const BlockComponent = memo(function BlockComponent({
  block,
  index,
}: {
  block: Block
  index: number
}) {
  const validationError = validateBlock(block)
  if (validationError) {
    return <ErrorBlock message={validationError} />
  }

  switch (block.type) {
    case 'text':
      return <TextBlock {...block} />
    case 'code':
      return <CodeBlock {...block} />
    case 'quiz':
      return <QuizBlock {...block} blockIndex={index} />
    case 'callout':
      return <CalloutBlock {...block} />
    case 'image':
      return <ImageBlock {...block} />
    case 'error':
      return <ErrorBlock message={block.message} filePath={block.filePath} />
    default:
      return <UnknownBlock type={(block as { type: string }).type} />
  }
})

export default memo(function BlockRenderer({ blocks }: BlockRendererProps) {
  if (blocks.length === 0) return null

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-8)',
        maxWidth: 'var(--reading-width)',
      }}
    >
      {blocks.map((block, index) => (
        <BlockErrorBoundary key={index}>
          <BlockComponent block={block} index={index} />
        </BlockErrorBoundary>
      ))}
    </div>
  )
})
