# [0044] Add home navigation from course view

## Summary

Once a course is loaded and the user navigates to the course view, there is no visible way to return to the home screen to load a different course. The sidebar shows topics, settings, and progress — but no "back" or "home" action. Users like Sarah, who try a variety of courses across sessions, must close and reopen the app to switch courses. This should be a single-click action.

## Context

- **Phase:** UX audit — Sarah Chen
- **Depends on:** #0004, #0019
- **Blocks:** None

## What needs to happen

1. The sidebar or app header includes a clearly labelled action to return to the home screen
2. Navigating home does not destroy in-progress data — progress is persisted before navigation
3. The home screen re-renders with the recent courses list updated to include the course just left

## Acceptance criteria

### Functionality
- [ ] A visible "Home" or "Back to courses" action is present in the sidebar when viewing a course
- [ ] Clicking the action navigates to the home screen
- [ ] The recent courses list on the home screen includes the course that was just open
- [ ] Progress made in the current session is saved before navigating away
- [ ] The action is discoverable without prior knowledge — no hidden keyboard shortcut required

### Security
- [ ] Navigation does not bypass the progress persistence flush — no data loss on transition

### Performance
- [ ] Navigation to home is instant (no re-fetching or re-parsing of recent courses data beyond reading from the store)

### Testing
- [ ] Component tests verify the home navigation element renders in the sidebar
- [ ] Integration tests verify that clicking the action navigates to the home route
- [ ] Integration tests verify that progress is persisted before navigation completes
