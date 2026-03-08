# [0014] Wire home screen to local folder loading pipeline

## Summary

Connect the home screen's "Open Local Folder" button to the full local loading pipeline. When a user clicks the button, the app opens a folder picker, loads and validates the course, shows loading and error states, and navigates to the course view on success. This is the first end-to-end user flow in the app — the moment it becomes functional.

## Context

- **Phase:** Milestone 2 — Home Screen Wiring
- **Depends on:** #0005, #0009, #0012, #0013
- **Blocks:** None

## What needs to happen

1. The "Open Local Folder" button calls `window.api.course.selectFolder()` then `window.api.course.loadFromFolder(path)`
2. Loading state is shown in the UI while the course loads
3. On success, the course is stored in `course.store` and the app navigates to `/course`
4. On failure, a clear error message is displayed to the user

## Acceptance criteria

### Functionality
- [x] Clicking "Open Local Folder" opens the native folder picker dialog
- [x] If the user cancels the dialog, nothing happens — no loading state, no error
- [x] If a folder is selected, the app shows a loading indicator while the course loads
- [x] On successful load, the course is set in `course.store` and the app navigates to `/course`
- [x] On failure (invalid structure or parse error), an error message is displayed on the home screen
- [x] The error message is the validation/parse error from the main process, not a generic message
- [x] The user can dismiss the error and try again

### Security
- [x] The renderer does not access the file system directly — all file operations go through the IPC bridge
- [x] Error messages shown to the user do not expose full file system paths outside the course folder

### Performance
- [x] The loading indicator appears immediately when loading starts — no perceived delay before feedback
- [x] The UI remains responsive while the main process validates and parses (IPC is async)

### Testing
- [x] Component tests verify the loading state appears when a folder is selected
- [x] Component tests verify navigation occurs on successful load
- [x] Component tests verify the error message is displayed on failed load
- [x] Component tests verify cancelling the folder picker leaves the UI unchanged

## Notes

- The GitHub URL input is wired in Milestone 3. This issue only covers the local folder flow.
- The `/course` route exists from #0004 but will show minimal content until Milestone 4 builds the block renderer.
- The loading flow is: selectFolder → loadFromFolder → setCourse → navigate. Each step should have clear error boundaries.
