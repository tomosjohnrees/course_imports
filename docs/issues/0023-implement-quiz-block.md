# [0023] Implement quiz block with answer feedback

## Summary

Quiz blocks are how courses test understanding. They support multiple-choice and free-text question formats. This issue builds the `QuizBlock` component with answer submission, correct/incorrect feedback, explanation display, and answer locking — so once a question is answered, the result is recorded and the block cannot be re-answered.

## Context

- **Phase:** Milestone 4 — Quiz Block
- **Depends on:** #0020 (block renderer), #0013 (Zustand stores)
- **Blocks:** None

## What needs to happen

1. A multiple-choice UI with full-width option rows per the design guide
2. A free-text UI with a textarea and submit button
3. Answer submission that shows correct/incorrect colour feedback
4. Explanation text displayed below options after answering
5. Answer locking — once answered, the block is locked and cannot be re-answered
6. If the block was already answered (from persisted progress), it renders in its answered/locked state on mount

## Acceptance criteria

### Functionality
- [x] Multiple-choice questions display options as full-width clickable rows
- [x] Free-text questions display a textarea and a submit button
- [x] Selecting an answer (multiple-choice) or submitting text (free-text) triggers answer evaluation
- [x] Correct answers show green/success colour feedback on the selected option
- [x] Incorrect answers show red/error colour feedback on the selected option and highlight the correct answer
- [x] The `explanation` text is displayed below the options after the user answers
- [x] After answering, the block is locked — options are disabled and cannot be changed
- [x] The answer is recorded in the course store for progress tracking
- [x] If the block was already answered (loaded from persisted progress), it renders in its answered/locked state immediately on mount
- [x] Free-text answers are evaluated by exact match against the expected answer (case-insensitive)

### Security
- [x] Quiz answers and explanations are not visible in the DOM before the user answers (no hidden elements with correct answer data that could be inspected)
- [x] User input in free-text answers is sanitised before any rendering or comparison

### Performance
- [x] Quiz blocks render efficiently — no unnecessary re-renders when other blocks in the topic update
- [x] Answer evaluation happens instantly (client-side, no async delay)

### Testing
- [x] Component tests verify multiple-choice options render correctly
- [x] Component tests verify free-text textarea and submit button render correctly
- [x] Component tests verify correct/incorrect feedback is shown after answering
- [x] Component tests verify explanation text appears after answering
- [x] Component tests verify the block locks after answering
- [x] Component tests verify pre-answered blocks render in locked state on mount

## Notes

The security criterion about hiding correct answers is aspirational — since this is a local Electron app, a determined user can always inspect the data. The goal is not to make answers visible in a casual DOM inspection. Avoid rendering the correct answer index or explanation text in hidden DOM elements before the user answers.
