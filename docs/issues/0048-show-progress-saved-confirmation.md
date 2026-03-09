# [0048] Show visual confirmation that progress is saved

## Summary

Sarah's key concern is that she might lose progress when she closes and reopens the app. The app does persist progress automatically via a debounced write, but there is no visual indication that this has happened. Sarah has no way to know her progress is safe. A subtle, non-intrusive confirmation (e.g. a brief "Progress saved" indicator in the sidebar) would give her confidence to close the app without anxiety.

## Context

- **Phase:** UX audit — Sarah Chen
- **Depends on:** #0027
- **Blocks:** None

## What needs to happen

1. After progress is successfully persisted to disk, a brief visual confirmation appears in the UI
2. The indicator is subtle and non-disruptive — it should not interrupt reading flow or require dismissal
3. The indicator is positioned near the progress bar in the sidebar, where Sarah naturally looks for progress information

## Acceptance criteria

### Functionality
- [ ] A visual indicator (e.g. small text, icon, or subtle animation near the progress bar) confirms when progress has been saved
- [ ] The indicator appears after the debounced write completes successfully, not on every topic click
- [ ] The indicator fades or disappears automatically after a short duration (2-3 seconds)
- [ ] The indicator does not appear on the initial progress hydration (only on new saves)

### Security
- [ ] The save confirmation does not expose any internal file paths or storage details

### Performance
- [ ] The confirmation is rendered with CSS transitions only — no JavaScript animation libraries
- [ ] The save confirmation does not add additional IPC round trips — it hooks into the existing save callback

### Testing
- [ ] Component tests verify the save indicator appears after a progress persistence event
- [ ] Component tests verify the indicator disappears after the specified timeout
- [ ] Component tests verify the indicator does not appear on initial hydration
