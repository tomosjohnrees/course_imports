# Roadmap

## Overview

This roadmap is structured as sequential milestones, each with a clear goal and a discrete set of engineering tasks. Since this is a solo project with no fixed deadline, milestones are sized to feel completable and to produce something tangible at the end of each one — no milestone ends in a half-working state.

Each task is written as a concrete unit of work that can be picked up, completed, and checked off independently.

---

## Milestone 1 — Project Scaffold & Shell

**Goal:** A working Electron app that opens a window, has the correct project structure in place, and renders a basic UI shell. Nothing functional yet — but the foundation everything else is built on is solid.

### Electron & Build Setup
- [ ] Initialise project with `electron-vite`, TypeScript, and React
- [ ] Configure `electron-builder` for macOS, Windows, and Linux targets
- [ ] Set up main process entry point (`electron/main.ts`) with a basic `BrowserWindow`
- [ ] Configure `nodeIntegration: false` and `contextIsolation: true` on the window
- [ ] Create preload script (`electron/preload.ts`) with `contextBridge` — empty API surface for now
- [ ] Add global TypeScript declaration file for `window.api`
- [ ] Confirm HMR works in dev mode for the renderer

### Project Structure
- [ ] Create the full folder structure as defined in `app_architecture.md`
- [ ] Set up path aliases (`@/` → `src/`) in `electron-vite` config
- [ ] Install and configure Zustand, React Router (memory router), and `electron-store`
- [ ] Create empty placeholder files for all stores, pages, and key components

### UI Shell
- [ ] Implement `AppShell.tsx` — sidebar + main content area two-panel layout
- [ ] Implement `Sidebar.tsx` — static, no data yet
- [ ] Set up React Router with `/` (Home) and `/course` routes
- [ ] Implement `Home.tsx` — load screen layout with "Load from GitHub" and "Open Local Folder" buttons (no functionality yet)

### Design Tokens
- [ ] Define all CSS custom properties from the design guide (colours, spacing, typography)
- [ ] Set up light and dark mode token switching via `prefers-color-scheme`
- [ ] Install and configure Geist, Lora, and Geist Mono fonts
- [ ] Implement global base styles (reset, body font, scrollbar styling)

**Milestone complete when:** The app opens, shows the home screen, and the two-panel layout is visible when navigating to `/course` — all correctly styled, no functionality.

---

## Milestone 2 — Course Loading (Local)

**Goal:** A user can point the app at a local folder, the course is validated and parsed, and the data is handed to the renderer. No content is rendered yet — but the full loading pipeline for local folders works end to end.

### IPC Bridge
- [ ] Define the full `window.api` surface in `preload.ts` (all methods, even those not yet implemented)
- [ ] Register IPC handler module structure in `electron/ipc/`
- [ ] Implement `course:selectFolder` — opens native folder picker dialog, returns selected path
- [ ] Implement `course:loadFromFolder` — orchestrates validation and parsing, returns `{ success, course }` or `{ success: false, error }`

### Course Validator (`electron/course/validator.ts`)
- [ ] Check that `course.json` exists at the root
- [ ] Check that a `topics/` folder exists
- [ ] Check that each folder listed in `topicOrder` exists inside `topics/`
- [ ] Check that each topic folder contains a `content.json` file
- [ ] Validate that `content.json` is valid JSON and is an array
- [ ] Validate that each block in the array has a `type` field
- [ ] Return a structured validation result: `{ valid: boolean, errors: string[] }`

### Course Parser (`electron/course/parser.ts`)
- [ ] Parse `course.json` into a typed `Course` object
- [ ] For each topic folder: read and parse `content.json` into a raw block list
- [ ] For each block with a `src` field: read the referenced file from disk and resolve its content inline
  - `text` blocks: read `.md` file → store as `content` string
  - `code` blocks: read source file → store as `content` string
  - `image` blocks: read image file → encode as data URI for renderer
- [ ] For blocks with inline content (`callout`, `quiz`): pass through directly
- [ ] Handle missing `src` targets gracefully — return a descriptive error, not a crash
- [ ] Handle malformed `content.json` gracefully (try/catch with specific error messages)
- [ ] Return a fully typed `Course` object with all blocks resolved

### Course Loader (`electron/course/loader.ts`)
- [ ] Orchestrate validator → parser pipeline for local folders
- [ ] Normalise topic ordering according to `topicOrder` in `course.json`

### Zustand Store
- [ ] Implement `course.store.ts` with full state shape and all actions
- [ ] Implement `ui.store.ts` with loading, error, and theme state

### Home Screen Wiring
- [ ] Wire "Open Local Folder" button to `window.api.course.selectFolder()` then `loadFromFolder()`
- [ ] Show loading state in `ui.store` while course loads
- [ ] On success: store course in `course.store`, navigate to `/course`
- [ ] On failure: display error message with the validation/parse error

**Milestone complete when:** Pointing the app at a valid local course folder loads the course data into state and navigates to the course view, with appropriate error messages shown for invalid folders.

