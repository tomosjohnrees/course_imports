# Design Guide

## Philosophy

The app should feel like a well-designed tool — calm, focused, and out of the way. When someone opens it, the learning content is the hero, not the interface. Every design decision should reduce cognitive load, not add to it.

The closest references are **Notion** for its editorial calm and **Linear** for its precision and density. But where those tools are productivity-focused, this app is *reading and learning* focused — so it leans slightly warmer, with a stronger emphasis on typography and readability over data density.

**Three words to design towards:** Calm. Confident. Clear.

---

## Colour Palette

The palette uses a near-neutral base with a single intentional accent. Light and dark modes are both first-class.

### Light Mode

| Role | Token | Value |
|---|---|---|
| Background | `--color-bg` | `#F9F8F6` |
| Surface (cards, panels) | `--color-surface` | `#FFFFFF` |
| Border | `--color-border` | `#E8E6E1` |
| Text primary | `--color-text-primary` | `#1A1916` |
| Text secondary | `--color-text-secondary` | `#6B6860` |
| Text muted | `--color-text-muted` | `#A8A49D` |
| Accent | `--color-accent` | `#2563EB` |
| Accent hover | `--color-accent-hover` | `#1D4ED8` |
| Accent subtle (bg tint) | `--color-accent-subtle` | `#EFF6FF` |
| Success | `--color-success` | `#16A34A` |
| Success subtle | `--color-success-subtle` | `#F0FDF4` |
| Warning | `--color-warning` | `#D97706` |
| Warning subtle | `--color-warning-subtle` | `#FFFBEB` |
| Tip | `--color-tip` | `#16A34A` |
| Tip subtle | `--color-tip-subtle` | `#F0FDF4` |
| Destructive | `--color-destructive` | `#DC2626` |

### Dark Mode

| Role | Token | Value |
|---|---|---|
| Background | `--color-bg` | `#141412` |
| Surface (cards, panels) | `--color-surface` | `#1C1B19` |
| Border | `--color-border` | `#2A2926` |
| Text primary | `--color-text-primary` | `#F0EEE9` |
| Text secondary | `--color-text-secondary` | `#8C897F` |
| Text muted | `--color-text-muted` | `#5A5750` |
| Accent | `--color-accent` | `#3B82F6` |
| Accent hover | `--color-accent-hover` | `#60A5FA` |
| Accent subtle (bg tint) | `--color-accent-subtle` | `#172554` |
| Success | `--color-success` | `#22C55E` |
| Success subtle | `--color-success-subtle` | `#052E16` |
| Warning | `--color-warning` | `#FBBF24` |
| Warning subtle | `--color-warning-subtle` | `#2D1B00` |
| Tip | `--color-tip` | `#22C55E` |
| Tip subtle | `--color-tip-subtle` | `#052E16` |
| Destructive | `--color-destructive` | `#F87171` |

### Usage Notes

- The background (`#F9F8F6` / `#141412`) has a very faint warm tint — not pure white or pure black. This reduces eye strain and prevents the interface from feeling clinical.
- The accent blue is used sparingly: active states, primary CTAs, links, and progress indicators only. It should never appear as a background for large areas.
- Avoid adding additional accent colours. If a new semantic colour is needed, it should be a new success/warning/destructive variant, not a new hue.

---

## Typography

Typography is the most important design element in a reading and learning app. It must be beautiful, highly readable, and consistent.

### Typefaces

| Role | Typeface | Fallback |
|---|---|---|
| UI / Interface | `"Geist"` | `system-ui, sans-serif` |
| Body / Reading content | `"Lora"` | `Georgia, serif` |
| Code | `"Geist Mono"` | `"Fira Code", monospace` |

**Rationale:**
- **Geist** (by Vercel) is used for all UI chrome — navigation, labels, buttons, headings in the shell. It is clean, neutral, and precise without being impersonal.
- **Lora** is a well-crafted serif used for the actual learning content — text blocks, explanations, and narrative prose. Reading extended learning content in a serif is easier on the eyes and gives the content an authoritative, considered feel.
- **Geist Mono** for all code blocks, file paths, and inline code.

### Scale

```
--text-xs:    11px  / line-height 1.4  — labels, captions, timestamps
--text-sm:    13px  / line-height 1.5  — secondary UI text, metadata
--text-base:  15px  / line-height 1.6  — primary UI text, navigation items
--text-md:    16px  / line-height 1.7  — body reading content
--text-lg:    19px  / line-height 1.6  — section headings in content
--text-xl:    24px  / line-height 1.3  — page/topic titles
--text-2xl:   30px  / line-height 1.2  — course title (hero)
```

### Weight

