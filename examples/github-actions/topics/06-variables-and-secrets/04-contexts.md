# GitHub Contexts

While environment variables are plain strings available in shell commands, **contexts** are structured objects available in workflow expressions (the `${{ }}` syntax). Contexts give you access to rich information about the current run that goes beyond what environment variables provide.

## Key Contexts

### `github` Context

Contains information about the workflow run and the event that triggered it. This is the context you will use most often.

Common properties include `github.sha`, `github.ref`, `github.actor`, `github.repository`, `github.event_name`, and `github.event` (the full webhook payload).

### `env` Context

Accesses environment variables using expression syntax: `${{ env.MY_VAR }}`. This is useful when you need an environment variable's value inside a YAML field that does not support shell expansion (like `if` conditionals or action `with` inputs).

### `vars` Context

Accesses repository, environment, or organisation-level **variables** (non-secret configuration values set in the GitHub UI). For example, `${{ vars.DEPLOY_REGION }}`.

### `secrets` Context

Accesses encrypted secrets. For example, `${{ secrets.API_KEY }}`. Secrets are never printed in logs -- GitHub automatically masks them.

### `steps` Context

Accesses outputs from previous steps in the same job. You reference a step's output by its `id`: `${{ steps.my_step.outputs.result }}`.

### `job` Context

Contains information about the currently running job, including its status.

### `runner` Context

Provides details about the runner executing the job, such as `runner.os`, `runner.arch`, and `runner.temp` (a temporary directory path).

## Contexts vs Environment Variables

A common point of confusion: `$GITHUB_SHA` (environment variable) and `${{ github.sha }}` (context expression) give you the same value, but they are accessed in different ways. Use environment variables in shell scripts (`run` steps). Use contexts in YAML expressions (`if`, `with`, `env` value assignments, and other workflow-level fields).
