# [0019] Implement sidebar with topic navigation and progress indicators

## Summary

The sidebar needs to be populated with real course data so users can navigate between topics. This issue makes the sidebar dynamic — listing topics from the course store, highlighting the active topic, showing completion indicators, and displaying the course title with an overall progress bar.

## Context

- **Phase:** Milestone 4 — Sidebar
- **Depends on:** #0004 (app shell layout), #0013 (Zustand stores)
- **Blocks:** None

## What needs to happen

1. The sidebar lists all topics from the course store in their defined order
2. The active topic is visually highlighted with the accent left-border style from the design guide
3. Each topic shows a completion indicator (not started / complete)
4. Clicking a topic sets `activeTopic` in the store
5. The course title and an overall progress bar are shown at the top of the sidebar

## Acceptance criteria

### Functionality
- [ ] Sidebar displays all topics from `course.store` in the order defined by `topicOrder`
- [ ] The currently active topic is highlighted with the accent left-border style per the design guide
- [ ] Each topic shows a visual indicator of its completion state (not started / complete)
- [ ] Clicking a topic updates `activeTopic` in the course store and the main content area reflects the change
- [ ] The course title is displayed at the top of the sidebar
- [ ] An overall progress bar shows the percentage of completed topics
- [ ] The sidebar handles courses with many topics without layout breakage (scrollable)

### Security
- [ ] No course data is leaked outside the app's renderer process

### Performance
- [ ] Sidebar re-renders only when relevant store state changes (active topic, completion states), not on every store update
- [ ] Topic list renders efficiently for courses with 50+ topics

### Testing
- [ ] Component tests verify topics render in the correct order
- [ ] Component tests verify active topic highlighting
- [ ] Component tests verify clicking a topic updates the store
- [ ] Component tests verify the progress bar reflects completion state
