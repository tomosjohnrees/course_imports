# Summary

This topic covered the full range of ways to manage configuration and sensitive data in GitHub Actions:

- **Environment variables** (`env`) can be set at workflow, job, or step level, with narrower scopes overriding broader ones.
- **Default environment variables** like `GITHUB_SHA`, `GITHUB_REF`, and `RUNNER_OS` are automatically available in every run.
- **Contexts** (`github`, `env`, `vars`, `secrets`, `steps`, `job`, `runner`) provide structured data accessible through `${{ }}` expressions.
- **Repository secrets** store encrypted values that are automatically masked in logs and accessed via `${{ secrets.NAME }}`.
- **Repository variables** store non-sensitive configuration accessed via `${{ vars.NAME }}`.
- **Safe secret usage** means passing secrets through environment variables, avoiding direct interpolation in shell commands, and being aware of fork security.
- **GITHUB_TOKEN** is an automatic, per-run token for interacting with the repository's GitHub API, and its permissions should be explicitly scoped to the minimum needed.

In the next topic, you will learn how to use **expressions and conditionals** to make your workflows dynamic -- running steps only when certain conditions are met, computing values on the fly, and building more sophisticated automation logic.
