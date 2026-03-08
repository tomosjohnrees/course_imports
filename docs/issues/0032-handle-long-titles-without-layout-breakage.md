# [0032] Handle long course and topic titles without layout breakage

## Summary

Very long course or topic titles can overflow the sidebar, header, or recent courses list, breaking the layout. All title display points must truncate or wrap gracefully to maintain a stable UI regardless of content length.

## Context

- **Phase:** Milestone 6 — Edge Cases & Robustness
- **Depends on:** #0004, #0019
- **Blocks:** None

## What needs to happen

1. The sidebar truncates long topic titles with ellipsis and shows the full title on hover (tooltip)
2. The course title in the sidebar header truncates gracefully
3. Recent course entries on the home screen truncate long course names and source paths
4. No horizontal scrollbars or layout shifts occur with titles up to 200 characters

## Acceptance criteria

### Functionality
- [ ] Topic titles in the sidebar truncate with ellipsis when they exceed the available width
- [ ] A tooltip shows the full topic title on hover for truncated items
- [ ] The course title in the sidebar header truncates with ellipsis if too long
- [ ] Recent course entries on the home screen handle long names without overflow
- [ ] No horizontal scrollbar appears anywhere in the app with titles up to 200 characters

### Security
- [ ] Title content is rendered as text, not HTML, to prevent injection via course metadata

### Performance
- [ ] Truncation is handled via CSS only (no JavaScript measurement or resize observers)

### Testing
- [ ] Component tests render sidebar and recent courses with 200-character titles and verify no overflow
- [ ] Visual snapshot tests capture truncation behaviour for sidebar and home screen
