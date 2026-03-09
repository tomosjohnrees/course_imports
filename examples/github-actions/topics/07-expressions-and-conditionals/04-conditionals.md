# The `if` Conditional

The `if` keyword is how you make jobs and steps conditional. When an `if` expression evaluates to `true`, the job or step runs. When it evaluates to `false`, it is skipped.

## Conditional Jobs

You can gate an entire job so it only runs under certain circumstances. This is common for deployment jobs that should only execute on the main branch.

## Conditional Steps

Steps within a job can also be conditional. This is useful when most of the job applies broadly, but a specific step should only run in certain situations — like uploading coverage reports only on pull requests, or posting a Slack notification only on failure.

## How `if` Evaluation Works

When GitHub Actions encounters an `if` field, it:

1. Evaluates the expression
2. Coerces the result to a boolean
3. Runs the job or step only if the result is `true`

If any context value referenced in the expression does not exist, it evaluates to an empty string (`''`), which is falsy. This means referencing an undefined output will not throw an error — it will simply cause the condition to be `false`.

## Skipped Jobs and Downstream Dependencies

When a job is skipped due to its `if` condition, any jobs that depend on it (via `needs`) are also skipped by default. This cascading skip behavior is important to understand. If you have a notification job that should always run regardless of whether the deployment job was skipped, you will need the status check functions covered in the next section.
