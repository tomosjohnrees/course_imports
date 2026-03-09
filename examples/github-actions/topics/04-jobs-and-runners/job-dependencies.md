# Job Dependencies with `needs`

By default, all jobs in a workflow start at the same time and run in parallel. To enforce ordering -- for example, running tests only after the build succeeds -- you use the `needs` keyword.

## Sequential Execution

The `needs` property takes a job ID (or an array of job IDs). A job will not start until every job listed in `needs` has completed successfully.

Consider a workflow with three jobs: `build`, `test`, and `deploy`. You want to build first, then test, then deploy. The `needs` keyword creates this chain:

```
build  -->  test  -->  deploy
```

If any job in the chain fails, downstream jobs are **skipped** by default. This prevents deploying broken code.

## Fan-Out and Fan-In

You are not limited to a simple linear chain. Jobs can depend on multiple upstream jobs, enabling a **fan-out / fan-in** pattern:

```
          +--> unit-test ---+
build  -->                   +--> deploy
          +--> lint ---------+
```

Here, `unit-test` and `lint` both depend on `build` and run in parallel once `build` finishes. The `deploy` job waits for both `unit-test` and `lint` to succeed.

This pattern is powerful because it maximises parallelism while still enforcing correct ordering.
