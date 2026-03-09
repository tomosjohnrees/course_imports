In this workflow, `strategy.matrix.node-version` defines three values: `18`, `20`, and `22`. GitHub Actions creates three parallel jobs from this single definition — one for each version. In the steps, `${{ matrix.node-version }}` is replaced with the current value for that job instance.

When you look at the workflow run in the GitHub UI, you will see three separate job entries, each labelled with its matrix values:

- `test (18)`
- `test (20)`
- `test (22)`

Each runs independently on its own runner, with its own checkout, its own Node.js installation, and its own test execution.
