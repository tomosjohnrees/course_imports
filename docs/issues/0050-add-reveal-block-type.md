# [0050] Add reveal block type with collapsible UI

## Summary

Add a new `reveal` block type that renders as a collapsible section with a clickable header (e.g. "Show hint" or "Show answer"). This gives course authors a way to hide supplementary content behind an explicit user action, which is useful for hints, solutions, and optional deep-dives without cluttering the reading flow.

## Context

- **Phase:** Backlog (Post-v1)
- **Depends on:** None (all block rendering infrastructure is in place)
- **Blocks:** None

## What needs to happen

1. A `RevealBlock` type definition is added to the shared type system, with fields for `label` (the toggle text) and `body` (markdown content shown when expanded)
2. The course validator and parser recognise and handle `reveal` blocks
3. A `RevealBlock` component renders the collapsible UI — collapsed by default, expanding on click to show the body content
4. The `BlockRenderer` switch statement routes `reveal` blocks to the new component

## Acceptance criteria

### Functionality
- [ ] `reveal` blocks are parsed from `content.json` without errors
- [ ] The block renders with a clickable header showing the `label` text (or a sensible default like "Reveal" if no label is provided)
- [ ] Clicking the header expands the block to show the `body` content rendered as markdown
- [ ] Clicking again collapses the block
- [ ] The expand/collapse state is visual only — it does not affect course progress
- [ ] An appropriate chevron or arrow icon indicates the expanded/collapsed state

### Security
- [ ] The `body` markdown is rendered using the same sanitised markdown pipeline as other blocks — no raw HTML injection

### Performance
- [ ] Collapsed block body content is not rendered to the DOM until first expansion (lazy render), or is rendered but hidden efficiently

### Testing
- [ ] Component tests cover: initial collapsed state, expanding on click, collapsing on second click, rendering markdown body content, default label when none is provided

## Notes

The design should feel native alongside existing block types. Use the same vertical spacing, reading-width constraint, and typography conventions as `CalloutBlock`.
