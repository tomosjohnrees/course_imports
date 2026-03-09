import { memo, useState } from 'react'
import type {
  QuizBlock as QuizBlockType,
  QuizAnswer,
} from '@/types/course.types'
import { useCourseStore } from '@/store/course.store'
import './QuizBlock.css'

type QuizBlockProps = QuizBlockType & { blockIndex: number }

export default memo(function QuizBlock(props: QuizBlockProps) {
  const { question, options, answer, explanation, blockIndex } = props
  const activeTopic = useCourseStore((s) => s.activeTopic)
  const answerKey = `${activeTopic}:${blockIndex}`
  const savedAnswer = useCourseStore((s) => s.quizAnswers[answerKey])
  const recordQuizAnswer = useCourseStore((s) => s.recordQuizAnswer)

  const [answered, setAnswered] = useState<QuizAnswer | null>(
    savedAnswer ?? null,
  )
  const isLocked = answered !== null

  const handleOptionSelect = (optionIndex: number) => {
    if (isLocked) return
    const correct = optionIndex === answer
    const result: QuizAnswer = { selectedOption: optionIndex, correct }
    setAnswered(result)
    recordQuizAnswer(answerKey, result)
  }

  return (
    <div className="quiz-block">
      <p className="quiz-block-question">{question}</p>

      <div className="quiz-block-options" role="radiogroup" aria-label="Answer options">
        {options.map((option, i) => {
          let className = 'quiz-block-option'
          if (isLocked && i === answer) {
            className += ' quiz-block-option--correct'
          }
          if (isLocked && answered && i === answered.selectedOption && !answered.correct) {
            className += ' quiz-block-option--incorrect'
          }
          const isSelected = answered?.selectedOption === i
          return (
            <button
              key={i}
              className={className}
              onClick={() => handleOptionSelect(i)}
              disabled={isLocked}
              role="radio"
              aria-checked={isSelected}
            >
              {option}
            </button>
          )
        })}
      </div>

      <div aria-live="polite">
        {isLocked && (
          <>
            <div
              className={`quiz-block-feedback ${answered.correct ? 'quiz-block-feedback--correct' : 'quiz-block-feedback--incorrect'}`}
              role="status"
            >
              {answered.correct ? 'Correct!' : 'Incorrect'}
            </div>
            {explanation && (
              <p className="quiz-block-explanation">{explanation}</p>
            )}
          </>
        )}
      </div>
    </div>
  )
})