---

## Milestone 3 — Course Loading (GitHub)

**Goal:** A user can paste a GitHub repository URL and load a course from it, using the same validation and parsing pipeline as local loading.

### GitHub Client (`electron/course/github.ts`)
- [ ] Parse a GitHub repo URL into `{ owner, repo }` (handle `https://github.com/owner/repo` and `github.com/owner/repo` formats)
- [ ] Implement `fetchFile(owner, repo, path)` — fetches a file via GitHub Contents API, decodes base64 content
- [ ] Implement `fetchDirectory(owner, repo, path)` — lists directory contents
- [ ] Implement `fetchCourse(owner, repo)` — orchestrates fetching all course files:
  - Fetch `course.json`
  - Fetch `topics/` directory listing
  - For each topic: fetch `content.json`, then fetch each file referenced by a `src` field in parallel
- [ ] Handle rate limit errors (403) with a specific user-facing message
- [ ] Handle repo not found (404) with a specific message
- [ ] Handle network offline errors

### IPC Handler
- [ ] Implement `course:loadFromGitHub` — calls GitHub client, then validator, then parser
- [ ] Accept optional GitHub personal access token from `electron-store` preferences and include in request headers if present

### Home Screen
- [ ] Add GitHub URL input field to `Home.tsx`
- [ ] Wire "Load from GitHub" button to `window.api.course.loadFromGitHub(url)`
- [ ] Validate URL format client-side before sending to main process
- [ ] Show loading state with message "Fetching course from GitHub…"
- [ ] On success: store course, navigate to `/course`
- [ ] On failure: display specific error (not found / rate limited / invalid course structure)

### Persistence — Recent Courses
- [ ] Implement `store:saveRecentCourse` IPC handler — saves to `electron-store`
- [ ] Implement `store:getRecentCourses` IPC handler — returns last 10
- [ ] After a successful course load (local or GitHub), save to recent courses
- [ ] Display recent courses on `Home.tsx` below the load inputs
- [ ] Clicking a recent course re-loads it directly

**Milestone complete when:** Pasting a valid GitHub repo URL loads the course, recent courses appear on the home screen, and appropriate errors are shown for bad URLs or invalid repos.

---

## Milestone 4 — Content Rendering

**Goal:** Topics render as a flowing page of content blocks. A user can read text, view code examples, answer quiz questions, and see callout boxes — all in the order the course author defined.

### Sidebar
- [ ] Populate `Sidebar.tsx` with topics from `course.store`
- [ ] Highlight active topic with accent left-border style per design guide
- [ ] Show topic completion indicators (not started / complete)
- [ ] Clicking a topic sets `activeTopic` in store and navigates to it
- [ ] Show course title and overall progress bar at top of sidebar

### Block Renderer (`BlockRenderer.tsx`)
- [ ] Implement `BlockRenderer` — iterates a topic's `blocks` array and delegates each to the correct component via a `switch` on `block.type`
- [ ] Implement `UnknownBlock` fallback — renders a neutral notice for unrecognised block types without crashing
- [ ] Apply consistent vertical spacing between blocks

### Text Block (`TextBlock.tsx`)
- [ ] Install and configure `react-markdown` with `remark-gfm`
- [ ] Render `block.content` markdown string
- [ ] Apply Lora serif font and `--reading-width` constraint to rendered content
- [ ] Style all markdown elements: headings, paragraphs, lists, blockquotes, tables, horizontal rules
- [ ] Wire `CodeBlock` component for fenced code blocks within markdown content

### Code Block (`CodeBlock.tsx`)
- [ ] Install and configure `shiki` for syntax highlighting
- [ ] Load light theme (GitHub Light style) and dark theme (warm dark style)
- [ ] Switch theme automatically with app light/dark mode
- [ ] Render optional `label` (filename) in top-right of code block
- [ ] Add copy-to-clipboard button

### Quiz Block (`QuizBlock.tsx`)
- [ ] Implement multiple-choice UI — full-width option rows per design guide
- [ ] Implement free-text UI — textarea + submit button
- [ ] On answer: show correct/incorrect colour feedback on the selected option
- [ ] Show `explanation` text below options after answering
- [ ] Once answered, lock the block — user cannot re-answer (progress is recorded)
- [ ] If already answered (loaded from persisted progress), render in answered/locked state on mount

### Callout Block (`CalloutBlock.tsx`)
- [ ] Render `block.body` as inline markdown
- [ ] Apply distinct visual style per `block.style`: `info` (blue), `warning` (amber), `tip` (green)
- [ ] Include a matching icon (Lucide) for each style variant

### Image Block (`ImageBlock.tsx`)
- [ ] Render the resolved image (data URI for local, URL for GitHub)
- [ ] Constrain to reading width, never overflow
- [ ] Render optional `caption` below image in muted small text

**Milestone complete when:** A fully authored course renders correctly end to end — text, code, quizzes, callouts, and images all display as expected and quiz answers are recorded.

---

