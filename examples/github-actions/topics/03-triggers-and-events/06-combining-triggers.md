# Combining Multiple Triggers

A single workflow can respond to multiple events. This is useful when the same set of jobs should run under different circumstances -- for example, running tests on both pushes and pull requests, or allowing a scheduled workflow to also be triggered manually.

## How it works

List multiple events under the `on` key. Each event can have its own filters and configuration. When *any* of the listed events occurs, the workflow runs.

The relationship between events is always **OR** -- the workflow triggers if event A fires *or* event B fires. There is no built-in way to require multiple events to occur together.

## Practical patterns

### CI on push and pull request

The most common pattern is running your test suite on both direct pushes to main and on pull requests targeting main:

```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
```

### Scheduled with manual override

A workflow that runs nightly but can also be triggered on demand:

```yaml
on:
  schedule:
    - cron: '0 0 * * *'
  workflow_dispatch:
```

### Knowing which event triggered the run

Inside your workflow, you can check `github.event_name` to determine which event actually triggered the current run. This is useful when a workflow behaves slightly differently depending on the trigger -- for example, deploying only on a push but only running tests on a pull request.
