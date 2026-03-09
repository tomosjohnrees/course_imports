import { memo, useState } from 'react'
import type { CheckpointBlock as CheckpointBlockType } from '@/types/course.types'
import { useCourseStore } from '@/store/course.store'
import './CheckpointBlock.css'

type CheckpointBlockProps = CheckpointBlockType & { blockIndex: number }

export default memo(function CheckpointBlock(props: CheckpointBlockProps) {
  const { label, blockIndex } = props
  const activeTopic = useCourseStore((s) => s.activeTopic)
  const checkpointKey = `${activeTopic}:${blockIndex}`
  const savedCompletion = useCourseStore(
    (s) => s.checkpointCompletions[checkpointKey],
  )
  const recordCheckpointCompletion = useCourseStore(
    (s) => s.recordCheckpointCompletion,
  )

  const [completed, setCompleted] = useState(savedCompletion ?? false)

  const handleComplete = () => {
    if (completed) return
    setCompleted(true)
    recordCheckpointCompletion(checkpointKey)
  }

  const buttonText = label || 'Mark as complete'

  return (
    <div
      className={`checkpoint-block ${completed ? 'checkpoint-block--completed' : ''}`}
    >
      <button
        className="checkpoint-block-button"
        onClick={handleComplete}
        disabled={completed}
        aria-pressed={completed}
      >
        {completed && (
          <svg
            className="checkpoint-block-icon"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
        {buttonText}
      </button>
    </div>
  )
})
