# Core Concepts

GitHub Actions has six building blocks. Understanding how they fit together is essential before you write your first workflow.

## Workflows

A **workflow** is an automated process defined in a YAML file. Workflow files live in the `.github/workflows/` directory of your repository. A single repository can have multiple workflows — one for testing, another for deployment, a third for issue triage — each triggered independently.

## Events

An **event** is something that triggers a workflow to run. Common events include:

- `push` — code is pushed to a branch
- `pull_request` — a pull request is opened, updated, or merged
- `schedule` — a cron-based timer fires
- `workflow_dispatch` — someone clicks "Run workflow" in the GitHub UI

A workflow declares which events it listens to using the `on` key.

## Jobs

A workflow contains one or more **jobs**. Each job is a set of instructions that run on the same runner. By default, jobs within a workflow run in parallel, but you can make them sequential by declaring dependencies between them.

## Steps

A job contains an ordered list of **steps**. Each step is either a shell command (using `run`) or a reference to an action (using `uses`). Steps within a job execute sequentially on the same machine, so they can share files and environment state.

## Actions

An **action** is a reusable, self-contained unit of automation. Rather than writing a long shell script, you can reference an action that someone else (or you) has already built. Actions can come from:

- The **GitHub Marketplace** (e.g., `actions/checkout`, `actions/setup-node`)
- Another repository
- A local directory within your own repository

## Runners

A **runner** is the machine that executes a job. GitHub provides hosted runners with Ubuntu Linux, Windows, and macOS pre-installed with common developer tools. You can also configure your own **self-hosted runners** for specialised hardware, compliance requirements, or cost control.
