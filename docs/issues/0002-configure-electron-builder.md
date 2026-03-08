# [0002] Configure electron-builder for cross-platform packaging

## Summary

Set up `electron-builder` so the app can be packaged into distributable installers for macOS, Windows, and Linux. This doesn't need to produce polished installers yet (icons and signing come later) — it just needs to produce a working build for each platform.

## Context

- **Phase:** Milestone 1 — Electron & Build Setup
- **Depends on:** #0001
- **Blocks:** None

## What needs to happen

1. `electron-builder` installed and configured with a config file (`electron-builder.config.ts` or equivalent)
2. Build targets defined for macOS (`.dmg`), Windows (NSIS), and Linux (`.AppImage`)
3. A `npm run package` script that runs the production build and packages it

## Acceptance criteria

### Functionality
- [ ] `npm run build` produces a production build without errors
- [ ] `npm run package` produces a distributable artifact for the current platform
- [ ] The config file defines targets for macOS, Windows, and Linux
- [ ] The packaged app launches and opens a window on the current platform

### Security
- [ ] No sensitive files (`.env`, tokens, dev configs) are included in the packaged output
- [ ] The `asar` archive is enabled (default) so source files are not trivially readable on disk

### Performance
- [ ] The packaged app size is reasonable for a minimal Electron app (under 200 MB uncompressed)

### Testing
- [ ] The package script completes without errors on the current development platform

## Notes

- App icons, signing, and notarisation are deferred to Milestone 6. Placeholder or default icons are fine for now.
- Universal binary (Intel + Apple Silicon) for macOS can be configured now but tested later.
