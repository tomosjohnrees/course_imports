# [0009] Define IPC bridge API surface and handler structure

## Summary

Populate the preload script with the full `window.api` surface and set up the IPC handler registration pattern in the main process. This also includes the `course:selectFolder` handler since it is a simple native dialog call with no dependencies on the course loading pipeline. This establishes the communication contract between main and renderer for all of Milestone 2 and beyond.

## Context

- **Phase:** Milestone 2 — IPC Bridge
- **Depends on:** #0001, #0003
- **Blocks:** #0012, #0014

## What needs to happen

1. The preload script exposes the full `window.api` object via `contextBridge` — all methods defined (stubs for those not yet implemented)
2. The global TypeScript declaration file for `window.api` is updated to match the full API surface
3. An IPC handler module structure is created in `electron/ipc/` with separate files for course, GitHub, and store handlers
4. A handler registration function that the main process calls on startup to register all IPC handlers
5. The `course:selectFolder` handler is implemented — opens a native folder picker dialog and returns the selected path (or null if cancelled)

## Acceptance criteria

### Functionality
- [x] `window.api.course.selectFolder()` opens a native folder picker and returns the selected folder path
- [x] `window.api.course.selectFolder()` returns `null` if the user cancels the dialog
- [x] `window.api.course.loadFromFolder` exists as a stub that returns an error result
- [x] `window.api.course.loadFromGitHub` exists as a stub that returns an error result
- [x] `window.api.store.*` methods exist as stubs
- [x] All IPC handlers are registered from a central entry point called during app startup
- [x] The `window.api` TypeScript declaration matches the actual exposed API

### Security
- [x] The folder picker dialog is restricted to directories only (`properties: ['openDirectory']`)
- [x] IPC channel names use namespaced strings (e.g. `course:selectFolder`) to prevent collisions
- [x] No arbitrary channel names are accepted — only explicitly registered handlers respond to IPC calls

### Performance
- [x] The native dialog opens promptly without blocking the renderer
- [x] Stub handlers return immediately without unnecessary delays

### Testing
- [x] TypeScript compiles without errors with the updated preload and declaration files
- [x] The folder picker can be invoked from the renderer and returns a path or null

## Notes

- See `docs/app_architecture.md` → "IPC Bridge" for the full API surface definition.
- Handler files: `electron/ipc/course.handlers.ts`, `electron/ipc/github.handlers.ts`, `electron/ipc/store.handlers.ts`.
- Stubs should return `{ success: false, error: 'Not implemented' }` so the renderer can handle them gracefully.
