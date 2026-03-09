# Course Imports

Desktop app for loading and viewing structured courses from GitHub repos or local folders. Courses are portable, version-controlled, and designed to be AI-generated or hand-authored.

## Tech Stack

Electron, React 19, TypeScript, Vite, Zustand, Shiki, react-markdown

## Getting Started

1. `npm install`
2. `npm run dev`

The app opens in development mode with hot reload.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Build for production |
| `npm run package` | Build and package distributable (dmg/exe/AppImage) |
| `npm test` | Run tests (Vitest) |
| `npm run typecheck` | Type-check both node and web code |
| `npm run preview` | Preview production build |

## How It Works

Load a course by pointing the app at a **GitHub repo URL** or a **local folder**. The app validates the course structure, then renders topics as a sequence of content blocks (markdown, code, quizzes, callouts, images).

Course format:

```
my-course/
├── course.json           # title, description, topic order
└── topics/
    ├── 01-introduction/
    │   ├── content.json  # ordered list of content blocks
    │   ├── intro.md
    │   └── hello.py
    └── 02-core-concepts/
        ├── content.json
        └── overview.md
```

See `docs/course_authoring_guide.md` for the full spec on writing courses, and `examples/` for a working example.

## Project Structure

```
electron/       Electron main process, IPC handlers, course loading
src/            React renderer — pages, components, store
  components/   UI components and content block renderers
  pages/        Route pages (Home, Course, NotFound)
  store/        Zustand state management
examples/       Example course content
docs/           Product docs, architecture, design guide
```
