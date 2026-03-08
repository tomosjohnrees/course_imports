# Product Overview: AI-Powered Learning App

## Vision

A modular, community-driven learning application where courses are created with AI assistance, shared via GitHub, and loaded locally or remotely into a unified learning experience. The app separates content from the platform — anyone can author a course, publish it, and anyone else can load it in.

---

## Core Concepts

### The App
A desktop application that acts as a **course reader and learning environment**. It does not host course content itself — it loads courses from external sources (GitHub repositories or local folders) and presents them in a consistent, interactive interface.

### Courses
A course is a structured collection of topics stored in a specific folder/file format that the app understands. Courses are portable, version-controlled, and shareable. They are designed to be generated with AI tooling, manually authored, or a mix of both.

### The Community Model
Anyone can:
- Generate a course using AI tools (e.g. a dedicated course generator)
- Push that course to a public GitHub repository
- Share the repo URL so others can load it directly into their app instance

---

## How Courses Are Loaded

The app supports two source types:

### 1. GitHub Repository
Users provide a URL to a GitHub repository containing a valid course. The app fetches the course structure and content directly from the repo, enabling easy sharing and versioning.

### 2. Local Folder
Users point the app at a folder on their local machine. This supports offline use, private courses, and active course development/testing.

In both cases, the app validates the folder structure before loading.

---

## Course Structure

A course lives in a single root folder. Inside it, each **topic** has its own subfolder containing a `content.json` manifest and any files it references.

```
my-course/
├── course.json
└── topics/
    ├── 01-introduction/
    │   ├── content.json        # ordered list of content blocks
    │   ├── intro.md            # referenced by a text block
    │   └── hello.py            # referenced by a code block
    ├── 02-core-concepts/
    │   ├── content.json
    │   ├── overview.md
    │   ├── example.py
    │   └── diagram.png
    └── ...
```

### `course.json` — Course Metadata
Top-level file describing the course itself.

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
    "02-core-concepts",
    "03-functions"
  ]
}
```

### `content.json` — Topic Content
Each topic has a single `content.json` file that defines an ordered list of **content blocks**. The app renders these blocks from top to bottom, in sequence. This replaces the old fixed files (`overview.md`, `examples.json`, `questions.json`) with a flexible, author-controlled layout.

```json
[
  {
    "type": "text",
    "src": "intro.md"
  },
  {
    "type": "callout",
    "style": "info",
    "body": "Python is case-sensitive. `print` and `Print` are not the same."
  },
  {
    "type": "code",
    "language": "python",
    "src": "hello.py",
    "label": "hello.py"
  },
  {
    "type": "text",
    "src": "explanation.md"
  },
  {
    "type": "quiz",
    "question": "What does the print() function do?",
    "options": [
      "Saves a file",
      "Outputs text to the console",
      "Creates a variable",
      "Imports a module"
    ],
    "answer": 1,
    "explanation": "print() writes output to the standard console."
  },
  {
    "type": "image",
    "src": "diagram.png",
    "alt": "Python variable memory model",
    "caption": "How Python stores variables in memory"
  }
]
```

---

## Content Block Types

### v1 blocks (shipped at launch)

| Type | Description |
|---|---|
| `text` | Renders a markdown file. `src` points to a `.md` file in the topic folder. |
| `code` | Syntax-highlighted code block. `src` points to a source file, or inline via `body`. Optional `label` shown as filename. |
| `quiz` | A single self-assessment question. Supports `multiple-choice` and `free-text` variants. Shows feedback and explanation on answer. |
| `callout` | An inline info, warning, or tip box. Content provided directly in `body` as markdown. Styled by `style`: `info`, `warning`, `tip`. |
| `image` | Displays a local image with optional `caption`. |

### Planned blocks (post-v1)

| Type | Description |
|---|---|
| `animation` | Renders a Lottie animation from a `.json` file. |
| `embed` | Embeds an external URL (YouTube, CodePen, etc.) in an iframe. |
| `reveal` | A collapsible block — e.g. "Show answer" or "Show hint". |
| `checkpoint` | An explicit "Mark as complete" button placed anywhere in the flow. |
| `tabs` | Groups child blocks into a tab switcher within the page. |

The block system is intentionally open-ended. New block types can be added to the app without changing the course folder structure or any existing courses.

---

## App Features (High-Level)

| Feature | Description |
|---|---|
| Course Loader | Load courses from a GitHub URL or local folder path |
| Topic Navigator | Browse and select topics within a loaded course |
| Block Renderer | Render each topic's content blocks in sequence |
| Progress Tracking | Track which topics have been completed |
| Course Validation | On load, validate that the course meets the expected structure |
| Recent Courses | Quick-access list of previously loaded courses |

---

## AI Course Generation

A key part of the ecosystem is the ability to generate courses using AI. A companion tool (or integrated flow) allows users to:

1. Specify a subject, difficulty level, and number of topics
2. Have an AI model generate the full course folder structure
3. Review and edit the generated content
4. Publish to GitHub for others to use

The block-based format is well-suited to AI generation — producing an ordered list of typed blocks is a natural output for a language model, and the schema is explicit enough to validate reliably.

---

## Design Principles

- **Content-agnostic** — the app renders any valid course regardless of subject matter
- **Flexible** — the block model lets course authors control layout, order, and content type freely
- **Portable** — courses are plain files (markdown, JSON, images); no database required
- **Versionable** — courses live in Git repos; changes are tracked over time
- **Offline-first** — local folder loading works with no internet connection
- **Community-driven** — the GitHub loading model enables a library of shared courses
- **AI-friendly** — the schema is intentionally simple to make AI generation easy and reliable

---

## Out of Scope (v1)

- User accounts or cloud sync
- In-app course editor
- Paid or gated course content
- Video or audio content (use `embed` block post-v1 for YouTube)
- Real-time collaboration
- Animation blocks (Lottie support planned for v2)

---

## Related Documents

- `app_architecture.md` — Technical architecture and component breakdown
- `design_guide.md` — Visual design system and component specs
- `roadmap.md` — Phased delivery plan