## Milestone 5 — Progress Tracking & Persistence

**Goal:** Progress through a course is tracked and survives app restarts. A user can close and reopen the app and pick up where they left off.

### Progress Tracking (In-session)
- [ ] Mark a topic as "viewed" when it is first navigated to
- [ ] Mark a topic as "complete" when all its quiz blocks have been answered
- [ ] Topics with no quiz blocks are considered complete when viewed
- [ ] Derive overall course completion percentage from topic completion states
- [ ] Reflect all progress states in sidebar indicators and progress bar in real time

### Progress Persistence (IPC)
- [ ] Implement `store:saveProgress` IPC handler — writes progress for a course ID to `electron-store`
- [ ] Implement `store:getProgress` IPC handler — returns persisted progress for a course ID
- [ ] Save progress to disk after every quiz answer and every topic view (debounced)
- [ ] On course load, fetch persisted progress for that course ID and hydrate `course.store`

### Preferences Persistence
- [ ] Implement `store:getPreferences` and `store:savePreferences` IPC handlers
- [ ] Persist theme preference (light / dark / system)
- [ ] Persist optional GitHub personal access token
- [ ] Load preferences on app start and apply before first render (prevents flash of wrong theme)

### Settings Panel
- [ ] Create a minimal settings panel (slide-over or modal)
- [ ] Light / Dark / System theme toggle
- [ ] GitHub personal access token input field (masked)
- [ ] "Clear all progress" destructive action with confirmation

**Milestone complete when:** Progress persists across app restarts, theme preference is remembered, and the settings panel is functional.

---

## Milestone 6 — Polish & Packaging

**Goal:** The app is ready to distribute. Edge cases are handled, the UI is refined, and installers can be built for all platforms.

### Edge Cases & Robustness
- [ ] Handle courses with zero topics gracefully
- [ ] Handle topics with no quiz blocks (all topics auto-complete on view)
- [ ] Handle topics with no blocks at all — show empty state
- [ ] Handle very long course/topic titles without layout breakage
- [ ] Handle malformed `content.json` without crashing the renderer
- [ ] Handle a `src` file referenced in `content.json` that doesn't exist — show inline error block, not a crash
- [ ] Handle GitHub repos with large courses (many topics, many files) — show progress during fetch
- [ ] Handle the app being opened offline with a GitHub course in recent courses

### Keyboard Navigation
- [ ] Arrow keys navigate between topics in the sidebar
- [ ] Tab / Shift+Tab cycles through interactive elements correctly
- [ ] Enter submits answers in quiz blocks
- [ ] All interactive elements have visible focus rings per design guide

### Accessibility
- [ ] Audit colour contrast for all text/background combinations against WCAG AA
- [ ] Add `aria-label` attributes to icon-only buttons
- [ ] Ensure markdown content headings have correct semantic hierarchy
- [ ] Screen reader test for the quiz block flow

### Visual Polish
- [ ] Review all empty states — each has an icon, a heading, and a helpful message
- [ ] Review all error states — plain-language messages throughout
- [ ] Audit spacing consistency against the 8pt grid
- [ ] Audit typography — Lora for all reading content, Geist for all UI chrome
- [ ] Final dark mode review — check every surface and block type renders correctly

### Packaging
- [ ] Configure `electron-builder` with app name, icons, and bundle ID
- [ ] Create app icons for macOS (`.icns`), Windows (`.ico`), and Linux (`.png`)
- [ ] Test macOS build (`.dmg`, universal binary)
- [ ] Test Windows build (NSIS installer)
- [ ] Test Linux build (`.AppImage`)
- [ ] Confirm app launches correctly from installer on each platform
- [ ] Add `npm run package` script to `package.json`

**Milestone complete when:** A distributable installer can be built for all three platforms and the app handles edge cases without crashing or showing broken UI.

---

## Backlog (Post-v1)

These are features deliberately deferred out of v1. They are worth building but should not block the initial release.

- **Animation blocks** — Lottie animation support via `lottie-react` (`animation` block type)
- **Embed blocks** — YouTube, CodePen, and iframe embeds (`embed` block type)
- **Reveal blocks** — collapsible "show hint / show answer" sections (`reveal` block type)
- **Checkpoint blocks** — explicit "mark as complete" button placed mid-topic (`checkpoint` block type)
- **In-app course browser** — browse and load courses from a community registry without leaving the app
- **Course registry** — Cloudflare-hosted registry with submission form and download counters
- **AI course generation** — integrated flow to generate a course from a subject prompt
- **Course validation CLI** — standalone tool authors can run locally before publishing
- **Notes** — per-topic freeform notes saved locally
- **Bookmarks** — mark specific blocks to return to
- **Auto-update** — in-app update notifications and one-click update
- **Search** — full-text search across all loaded course content
- **Export progress** — export completion summary as PDF or markdown

---

## Related Documents

- `product_overview.md` — what the app does and course format specification
- `design_guide.md` — visual design system and component specs
- `app_architecture.md` — technical architecture and component breakdown
