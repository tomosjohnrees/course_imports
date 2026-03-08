# [0007] Set up typography and global base styles

## Summary

Install and configure the three typefaces used across the app (Geist for UI, Lora for reading content, Geist Mono for code) and establish the global CSS reset and base styles. This ensures every component starts from a consistent visual baseline.

## Context

- **Phase:** Milestone 1 — Design Tokens
- **Depends on:** #0006
- **Blocks:** None

## What needs to happen

1. Geist (sans-serif, UI text), Lora (serif, reading content), and Geist Mono (monospace, code) fonts are installed and loaded
2. A CSS reset normalises browser defaults across platforms
3. Global base styles are applied: body font, background colour, text colour, box-sizing, scrollbar styling
4. Font stacks reference the design tokens so they adapt to light/dark mode if needed

## Acceptance criteria

### Functionality
- [ ] Geist is loaded and applied as the default UI font (body, buttons, labels, sidebar)
- [ ] Lora is available for use in reading content components (applied by content components, not globally)
- [ ] Geist Mono is available for use in code blocks (applied by code components, not globally)
- [ ] A CSS reset is applied so elements render consistently across macOS, Windows, and Linux
- [ ] `box-sizing: border-box` is set globally
- [ ] Body background and text colours use the design tokens from #0006
- [ ] Scrollbar styling matches the design guide (subtle, not default OS chrome)

### Security
- [ ] Fonts are bundled with the app or loaded from local files — no external CDN requests at runtime

### Performance
- [ ] Fonts are loaded from local files, not fetched over the network, so there is no flash of unstyled text (FOUT)
- [ ] Only the font weights actually used in the design guide are included (no unnecessary weight variants)

### Testing
- [ ] Visual verification that the correct fonts render for UI text, reading content, and code
- [ ] Visual verification in both light and dark mode that base styles (background, text colour) are correct
- [ ] No console warnings about missing fonts or failed font loads

## Notes

- Geist and Geist Mono are available as npm packages (`geist`). Lora is available from Google Fonts as a variable font or can be self-hosted.
- The design guide specifies which font is used where — Geist for all chrome/UI, Lora for markdown/reading content, Geist Mono for code blocks.
