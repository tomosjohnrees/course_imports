# Cross-Platform Build Test Checklist

**App:** Course Imports v1.0.0
**Date:** 2026-03-09
**Build tool:** electron-builder 26.8.1
**Electron:** 40.8.0

---

## Automated verification results

These checks were performed programmatically against the Linux AppImage build.

| Check | Result |
|---|---|
| Build completes without errors | Pass |
| No `.map` files in app code (`out/`) | Pass |
| No `.env` files in distributable | Pass |
| No test files in distributable | Pass |
| ASAR packaging enabled | Pass |
| Electron fuses hardened (afterPack) | Pass |
| AppImage size under 150MB | Pass (122MB) |
| App metadata correct (name, version, appId) | Pass |

---

## Manual test checklist — macOS

### Installation
- [ ] `.dmg` mounts successfully
- [ ] App drags to Applications folder
- [ ] App launches from Applications
- [ ] App icon appears correctly in Dock
- [ ] Works on Apple Silicon (arm64)
- [ ] Works on Intel (x64)

### Functionality
- [ ] Load a course from a local folder
- [ ] Navigate between topics
- [ ] Answer a quiz question
- [ ] Close and reopen the app — state is preserved
- [ ] Window title shows "Course Imports"

### Security
- [ ] Gatekeeper does not block unsigned app (or code signing is applied)
- [ ] Hardened runtime is active (`codesign -d --verbose`)

---

## Manual test checklist — Windows

### Installation
- [ ] NSIS installer runs without errors
- [ ] User can change install directory
- [ ] App launches from Start Menu shortcut
- [ ] App icon appears correctly in taskbar

### Functionality
- [ ] Load a course from a local folder
- [ ] Navigate between topics
- [ ] Answer a quiz question
- [ ] Close and reopen the app — state is preserved
- [ ] Window title shows "Course Imports"

---

## Manual test checklist — Linux

### Installation
- [ ] `.AppImage` is executable (`chmod +x`)
- [ ] App launches without additional dependencies
- [ ] App icon appears in launcher/taskbar

### Functionality
- [ ] Load a course from a local folder
- [ ] Navigate between topics
- [ ] Answer a quiz question
- [ ] Close and reopen the app — state is preserved
- [ ] Window title shows "Course Imports"

---

## Performance

| Metric | Target | macOS | Windows | Linux |
|---|---|---|---|---|
| App startup time | < 3s | — | — | — |
| Installer size | < 150MB | — | — | 122MB |

---

## Known limitations

1. **macOS code signing:** No Apple Developer signing identity is configured. The app will trigger Gatekeeper warnings on first launch. Users must right-click → Open to bypass. This is a known limitation for unsigned builds and does not affect functionality.

2. **Cross-platform build verification:** macOS `.dmg` and Windows NSIS builds require their respective platforms to build and test. The Linux AppImage has been built and verified. macOS and Windows builds should be tested when CI/CD with platform runners is available.

3. **Node module source maps:** Some third-party dependencies (e.g., `ajv`) include their own `.map` files in `node_modules/`. These are library-level debug files, not application source maps, and do not expose application code.

---

## Platform-specific issues

No platform-specific issues were found during Linux verification. macOS and Windows testing is pending platform availability.
