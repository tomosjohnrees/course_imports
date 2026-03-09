# Course Authoring Guide

This document describes the file structure, metadata, and content format required to create a course compatible with Course Imports.

---

## Folder Structure

A course is a single folder containing a `course.json` metadata file and a `topics/` directory. Each topic is a numbered subfolder with its own `content.json` and any referenced files (markdown, code, images).

```
my-course/
├── course.json
└── topics/
    ├── 01-introduction/
    │   ├── content.json
    │   ├── intro.md
    │   └── hello.py
    ├── 02-variables-and-types/
    │   ├── content.json
    │   ├── overview.md
    │   ├── example.py
    │   └── diagram.png
    └── 03-functions/
        ├── content.json
        └── explanation.md
```

---

## course.json

The root metadata file. All fields are required unless noted.

```json
{
  "id": "intro-to-python",
  "title": "Introduction to Python",
  "description": "A beginner-friendly course covering Python fundamentals.",
  "version": "1.0.0",
  "author": "Jane Smith",
  "tags": ["programming", "python", "beginner"],
  "topicOrder": [
    "01-introduction",
    "02-variables-and-types",
    "03-functions"
  ]
}
```

| Field        | Type       | Description                                                        |
| ------------ | ---------- | ------------------------------------------------------------------ |
| `id`         | `string`   | Unique identifier for the course (use kebab-case).                 |
| `title`      | `string`   | Display title.                                                     |
| `description`| `string`   | Short summary of the course.                                       |
| `version`    | `string`   | Semver version string.                                             |
| `author`     | `string`   | Course author name.                                                |
| `tags`       | `string[]` | Keywords for categorisation.                                       |
| `topicOrder` | `string[]` | Ordered list of topic folder names. Must match folders in `topics/`. |

---

## Topics

Each entry in `topicOrder` must correspond to a subfolder inside `topics/`.

**Naming convention:** prefix with a number for ordering, e.g. `01-introduction`. The display title is derived automatically by stripping the numeric prefix and title-casing the remainder (`01-introduction` becomes "Introduction").

Each topic folder must contain a `content.json` file.

---

## content.json

An ordered JSON array of **blocks**. Blocks are rendered top-to-bottom in the order they appear.

```json
[
  { "type": "text", "src": "intro.md" },
  { "type": "code", "language": "python", "src": "hello.py", "label": "hello.py" },
  { "type": "callout", "style": "info", "body": "Python is case-sensitive." },
  { "type": "quiz", "variant": "multiple-choice", "question": "What does print() do?", "options": ["Saves a file", "Outputs text", "Creates a variable"], "answer": 1 },
  { "type": "image", "src": "diagram.png", "alt": "Memory model diagram" }
]
```

---

## Block Types

### Text

Renders markdown content. Reference an external `.md` file with `src`, or provide content inline.

```json
{ "type": "text", "src": "intro.md" }
```

```json
{ "type": "text", "content": "Welcome to the course. This is **markdown**." }
```

| Field     | Type     | Required | Description                                  |
| --------- | -------- | -------- | -------------------------------------------- |
| `type`    | `"text"` | Yes      | Must be `"text"`.                            |
| `src`     | `string` | No       | Path to a `.md` file relative to the topic folder. |
| `content` | `string` | No       | Inline markdown string. Used if `src` is absent.   |

One of `src` or `content` must be provided.

---

### Code

Displays a syntax-highlighted code block.

```json
{ "type": "code", "language": "python", "src": "hello.py", "label": "hello.py" }
```

```json
{ "type": "code", "language": "javascript", "content": "console.log('hello')" }
```

| Field      | Type     | Required | Description                                         |
| ---------- | -------- | -------- | --------------------------------------------------- |
| `type`     | `"code"` | Yes      | Must be `"code"`.                                   |
| `language` | `string` | Yes      | Language identifier for syntax highlighting.         |
| `src`      | `string` | No       | Path to a source file relative to the topic folder.  |
| `content`  | `string` | No       | Inline code string. Used if `src` is absent.         |
| `label`    | `string` | No       | Display label shown above the code block.            |

One of `src` or `content` must be provided.

---

### Quiz — Multiple Choice

Presents a question with selectable options.

```json
{
  "type": "quiz",
  "variant": "multiple-choice",
  "question": "What does the print() function do?",
  "options": [
    "Saves a file",
    "Outputs text to the console",
    "Creates a variable",
    "Imports a module"
  ],
  "answer": 1,
  "explanation": "print() writes output to the standard console."
}
```

| Field         | Type                 | Required | Description                                       |
| ------------- | -------------------- | -------- | ------------------------------------------------- |
| `type`        | `"quiz"`             | Yes      | Must be `"quiz"`.                                 |
| `variant`     | `"multiple-choice"`  | Yes      | Selects the multiple-choice quiz format.          |
| `question`    | `string`             | Yes      | The question text.                                |
| `options`     | `string[]`           | Yes      | List of answer choices.                           |
| `answer`      | `number`             | Yes      | Zero-based index of the correct option.           |
| `explanation` | `string`             | No       | Shown after the user answers.                     |

