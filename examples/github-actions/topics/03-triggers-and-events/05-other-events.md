# Other Events

Beyond pushes, pull requests, schedules, and manual triggers, GitHub Actions supports a wide range of repository events. Here are some of the most commonly used ones.

## release

The `release` event fires when a GitHub release is created, published, edited, or deleted. This is a natural fit for publishing packages, building release artifacts, or updating documentation.

The `types` filter controls which release actions trigger the workflow. The most common is `published`, which fires when a release is made public (including when created as non-draft).

## issues

The `issues` event lets you automate responses to issue activity. Common use cases include auto-labeling new issues, assigning reviewers, posting welcome messages to first-time contributors, or syncing issues with external project management tools.

Like `pull_request`, the `issues` event supports a `types` filter: `opened`, `edited`, `labeled`, `closed`, `assigned`, and more.

## workflow_call

The `workflow_call` event is unique -- it turns a workflow into a **reusable workflow** that other workflows can call, much like a function call. This is covered in depth in the Reusable Workflows topic later in this course.

A workflow with `workflow_call` defines inputs and outputs, making it a self-contained, parameterized unit of automation. The calling workflow uses it as a job step, passing in the required inputs.

## Other notable events

| Event               | Description                                      |
|---------------------|--------------------------------------------------|
| `fork`              | A user forks the repository                      |
| `create` / `delete` | A branch or tag is created or deleted            |
| `deployment_status` | A deployment status changes                      |
| `discussion`        | A GitHub Discussion is created or modified       |
| `label`             | A label is created, edited, or deleted           |
| `workflow_run`      | Another workflow completes (useful for chaining) |

GitHub supports over 35 different webhook events that can trigger workflows. The events listed here are the most practical for everyday CI/CD, but you can find the full list in the GitHub Actions documentation.
