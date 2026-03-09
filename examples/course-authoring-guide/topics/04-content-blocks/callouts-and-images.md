# Callout and Image Blocks

## Callout Blocks

Callout blocks are highlighted boxes used to draw attention to important information. They are great for tips, warnings, or supplementary notes that should stand out from the main text.

A callout block has `"type": "callout"` and requires two fields:

- **`style`** — the visual style of the callout. Must be one of:
  - `"info"` — for general information or context
  - `"warning"` — for potential pitfalls or things to watch out for
  - `"tip"` — for helpful advice or best practices
- **`body`** — the callout content, written as a markdown string

Callout blocks do not use `src` or `content` — all callout text goes in the `body` field. Keep callouts concise; if you find yourself writing more than a short paragraph, the content probably belongs in a text block instead.

## Image Blocks

Image blocks display an image within the topic. They have `"type": "image"` and require:

- **`src`** — path to the image file relative to the topic folder (e.g., `"diagram.png"`)
- **`alt`** — alt text describing the image for accessibility

An optional `"caption"` field can be used to display a caption below the image.

### Image size limit

All images must be under **10 MB**. The validator will reject any image that exceeds this limit. Use compressed formats like PNG or JPEG and resize large images before including them in your course.
