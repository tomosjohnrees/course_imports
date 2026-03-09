# The Checkout Action

The `actions/checkout` action is the most widely used action in the entire GitHub Actions ecosystem. Almost every workflow starts with it.

## Why Is Checkout Needed?

When a job starts, the runner machine is a clean environment. Your repository code is **not** automatically present. The runner knows which repository triggered the workflow, but it has not cloned it. The checkout action handles this: it clones your repository into the runner's workspace directory so that subsequent steps can access your files.

Without checkout, a `run` step like `npm test` would fail because there is no `package.json` or source code on the machine.

## Basic Usage

```yaml
steps:
  - name: Check out code
    uses: actions/checkout@v4

  - name: List repository files
    run: ls -la
```

After the checkout step completes, the working directory contains your repository files exactly as they appear on the branch or commit that triggered the workflow.

## Common Options

The checkout action accepts several inputs via the `with` keyword:

```yaml
- name: Check out code with full history
  uses: actions/checkout@v4
  with:
    fetch-depth: 0
```

Useful `with` options include:

- **`fetch-depth`** -- By default, checkout performs a shallow clone (depth 1) to save time. Set to `0` to fetch the full history, which is needed for tools that analyse commit history or generate changelogs.
- **`ref`** -- Check out a specific branch, tag, or commit SHA instead of the default reference.
- **`repository`** -- Check out a different repository (useful for monorepo tooling or fetching shared configuration).
- **`token`** -- Provide a personal access token to check out private repositories or to enable triggers from subsequent pushes.

## When You Do Not Need Checkout

Not every job needs the checkout action. If a step only calls external APIs, sends notifications, or runs commands that do not depend on repository files, you can skip it entirely. Omitting unnecessary steps keeps your workflow faster.
