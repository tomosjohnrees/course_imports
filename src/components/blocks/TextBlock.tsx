import { memo, useMemo, createElement, type HTMLAttributes, type ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components, ExtraProps } from 'react-markdown'
import type { TextBlock as TextBlockType } from '@/types/course.types'
import CodeBlock from './CodeBlock'
import './TextBlock.css'

const remarkPlugins = [remarkGfm]

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

/**
 * Build a mapping from source heading levels to sequential levels (no gaps).
 * e.g. if content uses h1, h3, h5 → maps to h1, h2, h3.
 */
function buildHeadingLevelMap(markdown: string): Record<number, number> {
  const usedLevels = new Set<number>()
  for (const match of markdown.matchAll(/^(#{1,6})\s/gm)) {
    usedLevels.add(match[1].length)
  }
  const sorted = [...usedLevels].sort((a, b) => a - b)
  const map: Record<number, number> = {}
  sorted.forEach((level, i) => {
    map[level] = i + 1
  })
  return map
}

function buildComponents(headingMap: Record<number, number>): Components {
  const headingComponent = (sourceLevel: number) => {
    const Component = ({ children, node: _node, ...props }: HTMLAttributes<HTMLHeadingElement> & ExtraProps) => {
      const tag: HeadingTag = `h${headingMap[sourceLevel] ?? sourceLevel}` as HeadingTag
      return createElement(tag, props, children as ReactNode)
    }
    return Component
  }

  return {
    pre: ({ children }) => <>{children}</>,

    h1: headingComponent(1),
    h2: headingComponent(2),
    h3: headingComponent(3),
    h4: headingComponent(4),
    h5: headingComponent(5),
    h6: headingComponent(6),

    code({ className, children, node: _node, ...props }) {
      const match = /language-(\w+)/.exec(className || '')
      if (match) {
        return (
          <CodeBlock
            type="code"
            language={match[1]}
            content={String(children).replace(/\n$/, '')}
          />
        )
      }
      return (
        <code className="inline-code" {...props}>
          {children}
        </code>
      )
    },

    a({ href, children, node: _node, ...props }) {
      return (
        <a {...props} href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    },
  }
}

export default memo(function TextBlock({ content }: TextBlockType) {
  const components = useMemo(() => buildComponents(buildHeadingLevelMap(content)), [content])

  return (
    <div className="text-block">
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
})
