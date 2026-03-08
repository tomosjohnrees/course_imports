import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import type { TextBlock as TextBlockType } from '@/types/course.types'
import CodeBlock from './CodeBlock'
import './TextBlock.css'

const remarkPlugins = [remarkGfm]

const components: Components = {
  // Strip <pre> wrapper — CodeBlock provides its own
  pre: ({ children }) => <>{children}</>,

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
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    )
  },
}

export default memo(function TextBlock({ content }: TextBlockType) {
  return (
    <div className="text-block">
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
})
