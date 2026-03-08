# [0010] Implement course validator

## Summary

Build the course validator that checks whether a local folder contains a valid course structure before parsing. The validator ensures `course.json` exists and is well-formed, the `topics/` directory exists, each topic listed in `topicOrder` has a folder with a valid `content.json`, and every block has a `type` field. This is the first line of defence against malformed courses and provides clear error messages to users.

## Context

- **Phase:** Milestone 2 — Course Validator
- **Depends on:** #0008
- **Blocks:** #0012

## What needs to happen

1. A validator module at `electron/course/validator.ts` that accepts a folder path and returns a structured validation result
2. Validation checks for course.json existence, topics/ folder existence, topic folder existence for each entry in topicOrder, and content.json validity within each topic
3. A structured `ValidationResult` return value listing all errors found (not just the first one)

## Acceptance criteria

### Functionality
- [ ] Returns an error if `course.json` does not exist at the root of the given path
- [ ] Returns an error if `course.json` is not valid JSON
- [ ] Returns an error if `topics/` folder does not exist
- [ ] Returns an error if any folder listed in `topicOrder` does not exist inside `topics/`
- [ ] Returns an error if any topic folder is missing a `content.json` file
- [ ] Returns an error if any `content.json` is not valid JSON or is not an array
- [ ] Returns an error if any block in a `content.json` array is missing a `type` field
- [ ] Returns `{ valid: true, errors: [] }` when all checks pass
- [ ] Collects all errors rather than stopping at the first one, so users can fix everything in one pass

### Security
- [ ] The validator only reads files within the provided folder path — no path traversal outside the course directory
- [ ] File paths are resolved and normalised to prevent directory traversal via `../` in `topicOrder` entries

### Performance
- [ ] Validation completes without unnecessary file reads — only reads files needed for structural checks
- [ ] Does not read the full contents of `src`-referenced files (that is the parser's job)

### Testing
- [ ] Unit tests cover each validation check independently (missing course.json, invalid JSON, missing topics folder, etc.)
- [ ] Unit tests verify that multiple errors are collected and returned together
- [ ] Unit tests verify a valid course structure returns `{ valid: true, errors: [] }`

## Notes

- The validator does not parse block content or resolve `src` references — it only checks structural validity.
- See `docs/product_overview.md` → "Course Structure" for the expected folder layout and file formats.
