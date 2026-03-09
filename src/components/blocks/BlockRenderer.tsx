import { Component, memo, type ReactNode } from 'react'
import type { Block } from '@/types/course.types'
import TextBlock from './TextBlock'
import CodeBlock from './CodeBlock'
import QuizBlock from './QuizBlock'
import CalloutBlock from './CalloutBlock'
import ImageBlock from './ImageBlock'
import UnknownBlock from './UnknownBlock'

class BlockErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            padding: 'var(--space-4)',
            borderRadius: '6px',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-muted)',
          }}
        >
          This block failed to render.
        </div>
      )
    }
    return this.props.children
  }
}

interface BlockRendererProps {
  blocks: Block[]
}

const BlockComponent = memo(function BlockComponent({
  block,
  index,
}: {
  block: Block
  index: number
}) {
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
