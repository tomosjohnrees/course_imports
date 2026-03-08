# [0008] Define course and block type definitions

## Summary

Define all shared TypeScript types for the course data model — Course, Topic, Block variants, CourseSource, CourseProgress, and ValidationResult. These types are used by the validator, parser, Zustand stores, and renderer components. Getting the type foundation right early prevents mismatches across the loading pipeline.

## Context

- **Phase:** Milestone 2 — Course Loading (Local)
- **Depends on:** #0003
- **Blocks:** #0010, #0011, #0013

## What needs to happen

1. A `Course` interface with id, title, description, version, author, tags, topics, and source
2. A `Topic` interface with id, title, and an ordered array of blocks
3. A `Block` discriminated union type covering all v1 block types: `TextBlock`, `CodeBlock`, `QuizBlock`, `CalloutBlock`, `ImageBlock`
4. A `CourseSource` type distinguishing local and GitHub sources with the path/URL
5. A `CourseProgress` type mapping topic IDs to viewed/complete state
6. A `ValidationResult` type with a valid boolean and an errors array

## Acceptance criteria

### Functionality
- [ ] All types from the architecture doc's "Data Types" section are defined in `src/types/course.types.ts`
- [ ] `Block` is a discriminated union — each variant has a `type` literal field
- [ ] `QuizBlock` supports both `multiple-choice` and `free-text` variants
- [ ] `ImageBlock.src` is typed as `string` (resolved data URI or URL, not a file path)
- [ ] `CourseSource` distinguishes `local` (with folder path) and `github` (with repo URL)
- [ ] All types are exported and importable from both main process and renderer code

### Security
- [ ] No sensitive fields (tokens, credentials) are included in any course-facing type
- [ ] Types enforce that resolved content (not raw file paths) reaches the renderer

### Performance
- [ ] Types are interfaces/types only — no runtime code, no impact on bundle size

### Testing
- [ ] TypeScript compiles without errors after adding the type definitions
- [ ] At least one file in the main process and one in the renderer successfully import the types

## Notes

- The architecture doc at `docs/app_architecture.md` → "Data Types" section has the canonical type definitions to follow.
- `TextBlock.content` and `CodeBlock.content` contain resolved file contents as strings — the renderer never sees file paths.
