# App Architecture

## Overview

The app is a desktop application built with **Electron**. It uses a modern Electron architecture with a clear separation between the main process (Node.js, file system, native APIs) and the renderer process (UI, React). All communication between the two crosses a narrow, well-defined IPC bridge.

The frontend is built with **React** and styled according to the design guide. Course content is loaded either from a local folder or fetched from a GitHub repository, parsed, validated, and handed to the renderer as plain JavaScript objects.

---

## Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| Desktop shell | Electron | Window management, native APIs, packaging |
| Frontend framework | React | UI rendering and state management |
| Build tool | Vite + `electron-vite` | Fast dev server, HMR, bundling |
| Styling | CSS Modules or Tailwind CSS | Component-scoped styles |
| State management | Zustand | Lightweight global state (active course, progress) |
| Routing | React Router (memory router) | In-app navigation without a URL bar |
| Markdown rendering | `react-markdown` + `remark-gfm` | Renders `text` blocks |
| Syntax highlighting | `shiki` | Renders `code` blocks |
| Animation | `lottie-react` | Renders `animation` blocks (post-v1) |
| GitHub fetching | Native `fetch` via main process | Download course content from GitHub API |
| Local file reading | Node.js `fs` via main process | Read course files from disk |
| Persistence | `electron-store` | Store user preferences and course history |
| Packaging | `electron-builder` | Cross-platform installers (Mac, Windows, Linux) |

---

## Process Architecture

Electron runs two distinct processes. Understanding this boundary is the most important architectural decision in the app.

```
┌─────────────────────────────────────────────────────────────┐
│  MAIN PROCESS (Node.js)                                     │
│                                                             │
│  - Window creation and lifecycle                            │
│  - File system access (read course folders)                 │
│  - GitHub API requests (fetch remote courses)               │
│  - Course validation and parsing                            │
│  - electron-store (persist settings, history)               │
│  - IPC handlers (respond to renderer requests)              │
│                                                             │
└───────────────────────┬─────────────────────────────────────┘
                        │  IPC (contextBridge)
                        │  ipcMain / ipcRenderer
                        │
┌───────────────────────▼─────────────────────────────────────┐
│  RENDERER PROCESS (Chromium + React)                        │
│                                                             │
│  - All UI rendering                                         │
│  - React component tree                                     │
│  - Zustand global state                                     │
│  - React Router navigation                                  │
│  - Block renderer (markdown, code, quiz, callout, image)    │
│  - Quiz interaction and progress tracking (in-session)      │
│                                                             │
│  NO direct Node.js / file system access                     │
└─────────────────────────────────────────────────────────────┘
```

### Security model

`nodeIntegration` is **disabled** and `contextIsolation` is **enabled**. The renderer process has no direct access to Node.js APIs. All privileged operations (file reads, network requests, disk writes) happen in the main process and are exposed to the renderer only through a typed `contextBridge` preload script.

---

## Project Structure

```
app/
├── electron/                   # Main process code
│   ├── main.ts                 # Entry point, window creation
│   ├── preload.ts              # contextBridge API surface
│   ├── ipc/                    # IPC handler modules
│   │   ├── course.handlers.ts  # Load, validate, parse courses
│   │   ├── github.handlers.ts  # Fetch from GitHub API
│   │   └── store.handlers.ts   # Read/write persistent storage
│   ├── course/                 # Course loading logic
│   │   ├── loader.ts           # Orchestrates local + remote loading
│   │   ├── validator.ts        # Validates course folder structure
│   │   ├── parser.ts           # Parses content.json + referenced files into typed objects
│   │   └── github.ts           # GitHub API client
│   └── store.ts                # electron-store schema and instance
│
├── src/                        # Renderer process (React app)
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Router setup, top-level layout
│   ├── store/                  # Zustand state
│   │   ├── course.store.ts     # Active course, topics, progress
│   │   └── ui.store.ts         # UI state (sidebar, theme, loading)
│   ├── pages/                  # Top-level route components
│   │   ├── Home.tsx            # Load screen (no course loaded)
│   │   └── Course.tsx          # Main learning view (course loaded)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx    # Sidebar + main area wrapper
│   │   │   └── Sidebar.tsx     # Topic navigation list
│   │   ├── blocks/             # One component per block type
│   │   │   ├── BlockRenderer.tsx   # Iterates block list, delegates to correct component
│   │   │   ├── TextBlock.tsx       # Renders a markdown file
│   │   │   ├── CodeBlock.tsx       # Syntax-highlighted code with copy button
│   │   │   ├── QuizBlock.tsx       # Single question with answer + feedback
│   │   │   ├── CalloutBlock.tsx    # Info / warning / tip box
│   │   │   └── ImageBlock.tsx      # Image with optional caption
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       ├── ProgressBar.tsx
│   │       └── EmptyState.tsx
│   ├── hooks/
│   │   ├── useCourse.ts        # Load course via IPC
│   │   └── useProgress.ts      # Track topic completion
│   └── types/
│       └── course.types.ts     # Course, Topic, Block, and block variant interfaces
│
├── electron.vite.config.ts
├── electron-builder.config.ts
└── package.json
```

