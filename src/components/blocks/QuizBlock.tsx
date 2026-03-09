import { memo, useState } from 'react'
import type {
  QuizBlock as QuizBlockType,
  QuizAnswer,
} from '@/types/course.types'
import { useCourseStore } from '@/store/course.store'
import './QuizBlock.css'

type QuizBlockProps = QuizBlockType & { blockIndex: number }

export default memo(function QuizBlock(props: QuizBlockProps) {
  const { question, blockIndex } = props
  const activeTopic = useCourseStore((s) => s.activeTopic)
  const answerKey = `${activeTopic}:${blockIndex}`
  const savedAnswer = useCourseStore((s) => s.quizAnswers[answerKey])
  const recordQuizAnswer = useCourseStore((s) => s.recordQuizAnswer)

  const [answered, setAnswered] = useState<QuizAnswer | null>(
    savedAnswer ?? null,
  )
  const [textInput, setTextInput] = useState('')
  const isLocked = answered !== null

  const handleOptionSelect = (optionIndex: number) => {
    if (isLocked || props.variant !== 'multiple-choice') return
    const correct = optionIndex === props.answer
    const result: QuizAnswer = { selectedOption: optionIndex, correct }
    setAnswered(result)
    recordQuizAnswer(answerKey, result)
  }

  const handleFreeTextSubmit = () => {
    if (isLocked || props.variant !== 'free-text') return
    const trimmed = textInput.trim()
    if (!trimmed) return
    const correct = props.sampleAnswer
      ? trimmed.toLowerCase() === props.sampleAnswer.trim().toLowerCase()
      : true
    const result: QuizAnswer = { textAnswer: trimmed, correct }
    setAnswered(result)
    recordQuizAnswer(answerKey, result)
  }

  const { explanation } = props

  return (
    <div className="quiz-block">
      <p className="quiz-block-question">{question}</p>

      {props.variant === 'multiple-choice' ? (
        <MultipleChoiceOptions
          options={props.options}
          correctIndex={props.answer}
          answered={answered}
          isLocked={isLocked}
          onSelect={handleOptionSelect}
        />
      ) : (
        <FreeTextInput
          answered={answered}
          isLocked={isLocked}
          textInput={textInput}
          onTextChange={setTextInput}
          onSubmit={handleFreeTextSubmit}
        />
      )}

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
  )
})

function MultipleChoiceOptions({
  options,
  correctIndex,
  answered,
  isLocked,
  onSelect,
}: {
  options: string[]
  correctIndex: number
  answered: QuizAnswer | null
  isLocked: boolean
  onSelect: (index: number) => void
}) {
  return (
    <div className="quiz-block-options" role="group" aria-label="Answer options">
      {options.map((option, i) => {
        let className = 'quiz-block-option'
        if (isLocked && i === correctIndex) {
          className += ' quiz-block-option--correct'
        }
        if (isLocked && answered && i === answered.selectedOption && !answered.correct) {
          className += ' quiz-block-option--incorrect'
        }
        return (
          <button
            key={i}
            className={className}
            onClick={() => onSelect(i)}
            disabled={isLocked}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}

function FreeTextInput({
  answered,
  isLocked,
  textInput,
  onTextChange,
  onSubmit,
}: {
  answered: QuizAnswer | null
  isLocked: boolean
  textInput: string
  onTextChange: (value: string) => void
  onSubmit: () => void
}) {
  return (
    <div className="quiz-block-freetext">
      <textarea
        className="quiz-block-textarea"
        value={isLocked && answered ? (answered.textAnswer ?? '') : textInput}
        onChange={(e) => onTextChange(e.target.value)}
        disabled={isLocked}
        placeholder="Type your answer…"
        rows={3}
      />
      {!isLocked && (
        <button
          className="quiz-block-submit"
          onClick={onSubmit}
          disabled={!textInput.trim()}
        >
          Submit
        </button>
      )}
    </div>
  )
}
