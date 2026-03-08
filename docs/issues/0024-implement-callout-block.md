# [0024] Implement callout block

## Summary

Callout blocks are visual callouts used to highlight tips, warnings, and informational notes within course content. This issue builds the `CalloutBlock` component with distinct styling for each variant (info, warning, tip), inline markdown rendering for the body, and matching Lucide icons.

## Context

- **Phase:** Milestone 4 — Callout Block
- **Depends on:** #0020 (block renderer)
- **Blocks:** None

## What needs to happen

1. A `CalloutBlock` component that renders `block.body` as inline markdown
2. Distinct visual styles for each `block.style` variant: `info` (blue), `warning` (amber), `tip` (green)
3. A matching Lucide icon for each variant

## Acceptance criteria

### Functionality
- [ ] `CalloutBlock` renders `block.body` as inline markdown (supporting bold, italic, inline code, links)
- [ ] The `info` variant renders with a blue colour scheme and an info icon
- [ ] The `warning` variant renders with an amber colour scheme and a warning icon
- [ ] The `tip` variant renders with a green colour scheme and a tip/lightbulb icon
- [ ] An unrecognised `block.style` value falls back to the `info` style rather than crashing
- [ ] Icons are sourced from the Lucide icon library

### Security
- [ ] Markdown body content is rendered safely — no raw HTML passthrough

### Performance
- [ ] Callout blocks render efficiently with no unnecessary re-renders

### Testing
- [ ] Component tests verify each variant renders with the correct colour scheme and icon
- [ ] Component tests verify markdown content within the body is rendered correctly
- [ ] Component tests verify the fallback style for unrecognised variants