---

## IPC Bridge

The preload script (`electron/preload.ts`) defines the entire API surface available to the renderer. Nothing outside this interface can cross the process boundary.

```typescript
// electron/preload.ts
contextBridge.exposeInMainWorld('api', {
  course: {
    loadFromFolder: (folderPath: string) => ipcRenderer.invoke('course:loadFromFolder', folderPath),
    loadFromGitHub: (repoUrl: string)    => ipcRenderer.invoke('course:loadFromGitHub', repoUrl),
    selectFolder: ()                     => ipcRenderer.invoke('course:selectFolder'),
  },
  store: {
    getRecentCourses: ()                          => ipcRenderer.invoke('store:getRecentCourses'),
    saveRecentCourse: (course: RecentCourse)      => ipcRenderer.invoke('store:saveRecentCourse', course),
    getProgress: (courseId: string)               => ipcRenderer.invoke('store:getProgress', courseId),
    saveProgress: (courseId: string, data: any)   => ipcRenderer.invoke('store:saveProgress', courseId, data),
    getPreferences: ()                            => ipcRenderer.invoke('store:getPreferences'),
    savePreferences: (prefs: Preferences)         => ipcRenderer.invoke('store:savePreferences', prefs),
  },
})
```

The renderer accesses this as `window.api.course.loadFromGitHub(url)` etc. TypeScript types for `window.api` are declared in a global `.d.ts` file so the renderer has full type safety.

---

## Course Loading Flow

### Local folder

```
User clicks "Open Local Folder"
        │
        ▼
renderer: window.api.course.selectFolder()
        │
        ▼
main: opens native folder picker dialog (dialog.showOpenDialog)
        │
        ▼
main: course/loader.ts — reads folder from disk (fs)
        │
        ▼
main: course/validator.ts — checks course.json exists, topics/ exists,
      each topic folder contains content.json
        │
        ├─ invalid → returns { success: false, error: "..." }
        │
        └─ valid →
                │
                ▼
        main: course/parser.ts — for each topic:
              reads content.json → block list
              for each block with a src field: reads referenced file from disk
              resolves file content into the block object
                │
                ▼
        returns { success: true, course: Course } to renderer
                │
                ▼
        renderer: stores in Zustand, navigates to /course
```

### GitHub repository

```
User enters GitHub URL and clicks "Load"
        │
        ▼
renderer: window.api.course.loadFromGitHub(url)
        │
        ▼
main: course/github.ts — resolves repo URL to GitHub API calls
      GET /repos/{owner}/{repo}/contents/course.json
      GET /repos/{owner}/{repo}/contents/topics/   (list topic folders)
      For each topic:
        GET .../topics/{topic}/content.json
        For each block with a src field:
          GET .../topics/{topic}/{src}
        │
        ▼
main: course/validator.ts — validates structure
        │
        ├─ invalid → returns error
        │
        └─ valid →
                │
                ▼
        main: course/parser.ts — constructs Course object from fetched content
                │
                ▼
        returns { success: true, course: Course } to renderer
                │
                ▼
        renderer: stores in Zustand, navigates to /course
```

GitHub content is fetched via the GitHub Contents API. Files are returned as base64-encoded strings and decoded in the main process. No git cloning is performed — individual file contents are fetched on demand.

For public repos, no authentication is needed. Rate limiting (60 requests/hour unauthenticated) is sufficient for typical course sizes. A GitHub personal access token can be optionally configured in settings to raise this to 5,000/hour.

---

## Block Renderer

The central piece of the renderer is `BlockRenderer.tsx`. It receives a topic's block list and renders each block in order by delegating to the appropriate component.

```typescript
// components/blocks/BlockRenderer.tsx
export function BlockRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="block-list">
      {blocks.map((block, index) => (
        <BlockSwitch key={index} block={block} />
      ))}
    </div>
  )
}

function BlockSwitch({ block }: { block: Block }) {
  switch (block.type) {
    case 'text':     return <TextBlock block={block} />
    case 'code':     return <CodeBlock block={block} />
    case 'quiz':     return <QuizBlock block={block} />
    case 'callout':  return <CalloutBlock block={block} />
    case 'image':    return <ImageBlock block={block} />
    default:         return <UnknownBlock type={block.type} />
  }
}
```

Adding a new block type in future means: adding a new case to the switch and a new component. No other changes needed.

---

## State Management

Zustand is used for all global state. There are two stores.

### `course.store.ts`

```typescript
interface CourseStore {
  course: Course | null
  activeTopic: string | null
  progress: CourseProgress
  setCourse: (course: Course) => void
  setActiveTopic: (topicId: string) => void
  markTopicComplete: (topicId: string) => void
  clearCourse: () => void
}
```

