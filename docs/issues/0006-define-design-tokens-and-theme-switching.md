# [0006] Define design tokens and theme switching

## Summary

Establish the CSS custom properties (design tokens) that define the app's colour palette, spacing scale, and typography values. Set up automatic light/dark mode switching so that all tokens adapt to the user's OS preference. This is the visual foundation that every component references.

## Context

- **Phase:** Milestone 1 — Design Tokens
- **Depends on:** #0001
- **Blocks:** #0007

## What needs to happen

1. All CSS custom properties from the design guide are defined — colours, spacing scale, border radii, shadows, and typography sizes
2. A `:root` block defines light mode token values
3. A `@media (prefers-color-scheme: dark)` block overrides tokens for dark mode
4. Token naming is consistent and documented enough that other developers know which token to use

## Acceptance criteria

### Functionality
- [x] CSS custom properties exist for all colours defined in the design guide (backgrounds, text, accents, borders, semantic colours)
- [x] CSS custom properties exist for the spacing scale (e.g. `--space-1` through `--space-8` or equivalent)
- [x] CSS custom properties exist for typography sizes and the reading width constraint
- [x] Light mode tokens are applied by default
- [x] Dark mode tokens are applied automatically when `prefers-color-scheme: dark` matches
- [x] Switching the OS appearance preference toggles the app's colour scheme without a page reload

### Security
- [x] No user input influences token values — all tokens are static CSS definitions

### Performance
- [x] Tokens are defined in a single CSS file loaded once at app startup
- [x] Theme switching uses CSS media queries, not JavaScript, so it is instantaneous

### Testing
- [x] Visual verification that light mode renders with the correct colour palette
- [x] Visual verification that dark mode renders with the correct colour palette
- [x] All token names resolve (no `var()` references to undefined properties in the browser dev tools)

## Notes

- Refer to `docs/design_guide.md` for the exact colour values, spacing scale, and typography specifications.
- Components built in later issues will reference these tokens via `var(--token-name)` — the token names chosen here become the project's design API.
