# The Validation Checklist

When a course is loaded, the app runs through a series of checks before accepting it. Think of this as a pre-flight inspection. Every check must pass; a single failure stops the import and surfaces an error.

Here is the complete checklist:

1. **`course.json` exists and is valid JSON** — The root folder must contain a `course.json` file, and it must parse as valid JSON. A trailing comma or missing quote will fail this check.

2. **All required fields are present** — `course.json` must include `id`, `title`, `description`, `version`, `author`, `tags`, and `topicOrder`. Missing any one of these will trigger an error.

3. **`topics/` directory exists** — There must be a `topics/` folder alongside `course.json`.

4. **Every `topicOrder` entry has a matching folder** — Each string in the `topicOrder` array must correspond to an actual subfolder inside `topics/`. If `topicOrder` lists `"03-functions"` but the folder is named `03-function` (no trailing "s"), validation fails.

5. **Every topic has a valid `content.json`** — Each topic folder must contain a `content.json` file, and its contents must be a JSON array (not an object, not a bare string).

6. **Every block has a `type` field** — Each object in the `content.json` array must include a `type` property. Without it, the app cannot determine how to render the block.

7. **All `src` paths point to existing files** — If a block references `"src": "notes.md"`, that file must exist in the same topic folder. Path traversal using `../` is explicitly disallowed.

8. **Images are under 10 MB** — Any image block whose file exceeds 10 MB will be rejected.

9. **Multiple-choice quizzes have `options` and a valid `answer` index** — A multiple-choice quiz must include an `options` array, and the `answer` value must be a zero-based index that falls within the bounds of that array.

10. **Text and code blocks have `src` or `content`** — Every text and code block must provide at least one of these two fields. If both are missing, the app has nothing to render.
