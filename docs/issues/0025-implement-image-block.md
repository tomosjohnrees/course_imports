# [0025] Implement image block

## Summary

Image blocks display images within course content — either as data URIs (from local courses) or URLs (from GitHub courses). This issue builds the `ImageBlock` component that renders the image constrained to the reading width, with an optional caption below.

## Context

- **Phase:** Milestone 4 — Image Block
- **Depends on:** #0020 (block renderer)
- **Blocks:** None

## What needs to happen

1. An `ImageBlock` component that renders the resolved image source
2. The image is constrained to the reading width and never overflows its container
3. An optional caption is displayed below the image in muted small text

## Acceptance criteria

### Functionality
- [x] `ImageBlock` renders the image from `block.content` (data URI for local courses, URL for GitHub courses)
- [x] The image is constrained to `--reading-width` and never overflows the content area
- [x] Images maintain their aspect ratio when constrained
- [x] An optional `block.caption` is rendered below the image in muted, small text
- [x] Missing or broken images show a graceful fallback (alt text or placeholder) rather than a broken image icon
- [x] The component includes an `alt` attribute — using `block.caption` if available, or a generic description

### Security
- [x] Only data URIs and HTTPS URLs are rendered as image sources — no arbitrary protocols
- [x] Image sources are validated before rendering

### Performance
- [x] Images do not cause layout shifts as they load — the component reserves space or handles loading state
- [x] Large images are displayed at their constrained size, not at full resolution in the DOM

### Testing
- [x] Component tests verify images render from data URI sources
- [x] Component tests verify images render from URL sources
- [x] Component tests verify the caption is displayed when provided and absent when not
- [x] Component tests verify broken image sources show a fallback
- [x] Component tests verify images are constrained to reading width
