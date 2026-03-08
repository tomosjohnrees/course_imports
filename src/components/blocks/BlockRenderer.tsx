import { memo } from 'react'
import type { Block } from '@/types/course.types'
import TextBlock from './TextBlock'
import CodeBlock from './CodeBlock'
import QuizBlock from './QuizBlock'
import CalloutBlock from './CalloutBlock'
import ImageBlock from './ImageBlock'
import UnknownBlock from './UnknownBlock'

interface BlockRendererProps {
  blocks: Block[]
}

const BlockComponent = memo(function BlockComponent({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':
      return <TextBlock {...block} />
    case 'code':
      return <CodeBlock {...block} />
    case 'quiz':
      return <QuizBlock {...block} />
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
        <BlockComponent key={index} block={block} />
      ))}
    </div>
  )
})
