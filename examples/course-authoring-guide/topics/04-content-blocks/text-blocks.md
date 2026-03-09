# Text Blocks

Text blocks are the most common block type. They render markdown content and support all standard markdown features: headings, bold, italic, lists, links, tables, and more.

A text block has `"type": "text"` and gets its content from one of two sources:

1. **`src`** — a path to an external `.md` file, relative to the topic folder
2. **`content`** — an inline markdown string, written directly in the JSON

You must provide exactly one of these fields. Providing both or neither will cause a validation error.

## When to use `src` vs `content`

Use **`src`** (external file) when:

- The text is longer than a couple of sentences
- You want proper editor support with syntax highlighting for markdown
- The content might be reused or edited independently

Use **`content`** (inline) when:

- The text is very short — a sentence or two at most
- You want to keep everything in one file for simplicity

As a rule of thumb: if your text is more than two sentences long, use `src`. Writing long markdown strings inside JSON is awkward — you lose syntax highlighting, line wrapping, and readability.
