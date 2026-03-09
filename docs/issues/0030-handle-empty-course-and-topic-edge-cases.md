# [0030] Handle empty course and topic edge cases

## Summary

The app must handle degenerate course structures gracefully — courses with zero topics, topics with no blocks, and topics with no quiz blocks. Without this, users who load a malformed or minimal course will see blank screens or broken UI instead of helpful guidance.

## Context

- **Phase:** Milestone 6 — Edge Cases & Robustness
- **Depends on:** #0019, #0020, #0026
- **Blocks:** None

## What needs to happen

1. A course with zero topics shows a meaningful empty state in the content area and sidebar
2. A topic with no blocks shows an empty state message instead of a blank page
3. Topics with no quiz blocks are correctly treated as "complete on view" without errors in progress tracking
4. The sidebar and progress bar handle all three cases without crashing or showing NaN/undefined values

## Acceptance criteria

### Functionality
- [x] Loading a course with an empty `topicOrder` array displays an empty state in both the sidebar and content area
- [x] Navigating to a topic that has an empty `blocks` array displays an informative empty state message
- [x] Topics with no quiz blocks are marked as complete when first viewed, with no console errors
- [x] The progress bar correctly computes completion percentage when some or all topics have no quizzes
- [x] The progress bar shows 100% when a zero-topic course is loaded (no topics = nothing to complete)

### Security
- [x] No internal file paths, error stack traces, or system information are exposed in empty state messages

### Performance
- [x] Empty state rendering adds no extra re-renders or store subscriptions beyond what a normal topic view requires

### Testing
- [x] Unit tests cover progress calculation with zero topics, topics with no blocks, and topics with no quizzes
- [x] Component tests verify empty state UI renders for each scenario

## Notes

Refer to `design_guide.md` for empty state visual patterns (icon + heading + message).
