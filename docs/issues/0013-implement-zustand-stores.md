# [0013] Implement Zustand stores for course and UI state

## Summary

Implement the two Zustand stores that hold all global state for the app: `course.store` for the active course, selected topic, and progress tracking, and `ui.store` for theme, loading state, and error messages. These stores are the central state layer that the renderer reads from and writes to during course loading and navigation.

## Context

- **Phase:** Milestone 2 — Zustand Store
- **Depends on:** #0008, #0003
- **Blocks:** #0014

## What needs to happen

1. `course.store.ts` with the full state shape (course, activeTopic, progress) and all actions (setCourse, setActiveTopic, markTopicComplete, clearCourse)
2. `ui.store.ts` with the full state shape (theme, isLoading, loadingMessage, error) and all actions (setTheme, setLoading, setError)
3. Both stores are importable and usable from any renderer component

## Acceptance criteria

### Functionality
- [ ] `course.store` holds `course: Course | null`, `activeTopic: string | null`, and `progress: CourseProgress`
- [ ] `setCourse(course)` sets the active course and resets activeTopic and progress
- [ ] `setActiveTopic(topicId)` updates the active topic
- [ ] `markTopicComplete(topicId)` marks a topic as complete in the progress map
- [ ] `clearCourse()` resets course, activeTopic, and progress to initial state
- [ ] `ui.store` holds `theme`, `isLoading`, `loadingMessage`, and `error`
- [ ] `setLoading(true, 'Loading course...')` sets both isLoading and loadingMessage
- [ ] `setLoading(false)` clears isLoading and loadingMessage
- [ ] `setError(message)` sets the error; `setError(null)` clears it

### Security
- [ ] Stores do not persist data to disk on their own — persistence goes through the IPC bridge in later milestones
- [ ] No sensitive data (tokens, credentials) is held in either store

### Performance
- [ ] Store updates trigger re-renders only in components that subscribe to the changed slice (Zustand's default selector behaviour)
- [ ] No unnecessary deep cloning of the course object on state updates

### Testing
- [ ] Unit tests verify each action in `course.store` updates state correctly
- [ ] Unit tests verify each action in `ui.store` updates state correctly
- [ ] Unit tests verify `clearCourse` resets all course-related state

## Notes

- See `docs/app_architecture.md` → "State Management" for the canonical store interfaces.
- Progress persistence (writing to `electron-store` via IPC) is handled in Milestone 5 — for now progress is in-memory only.
