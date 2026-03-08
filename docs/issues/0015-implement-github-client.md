# [0015] Implement GitHub client for fetching course files

## Summary

The app needs to load courses hosted on GitHub. This issue builds the GitHub client module that can parse a repo URL, fetch individual files and directory listings via the GitHub Contents API, and orchestrate fetching an entire course's file tree. This is the data-fetching foundation that the GitHub loading IPC handler will use.

## Context

- **Phase:** Milestone 3 — GitHub Client
- **Depends on:** #0008 (course type definitions)
- **Blocks:** #0016 (loadFromGitHub IPC handler)

## What needs to happen

1. A URL parser that extracts `{ owner, repo }` from GitHub repository URLs in common formats
2. A `fetchFile` function that retrieves and decodes a single file via the GitHub Contents API
3. A `fetchDirectory` function that lists directory contents via the GitHub Contents API
4. A `fetchCourse` function that orchestrates fetching all course files (course.json, topic directories, content files, and src-referenced files) with parallel fetching where possible
5. Structured error handling for rate limits (403), not found (404), and network offline scenarios

## Acceptance criteria

### Functionality
- [x] Parses `https://github.com/owner/repo`, `github.com/owner/repo`, and trailing-slash variants into `{ owner, repo }`
- [x] Returns a clear error for URLs that don't match expected GitHub formats
- [x] `fetchFile` fetches a file via the Contents API and decodes its base64 content
- [x] `fetchDirectory` returns the list of entries in a directory
- [x] `fetchCourse` fetches course.json, discovers topics, fetches each topic's content.json, and fetches all src-referenced files
- [x] Files within a topic are fetched in parallel to reduce total load time
- [x] An optional auth token can be passed to include in request headers

### Security
- [x] GitHub personal access token is passed via Authorization header, never included in URLs or logged
- [x] No user-supplied input is interpolated into URLs without sanitisation

### Performance
- [x] Src-referenced files within each topic are fetched concurrently rather than sequentially
- [x] Fetched data is not unnecessarily duplicated in memory

### Testing
- [x] Unit tests cover URL parsing with valid and invalid inputs
- [x] Unit tests cover error handling for 403, 404, and network failure scenarios
- [x] Integration-style tests verify fetchCourse assembles a correct course structure from mock responses

## Notes

The GitHub Contents API returns file content as base64-encoded strings. For image files, the content can be kept as a data URI for the renderer. The API has a 60 requests/hour limit for unauthenticated requests and 5,000/hour for authenticated requests — the rate limit error handling is important for a good user experience.
