import { memo } from 'react'
import type { ImageBlock as ImageBlockType } from '@/types/course.types'

// Full implementation in issue #0025
export default memo(function ImageBlock({ src, alt, caption }: ImageBlockType) {
  return (
    <figure style={{ margin: 0 }}>
      <img
        src={src}
        alt={alt}
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: '6px',
        }}
      />
      {caption && (
        <figcaption
          style={{
            marginTop: 'var(--space-2)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--text-sm)',
            color: 'var(--color-text-muted)',
            textAlign: 'center',
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
})
