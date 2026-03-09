# [0045] Humanise rate limit error message

## Summary

When GitHub's API rate limit is exceeded, the error message tells the user to "add a personal access token in Settings." For users like Sarah, who doesn't know what a personal access token is, this advice is unhelpful and confusing. The error should explain the situation in plain language, suggest waiting, and only mention the token option with enough context that a non-technical user could understand it.

## Context

- **Phase:** UX audit — Sarah Chen
- **Depends on:** #0016
- **Blocks:** None

## What needs to happen

1. The rate limit error message is rewritten in plain language, explaining that the course repository has been accessed too many times in a short period
2. The primary suggestion is to wait and try again later (with a rough timeframe if possible)
3. The token suggestion is rephrased as an optional advanced step with enough context for a non-technical user to understand what it means

## Acceptance criteria

### Functionality
- [x] The rate limit error message avoids the terms "API rate limit" and "personal access token" in the primary message
- [x] The message explains in plain language that too many requests have been made and the user should try again later
- [x] If a token suggestion is included, it is presented as a secondary, optional tip with a brief explanation of what a token is
- [x] The error message remains accurate and does not promise a specific wait time unless one is known

### Security
- [x] The rewritten message does not expose API response details, headers, or internal rate limit counters

### Performance
- [x] No additional API calls are made to check rate limit status — the message is derived from the existing error

### Testing
- [x] Unit tests verify the classified error message for rate-limit scenarios uses the updated plain-language wording
- [x] Component tests verify the error state renders the user-friendly message when a rate limit error is triggered

## Notes

The same "personal access token" language appears in `github.ts` line 94 and `course.handlers.ts` line 13. Both should be updated to match the new user-friendly phrasing.
