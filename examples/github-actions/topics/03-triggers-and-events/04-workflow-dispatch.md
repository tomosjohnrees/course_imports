# Manual Triggers with workflow_dispatch

The `workflow_dispatch` event lets you trigger a workflow manually from the GitHub UI, the GitHub CLI, or the REST API. This is invaluable for tasks that should not happen automatically -- one-off deployments, manual data migrations, emergency rollbacks, or running a workflow with custom parameters.

## Basic usage

At its simplest, adding `workflow_dispatch` with no configuration enables a "Run workflow" button in the GitHub Actions tab:

```yaml
on:
  workflow_dispatch:
```

## Adding inputs

The real power of `workflow_dispatch` comes from **inputs**. Inputs let you pass parameters to the workflow at trigger time. Each input has a name, a description, a type, and optionally a default value.

Supported input types are:

- **`string`** -- a free-text field
- **`boolean`** -- a checkbox (true/false)
- **`choice`** -- a dropdown with predefined options
- **`environment`** -- a dropdown of repository environments

## Accessing input values

Inside your workflow, input values are available through the `github.event.inputs` context or the `inputs` context. Both work, but `inputs` is the recommended approach as it preserves the declared type (for example, a boolean input will be a real boolean when accessed via `inputs`, but a string `"true"` or `"false"` when accessed via `github.event.inputs`).

## When to use workflow_dispatch

- Deployments that require human approval or a specific target
- Running tests against a particular branch or commit
- Administrative tasks like clearing caches or rotating secrets
- Debugging workflows by running them with different configurations
