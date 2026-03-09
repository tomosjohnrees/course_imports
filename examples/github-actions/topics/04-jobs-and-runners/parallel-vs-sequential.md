# Parallel vs Sequential Execution

Understanding when jobs run in parallel and when they run sequentially is essential for designing fast, correct workflows.

## Default: Parallel

Without any `needs` declarations, every job starts as soon as a runner is available. If your workflow has three independent jobs, they all run at the same time:

```
job-a  ──────>
job-b  ──────>       (all start together)
job-c  ──────>
```

This is ideal when jobs are truly independent -- for example, running tests for different services in a monorepo.

## Sequential with `needs`

Adding `needs` forces a job to wait. A strict linear pipeline looks like this:

```
build  ──>  test  ──>  deploy
```

Each job waits for the previous one to complete before it begins.

## Hybrid: The Best of Both

In practice, most workflows combine parallel and sequential execution. You run independent checks in parallel and gate deployments behind all of them:

```
          +--> test --------+
build  -->+--> lint --------+--> deploy
          +--> security ----+
```

This approach is both fast (parallel checks) and safe (deployment only happens when everything passes).

## Practical Tips

- **Keep jobs focused.** A job that does one thing well is easier to debug and faster to re-run on failure.
- **Avoid unnecessary dependencies.** If two jobs do not actually depend on each other, let them run in parallel.
- **Watch your concurrency limits.** Free-tier GitHub accounts have a limited number of concurrent jobs. Too many parallel jobs may lead to queueing.
