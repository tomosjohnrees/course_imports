# [0005] Implement home screen with placeholder load actions

## Summary

Build the home screen that users see when no course is loaded. It contains a "Load from GitHub" area and an "Open Local Folder" button — neither functional yet, just the layout and visual design. This is the first screen users interact with and sets the visual tone for the app.

## Context

- **Phase:** Milestone 1 — UI Shell
- **Depends on:** #0004
- **Blocks:** None

## What needs to happen

1. `Home.tsx` renders a centred layout with a clear visual hierarchy
2. A "Load from GitHub" section with a URL input field and a submit button (no wiring yet)
3. An "Open Local Folder" button that uses the native file picker style (no wiring yet)
4. The screen is styled according to the design guide and looks correct in both light and dark mode

## Acceptance criteria

### Functionality
- [ ] `Home.tsx` renders at the `/` route
- [ ] The screen displays a "Load from GitHub" input field and button
- [ ] The screen displays an "Open Local Folder" button
- [ ] Both buttons are visible and styled but have no click handlers (or handlers that do nothing)
- [ ] The layout is centred and visually balanced on typical window sizes

### Security
- [ ] No IPC calls are made from this screen yet — buttons are inert
- [ ] The GitHub URL input does not submit or send data anywhere

### Performance
- [ ] The home screen renders immediately with no loading state or delay

### Testing
- [ ] Component tests verify that both load actions (GitHub input + local folder button) are rendered
- [ ] Component tests verify the screen renders without errors

## Notes

- Button wiring happens in Milestone 2 (local) and Milestone 3 (GitHub). This issue is purely layout and styling.
- The recent courses list (shown below the load inputs) is also deferred to Milestone 3.
- Refer to `docs/design_guide.md` for the home screen layout specifications.
