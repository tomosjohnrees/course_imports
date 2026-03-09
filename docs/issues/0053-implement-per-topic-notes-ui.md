# [0053] Implement per-topic notes UI

## Summary

Add a notes panel to the course view where users can write and edit freeform notes for the currently active topic. This gives learners a place to capture their thoughts without leaving the app, making the learning experience more active and personal.

## Context

- **Phase:** Backlog (Post-v1)
- **Depends on:** #0052 (notes persistence layer)
- **Blocks:** None

## What needs to happen

1. A notes panel or section is added to the course view, accessible per topic (e.g. a collapsible panel below the content, a slide-over, or a tab)
2. The panel contains a textarea for freeform text entry
3. Changes are saved automatically as the user types (using the debounced persistence from #0052)
4. When switching topics, the notes panel loads the note for the new active topic
5. A visual indicator in the sidebar shows which topics have notes

## Acceptance criteria

### Functionality
- [ ] Users can open a notes area for the current topic
- [ ] Users can type freeform text that is saved automatically
- [ ] Switching topics loads the correct note for the newly active topic
- [ ] The notes area clearly indicates when it is empty vs. has saved content
- [ ] Topics with notes show a subtle indicator in the sidebar (e.g. a small icon)
- [ ] Notes support basic text — no rich formatting required (plain textarea is sufficient)

### Security
- [ ] Note content is rendered as plain text in the textarea — no HTML or markdown is interpreted in the editing view to prevent self-XSS

### Performance
- [ ] Typing in the notes area does not cause lag or jank — saves are debounced, not on every keystroke
- [ ] Loading a note when switching topics does not block or delay the topic content render

### Testing
- [ ] Component tests cover: rendering empty state, displaying an existing note, typing and triggering save, switching topics loads correct note, sidebar indicator appears for topics with notes

## Notes

Keep the design minimal. A collapsible section at the bottom of the topic content or a small slide-over panel would both work. The key UX goal is low friction — users should be able to start typing immediately without multiple clicks.
