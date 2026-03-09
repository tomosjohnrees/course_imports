# [0041] Configure electron-builder for distribution and create app icons

## Summary

The electron-builder configuration needs to be finalised with the correct app name, bundle ID, and platform-specific icons so that distributable installers can be built. App icons must be created for all three target platforms.

## Context

- **Phase:** Milestone 6 — Packaging
- **Depends on:** #0002
- **Blocks:** #0042

## What needs to happen

1. Finalise electron-builder configuration with app name, bundle ID, and description
2. Create app icons in the required formats: `.icns` (macOS), `.ico` (Windows), `.png` (Linux)
3. Configure installer types: `.dmg` for macOS, NSIS for Windows, `.AppImage` for Linux
4. Add an `npm run package` script to `package.json` that builds distributable installers

## Acceptance criteria

### Functionality
- [x] `electron-builder` config specifies app name, bundle ID (e.g. `com.courseimports.app`), and description
- [x] macOS icon (`.icns`) is present and configured in the builder config
- [x] Windows icon (`.ico`) is present and configured
- [x] Linux icon (`.png` at 512x512) is present and configured
- [x] macOS target is configured for `.dmg` with universal binary (arm64 + x64)
- [x] Windows target is configured for NSIS installer
- [x] Linux target is configured for `.AppImage`
- [x] `npm run package` script exists and triggers the electron-builder build

### Security
- [x] No development credentials, API keys, or local paths are included in the builder configuration
- [x] The `files` configuration excludes source maps, test files, and development-only assets from the distributable

### Performance
- [x] App icons are optimised (reasonable file size, correct dimensions for each format)

### Testing
- [x] Running `npm run package` completes without errors on the development machine
- [x] The generated installer metadata (name, version, icon) matches the configuration
