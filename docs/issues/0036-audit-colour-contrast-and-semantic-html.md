# [0036] Audit colour contrast and semantic HTML hierarchy

## Summary

All text and interactive elements must meet WCAG AA colour contrast requirements, and rendered markdown content must use correct semantic heading hierarchy. This ensures the app is usable for people with low vision and works well with assistive technologies.

## Context

- **Phase:** Milestone 6 — Accessibility
- **Depends on:** #0006, #0021, #0024
- **Blocks:** None

## What needs to happen

1. Every text/background colour combination in both light and dark modes is checked against WCAG AA (4.5:1 for normal text, 3:1 for large text)
2. Any failing combinations are adjusted in the design tokens
3. Markdown-rendered headings maintain a correct semantic hierarchy (no skipped levels within a topic)
4. Callout block text meets contrast requirements against coloured backgrounds

## Acceptance criteria

### Functionality
- [ ] All body text achieves at least 4.5:1 contrast ratio against its background in both themes
- [ ] All large text (headings, buttons) achieves at least 3:1 contrast ratio in both themes
- [ ] Callout block text meets contrast requirements against info (blue), warning (amber), and tip (green) backgrounds
- [ ] Muted/secondary text (captions, timestamps) meets at least 4.5:1 contrast ratio
- [ ] Markdown headings render with correct semantic hierarchy (`h1` > `h2` > `h3`, no skipped levels)

### Security
- [ ] No user-supplied content is rendered as raw HTML — markdown rendering uses safe defaults

### Performance
- [ ] Contrast fixes are CSS-only token changes with no runtime overhead

### Testing
- [ ] Automated contrast checks run against all colour token pairs and verify WCAG AA compliance
- [ ] Component tests verify rendered markdown headings use sequential heading levels

## Notes

Use a contrast checking tool (e.g. axe-core or manual calculation) to verify ratios systematically.
