import { memo, useState, useCallback } from 'react'
import { ImageOff } from 'lucide-react'
import type { ImageBlock as ImageBlockType } from '@/types/course.types'
import './ImageBlock.css'

function isValidImageSrc(src: string): boolean {
  return src.startsWith('data:') || src.startsWith('https://')
}

export default memo(function ImageBlock({ src, alt, caption }: ImageBlockType) {
  const [error, setError] = useState(false)

  const handleError = useCallback(() => setError(true), [])

  const altText = alt || caption || 'Course image'
  const validSrc = isValidImageSrc(src)

  if (!validSrc || error) {
    return (
      <figure className="image-block">
        <div className="image-block-fallback" role="img" aria-label={altText}>
          <ImageOff size={20} />
          <span>{altText}</span>
        </div>
        {caption && <figcaption className="image-block-caption">{caption}</figcaption>}
      </figure>
    )
  }

  return (
    <figure className="image-block">
      <img src={src} alt={altText} onError={handleError} />
      {caption && <figcaption className="image-block-caption">{caption}</figcaption>}
    </figure>
  )
})
