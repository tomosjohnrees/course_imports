# [0055] Implement block bookmarks UI and navigation

## Summary

Add the user-facing interface for bookmarking blocks and navigating to bookmarked content. Users should be able to toggle a bookmark on any block with a single click, see which blocks are bookmarked, and quickly jump to any bookmark from a central list.

## Context

- **Phase:** Backlog (Post-v1)
- **Depends on:** #0054 (bookmarks persistence layer)
- **Blocks:** None

## What needs to happen

1. Each content block gains a bookmark toggle — a subtle icon (e.g. a flag or bookmark icon) that appears on hover or focus, and stays visible when the block is bookmarked
2. Clicking the toggle adds or removes a bookmark for that block
3. A bookmarks panel (slide-over, sidebar section, or modal) lists all bookmarks for the current course, grouped by topic
4. Clicking a bookmark in the list navigates to the topic and scrolls to the bookmarked block

## Acceptance criteria

### Functionality
- [ ] Every content block displays a bookmark toggle on hover/focus
- [ ] Clicking the toggle on an unbookmarked block adds a bookmark (icon becomes filled/active)
- [ ] Clicking the toggle on a bookmarked block removes the bookmark
- [ ] A bookmarks panel lists all bookmarks for the current course, grouped by topic
- [ ] Each bookmark entry shows the topic name and a preview of the block content (e.g. first line of text, code language, quiz question)
- [ ] Clicking a bookmark navigates to the correct topic and scrolls to the block
- [ ] The bookmarks panel shows an empty state when there are no bookmarks

### Security
- [ ] Bookmark labels and preview text are rendered as plain text — no HTML interpretation

### Performance
- [ ] Rendering bookmark toggles on every block does not measurably impact scroll performance
- [ ] The bookmarks panel loads bookmarks from the store (already in memory) — no IPC call on open

### Testing
- [ ] Component tests cover: bookmark toggle appears on hover, toggling adds/removes bookmark, bookmarks panel lists bookmarks grouped by topic, clicking a bookmark triggers navigation, empty state renders correctly

## Notes

The bookmark toggle should be unobtrusive — it should not compete with the content for attention. A small icon that appears on the right edge of the block on hover is a good pattern. For the bookmarks panel, consider reusing the same slide-over pattern as the settings panel if one exists.
