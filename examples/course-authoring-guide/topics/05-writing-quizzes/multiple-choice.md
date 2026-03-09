# Quizzes

A quiz presents a question with a list of options. The learner selects one option, and the app tells them whether they chose correctly.

To create one, set `"type"` to `"quiz"` and provide the following fields:

- **`question`** (required) — the question text shown to the learner.
- **`options`** (required) — an array of strings, each representing one answer choice.
- **`answer`** (required) — the zero-based index of the correct option. If the correct answer is the first option, `answer` is `0`. If it is the second, `answer` is `1`, and so on.
- **`explanation`** (optional) — text shown after the learner submits their answer, regardless of whether they got it right. Use this to reinforce the concept or explain why the correct answer is correct.