---

### Quiz — Free Text

Presents a question with an open text input.

```json
{
  "type": "quiz",
  "variant": "free-text",
  "question": "Explain the difference between a list and a tuple.",
  "sampleAnswer": "Lists are mutable, tuples are immutable.",
  "explanation": "Tuples cannot be changed after creation."
}
```

| Field          | Type          | Required | Description                                  |
| -------------- | ------------- | -------- | -------------------------------------------- |
| `type`         | `"quiz"`      | Yes      | Must be `"quiz"`.                            |
| `variant`      | `"free-text"` | Yes      | Selects the free-text quiz format.           |
| `question`     | `string`      | Yes      | The question text.                           |
| `sampleAnswer` | `string`      | No       | A model answer shown after submission.       |
| `explanation`  | `string`      | No       | Shown after the user answers.                |

---

### Callout

A highlighted box for tips, warnings, or extra info.

```json
{ "type": "callout", "style": "warning", "body": "Do not use `eval()` in production code." }
```

| Field   | Type                            | Required | Description                         |
| ------- | ------------------------------- | -------- | ----------------------------------- |
| `type`  | `"callout"`                     | Yes      | Must be `"callout"`.                |
| `style` | `"info"` \| `"warning"` \| `"tip"` | Yes  | Visual style of the callout.        |
| `body`  | `string`                        | Yes      | Markdown-formatted callout content. |

---

### Image

Displays an image with alt text.

```json
{
  "type": "image",
  "src": "diagram.png",
  "alt": "Python variable memory model",
  "caption": "How Python stores variables in memory"
}
```

| Field     | Type      | Required | Description                                        |
| --------- | --------- | -------- | -------------------------------------------------- |
| `type`    | `"image"` | Yes      | Must be `"image"`.                                 |
| `src`     | `string`  | Yes      | Path to the image file relative to the topic folder. |
| `alt`     | `string`  | Yes      | Alt text for accessibility.                        |
| `caption` | `string`  | No       | Caption displayed below the image.                 |

Images must be under 10 MB.

---

## Topic Completion Rules

- **Topics without quizzes** are marked complete when first viewed.
- **Topics with quizzes** are marked complete only when all quizzes in the topic have been answered.

---

## Loading a Course

Courses can be loaded in two ways:

1. **Local folder** — select the course folder using the file picker.
2. **GitHub repository** — paste a GitHub repo URL. The repo must follow the same folder structure above. A GitHub personal access token can be provided for private repos.

---

## Validation Checklist

The app validates courses on load. Use this checklist to catch issues before importing:

- [ ] `course.json` exists at the root and is valid JSON
- [ ] All required fields in `course.json` are present (`id`, `title`, `description`, `version`, `author`, `tags`, `topicOrder`)
- [ ] A `topics/` directory exists
- [ ] Every entry in `topicOrder` has a matching folder in `topics/`
- [ ] Every topic folder contains a valid `content.json` (a JSON array)
- [ ] Every block in `content.json` has a `type` field
- [ ] All `src` paths point to files that exist within the topic folder (no `../` path traversal)
- [ ] Images are under 10 MB
- [ ] Multiple-choice quizzes have an `options` array and a valid `answer` index
- [ ] Text and code blocks provide either `src` or `content`

---

## Full Example

A minimal two-topic course:

```
python-basics/
├── course.json
└── topics/
    ├── 01-hello-world/
    │   ├── content.json
    │   ├── welcome.md
    │   └── hello.py
    └── 02-variables/
        ├── content.json
        └── variables.md
```

**course.json**
```json
{
  "id": "python-basics",
  "title": "Python Basics",
  "description": "Learn Python from scratch.",
  "version": "1.0.0",
  "author": "Jane Smith",
  "tags": ["python", "beginner"],
  "topicOrder": ["01-hello-world", "02-variables"]
}
```

**topics/01-hello-world/content.json**
```json
[
  { "type": "text", "src": "welcome.md" },
  { "type": "code", "language": "python", "src": "hello.py", "label": "hello.py" },
  { "type": "callout", "style": "tip", "body": "Try running this in your terminal with `python hello.py`." },
  {
    "type": "quiz",
    "variant": "multiple-choice",
    "question": "What will `print('Hello')` output?",
    "options": ["Hello", "'Hello'", "print('Hello')", "Error"],
    "answer": 0
  }
]
```

**topics/01-hello-world/welcome.md**
```markdown
# Welcome to Python

Python is a versatile programming language used for web development,
data science, automation, and more.

In this topic you'll write your first Python program.
```

**topics/01-hello-world/hello.py**
```python
print("Hello, World!")
```

**topics/02-variables/content.json**
```json
[
  { "type": "text", "src": "variables.md" },
  {
    "type": "quiz",
    "variant": "free-text",
    "question": "What is the difference between an integer and a float?",
    "sampleAnswer": "An integer is a whole number, a float has a decimal point."
  }
]
```
