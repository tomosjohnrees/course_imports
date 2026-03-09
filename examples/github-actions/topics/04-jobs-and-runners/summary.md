# Summary

In this topic you learned the core building blocks for structuring GitHub Actions workflows:

- **Jobs** are the top-level units of work. Each job gets a unique ID and runs on its own runner instance.
- **GitHub-hosted runners** (`ubuntu-latest`, `windows-latest`, `macos-latest`) provide managed environments with pre-installed tools. Use `ubuntu-latest` as your default unless you have platform-specific needs.
- **Self-hosted runners** give you full control over the execution environment, which is useful for specialised hardware, private network access, or cost optimisation at scale.
- **The `needs` keyword** creates dependencies between jobs, letting you build sequential pipelines and fan-out/fan-in patterns.
- **Parallel execution** is the default. Use `needs` only when a job truly depends on another.
- **Job outputs** let you pass small values between jobs. For larger files, use the artifact upload/download actions.

In the next topic, you will dive deeper into **steps and actions** -- the individual units of work within each job.