- `400` — body copy, reading content
- `500` — UI labels, navigation items
- `600` — headings, active states, emphasis
- `700` — used very sparingly; course titles only

### Reading Width

All content blocks must be constrained to a maximum reading width. This is critical for readability.

```
--reading-width: 68ch
```

Never allow reading content to stretch full-width, even on large monitors. This applies to all block types — text, code, quiz, callout, and image alike.

---

## Spacing & Layout

The app uses an **8pt grid**. All spacing values are multiples of 4 or 8.

```
--space-1:   4px
--space-2:   8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
```

### App Shell Layout

The app uses a two-panel layout at its core:

```
┌─────────────────────────────────────────────────────┐
│  Title bar (native desktop, 32px)                   │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│   Sidebar    │   Main Content Area                  │
│   240px      │   flex-1                             │
│              │                                      │
│  - Course    │   Topic blocks render here           │
│    info      │   as a scrollable vertical list      │
│  - Topic     │                                      │
│    list      │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

- The sidebar is **fixed width at 240px** and does not resize.
- The main content area scrolls independently.
- On the loading/home screen, there is no sidebar — the layout is centred and single-column.

### Sidebar

- Background: `--color-surface`
- Right border: `1px solid var(--color-border)`
- Topic list items: `height: 36px`, `padding: 0 var(--space-4)`
- Active topic: `background: var(--color-accent-subtle)`, `color: var(--color-accent)`, left border accent `3px solid var(--color-accent)`
- Hover: subtle background shift, no animation

### Content Area

- Padding: `var(--space-10) var(--space-8)` on desktop
- All blocks constrained to `--reading-width` and centred within the area
- Blocks are separated by `--space-8` (32px) of vertical space
- No tab bar — topics are a single scrollable page

---

## Components

### Buttons

Three variants only:

**Primary** — used for the single most important action on a screen (e.g. "Load course")
```
background: var(--color-accent)
color: white
padding: 8px 16px
border-radius: 6px
font-size: var(--text-base)
font-weight: 500
```

**Secondary** — secondary actions
```
background: transparent
border: 1px solid var(--color-border)
color: var(--color-text-primary)
padding: 8px 16px
border-radius: 6px
```

**Ghost** — low-emphasis actions, used inline
```
background: transparent
color: var(--color-text-secondary)
padding: 6px 10px
border-radius: 6px
no border
```

Hover states should be subtle — a slight background tint, not a colour shift. Never use shadows on buttons.

### Input Fields

```
background: var(--color-bg)
border: 1px solid var(--color-border)
border-radius: 6px
padding: 8px 12px
font-size: var(--text-base)
color: var(--color-text-primary)

focus:
  border-color: var(--color-accent)
  outline: none
  box-shadow: 0 0 0 3px var(--color-accent-subtle)
```

### Cards

Used for course selection on the home screen and recent courses list.

```
background: var(--color-surface)
border: 1px solid var(--color-border)
border-radius: 8px
padding: var(--space-5)
```

No drop shadows. Borders and background contrast provide hierarchy instead. On hover, the border colour shifts to `--color-text-muted`.

### Code Blocks

Code blocks appear as standalone `code` blocks and within `text` block markdown content.

```
background: var(--color-bg)       ← slightly recessed from surface
border: 1px solid var(--color-border)
border-radius: 6px
padding: var(--space-4) var(--space-5)
font-family: var(--font-mono)
font-size: 13px
line-height: 1.6
overflow-x: auto
```

A language label is shown in the top-right corner in `--text-xs`, `--color-text-muted`. A copy button (Lucide `Copy` icon, 16px) appears in the top-right on hover.

Use a syntax highlighting theme that matches the app's palette. In light mode: a muted, low-contrast theme (similar to GitHub Light). In dark mode: a warm-toned dark theme (similar to One Dark but less saturated). Avoid themes with neon or oversaturated colours.

### Callout Blocks

Callout blocks draw attention to supplementary information inline within the content flow. Three style variants:

```
border-radius: 6px
padding: var(--space-4) var(--space-5)
border-left: 3px solid <variant-colour>
font-family: var(--font-serif)   ← matches body reading content
font-size: var(--text-md)
```

| Variant | Left border | Background | Icon (Lucide) |
|---|---|---|---|
| `info` | `--color-accent` | `--color-accent-subtle` | `Info` |
| `warning` | `--color-warning` | `--color-warning-subtle` | `AlertTriangle` |
| `tip` | `--color-tip` | `--color-tip-subtle` | `Lightbulb` |

The icon sits to the left of the content, 16px, aligned to the first line of text. Body text in the callout renders as inline markdown (bold, italic, inline code are all valid).

### Image Blocks

```
max-width: 100%      ← never overflows reading width
border-radius: 6px
display: block
margin: 0 auto       ← centred within reading width
```

Optional caption below the image:
```
font-size: var(--text-sm)
color: var(--color-text-muted)
text-align: center
margin-top: var(--space-2)
font-family: var(--font-sans)
```

### Quiz Blocks

Quiz blocks appear inline within the content flow, not in a separate pane. Each block presents a single question.

```
border: 1px solid var(--color-border)
border-radius: 8px
padding: var(--space-5) var(--space-6)
background: var(--color-surface)
```

Question text: `--font-serif`, `--text-md`, `--color-text-primary`, `font-weight: 600`

Multiple choice option rows:
```
border: 1px solid var(--color-border)
border-radius: 6px
padding: 12px 16px
cursor: pointer
width: 100%
text-align: left

