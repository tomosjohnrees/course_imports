# Expression Syntax

Expressions in GitHub Actions are wrapped in the `${{ }}` delimiter. Everything between the double braces is evaluated at runtime before the workflow step executes.

You have already seen simple expressions in earlier topics — for example, referencing a secret with `${{ secrets.MY_TOKEN }}` or a variable with `${{ vars.ENVIRONMENT }}`. But expressions can do far more than read values. They can compare, combine, call functions, and compute results.

## Where Can You Use Expressions?

Expressions are valid in most workflow YAML fields, including:

- **`if` conditionals** on jobs and steps
- **`env`** values
- **`with`** inputs to actions
- **`run`** commands (within the string)
- Job and step **`name`** fields
- **`continue-on-error`** values

There is one important difference in `if` conditionals: GitHub Actions automatically wraps the value in `${{ }}`, so you can write expressions there without the delimiter. Both of these are equivalent:

```yaml
if: github.ref == 'refs/heads/main'
if: ${{ github.ref == 'refs/heads/main' }}
```

Outside of `if`, you always need the explicit `${{ }}` wrapper.

## Referencing Context Values

Expressions have access to several **context objects** that provide information about the workflow run. You have encountered some of these before:

- `github` — information about the event and repository (e.g., `github.event_name`, `github.ref`, `github.actor`)
- `env` — environment variables set in the workflow
- `vars` — repository, environment, or organisation variables
- `secrets` — encrypted secrets
- `steps` — outputs and status of previous steps in the current job
- `job` — information about the currently running job
- `runner` — information about the runner executing the job
- `inputs` — inputs to a reusable workflow or manually triggered workflow
- `matrix` — the current matrix values when using a matrix strategy

You access nested properties with dot notation (`github.event.pull_request.number`) or bracket notation (`github['event']['pull_request']['number']`). Bracket notation is necessary when a property name contains special characters.
