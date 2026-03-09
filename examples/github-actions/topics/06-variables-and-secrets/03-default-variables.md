# Default Environment Variables

GitHub automatically sets a number of environment variables for every workflow run. You do not need to declare them -- they are always available in your `run` steps.

Here are the most commonly used ones:

| Variable | Description |
|---|---|
| `GITHUB_SHA` | The commit SHA that triggered the workflow. |
| `GITHUB_REF` | The full git ref (e.g., `refs/heads/main` or `refs/pull/42/merge`). |
| `GITHUB_REF_NAME` | The short ref name (e.g., `main` or `42/merge`). |
| `GITHUB_REPOSITORY` | The owner and repository name (e.g., `octocat/my-repo`). |
| `GITHUB_ACTOR` | The username of the person or app that triggered the workflow. |
| `GITHUB_EVENT_NAME` | The name of the event that triggered the workflow (e.g., `push`). |
| `GITHUB_WORKSPACE` | The default working directory on the runner where `actions/checkout` places your code. |
| `GITHUB_RUN_ID` | A unique number for each workflow run, useful for generating unique artifact names. |
| `GITHUB_RUN_NUMBER` | A sequential number for each run of a particular workflow, incremented with each re-run. |
| `RUNNER_OS` | The operating system of the runner (`Linux`, `Windows`, or `macOS`). |

These variables are useful for tagging builds, constructing URLs, conditional logic, and debugging.
