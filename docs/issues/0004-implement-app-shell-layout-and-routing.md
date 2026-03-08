# [0004] Implement app shell layout with sidebar and routing

## Summary

Build the two-panel app shell (sidebar + main content area) and configure React Router with memory routing. This establishes the primary layout that every screen in the app lives inside and enables navigation between the home screen and the course view.

## Context

- **Phase:** Milestone 1 — UI Shell
- **Depends on:** #0003
- **Blocks:** #0005

## What needs to happen

1. `AppShell.tsx` renders a sidebar and a main content area side by side
2. `Sidebar.tsx` renders as a static placeholder panel (no data, no interactivity yet)
3. React Router is configured as a memory router with routes for `/` (Home) and `/course` (Course view)
4. Navigation between routes works and renders the correct page component in the content area

## Acceptance criteria

### Functionality
- [x] `AppShell.tsx` renders a two-panel layout — a fixed-width sidebar on the left and a flexible main content area on the right
- [x] `Sidebar.tsx` renders inside the sidebar panel with placeholder content (e.g. app name or "Topics" heading)
- [x] React Router is set up as a memory router (no URL bar dependency)
- [x] The `/` route renders the Home page component
- [x] The `/course` route renders the Course page component inside the app shell layout
- [x] The layout does not break or overflow on window resize

### Security
- [x] No user-supplied data is rendered in the shell at this stage (all content is static)

### Performance
- [x] The layout uses CSS for positioning (flexbox or grid) — no JavaScript-driven layout calculations
- [x] Route transitions are instantaneous with no visible loading delay

### Testing
- [x] Component tests verify that `AppShell` renders both the sidebar and main content areas
- [x] Component tests verify that navigating to `/` and `/course` renders the expected page components

## Notes

- The sidebar will be populated with real topic data in Milestone 4. For now it just needs to exist as a styled panel.
- The design guide specifies the sidebar width and styling — apply those if design tokens (#0006) are available, otherwise use reasonable defaults that can be updated later.
