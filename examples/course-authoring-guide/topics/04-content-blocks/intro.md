# Content Blocks

Every topic in a Course Imports course is driven by a `content.json` file. This file is a JSON array of **blocks** — the building blocks of your topic's content. Blocks are rendered top-to-bottom in the exact order they appear in the array.

There are five block types available:

- **Text** — renders markdown content, either from an external file or inline
- **Code** — displays syntax-highlighted code with an optional label
- **Callout** — a highlighted box for tips, warnings, or extra information
- **Image** — displays an image with alt text and an optional caption
- **Quiz** — interactive questions (covered in the next topic)

Every block must include a `"type"` field that tells Course Imports how to render it. The remaining fields depend on the block type.
