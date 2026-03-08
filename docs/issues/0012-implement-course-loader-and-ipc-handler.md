# [0012] Implement course loader and loadFromFolder IPC handler

## Summary

Build the course loader that orchestrates the validator-then-parser pipeline for local folders, and wire it up as the `course:loadFromFolder` IPC handler. This is the main entry point for local course loading — it takes a folder path, validates the structure, parses the content, and returns a fully resolved Course object (or a structured error) to the renderer.

## Context

- **Phase:** Milestone 2 — Course Loader
- **Depends on:** #0009, #0010, #0011
- **Blocks:** #0014

## What needs to happen

1. A loader module at `electron/course/loader.ts` that chains validation and parsing for a given folder path
2. Topic ordering is normalised according to the `topicOrder` array in `course.json`
3. The `course:loadFromFolder` IPC handler in `electron/ipc/course.handlers.ts` is implemented (replacing the stub from #0009)
4. The handler returns `{ success: true, course: Course }` on success or `{ success: false, error: string }` on failure

## Acceptance criteria

### Functionality
- [ ] The loader runs the validator first — if validation fails, parsing is skipped and the validation errors are returned
- [ ] On successful validation, the loader runs the parser and returns the resolved Course object
- [ ] Topics in the returned Course are ordered according to `topicOrder` from `course.json`
- [ ] The `course:loadFromFolder` IPC handler accepts a folder path string and returns the loader result
- [ ] Validation errors are returned as a user-readable string (e.g. listing all issues found)
- [ ] Parser errors are caught and returned as `{ success: false, error: string }`

### Security
- [ ] The IPC handler validates that the folder path argument is a non-empty string before proceeding
- [ ] Errors returned to the renderer do not expose internal file system paths beyond the course folder

### Performance
- [ ] Validation short-circuits before parsing — no file content is read if the structure is invalid
- [ ] The full load pipeline (validate + parse) completes in under 2 seconds for a typical course (10 topics, 50 blocks)

### Testing
- [ ] Integration tests verify the full pipeline: valid folder → success with correct Course object
- [ ] Integration tests verify the pipeline: invalid folder → failure with descriptive error
- [ ] Tests verify topic ordering matches `topicOrder`
- [ ] Tests verify that validation errors prevent parsing from running

## Notes

- The loader will be extended in Milestone 3 to also support GitHub sources, but for now it only handles local folders.
- See `docs/app_architecture.md` → "Course Loading Flow" for the full sequence diagram.
