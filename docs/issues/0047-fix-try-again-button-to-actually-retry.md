# [0047] Fix "Try again" button to actually retry the failed action

## Summary

When a course fails to load and the error state appears on the home screen, the "Try again" button only clears the error message — it does not retry the load. Sarah clicks "Try again" expecting the app to re-attempt fetching her course, but instead the error simply disappears and she has to manually re-enter or re-click everything. The button's label promises a retry that doesn't happen, which is confusing and frustrating.

## Context

- **Phase:** UX audit — Sarah Chen
- **Depends on:** #0038
- **Blocks:** None

## What needs to happen

1. The "Try again" button on the home screen error state actually retries the last failed load operation
2. The app remembers enough context about the failed operation (GitHub URL, recent course ID, or local folder path) to re-attempt it
3. If retry context is unavailable (e.g. local folder where the picker must reopen), the button is either relabelled to "Dismiss" or opens the appropriate action

## Acceptance criteria

### Functionality
- [x] Clicking "Try again" after a failed GitHub URL load retries the fetch with the same URL
- [x] Clicking "Try again" after a failed recent course load retries loading that recent course
- [x] Clicking "Try again" after a failed local folder load either retries from the same path or reopens the folder picker
- [x] During retry, the loading state is shown with the same progress indicators as the original attempt
- [x] If the retry also fails, the error state reappears with the new error message

### Security
- [x] Retry does not bypass token refresh or re-validation — it follows the same code path as the original load

### Performance
- [x] Retry triggers immediately on click — no additional debouncing or delay

### Testing
- [x] Component tests verify that "Try again" triggers a load function (not just error clearing)
- [x] Component tests verify the loading state appears during retry
- [x] Component tests verify that a second failure re-renders the error state
