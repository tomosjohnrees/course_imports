# [0021] Implement text block with markdown rendering

## Summary

Text blocks are the primary content type in courses — they contain markdown that needs to be rendered as rich formatted text. This issue builds the `TextBlock` component using `react-markdown` with GFM support, styles all markdown elements to match the design guide, and wires fenced code blocks to the `CodeBlock` component for syntax highlighting.

## Context

- **Phase:** Milestone 4 — Text Block
- **Depends on:** #0020 (block renderer), #0022 (code block — for fenced code rendering within markdown)
- **Blocks:** None

## What needs to happen

1. Install and configure `react-markdown` with `remark-gfm` for GitHub Flavored Markdown support
2. A `TextBlock` component that renders the block's markdown content string
3. All markdown elements styled according to the design guide — Lora serif font, `--reading-width` constraint, properly styled headings, lists, tables, blockquotes, etc.
4. Fenced code blocks within markdown content delegate to the `CodeBlock` component

## Acceptance criteria

### Functionality
- [ ] `react-markdown` with `remark-gfm` is installed and configured
- [ ] `TextBlock` renders `block.content` as formatted markdown
- [ ] Rendered content uses the Lora serif font and is constrained to `--reading-width`
- [ ] All markdown elements are styled: headings (h1–h6), paragraphs, ordered and unordered lists, blockquotes, tables, horizontal rules, inline code, bold, italic, links
- [ ] Fenced code blocks within markdown are rendered via the `CodeBlock` component with syntax highlighting
- [ ] Links open in the system default browser, not inside the Electron app

### Security
- [ ] HTML in markdown is not rendered raw — `react-markdown` does not allow arbitrary HTML injection by default; this must not be overridden
- [ ] Links are rendered with `rel="noopener noreferrer"` and `target="_blank"`

### Performance
- [ ] Markdown parsing does not block the UI for large text blocks (content is rendered efficiently)
- [ ] The component does not re-parse markdown on every render unless `block.content` changes

### Testing
- [ ] Component tests verify markdown renders correctly for key element types (headings, lists, code, tables)
- [ ] Component tests verify fenced code blocks delegate to CodeBlock
- [ ] Component tests verify links have correct security attributes

## Notes

`react-markdown` handles sanitisation by default — it does not render raw HTML. This is the desired behaviour. Do not add `rehype-raw` or similar plugins that would enable HTML passthrough.
