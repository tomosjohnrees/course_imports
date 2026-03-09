# [0051] Add checkpoint block type with mark-as-complete button

## Summary

Add a new `checkpoint` block type that renders an explicit "Mark as complete" button at a specific point within a topic. This lets course authors place progression gates mid-topic, so completion isn't purely based on quizzes or simply viewing the page. Users click the button to acknowledge they've understood the material up to that point.

## Context

- **Phase:** Backlog (Post-v1)
- **Depends on:** None (progress tracking infrastructure is already in place)
- **Blocks:** None

## What needs to happen

1. A `CheckpointBlock` type definition is added to the shared type system, with an optional `label` field for custom button text
2. The course validator and parser recognise and handle `checkpoint` blocks
3. A `CheckpointBlock` component renders a prominent "Mark as complete" button (or custom label)
4. Clicking the button records the checkpoint as completed in the progress store and persists it
5. Topics containing checkpoint blocks factor checkpoint completion into their topic completion state
6. The `BlockRenderer` switch statement routes `checkpoint` blocks to the new component

## Acceptance criteria

### Functionality
- [x] `checkpoint` blocks are parsed from `content.json` without errors
- [x] The block renders a clearly visible button with the `label` text or a default like "Mark as complete"
- [x] Clicking the button transitions it to a completed state (visually distinct — e.g. checkmark, muted style)
- [x] Once completed, the checkpoint cannot be un-completed (same pattern as quiz answers)
- [x] If already completed (from persisted progress), the block renders in its completed state on mount
- [x] Topics with checkpoint blocks require all checkpoints to be completed (in addition to quizzes) for topic completion

### Security
- [x] Checkpoint completion state is scoped to the specific course ID — completing a checkpoint in one course does not affect another

### Performance
- [x] Checkpoint state changes are persisted using the existing debounced save mechanism — no additional IPC calls beyond what the progress system already does

### Testing
- [x] Component tests cover: initial uncompleted state, clicking to complete, rendering in pre-completed state, custom label text
- [x] Progress tracking tests verify that checkpoint completion is factored into topic completion logic

## Notes

Consider placing an optional `body` markdown field on the checkpoint for authors who want to include a short prompt like "Before continuing, make sure you understand X". This is optional and can be deferred.
