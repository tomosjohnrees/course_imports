# [0038] Design and implement empty and error state screens

## Summary

Every empty state and error state in the app should follow a consistent visual pattern: icon + heading + helpful message. This gives users clear guidance instead of blank screens or raw error text when something is missing or goes wrong.

## Context

- **Phase:** Milestone 6 — Visual Polish
- **Depends on:** #0005, #0019, #0020, #0030
- **Blocks:** None

## What needs to happen

1. Identify all empty states in the app (no courses loaded, no topics, empty topic, no recent courses)
2. Identify all error states (load failure, validation error, network error, offline)
3. Each state gets a dedicated visual treatment: relevant icon, concise heading, and a helpful message or action
4. Error messages use plain language — no technical jargon, error codes, or stack traces

## Acceptance criteria

### Functionality
- [x] The home screen with no recent courses shows an empty state with guidance on how to load a course
- [x] Course load failure shows an error state with the specific reason and a "Try again" action
- [x] The sidebar with zero topics shows an empty state
- [x] An empty topic (no blocks) shows an empty state in the content area
- [x] All empty states include an icon, a heading, and a descriptive message
- [x] All error states include an icon, a heading, a plain-language message, and a recovery action where possible

### Security
- [x] Error state messages never expose file system paths, API keys, or internal error details

### Performance
- [x] Empty and error state components are lightweight — no heavy dependencies or animations

### Testing
- [x] Component tests verify each empty state renders with icon, heading, and message
- [x] Component tests verify each error state renders with the expected message and recovery action

## Notes

Refer to `design_guide.md` for the empty state visual pattern. Use Lucide icons consistently.
