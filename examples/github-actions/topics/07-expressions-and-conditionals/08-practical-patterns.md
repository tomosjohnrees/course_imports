# Practical Patterns

Now that you know the individual pieces -- expressions, operators, conditionals, status checks, and functions -- let us look at how they combine in real workflows.

## Pattern 1: Skip CI on Documentation Changes

Use path-based triggers combined with conditionals to avoid running expensive test suites when only documentation files changed:

```yaml
on:
  push:
    paths-ignore:
      - '**.md'
      - 'docs/**'
```

When you need more granular control within the workflow itself, you can use expressions on individual steps.

## Pattern 2: Environment-Specific Deployment

Deploy to different environments based on the branch:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        if: github.ref == 'refs/heads/develop'
        run: ./deploy.sh staging

      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: ./deploy.sh production
```

## Pattern 3: Conditional Notifications

Send different notifications depending on the outcome:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run build
        id: build
        run: npm run build

  notify:
    needs: build
    if: always()
    runs-on: ubuntu-latest
    steps:
      - name: Success notification
        if: needs.build.result == 'success'
        run: echo "Build succeeded!"

      - name: Failure notification
        if: needs.build.result == 'failure'
        run: echo "Build failed -- check the logs."
```

## Pattern 4: Dynamic Matrix with fromJSON

Generate a build matrix dynamically using `fromJSON()`:

```yaml
jobs:
  prepare:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{ steps.set.outputs.matrix }}
    steps:
      - id: set
        run: echo 'matrix={"node-version":["16","18","20"]}' >> $GITHUB_OUTPUT

  build:
    needs: prepare
    runs-on: ubuntu-latest
    strategy:
      matrix: ${{ fromJSON(needs.prepare.outputs.matrix) }}
    steps:
      - run: echo "Building with Node ${{ matrix.node-version }}"
```

## Pattern 5: Continue on Error with Conditional Follow-up

Run a step that might fail, then take different actions based on whether it did:

```yaml
steps:
  - name: Run optional linter
    id: lint
    continue-on-error: true
    run: npx eslint .

  - name: Comment lint warnings
    if: steps.lint.outcome == 'failure'
    run: echo "Linting found issues -- see logs for details."

  - name: Lint passed
    if: steps.lint.outcome == 'success'
    run: echo "All lint checks passed."
```

Notice the use of `outcome` instead of `conclusion`. Since `continue-on-error` is `true`, the `conclusion` will always be `success`, but `outcome` preserves the real result.
