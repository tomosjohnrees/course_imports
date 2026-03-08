# [0016] Implement loadFromGitHub IPC handler

## Summary

This issue wires the GitHub client into the IPC layer so the renderer process can trigger a GitHub course load. The handler calls the GitHub client to fetch files, runs them through the existing validator and parser, and returns a structured result — reusing the same validation and parsing pipeline as local folder loading.

## Context

- **Phase:** Milestone 3 — IPC Handler
- **Depends on:** #0015 (GitHub client), #0012 (course loader and IPC handler structure)
- **Blocks:** #0017 (home screen GitHub loading UI)

## What needs to happen

1. A `course:loadFromGitHub` IPC handler that accepts a GitHub URL and optional auth token
2. The handler fetches course data via the GitHub client, validates it, parses it, and returns a typed result
3. The handler reads the GitHub personal access token from `electron-store` preferences if no token is passed explicitly

## Acceptance criteria

### Functionality
- [x] `course:loadFromGitHub` IPC handler is registered and callable from the renderer
- [x] Handler calls the GitHub client, then runs the fetched data through the validator and parser
- [x] Returns `{ success: true, course }` on success
- [x] Returns `{ success: false, error }` with a descriptive message on failure
- [x] Error messages distinguish between rate limiting, repo not found, invalid course structure, and network errors
- [x] Uses stored GitHub personal access token from preferences if available

### Security
- [x] The GitHub personal access token is read from electron-store, not passed from the renderer in plain text over IPC
- [x] Error messages do not leak the auth token or internal file paths

### Performance
- [x] The handler does not block the main process event loop — file fetching is async throughout

### Testing
- [x] Tests verify the handler returns success for a valid mock course
- [x] Tests verify the handler returns appropriate error types for each failure scenario
- [x] Tests verify the stored auth token is included in requests when present

## Notes

The validator and parser were built for local file data in Milestone 2. They may need minor adaptation to accept in-memory data (from GitHub fetches) rather than reading from disk. Keep changes minimal — the goal is to reuse the existing pipeline, not rewrite it.
