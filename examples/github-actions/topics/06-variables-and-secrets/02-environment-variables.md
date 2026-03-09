# Environment Variables

Environment variables in GitHub Actions work the same way as environment variables in any shell session. You define a name-value pair, and any `run` step can read it via `$VARIABLE_NAME` (Linux/macOS) or `$env:VARIABLE_NAME` (Windows PowerShell).

What makes GitHub Actions environment variables powerful is that you can define them at three different scopes: **workflow**, **job**, and **step**. A variable defined at a narrower scope overrides one with the same name at a broader scope.

## Workflow-Level `env`

Variables declared under the top-level `env` key are available to every job and every step in the workflow.

## Job-Level `env`

Variables declared under a job's `env` key are available only to steps within that job. They override workflow-level variables of the same name.

## Step-Level `env`

Variables declared under a step's `env` key are available only to that single step. They override both job-level and workflow-level variables of the same name.

## Scoping in Practice

When you set the same variable name at multiple levels, the narrowest scope wins. This lets you set sensible defaults at the workflow level and override them where needed. For example, you might set `NODE_ENV: production` at the workflow level but override it with `NODE_ENV: test` in your test job.
