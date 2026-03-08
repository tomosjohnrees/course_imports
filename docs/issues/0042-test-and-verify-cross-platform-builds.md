# [0042] Test and verify cross-platform builds

## Summary

The distributable builds for macOS, Windows, and Linux must be tested to confirm the app installs, launches, and functions correctly on each platform. This is the final verification step before the app can be distributed.

## Context

- **Phase:** Milestone 6 — Packaging
- **Depends on:** #0041
- **Blocks:** None

## What needs to happen

1. Build the macOS `.dmg` and verify installation and launch
2. Build the Windows NSIS installer and verify installation and launch
3. Build the Linux `.AppImage` and verify launch
4. Confirm core functionality works in each packaged build (load a course, navigate topics, answer quizzes)
5. Verify the app icon displays correctly in the dock/taskbar/launcher on each platform

## Acceptance criteria

### Functionality
- [ ] macOS `.dmg` mounts, the app drags to Applications, and launches successfully
- [ ] macOS universal binary works on both Apple Silicon and Intel machines
- [ ] Windows NSIS installer completes installation and the app launches from Start Menu
- [ ] Linux `.AppImage` launches without additional dependencies
- [ ] Loading a local course folder works in each packaged build
- [ ] The app icon displays correctly in the dock (macOS), taskbar (Windows), and launcher (Linux)
- [ ] The app window title and About dialog show the correct app name and version

### Security
- [ ] The packaged app does not include source maps, `.env` files, or development assets
- [ ] macOS build is code-signed if a signing identity is available (or documented as a known limitation)

### Performance
- [ ] App startup time in the packaged build is under 3 seconds on a modern machine
- [ ] Installer file sizes are reasonable (under 150MB per platform)

### Testing
- [ ] A manual test checklist is completed for each platform covering: install, launch, load course, navigate, answer quiz, close and reopen
- [ ] Any platform-specific issues are documented as follow-up issues
