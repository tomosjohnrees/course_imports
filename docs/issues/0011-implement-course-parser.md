# [0011] Implement course parser

## Summary

Build the course parser that reads a validated local course folder and transforms it into a fully typed `Course` object with all file references resolved. The parser reads `course.json` for metadata, reads each topic's `content.json` for the block list, and resolves every `src` reference by reading the referenced file from disk. By the time the parser returns, all content is inline — the renderer never needs to read files.

## Context

- **Phase:** Milestone 2 — Course Parser
- **Depends on:** #0008
- **Blocks:** #0012

## What needs to happen

1. A parser module at `electron/course/parser.ts` that accepts a folder path and returns a fully resolved `Course` object
2. `course.json` is parsed into the top-level Course metadata (id, title, description, version, author, tags)
3. For each topic: `content.json` is read, and each block's `src` references are resolved by reading the referenced file from disk
4. Graceful error handling for missing files and malformed JSON

## Acceptance criteria

### Functionality
- [x] Parses `course.json` into a typed `Course` object with all metadata fields
- [x] Reads each topic's `content.json` and produces an ordered array of typed `Block` objects
- [x] For `text` blocks with a `src` field: reads the `.md` file and stores the content as a string in `block.content`
- [x] For `code` blocks with a `src` field: reads the source file and stores the content as a string in `block.content`
- [x] For `image` blocks with a `src` field: reads the image file and encodes it as a base64 data URI in `block.src`
- [x] For `callout` and `quiz` blocks: passes through inline content directly without file reads
- [x] Sets `topic.id` from the folder name
- [x] Derives `topic.title` from the folder name (e.g. `01-introduction` → `Introduction`)
- [x] Sets `course.source` to `{ type: 'local', path: folderPath }`
- [x] Returns a descriptive error (not a crash) when a `src` file does not exist
- [x] Returns a descriptive error (not a crash) when `content.json` contains malformed JSON

### Security
- [x] File reads are restricted to paths within the course folder — `src` values containing `../` or absolute paths are rejected
- [x] Binary file reads (images) are bounded in size to prevent memory exhaustion from oversized files

### Performance
- [x] File reads within a topic are performed concurrently where possible (e.g. `Promise.all` for resolving multiple `src` references)
- [x] Image files are read as buffers and encoded to base64 in a single pass — no redundant reads

### Testing
- [x] Unit tests verify correct parsing of a valid course folder (mocked file system or test fixtures)
- [x] Unit tests verify each block type is resolved correctly (text, code, image, callout, quiz)
- [x] Unit tests verify graceful error handling for missing `src` files
- [x] Unit tests verify graceful error handling for malformed `content.json`

## Notes

- The parser assumes the course has already passed validation. It does not re-check structural validity.
- Topic ordering follows the `topicOrder` array from `course.json`.
- See `docs/app_architecture.md` → "Data Types" for the exact shape of the resolved block objects.
- See `docs/product_overview.md` → "Content Block Types" for the full list of v1 block types.
