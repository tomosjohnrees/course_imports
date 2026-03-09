# Anatomy of a Workflow File

Every workflow file has a consistent structure built from five core concepts. Let's walk through each one.

## `name`

The `name` field gives your workflow a human-readable label. This is the name that appears in the GitHub Actions tab.

```yaml
name: Hello World
```

If you omit it, GitHub uses the file name instead.

## `on`

The `on` field defines **when** the workflow runs. This is the trigger. The simplest trigger fires on every push to the repository:

```yaml
on: push
```

You can also trigger on pull requests, on a schedule, or manually. We will cover triggers in depth in the next topic.

## `jobs`

A workflow contains one or more **jobs**. Each job is a named block under the `jobs` key. Jobs run in parallel by default unless you define dependencies between them.

```yaml
jobs:
  greet:
    # job configuration goes here
```

Here `greet` is the job ID -- a name you choose. It must contain only alphanumeric characters, hyphens, or underscores.

## `runs-on`

Inside each job, `runs-on` specifies the **runner environment** -- the virtual machine that will execute the job. GitHub provides hosted runners for all major operating systems:

- `ubuntu-latest` -- the most common choice
- `windows-latest`
- `macos-latest`

```yaml
jobs:
  greet:
    runs-on: ubuntu-latest
```

## `steps`

Steps are the individual tasks within a job. They execute sequentially, from top to bottom. Each step can either run a shell command (using `run`) or use a pre-built action (using `uses`).

```yaml
steps:
  - name: Say hello
    run: echo "Hello, World!"
```

The `name` field on a step is optional but highly recommended -- it labels the step in the GitHub UI so you can quickly find it in the logs.

## How They Fit Together

The hierarchy looks like this:

```
Workflow (the file)
  └── on (trigger)
  └── jobs
       └── job-id
            ├── runs-on (environment)
            └── steps
                 ├── step 1
                 ├── step 2
                 └── step 3
```

Every workflow follows this same skeleton. Once you internalise it, reading any workflow file becomes straightforward.
