# [0033] Show progress indicator for large GitHub course fetches

## Summary

Loading a large course from GitHub (many topics, many files) can take a noticeable amount of time. The app should show incremental progress feedback so the user knows the fetch is working, rather than displaying a static spinner for an indeterminate duration.

## Context

- **Phase:** Milestone 6 — Edge Cases & Robustness
- **Depends on:** #0015, #0016, #0017
- **Blocks:** None

## What needs to happen

1. The GitHub fetch pipeline reports progress as it downloads files (e.g. "Fetching topic 3 of 12…")
2. The home screen loading state displays this progress information
3. Progress updates are sent from the main process to the renderer via IPC as the fetch proceeds

## Acceptance criteria

### Functionality
- [ ] The loading UI shows which topic is currently being fetched and the total count (e.g. "Loading topic 3 of 12")
- [ ] Progress updates appear in real time as each topic completes fetching
- [ ] The loading state falls back to a generic "Fetching course from GitHub…" if progress events are unavailable
- [ ] Cancelling or navigating away during a fetch does not cause errors

### Security
- [ ] Progress messages do not expose GitHub API tokens or internal API URLs

### Performance
- [ ] Progress IPC messages are lightweight (topic index and total only, no payload data)
- [ ] File fetches within a topic remain parallelised — progress reporting does not serialise requests

### Testing
- [ ] Unit tests verify the GitHub client emits progress events at the correct points
- [ ] Component tests verify the loading UI updates in response to progress events
