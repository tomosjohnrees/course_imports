# [0040] Final dark mode review and fixes

## Summary

A complete visual review of every surface and component in dark mode to catch any issues with colours, contrast, borders, or shadows that don't translate well from the light theme. Dark mode should feel intentional, not like an afterthought.

## Context

- **Phase:** Milestone 6 — Visual Polish
- **Depends on:** #0006, #0019, #0020, #0021, #0022, #0023, #0024, #0025, #0029
- **Blocks:** None

## What needs to happen

1. Review every screen and block type in dark mode
2. Check that all colour tokens switch correctly and produce appropriate contrast
3. Fix any surfaces that inherit light-mode colours or look washed out / invisible in dark mode
4. Verify code block syntax highlighting theme switches correctly
5. Verify callout block colours work in dark mode

## Acceptance criteria

### Functionality
- [x] All surfaces (sidebar, content area, home screen, settings panel) use dark mode tokens when active
- [x] Code block syntax highlighting uses the dark theme variant
- [x] Callout blocks (info, warning, tip) are legible and visually distinct in dark mode
- [x] Quiz blocks (default, correct, incorrect states) are visually clear in dark mode
- [x] Borders, dividers, and shadows are visible but not harsh in dark mode
- [x] The progress bar and completion indicators are visible in dark mode
- [x] No white flashes or light-mode surfaces appear during navigation in dark mode

### Security
- [x] Theme preference is stored locally only — not transmitted externally

### Performance
- [x] Theme switching is instantaneous with no visible repaint delay

### Testing
- [x] Visual snapshot tests capture every block type and screen in dark mode
- [x] Automated contrast checks pass for dark mode colour token pairs

## Notes

Test with the system set to dark mode and also with the manual dark mode toggle in settings.
