# [0037] Add ARIA attributes and screen reader support

## Summary

Icon-only buttons need accessible labels, and the quiz block flow must be comprehensible to screen reader users. This ensures the app is usable by people who rely on assistive technology.

## Context

- **Phase:** Milestone 6 — Accessibility
- **Depends on:** #0022, #0023, #0035
- **Blocks:** None

## What needs to happen

1. All icon-only buttons (copy, settings, theme toggle, etc.) have descriptive `aria-label` attributes
2. The quiz block announces question text, options, and feedback (correct/incorrect + explanation) to screen readers
3. Interactive components use appropriate ARIA roles where native semantics are insufficient
4. Live regions announce dynamic state changes (loading, errors, quiz feedback)

## Acceptance criteria

### Functionality
- [x] Every icon-only button has an `aria-label` that describes its action (e.g. "Copy code to clipboard")
- [x] Quiz options use radio group semantics (`role="radiogroup"` or native radio inputs)
- [x] Quiz feedback (correct/incorrect and explanation) is announced via an `aria-live` region
- [x] Loading and error states use `aria-live="polite"` to announce changes
- [x] The sidebar topic list uses `role="listbox"` or equivalent list semantics with `aria-current` on the active topic
- [x] The settings panel is announced as a dialog with appropriate `role` and `aria-label`

### Security
- [x] ARIA attributes do not expose internal state names, IDs, or implementation details

### Performance
- [x] ARIA attributes are static where possible, avoiding re-renders for accessibility markup

### Testing
- [x] Component tests verify `aria-label` presence on all icon-only buttons
- [x] Component tests verify quiz block screen reader flow: question → option selection → feedback announcement
- [x] Automated accessibility audit (e.g. axe-core) passes with no critical violations
