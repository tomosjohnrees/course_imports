# [0034] Handle offline state for GitHub courses

## Summary

When the app is opened offline and the user tries to reload a GitHub-sourced course from the recent courses list, the app should show a clear offline message rather than failing silently or showing a cryptic network error.

## Context

- **Phase:** Milestone 6 — Edge Cases & Robustness
- **Depends on:** #0015, #0018
- **Blocks:** None

## What needs to happen

1. The app detects when the network is unavailable before attempting a GitHub fetch
2. Recent GitHub courses show an appropriate state when offline (e.g. greyed out with "Offline" badge)
3. Attempting to load a GitHub course while offline shows a specific, helpful error message
4. Local folder courses remain fully functional while offline

## Acceptance criteria

### Functionality
- [ ] Clicking a GitHub recent course while offline displays a clear "You're offline" error message
- [ ] The error message suggests the user check their connection and try again
- [ ] Entering a GitHub URL and clicking load while offline shows the same offline-specific error
- [ ] Local folder courses in the recent list load normally while offline
- [ ] If the network drops mid-fetch, the error message distinguishes this from a 404 or rate limit

### Security
- [ ] No cached GitHub API responses or tokens are exposed in offline error states

### Performance
- [ ] Network availability check is fast (no waiting for a timeout to detect offline state)

### Testing
- [ ] Unit tests verify the GitHub client returns a specific offline error type
- [ ] Component tests verify the offline error UI renders with the correct messaging
