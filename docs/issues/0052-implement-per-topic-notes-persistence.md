# [0052] Implement per-topic notes persistence

## Summary

Add the data layer for per-topic freeform notes so users can jot down thoughts, questions, or summaries as they work through a course. This issue covers the store state, IPC handlers, and persistence — the UI for editing notes is a separate issue.

## Context

- **Phase:** Backlog (Post-v1)
- **Depends on:** None (IPC and persistence infrastructure is in place)
- **Blocks:** #0053 (notes UI depends on this persistence layer)

## What needs to happen

1. The notes data shape is defined — each note is keyed by course ID + topic ID, containing a freeform text string and a last-modified timestamp
2. IPC handlers are implemented: `notes:save` (writes a note for a course/topic) and `notes:get` (retrieves a note for a course/topic) and `notes:getAll` (retrieves all notes for a course)
3. Notes are persisted to `electron-store` and survive app restarts
4. The Zustand store is extended (or a new store is created) to hold notes state in the renderer

## Acceptance criteria

### Functionality
- [ ] Notes can be saved for a specific course + topic combination
- [ ] Notes can be retrieved by course + topic, returning the text and last-modified timestamp
- [ ] All notes for a course can be retrieved in a single call
- [ ] Saving a note for a course/topic that already has one overwrites it
- [ ] Notes for different courses are fully independent
- [ ] Notes persist across app restarts

### Security
- [ ] Notes are scoped by course ID — there is no way to read or write notes across courses through the IPC interface
- [ ] Note content is stored as plain text — no executable content is persisted or evaluated

### Performance
- [ ] Note saves are debounced (e.g. 500ms) to avoid excessive writes during active typing
- [ ] Loading all notes for a course is a single read operation, not one read per topic

### Testing
- [ ] IPC handler tests cover: saving a new note, overwriting an existing note, retrieving a note, retrieving all notes for a course, retrieving a note that doesn't exist (returns null/empty)

## Notes

The "Clear all progress" action in settings should also clear notes, or there should be a separate "Clear notes" option. Decide during implementation.
