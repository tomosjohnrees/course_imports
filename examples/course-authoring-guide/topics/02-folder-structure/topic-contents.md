# What Goes Inside a Topic Folder

Every topic folder must contain a `content.json` file. This is the only required file. It defines the sequence of blocks (text, code, quizzes, callouts, images) that make up the topic.

Beyond `content.json`, a topic folder can contain any supporting files referenced by its blocks:

- **Markdown files** (`.md`) — referenced by text blocks using the `src` field
- **Code files** (`.py`, `.js`, `.yml`, etc.) — referenced by code blocks using the `src` field
- **Image files** (`.png`, `.jpg`, `.svg`, etc.) — referenced by image blocks using the `src` field

All `src` paths are relative to the topic folder. A text block with `"src": "overview.md"` expects to find `overview.md` in the same folder as the `content.json` that references it.

## Keeping Things Organised

There is no sub-folder nesting within a topic folder. All files sit directly alongside `content.json`. This flat structure keeps things simple — you always know exactly where to find a file.

A typical topic folder might look like this:

```
03-functions/
├── content.json
├── explanation.md
├── examples.md
├── factorial.py
└── diagram.png
```

If a block uses inline content (the `content` field instead of `src`), no external file is needed for that block. Small snippets often work well inline, while longer text and code are easier to maintain in separate files.