hover:    border-color: var(--color-accent), background: var(--color-accent-subtle)
correct:  border-color: var(--color-success), background: var(--color-success-subtle)
incorrect: border-color: var(--color-destructive), background: slightly tinted
```

After answering, the options lock (no further interaction). Explanation text appears below in `--color-text-secondary`, `--font-serif`, `--text-sm`.

Free-text questions render a `<textarea>` using the input field spec, with a "Submit" primary button below it. After submitting, the sample answer is revealed.

### Progress Indicators

Topic completion is shown in the sidebar with a small indicator:

- **Not started** — no indicator
- **Complete** — small checkmark icon, `--color-success`

A course-level progress bar sits at the top of the sidebar: 4px height, accent colour fill, no animation on render.

---

## Iconography

Use a single icon set throughout: **Lucide** (the standard for clean, minimal interfaces). Do not mix icon sets.

- Size in navigation/sidebar: `16px`
- Size in content/buttons: `16px`
- Size in empty states: `32px`
- Stroke width: `1.5px`
- Colour: inherit from text colour unless indicating a specific status

---

## Motion & Animation

The app should feel **immediate and responsive**, not animated for animation's sake.

- **No page transition animations** — switching topics should be instant
- **No loading spinners** where avoidable — prefer skeleton states
- **Allowed transitions:**
  - Quiz answer feedback: `150ms ease-out` colour/border change on option rows
  - Sidebar hover states: `100ms`
  - Modal/overlay appearance: `150ms ease-out` fade + slight upward translate (`translateY(4px) → translateY(0)`)
  - Accordion/collapsible: `200ms ease-in-out` height
- **Never** animate layout shifts, font sizes, or anything that causes reflow

The guiding rule: if removing the animation makes the app feel broken or abrupt, keep it. If removing it makes no difference, remove it.

---

## Empty States & Onboarding

The home/load screen is the first thing a user sees when no course is loaded. It should feel welcoming without being patronising.

- Centred layout, generous vertical padding
- App name/logo at top
- A short one-line description of what the app does
- Two clearly labelled options: "Load from GitHub" and "Open local folder"
- Below, an optional "Recently loaded" section if courses have been loaded before

Avoid illustration-heavy onboarding. A simple icon, clean text, and two buttons is sufficient.

---

## Writing Style (UI Copy)

The language in the interface should match the visual design: calm, clear, and not over-explained.

- Use sentence case for all labels and headings (not Title Case)
- Button labels should be verbs: "Load course", "Open folder", "Submit answer"
- Error messages should say what happened and what to do: "Couldn't load this repo. Check the URL and try again."
- Avoid exclamation marks, emoji in UI chrome, and motivational language ("Great job! 🎉")
- Progress language: "3 of 8 topics complete" not "You're 37.5% there!"

---

## Accessibility

- Minimum contrast ratio: **4.5:1** for body text, **3:1** for large text and UI components
- All interactive elements must have a visible focus state (the `box-shadow` focus ring defined in the input spec applies to all focusable elements)
- Font size must never go below `11px`
- Sidebar and main content must be navigable by keyboard
- Dark/light mode should follow the OS preference by default, with a manual override in settings

---

## What to Avoid

- Drop shadows on anything except modals/overlays (use borders instead)
- Gradient backgrounds or gradient text
- More than two typefaces in use at once
- Rounded corners larger than `8px` on cards, `6px` on inputs/buttons
- Full-bleed images or decorative illustrations in the app shell
- Colour used purely decoratively (every use of colour should carry meaning)
- Animations exceeding `300ms`
- Any UI pattern that requires a tooltip to understand

---

## Related Documents

- `product_overview.md` — what the app does and course format specification
- `app_architecture.md` — component structure and technical decisions
- `roadmap.md` — phased delivery plan
