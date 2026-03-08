# [0020] Implement block renderer and unknown block fallback

## Summary

Each topic is a sequence of content blocks (text, code, quiz, etc.) that need to be rendered in order. This issue builds the `BlockRenderer` component that iterates a topic's block array and delegates each block to the correct component, plus an `UnknownBlock` fallback for unrecognised block types so the app never crashes on unexpected content.

## Context

- **Phase:** Milestone 4 — Block Renderer
- **Depends on:** #0008 (course type definitions), #0013 (Zustand stores)
- **Blocks:** #0021, #0022, #0023, #0024, #0025 (all block type components)

## What needs to happen

1. A `BlockRenderer` component that receives a topic's blocks array and renders each block via the correct component based on `block.type`
2. An `UnknownBlock` component that renders a neutral notice for any block type that doesn't have a matching component
3. Consistent vertical spacing between blocks following the design guide

## Acceptance criteria

### Functionality
- [ ] `BlockRenderer` iterates the blocks array and renders each block in order
- [ ] Each block is delegated to the correct component based on its `type` field (text, code, quiz, callout, image)
- [ ] Unrecognised block types render the `UnknownBlock` component with a neutral message indicating the type is not supported
- [ ] `UnknownBlock` does not crash the app or prevent other blocks from rendering
- [ ] Consistent vertical spacing is applied between all blocks per the design guide
- [ ] An empty blocks array renders nothing (no error, no empty state — the topic-level empty state is handled elsewhere)

### Security
- [ ] Block content is not rendered via `dangerouslySetInnerHTML` without sanitisation — use safe rendering methods

### Performance
- [ ] Each block component is rendered only when its own props change, not when sibling blocks update
- [ ] The renderer handles topics with 100+ blocks without noticeable lag

### Testing
- [ ] Component tests verify blocks render in the correct order
- [ ] Component tests verify each block type is delegated to the correct component
- [ ] Component tests verify unknown block types render the fallback component
- [ ] Component tests verify the renderer handles an empty blocks array gracefully
