# [0054] Implement block bookmarks persistence

## Summary

Add the data layer for bookmarking specific content blocks within a course. Bookmarks let users flag blocks they want to revisit — a code example they need to study further, a concept they found tricky, or a quiz they want to review. This issue covers the store state, IPC handlers, and persistence — the UI is a separate issue.

## Context

- **Phase:** Backlog (Post-v1)
- **Depends on:** None (IPC and persistence infrastructure is in place)
- **Blocks:** #0055 (bookmarks UI depends on this persistence layer)

## What needs to happen

1. The bookmark data shape is defined — each bookmark references a course ID, topic ID, and block index, with an optional user-provided label and a created-at timestamp
2. IPC handlers are implemented: `bookmarks:add`, `bookmarks:remove`, `bookmarks:getAll` (all bookmarks for a course)
3. Bookmarks are persisted to `electron-store` and survive app restarts
4. The Zustand store is extended (or a new store is created) to hold bookmark state in the renderer

## Acceptance criteria

### Functionality
- [x] A bookmark can be added for a specific course + topic + block index
- [x] A bookmark can be removed by the same identifiers
- [x] All bookmarks for a course can be retrieved in a single call
- [x] Adding a bookmark that already exists is a no-op (no duplicates)
- [x] Bookmarks for different courses are fully independent
- [x] Bookmarks persist across app restarts

### Security
- [x] Bookmarks are scoped by course ID — there is no way to read or write bookmarks across courses through the IPC interface
- [x] User-provided bookmark labels are stored as plain text — no executable content

### Performance
- [x] Loading all bookmarks for a course is a single read operation
- [x] Adding or removing a bookmark is a single write — not a full rewrite of all bookmarks

### Testing
- [x] IPC handler tests cover: adding a bookmark, removing a bookmark, retrieving all bookmarks, adding a duplicate (no-op), retrieving bookmarks for a course with none (returns empty array)

## Notes

Block index is used as the identifier since blocks don't have unique IDs in the current content format. If the content format evolves to include block IDs, bookmarks should migrate to use those instead.
