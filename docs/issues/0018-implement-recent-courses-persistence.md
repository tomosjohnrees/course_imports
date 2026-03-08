# [0018] Implement recent courses persistence and display

## Summary

After loading a course, users should be able to quickly re-load it without re-entering the path or URL. This issue adds IPC handlers for saving and retrieving recent courses via `electron-store`, updates the home screen to display them, and wires both local and GitHub loading flows to save to the recent courses list.

## Context

- **Phase:** Milestone 3 — Persistence — Recent Courses
- **Depends on:** #0014 (home screen local loading wired), #0017 (home screen GitHub loading wired)
- **Blocks:** None

## What needs to happen

1. `store:saveRecentCourse` and `store:getRecentCourses` IPC handlers that persist to `electron-store`
2. After any successful course load (local or GitHub), the course source is saved to recent courses
3. The home screen displays recent courses below the load inputs
4. Clicking a recent course re-loads it directly from its original source

## Acceptance criteria

### Functionality
- [ ] `store:saveRecentCourse` saves a course entry (title, source type, path/URL, last loaded timestamp) to `electron-store`
- [ ] `store:getRecentCourses` returns the most recent 10 courses, ordered by last loaded
- [ ] Duplicate entries are updated (moved to top) rather than creating a new entry
- [ ] After a successful local folder load, the course is saved to recent courses
- [ ] After a successful GitHub load, the course is saved to recent courses
- [ ] Recent courses are displayed on the home screen below the load inputs
- [ ] Each recent course entry shows the course title, source type (local/GitHub), and when it was last loaded
- [ ] Clicking a recent course triggers the appropriate load flow (local or GitHub) for that source

### Security
- [ ] Local file paths stored in recent courses are not exposed to the renderer — only the course title, source type, and a course identifier are sent over IPC
- [ ] The recent courses list does not store or expose GitHub auth tokens

### Performance
- [ ] Recent courses are loaded on home screen mount without blocking the initial render
- [ ] The `electron-store` read for recent courses is fast (10 entries maximum)

### Testing
- [ ] Tests verify saving and retrieving recent courses round-trips correctly
- [ ] Tests verify duplicate handling updates existing entries
- [ ] Tests verify the list is capped at 10 entries
- [ ] Component tests verify recent courses render on the home screen
- [ ] Component tests verify clicking a recent course triggers the correct load flow
