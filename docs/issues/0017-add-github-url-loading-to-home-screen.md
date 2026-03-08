# [0017] Add GitHub URL input and loading flow to home screen

## Summary

Users need a way to load a course from GitHub by pasting a repository URL. This issue adds a URL input field and "Load from GitHub" button to the home screen, wires it to the `loadFromGitHub` IPC handler, and handles the loading state and error display — completing the GitHub loading user journey.

## Context

- **Phase:** Milestone 3 — Home Screen
- **Depends on:** #0016 (loadFromGitHub IPC handler), #0005 (home screen layout), #0013 (Zustand stores)
- **Blocks:** None

## What needs to happen

1. A GitHub URL input field and load button on the home screen
2. Client-side URL format validation before sending to the main process
3. Loading state with a "Fetching course from GitHub…" message while the course loads
4. On success, the course is stored and the app navigates to the course view
5. On failure, a specific error message is displayed (not found, rate limited, invalid structure, network error)

## Acceptance criteria

### Functionality
- [ ] Home screen has a text input for a GitHub repository URL
- [ ] "Load from GitHub" button triggers `window.api.course.loadFromGitHub(url)`
- [ ] URL format is validated client-side before making the IPC call — invalid URLs show an inline validation message
- [ ] Loading state is shown in the UI store while the course is being fetched
- [ ] A "Fetching course from GitHub…" message is visible during loading
- [ ] On success: course data is stored in course.store and the app navigates to `/course`
- [ ] On failure: a human-readable error message is displayed, distinguishing between not found, rate limited, invalid course, and network errors

### Security
- [ ] The URL input is sanitised before being passed to the IPC layer
- [ ] No raw error objects or stack traces are displayed to the user

### Performance
- [ ] The UI remains responsive during the GitHub fetch — no blocking of the renderer

### Testing
- [ ] Component tests verify the input field validates URL format
- [ ] Component tests verify loading state is shown during fetch
- [ ] Component tests verify error messages are displayed for different failure types
- [ ] Component tests verify successful load navigates to the course view
