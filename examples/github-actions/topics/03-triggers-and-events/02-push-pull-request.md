# Push and Pull Request Events

The `push` and `pull_request` events are the two most commonly used triggers. They fire when code is pushed to the repository or when a pull request is opened, updated, or synchronized.

## The push event

The `push` event fires whenever commits are pushed to any branch (or tag) in your repository. At its simplest, you can trigger on every push:

```yaml
on: push
```

This runs the workflow on every push to every branch. That is usually too broad for most projects.

## Branch filters

You can restrict which branches trigger the workflow using `branches` or `branches-ignore`:

- **`branches`** -- only trigger on pushes to the listed branches
- **`branches-ignore`** -- trigger on pushes to all branches *except* the listed ones

These filters support glob patterns like `feature/*` and `release/**`.

## Path filters

Path filters let you run a workflow only when certain files change. This is extremely useful in monorepos or when you want to skip CI for documentation-only changes:

- **`paths`** -- only trigger when at least one changed file matches the patterns
- **`paths-ignore`** -- skip the trigger when *only* the listed paths are changed

## The pull_request event

The `pull_request` event triggers when a pull request is opened, synchronized (new commits pushed to the PR branch), or reopened. It supports the same `branches` and `paths` filters as `push`.

Additionally, `pull_request` supports an **`types`** filter that lets you respond to specific pull request actions such as `opened`, `closed`, `labeled`, `review_requested`, and more.

## Tag filters

Both `push` and `pull_request` support `tags` and `tags-ignore` filters, which work similarly to branch filters but match Git tags instead. This is commonly used to trigger deployment workflows when a version tag like `v1.0.0` is pushed.
