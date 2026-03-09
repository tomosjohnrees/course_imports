# [0049] Allow users to remove courses they've added

## Summary

Users currently have no way to remove a course from their recent courses list once it has been added. This means stale, broken, or unwanted entries accumulate over time with no recourse. Adding a removal option gives users control over their course list and keeps the home screen tidy.

## Context

- **Phase:** None
- **Depends on:** #0018 (recent courses persistence)
- **Blocks:** None

## What needs to happen

1. A remove action is available on each course entry in the recent courses list
2. An IPC handler removes the specified course from the persisted recent courses store
3. The home screen updates immediately after removal without a full reload
4. Associated progress data for the removed course is optionally cleared

## Acceptance criteria

### Functionality
- [x] Each recent course entry has a visible remove button or action
- [x] Clicking remove deletes the course from the persisted recent courses list in `electron-store`
- [x] The home screen re-renders to reflect the removal without navigating away
- [x] A confirmation prompt is shown before removing a course that has saved progress
- [x] Removing a course does not affect other entries in the recent courses list

### Security
- [x] The remove IPC handler validates the course identifier before deleting — only courses belonging to the current store can be removed
- [x] The handler does not accept arbitrary keys or paths that could delete unrelated store data

### Performance
- [x] Removing a course completes without a perceptible delay (under 100 ms for the store write)
- [x] The home screen list update does not cause a full re-fetch of all course data

### Testing
- [x] Unit tests verify the remove handler deletes the correct entry and leaves others intact
- [x] Unit tests verify removal of a non-existent course ID is handled gracefully
- [x] Component tests verify the remove button triggers removal and the list updates
- [x] Component tests verify the confirmation prompt appears when progress data exists

## Notes

Consider whether removing a course should also clear its saved progress data. A confirmation step for courses with progress lets users make an informed choice. Courses loaded from GitHub can always be re-added later, so removal is non-destructive in that sense.
