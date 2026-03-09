# Code Blocks

Code blocks display syntax-highlighted source code. They are ideal for showing example snippets, configuration files, or sample output.

A code block has `"type": "code"` and requires a `"language"` field that specifies the programming language for syntax highlighting (e.g., `"python"`, `"javascript"`, `"json"`, `"html"`).

Like text blocks, code blocks get their content from either `"src"` or `"content"`:

- **`src`** — path to a source file relative to the topic folder (e.g., `"example.py"`)
- **`content`** — the code as an inline string in the JSON

You must provide exactly one of `src` or `content`.

## The `label` field

Code blocks support an optional `"label"` field. This is a short string displayed above the code block, typically used to show a filename. For example, setting `"label": "hello.py"` tells the reader that this code would live in a file called `hello.py`.
