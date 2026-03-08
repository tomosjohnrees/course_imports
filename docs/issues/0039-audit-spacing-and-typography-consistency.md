# [0039] Audit spacing and typography consistency

## Summary

Every surface in the app should adhere to the 8pt spacing grid and the typography rules defined in the design guide: Lora for reading content, Geist for UI chrome, Geist Mono for code. This audit catches inconsistencies that crept in during feature development.

## Context

- **Phase:** Milestone 6 — Visual Polish
- **Depends on:** #0006, #0007, #0021, #0022, #0024, #0025
- **Blocks:** None

## What needs to happen

1. Audit all spacing values (margins, padding, gaps) against the 8pt grid
2. Audit all font-family usage — Lora for content, Geist for UI, Geist Mono for code
3. Fix any deviations found
4. Verify consistency across all block types, sidebar, home screen, and settings panel

## Acceptance criteria

### Functionality
- [ ] All spacing values (margins, padding, gaps) are multiples of 8px or use the defined spacing tokens
- [ ] All reading content (text blocks, callout bodies, quiz text) uses Lora
- [ ] All UI chrome (sidebar, buttons, labels, navigation) uses Geist
- [ ] All code blocks and inline code use Geist Mono
- [ ] Font sizes match the type scale defined in the design guide
- [ ] Vertical rhythm between blocks is consistent and uses the defined block spacing token

### Security
- [ ] No external font loading from CDNs — all fonts are bundled locally

### Performance
- [ ] Fonts are loaded with `font-display: swap` to prevent invisible text during load

### Testing
- [ ] Visual snapshot tests capture the corrected spacing and typography for key screens
- [ ] A manual review checklist confirms each screen matches the design guide

## Notes

Refer to `design_guide.md` for the complete type scale and spacing tokens.
