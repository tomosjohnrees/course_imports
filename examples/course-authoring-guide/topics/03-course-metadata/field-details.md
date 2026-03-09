# Field-by-Field Breakdown

## id

The `id` is a unique, machine-readable identifier for your course. It **must** be written in kebab-case — lowercase letters, numbers, and hyphens only. No spaces, underscores, or capital letters.

Good examples: `"intro-to-python"`, `"web-dev-101"`, `"data-structures"`

Bad examples: `"Intro to Python"`, `"intro_to_python"`, `"IntroPython"`

The `id` is used internally by the app to track progress and avoid collisions between courses, so it should be unique across all courses a learner might load.

## title

The `title` is the human-readable name displayed in the app's course list and at the top of the course view. Unlike `id`, it can contain any characters — spaces, punctuation, mixed case, etc.

## description

A short summary of the course — one or two sentences. This appears below the title in the course list and helps learners decide whether to start the course.

## version

A semantic versioning string in the format `MAJOR.MINOR.PATCH` — for example, `"1.0.0"`. When you make significant content changes, bump the version so that learners (and your own records) can tell which revision they are looking at.

- `1.0.0` — initial release
- `1.1.0` — added a new topic or significant new content
- `1.0.1` — fixed a typo or small correction

## author

The name of the person or team who created the course. This is displayed in the course info section of the app.

## tags

An array of keyword strings. Tags make it easier to categorise and filter courses. Choose short, descriptive words: `["python", "beginner", "programming"]`.

## topicOrder

An ordered array of folder names that correspond to subfolders inside `topics/`. This array controls the order in which topics appear to the learner. Each entry must **exactly** match a folder name — including the numeric prefix.
