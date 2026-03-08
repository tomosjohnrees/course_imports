# [0028] Implement preferences persistence via IPC

## Summary

Persist user preferences (theme choice, GitHub personal access token) to disk so they survive app restarts. Preferences are loaded on app start before the first render to prevent visual flashes (e.g. wrong theme appearing briefly).

## Context

- **Phase:** Milestone 5 — Preferences Persistence
- **Depends on:** #0009
- **Blocks:** #0029

## What needs to happen

1. IPC handlers for saving and retrieving user preferences via `electron-store`
2. Theme preference (light / dark / system) is persisted and applied on app start
3. Optional GitHub personal access token is persisted and used in GitHub API requests when present
4. Preferences are loaded before the renderer's first paint to avoid a flash of incorrect theme

## Acceptance criteria

### Functionality
- [ ] `store:getPreferences` IPC handler returns the current saved preferences object, with sensible defaults if none are saved yet
- [ ] `store:savePreferences` IPC handler writes the preferences object to `electron-store`
- [ ] Theme preference persists across app restarts — setting dark mode, quitting, and reopening shows dark mode immediately
- [ ] GitHub personal access token persists across app restarts and is included in GitHub API request headers when present
- [ ] Preferences are loaded and applied before the first render — no flash of wrong theme on startup

### Security
- [ ] GitHub personal access token is stored using `electron-store`'s encryption or is otherwise not stored in plaintext on disk
- [ ] The GitHub token is never logged, included in error messages, or exposed to the renderer except through the dedicated IPC channel
- [ ] IPC handlers validate preference values before saving (e.g. theme must be one of "light", "dark", "system")

### Performance
- [ ] Preferences are loaded synchronously or via a blocking preload step so the app does not render with incorrect defaults before switching

### Testing
- [ ] Unit tests for `store:getPreferences` and `store:savePreferences` covering save, retrieve, and default-values paths
- [ ] Test that invalid preference values are rejected or sanitised
- [ ] Test that GitHub token is not included in any serialised error output

## Notes

- The GitHub client (#0015) should be updated to read the token from preferences when making API calls. Coordinate with `course:loadFromGitHub` (#0016) to thread the token through.
- Consider using `electron-store`'s `encryptionKey` option for the token, or a separate encrypted store instance.