### `ui.store.ts`

```typescript
interface UIStore {
  theme: 'light' | 'dark' | 'system'
  sidebarWidth: number
  isLoading: boolean
  loadingMessage: string | null
  error: string | null
  setTheme: (theme: Theme) => void
  setLoading: (loading: boolean, message?: string) => void
  setError: (error: string | null) => void
}
```

Note that `activeTab` is gone — the tab-based navigation between Overview, Examples, and Questions no longer exists. Topics are a single scrollable page of blocks.

Progress is persisted to disk via `electron-store` (written through the IPC bridge) so that completion state survives app restarts.

---

## Data Types

```typescript
// src/types/course.types.ts

interface Course {
  id: string
  title: string
  description: string
  version: string
  author: string
  tags: string[]
  topics: Topic[]
  source: CourseSource     // { type: 'local' | 'github', path: string }
}

interface Topic {
  id: string               // Folder name e.g. "01-introduction"
  title: string            // Derived from folder name or a future topic.json
  blocks: Block[]          // Ordered content blocks parsed from content.json
}

// Block is a discriminated union — each type has its own shape
type Block =
  | TextBlock
  | CodeBlock
  | QuizBlock
  | CalloutBlock
  | ImageBlock

interface TextBlock {
  type: 'text'
  content: string          // Resolved markdown string (file already read by parser)
}

interface CodeBlock {
  type: 'code'
  language: string
  content: string          // Resolved code string (file already read by parser)
  label?: string           // Optional filename shown above block
}

interface QuizBlock {
  type: 'quiz'
  question: string
  variant: 'multiple-choice' | 'free-text'
  options?: string[]       // multiple-choice only
  answer?: number          // index into options, multiple-choice only
  sampleAnswer?: string    // free-text only
  explanation?: string
}

interface CalloutBlock {
  type: 'callout'
  style: 'info' | 'warning' | 'tip'
  body: string             // Inline markdown string
}

interface ImageBlock {
  type: 'image'
  src: string              // Resolved to a data URI or file:// path by parser
  alt: string
  caption?: string
}

interface CourseProgress {
  [topicId: string]: {
    viewed: boolean
    complete: boolean
  }
}
```

Note that by the time blocks reach the renderer, all `src` references have already been resolved by the parser — `TextBlock.content` and `CodeBlock.content` contain the actual file contents as strings, not file paths. The renderer never reads files directly.

---

## Routing

React Router is used in **memory router** mode.

```
/                 → Home (no course loaded)
/course           → Course shell (sidebar + content area)
/course/topic/:id → Specific topic
```

Navigation to `/course` happens automatically after a course loads successfully.

---

## Persistence

`electron-store` stores a single JSON file in the OS user data directory.

```typescript
{
  recentCourses: RecentCourse[]   // Last 10 loaded courses (id, title, source)
  progress: {
    [courseId: string]: CourseProgress
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    githubToken?: string
  }
}
```

The renderer never reads or writes this directly. All persistence goes through the IPC bridge (`window.api.store.*`).

---

## Error Handling

| Layer | Handling approach |
|---|---|
| GitHub fetch failure | Return `{ success: false, error: string }` from IPC handler |
| Invalid course structure | Validator returns structured error listing missing files |
| Malformed `content.json` | Try/catch in parser, returns specific parse error |
| Missing referenced file | Parser catches missing `src` targets, returns descriptive error |
| Unknown block type | `BlockRenderer` renders a neutral `UnknownBlock` — does not crash |
| Network offline | Caught in GitHub fetcher, specific "no connection" message |

The renderer checks `result.success` on all IPC calls. On failure it sets `ui.store.error` which triggers an error banner.

---

## Build & Packaging

`electron-vite` handles the build pipeline. `electron-builder` packages the app:

- **macOS** — `.dmg` with universal binary (Intel + Apple Silicon)
- **Windows** — NSIS `.exe` installer
- **Linux** — `.AppImage`

```
npm run dev        # Start dev server with HMR
npm run build      # Production build
npm run package    # Build + package into installers
```

---

## Development Notes

- Use `electron-vite`'s built-in HMR — renderer changes hot-reload without restarting Electron.
- Main process changes require a full restart.
- Keep all Node.js imports in `electron/` — the renderer must never import `fs`, `path`, or Node built-ins.
- IPC channel names use namespaced strings (`course:loadFromFolder`) to avoid collisions.
- When adding a new block type: (1) add the interface to `course.types.ts`, (2) update the parser to handle it, (3) add a component in `components/blocks/`, (4) add a case to `BlockRenderer`.

---

## Related Documents

- `product_overview.md` — what the app does and course format specification
- `design_guide.md` — visual design system and component specs
- `roadmap.md` — phased delivery plan
