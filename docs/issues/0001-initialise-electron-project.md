# [0001] Initialise Electron project with electron-vite, TypeScript, and React

## Summary

Set up the foundational Electron application using `electron-vite` with TypeScript and React. This establishes the main process, renderer process, preload script, and development tooling that everything else is built on. Without this, no other work can begin.

## Context

- **Phase:** Milestone 1 — Electron & Build Setup
- **Depends on:** None
- **Blocks:** #0002, #0003, #0006

## What needs to happen

1. A working Electron app initialised with `electron-vite`, TypeScript, and React that opens a `BrowserWindow`
2. Main process entry point at `electron/main.ts` with `nodeIntegration: false` and `contextIsolation: true`
3. Preload script at `electron/preload.ts` using `contextBridge` with an empty API surface
4. Global TypeScript declaration file for `window.api` so the renderer has type safety for the IPC bridge
5. HMR confirmed working in dev mode for the renderer process

## Acceptance criteria

### Functionality
- [ ] Running `npm run dev` starts the Electron app and opens a window
- [ ] The renderer process loads a React root component
- [ ] The preload script exposes an empty `window.api` object via `contextBridge`
- [ ] A global `.d.ts` file declares the `window.api` type so TypeScript does not error in the renderer
- [ ] Editing a React component in the renderer triggers a hot reload without restarting Electron

### Security
- [ ] `nodeIntegration` is set to `false` on the `BrowserWindow`
- [ ] `contextIsolation` is set to `true` on the `BrowserWindow`
- [ ] The renderer cannot access Node.js built-ins (`fs`, `path`, `child_process`, etc.) directly

### Performance
- [ ] Dev server starts and opens the window in under 10 seconds on a typical machine
- [ ] HMR applies changes without a full page reload

### Testing
- [ ] The app can be launched in dev mode without errors in the console
- [ ] TypeScript compiles without errors (`npm run typecheck` or equivalent passes)

## Notes

- The preload script API surface will be populated in Milestone 2. For now it just needs the `contextBridge.exposeInMainWorld` call with an empty or stub object.
- See `docs/app_architecture.md` for the full IPC bridge design and security model.
