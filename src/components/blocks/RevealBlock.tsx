import { memo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { ChevronRight } from 'lucide-react'
import type { RevealBlock as RevealBlockType } from '@/types/course.types'
import './RevealBlock.css'

const remarkPlugins = [remarkGfm]

const markdownComponents: Components = {
  code({ children, node: _node, ...props }) {
    return (
      <code className="reveal-inline-code" {...props}>
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

export default memo(function RevealBlock({ label, body }: RevealBlockType) {
  const [expanded, setExpanded] = useState(false)

  const toggle = () => setExpanded((prev) => !prev)

  return (
    <div className={`reveal ${expanded ? 'reveal--expanded' : ''}`}>
      <button
        type="button"
        className="reveal-header"
        onClick={toggle}
        aria-expanded={expanded}
      >
        <ChevronRight
          className="reveal-chevron"
          size={18}
          aria-hidden="true"
        />
        <span className="reveal-label">{label || 'Reveal'}</span>
      </button>
      {expanded && (
        <div className="reveal-body">
          <ReactMarkdown
            remarkPlugins={remarkPlugins}
            components={markdownComponents}
          >
            {body}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
})
