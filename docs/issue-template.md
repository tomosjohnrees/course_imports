# Issue template

Every generated issue must follow this structure exactly.

```markdown
# [NNNN] Issue title

## Summary

A 2-3 sentence description of what this work is and why it matters. Written for a developer who hasn't read the roadmap. Explain the user value or architectural necessity.

## Context

- **Phase:** Phase N — Section name
- **Depends on:** #NNNN (link to prerequisite issues, or "None")
- **Blocks:** #NNNN (issues that can't start until this is done, or "None")

## What needs to happen

A short, ordered list of the high-level outcomes — not implementation steps. Focus on *what*, not *how*.

1. First outcome
2. Second outcome
3. Third outcome

## Acceptance criteria

Functionality, security, performance, and testing criteria that define "done". Every criterion must be independently verifiable.

### Functionality
- [ ] Criterion describing the expected behaviour
- [ ] Criterion describing the expected behaviour

### Security
- [ ] At least one security criterion relevant to this work (e.g. "Only family members can access this endpoint", "User input is validated before processing", "Sensitive fields are not included in API responses")

### Performance
- [ ] At least one performance criterion relevant to this work (e.g. "Database queries use indexes and avoid N+1 patterns", "List endpoints are paginated", "Response payloads are kept under N KB")

### Testing
- [ ] At least one testing criterion describing expected coverage (e.g. "Context module has unit tests covering success and error paths", "Controller tests verify authorisation and input validation", "Component tests cover key user interactions")

## Notes

Optional. Any additional context, edge cases to consider, or links to relevant docs. Keep brief.
```

## Guidance for filling in the template

- **Title:** Imperative verb + noun. "Create families table and schema", "Build family creation onboarding screen", "Add invite acceptance endpoint".
- **Summary:** Answer "what is this?" and "why does it matter?" in plain English. No code references.
- **Dependencies:** Look at the roadmap ordering. If a migration must exist before an endpoint can be built, link them. If there are no dependencies, write "None".
- **What needs to happen:** 3-5 bullet points maximum. Each should be a deliverable, not a task. "A migration that creates the families table" not "Run mix ecto.gen.migration".
- **Acceptance criteria:** Write these as checkboxes so reviewers can tick them off during review. Be specific enough that two engineers would agree on whether each criterion is met.
- **Security criteria:** Think about authorisation (who can do this?), data scoping (can users see other families' data?), input validation (what happens with bad input?), and data exposure (are we leaking sensitive info?).
- **Performance criteria:** Think about query patterns, payload sizes, pagination, caching, and indexing.
- **Testing criteria:** Match test type to the work — context tests for business logic, controller tests for endpoints, component/integration tests for UI.
