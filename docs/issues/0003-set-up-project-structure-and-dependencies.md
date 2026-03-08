# [0003] Set up project folder structure and core dependencies

## Summary

Create the full folder structure defined in the architecture document and install the core runtime dependencies (Zustand, React Router, electron-store). This gives every subsequent issue a consistent place to put code and ensures the key libraries are available from the start.

## Context

- **Phase:** Milestone 1 — Project Structure
- **Depends on:** #0001
- **Blocks:** #0004, #0005

## What needs to happen

1. The complete folder structure from `docs/app_architecture.md` is created — `electron/ipc/`, `electron/course/`, `src/store/`, `src/pages/`, `src/components/blocks/`, `src/components/layout/`, `src/components/ui/`, `src/hooks/`, `src/types/`
2. Path aliases configured (`@/` maps to `src/`) in the `electron-vite` config and `tsconfig.json`
3. Zustand, React Router (for memory router), and `electron-store` installed
4. Empty placeholder files created for all stores, pages, key components, hooks, and type files so imports resolve from the start

## Acceptance criteria

### Functionality
- [ ] All directories listed in the architecture document exist in the project
- [ ] `@/` path alias resolves correctly in both the renderer and TypeScript (e.g. `import { something } from '@/store/course.store'` compiles)
- [ ] Zustand, `react-router-dom`, and `electron-store` are installed and listed in `package.json`
- [ ] Placeholder files exist for: `course.store.ts`, `ui.store.ts`, `Home.tsx`, `Course.tsx`, `AppShell.tsx`, `Sidebar.tsx`, `BlockRenderer.tsx`, `course.types.ts`
- [ ] The app still starts in dev mode without errors after all changes

### Security
- [ ] Dependencies are installed from the npm registry with no known critical vulnerabilities (`npm audit` shows no critical issues)
- [ ] `electron-store` is only imported in the main process, not in the renderer

### Performance
- [ ] Path alias resolution does not add measurable overhead to the build
- [ ] No unnecessary dependencies are installed beyond what is specified

### Testing
- [ ] TypeScript compiles without errors with the new path aliases and placeholder files
- [ ] Importing from the `@/` alias works in at least one renderer file

## Notes

- Placeholder files can export empty objects, stub functions, or just a comment — they just need to exist so that cross-file imports don't break as features are built in parallel.
- See `docs/app_architecture.md` → "Project Structure" for the canonical folder layout.
