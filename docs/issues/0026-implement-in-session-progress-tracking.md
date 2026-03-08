# [0026] Implement in-session progress tracking

## Summary

Add progress tracking logic to the course store so the app knows which topics have been viewed, which are complete, and what the overall course completion percentage is. This is the foundation for showing meaningful progress indicators in the sidebar and progress bar, and for persisting progress across sessions later.

## Context

- **Phase:** Milestone 5 — Progress Tracking (In-session)
- **Depends on:** #0013, #0019
- **Blocks:** #0027

## What needs to happen

1. Progress state added to the course store — tracks which topics have been viewed, which quiz blocks have been answered, and derived completion status per topic
2. Topics are marked as "viewed" when navigated to for the first time
3. Topics are marked as "complete" when all their quiz blocks have been answered, or immediately on view if they contain no quiz blocks
4. Overall course completion percentage is derived from individual topic completion states
5. Sidebar indicators and progress bar reflect progress state in real time as the user navigates and answers quizzes

## Acceptance criteria

### Functionality
- [ ] Navigating to a topic for the first time marks it as "viewed" in the store
- [ ] A topic with quiz blocks is marked "complete" only when every quiz block in that topic has been answered
- [ ] A topic with no quiz blocks is marked "complete" as soon as it is viewed
- [ ] Overall course completion percentage is correctly derived (completed topics / total topics)
- [ ] Sidebar topic indicators update in real time to reflect "not started", "viewed", and "complete" states
- [ ] Progress bar at the top of the sidebar updates in real time as topics are completed
- [ ] Progress state survives in-session navigation (going back to a completed topic still shows it as complete)

### Security
- [ ] Progress state is scoped to the currently loaded course — no leakage between courses if the user loads a different course in the same session

### Performance
- [ ] Completion percentage derivation does not trigger unnecessary re-renders — use selectors or derived state to avoid recomputing on unrelated store changes

### Testing
- [ ] Unit tests cover topic viewed/complete state transitions for topics with and without quiz blocks
- [ ] Unit tests verify correct completion percentage calculation for edge cases (0 topics, all complete, none complete, mixed)
- [ ] Integration test verifies sidebar indicators update when progress state changes

## Notes

- The existing sidebar (from #0019) already renders visual indicators — this issue makes them dynamic based on actual progress state.
- Quiz answer recording happens in the quiz block component (#0023) — this issue needs to integrate with that by reacting to quiz answers in the store.
