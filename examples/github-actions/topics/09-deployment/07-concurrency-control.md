# Concurrency Control

When deploying software, you usually want only one deployment to run at a time. If two pushes happen in quick succession, running both deployments simultaneously can lead to race conditions, partial rollouts, or confused state. GitHub Actions provides a built-in **concurrency** feature to prevent this.

## The `concurrency` Key

You can add a `concurrency` block at the workflow level or at the individual job level:

```yaml
concurrency:
  group: deploy-production
  cancel-in-progress: false
```

This tells GitHub Actions:

- **`group`** -- a string that identifies the concurrency group. Only one run within the same group can be active at a time. Additional runs are queued (or cancelled, depending on the next setting).
- **`cancel-in-progress`** -- when set to `true`, a new run in the same group automatically cancels any currently running or queued run. When `false`, the new run waits in a queue until the current one finishes.

## Choosing Between Queue and Cancel

The right choice depends on your use case:

### Queue (`cancel-in-progress: false`)

Use this for **production deployments** where you want every deployment to complete. If a second deployment is triggered while the first is running, it waits. This ensures no deployment is skipped.

### Cancel (`cancel-in-progress: true`)

Use this for **preview deployments** or non-critical environments where only the latest version matters. If a developer pushes three commits in quick succession, you only need to deploy the final one -- cancelling the earlier deployments saves time and runner minutes.

## Dynamic Concurrency Groups

You can use expressions to create dynamic group names. This is useful when you want per-branch or per-environment concurrency:

```yaml
concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: true
```

With this configuration, deployments to `main` form one group and deployments from a `feature/login` branch form another. Two different branches can deploy simultaneously, but two pushes to the same branch will not overlap.

A common pattern for pull request preview deployments:

```yaml
concurrency:
  group: preview-${{ github.event.pull_request.number }}
  cancel-in-progress: true
```

This creates a separate concurrency group per pull request, so updating one PR does not cancel the preview deployment of another.

## Concurrency at the Job Level

You can also set concurrency on individual jobs rather than the entire workflow. This is useful when your workflow has both build and deploy jobs -- you might want builds to run in parallel but deployments to be serialised:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - run: echo "Building..."

  deploy:
    needs: build
    runs-on: ubuntu-latest
    concurrency:
      group: deploy-production
      cancel-in-progress: false
    steps:
      - run: echo "Deploying..."
```

## Summary

| Scenario | `cancel-in-progress` | Group Strategy |
|----------|---------------------|----------------|
| Production deployment | `false` | Static group name |
| Preview / staging deployment | `true` | Per-branch or per-PR |
| GitHub Pages | `false` | Static group name |
| Multiple environments | `false` | Per-environment name |
