# [0046] Auto-select first topic on course load

## Summary

When a course finishes loading and the user lands on the course view, no topic is selected — the content area is completely blank. The sidebar shows topics but nothing is highlighted, and the main area renders nothing (`activeTopic` is null). For a self-directed learner like Sarah, this is disorienting — she expected the course to be ready to read immediately after loading. The app should automatically select the first topic (or the last-viewed topic if resuming).

## Context

- **Phase:** UX audit — Sarah Chen
- **Depends on:** #0013, #0019, #0027
- **Blocks:** None

## What needs to happen

1. After a course loads and progress is hydrated, the app selects an initial topic automatically
2. If the user has prior progress for this course, the app resumes at the last-viewed or first incomplete topic
3. If the user has no prior progress, the first topic is selected
4. The sidebar highlights the selected topic and the content area renders its blocks immediately

## Acceptance criteria

### Functionality
- [x] Loading a course for the first time automatically selects and displays the first topic
- [x] Loading a course with saved progress automatically selects the topic the user was last viewing, or the first incomplete topic
- [x] The sidebar highlights the auto-selected topic
- [x] The content area renders the selected topic's blocks without requiring a user click
- [x] If the course has no topics, the empty state still renders correctly

### Security
- [x] Auto-selection reads only from locally persisted progress data — no network requests

### Performance
- [x] Topic auto-selection happens synchronously after progress hydration — no visible delay or flicker

### Testing
- [x] Unit tests verify that after setCourse + hydrateProgress, the activeTopic is set to the expected topic
- [x] Component tests verify the course view renders content immediately after loading a course
- [x] Component tests verify that resuming a course with saved progress lands on the correct topic
