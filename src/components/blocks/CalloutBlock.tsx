import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { Info, AlertTriangle, Lightbulb } from 'lucide-react'
import type { CalloutBlock as CalloutBlockType } from '@/types/course.types'
import './CalloutBlock.css'

const remarkPlugins = [remarkGfm]

const inlineComponents: Components = {
  // Render paragraphs as spans to keep content inline within the callout
  p: ({ children }) => <span>{children}</span>,

  code({ children, node: _node, ...props }) {
    return (
      <code className="callout-inline-code" {...props}>
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

const variantConfig = {
  info: { icon: Info, className: 'callout--info' },
  warning: { icon: AlertTriangle, className: 'callout--warning' },
  tip: { icon: Lightbulb, className: 'callout--tip' },
} as const

export default memo(function CalloutBlock({ style, body }: CalloutBlockType) {
  const config = variantConfig[style] ?? variantConfig.info
  const Icon = config.icon

  return (
    <aside role="note" className={`callout ${config.className}`}>
      <Icon className="callout-icon" size={20} aria-hidden="true" />
      <div className="callout-body">
        <ReactMarkdown
          remarkPlugins={remarkPlugins}
          components={inlineComponents}
        >
          {body}
        </ReactMarkdown>
      </div>
    </aside>
  )
})
