# [0029] Implement settings panel

## Summary

Add a settings panel where users can change their theme, manage their GitHub personal access token, and clear all course progress. This is the UI surface for the preferences and progress persistence built in previous issues.

## Context

- **Phase:** Milestone 5 — Settings Panel
- **Depends on:** #0027, #0028
- **Blocks:** None

## What needs to happen

1. A settings panel UI (slide-over or modal) accessible from the app shell
2. Theme toggle allowing the user to switch between light, dark, and system modes
3. GitHub personal access token input field with masked display
4. A destructive "Clear all progress" action with a confirmation step
5. All changes are persisted immediately via the preferences and progress IPC handlers

## Acceptance criteria

### Functionality
- [x] Settings panel is accessible from a clearly visible trigger in the app shell (e.g. gear icon in sidebar)
- [x] Settings panel can be opened and closed without losing unsaved state elsewhere in the app
- [x] Theme toggle switches between light, dark, and system — the change is applied immediately and persisted
- [x] GitHub token input displays the token masked (e.g. dots or asterisks) with a show/hide toggle
- [x] Saving a GitHub token persists it and makes it available for subsequent GitHub API calls
- [x] Clearing the GitHub token field and saving removes it from storage
- [x] "Clear all progress" button shows a confirmation dialog before executing
- [x] After confirming "Clear all progress", all persisted progress for all courses is deleted and the current in-session progress is reset
- [x] The settings panel follows the design guide's visual language (spacing, typography, colours)

### Security
- [x] GitHub token is not visible in the DOM by default — only shown when the user explicitly toggles visibility
- [x] The confirmation step for "Clear all progress" cannot be bypassed (e.g. no keyboard shortcut that skips the dialog)
- [x] The settings panel does not expose any internal state or debug information

### Performance
- [x] Theme changes are applied without a full page reload or visible flicker
- [x] Opening and closing the settings panel does not cause the course content behind it to re-render or lose scroll position

### Testing
- [x] Component tests verify the theme toggle cycles through all three options and persists each
- [x] Component tests verify the GitHub token input masks by default and reveals on toggle
- [x] Component tests verify "Clear all progress" requires confirmation before executing
- [x] Component tests verify the panel opens and closes correctly

## Notes

- Keep the settings panel minimal — only the three controls listed above. Additional settings can be added in future milestones.
- The slide-over pattern (panel slides in from the right) tends to work well for settings in apps with a sidebar layout, but a centered modal is also acceptable.
