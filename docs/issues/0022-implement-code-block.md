# [0022] Implement code block with syntax highlighting

## Summary

Code blocks display source code with syntax highlighting and are a core part of the learning experience. This issue builds the `CodeBlock` component using `shiki` for syntax highlighting, with automatic light/dark theme switching, an optional filename label, and a copy-to-clipboard button.

## Context

- **Phase:** Milestone 4 — Code Block
- **Depends on:** #0020 (block renderer)
- **Blocks:** #0021 (text block uses CodeBlock for fenced code within markdown)

## What needs to happen

1. Install and configure `shiki` for syntax highlighting
2. A `CodeBlock` component that renders syntax-highlighted source code
3. Light and dark themes that switch automatically with the app's colour mode
4. An optional filename label displayed in the top-right of the block
5. A copy-to-clipboard button

## Acceptance criteria

### Functionality
- [x] `shiki` is installed and configured with a light theme (GitHub Light style) and a dark theme (warm dark style)
- [x] `CodeBlock` renders `block.content` with syntax highlighting based on `block.language`
- [x] The theme switches automatically when the app switches between light and dark mode
- [x] An optional `block.label` (filename) is displayed in the top-right corner of the code block
- [x] A copy-to-clipboard button copies the code content to the system clipboard
- [x] The copy button shows brief visual feedback (e.g. checkmark) after copying
- [x] The component handles missing or unrecognised languages gracefully (falls back to plain text)

### Security
- [x] Code content is rendered as text, never as executable HTML
- [x] The clipboard API is used safely — no arbitrary content injection

### Performance
- [x] Shiki highlighter is initialised once and reused across all code blocks, not re-created per block
- [x] Syntax highlighting does not block the UI — large code blocks render without freezing
- [x] Only the languages actually used in the course are loaded (or a reasonable default set)

### Testing
- [x] Component tests verify code is rendered with syntax highlighting
- [x] Component tests verify theme switching between light and dark
- [x] Component tests verify the copy button copies content to clipboard
- [x] Component tests verify the label is displayed when provided and hidden when absent
- [x] Component tests verify graceful fallback for unknown languages
