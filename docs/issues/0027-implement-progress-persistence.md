# [0027] Implement progress persistence via IPC

## Summary

Persist course progress to disk so users can close the app and pick up where they left off. When a course is loaded, any previously saved progress is restored into the store. Progress is saved automatically as the user works through the course.

## Context

- **Phase:** Milestone 5 — Progress Persistence (IPC)
- **Depends on:** #0009, #0026
- **Blocks:** #0029

## What needs to happen

1. IPC handlers for saving and retrieving progress data per course ID via `electron-store`
2. Progress is automatically saved to disk after every quiz answer and every topic view, debounced to avoid excessive writes
3. When a course is loaded, persisted progress for that course ID is fetched and hydrated into the course store
4. Progress data is keyed by a stable course identifier so different courses don't overwrite each other

## Acceptance criteria

### Functionality
- [ ] `store:saveProgress` IPC handler writes progress data for a given course ID to `electron-store`
- [ ] `store:getProgress` IPC handler returns previously saved progress for a given course ID, or null if none exists
- [ ] Progress is saved to disk after a quiz answer is recorded (debounced)
- [ ] Progress is saved to disk after a topic is viewed for the first time (debounced)
- [ ] On course load, the app fetches persisted progress and hydrates the course store before rendering the course view
- [ ] Progress survives a full app restart — closing and reopening the app with the same course shows previously completed topics as complete
- [ ] Loading a different course does not affect another course's persisted progress

### Security
- [ ] Progress data does not include raw course content — only identifiers and completion states are persisted
- [ ] IPC handlers validate that the course ID parameter is a non-empty string before reading or writing

### Performance
- [ ] Disk writes are debounced (e.g. 500ms–1s) so rapid navigation does not cause excessive I/O
- [ ] Progress hydration on course load does not block rendering — the course view should appear promptly with progress applied

### Testing
- [ ] Unit tests for `store:saveProgress` and `store:getProgress` IPC handlers covering save, retrieve, and missing-course-ID paths
- [ ] Test that debouncing prevents multiple rapid saves from each triggering a disk write
- [ ] Integration test verifying the full cycle: load course → answer quiz → restart → reload course → progress is restored

## Notes

- Use a stable course identifier (e.g. a hash of the course source path or GitHub URL + repo) so that reloading the same course from the same source restores progress.
- The debounce window should be short enough that closing the app shortly after an action still captures the save — consider flushing pending saves on app quit.
