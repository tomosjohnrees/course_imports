# [0031] Handle malformed content and missing file references in renderer

## Summary

When a topic's `content.json` is malformed or a `src` file referenced by a block doesn't exist, the renderer must display a clear inline error instead of crashing. This prevents a single broken block from taking down the entire topic view.

## Context

- **Phase:** Milestone 6 — Edge Cases & Robustness
- **Depends on:** #0011, #0020
- **Blocks:** None

## What needs to happen

1. The block renderer gracefully handles blocks with missing or unexpected data without crashing the React tree
2. Blocks that reference a missing `src` file render an inline error block showing which file was expected
3. Malformed `content.json` that passes initial parsing but contains invalid block shapes is handled at render time with a per-block error boundary
4. A React error boundary wraps the block rendering pipeline so a single broken block doesn't unmount the entire topic

## Acceptance criteria

### Functionality
- [x] A block with a missing `src` file renders an inline error message identifying the missing file path
- [x] A block with missing required fields (e.g. a quiz block with no `options`) renders an error block instead of crashing
- [x] A React error boundary around the block list catches render errors and shows a recovery message
- [x] Other valid blocks in the same topic continue to render normally when one block errors
- [x] The error block visually distinguishes itself from content blocks (e.g. warning styling)

### Security
- [x] Error messages display the relative file path only, never absolute system paths
- [x] No raw JavaScript error messages or stack traces are shown to the user

### Performance
- [x] Error boundaries do not add measurable overhead when no errors are present

### Testing
- [x] Component tests verify error block renders for missing `src`, missing fields, and thrown render errors
- [x] Component tests verify sibling blocks render normally alongside an error block
