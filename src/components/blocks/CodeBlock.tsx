import { memo, useState, useEffect, useCallback, useRef } from 'react'
import { Copy, Check } from 'lucide-react'
import type { CodeBlock as CodeBlockType } from '@/types/course.types'
import { getHighlighter, highlightCode } from './highlighter'
import './CodeBlock.css'

export default memo(function CodeBlock({ language, content, label }: CodeBlockType) {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false
    getHighlighter()
      .then((highlighter) => {
        if (!cancelled) {
          setHighlightedHtml(highlightCode(highlighter, content, language))
        }
      })
      .catch(() => {
        // Highlighting unavailable — fallback renders plain text
      })
    return () => {
      cancelled = true
    }
  }, [content, language])

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    }
  }, [])

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current)
    copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000)
  }, [content])

  return (
    <div className="code-block">
      <div className="code-block-header">
        {label && <span className="code-block-label">{label}</span>}
        <button
          className="code-block-copy"
          onClick={handleCopy}
          aria-label={copied ? 'Copied' : 'Copy code'}
        >
          {copied ? (
            <Check size={16} strokeWidth={1.5} />
          ) : (
            <Copy size={16} strokeWidth={1.5} />
          )}
        </button>
      </div>
      {highlightedHtml ? (
        <div
          className="code-block-content"
          // shiki escapes all code content — only generates <pre>, <code>, and <span> elements
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre className="code-block-fallback">
          <code data-language={language}>{content}</code>
        </pre>
      )}
    </div>
  )
})
