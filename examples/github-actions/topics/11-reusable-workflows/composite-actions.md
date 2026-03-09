# Composite Actions

While reusable workflows operate at the **job level**, composite actions work at the **step level**. A composite action bundles multiple steps into a single reusable unit that can be used inside any job, just like a marketplace action.

## When to Use Composite Actions

Composite actions are ideal when you want to:

- Bundle a small sequence of steps (e.g., "set up our standard toolchain")
- Create something that behaves like a marketplace action but is specific to your organisation
- Share logic that should run *within* an existing job, not as a separate job

## Structure

A composite action lives in its own directory (or repository) and is defined by an `action.yml` file at the root. The key fields are:

- **`name`** and **`description`** — metadata for the action.
- **`inputs`** — parameters the consumer can pass in.
- **`outputs`** — values the action exposes back to the calling workflow.
- **`runs.using: "composite"`** — declares this as a composite action.
- **`runs.steps`** — the sequence of steps to execute.

## Key Differences from Reusable Workflows

| Aspect | Composite Action | Reusable Workflow |
|--------|-----------------|-------------------|
| Level | Step (inside a job) | Job (replaces a job) |
| Runner | Shares the caller's runner | Gets its own runner |
| Secrets access | Inherits from the job | Must be passed explicitly |
| Nesting limit | No practical limit | 4 levels deep |
| Definition file | `action.yml` | Standard workflow `.yml` |
