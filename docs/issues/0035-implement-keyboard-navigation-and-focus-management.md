# [0035] Implement keyboard navigation and focus management

## Summary

The app must be fully navigable via keyboard. Users should be able to move between topics, interact with quizzes, and navigate all interactive elements without a mouse. Visible focus indicators ensure keyboard users always know where they are.

## Context

- **Phase:** Milestone 6 — Keyboard Navigation
- **Depends on:** #0019, #0023, #0004
- **Blocks:** None

## What needs to happen

1. Arrow keys navigate between topics in the sidebar
2. Tab / Shift+Tab correctly cycles through all interactive elements (buttons, inputs, quiz options)
3. Enter submits answers in quiz blocks
4. All interactive elements display visible focus rings consistent with the design guide
5. Focus is managed sensibly on navigation (e.g. focus moves to content area when a topic is selected)

## Acceptance criteria

### Functionality
- [ ] Up/Down arrow keys move focus between topic items in the sidebar
- [ ] Pressing Enter on a focused sidebar topic navigates to it
- [ ] Tab / Shift+Tab cycles through interactive elements in document order without getting trapped
- [ ] Pressing Enter on a selected quiz option submits the answer
- [ ] Focus moves to the main content area when navigating to a new topic
- [ ] No focus traps exist anywhere in the app (modal/slide-over must support Escape to close)

### Security
- [ ] Keyboard shortcuts do not bypass any UI state restrictions (e.g. cannot submit a locked quiz via keyboard)

### Performance
- [ ] Focus management uses native DOM focus methods, not re-renders or state changes

### Testing
- [ ] Integration tests verify arrow key navigation through the sidebar
- [ ] Integration tests verify Tab order through a topic with interactive blocks
- [ ] Component tests verify focus ring visibility on all interactive element types

## Notes

Refer to `design_guide.md` for focus ring styling specifications.
