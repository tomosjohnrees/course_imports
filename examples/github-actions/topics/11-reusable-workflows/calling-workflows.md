# Calling Reusable Workflows

To call a reusable workflow, use the `uses` keyword at the **job level** (not inside `steps`). This is a key distinction — you are replacing an entire job definition with a reference to another workflow.

## Same-Repository Calls

When the reusable workflow lives in the same repository, use a relative path:

```yaml
jobs:
  build:
    uses: ./.github/workflows/reusable-build.yml
```

## Cross-Repository Calls

When calling a workflow from a different repository, use the full `owner/repo` path followed by the workflow file path and a ref (branch, tag, or commit SHA):

```yaml
jobs:
  build:
    uses: my-org/shared-workflows/.github/workflows/build.yml@v2
```

## Passing Inputs and Secrets

Use `with` for inputs and `secrets` for secrets:

```yaml
jobs:
  build:
    uses: ./.github/workflows/reusable-build.yml
    with:
      node-version: "20"
    secrets:
      NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

If you want to pass **all** of the caller's secrets without listing them individually, use `secrets: inherit`.

## Limitations

- A workflow can be nested up to **four levels deep** (a reusable workflow calling another reusable workflow, etc.).
- You cannot call a reusable workflow from within a `steps` block — it must be a top-level job entry.
- The called workflow must be in a **public** repository or the **same** repository (unless you have GitHub Enterprise with internal repository visibility).
